import {
  Injectable,
  NotFoundException,
  BadRequestException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Order } from '../schemas/order.schema'
import { MenuItem } from '../schemas/menu.schema'
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto'
import { log } from 'console'

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(MenuItem.name) private menuItemModel: Model<MenuItem>
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto): Promise<Order> {
    let totalAmount = 0
    const orderItems: { menuItem: string; quantity: number }[] = []

    for (const item of createOrderDto.items) {
      const menuItem = await this.menuItemModel.findById(item.menuItemId)
      if (!menuItem || !menuItem.availability) {
        throw new BadRequestException(
          `Menu item ${item.menuItemId} is not available`
        )
      }
      totalAmount += menuItem.price * item.quantity
      orderItems.push({
        menuItem: item.menuItemId,
        quantity: item.quantity
      })
    }

    const order = new this.orderModel({
      userId,
      items: orderItems,
      totalAmount
    })

    return order.save()
  }

  async findUserOrders(userId: string, role: string): Promise<Order[]> {
    const roleBased: { userId?: string } = {}
    if (role == 'user') {
      roleBased.userId = userId
    }
    return this.orderModel
      .find(roleBased)
      .populate({ path: 'userId', select: 'username' })
      .populate({
        path: 'items.menuItem',
        model: 'MenuItem'
      })
      .exec()
  }

  async updateStatus(
    orderId: string,
    updateOrderStatusDto: UpdateOrderStatusDto
  ): Promise<Order> {
    const order = await this.orderModel
      .findByIdAndUpdate(
        orderId,
        { status: updateOrderStatusDto.status },
        { new: true }
      )
      .exec()

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`)
    }

    return order
  }

  async deleteOrder(orderId: string): Promise<void> {
    const order = await this.orderModel.findByIdAndDelete(orderId).exec()
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`)
    }
  }
}

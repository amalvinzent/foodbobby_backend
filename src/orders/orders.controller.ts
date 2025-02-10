import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
  Delete
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { OrdersService } from './orders.service'
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto'
import { GetUser } from '../auth/decorators/get-user.decorator'
import { Order } from '../schemas/order.schema'
import { ResponseDto } from '../common/dto/response.dto'
import { UserRole } from 'src/common/enums/user-role.enum'

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  async create(
    @GetUser('userId') userId: string,
    @Body() createOrderDto: CreateOrderDto
  ): Promise<ResponseDto<Order>> {
    try {
      const order = await this.ordersService.create(userId, createOrderDto)
      return ResponseDto.success(order, 'Order created successfully')
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create order',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get()
  async findUserOrders(
    @GetUser('userId') userId: string,
    @GetUser('role') role: string
  ): Promise<ResponseDto<Order[]>> {
    try {
      const orders = await this.ordersService.findUserOrders(userId, role)
      return ResponseDto.success(orders)
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch orders',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto
  ): Promise<ResponseDto<Order>> {
    try {
      const order = await this.ordersService.updateStatus(
        id,
        updateOrderStatusDto
      )
      return ResponseDto.success(order, 'Order status updated successfully')
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update order status',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteOrder(@Param('id') id: string): Promise<ResponseDto<void>> {
    try {
      const order = await this.ordersService.deleteOrder(id)
      return ResponseDto.success(order, 'Order deleted successfully')
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete order',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}

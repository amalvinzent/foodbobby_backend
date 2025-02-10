import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { MenuItem } from '../schemas/menu.schema'
import { CreateMenuItemDto, UpdateMenuItemDto } from './dto/menu.dto'

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(MenuItem.name) private menuItemModel: Model<MenuItem>
  ) {}

  async findAll(): Promise<MenuItem[]> {
    return this.menuItemModel.find().exec()
  }

  async create(createMenuItemDto: CreateMenuItemDto): Promise<MenuItem> {
    const createdMenuItem = new this.menuItemModel(createMenuItemDto)
    return createdMenuItem.save()
  }

  async update(
    id: string,
    updateMenuItemDto: UpdateMenuItemDto
  ): Promise<MenuItem> {
    const updatedMenuItem = await this.menuItemModel
      .findByIdAndUpdate(id, updateMenuItemDto, { new: true })
      .exec()

    if (!updatedMenuItem) {
      throw new NotFoundException(`Menu item with ID ${id} not found`)
    }

    return updatedMenuItem
  }

  async delete(id: string): Promise<void> {
    const result = await this.menuItemModel.findByIdAndDelete(id).exec()
    if (!result) {
      throw new NotFoundException(`Menu item with ID ${id} not found`)
    }
  }
}

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpException,
  HttpStatus
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { MenuService } from './menu.service'
import { CreateMenuItemDto, UpdateMenuItemDto } from './dto/menu.dto'
import { MenuItem } from '../schemas/menu.schema'
import { ResponseDto } from '../common/dto/response.dto'
import { UserRole } from 'src/common/enums/user-role.enum'

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAll(): Promise<ResponseDto<MenuItem[]>> {
    try {
      const items = await this.menuService.findAll()
      return ResponseDto.success(items)
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch menu items',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(
    @Body() createMenuItemDto: CreateMenuItemDto
  ): Promise<ResponseDto<MenuItem>> {
    try {
      const item = await this.menuService.create(createMenuItemDto)
      return ResponseDto.success(item, 'Menu item created successfully')
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create menu item',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async update(
    @Param('id') id: string,
    @Body() updateMenuItemDto: UpdateMenuItemDto
  ): Promise<ResponseDto<MenuItem>> {
    try {
      const item = await this.menuService.update(id, updateMenuItemDto)
      return ResponseDto.success(item, 'Menu item updated successfully')
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update menu item',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async delete(@Param('id') id: string): Promise<ResponseDto<void>> {
    try {
      const item = await this.menuService.delete(id)
      return ResponseDto.success(item, 'Menu item deleted successfully')
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete menu item',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}

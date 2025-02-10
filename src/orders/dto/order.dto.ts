import { IsArray, IsEnum, IsMongoId, IsNumber, IsString } from 'class-validator'
import { OrderStatus } from 'src/schemas/order.schema'

export class OrderItemDto {
  @IsMongoId()
  menuItemId: string

  @IsNumber()
  quantity: number
}

export class CreateOrderDto {
  @IsArray()
  items: OrderItemDto[]
}

export class UpdateOrderStatusDto {
  @IsString()
  @IsEnum(OrderStatus)
  status: OrderStatus
}

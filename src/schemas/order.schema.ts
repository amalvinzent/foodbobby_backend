import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema } from 'mongoose'
import { User } from './user.schema'
import { MenuItem } from './menu.schema'

export enum OrderStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed'
}

export class OrderItem {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'MenuItem',
    required: true
  })
  menuItem: MenuItem

  @Prop({ required: true, min: 1 })
  quantity: number
}

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: User

  @Prop({ type: [OrderItem], required: true })
  items: OrderItem[]

  @Prop({ required: true })
  totalAmount: number

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus
}

export const OrderSchema = SchemaFactory.createForClass(Order)

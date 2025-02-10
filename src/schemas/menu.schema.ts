import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema()
export class MenuItem extends Document {
  @Prop({ required: true })
  name: string

  @Prop({ type: String, required: true })
  category: string

  @Prop({ required: true })
  price: number

  @Prop({ default: true })
  availability: boolean
}

export const MenuItemSchema = SchemaFactory.createForClass(MenuItem)

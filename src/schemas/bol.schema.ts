import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDate } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type BolDocument = HydratedDocument<Bol>;

@Schema({ timestamps: true })
export class Bol {
  @Prop({ type: String, maxLength: 20, required: true, unique: true })
  code: string;

  @Prop({ type: String, maxLength: 50, required: true })
  from: string;

  @Prop({ type: String, maxLength: 255, require: true })
  address: string;

  @Prop({ type: String, maxLength: 50, default: '' })
  userName: string;

  @Prop({ type: String, maxLength: 50, default: '' })
  receivedName: string;

  @Prop({ type: String, maxLength: 12, default: '' })
  receivedPhoneNumber: string;

  @Prop({ type: String, default: '' })
  customerCode: string;

  @Prop({ type: String, default: '' })
  customerName: string;

  @Prop({ type: String, default: '' })
  customerId: string;

  @Prop({ type: Number, required: true, default: 1 })
  quantity: string;

  @Prop({ type: String, default: '' })
  path: string;

  @Prop({ type: String, default: '' })
  type: string;

  @Prop({ type: Number, default: 0 })
  weight: number;

  @Prop({ type: String, default: '', maxlength: 255 })
  description: string;

  @Prop({ type: Number, default: 1 })
  status: number;

  @Prop({ type: Date, default: new Date() })
  @IsDate()
  startDate: Date;

  @Prop({ type: Date, default: null })
  endDate: Date;

  @Prop({ type: Array, required: true })
  category: Array<any>;

  @Prop({ type: Array, default: [] })
  reason: Array<any>;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: new Date() })
  updatedAt: Date;
}

export const BolSchema = SchemaFactory.createForClass(Bol);

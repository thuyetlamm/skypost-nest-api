import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema({ timestamps: true })
export class Customer {
  @Prop({ unique: true, maxlength: 30 })
  code: string;

  @Prop({ default: '', maxlength: 100 })
  name: string;

  @Prop({ default: '', maxlength: 255 })
  address: string;

  // @Prop({ default: new Date() })
  // createdAt: Date;

  // @Prop({ default: new Date() })
  // updatedAt: Date;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

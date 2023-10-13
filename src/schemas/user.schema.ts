import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, maxlength: 30 })
  username: string;

  @Prop({ default: '' })
  avatar: string;

  @Prop({ default: '', maxlength: 255 })
  address: string;

  @Prop({ maxlength: 50, required: true, unique: true })
  email: string;

  @Prop({ default: 1 })
  type: number;

  @Prop({ default: 1 })
  status: number;

  @Prop({ required: true })
  password: string;

  @Prop({ maxlength: 50 })
  fullname: string;

  @Prop()
  role: string;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: new Date() })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

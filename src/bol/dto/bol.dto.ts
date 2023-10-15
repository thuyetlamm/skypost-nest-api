import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  Matches,
} from 'class-validator';
import { BaseDto } from 'src/common/base.dto';
import { Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';
import { REGEX_CODE_BOL } from 'src/regex/bol';
import { Optional } from '@nestjs/common';
import { Category } from 'src/types/bol.interface';

export class BolDto extends BaseDto {
  @IsNotEmpty({ message: 'Code is required' })
  @Transform(({ value }) => value?.toUpperCase())
  @Matches(REGEX_CODE_BOL, { message: 'Code not true format' })
  @Expose()
  code: string;

  @IsNotEmpty({ message: 'From is required' })
  @Expose()
  from: string;

  @IsNotEmpty({ message: 'Status is required' })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Expose()
  status: number;

  @IsNotEmpty({ message: 'Quantity is required' })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Expose()
  quantity: number;

  @IsNotEmpty({ message: 'Status is required' })
  @Expose()
  customerId: ObjectId;

  @IsNotEmpty({ message: 'Date is required' })
  @Expose()
  startDate: Date;

  @Expose()
  endDate: Date | null;

  @Expose()
  @IsNotEmpty({ message: 'Address is required' })
  address: string;

  @IsArray({ message: 'Category is Malformed' })
  @ArrayNotEmpty({ message: 'Categories is required' })
  @Expose()
  category: Array<Category>;

  /// not required

  @Expose()
  receivedName: string;
  @Expose()
  receivedPhoneNumber: string;

  @Expose()
  customerCode: string;
  @Expose()
  customerName: string;
  @Expose()
  type: number;
  @Expose()
  weight: number;

  @Expose()
  description: string;

  @Expose()
  reason: Array<any>;
  @Expose()
  path: string;

  @Optional()
  @Expose()
  userName: string;
}

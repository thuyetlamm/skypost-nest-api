import { IsInt, IsNotEmpty, Matches } from 'class-validator';
import { BaseDto } from 'src/common/base.dto';
import { Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';
import { REGEX_CODE_BOL } from 'src/regex/bol';

export class BolDto extends BaseDto {
  @Expose()
  _id: ObjectId;

  @IsNotEmpty({ message: 'Username is required' })
  @Transform(({ value }) => value.toUpperCase())
  @Matches(REGEX_CODE_BOL, { message: 'Code not true format' })
  @Expose()
  code: string;

  @IsNotEmpty({ message: 'From is required' })
  @Expose()
  from: string;

  @IsInt()
  @IsNotEmpty({ message: 'Status is required' })
  @Expose()
  status: number;

  @IsInt()
  @IsNotEmpty({ message: 'Quantity is required' })
  @Expose()
  quantity: number;

  @IsNotEmpty({ message: 'Status is required' })
  @Expose()
  customerId: string;

  @IsNotEmpty({ message: 'Date is required' })
  @Expose()
  startDate: Date;

  @Expose()
  @IsNotEmpty({ message: 'Address is required' })
  address: string;

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
  endDate: Date;

  @Expose()
  category: Array<any>;
  @Expose()
  reason: Array<any>;
  @Expose()
  path: string;
  @Expose()
  userName: string;
}

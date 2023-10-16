import { IsInt, IsNotEmpty, Matches, ValidateIf } from 'class-validator';
import { BaseDto } from 'src/common/base.dto';
import { Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';
import { REGEX_CODE_BOL } from 'src/regex/bol';
import { Category } from 'src/types/bol.interface';

export class UpdateDto extends BaseDto {
  @IsNotEmpty({ message: 'Code is required' })
  @Transform(({ value }) => value?.toUpperCase())
  @Matches(REGEX_CODE_BOL, { message: 'Code not true format' })
  @Expose()
  code: string;

  @Expose()
  from: string;

  @IsNotEmpty({ message: 'Status is required' })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Expose()
  status: number;

  @Expose()
  quantity: number;

  @Expose()
  customerId: ObjectId;

  @Expose()
  startDate: Date;

  @Expose()
  endDate: Date | null;

  @Expose()
  address: string;

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

  @ValidateIf((o) => o.userName.length === 0)
  @IsNotEmpty({ message: 'Reason is required' })
  @Expose()
  reason: Array<any>;
  @Expose()
  path: string;

  @ValidateIf((o) => o.reason.length === 0)
  @IsNotEmpty({ message: 'Username is required' })
  @Expose()
  userName: string;
}

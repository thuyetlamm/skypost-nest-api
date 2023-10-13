import { IsNotEmpty } from 'class-validator';
import { BaseDto } from 'src/common/base.dto';
import { Expose } from 'class-transformer';
import { ObjectId } from 'mongoose';

export class CustomerDto extends BaseDto {
  @Expose()
  _id: ObjectId;

  @IsNotEmpty({ message: 'Code is required' })
  @Expose()
  code: string;

  @IsNotEmpty({ message: 'Name is required' })
  @Expose()
  name: string;

  @Expose()
  address: string;
}

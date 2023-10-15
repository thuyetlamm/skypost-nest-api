import { Expose, Transform, plainToClass } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { ObjectId } from 'mongoose';

export abstract class BaseDto {
  @IsOptional()
  @Transform(({ obj }) => String(obj._id)) // handle transform new ObjectId when return
  @Expose()
  _id: ObjectId;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  static plainToClassInstance<T>(this: new (...arg: any[]) => T, obj: T): T {
    return plainToClass(this, obj, { excludeExtraneousValues: true });
  }
}

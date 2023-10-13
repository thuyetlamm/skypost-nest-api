import { Expose, plainToClass } from 'class-transformer';
import { IsMongoId, IsOptional } from 'class-validator';
import { ObjectId } from 'mongoose';

export abstract class BaseDto {
  @IsMongoId()
  @IsOptional()
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

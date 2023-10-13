import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FilterQuery, Model, ObjectId, QueryOptions } from 'mongoose';

@Injectable()
export abstract class BaseService<T, TDto> {
  constructor(private readonly model: Model<T>) {}

  async createNew(data: T) {
    try {
      return await this.model.create(data);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async createMany(data: T[]) {
    try {
      return await this.model.insertMany(data);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteOne(filter?: FilterQuery<T>, options?: QueryOptions<T>) {
    try {
      return await this.model.deleteOne(filter, options);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteMany(ids: ObjectId[]) {
    try {
      return await this.model.deleteMany({ _id: { $in: ids } });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(payload: TDto | any) {
    try {
      const updatedPayload = await this.model.findOneAndUpdate(
        { _id: payload._id },
        { $set: payload }
      );
      return updatedPayload;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(
    conditions: Partial<Record<keyof T, unknown>>,
    projection: string | Record<string, unknown> = {},
    options: Record<string, unknown> = {}
  ) {
    try {
      return await this.model.findOne(
        conditions as FilterQuery<T>,
        projection,
        options
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(query?: FilterQuery<T>) {
    try {
      return await this.model.find({ ...query });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}

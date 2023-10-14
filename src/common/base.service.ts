import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  FilterQuery,
  Model,
  ObjectId,
  QueryOptions,
  isValidObjectId,
} from 'mongoose';
import { BaseDto } from './base.dto';

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
      const data = await this.model.deleteOne(filter, options);
      return data.deletedCount;
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

  async update(payload: TDto & BaseDto) {
    try {
      this.validateObjectId(payload._id);

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

  async findById(id: ObjectId) {
    try {
      this.validateObjectId(id);
      return await this.model.findOne({ _id: id });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(query?: FilterQuery<T>, limit: number = 20, page: number = 1) {
    try {
      const data = await this.model
        .find(query)
        .limit(+limit)
        .skip(+limit * (+page - 1));
      return {
        data,
        meta: {
          pagination: {
            limit,
            page,
            totalPages: Math.ceil(data.length / +limit),
            total: data.length,
          },
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  validateObjectId(id: ObjectId) {
    const isValid = isValidObjectId(id);
    if (!isValid) {
      throw new Error('Invalid data');
    }
  }
}

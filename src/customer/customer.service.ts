import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Customer } from 'src/schemas/customer.schema';
import { CustomerDto } from './customer.dto';
import { BaseService } from 'src/common/base.service';

@Injectable()
export class CustomerService extends BaseService<Customer, CustomerDto> {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>
  ) {
    super(customerModel);
  }

  ///----------------------------------------------------------------
  async getAllCustomers() {
    const customers = await this.getAll({});
    return customers;
  }
  ///----------------------------------------------------------------
  async create(customer: CustomerDto) {
    try {
      return await this.createNew(customer);
    } catch (error) {
      throw new Error(error.message);
    }
  }
  ///----------------------------------------------------------------
  async delete(id: ObjectId) {
    try {
      this.validateObjectId(id);

      const deletedCustomer = await this.deleteOne({ _id: id });
      return deletedCustomer;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

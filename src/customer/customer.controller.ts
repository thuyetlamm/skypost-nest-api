import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Response } from 'express';
import { CustomerDto } from './customer.dto';
import { ObjectId } from 'mongoose';

@Controller()
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  ///----------------------------------------------------------------
  @Get('customers')
  async getAllCustomer(@Res() response: Response) {
    const customers = await this.customerService.getAllCustomers();
    return response.status(HttpStatus.OK).json({
      data: customers,
      message: 'Get all customers',
    });
  }
  ///----------------------------------------------------------------
  @Post('customer/create')
  async createCustomer(
    @Res() response: Response,
    @Body() customer: CustomerDto
  ) {
    const newCustomer = await this.customerService.create(customer);
    return response.status(HttpStatus.OK).json({
      status: 200,
      data: newCustomer,
    });
  }

  ///----------------------------------------------------------------
  @Delete('customer/delete/:id')
  async delete(@Res() response: Response, @Param('id') id: ObjectId) {
    await this.customerService.delete(id);
    return response.status(HttpStatus.OK).json({
      status: 200,
      message: 'Customer deleted successfully',
    });
  }
}

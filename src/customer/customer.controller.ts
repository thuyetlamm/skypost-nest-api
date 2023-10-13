import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Response } from 'express';

@Controller('customers')
export class CustomerController {
  constructor(private customerService: CustomerService) {}
  @Get()
  async getAllCustomer(@Res() response: Response) {
    const customers = await this.customerService.getAllCustomers();
    return response.status(HttpStatus.OK).json({
      data: customers,
      message: 'Get all customers',
    });
  }
}

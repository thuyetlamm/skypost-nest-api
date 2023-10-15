import * as XLSX from 'xlsx';
import * as moment from 'moment';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Bol } from 'src/schemas/bol.schema';
import { CATEGORY_LIST, Category } from 'src/types/bol.interface';
import { BaseService } from 'src/common/base.service';
import { BolDto } from './dto/bol.dto';
import { CustomerService } from 'src/customer/customer.service';

@Injectable()
export class BolService extends BaseService<Bol, BolDto> {
  constructor(
    @InjectModel(Bol.name) private bolModel: Model<Bol>,
    private customerService: CustomerService
  ) {
    super(bolModel);
  }

  async store(payload: BolDto): Promise<BolDto> {
    try {
      const startDate = moment(payload.startDate).format(
        'YYYY-MM-DD HH:mm'
      ) as unknown as Date;
      const currentCustomer = await this.customerService.findById(
        payload.customerId
      );

      const convertPayload = {
        ...payload,
        customerCode: currentCustomer.code,
        customerName: currentCustomer.name,
        startDate,
      };
      const bol = await this.createNew(convertPayload);
      const dataReturn = await BolDto.plainToClassInstance(bol as any);
      return dataReturn;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async upload(file: Buffer) {
    try {
      const workBook = XLSX.read(file, { cellDates: true });
      const wordSheet = workBook.Sheets[workBook.SheetNames[0]];
      const countRow = XLSX.utils.sheet_to_json(wordSheet);
      for (let index = 2; index <= countRow.length + 1; index++) {
        const code = wordSheet[`B${index}`]?.v || '';

        if (!!code) {
          const startDate = wordSheet[`A${index}`]?.v || moment().format();
          const receivedName = wordSheet[`C${index}`]?.v || '';
          const address = wordSheet[`D${index}`]?.v || '';
          const category = wordSheet[`E${index}`]?.v || '';
          const quantity = wordSheet[`F${index}`]?.v || 1;
          const convertCategoryList = category.split('+') || [];

          const categoryAfterConvertToObject = convertCategoryList?.reduce(
            (acc, category) => {
              const findCategory = CATEGORY_LIST.find((item: Category) =>
                item.code.includes(category.toUpperCase())
              );
              if (findCategory) {
                return [...acc, findCategory];
              }
              return acc;
            },
            []
          );

          const minutes = Math.ceil(Math.random() * 60);

          const payload = {
            code,
            category: categoryAfterConvertToObject,
            address,
            quantity,
            from: '2/10 Hồng Hà,p2,Tân Bình,HCM',
            path: '',
            description: '',
            receivedName,
            startDate: moment(startDate).format(`YYYY-MM-DD 12:${minutes}`),
            status: 0,
          };

          const bol = await this.bolModel.findOneAndUpdate({ code }, payload, {
            new: true,
            upsert: true,
          });
        }
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteBol(id: ObjectId | ObjectId[]) {
    try {
      this.validateObjectId(id as ObjectId);

      if (typeof id === 'string') {
        return await this.baseDeleteOne({ _id: id });
      }
      return await this.baseDeleteMany(id as ObjectId[]);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
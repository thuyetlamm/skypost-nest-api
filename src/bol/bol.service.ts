import * as XLSX from 'xlsx';
import * as moment from 'moment';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, QueryOptions } from 'mongoose';
import { Bol } from 'src/schemas/bol.schema';
import {
  BOL_STATUS_ENUM,
  BolQuery,
  CATEGORY_LIST,
  Category,
} from 'src/types/bol.interface';
import { BaseService } from 'src/common/base.service';
import { BolDto } from './dto/bol.dto';
import { CustomerService } from 'src/customer/customer.service';
import { handleRequest } from 'src/common/handleRequest';
import { UpdateDto } from './dto/update-bol.dto';
import { BaseQuery } from 'src/types/base.interface';
import { FORMAT_DATE } from 'src/utils/constants';

@Injectable()
export class BolService extends BaseService<Bol, BolDto> {
  constructor(
    @InjectModel(Bol.name) private bolModel: Model<Bol>,
    private customerService: CustomerService
  ) {
    super(bolModel);
  }

  async getAllBol(query: BolQuery & BaseQuery) {
    const {
      limit = 10,
      page = 1,
      keyword,
      status = -1,
      customerCode,
      from,
      to,
    } = query;

    // Convert params to need type
    const fromDate = from
      ? moment(from).format(FORMAT_DATE.YMD)
      : moment().subtract(1, 'days').format(FORMAT_DATE.YMD);
    const toDate = to
      ? moment(to).add(1, 'day').format(FORMAT_DATE.YMD)
      : moment().add(1, 'day').format(FORMAT_DATE.YMD);

    // QUERY OBJECTS
    const queryParams = {
      $or: [
        {
          code: { $regex: keyword || '', $options: 'i' },
        },
      ],
      createdAt: {
        $gte: fromDate,
        $lte: toDate,
      },
    } as QueryOptions;

    if (+status !== -1) {
      queryParams.status = +status;
    }

    if (customerCode) {
      queryParams.customerCode = customerCode;
    }
    const [error, bols] = await handleRequest(
      this.getAll(queryParams, limit, page)
    );

    delete queryParams['status'];

    const totalBol = await this.bolModel.countDocuments(queryParams);
    const totalNew = await this.bolModel.countDocuments({
      ...queryParams,
      status: BOL_STATUS_ENUM.NEW,
    });
    const totalRefund = await this.bolModel.countDocuments({
      ...queryParams,
      status: BOL_STATUS_ENUM.REFURNING,
    });
    const totalFinish = await this.bolModel.countDocuments({
      ...queryParams,
      status: BOL_STATUS_ENUM.FINISHED,
    });
    const totalUnsuccess = await this.bolModel.countDocuments({
      ...queryParams,
      status: BOL_STATUS_ENUM.UNSCCESSFUL,
    });
    const data = {
      ...bols,
      totalBol,
      totalRefund,
      totalNew,
      totalFinish,
      totalUnsuccess,
    };
    return [error, data];
  }

  async store(payload: BolDto): Promise<[string, BolDto | undefined]> {
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
    const [error, data] = await handleRequest(this.createNew(convertPayload));

    if (error) {
      return [error, data];
    }

    const dataReturn = await BolDto.plainToClassInstance(data as any);
    return [error, dataReturn];
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
            (acc: Category[], category: string) => {
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

          await this.bolModel.findOneAndUpdate({ code }, payload, {
            new: true,
            upsert: true,
          });
        }
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // =================================================================
  async updateBol(payload: BolDto) {
    const [error, data] = await handleRequest(this.update(payload));
    return [error, data];
  }

  // =================================================================
  async updateEndPoint(payload: UpdateDto) {
    const convertPayload = {
      userName: payload.userName || '',
      status: payload.status,
      reason: payload.reason ?? [],
      endDate: moment().format('YYYY-MM-DD HH:mm:ss'),
    };
    console.log(convertPayload);
    const [error, data] = await handleRequest(
      this.bolModel.findOneAndUpdate(
        { code: payload.code },
        { $set: convertPayload }
      )
    );
    return [error, data];
  }
  // =================================================================
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

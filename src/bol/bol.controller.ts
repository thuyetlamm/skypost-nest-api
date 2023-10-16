import {
  Body,
  Controller,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ObjectId } from 'mongoose';
import { BolService } from './bol.service';
import { BolDto } from './dto/bol.dto';
import { handleRequest } from 'src/common/handleRequest';
import { UpdateDto } from './dto/update-bol.dto';
import { BaseQuery } from 'src/types/base.interface';
import { BolQuery } from 'src/types/bol.interface';

@Controller()
export class BolController {
  constructor(private readonly bolService: BolService) {}

  @Get('bols')
  async getList(@Query() query: BaseQuery & BolQuery, @Res() res: Response) {
    const [error, data] = await this.bolService.getAllBol(query);
    if (error) {
      return this.bolService.handleReposonse(res, 'error', {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Get Bol Fail',
      });
    }
    return this.bolService.handleReposonse(res, 'success', {
      status: HttpStatus.OK,
      message: 'Get Bol Successfully',
      ...data,
    });
  }

  @Post('bol/create')
  async addNew(@Body() payload: BolDto, @Res() res: Response) {
    const [error, data] = await this.bolService.store(payload);
    if (error) {
      return this.bolService.handleReposonse(res, 'error', {
        message: error,
      });
    }
    return this.bolService.handleReposonse(res, 'success', {
      status: HttpStatus.CREATED,
      message: 'Created Bol Successfully',
      data,
    });
  }
  @Post('bol/import')
  @UseInterceptors(FileInterceptor('file'))
  // @ApiConsumes('multipart/form-data')
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }),
          // new FileTypeValidator({ fileType: 'xlsx' }),
        ],
      })
    )
    file: Express.Multer.File,
    @Res() res: Response
  ) {
    await this.bolService.upload(file.buffer);
    return this.bolService.handleReposonse(res, 'success', {
      status: HttpStatus.CREATED,
      message: 'Created Bol Successfully',
    });
  }

  @Put('/bol/update/:id')
  async update(
    @Body() payload: BolDto,
    @Param('id') id: ObjectId,
    @Res() res: Response
  ) {
    const [error, data] = await this.bolService.updateBol({
      ...payload,
      _id: id,
    });
    if (error) {
      return this.bolService.handleReposonse(res, 'error', {
        message: error,
      });
    }
    return this.bolService.handleReposonse(res, 'success', {
      status: HttpStatus.CREATED,
      message: 'Updated Bol Successfully',
      data,
    });
  }

  @Patch('/bol/endpoint/update')
  async updateEndpoint(@Body() payload: UpdateDto, @Res() res: Response) {
    const [error, data] = await this.bolService.updateEndPoint(payload);
    if (error) {
      return this.bolService.handleReposonse(res, 'error', {
        message: typeof error === 'boolean' ? 'Not found code' : error,
      });
    }
    return this.bolService.handleReposonse(res, 'success', {
      status: HttpStatus.CREATED,
      message: 'Updated Bol Successfully',
      data,
    });
  }
  @Post('bol/delete')
  async destroy(
    @Body('id') id: ObjectId | ObjectId[],
    @Res() response: Response
  ) {
    const [error, data] = await handleRequest(this.bolService.deleteBol(id));
    if (error || !data) {
      return response.status(HttpStatus.NOT_FOUND).json({
        status: HttpStatus.NOT_FOUND,
        message: 'Bol could not be found',
      });
    }
    return response.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: 'Bol is successfully deleted',
    });
  }
}

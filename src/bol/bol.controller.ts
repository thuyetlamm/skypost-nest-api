import {
  Body,
  Controller,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ObjectId } from 'mongoose';
import { BolService } from './bol.service';
import { BolDto } from './dto/bol.dto';

@Controller()
export class BolController {
  constructor(private readonly bolService: BolService) {}

  @Post('bol/create')
  async addNew(@Body() payload: BolDto, @Res() res: Response) {
    try {
      const data = await this.bolService.store(payload);
      return this.bolService.handleReposonse(res, 'success', {
        status: HttpStatus.CREATED,
        message: 'Created Bol Successfully',
        data,
      });
    } catch (error) {
      return this.bolService.handleReposonse(res, 'error', {
        message: error.message,
      });
    }
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
  @Post('bol/delete')
  async destroy(
    @Body('id') id: ObjectId | ObjectId[],
    @Res() response: Response
  ) {
    const res = await this.bolService.deleteBol(id);
    if (!res) {
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

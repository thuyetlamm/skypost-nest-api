import {
  Controller,
  FileTypeValidator,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  ParseFilePipeBuilder,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BolService } from './bol.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller()
export class BolController {
  constructor(private readonly bolService: BolService) {}
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
    return res.status(HttpStatus.CREATED).json({
      error: 0,
      message: 'Import bols successfully',
    });
  }
}

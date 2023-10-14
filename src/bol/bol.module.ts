import { Module } from '@nestjs/common';
import { BolService } from './bol.service';
import { BolController } from './bol.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Bol, BolSchema } from 'src/schemas/bol.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Bol.name, schema: BolSchema }])],
  exports: [MongooseModule.forFeature([{ name: Bol.name, schema: BolSchema }])],
  controllers: [BolController],
  providers: [BolService],
})
export class BolModule {}

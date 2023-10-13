import { Global, Module } from '@nestjs/common';
import { MongoDbService } from './mongo-db.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  providers: [MongoDbService],
  exports: [MongoDbService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: configService.get('DATABASE_NAME'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class MongoDbModule {}

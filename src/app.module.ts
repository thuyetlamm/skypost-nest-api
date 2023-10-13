import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { ConfigModule } from '@nestjs/config';
import { MongoDbModule } from './mongo-db/mongo-db.module';
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongoDbModule,
    UserModule,
    AuthModule,
    CustomerModule,
  ],
  providers: [
    {
      provide: 'APP_USER',
      useClass: UserService,
    },
  ],
})
export class AppModule {}

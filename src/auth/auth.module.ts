import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from 'src/strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongoDbService } from 'src/mongo-db/mongo-db.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { AuthGuard } from './auth.guard';

@Module({
  providers: [AuthService, JwtStrategy, MongoDbService, AuthGuard],
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
})
export class AuthModule {}

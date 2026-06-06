import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StoresModule } from './stores/stores.module';
import { RatingsModule } from './ratings/ratings.module';
import { AppController } from './app.controller';
import { UsersService } from './users/users.service';
import { StoresService } from './stores/stores.service';
import { RatingsService } from './ratings/ratings.service';
import { User } from './users/user.entity';
import { Store } from './stores/store.entity';
import { Rating } from './ratings/rating.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
     port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Store, Rating]),
    AuthModule,
    UsersModule,
    StoresModule,
    RatingsModule,
  ],
  controllers: [AppController],
  providers: [UsersService, StoresService, RatingsService],
})
export class AppModule {}
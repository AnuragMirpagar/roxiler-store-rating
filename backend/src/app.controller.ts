import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { Roles } from './auth/roles.decorator';
import { UsersService } from './users/users.service';
import { StoresService } from './stores/stores.service';
import { RatingsService } from './ratings/ratings.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AppController {
  constructor(
    private usersService: UsersService,
    private storesService: StoresService,
    private ratingsService: RatingsService,
  ) {}

  @Get('stats')
  async getStats() {
    const [users, stores, ratings] = await Promise.all([
      this.usersService.countAll(),
      this.storesService.countAll(),
      this.ratingsService.countAll(),
    ]);
    return { users, stores, ratings };
  }
}
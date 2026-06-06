import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ratings')
@UseGuards(JwtAuthGuard)
export class RatingsController {
  constructor(private ratingsService: RatingsService) {}

  @Post()
  submitRating(@Request() req, @Body() body: { storeId: number; value: number }) {
    return this.ratingsService.submitRating(req.user.id, body.storeId, body.value);
  }
}
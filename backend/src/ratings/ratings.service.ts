import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './rating.entity';

@Injectable()
export class RatingsService {
  constructor(@InjectRepository(Rating) private repo: Repository<Rating>) {}

  async submitRating(userId: number, storeId: number, value: number) {
    const existing = await this.repo.findOne({ where: { userId, storeId } });
    if (existing) {
      existing.value = value;
      return this.repo.save(existing);
    }
    const rating = this.repo.create({ userId, storeId, value });
    return this.repo.save(rating);
  }

  getUserRatingForStore(userId: number, storeId: number) {
    return this.repo.findOne({ where: { userId, storeId } });
  }

  countAll() {
    return this.repo.count();
  }
}
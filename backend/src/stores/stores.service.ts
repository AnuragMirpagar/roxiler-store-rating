import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Store } from './store.entity';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private repo: Repository<Store>,
  ) {}

  create(data: Partial<Store>) {
    const store = this.repo.create(data);
    return this.repo.save(store);
  }

  findAll(query: any) {
    const where: any = {};

    if (query.name) {
      where.name = Like(`%${query.name}%`);
    }

    if (query.address) {
      where.address = Like(`%${query.address}%`);
    }

    return this.repo.find({
      where,
      relations: {
        ratings: true,
        owner: true,
      },
      order: {
        name: query.sort || 'ASC',
      },
    });
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: {
        ratings: {
          user: true,
        },
      },
    });
  }

  findByOwner(ownerId: number) {
    return this.repo.findOne({
      where: { ownerId },
      relations: {
        ratings: {
          user: true,
        },
      },
    });
  }

  countAll() {
    return this.repo.count();
  }
}
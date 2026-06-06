import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(data: Partial<User>) {
    const exists = await this.repo.findOne({ where: { email: data.email } });
    if (exists) throw new ConflictException('Email already exists');
   data.password = await bcrypt.hash(data.password!, 10);
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async findAll(query: any) {
    const where: any = {};
    if (query.name) where.name = Like(`%${query.name}%`);
    if (query.email) where.email = Like(`%${query.email}%`);
    if (query.address) where.address = Like(`%${query.address}%`);
    if (query.role) where.role = query.role;
    return this.repo.find({ where, order: { name: query.sort || 'ASC' } });
  }

  async updatePassword(id: number, newPassword: string) {
    const hashed = await bcrypt.hash(newPassword, 10);
    await this.repo.update(id, { password: hashed });
    return { message: 'Password updated' };
  }

  async countAll() {
    return this.repo.count();
  }
}
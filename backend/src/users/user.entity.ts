import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Rating } from '../ratings/rating.entity';

export type UserRole = 'admin' | 'user' | 'store_owner';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 60 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ length: 400 })
  address: string;

  @Column({ type: 'enum', enum: ['admin', 'user', 'store_owner'], default: 'user' })
  role: UserRole;

  @OneToMany(() => Rating, rating => rating.user)
  ratings: Rating[];

  @CreateDateColumn()
  createdAt: Date;
}
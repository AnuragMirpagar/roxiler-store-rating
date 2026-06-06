import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn } from 'typeorm';
import { Rating } from '../ratings/rating.entity';
import { User } from '../users/user.entity';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 60 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 400 })
  address: string;

  @ManyToOne(() => User, { nullable: true })
  owner: User;

  @Column({ nullable: true })
  ownerId: number;

  @OneToMany(() => Rating, rating => rating.store)
  ratings: Rating[];

  @CreateDateColumn()
  createdAt: Date;
}
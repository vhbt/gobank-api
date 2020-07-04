import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';

@Entity('transactions')
export default class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  from_id: string;

  @Column('uuid')
  to_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'from_id' })
  from_user: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'to_id' })
  to_user: User;

  @Column('integer')
  value: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 60, unique: true })
  email: string;

  @Column('text', { nullable: false })
  password: string;

  @Column('varchar', { length: 60, nullable: true })
  fullName: string;

  @Column('varchar', { length: 13, default: 'USER' })
  role: string;

  @Column('boolean', { default: true })
  isActive: boolean;
}

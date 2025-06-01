import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class WeddingApplication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 10 })
  phone: string;

  @Column({ length: 100 })
  email: string;

  @Column({ length: 500 })
  song: string;
}

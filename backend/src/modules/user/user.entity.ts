import { UserRole } from '../../types/enums/user-role';
import { GenericEntity } from '../../constants/entities/generic-entity';
import { Entity, Column } from 'typeorm';

@Entity()
export class User extends GenericEntity {
  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ length: 100, nullable: true })
  surname?: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.REVIEWER,
  })
  role: UserRole;

  @Column()
  password: string;
}

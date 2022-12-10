import { User } from '@shared';
import { BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

interface GetByUsernameParams {
  username: string;
}
interface GetBySubParams {
  sub: string;
}
interface CreateUserParams {
  username: string;
  sub: string;
}
@Entity()
export class Users extends BaseEntity implements User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Index()
  @Column({ unique: true, nullable: false })
  sub: string;

  @Column({ length: 16, unique: true, nullable: false })
  username: string;

  public static async getByUsername({ username }: GetByUsernameParams) {
    const userRepo = this.getRepository();
    return userRepo.findOne({ where: { username } });
  }

  public static async getBySub({ sub }: GetBySubParams) {
    const userRepo = this.getRepository();
    return userRepo.findOne({ where: { sub } });
  }

  public static async createUser({ username, sub }: CreateUserParams) {
    const userRepo = this.getRepository();
    return userRepo.save(userRepo.create({ username, sub }));
  }
}

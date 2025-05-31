import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '@modules/user/user.entity';
import { UserSeed, encryptPassword } from '@database/seeds/user-seed';
import { SeedApplicator } from '@modules/seed-applier/seed-applicator.entity';

@Injectable()
export class TasksOnBootstrap implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(SeedApplicator)
    private seedApplicatorRepository: Repository<SeedApplicator>,
  ) {}

  seedsToApply = new Map([['initial-admin-users', this.insertAdminUsers]]);

  async onApplicationBootstrap() {
    try {
      const seedsApplied = await this.seedApplicatorRepository.find();
      const seedsAppliedMap = new Map(
        seedsApplied.map((seed) => [seed.name, seed]),
      );
      for (const [seedName, seedFunction] of this.seedsToApply) {
        if (!seedsAppliedMap.has(seedName)) {
          try {
            await seedFunction.call(this);
            await this.seedApplicatorRepository.save({
              name: seedName,
            });
            console.info(`Seed "${seedName}" applied successfully.`);
          } catch (error) {
            console.group('Seed application error');
            console.error(`Seed "${seedName}" failed to apply.`);
            console.error(error);
            console.groupEnd();
            throw error;
          }
        } else {
          console.info(`Seed "${seedName}" already applied.`);
        }
      }
    } catch (error) {
      console.log(
        'ERROR: There was an exception while executing seeds functions.',
      );
    }
  }

  async insertAdminUsers() {
    for (const user of UserSeed) {
      user.password = await encryptPassword(user.password);
    }
    await this.userRepository.save(UserSeed);
  }
}

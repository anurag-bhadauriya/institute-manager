import { User } from '@app/common-entities';
import { Injectable, Inject } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserRepository {
    private repository: Repository<User>;

    constructor(@Inject('RDS_PROVIDER') private dataSource: DataSource) {
        this.repository = this.dataSource.getRepository(User);
    }

    async findAll(): Promise<User[]> {
        return await this.repository.find();
    }

    async findOne(id: number): Promise<User | null> {
        return this.repository.findOne({ where: { id } });
    }

    async create(user: Partial<User>): Promise<User> {
        const newUser = this.repository.create(user);
        return this.repository.save(newUser);
    }

    async update(id: number, user: Partial<User>): Promise<User | null> {
        await this.repository.update(id, user);
        return this.findOne(id);
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }
}
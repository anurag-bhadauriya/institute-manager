import { User } from '@app/common-entities';
import { Injectable, Inject, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { mapError } from '../common/util';
import { LoggerUtilService } from '@app/logger-util';

@Injectable()
export class UserRepository {
    private repository: Repository<User>;
    private LOGGER_CONTEXT = 'UserRepository'

    constructor(
        @Inject('RDS_PROVIDER') private dataSource: DataSource,
        private logger: LoggerUtilService
    ) {
        this.repository = this.dataSource.getRepository(User);
    }

    async findAll(): Promise<User[]> {
        this.logger.log('Fetching List of users from repository ...', this.LOGGER_CONTEXT)
        return await this.repository.find();
    }

    async findOne(id: number): Promise<User | null> {
        const user = await this.repository.findOne({ where: { id } });
        if (user){
            console.log('KLMN')
        } else {
            throw new NotFoundException({
                message: 'User does not exist !',
            })
        }
        return user
    }

    async create(user: Partial<User>): Promise<User> {
        try{
            const newUser = this.repository.create(user);
            const savedUser =  await this.repository.save(newUser);
            return savedUser;
        } catch (error) {
            const issue = mapError(error, 'email')
            throw issue;
        }
    }

    async update(id: number, user: Partial<User>): Promise<User | null> {
        await this.repository.update(id, user);
        return this.findOne(id);
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }
}
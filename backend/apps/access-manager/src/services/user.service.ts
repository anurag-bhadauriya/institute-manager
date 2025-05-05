import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { User } from '@app/common-entities';

@Injectable()
export class UsersService {
    constructor(private userRepository: UserRepository) { }

    async findAll(): Promise<User[]> {
        return this.userRepository.findAll();
    }

    async findOne(id: number): Promise<User | null> {
        return this.userRepository.findOne(id);
    }

    async create(userData: Partial<User>): Promise<User> {
        return this.userRepository.create(userData);
    }

    async update(id: number, userData: Partial<User>): Promise<User | null> {
        return this.userRepository.update(id, userData);
    }

    async delete(id: number): Promise<void> {
        return this.userRepository.delete(id);
    }
}
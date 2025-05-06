import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { User } from '@app/common-entities';
import { CreateUserDto, UserResponseDto } from '../dtos/user.dto';
import { MapperService } from '../common/mapper.service';
import { ConnectableObservable } from 'rxjs';

@Injectable()
export class UsersService {
    constructor(
        private userRepository: UserRepository,
        private readonly mapperService: MapperService,
    ) { }

    async findAll(): Promise<UserResponseDto[]> {
        const users = await this.userRepository.findAll();
        return this.mapperService.toDtos(UserResponseDto, users)
    }

    async findOne(id: number): Promise<UserResponseDto> {
        const user = this.userRepository.findOne(id);
        return this.mapperService.toDto(UserResponseDto, user);
    }

    async create(userData: CreateUserDto): Promise<UserResponseDto> {
        const userEntity = this.mapperService.toEntity(User, userData);
        const savedUser = await this.userRepository.create(userEntity);
        return this.mapperService.toDto(UserResponseDto, savedUser);
    }

    async update(id: number, userData: Partial<User>): Promise<User | null> {
        return this.userRepository.update(id, userData);
    }

    async delete(id: number): Promise<void> {
        return this.userRepository.delete(id);
    }
}
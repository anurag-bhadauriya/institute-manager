import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { User } from '@app/common-entities';
import { CreateUserDto, UserResponseDto } from '../dtos/user.dto';
import { MapperService } from '../common/mapper.service';
import { LoggerUtilService } from '@app/logger-util';

@Injectable()
export class UsersService {
    private readonly LOG_CONTEXT = 'UsersService'
    
    constructor(
        private userRepository: UserRepository,
        private readonly mapperService: MapperService,
        private logger: LoggerUtilService
    ) {}

    async findAll(): Promise<UserResponseDto[]> {
        this.logger.log('Processing findAll users request', this.LOG_CONTEXT);
        const users = await this.userRepository.findAll();
        this.logger.debug('Users list fetched Successfully !', this.LOG_CONTEXT);
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
import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from '../services/user.service';
import { User } from '@app/common-entities';
import { CreateUserDto, UserResponseDto } from '../dtos/user.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { ResponseEntity } from '../common/util';

@Controller('user')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get()
    async findAll(): Promise<ResponseEntity<UserResponseDto[]>> {
        const users = await this.usersService.findAll();
        return {
            message: 'User Fetched Successfully !',
            data: users
        }
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<ResponseEntity<UserResponseDto>> {
        const user = await this.usersService.findOne(id);
        return {
            message: 'User Fetched Successfully !',
            data: user
        }
    }

    @Post()
    @ApiOperation({ summary: 'Create a new user' })
    @ApiBody({ type: CreateUserDto })
    async create(@Body() user: CreateUserDto): Promise<ResponseEntity<UserResponseDto>> {
        const savedUser = await this.usersService.create(user);
        return {
            message: 'User Created Successfully !',
            data: savedUser
        }
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() user: Partial<User>
    ): Promise<User | null> {
        return this.usersService.update(id, user);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<ResponseEntity<any>> {
        await this.usersService.delete(id);
        return {
            message: 'User Deleted Successfully !',
            data: {
                id: id
            }
        }
    }
}
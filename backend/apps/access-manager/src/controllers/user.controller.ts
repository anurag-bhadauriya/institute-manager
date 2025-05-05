import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from '../services/user.service';
import { User } from '@app/common-entities';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<User | null> {
        return this.usersService.findOne(id);
    }

    @Post()
    create(@Body() user: Partial<User>): Promise<User | null> {
        return this.usersService.create(user);
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() user: Partial<User>
    ): Promise<User | null> {
        return this.usersService.update(id, user);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.usersService.delete(id);
    }
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	firstname: string;

	@Column({ nullable: true })
	lastname: string;

	@Column({ unique: true })
	email: string;

	@Column({ default: true })
	isActive: boolean;

	@Column({ nullable: true })
	userGroupId: number;
}
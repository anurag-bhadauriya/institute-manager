import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsEmail, IsBoolean } from "class-validator";

export class CreateUserDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    firstname: string;

    @ApiPropertyOptional()
    @IsNotEmpty()
    @IsString()
    lastname?: string;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;
    
    @ApiPropertyOptional()
    @IsNotEmpty()
    @IsBoolean()
    isActive?: boolean
}

export class UserResponseDto {

    @ApiProperty()
    id: number;
    @ApiProperty()
    firstname: string;
    @ApiProperty()
    lastname: string;
    @ApiProperty()
    email: string;
    @ApiProperty()
    isActive: boolean

}
import { ConflictException, InternalServerErrorException } from "@nestjs/common";

export const mapError = (error, propertyName) => {
    if (error.code === "23505" && error.detail.includes('email')) {
        return new ConflictException(`Resource with property- ${propertyName} already exists !`);
    }
    return new InternalServerErrorException('Failed to create the resource !');
}

export class ResponseEntity<T>{
    message: string;
    data: T
}
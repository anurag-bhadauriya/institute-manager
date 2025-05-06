import { Injectable } from '@nestjs/common';
import { plainToInstance, ClassConstructor } from 'class-transformer';

@Injectable()
export class MapperService {
  /**
   * Maps an entity to a DTO
   * @param dto The DTO class constructor
   * @param entity The entity to map
   * @returns The mapped DTO instance
   */
  toDto<T, E>(dto: ClassConstructor<T>, entity: E): T {
    return plainToInstance(dto, entity, { excludeExtraneousValues: false });
  }

  /**
   * Maps a collection of entities to DTOs
   * @param dto The DTO class constructor
   * @param entities The collection of entities
   * @returns Array of mapped DTO instances
   */
  toDtos<T, E>(dto: ClassConstructor<T>, entities: E[]): T[] {
    return entities.map(entity => this.toDto(dto, entity));
  }

  /**
   * Maps a DTO to an entity
   * @param entity The entity class constructor
   * @param dto The DTO to map
   * @returns The mapped entity instance
   */
  toEntity<T, E>(entity: ClassConstructor<T>, dto: E): T {
    return plainToInstance(entity, dto);
  }

  /**
   * Maps a DTO to an existing entity instance
   * @param existingEntity The existing entity instance
   * @param dto The DTO containing updates
   * @returns The updated entity instance
   */
  toExistingEntity<T, E>(existingEntity: T, dto: E): T {
    const updated = { ...existingEntity, ...dto };
    return updated as T;
  }
}
import { Module } from '@nestjs/common';
import { infraModuleImports } from '@app/app-initializer';
import { UsersController } from './controllers/user.controller';
import { UsersService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { entitiesToConfigure } from './configure-entities';
import { MapperService } from './common/mapper.service';

@Module({
	imports: [
		...infraModuleImports({ 
			serviceName: 'access-manager', 
			rds: true, 
			logger: true,
			entities: [
				...entitiesToConfigure
			],
		}),
	],
	controllers: [
		UsersController,
	],
	providers: [
		UsersService,
		MapperService,
		UserRepository
	],
})

export class AccessManagerModule { }

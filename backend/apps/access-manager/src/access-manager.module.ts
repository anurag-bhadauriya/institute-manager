import { Module } from '@nestjs/common';
import { infraModuleImports } from '@app/app-initializer';
import { UsersController } from './controllers/user.controller';
import { UsersService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { entitiesToConfigure } from './configure-entities';

@Module({
	imports: [
		...infraModuleImports({ 
			serviceName: 'access-manager', 
			rds: true, 
			entities: [
				...entitiesToConfigure
			]
		}),
	],
	controllers: [
		UsersController,
	],
	providers: [
		UsersService,
		UserRepository
	],
})

export class AccessManagerModule { }

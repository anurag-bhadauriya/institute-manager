import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { infraModuleImports, RequestTrackingMiddleware } from '@app/app-initializer';
import { UsersController } from './controllers/user.controller';
import { UsersService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { entitiesToConfigure } from './configure-entities';
import { MapperService } from './common/mapper.service';
import { LoggerUtilModule } from '@app/logger-util';

@Module({
	imports: [
		...infraModuleImports({ 
			serviceName: 'access-manager', 
			rds: true,
			entities: [
				...entitiesToConfigure
			],
		}),
		LoggerUtilModule
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

export class AccessManagerModule implements NestModule{ 
	
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(RequestTrackingMiddleware).forRoutes('*')
	}
}

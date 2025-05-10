import { Module } from '@nestjs/common';
import { LoggerUtilService } from './logger-util.service';
import { ConfigModule } from '@nestjs/config';
import { AsyncContextManager } from '@app/app-initializer';

@Module({
	imports: [
		ConfigModule
	],
	providers: [
		LoggerUtilService,
		AsyncContextManager
	],
	exports: [
		LoggerUtilService,
		AsyncContextManager
	]
})
export class LoggerUtilModule {}

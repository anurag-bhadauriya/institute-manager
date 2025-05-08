import { DynamicModule, Module, Provider } from '@nestjs/common';
import { LoggerModuleAsyncOptions, LoggerUtilService } from './logger-util.service';

@Module({
	// providers: [LoggerUtilService],
	// exports: [LoggerUtilService],
})
export class LoggerUtilModule {

	static async forRootAsync(options: LoggerModuleAsyncOptions): Promise<DynamicModule> {

		const loggerProvider: Provider = {
			provide: 'LOGGER_PROVIDER',
			inject: [...(options.inject || [])],
			useFactory: async (...args: unknown[]) => {
				const config = await options.useFactory(...args)
				const logger = new LoggerUtilService();
				if (config) {
					logger.setConfig(config);
				}
				return logger;
			},
		}

		return {
			module: LoggerUtilModule,
			imports: [...(options.imports || [])],
			providers: [loggerProvider],
			exports: [loggerProvider],
			global: true
		}
	}
}

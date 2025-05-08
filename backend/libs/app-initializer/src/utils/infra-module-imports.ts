import { ConfigModule, ConfigService } from "@nestjs/config";
import { RdsModule } from "../services/rds.module";
import { LoggerUtilModule } from "@app/logger-util";

export interface InfraImportOptions {
    serviceName: string;
    rds?: boolean;
    logger?: boolean;
    envFilePath?: string;
    entities?: any[];
}

function getEnvPath(serviceName: string, envFilePath?: string){
    if(envFilePath){
        return envFilePath;
    }
    const env = process.env.ENV_NAME
    return env === 'local' ? `./apps/${serviceName}/.env.${env}` : `./.env.${env}`;
}

export function infraModuleImports(options: InfraImportOptions) {
    const {
        serviceName,
        rds = true,
        logger = true,
        envFilePath,
        entities = []
    } = options;

    const imports = [
        ConfigModule.forRoot({
            envFilePath: getEnvPath(serviceName, envFilePath),
            isGlobal: true
        })
    ]

    /** Adding the rds module dynamically */
    if(rds) {
        imports.push(
            RdsModule.forRootAsync({
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (configService: ConfigService) => {
                    return {
                        type: 'postgres',
                        host: configService.get<string>('DB_HOST'),
                        port: configService.get<number>('DB_PORT'),
                        username: configService.get<string>('DB_USER'),
                        password: configService.get<string>('DB_PASSWORD'),
                        database: configService.get<string>('DB_NAME'),
                        entities: entities,
                        synchronize: false,
                    }
                }
            })
        );
    }
    
    /** Adding the custom logger module dynamically */
    if(logger) {
        imports.push(
            LoggerUtilModule.forRootAsync({
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (configService: ConfigService) => {
                    return {
                        enableAsyncLogging: configService.get<boolean>('ENABLE_ASYNC_LOGS'),
                        lokiUrl: configService.get<string>('LOKI_URL'),
                        application: configService.get<string>('APP_NAME'),
                        environment: configService.get<string>('ENV_NAME')
                    }
                }
            })
        )
    }
    return imports;
}
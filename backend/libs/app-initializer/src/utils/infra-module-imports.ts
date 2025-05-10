import { ConfigModule, ConfigService } from "@nestjs/config";
import { RdsModule } from "../services/rds.module";

export interface InfraImportOptions {
    serviceName: string;
    rds?: boolean;
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
    return imports;
}
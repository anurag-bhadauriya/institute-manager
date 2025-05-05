import { DynamicModule, Module, Provider, Type } from "@nestjs/common";
import { DataSource, DataSourceOptions } from "typeorm";

export interface RdsModuleOptions {
    imports?: Type<unknown>[],
    inject?: Type<unknown>[],
    useFactory: (...args: unknown[]) => Promise<DataSourceOptions> | DataSourceOptions
}

@Module({})
export class RdsModule{
    static async forRootAsync(options: RdsModuleOptions): Promise<DynamicModule> {

        let inject = [...(options.inject || [])];
        let imports = [...(options.imports || [])];

        const rdsProvider: Provider = {
            provide: 'RDS_PROVIDER',
            inject,
            useFactory: async function(...args: unknown[]): Promise<unknown>{
                try {
                    const config = await options?.useFactory(...args);
                    const dataSource = new DataSource(config);
                    await dataSource.initialize();
                    console.log('Database connected successfully');
                    return dataSource
                } catch(e){
                    console.log('Error while initializing the db connection:', e)
                }
            }
        }
        
        return {
            module: RdsModule,
            imports,
            providers: [rdsProvider],
            exports: [rdsProvider],
            global: true
        }
    }
}
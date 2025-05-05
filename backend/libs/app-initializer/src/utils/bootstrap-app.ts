import { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export interface ServiceOptions {
    title: string,
    description: string,
    version: string,
    port: number
}

export interface BootstrapAppOptions {
    service: ServiceOptions;
    module: new(...args: unknown[]) => unknown
}

export async function bootstrapAsDefaultApp(options: BootstrapAppOptions){
    const app = await NestFactory.create(options.module);
    const port = options.service.port;
    
    /** Configuring Swagger UI */
    setupSwagger(
        app,
        options.service.title,
        options.service.description,
        options.service.version
    );

    await app.listen(port);
    console.log(`Application is running on port ${port}`);
    console.log(`Swagger Docs is available at: <DOMAIN_URL>/api-docs/`)
}

/**
 * Function to configure the Swagger Documentation
 */
const setupSwagger = (app: INestApplication<any>, title: string, description: string, version: string) => {
    const config = new DocumentBuilder()
        .setTitle(title)
        .setDescription(description)
        .setVersion(version)
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
}
import { INestApplication, ValidationPipe } from "@nestjs/common";
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

    /** Adding request validators */
    setupValidationPipe(app)
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
 * Function to configure the Request validators
 */
const setupValidationPipe = (app: INestApplication<any>) => {
    app.useGlobalPipes(
        new ValidationPipe({
        whitelist: true, // Strip properties that don't have decorators
        forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
        transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
        }),
    );
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
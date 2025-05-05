import { AccessManagerModule } from './access-manager.module';
import { bootstrapAsDefaultApp } from '@app/app-initializer';

bootstrapAsDefaultApp({
    module: AccessManagerModule,
    service: {
        title: 'Access Management Service',
        port: 3000,
        description: 'IAM/RBAC/Access Management',
        version: '1.0.0'
    }
})
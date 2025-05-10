import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

interface RequestContext {
    requestId: string;
}

@Injectable()
export class AsyncContextManager {
    private readonly asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

    runWith<T>(context: RequestContext, callback: () => T): T {
        return this.asyncLocalStorage.run(context, callback);
    }

    getRequestId(): string | undefined {
        return this.asyncLocalStorage.getStore()?.requestId;
    }
}
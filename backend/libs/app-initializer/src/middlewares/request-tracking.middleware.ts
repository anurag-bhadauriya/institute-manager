import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AsyncContextManager } from '../utils/async-context-manager';

declare global {
	namespace Express {
		interface Request {
			requestId: string;
		}
	}
}

@Injectable()
export class RequestTrackingMiddleware implements NestMiddleware {
	constructor(
		private readonly asyncContext: AsyncContextManager
	) { }

	use(req: Request, res: Response, next: NextFunction) {
		const requestId = req.headers['x-request-id'] as string || uuidv4();
		req.requestId = requestId;
		this.asyncContext.runWith({ requestId }, () => {
			next();
		});
	}
}
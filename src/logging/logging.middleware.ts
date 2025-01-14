// src/logging/logging.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Log the method, URL, and body of the request
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Body: ${JSON.stringify(req.body)} - Headers: ${JSON.stringify(req.headers)}`);

    // Listen for the 'finish' event to log the status code after the response has been sent
    res.on('finish', () => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Status: ${res.statusCode}`);
    });

    next(); // Pass the request to the next middleware or route handler
  }
}

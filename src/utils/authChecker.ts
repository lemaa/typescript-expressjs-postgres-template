import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import config from '../config/env';

export function expressAuthentication(request: express.Request, securityName: string, scopes?: string[]): Promise<any> {

  if (securityName === 'Bearer') {
    const token = request.headers.authorization;

    return new Promise((resolve, reject) => {
      if (!token) {
        reject(new Error('No token provided'));
      }

      jwt.verify(token.replace('Bearer ', ''), config.jwtSecret,  (err: any, decoded: any) => {
        if (err) {
           reject(err);
        } else {
          // Check if JWT contains all required scopes
          for (const scope of scopes) {
            if (!decoded.scopes.includes(scope)) {
              reject(new Error('JWT does not contain required scope.'));
            }
          }
          resolve(decoded);
        }
      });
    });
  }
}

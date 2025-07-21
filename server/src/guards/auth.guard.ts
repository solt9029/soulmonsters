import { UserService } from '../services/user.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { GqlExecutionContext } from '@nestjs/graphql';

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_DATABASE_URL,
  FIREBASE_PRIVATE_KEY,
  MOCK_USER,
  MOCK_USER_ID,
} = process.env;

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: FIREBASE_PROJECT_ID,
    privateKey: FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: FIREBASE_CLIENT_EMAIL,
  }),
  databaseURL: FIREBASE_DATABASE_URL,
});

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = GqlExecutionContext.create(ctx).getContext().req;

    if (MOCK_USER === 'true') {
      req.user = {
        uid: MOCK_USER_ID,
      };
      return true;
    }

    try {
      req.user = await this.userService.findByIdToken(req.headers['authorization']?.toString());
    } catch (err) {
      return false;
    }

    return true;
  }
}

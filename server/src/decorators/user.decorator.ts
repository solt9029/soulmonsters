import { GqlExecutionContext } from '@nestjs/graphql';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { auth } from 'firebase-admin';

export const User = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext): Promise<auth.DecodedIdToken> => {
    const req = GqlExecutionContext.create(ctx).getContext().req;
    return req.user;
  },
);

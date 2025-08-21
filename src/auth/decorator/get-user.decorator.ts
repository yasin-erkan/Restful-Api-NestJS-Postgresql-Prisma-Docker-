import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    // get request object for the api request
    const request = ctx.switchToHttp().getRequest();

    // if data is provided, return the data from the user object
    if (data) {
      return request.user[data];
    }

    // if data is not provided, return the user object
    return request.user;
  },
);

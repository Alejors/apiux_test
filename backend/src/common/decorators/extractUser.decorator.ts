import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';

export const ExtractUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;

    if (!userId || isNaN(userId)) {
      throw new BadRequestException('Missing User Info');
    }

    return userId;
  },
);

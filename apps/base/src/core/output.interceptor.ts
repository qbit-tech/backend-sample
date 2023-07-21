import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { map } from "rxjs";

export class OutputInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    // const payload = await next.handle().pipe(map(data => ({ data })));
    // return {
    //   code: 'success',
    //   message: '',
    //   payload
    // }
    return next.handle().pipe(
      map((payload) => ({
        code: 'success',
        message: '',
        payload,
      }))
    ) 
  }
}


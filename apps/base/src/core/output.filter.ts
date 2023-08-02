import { ArgumentsHost, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Response } from 'express';
import { QueryFailedError } from "typeorm";

export class OutputExceptionFilter implements ExceptionFilter {
  async catch(ex: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    Logger.error(
      'real ex: ' + JSON.stringify(ex),
      'OutputExceptionFilter',
    );

    // console.log((ex as any).code)
    
    let status = 500;
    let errorResponse = {
      // statusCode: 500,
      code: 'err_general',
      message: 'Please contact our administrator',
      errors: []
      // payload: {},
    }
    if(ex instanceof HttpException) {
      // console.log('hmm')
      status = ex.getStatus();
      errorResponse = ex.getResponse() as {
        // statusCode: number;
        code: string;
        message: string;
        errors: any[]
        // payload: any;
      }
    } else {
      errorResponse = {
        ...errorResponse,
        message: ex.message,
        code: ex.name
      }
    }

    Logger.error(
      'status: ' + JSON.stringify(status),
      'OutputExceptionFilter',
    );
    Logger.error(
      'errorResponse: ' + JSON.stringify(errorResponse),
      'OutputExceptionFilter',
    );

    response.status(status).json({
      // statusCode: errorResponse.statusCode || 500,
      code: errorResponse.code || 'error_general',
      message: errorResponse.message || 'Please contact our administrator',
      errors: errorResponse.errors || []
      // payload: errorResponse.payload || {},
    });
  }
}

import * as fs from 'fs';

import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

import dayjs from '../../utils/date';

import { ResponseBuilderPaginationData } from './response';

export class ResponseBuilder {
  public static success(bool: boolean) {
    return {
      json: { success: bool },
      statusCode: HttpStatus.OK,
      timestamp: dayjs().toISOString(),
    };
  }

  public static data<T>(data: T) {
    return {
      json: data,
      statusCode: HttpStatus.OK,
      timestamp: dayjs().toISOString(),
    };
  }

  public static pagination<T>(
    data: T,
    paginationData?: ResponseBuilderPaginationData,
  ) {
    return {
      json: {
        pageData: data,
        paginationData: paginationData,
      },
      statusCode: HttpStatus.OK,
      timestamp: dayjs().toISOString(),
    };
  }

  public static base64(data: string) {
    return {
      base64: data,
      statusCode: HttpStatus.OK,
      timestamp: dayjs().toISOString(),
    };
  }

  public static base64FromPath(filePath: string) {
    const fileData = fs.readFileSync(filePath);
    const base64Data = fileData.toString('base64');
    return {
      base64: base64Data,
      statusCode: HttpStatus.OK,
      timestamp: dayjs().toISOString(),
    };
  }

  public static file(data: File, response: Response) {
    response.setHeader(
      'Content-Disposition',
      `attachment; filename=${data.name}`,
    );
    response.setHeader('Content-Type', data.type);
    return response.status(HttpStatus.OK).send(data);
  }

  public static fileFromPath(
    filePath: string,
    fileName: string,
    response: Response,
  ) {
    const fileData = fs.readFileSync(filePath);
    response.setHeader(
      'Content-Disposition',
      `attachment; filename=${fileName}`,
    );
    return response.status(HttpStatus.OK).send(fileData);
  }
}

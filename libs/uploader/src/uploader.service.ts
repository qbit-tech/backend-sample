import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { FileDownloader } from './interfaces/file-downloader';
import { FileModel } from './uploader.entity';
// import { v4 as uuidv4 } from 'uuid';
// import uuid from 'uuid';
import * as uuid from 'uuid'

export type FileProperties = {
  fileId: string;
  tableName: string;
  tableId: string;
  filePath: string;
  fileLinkCache?: string;
  fileCacheTimeout?: Date;
  metadata?: any;
  createdAt?: string;
  updatedAt?: string;
}

export type FileOptions = {
  cacheTimeout: number;
  defaultMetadata: object;
}

@Injectable()
export class UploaderService {
  constructor(
    @Inject('FILE_OPTIONS')
    private readonly fileOptions: FileOptions,
    @Inject('FILE_DOWNLOADER')
    private readonly fileDownloader: FileDownloader,
    @InjectModel(FileModel)
    private readonly fileRepository: typeof FileModel,
  ) {}

  async fileUploaded(params: {
    tableName: string;
    tableId: string;
    filePath: string;
    metadata?: object;
    isLocal?: boolean;
  }): Promise<FileProperties> {
    const metadata = {
      ...this.fileOptions.defaultMetadata,
      ...(params.metadata || {}),
    };

    const data: FileProperties = {
      ...params,
      // fileId: uuidv4(),
      fileId: uuid.v4(),
      fileCacheTimeout:
        this.fileOptions.cacheTimeout === -1
          ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 360 * 100)
          : new Date(Date.now() + 1000 * this.fileOptions.cacheTimeout),
      fileLinkCache: params.isLocal ?
      params.filePath :
      await (this.fileOptions.cacheTimeout === 0
        ? Promise.resolve(null)
        : this.fileDownloader.getLink({
            filePath: params.filePath,
            metadata: metadata,
            expired: this.fileOptions.cacheTimeout,
          })),
      metadata,
    };
    const result = await this.fileRepository.create(data);

    return result.get();
  }

  async fileSearchByIds(ids: string[]): Promise<Map<string, FileProperties>> {
    const results = await this.fileRepository.findAll({
      where: {
        fileId: {
          [Op.in]: ids,
        },
      },
    });

    const mapResult = new Map<string, FileProperties>();
    results.forEach(result => {
      mapResult.set(result.fileId, result.get());
    });
    return mapResult;
  }

  async fileSearchByTable(
    tableName: string,
    tableIds: string[],
  ): Promise<Map<string, FileProperties[]>> {
    const results = await this.fileRepository.findAll({
      where: {
        tableName: tableName,
        tableId: {
          [Op.in]: tableIds,
        },
      },
    });

    const mapResult = new Map<string, FileProperties[]>();
    results.forEach(result => {
      const currentList = mapResult.get(result.tableId) || [];
      currentList.push(result.get());

      mapResult.set(result.tableId, currentList);
    });
    return mapResult;
  }

  async updateImage(
    tableName: string,
    tableId: string,
    file: Express.Multer.File,
    metadata?: object
  ): Promise<{ isSuccess: boolean; payload: FileProperties }> {
    try {
      const oldFiles = await this.fileRepository.findAll({
        where: {
          tableName,
          tableId
        }
      });
      const uploadResult = await this.fileUploaded({
        tableName: tableName,
        tableId: tableId,
        filePath: file['key'],
        metadata: metadata || {},
      });

      await Promise.all(oldFiles.map((item)=>{
        const file = item.get();
        return this.deleteFileById(file.fileId)
      }))
      return { isSuccess: true, payload: uploadResult };
    } catch (err) {
      Logger.error('updateImage', err);
      return { isSuccess: false, payload: null };
    }
  }

  async deleteFileById(id: string): Promise<boolean> {
    try {
      const mapResult = await this.fileSearchByIds([id]);
      const result = mapResult.get(id);
      await Promise.all([
          this.fileDownloader.delFile({
          filePath: result.filePath,
          metadata: result.metadata || {},
        }),
        this.fileRepository.destroy({
          where: {
            fileId: id,
          },
        })
      ]);

      return true;
    } catch (err) {
      return false;
    }
  }

  async deleteImageByTableId(
    tableName: string,
    tableId: string,
  ): Promise<{ isSuccess: boolean }> {
    try {
      const fileSearchResult = await this.fileSearchByTable(tableName, [
        tableId,
      ]);

      if (fileSearchResult.has(tableId)) {
        const promises = fileSearchResult
          .get(tableId)
          .map(file => this.deleteFileById(file.fileId));
        await Promise.all(promises);
      }

      return { isSuccess: true };
    } catch (err) {
      Logger.error('deleteImageByTableId', err);
      return { isSuccess: false };
    }
  }
  
}

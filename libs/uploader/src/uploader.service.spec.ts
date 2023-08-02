import { ConfigModule } from '@nestjs/config';
import { getModelToken, SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { FileModel } from './uploader.entity';
import { UploaderService } from './uploader.service';
// import { v4 as uuidv4 } from 'uuid';
// import uuid from 'uuid';
import * as uuid from 'uuid'

const fileDownloaderMock = {
  getLink: jest.fn(),
  getFile: jest.fn(),
  delFile: jest.fn(),
  isFileExist: jest.fn(),
};

describe('UploaderService', () => {
  let service: UploaderService;
  let db: FileModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: process.env.ENV_PATH || '.env'
        }),
        SequelizeModule.forRoot({
          username: process.env.DB_USER || 'postgres',
          password: process.env.DB_PASS || '',
          database: process.env.DB_NAME || 'genesis',
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '5432'),
          dialect: 'postgres',
          autoLoadModels: true,   
          logging: false, 
        }),
        SequelizeModule.forFeature([FileModel]),
      ],
      providers: [
        UploaderService, {
          provide: 'FILE_DOWNLOADER',
          useValue: fileDownloaderMock,
        }, {
          provide: 'FILE_OPTIONS',
          useValue: {
            cacheTimeout: -1,
          }
        }
      ],
    }).compile();

    service = module.get<UploaderService>(UploaderService);
    db = module.get<FileModel>(getModelToken(FileModel));
  });

  afterEach(async () => {
    await FileModel.truncate();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(service.fileUploaded).toBeDefined();
    expect(service.fileSearchByIds).toBeDefined();
    expect(service.fileSearchByTable).toBeDefined();
    expect(service.deleteFileById).toBeDefined();
  });

  describe('upload file should record correctly', () => {
    it('upload data with file cache "forever"', async () => {
      // const linkGenerator = `s3://some-bucket/${uuidv4()}`;
      const linkGenerator = `s3://some-bucket/${uuid.v4()}`;
      fileDownloaderMock.getLink.mockImplementationOnce(() => (
        Promise.resolve(linkGenerator)
      ));
      const inputData = {
        tableName: 'customer',
        tableId: '123',
        filePath: 'some-bucket/customer-123',
      };
      const result = await service.fileUploaded(inputData);
      expect(result.tableName).toEqual(inputData.tableName);
      expect(result.tableId).toEqual(inputData.tableId);
      expect(result.filePath).toEqual(inputData.filePath);
      expect(result.fileLinkCache).toEqual(linkGenerator);
      expect(result.fileCacheTimeout !== null).toBeTruthy();
      expect(result.metadata).toEqual({});
      expect(result.updatedAt !== null).toBeTruthy();
      expect(result.createdAt !== null).toBeTruthy();
    })
  });

  describe('fileSearchbyIds should get correctly', () => {
    it('get inserted data correctly', async () => {
      // const linkGenerator = `s3://some-bucket/${uuidv4()}`;
      const linkGenerator = `s3://some-bucket/${uuid.v4()}`;
      fileDownloaderMock.getLink.mockImplementationOnce(() => (
        Promise.resolve(linkGenerator)
      ));
      const inputData = {
        tableName: 'customer',
        tableId: '123',
        filePath: 'some-bucket/customer-123',
      };
      const insertResult = await service.fileUploaded(inputData);
      const searchResult = await service.fileSearchByIds([insertResult.fileId]);

      expect(searchResult.get(insertResult.fileId)).toBeDefined();
      expect(searchResult.get(insertResult.fileId)).toStrictEqual(insertResult);
    });
  });

  describe('fileSearchByTable should get correctly', () => {
    it('get inserted data correctly', async () => {
      // const linkGenerator = `s3://some-bucket/${uuidv4()}`;
      const linkGenerator = `s3://some-bucket/${uuid.v4()}`;
      fileDownloaderMock.getLink.mockImplementationOnce(() => (
        Promise.resolve(linkGenerator)
      ));
      const inputData = {
        tableName: 'customer',
        tableId: '123',
        filePath: 'some-bucket/customer-123',
      };
      const insertResult = await service.fileUploaded(inputData);
      const searchResult = await service.fileSearchByTable(
        inputData.tableName,
        [inputData.tableId],
      );

      expect(searchResult.get(inputData.tableId)).toBeDefined();
      expect(searchResult.get(inputData.tableId)[0]).toStrictEqual(insertResult);
    });
  });

  describe('deleteFileById should get correctly', () => {
    it('delete data correctly', async () => {
      // const linkGenerator = `s3://some-bucket/${uuidv4()}`;
      const linkGenerator = `s3://some-bucket/${uuid.v4()}`;
      fileDownloaderMock.getLink.mockImplementationOnce(() => (
        Promise.resolve(linkGenerator)
      ));
      const inputData = {
        tableName: 'customer',
        tableId: '123',
        filePath: 'some-bucket/customer-123',
      };
      const insertResult = await service.fileUploaded(inputData);
      expect(insertResult).toBeDefined();

      const deleteResult = await service.deleteFileById(insertResult.fileId);
      expect(deleteResult).toBeTruthy();

      const searchResult = await service.fileSearchByIds([insertResult.fileId]);
      expect(searchResult.get(insertResult.fileId)).toBeUndefined();
    });
  });
});

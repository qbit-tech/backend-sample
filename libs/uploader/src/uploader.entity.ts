import { Column, CreatedAt, DataType, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";

@Table({
  tableName: 'files',
  timestamps: true,
})
export class FileModel extends Model {
  @PrimaryKey
  @Column
  fileId: string;

  @Column
  tableName: string;

  @Column
  tableId: string;

  @Column
  filePath: string;

  @Column
  fileLinkCache: string;

  @Column
  fileCacheTimeout: Date;

  @Column(DataType.JSONB)
  metadata: object;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

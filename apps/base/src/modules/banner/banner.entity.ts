import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'banner',
  timestamps: true,
})
export class BannerModel extends Model {
  // automatically generate uuid
  @PrimaryKey
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  title: String;

  @AllowNull(false)
  @Column(DataType.TEXT)
  bannerImage: String;

  @AllowNull(true)
  @Column(DataType.TEXT)
  bannerLink: String;

  @CreatedAt
  createdAt?: Date;

  @UpdatedAt
  updatedAt?: Date;
}

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
  tableName: 'articles',
  timestamps: true,
})
export class ArticleModel extends Model {
  // automatically generate uuid
  @PrimaryKey
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  authorId: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.TEXT)
  title: string;

  @AllowNull(true)
  @Default('')
  @Column(DataType.TEXT)
  coverImage: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  content: string;

  @CreatedAt
  createdAt?: Date;

  @UpdatedAt
  updatedAt?: Date;
}

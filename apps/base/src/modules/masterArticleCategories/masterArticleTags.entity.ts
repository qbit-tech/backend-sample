import { IsNotEmpty, IsOptional } from 'class-validator';
import {
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { ArticlesModel } from '../article/articles.entity';

@Table({
  tableName: 'q_master_article_categories',
  timestamps: true,
})
export class MasterArticleCategoriesModel extends Model {
  @PrimaryKey
  @IsNotEmpty()
  @Column
  categoryId: string;

  @IsNotEmpty()
  @Column
  name: string;

  @IsNotEmpty()
  @Column
  status: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  @IsNotEmpty()
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  @IsNotEmpty()
  updatedAt: Date;

  @HasMany(() => ArticlesModel, 'categoryId')
  articles: ArticlesModel[];
}

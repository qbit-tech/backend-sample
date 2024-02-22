import { IsNotEmpty, IsOptional } from 'class-validator';
import {
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { ArticleTagsModel } from '../article/articleTags.entity';

@Table({
  tableName: 'q_master_article_tags',
  timestamps: true,
})
export class MasterArticleTagsModel extends Model {
  @PrimaryKey
  @IsNotEmpty()
  @Column
  tagId: string;

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

  @HasMany(() => ArticleTagsModel, 'tagId')
  articleTags: ArticleTagsModel[];
}

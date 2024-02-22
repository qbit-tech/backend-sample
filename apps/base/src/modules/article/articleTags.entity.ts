import { IsNotEmpty, IsOptional } from 'class-validator';
import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { MasterArticleTagsModel } from '../masterArticleTags/masterArticleTags.entity';
import { ArticlesModel } from './articles.entity';

@Table({
  tableName: 'q_article_tags',
  timestamps: true,
})
export class ArticleTagsModel extends Model {
  @PrimaryKey
  @IsNotEmpty()
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => ArticlesModel)
  @IsNotEmpty()
  @Column
  articleId: string;

  @ForeignKey(() => MasterArticleTagsModel)
  @IsNotEmpty()
  @Column
  tagId: string;

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

  @BelongsTo(() => ArticlesModel, 'articleId')
  article: ArticlesModel;

  @BelongsTo(() => MasterArticleTagsModel, 'tagId')
  tag: MasterArticleTagsModel;
}
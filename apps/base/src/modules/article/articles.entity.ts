import { IsNotEmpty, IsOptional, isNotEmpty } from 'class-validator';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { MasterArticleCategoriesModel } from '../masterArticleCategories/masterArticleTags.entity';
import { ArticleTagsModel } from './articleTags.entity';

@Table({
  tableName: 'q_articles',
  timestamps: true,
})
export class ArticlesModel extends Model {
  @PrimaryKey
  @IsNotEmpty()
  @Column
  articleId: string;

  @IsNotEmpty()
  @Column
  title: string;

  @IsOptional()
  @Column
  subtitle?: string;

  @IsOptional()
  @Column
  titleEn?: string;

  @IsOptional()
  @Column
  subtitleEn?: string;

  @IsNotEmpty()
  @Column
  slug: string;

  @IsOptional()
  @Column
  slugEn?: string;

  @ForeignKey(() => MasterArticleCategoriesModel)
  @IsNotEmpty()
  @Column
  categoryId: string;

  @IsNotEmpty()
  @Column
  body: string;

  @IsOptional()
  @Column
  bodyEn: string;

  @IsNotEmpty()
  @Column
  status: string;

  @IsNotEmpty()
  @Column
  createdByUserId: string;

  @IsNotEmpty()
  @Column
  isHighlight: boolean;

  // @ForeignKey(() => UserModel)
  // @IsNotEmpty()
  // @Column
  // userId: string;

  @Column({ 
    type: DataType.JSONB 
  })
  metaCreatedByUser: any;

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
  publicationAt: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  @IsNotEmpty()
  updatedAt: Date;

  @HasMany(() => ArticleTagsModel, 'articleId')
  tags: ArticleTagsModel[];

  @BelongsTo(() => MasterArticleCategoriesModel, 'categoryId')
  category: MasterArticleCategoriesModel;

  // @BelongsTo(() => UserModel, 'userId')
  // user: UserModel;

  // @BelongsTo(() => MasterArticleTypeModel, 'typeId')
  // type: MasterArticleTypeModel;
}
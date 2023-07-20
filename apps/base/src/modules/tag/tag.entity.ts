import { Table, Model, PrimaryKey, Column, UpdatedAt, CreatedAt, DataType, Unique, AllowNull, BelongsToMany } from 'sequelize-typescript';
// import { EventModel, EventProperties } from '../event/event.entity';
// import { EventTagModel } from '../event/eventTag.entity';
import {
  ApiProperty,
  ApiPropertyOptional
} from '@nestjs/swagger';

export class BaseTagProperties {
  @ApiProperty()
  tagId?: string;

  @ApiProperty()
  tagName: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class TagProperties extends BaseTagProperties {
  // @ApiPropertyOptional({type: ()=>[EventProperties]})
  // events?: EventProperties[]
}

@Table({
  tableName: 'tags',
  timestamps: true,
})
export class TagModel extends Model {
  @PrimaryKey
  @Column
  tagId: string;

  @Unique
  @Column
  tagName: string;

  @Column
  description?: string;
  
  @Column
  status: string;

  @UpdatedAt
  updatedAt: Date;

  @CreatedAt
  createdAt: Date;

  // @BelongsToMany(() => EventModel,() => EventTagModel,)
  // events: EventModel[];
}
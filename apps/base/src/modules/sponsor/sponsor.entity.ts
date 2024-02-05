import { Table, Model, PrimaryKey, Column, UpdatedAt, CreatedAt, DataType, Unique, AllowNull, BelongsToMany } from 'sequelize-typescript';
// import { EventModel, EventProperties } from '../event/event.entity';
// import { EventTagModel } from '../event/eventTag.entity';
import {
  ApiProperty,
  ApiPropertyOptional
} from '@nestjs/swagger';

export class BaseSponsorProperties {
  @ApiProperty()
  sponsorId?: string;

  @ApiProperty()
  sponsorName: string;

  @ApiProperty()
  sponsorUrl: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class SponsorProperties extends BaseSponsorProperties {
  // @ApiPropertyOptional({type: ()=>[EventProperties]})
  // events?: EventProperties[]
}

@Table({
  tableName: 'sponsors',
  timestamps: true,
})
export class SponsorModel extends Model {
  @PrimaryKey
  @Column
  sponsorId: string;

  @Unique
  @Column
  sponsorName: string;

  @Column
  sponsorUrl: string;

  @UpdatedAt
  updatedAt: Date;

  @CreatedAt
  createdAt: Date;

  // @BelongsToMany(() => EventModel,() => EventTagModel,)
  // events: EventModel[];
}
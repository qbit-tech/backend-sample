import {
  Table,
  Model,
  PrimaryKey,
  Column,
  UpdatedAt,
  CreatedAt,
  DataType,
  Unique,
  AutoIncrement,
} from 'sequelize-typescript';

@Table({
  tableName: 'trackme',
  timestamps: true,
})
export class TrackMeModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Unique
  @Column
  activityId: string;

  @Column
  appName?: string;

  @Column
  userId: string;

  @Column
  activityType: string;

  @Column
  eventKey: string;

  @Column({ type: DataType.JSONB })
  payload: any;

  @Column
  timestamp: number;

  @UpdatedAt
  updatedAt: Date;

  @CreatedAt
  createdAt: Date;
}

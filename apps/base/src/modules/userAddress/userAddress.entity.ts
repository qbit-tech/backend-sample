import {
  Table,
  Column,
  PrimaryKey,
  CreatedAt,
  Model,
  DataType,
  UpdatedAt,
  AllowNull,
} from 'sequelize-typescript';

type GeolocCoords = {
  latitude: number;
  longitude: number;
}

@Table({
  tableName: 'user_addresses',
  timestamps: true,
})
export class UserAddressModel extends Model {
  @PrimaryKey
  @Column
  addressId: string;

  @Column
  userId: string;

  @Column
  label: string;

  @Column
  name: string;

  @Column
  phone: string;

  @Column
  province: string;

  @Column
  city: string;

  @Column
  district: string;

  @Column
  postalCode: string;

  @Column
  addressNote: string;

  @AllowNull
  @Column({ type: DataType.JSONB })
  geolocation?: GeolocCoords;

  @AllowNull
  @Column
  addressDetail?: string;

  @Column
  isDefault: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
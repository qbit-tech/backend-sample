import { AutoIncrement, Column, CreatedAt, DataType, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";

export enum EAuthMethod {
  usernamePassword = 'username-password',
  emailPassword = 'email-password',
  phoneOtp = 'phone-otp',
  google = 'google',
  facebook = 'facebook',
}

export class AuthProperties {
  id: string;
  userId: string;
  method: EAuthMethod;
  username: string;
  password: string;
  isPasswordExpired?: boolean;
  passwordExpiredAt?: Date;
  isVerified: boolean;
  isBlocked: boolean;
  blockedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

@Table({
  tableName: 'authentications',
  timestamps: true,
})
export class AuthModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: string;

  @Column
  userId: string;

  @Column({
    type: DataType.ENUM,
    values: [
      EAuthMethod.usernamePassword,
      EAuthMethod.emailPassword,
      EAuthMethod.phoneOtp,
      EAuthMethod.google,
      EAuthMethod.facebook,
    ],
  })
  method: EAuthMethod;

  @Column
  username: string;

  @Column
  password: string;

  @Column
  isPasswordExpired?: boolean;

  @Column
  passwordExpiredAt?: Date;
  
  @Column
  isVerified: boolean;
  
  @Column
  isBlocked?: boolean;

  @Column
  blockedAt?: Date;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
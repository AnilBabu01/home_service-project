import {
  Model,
  Table,
  AutoIncrement,
  PrimaryKey,
  Column,
  AllowNull,
  Unique,
  Default
} from "sequelize-typescript";

export interface UserI {
  id?: number | null;
  email: string;
  fullname: string;
  nickname: string;
  mobileno: string;
  userType: string;
  gender: string;
  status: number;
  occupation: string;
  countryCode: string;
  dob: string;
  profile: string;
  profilefilled: boolean;
  password: string;
  notification_token: string;
  latitude?: string;
  longitude?: string;
}

@Table({
  tableName: "users",
  timestamps: true,
})
export class User extends Model implements UserI {
  @AutoIncrement
  @PrimaryKey
  @Column
  id?: number;

  @AllowNull(true)
  @Column
  fullname!: string;

  @AllowNull(true)
  @Column
  nickname!: string;

  @AllowNull(false)
  // @Unique
  @Column
  email!: string;

  @AllowNull(true)
  // @Unique
  @Column
  countryCode!: string;

  @AllowNull(true)
  @Column
  mobileno!: string;

  @AllowNull(true)
  @Default("user")
  @Column
  userType!: string;

  @AllowNull(true)
  @Column
  notification_token!: string;

  @AllowNull(true)
  @Default(1)
  @Column
  status!: number;

  @AllowNull(true)
  @Column
  latitude!: string;

  @AllowNull(true)
  @Column
  longitude!: string;

  @AllowNull(true)
  @Column
  gender!: string;

  @AllowNull(true)
  @Column
  occupation!: string;

  @AllowNull(true)
  @Column
  dob!: string;

  @AllowNull(true)
  @Column
  profile!: string;

  @AllowNull(false)
  @Default(false)
  @Column
  profilefilled!: boolean;

  @AllowNull(true)
  @Column
  password!: string;
}

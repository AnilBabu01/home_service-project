import {
  Model,
  Table,
  AutoIncrement,
  PrimaryKey,
  Column,
  AllowNull,
  NotEmpty,
  Default,
} from "sequelize-typescript";

export interface AdminType {
  id?: number | null;
  adminType: string;
  name: string;
  profile: string;
  email: string;
  password: string;
  notification_token: string;
  phoneNumber?: string;
}

@Table({
  tableName: "admins",
  timestamps: true,
})
export class Admin extends Model implements AdminType {
  @AutoIncrement
  @PrimaryKey
  @Column
  id?: number;

  @AllowNull(true)
  @NotEmpty
  @Default("superadmin")
  @Column
  adminType!: string;

  @AllowNull(true)
  @NotEmpty
  @Column
  name!: string;

  @AllowNull(true)
  @Column
  notification_token!: string;

  @AllowNull(true)
  @NotEmpty
  @Column
  profile!: string;

  @AllowNull(true)
  @NotEmpty
  @Column
  email!: string;

  @AllowNull(true)
  @Column
  phoneNumber!: string;

  @AllowNull(true)
  @Column
  bio!: string;

  @AllowNull(true)
  @NotEmpty
  @Column
  password!: string;
}

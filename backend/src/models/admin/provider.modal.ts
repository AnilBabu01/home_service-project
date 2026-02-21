import {
  Model,
  Table,
  AutoIncrement,
  PrimaryKey,
  Column,
  AllowNull,
  NotEmpty,
  HasMany,
  HasOne,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Service } from "./services.nodal";
import { ProviderNumbering } from "./providenumbering.modal";
import { ProviderTimeSlot } from "./providertimeslot.modal";
import { User } from "../user/user.model";

export interface ProviderType {
  id?: number | null;
  name: string;
  email: string;
  profile: string;
  mobile_no: string;
  countryCode?: string;
  experience: string;
  testPassword: string;
  password: string;
  notification_token: string;
  latitude?: string;
  longitude?: string;
  userId?: number;
}

@Table({
  tableName: "providers",
  timestamps: true,
})
export class Provider extends Model implements ProviderType {
  @AutoIncrement
  @PrimaryKey
  @Column
  id?: number;

  @AllowNull(false)
  @NotEmpty
  @Column
  name!: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  email!: string;

  @AllowNull(true)
  @NotEmpty
  @Column
  mobile_no!: string;

  @AllowNull(true)
  @Column
  countryCode!: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  experience!: string;

  @ForeignKey(() => User)
  @Column
  userId!: number;

  @AllowNull(true)
  @NotEmpty
  @Column
  profile!: string;

  @AllowNull(true)
  @Column
  notification_token!: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  testPassword!: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  password!: string;

  @AllowNull(true)
  @Column
  latitude!: string;

  @AllowNull(true)
  @Column
  longitude!: string;

  @BelongsTo(() => User)
  user!: User

  // Define relationship (One-to-Many: Category -> Services)
  @HasMany(() => Service)
  services!: Service[];

  // One-to-Many Relationship with Numbering
  @HasMany(() => ProviderNumbering)
  providerNumbering!: ProviderNumbering[];

  // One-to-Many Relationship with Numbering
  @HasMany(() => ProviderTimeSlot)
  providerTimeSlot!: ProviderTimeSlot[];
}

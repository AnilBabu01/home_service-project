import {
  Model,
  Table,
  AutoIncrement,
  PrimaryKey,
  Column,
  AllowNull,
  NotEmpty,
  Default,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Service } from "./services.nodal";
import { User } from "../user/user.model";

export interface ServiceMessageType {
  id?: number | null;
  service_id?: number;
  message?: string;
  user_id?: number;
}

@Table({
  tableName: "message",
  timestamps: true,
})
export class ServiceMessage extends Model implements ServiceMessageType {
  @AutoIncrement
  @PrimaryKey
  @Column
  id?: number;

  @AllowNull(false)
  @NotEmpty
  @Column
  message!: string;

  // Foreign Key Column
  @ForeignKey(() => Service)
  @Column
  service_id!: number;

  // Define relationship (Many-to-One: Service -> Like)
  @BelongsTo(() => Service)
  services!: Service;

  // Foreign Key Column for User
  @ForeignKey(() => User)
  @Column
  user_id!: number;

  @BelongsTo(() => User)
  user!: User;
}

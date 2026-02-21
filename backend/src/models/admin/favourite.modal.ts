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


export interface FavouriteType {
  id?: number | null;
  isfavourite: boolean;
  service_id?: number;
  user_id?: number;
}

@Table({
  tableName: "favourite",
  timestamps: true,
})
export class Favourite extends Model implements FavouriteType {
  @AutoIncrement
  @PrimaryKey
  @Column
  id?: number;

  @AllowNull(false)
  @NotEmpty
  @Default(false)
  @Column
  isfavourite!: boolean;

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


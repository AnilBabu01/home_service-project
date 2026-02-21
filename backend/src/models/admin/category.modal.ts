import {
  Model,
  Table,
  AutoIncrement,
  PrimaryKey,
  Column,
  AllowNull,
  NotEmpty,
  Default,
  HasMany,
} from "sequelize-typescript";
import { Service } from "./services.nodal";

export interface CategoryType {
  id?: number | null;
  name: string;
  icon: string;
  bgColor: string;
  block: boolean;
}

@Table({
  tableName: "categories",
  timestamps: true,
})
export class Category extends Model implements CategoryType {
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
  icon!: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  bgColor!: string;

  @AllowNull(false)
  @NotEmpty
  @Default(false)
  @Column
  block!: boolean;

  // Define relationship (One-to-Many: Category -> Services)
  @HasMany(() => Service)
  services!: Service[];


}

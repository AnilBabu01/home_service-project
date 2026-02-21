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

export interface ISlider {
  id?: number | null;
  title: string;
  image: string;
  active: boolean;
}

@Table({
  tableName: "sliders",
  timestamps: true,
})
export class Slider extends Model<ISlider> {
  @AutoIncrement
  @PrimaryKey
  @Column
  id?: number;

  @AllowNull(false)
  @NotEmpty
  @Column
  title!: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  image!: string;

  @AllowNull(false)
  @Default(true)
  @Column
  active!: number;
}

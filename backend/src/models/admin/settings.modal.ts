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

export interface SettingType {
  id?: number | null;
  privacyPolicy: string;
  customerServices: string;
  whatsapp: string;
  Website: string;
  facebook: string;
  twitter: string;
  instagram: string;
  advanceAmountPercentage: number;
}

@Table({
  tableName: "setting",
  timestamps: true,
})
export class Setting extends Model<SettingType> {
  @AutoIncrement
  @PrimaryKey
  @Column
  id?: number;

  @AllowNull(false)
  @NotEmpty
  @Column
  privacyPolicy!: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  customerServices!: string;

  @AllowNull(false)
  @Default(2)
  @Column
  advanceAmountPercentage!: number;

  @AllowNull(false)
  @NotEmpty
  @Column
  whatsapp!: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  Website!: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  facebook!: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  twitter!: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  instagram!: string;
}

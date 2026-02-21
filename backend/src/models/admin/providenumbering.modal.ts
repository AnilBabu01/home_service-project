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
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Provider } from "./provider.modal";

export interface ProviderNumberingType {
  id?: number | null;
  keyName: string;
  amount: number;
  onDiscount:number;
  count: number;
  provider_id?: number | null;
}

@Table({
  tableName: "provider_numbering",
  timestamps: true,
})

export class ProviderNumbering extends Model implements ProviderNumberingType {
  @AutoIncrement
  @PrimaryKey
  @Column
  id?: number;

  @AllowNull(false)
  @NotEmpty
  @Column
  keyName!: string;

  @AllowNull(false)
  @NotEmpty
  @Default(0)
  @Column
  amount!: number;

  @AllowNull(false)
  @NotEmpty
  @Default(0)
  @Column
  onDiscount!: number;

  @AllowNull(false)
  @NotEmpty
  @Default(0)
  @Column
  count!: number;

  // Foreign key linking to Category
  @ForeignKey(() => Provider)
  @Column
  provider_id?: number;

  // Define relationship (Many-to-One: Numbering -> Category)
  @BelongsTo(() => Provider)
  provider!: Provider;
}

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
  Unique
} from "sequelize-typescript";
import { Provider } from "./provider.modal";

export interface ProviderTimeSlotType {
  id?: number | null;
  slot: string;
  isAvailable: boolean;
  provider_id?: number | null;
}

@Table({
  tableName: "provider_time-slot",
  timestamps: true,
})
export class ProviderTimeSlot extends Model implements ProviderTimeSlotType {
  @AutoIncrement
  @PrimaryKey
  @Column
  id?: number;

  @AllowNull(false)
  @NotEmpty
  @Unique
  @Column
  slot!: string;

  @AllowNull(false)
  @NotEmpty
  @Default(true)
  @Column
  isAvailable!: boolean;

  // Foreign key linking to Category
  @ForeignKey(() => Provider)
  @Column
  provider_id?: number;

  // Define relationship (Many-to-One: Numbering -> Category)
  @BelongsTo(() => Provider)
  provider!: Provider;
}

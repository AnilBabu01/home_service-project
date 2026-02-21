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
import { ServiceBooking } from "./servicebooking.modal";
import { ProviderNumbering } from "./providenumbering.modal";

export interface IServiceBookingNumbering {
  id?: number | null;
  count: number;
  serviceBookingId?: number | null;
  providerNumberingId?: number | null;
}

@Table({
  tableName: "serviceBookingNumberings",
  timestamps: true,
})

export class ServiceBookingNumbering extends Model implements IServiceBookingNumbering {
  @AutoIncrement
  @PrimaryKey
  @Column
  id?: number;

  @AllowNull(false)
  @NotEmpty
  @Default(0)
  @Column
  count!: number;

  // Foreign key linking to Category
  @ForeignKey(() => ProviderNumbering)
  @Column
  providerNumberingId?: number;

  // Define relationship (Many-to-One: Numbering -> Category)
  @BelongsTo(() => ProviderNumbering)
  providerNumbering!: ProviderNumbering;

  // Foreign key linking to Category
  @ForeignKey(() => ServiceBooking)
  @Column
  serviceBookingId?: number;

  // Define relationship (Many-to-One: Numbering -> Category)
  @BelongsTo(() => ServiceBooking)
  serviceBooking!: ServiceBooking;
}

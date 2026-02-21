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
import { ServiceBooking } from "./servicebooking.modal";
import { User } from "../user/user.model";

export interface ITransaction {
  id?: number | null;
  transactionId: string;
  razorpayTransactionId?: string;
  amount: number;
  status: number;
  serviceBookingId?: number;
  userId?: number;
}

@Table({
  tableName: "transactions",
  timestamps: true,
})
export class Transaction extends Model<ITransaction> {
  @AutoIncrement
  @PrimaryKey
  @Column
  id?: number;

  @AllowNull(false)
  @Column
  transactionId!: string;

  @AllowNull(true)
  @NotEmpty
  @Column
  razorpayTransactionId!: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  amount!: number;

  @AllowNull(false)
  @Default(0)
  @Column
  status!: number;

  @ForeignKey(() => ServiceBooking)
  @AllowNull(true)
  @Column
  serviceBookingId!: number;

  @BelongsTo(() => ServiceBooking)
  serviceBooking!: ServiceBooking;

  @ForeignKey(() => User)
  @Column
  userId!: number;

  @BelongsTo(() => User)
  user!: User;
}

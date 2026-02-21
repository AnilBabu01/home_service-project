import {
  Model,
  Table,
  AutoIncrement,
  PrimaryKey,
  Column,
  AllowNull,
  NotEmpty,
  ForeignKey,
  BelongsTo,
  Default,
} from "sequelize-typescript";
import { Service } from "../admin/services.nodal";
import { User } from "../user/user.model";

export interface ServiceBookType {
  id?: number | null;
  service_id?: number;
  user_id?: number;
  date?: string;
  time_slot_id?: number;
  time?: string;
  transactionId?: string;
  address?: string;
  paymentMethod?: string;
  // contextual?: string;
  barcode?: string;
  status?: number;
  isAccept?: string;
  roomId?: string;
  amount: number;
  advanceAmount: number;
  tax: number;
  totalAmount: number;
  longitude: string;
  latitude: string;
  reason?: string;
  reasonDescription?: string;
  reviewGiven?: boolean;
}


@Table({
  tableName: "booking",
  timestamps: true,
})
export class ServiceBooking
  extends Model<ServiceBookType>
  implements ServiceBookType {
  @AutoIncrement
  @PrimaryKey
  @Column
  id?: number;

  @AllowNull(false)
  @NotEmpty
  @Column
  date!: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  time!: string;

  @AllowNull(false)
  @Default(false) // Default status to false
  @Column
  status!: number;

  @AllowNull(true)
  @Default('0') // Default isAccept to false
  @Column
  isAccept!: string;

  @AllowNull(false)
  @Column
  amount!: number;

  @AllowNull(false)
  @Default(0)
  @Column
  advanceAmount!: number;

  @AllowNull(true)
  @Column
  transactionId!: string;

  @AllowNull(true)
  @Column
  roomId!: string;

  @AllowNull(true)
  @Column
  address!: string;

  @AllowNull(true)
  @Default("razorpay")
  @Column
  paymentMethod!: string;

  @AllowNull(true)
  @Column
  reason!: string;

  @AllowNull(true)
  @Column
  reasonDescription!: string;

  @AllowNull(true)
  @Column
  latitude!: string;

  @AllowNull(true)
  @Column
  longitude!: string;

  // @AllowNull(true)
  // @Column
  // contextual!: string;

  @AllowNull(true)
  @Column
  barcode!: string;

  @AllowNull(false)
  @Column
  tax!: number;

  @Default(false)
  @Column
  reviewGiven!: boolean;

  @AllowNull(false)
  @Column
  time_slot_id!: number;

  @AllowNull(false)
  @Column
  totalAmount!: number;

  // Foreign Key Column
  @ForeignKey(() => Service)
  @Column
  service_id!: number;

  @BelongsTo(() => Service)
  service!: Service;

  // Foreign Key Column for User
  @ForeignKey(() => User)
  @Column
  user_id!: number;

  @BelongsTo(() => User)
  user!: User;
}

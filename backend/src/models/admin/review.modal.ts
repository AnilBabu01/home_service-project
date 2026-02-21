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
  HasMany,
} from "sequelize-typescript";
import { Service } from "./services.nodal";
import { User } from "../user/user.model";
import { ReviewLike } from "../admin/reviewlike.modal";
import { ServiceBooking } from "./servicebooking.modal";

export interface ReviewType {
  id?: number | null;
  rating: number;
  review: string;
  service_id?: number;
  user_id?: number;
  serviceBookingId?: number;
}

@Table({
  tableName: "reviews",
  timestamps: true,
})
export class Review extends Model<ReviewType> {
  @AutoIncrement
  @PrimaryKey
  @Column
  id?: number;

  @AllowNull(false)
  @NotEmpty
  @Column
  rating!: number;

  @AllowNull(false)
  @NotEmpty
  @Column
  review!: string;

  // Foreign Key Column for Service
  @ForeignKey(() => Service)
  @Column
  service_id!: number;

  // Foreign Key Column for Service
  @ForeignKey(() => ServiceBooking)
  @AllowNull(true)
  @Column
  serviceBookingId!: number;

  @BelongsTo(() => Service)
  service!: Service;

  @BelongsTo(() => ServiceBooking)
  serviceBooking!: ServiceBooking;

  @ForeignKey(() => User)
  @Column
  user_id!: number;

  @BelongsTo(() => User)
  user!: User;

  @HasMany(() => ReviewLike)
  reviewLike!: ReviewLike[];

}

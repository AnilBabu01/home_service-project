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
} from "sequelize-typescript";
import { Review } from "./review.modal";
import { User } from "../user/user.model";

export interface ReviewLikeType {
  id?: number | null;
  islike: boolean;
  review_id?: number;
  user_id?: number;
}

@Table({
  tableName: "reviewlikes",
  timestamps: true,
})
export class ReviewLike extends Model<ReviewLikeType> {
  @AutoIncrement
  @PrimaryKey
  @Column
  id?: number;

  @AllowNull(false)
  @NotEmpty
  @Column
  islike!: boolean;

  // Foreign Key Column for User
  @ForeignKey(() => User)
  @Column
  user_id!: number;

  @BelongsTo(() => User)
  user!: User;

  // Foreign Key Column for Review
  @ForeignKey(() => Review)
  @Column
  review_id!: number;

  @BelongsTo(() => Review)
  review!: Review;
}

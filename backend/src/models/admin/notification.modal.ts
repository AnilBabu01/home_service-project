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

export interface NotificationType {
  id?: number | null;
  type: string;
  message: string;
  title: string;
  user_id?: number;
  seen?: boolean;
  image?: string; // Add image property
}

@Table({
  tableName: "notifications",
  timestamps: true,
})
export class Notification extends Model<NotificationType> {
  @AutoIncrement
  @PrimaryKey
  @Column
  id?: number;

  @AllowNull(false)
  @NotEmpty
  @Column
  type!: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  message!: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  title!: string;

  @AllowNull(true)
  @NotEmpty
  @Column
  user_id!: number;

  @AllowNull(true)
  @Default(false)
  @Column
  seen!: boolean;

  @AllowNull(true) // Allow null values if the image is optional
  @Column
  image!: string; // Store image URL or path
}

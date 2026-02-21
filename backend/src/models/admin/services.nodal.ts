import {
  Model,
  Table,
  AutoIncrement,
  PrimaryKey,
  Column,
  AllowNull,
  NotEmpty,
  Unique,
  Default,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import { Category } from "./category.modal";
import { Favourite } from "./favourite.modal";
import { Review } from "./review.modal";
import { ServiceBooking } from "./servicebooking.modal";
import { ServiceMessage } from "./servicesmessage.modal";
import { Provider } from "./provider.modal";

export interface ServiceType {
  id?: number | null;
  name: string;
  image: string;
  category_id?: number;
  provider_d?: number | null;
  block: boolean;
  description: string;
  address: string;
  hoursPrice: number;
  rating?: number;
}

@Table({
  tableName: "services",
  timestamps: true,
})
export class Service extends Model implements ServiceType {
  @AutoIncrement
  @PrimaryKey
  @Column
  id?: number;

  @AllowNull(false)
  @NotEmpty
  @Column
  name!: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  image!: string;

  @AllowNull(false)
  @Default(0)
  @Column
  rating!: number;

  @AllowNull(false)
  @NotEmpty
  @Default(false)
  @Column
  block!: boolean;

  @AllowNull(true)
  @NotEmpty
  @Column
  description!: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  address!: string;



  @AllowNull(false)
  @NotEmpty
  @Column
  hoursPrice!: number;

  // Foreign Key Column
  @AllowNull(false)
  @ForeignKey(() => Category)
  @Column
  category_id!: number;

  // Foreign Key Column
  @AllowNull(false)
  @ForeignKey(() => Provider)
  @Column
  provider_id!: number;

  // Define relationship (Many-to-One: Service -> Category)
  @BelongsTo(() => Category)
  category!: Category;

  // Define relationship (Many-to-One: Service -> Category)
  @BelongsTo(() => Provider)
  provider!: Provider;

  // Define One-to-Many relationship (Service -> Likes)
  @HasMany(() => Favourite)
  favourites!: Favourite[];

  // Define One-to-Many relationship (Service -> ReviewRating)
  @HasMany(() => Review)
  reviews!: Review[];

  // Define One-to-Many relationship (Service -> ReviewRating)
  @HasMany(() => ServiceBooking)
  serviceBookings!: ServiceBooking[];

  // Define One-to-Many relationship (Service -> ReviewRating)
  @HasMany(() => ServiceMessage)
  serviceMessages!: ServiceMessage[];
}

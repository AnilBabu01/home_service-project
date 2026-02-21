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
} from "sequelize-typescript";
import { Faq } from "./faq.modal";

export interface FaqCategoeyType {
  id?: number | null;
  name: string;
  block: boolean;
}

@Table({
  tableName: "FaqCategories",
  timestamps: true,
})
export class FaqCategory extends Model<FaqCategoeyType> {
  @AutoIncrement
  @PrimaryKey
  @Column
  id?: number;

  @AllowNull(false)
  @NotEmpty
  @Column
  name!: string;

  @AllowNull(true)
  @NotEmpty
  @Default(false)
  @Column
  block!: boolean;

  // Define relationship (One-to-Many: Category -> faqs)
  @HasMany(() => Faq)
  Faqs!: Faq[];

  
}


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
import { FaqCategory } from "./faqcategory.modal";

export interface FaqType {
  id?: number | null;
  question: string;
  category_id?: number;
  answer: string;
  block: boolean;
}

@Table({
  tableName: "Faqs",
  timestamps: true,
})
export class Faq extends Model<FaqType> {
  @AutoIncrement
  @PrimaryKey
  @Column
  id?: number;

  @AllowNull(false)
  @NotEmpty
  @Column
  question!: string;

  @AllowNull(true)
  @NotEmpty
  @Default(false)
  @Column
  block!: boolean;

  @AllowNull(true)
  @NotEmpty
  @Column
  answer!: string;

  // Foreign Key Column
  @AllowNull(false)
  @ForeignKey(() => FaqCategory)
  @Column
  category_id!: number;

  // Define relationship (Many-to-One: Faq -> FaqCategory)
  @BelongsTo(() => FaqCategory)
  faqCategory!: FaqCategory;
  
}

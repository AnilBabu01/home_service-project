import {
    Model,
    Table,
    AutoIncrement,
    PrimaryKey,
    Column,
    AllowNull,
    Unique,
    Default,
    ForeignKey,
    BelongsTo,
    HasMany
} from "sequelize-typescript";
import { User } from "./user.model";
import { Provider } from "../admin/provider.modal";
import { Message } from "./message.modal";

export interface RoomI {
    id?: number | null;
    roomId: string;
    userId: number;
    providerId: number;
    type: string;
    name: string;
    image: string;
    isChatPaused: boolean;
}

@Table({
    tableName: "rooms",
    timestamps: true,
})
export class Room extends Model implements RoomI {
    @AutoIncrement
    @PrimaryKey
    @Column
    id?: number;

    @AllowNull(false)
    @Unique
    @Column
    roomId!: string;

    @ForeignKey(() => User)
    @AllowNull(true)
    @Column
    userId!: number;

    @ForeignKey(() => Provider)
    @AllowNull(true)
    @Column
    providerId!: number;

    @BelongsTo(() => User)
    user!: User;

    @BelongsTo(() => Provider)
    provider!: Provider;

    @AllowNull(true)
    @Column
    type!: string;

    @AllowNull(true)
    @Column
    name!: string;

    @AllowNull(true)
    @Column
    image!: string;

    @AllowNull(false)
    @Default(false)
    @Column
    isChatPaused!: boolean;

    @HasMany(() => Message)
    messages!: Message[];
}

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
    BelongsTo
} from "sequelize-typescript";
import { Room } from "./room.modal";
import { User } from "./user.model";
import { Provider } from "../admin/provider.modal";

export interface MessageI {
    id?: number | null;
    roomId: number;
    userId: number;
    providerId: number;
    message: string;
    seen: boolean;
    isNotificationSent: boolean;
}

@Table({
    tableName: "messages",
    timestamps: true,
})
export class Message extends Model implements MessageI {
    @AutoIncrement
    @PrimaryKey
    @Column
    id?: number;

    @ForeignKey(() => Room)
    @Column
    roomId!: number;

    @AllowNull(true)
    @Column
    message!: string;

    @Default(false)
    @Column
    seen!: boolean;

    @Default(false)
    @Column
    isNotificationSent!: boolean;

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

    @BelongsTo(() => Room)
    room!: Room;
}

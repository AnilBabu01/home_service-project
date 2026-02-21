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

export interface RoomUserI {
    id?: number | null;
    roomId: number;
    userId: number;
    providerId: number;
}

@Table({
    tableName: "roomUsers",
    timestamps: true,
})
export class RoomUser extends Model implements RoomUserI {
    @AutoIncrement
    @PrimaryKey
    @Column
    id?: number;

    @ForeignKey(() => Room)
    @Column
    roomId!: number;

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
}

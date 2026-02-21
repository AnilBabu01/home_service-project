import { Server } from "socket.io";

var io: Server;
const initializeSocket = function (server: any) {
    io = new Server(server);
    return io;
};

const getSocketIo = () => {
    if (io) {
        return io;
    }
    throw new Error("Something went wrong!!");
};

export { initializeSocket, getSocketIo };
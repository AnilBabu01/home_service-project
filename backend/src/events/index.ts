import { Server } from "socket.io";

const initEvents = async (io: Server) => {
    console.log("in init events")
    // Socket.IO setup
    io.on("connection", async function (socket) {
        console.log(socket.handshake.headers);
        const userId = socket.handshake.headers?.userid;

        // trigger typing event
        socket.on("typing", async (data: any) => {

        });

        // trigger stop typing event
        socket.on("stopTyping", async (data: any) => {

        });

        // trigger message seen event
        socket.on("seenMessages", async (data: any) => {

        });
        // trigger disconnect event
        socket.on("disconnect", async (data: any) => {

        });
    });
};

export { initEvents }
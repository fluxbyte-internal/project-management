import http, { IncomingMessage, ServerResponse } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";

export class RegisterSocketServices {
  static io: SocketIOServer;
  constructor() {}

  static register(
    server: http.Server<typeof IncomingMessage, typeof ServerResponse>
  ) {
    this.io = new SocketIOServer(server, { cors: { origin: "*" } });

    this.io.sockets.on("connection", (socket: Socket) => {
      socket.on("join", async (userId: string) => {
        socket.join(userId);
        // socket.to(userId).emit("notification", {
        //   id: 4,
        //   message: "You are added in task 1",
        // });
      });
      socket.on("disconnect", () => {});
    });
  }
}

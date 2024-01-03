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
      socket.on("join", async (data: { userId: string | string[] }) => {
        socket.join(data.userId);
      });
      socket.on("disconnect", () => {});
    });
  }
}

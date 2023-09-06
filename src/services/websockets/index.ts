import { Socket, io } from "socket.io-client";
import { Sensor } from "../../models/sensor";

export class SocketService {
	private socket: Socket;

	constructor() {
		this.socket = io(import.meta.env.VITE_WS_URL as string);

		this.socket.on("connect", () => {
			console.log("Conectado ao servidor Socket.IO");
		});

		this.socket.on("disconnect", () => {
			console.log("Desconectado do servidor Socket.IO");
		});
	}

	public sendMessage(event: string, message: string) {
		this.socket.emit(event, message);
	}

	public listenEvent(event: string, callback: (content: Sensor) => void) {
		this.socket.on(event, callback);
	}

	public closeEvent(event: string) {
		this.socket.off(event);
	}

	public disconnect(): void {
		this.socket.disconnect();
	}
}

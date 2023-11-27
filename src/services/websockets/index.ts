import { Socket, io } from "socket.io-client";
import { SensorsTypes } from "../../models";

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

	public listenEvent(
		event: string | typeof SensorsTypes,
		callback: (content: string) => void
	) {
		this.socket.on(event as string, (content: string) => {
			callback(content);
		});
	}

	public closeEvent(event: string) {
		this.socket.off(event);
	}

	public disconnect(): void {
		this.socket.disconnect();
	}
}

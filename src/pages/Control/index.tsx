import { Box, Chip, Paper, Typography, Button, Divider } from "@mui/material";
import { SocketService } from "../../services";
import { useEffect, useState } from "react";

let socketService: SocketService;

export function ControlPage() {
	const [isIrrigatorOn, setIsIrrigatorOn] = useState(false);
	const [isManualMode, setIsManualMode] = useState(false);

	const handleGetIrrigatorStatus = () => {
		socketService.listenEvent("irrigator-status", (data) => {
			console.log(data);
			setIsIrrigatorOn(data === "on");
		});
	};

	const handleChangeManualMode = () => {
		setIsManualMode((prev) => !prev);

		if (isManualMode) {
			socketService.sendMessage(
				"irrigator-control",
				JSON.stringify("manual-mode-off")
			);
		} else {
			socketService.sendMessage(
				"irrigator-control",
				JSON.stringify("manual-mode-on")
			);
		}
	};

	const handleSendIrrigatorAction = () => {
		if (isIrrigatorOn) {
			socketService.sendMessage(
				"irrigator-action",
				JSON.stringify("manual-off")
			);
		} else {
			socketService.sendMessage(
				"irrigator-action",
				JSON.stringify("manual-on")
			);
		}
	};

	useEffect(() => {
		socketService = new SocketService();
		handleGetIrrigatorStatus();
	}, []);

	return (
		<Box
			display="flex"
			justifyContent="center"
			alignItems="center"
			flexDirection="column"
			height="80vh"
		>
			<Paper
				sx={{
					mb: "2rem",
					padding: "1rem",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexDirection: "column",
				}}
			>
				<Box display="flex">
					<Typography variant="h6" mb="0.5rem" mr="0.5rem">
						Irrigador:
					</Typography>

					{isIrrigatorOn ? (
						<Chip label="LIGADO" color="success" />
					) : (
						<Chip label="DESLIGADO" color="error" />
					)}
				</Box>

				<Divider />

				<Box display="flex" flexDirection="column" mt="1rem">
					<Button
						variant="contained"
						onClick={handleChangeManualMode}
						sx={{ mb: "0.5rem" }}
					>
						{isManualMode ? "Desligar o Modo Manual" : "Ligar o Modo Manual"}
					</Button>
					<Button
						disabled={!isManualMode}
						variant="contained"
						onClick={handleSendIrrigatorAction}
					>
						{isIrrigatorOn ? "Desligar o Irrigador" : "Ligar o Irrigador"}
					</Button>
				</Box>
			</Paper>
		</Box>
	);
}

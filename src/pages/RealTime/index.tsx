import {
	Box,
	Paper,
	Typography,
	Grid,
	Divider,
	Alert,
	Snackbar,
} from "@mui/material";
import { SensorChart } from "../../components";
import { useState, useMemo, useEffect } from "react";
import { Sensor, SensorsTypes } from "../../models";
import { SocketService } from "../../services";
import { Sensors } from "../../types/Sensor";
import { formatDate } from "../../utils/formatDate";

let socketService: SocketService;

const sensorLabels = {
	airMoisture: "Umidade do Ar",
	soilMoisture: "Umidade do Solo",
	temperature: "Temperatura",
	luminosity: "Luminosidade",
};

export function RealTimePage() {
	const [sensorData, setSensorData] = useState<{
		[K in Sensors]: Sensor[];
	}>({
		airMoisture: [],
		soilMoisture: [],
		temperature: [],
		luminosity: [],
	});

	const maxDataLength = 15;

	const isLowSoilMoisture = useMemo(() => {
		const soilMoisture = sensorData.soilMoisture.slice(-1)[0];

		if (soilMoisture) {
			return (soilMoisture.soilMoisture as number) < 80;
		}

		return false;
	}, [sensorData.soilMoisture]);

	const handleGetSensorData = (sensorName: Sensors) => {
		socketService.listenEvent(SensorsTypes[sensorName], (data) => {
			setSensorData((prevState) => {
				const dataParsed: Sensor = JSON.parse(data as string);

				if (Object.keys(dataParsed)[0] === sensorName) {
					return {
						...prevState,
						[sensorName]: [
							...prevState[sensorName],
							{
								...dataParsed,
								date: formatDate(dataParsed.date as string),
							},
						].slice(-maxDataLength),
					};
				}

				return prevState;
			});
		});
	};

	useEffect(() => {
		socketService = new SocketService();

		const sensors: Sensors[] = [
			"airMoisture",
			"soilMoisture",
			"temperature",
			"luminosity",
		];

		for (const sensor of sensors) {
			handleGetSensorData(sensor);
		}

		return () => {
			socketService.disconnect();
		};
	}, []);

	const sensorTypes = Object.keys(sensorData) as Sensors[];

	return (
		<Box
			display="flex"
			flexDirection="column"
			alignItems="center"
			justifyContent="end"
		>
			<Snackbar
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
				open={isLowSoilMoisture}
			>
				<Alert severity="error" variant="filled">
					Umidade do solo abaixo de 80%.
				</Alert>
			</Snackbar>

			<Grid container spacing={2} padding={4}>
				{sensorTypes.map((sensorType, index) => (
					<Grid item xs={12} key={index}>
						<Paper sx={{ padding: "1rem" }}>
							<Typography variant="h5">{sensorLabels[sensorType]}</Typography>
							<Divider sx={{ marginBottom: "1rem", marginTop: "0.5rem" }} />
							<SensorChart data={sensorData} sensorType={sensorType} />
						</Paper>
					</Grid>
				))}
			</Grid>
		</Box>
	);
}

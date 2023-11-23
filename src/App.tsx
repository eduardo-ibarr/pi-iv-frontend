import { useEffect, useState } from "react";
import { SensorChart } from "./components";
import { SocketService } from "./services";
import { Sensor } from "./models/sensor";
import moment from "moment";
import { Grid, Typography } from "@mui/material";
import { SensorsTypes } from "./models/sensorsTypes";

let socketService: SocketService;

const sensorLabels = {
	airMoisture: "Umidade do ar",
	soilMoisture: "Umidade do solo",
	temperature: "Temperatura",
	luminosity: "Luminosidade",
};

function formatDate(date: string) {
	return moment(date).format("hh:mm:ss");
}

function App() {
	const [sensorData, setSensorData] = useState<{
		[K in keyof typeof SensorsTypes]: Sensor[];
	}>({
		airMoisture: [],
		soilMoisture: [],
		temperature: [],
		luminosity: [],
	});

	const maxDataLength = 15;

	const handleGetSensorData = (sensorName: keyof typeof SensorsTypes) => {
		socketService.listenEvent(SensorsTypes[sensorName], (data: Sensor) => {
			setSensorData((prevState) => {
				if (Object.keys(data)[0] === sensorName) {
					return {
						...prevState,
						[sensorName]: [
							...prevState[sensorName],
							{ ...data, date: formatDate(data.date as string) },
						].slice(-maxDataLength),
					};
				}

				return prevState;
			});
		});
	};

	useEffect(() => {
		socketService = new SocketService();

		handleGetSensorData("airMoisture");
		handleGetSensorData("soilMoisture");
		handleGetSensorData("temperature");
		handleGetSensorData("luminosity");

		return () => {
			socketService.disconnect();
		};
	}, []);

	const sensorTypes = Object.keys(sensorData) as (keyof typeof SensorsTypes)[];

	return (
		<Grid container spacing={2}>
			{sensorTypes.map((sensorType, index) => (
				<Grid item xs={6} key={index}>
					<Typography variant="h5" marginBottom="1rem">
						{sensorLabels[sensorType]}
					</Typography>
					<SensorChart data={sensorData} sensorType={sensorType} />
				</Grid>
			))}
		</Grid>
	);
}

export default App;

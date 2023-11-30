import { useMemo, useState } from "react";
import {
	Box,
	Grid,
	Paper,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Button,
	Typography,
	Divider,
} from "@mui/material";
import { useSensorReadings } from "../../hooks/app/useSensorReadings";
import { SensorChart } from "../../components";
import { Sensors } from "../../types/Sensor";

export function PeriodReadingsPage() {
	const [sensorType, setSensorType] = useState("temperature");
	const [timeInterval, setTimeInterval] = useState("12_hours");
	const [fetchData, setFetchData] = useState(false);

	const sensorOptions = [
		{ label: "Temperatura", value: "temperature" },
		{ label: "Luminosidade", value: "luminosity" },
		{ label: "Umidade do Solo", value: "soil-moisture" },
		{ label: "Umidade do Ar", value: "air-moisture" },
	];

	const timeOptions = [
		{ label: "12 Horas", value: "12_hours" },
		{ label: "Hora", value: "hour" },
		{ label: "Dia", value: "day" },
		{ label: "Minuto", value: "minute" },
	];

	const { data, isLoading } = useSensorReadings({
		sensorType,
		timeInterval,
		enabled: fetchData,
	});

	const chartData = useMemo(() => {
		if (data && data.length > 0) {
			const slicedData = data.slice(-15);

			return {
				airMoisture: sensorType === "air-moisture" ? slicedData : [],
				soilMoisture: sensorType === "soil-moisture" ? slicedData : [],
				temperature: sensorType === "temperature" ? slicedData : [],
				luminosity: sensorType === "luminosity" ? slicedData : [],
			};
		}
		return null;
	}, [data, sensorType]);

	const handleSearch = () => {
		setFetchData(true);
	};

	return (
		<Box>
			<Grid container spacing={2} padding={4}>
				<Grid item xs={12}>
					<Paper sx={{ padding: "1rem" }}>
						<FormControl fullWidth>
							<InputLabel>Tipo de Sensor</InputLabel>
							<Select
								value={sensorType}
								label="Tipo de Sensor"
								onChange={(e) => setSensorType(e.target.value)}
							>
								{sensorOptions.map((option) => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<FormControl fullWidth sx={{ marginTop: 2 }}>
							<InputLabel>Intervalo de Tempo</InputLabel>
							<Select
								value={timeInterval}
								label="Intervalo de Tempo"
								onChange={(e) => setTimeInterval(e.target.value)}
							>
								{timeOptions.map((option) => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<Button
							variant="contained"
							sx={{ marginTop: 2 }}
							onClick={handleSearch}
						>
							Buscar
						</Button>

						{isLoading && <div>Carregando...</div>}
					</Paper>

					<Paper sx={{ padding: "1rem", mt: "2rem" }}>
						{chartData && (
							<>
								<Typography variant="h5">
									{
										sensorOptions.find((option) => option.value === sensorType)
											?.label
									}
								</Typography>
								<Divider sx={{ marginBottom: "1rem", marginTop: "0.5rem" }} />
								<SensorChart
									data={chartData}
									sensorType={sensorType as Sensors}
								/>
							</>
						)}
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
}

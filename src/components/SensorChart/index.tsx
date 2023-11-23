import {
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	Area,
	AreaChart,
	ResponsiveContainer,
} from "recharts";
import { Sensor } from "../../models/sensor";
import { SensorsTypes } from "../../models";

interface SensorChartProps {
	data: {
		[K in keyof typeof SensorsTypes]: Sensor[];
	};
	sensorType: "airMoisture" | "soilMoisture" | "temperature" | "luminosity";
}

export const SensorChart = ({ data, sensorType }: SensorChartProps) => {
	if (Object.values(data).every((value) => value.length === 0)) {
		return <div>Carregando...</div>;
	}

	return (
		<ResponsiveContainer width="100%" height={300}>
			<AreaChart
				width={630}
				height={300}
				data={data[sensorType]}
				margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
			>
				<defs>
					<linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
						<stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
					</linearGradient>
				</defs>
				<XAxis dataKey="date" dy={15} />
				<YAxis
					dx={-5}
					tickFormatter={
						sensorType === "temperature" ? (e) => `${e}°C` : (e) => `${e}%`
					}
					domain={sensorType === "temperature" ? [-20, 100] : [0, 100]}
				/>
				<CartesianGrid strokeDasharray="3 3" />
				<Tooltip />
				<Area
					type="monotone"
					dataKey={sensorType}
					stroke="#8884d8"
					fillOpacity={1}
					fill="url(#colorUv)"
				/>
			</AreaChart>
		</ResponsiveContainer>
	);
};

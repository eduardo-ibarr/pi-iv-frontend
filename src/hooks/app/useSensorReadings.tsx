import { useQuery } from "react-query";

interface Props {
	sensorType: string;
	timeInterval: string;
	enabled?: boolean;
}

export function useSensorReadings({
	sensorType,
	timeInterval,
	enabled,
}: Props) {
	const url = `http://localhost:3000/api/v1/readings/${sensorType}/${timeInterval}`;

	const fetchReadings = async () => {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		return response.json();
	};

	return useQuery(["readings", sensorType, timeInterval], fetchReadings, {
		enabled,
	});
}

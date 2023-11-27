import { Paper, Typography } from "@mui/material";
import { Sidebar } from "./components/Sidebar";
import { useAppContext } from "./hooks/app/useAppProvider";
import { ControlPage } from "./pages/Control";
import { RealTimePage } from "./pages/RealTime";

function App() {
	const { currentPage } = useAppContext();

	return (
		<>
			<Sidebar />

			{currentPage === "real-time" && (
				<>
					<Paper sx={{ padding: "1rem", mx: "2rem", mt: "0.5rem" }}>
						<Typography variant="h4">Dados em Tempo Real</Typography>
					</Paper>

					<RealTimePage />
				</>
			)}
			{currentPage === "control" && <ControlPage />}
		</>
	);
}

export default App;

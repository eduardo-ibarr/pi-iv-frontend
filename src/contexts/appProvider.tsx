import { ReactNode, useState } from "react";
import { AppContext } from "./AppContext";

export function AppContextProvider({ children }: { children: ReactNode }) {
	const [currentPage, setCurrentPage] = useState("real-time");

	const navigateTo = (page: string) => {
		setCurrentPage(page);
	};

	return (
		<AppContext.Provider value={{ currentPage, navigateTo }}>
			{children}
		</AppContext.Provider>
	);
}

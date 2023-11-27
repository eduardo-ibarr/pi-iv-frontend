import { createContext } from "react";

interface AppContextProps {
	currentPage: string;
	navigateTo: (page: string) => void;
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);

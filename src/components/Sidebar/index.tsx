import {
	Box,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Drawer,
	IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { useAppContext } from "../../hooks/app/useAppProvider";

const options = [
	["Leituras em Tempo Real", "real-time"],
	["Leituras por Períodos", "period"],
	["Controle de Irrigação", "control"],
];

export function Sidebar() {
	const [isOpened, setIsOpened] = useState(false);
	const { navigateTo } = useAppContext();

	const toggleDrawer = (open: boolean) => {
		setIsOpened(open);
	};

	const list = () => (
		<Box role="presentation">
			<List>
				{options.map((text) => (
					<ListItem key={text[0]} disablePadding>
						<ListItemButton onClick={() => navigateTo(text[1])}>
							<ListItemText primary={text[0]} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Box>
	);

	return (
		<div>
			<IconButton onClick={() => toggleDrawer(true)} size="large">
				<MenuIcon />
			</IconButton>
			<Drawer onClose={() => toggleDrawer(false)} anchor="left" open={isOpened}>
				{list()}
			</Drawer>
		</div>
	);
}

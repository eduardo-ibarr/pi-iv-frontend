import moment from "moment";

export function formatDate(date: string) {
	return moment(date).format("hh:mm:ss");
}

import moment from "moment-timezone";

export default function asLogTime(date = undefined) {
	return moment(date).toISOString().replace(/T/, " ").replace(/\..*/, "");
}

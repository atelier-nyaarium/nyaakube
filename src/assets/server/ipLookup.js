import asLogTime from "@/assets/server/asLogTime";
import fetchJSON from "@/assets/server/fetchJSON";
import moment from "moment-timezone";

export let lastIpCheckGood = true; // If bad, do not go forward with the next request.
export let lastIpCheckError = "";
export let lastIpCheckTime = moment();
export const runningIpChecks = {};

export default async function ipLookup(ip) {
	if (!(typeof ip === "string")) throw new Error(`Expected an IP string`);
	if (!process.env.IP2LOCATION_KEY) {
		throw new Error(`Missing IP2LOCATION_KEY variable`);
	}

	try {
		if (!lastIpCheckGood) {
			const date1DayAgo = moment().subtract({ day: 1 });
			if (lastIpCheckTime.isBefore(date1DayAgo)) {
				lastIpCheckGood = true;
				lastIpCheckError = "";
			} else {
				console.log(
					`⛔`,
					asLogTime(),
					`Skipping IP lookup due to error ${lastIpCheckTime.fromNow()}. Error:`,
					lastIpCheckError,
				);
			}
		}

		if (lastIpCheckGood) {
			if (runningIpChecks[ip]) return;
			runningIpChecks[ip] = true;

			try {
				const url = `https://api.ip2location.io/?key=${process.env.IP2LOCATION_KEY}&ip=${ip}`;
				const json = await fetchJSON(url);

				lastIpCheckGood = true;
				lastIpCheckError = "";
				lastIpCheckTime = moment();

				console.log(json);
			} catch (error) {
				lastIpCheckGood = false;

				console.log(lastIpCheckGood);
				lastIpCheckError = `[${ip}] :: ` + error.message;
			}

			delete runningIpChecks[ip];
		}
	} catch (error) {
		console.log(`ipLookup() :: Error with fetch call`);
		console.log(error.message);

		lastIpCheckGood = false;
		lastIpCheckError = error.message;
		lastIpCheckTime = moment();

		delete runningIpChecks[ip];
	}
}

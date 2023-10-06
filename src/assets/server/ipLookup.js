import asLogTime from "@/assets/server/asLogTime";
import getEnv from "@/assets/server/getEnv";
import moment from "moment-timezone";
import nodeFetch from "node-fetch";

let lastIpCheckGood = true; // If bad, do not go forward with the next request.
let lastIpCheckError = "";
let lastIpCheckTime = moment();
const runningIpChecks = {};

const IP2LOCATION_KEY = getEnv("IP2LOCATION_KEY");

/**
 * Looks up the location information for a given IP address using the ip2location API.
 *
 * @param {string} ip - The IP address to lookup.
 *
 * @throws {Error} If the input is not a string or if the IP2LOCATION_KEY environment variable is missing.
 *
 * @returns {Promise<void>} A promise that resolves when the location information is retrieved.
 */
export default async function ipLookup(ip) {
	if (!(typeof ip === "string")) throw new Error(`Expected an IP string`);
	if (!IP2LOCATION_KEY) {
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
				const url = `https://api.ip2location.io/?key=${IP2LOCATION_KEY}&ip=${ip}`;
				const json = await nodeFetch(url).then((res) => res.json());

				lastIpCheckGood = true;
				lastIpCheckError = "";
				lastIpCheckTime = moment();

				console.log(json);
			} catch (error) {
				lastIpCheckGood = false;

				console.log(lastIpCheckGood);
				lastIpCheckError = `[${ip}] ` + error.message;
			}

			delete runningIpChecks[ip];
		}
	} catch (error) {
		console.log(`ipLookup(ip) : Error with fetch call`);
		console.log(error.message);

		lastIpCheckGood = false;
		lastIpCheckError = error.message;
		lastIpCheckTime = moment();

		delete runningIpChecks[ip];
	}
}

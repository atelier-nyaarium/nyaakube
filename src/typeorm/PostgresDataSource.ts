// Do not import anything outside of /src/typeorm/ stuff
import { DataSource } from "typeorm";

let postgresDataSource = null;

export default function PostgresDataSource(configOverrides) {
	if (postgresDataSource) return postgresDataSource;

	if (!process.env.POSTGRES_DB) {
		throw new Error(`POSTGRES_DB variable is missing`);
	}
	if (!process.env.POSTGRES_USER) {
		throw new Error(`POSTGRES_USER variable is missing`);
	}
	if (!process.env.POSTGRES_PASSWORD) {
		throw new Error(`POSTGRES_PASSWORD variable is missing`);
	}

	console.log(
		` ℹ️`,
		`Connecting to:`,
		createPostgresUrl({ password: "****" }),
	);

	postgresDataSource = new DataSource({
		type: "postgres",
		url: createPostgresUrl(),
		synchronize: true,
		logging: true,
		...configOverrides,
	});

	return postgresDataSource;
}

/**
 * Create a postgres URL from object or environment variables.
 *
 * @typedef {Object} DatabaseConnectionOptions
 * @property {string} [host] - Hostname of the database.
 * @property {number} [port] - Port of the database.
 * @property {string} [username] - Username of the database.
 * @property {string} [password] - Password of the database.
 * @property {string} [database] - Database name.
 *
 * @param {DatabaseConnectionOptions} [config] - Config (defaults to environment variables)
 *
 * @returns {Function} - Connection string for postgres.
 */
export function createPostgresUrl(config = null) {
	const host = config?.host ?? (process.env.POSTGRES_HOST || "localhost");
	const port = config?.port ?? (Number(process.env.POSTGRES_PORT) || 5432);
	const username = config?.username ?? process.env.POSTGRES_USER;
	const password = config?.password ?? process.env.POSTGRES_PASSWORD;
	const database = config?.database ?? process.env.POSTGRES_DB;

	return `postgresql://${username}:${password}@${host}:${port}/${database}`;
}

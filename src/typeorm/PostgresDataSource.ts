import { DataSource } from "typeorm";

if (!process.env.POSTGRES_DB) {
	throw new Error(`POSTGRES_DB variable is missing`);
}
if (!process.env.POSTGRES_USER) {
	throw new Error(`POSTGRES_USER variable is missing`);
}
if (!process.env.POSTGRES_PASSWORD) {
	throw new Error(`POSTGRES_PASSWORD variable is missing`);
}

let postgresDataSource = null;

export default function PostgresDataSource(configOverrides) {
	if (postgresDataSource) return postgresDataSource;

	const host = process.env.POSTGRES_HOST || "localhost";
	const port = Number(process.env.POSTGRES_PORT) || 5432;
	const username = process.env.POSTGRES_USER;
	const password = process.env.POSTGRES_PASSWORD;
	const database = process.env.POSTGRES_DB;

	console.log(
		` ℹ️`,
		`Connecting to:`,
		`postgresql://${username}:****@${host}:${port}/${database}`,
	);

	postgresDataSource = new DataSource({
		type: "postgres",
		host,
		port,
		username,
		password,
		database,
		synchronize: true,
		logging: true,
		...configOverrides,
	});

	return postgresDataSource;
}

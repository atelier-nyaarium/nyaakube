import { DataSource } from "typeorm";

let postgresDataSource = null;

export default function PostgresDataSource(configOverrides) {
	if (postgresDataSource) return postgresDataSource;

	postgresDataSource = new DataSource({
		type: "postgres",
		host: process.env.POSTGRES_HOST || "localhost",
		port: Number(process.env.POSTGRES_PORT) || 5432,
		username: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		database: process.env.POSTGRES_DB,
		synchronize: true,
		logging: true,
		...configOverrides,
	});

	return postgresDataSource;
}

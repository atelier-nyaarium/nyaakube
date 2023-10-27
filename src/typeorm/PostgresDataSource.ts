import { DataSource } from "typeorm";

let postgresDataSource = null;

export default function PostgresDataSource() {
	if (postgresDataSource) return postgresDataSource;

	console.log(`Creating PostgresDataSource at ${__dirname}`);

	postgresDataSource = new DataSource({
		type: "postgres",
		host: process.env.POSTGRES_HOST || "localhost",
		port: Number(process.env.POSTGRES_PORT) || 5432,
		username: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		database: process.env.POSTGRES_DB,
		synchronize: true,
		logging: true,
		entities: [`${__dirname}/entities/**/*.entity.ts`],
		subscribers: [`${__dirname}/subscriber/**/*.ts`],
		migrations: [`${__dirname}/migrations/**/*.ts`],
	});

	return postgresDataSource;
}

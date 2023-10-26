import { DataSource } from "typeorm";

const PostgresDataSource = new DataSource({
	type: "postgres",
	host: process.env.POSTGRES_HOST || "localhost",
	port: Number(process.env.POSTGRES_PORT) || 5432,
	username: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB,
	synchronize: true,
	logging: true,
	entities: ["src/schemas/default/entity/**/*.ts"],
	migrations: ["src/schemas/default/migration/**/*.ts"],
	subscribers: ["src/schemas/default/subscriber/**/*.ts"],
});

PostgresDataSource.initialize()
	.then(() => {
		console.log("Data Source has been initialized!");
	})
	.catch((err) => {
		console.error("Error during Data Source initialization", err);
	});

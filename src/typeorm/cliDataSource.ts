import dotenv from "dotenv";
import PostgresDataSource from "./PostgresDataSource";

console.log(`NODE_ENV:`, process.env.NODE_ENV);

console.log(
	`Connecting to:`,
	process.env.POSTGRES_HOST,
	process.env.POSTGRES_DB,
);

if (process.env.NODE_ENV !== "production") {
	dotenv.config();
}

const datasource = PostgresDataSource({
	entities: [`src/typeorm/entities/**/*.entity.ts`],
	migrations: [`src/typeorm/migrations/**/*.ts`],
});

export default datasource;

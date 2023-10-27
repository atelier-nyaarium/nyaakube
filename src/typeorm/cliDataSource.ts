import dotenv from "dotenv";
import PostgresDataSource from "./PostgresDataSource";

if (process.env.NODE_ENV !== "production") {
	dotenv.config();
}

const datasource = PostgresDataSource({
	entities: [`src/typeorm/entities/**/*.entity.ts`],
	migrations: [`src/typeorm/migrations/**/*.ts`],
});

export default datasource;

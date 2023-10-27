import dotenv from "dotenv";
import PostgresDataSource from "./PostgresDataSource";

dotenv.config();

const datasource = PostgresDataSource({
	entities: [`src/typeorm/entities/**/*.entity.ts`],
	migrations: [`src/typeorm/migrations/**/*.ts`],
});

export default datasource;

import PostgresDataSource from "./PostgresDataSource";

const datasource = PostgresDataSource({
	entities: [`src/typeorm/entities/**/*.entity.ts`],
	migrations: [`src/typeorm/migrations/**/*.ts`],
});

export default datasource;

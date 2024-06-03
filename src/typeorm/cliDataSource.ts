import PostgresDataSource from "./PostgresDataSource";

const config = {
	logging: true,
	entities: [`src/typeorm/entities/**/*.entity.ts`],
	migrations: [`src/typeorm/migrations/**/*.ts`],
};

console.log(`Creating datasource: ${JSON.stringify(config)}`);

const datasource = PostgresDataSource(config);

export default datasource;

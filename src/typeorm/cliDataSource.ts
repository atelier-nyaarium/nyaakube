import dotenv from "dotenv";
import PostgresDataSource from "./PostgresDataSource";

dotenv.config();

const datasource = PostgresDataSource();

export default datasource;

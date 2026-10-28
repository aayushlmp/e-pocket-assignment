import "reflect-metadata";
import { DataSource, type DataSourceOptions } from "typeorm";
import { User } from "../entities/User.entity.ts";
import { Transaction } from "../entities/Transaction.entity.ts";
import { Note } from "../entities/Note.entity.ts";
import { TransactionAuditHistory } from "../entities/TransactionAuditHistory.entity.ts";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});
const options = {
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // Auto-creates database tables on start (Turn off in production)
  logging: false,
  entities: [User, Transaction, Note, TransactionAuditHistory],
  migrations: [],
  subscribers: [],
} as DataSourceOptions;

export const AppDataSource: DataSource = new DataSource(options);

import {
	AccessDeniedError,
	UnauthorizedError,
} from "@/assets/common/ErrorTypes";
import { Role } from "@/schemas/default/entities/role.entity";
import { User } from "@/schemas/default/entities/user.entity";
import { DataSource } from "typeorm";

let postgresDatasource = null;

export default class ServerAPI {
	constructor() {
		if (!postgresDatasource) {
			postgresDatasource = new DataSource({
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
		}

		this.pg = postgresDatasource;
		this.pgm = this.pg.manager;

		// Initialize the DataSource
		postgresDatasource
			.initialize()
			.then(() => postgresDatasource.runMigrations())
			.then(() => {
				this.UserRepository = postgresDatasource.getRepository(User);
				this.RoleRepository = postgresDatasource.getRepository(Role);
			});
	}

	_assertAuth(context) {
		if (!context.user) {
			throw new UnauthorizedError();
		}
	}

	_assertSelfAccess(id, context) {
		this._assertAuth(context);

		if (context.user.id !== id) {
			throw new AccessDeniedError();
		}
	}

	async getUserById(parent, { id }, context) {
		this._assertSelfAccess(id, context);

		return await this.pgm.findOne(User, { where: { id: id } });
	}

	async getUsersByRoleId(parent, { roleId }, context) {
		this._assertAuth(context);
		const role = await this.pgm.findOne(Role, {
			where: { id: roleId },
			relations: ["users"],
		});
		return role ? role.users : [];
	}

	async getUserByEmail(parent, { email }, context) {
		this._assertAuth(context);

		return await this.pgm.findOne(User, {
			where: { email: email.toLowerCase() },
		});
	}

	async getRole(parent, { id }, context) {
		this._assertAuth(context);

		return await this.pgm.findOne(Role, { where: { id: id } });
	}

	async allUsers(parent, args, context) {
		return await this.pgm.find(User);
	}

	async allRoles(parent, args, context) {
		return await this.pgm.find(Role);
	}

	async getRolesByUserId(parent, { userId }, context) {
		this._assertSelfAccess(userId, context);
		const user = await this.pgm.findOne(User, {
			where: { id: userId },
			relations: ["roles"],
		});
		return user ? user.roles : [];
	}

	async getNumberOfUsersByRoleId(parent, { roleId }, context) {
		this._assertAuth(context);
		const role = await this.pgm.findOne(Role, {
			where: { id: roleId },
			relations: ["users"],
		});
		return role ? role.users.length : 0;
	}
}

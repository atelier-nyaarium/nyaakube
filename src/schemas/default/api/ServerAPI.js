import {
	AccessDeniedError,
	UnauthorizedError,
} from "@/assets/common/ErrorTypes";
import PostgresDataSource from "@/typeorm/PostgresDataSource";
import { Role } from "@/typeorm/entities/role.entity";
import { User } from "@/typeorm/entities/user.entity";

export default class ServerAPI {
	constructor() {
		this.pg = PostgresDataSource();
		this.pgm = this.pg.manager;

		// Initialize the DataSource
		this.pg
			.initialize()
			.then(() => {
				this.UserRepository = this.pg.getRepository(User);
				this.RoleRepository = this.pg.getRepository(Role);
			})
			.catch((error) => {
				console.error(error);
				process.exit(1);
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

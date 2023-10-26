import {
	AccessDeniedError,
	UnauthorizedError,
} from "@/assets/common/ErrorTypes";
import { Role } from "@/schemas/default/entities/role.entity";
import { User } from "@/schemas/default/entities/user.entity";
import { DataSource } from "typeorm";

export default class ServerAPI {
	constructor(dataSourceOptions) {
		this.dataSource = new DataSource(dataSourceOptions);

		// Initialize the DataSource
		this.dataSource.initialize().then(() => {
			this.UserRepository = this.dataSource.getRepository(User);
			this.RoleRepository = this.dataSource.getRepository(Role);
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

		const manager = this.dataSource.manager;
		return await manager.findOne(User, { where: { id: id } });
	}

	async getUsersByRoleId(parent, { roleId }, context) {
		this._assertAuth(context);
		const manager = this.dataSource.manager;
		const role = await manager.findOne(Role, {
			where: { id: roleId },
			relations: ["users"],
		});
		return role ? role.users : [];
	}

	async getUserByEmail(parent, { email }, context) {
		this._assertAuth(context);

		const manager = this.dataSource.manager;
		return await manager.findOne(User, {
			where: { email: email.toLowerCase() },
		});
	}

	async getRole(parent, { id }, context) {
		this._assertAuth(context);

		const manager = this.dataSource.manager;
		return await manager.findOne(Role, { where: { id: id } });
	}

	async allUsers(parent, args, context) {
		const manager = this.dataSource.manager;
		return await manager.find(User);
	}

	async allRoles(parent, args, context) {
		const manager = this.dataSource.manager;
		return await manager.find(Role);
	}

	async getRolesByUserId(parent, { userId }, context) {
		this._assertSelfAccess(userId, context);
		const manager = this.dataSource.manager;
		const user = await manager.findOne(User, {
			where: { id: userId },
			relations: ["roles"],
		});
		return user ? user.roles : [];
	}

	async getNumberOfUsersByRoleId(parent, { roleId }, context) {
		this._assertAuth(context);
		const manager = this.dataSource.manager;
		const role = await manager.findOne(Role, {
			where: { id: roleId },
			relations: ["users"],
		});
		return role ? role.users.length : 0;
	}
}

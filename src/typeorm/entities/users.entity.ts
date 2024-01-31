import {
	Column,
	CreateDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { Role } from "./roles.entity";

@Entity("users")
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "text", unique: true })
	email: string;

	@Column({ type: "text" })
	password_hash: string;

	@Column({ type: "text" })
	password_salt: string;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@Column({ type: "text", nullable: true })
	totp_secret?: string;

	@ManyToMany(() => Role, (role) => role.users)
	@JoinTable({ name: "user_role_assignments" })
	roles: Role[];
}

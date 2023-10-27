import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity("roles")
export class Role {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "text", unique: true })
	name: string;

	@ManyToMany(() => User, (user) => user.roles)
	users: User[];
}

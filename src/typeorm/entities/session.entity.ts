import { Column, Entity, Index, PrimaryColumn } from "typeorm";

@Entity("session")
export class Session {
	@PrimaryColumn("varchar", { length: 255 })
	sid: string;

	@Column("json")
	sess: any;

	@Index()
	@Column("timestamp", { precision: 6 })
	expire: Date;
}

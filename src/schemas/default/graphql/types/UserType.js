import RoleType from "@/schemas/default/graphql/types/RoleType";
import {
	GraphQLID,
	GraphQLList,
	GraphQLObjectType,
	GraphQLString,
} from "graphql";

const UserType = new GraphQLObjectType({
	name: "User",
	fields: () => ({
		id: { type: GraphQLID },
		created_at: { type: GraphQLString, description: "Creation timestamp" },
		updated_at: {
			type: GraphQLString,
			description: "Last update timestamp",
		},
		email: { type: GraphQLString },
		password: {
			type: GraphQLString,
			description: "Hashed password - do not expose in public queries!",
		},
		totp_secret: {
			type: GraphQLString,
			description: "TOTP secret for two-factor authentication",
		},
		roles: {
			type: new GraphQLList(RoleType),
			resolve(parent, args, context) {
				return context.api.getRolesByUserId(parent, args, context);
			},
		},
	}),
});

export default UserType;

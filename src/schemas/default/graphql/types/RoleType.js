import UserType from "@/schemas/default/graphql/types/UserType";
import {
	GraphQLID,
	GraphQLInt,
	GraphQLList,
	GraphQLObjectType,
	GraphQLString,
} from "graphql";

const RoleType = new GraphQLObjectType({
	name: "Role",
	fields: () => ({
		id: { type: GraphQLID },
		created_at: { type: GraphQLString, description: "Creation timestamp" },
		updated_at: {
			type: GraphQLString,
			description: "Last update timestamp",
		},
		name: { type: GraphQLString },
		description: { type: GraphQLString },
		users: {
			type: new GraphQLList(UserType),
			resolve(parent, args, context) {
				return context.api.getUsersByRoleId(parent, args, context);
			},
		},
		numberOfUsers: {
			type: GraphQLInt,
			resolve(parent, args, context) {
				return context.api.getNumberOfUsersByRoleId(
					parent,
					args,
					context,
				);
			},
		},
	}),
});

export default RoleType;

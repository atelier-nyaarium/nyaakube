import RoleType from "@/schemas/default/graphql/types/RoleType";
import UserType from "@/schemas/default/graphql/types/UserType";
import {
	GraphQLID,
	GraphQLList,
	GraphQLObjectType,
	GraphQLString,
} from "graphql";

const RootQuery = new GraphQLObjectType({
	name: "Query",
	fields: {
		user: {
			type: UserType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args, context) {
				return context.api.getUserById(parent, args, context);
			},
		},
		userByEmail: {
			type: UserType,
			args: { email: { type: GraphQLString } },
			resolve(parent, args, context) {
				return context.api.getUserByEmail(parent, args, context);
			},
		},
		usersByRole: {
			type: new GraphQLList(UserType),
			args: { roleId: { type: GraphQLID } },
			resolve(parent, args, context) {
				return context.api.getUsersByRoleId(parent, args, context);
			},
		},
		role: {
			type: RoleType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args, context) {
				return context.api.getRole(parent, args, context);
			},
		},
		allUsers: {
			type: new GraphQLList(UserType),
			resolve(parent, args, context) {
				return context.api.allUsers();
			},
		},
		allRoles: {
			type: new GraphQLList(RoleType),
			resolve(parent, args, context) {
				return context.api.allRoles();
			},
		},
	},
});

export default RootQuery;

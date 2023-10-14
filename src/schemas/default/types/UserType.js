import PostType from "@/schemas/default/types/PostType";
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
		name: { type: GraphQLString },
		email: { type: GraphQLString },
		posts: {
			type: new GraphQLList(PostType),
			resolve(parent, args, context) {
				return context.api.getUserPosts(parent, args);
			},
		},
	}),
});
export default UserType;

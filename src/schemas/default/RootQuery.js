import CommentType from "@/schemas/default/types/CommentType";
import PostType from "@/schemas/default/types/PostType";
import UserType from "@/schemas/default/types/UserType";
import { GraphQLID, GraphQLObjectType } from "graphql";

const RootQuery = new GraphQLObjectType({
	name: "Query",
	fields: {
		user: {
			type: UserType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args, context) {
				return context.api.getUserById(parent, args);
			},
		},
		post: {
			type: PostType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args, context) {
				return context.api.getPostById(parent, args, context);
			},
		},
		comment: {
			type: CommentType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args, context) {
				return context.api.getCommentById(parent, args, context);
			},
		},
	},
});
export default RootQuery;

import CommentType from "@/schemas/default/types/CommentType";
import UserType from "@/schemas/default/types/UserType";
import {
	GraphQLID,
	GraphQLList,
	GraphQLObjectType,
	GraphQLString,
} from "graphql";

const PostType = new GraphQLObjectType({
	name: "Post",
	fields: () => ({
		id: { type: GraphQLID },
		title: { type: GraphQLString },
		content: { type: GraphQLString },
		user: {
			type: UserType,
			resolve(parent, args, context) {
				return context.api.getPostAuthor(parent, args);
			},
		},
		comments: {
			type: new GraphQLList(CommentType),
			resolve(parent, args, context) {
				return context.api.getPostComments(parent, args);
			},
		},
	}),
});
export default PostType;

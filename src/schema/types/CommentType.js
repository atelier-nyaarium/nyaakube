import PostType from "@/schema/types/PostType";
import UserType from "@/schema/types/UserType";
import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

const CommentType = new GraphQLObjectType({
	name: "Comment",
	fields: () => ({
		id: { type: GraphQLID },
		text: { type: GraphQLString },
		post: {
			type: PostType,
			resolve: (parent, args, context) => {
				return context.api.getCommentPost(parent, args);
			},
		},
		user: {
			type: UserType,
			resolve: (parent, args, context) => {
				return context.api.getCommentAuthor(parent, args);
			},
		},
	}),
});
export default CommentType;

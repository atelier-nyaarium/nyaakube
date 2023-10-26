import { GraphQLObjectType } from "graphql";

const RootMutation = new GraphQLObjectType({
	name: "Mutation",
	fields: {
		// createPost: {
		// 	type: PostType,
		// 	args: {
		// 		title: { type: new GraphQLNonNull(GraphQLString) },
		// 		content: { type: new GraphQLNonNull(GraphQLString) },
		// 		authorId: { type: new GraphQLNonNull(GraphQLID) },
		// 	},
		// 	resolve(parent, args, context) {
		// 		return context.api.createPost(parent, args, context);
		// 	},
		// },
		// updatePost: {
		// 	type: PostType,
		// 	args: {
		// 		id: { type: new GraphQLNonNull(GraphQLID) },
		// 		title: { type: GraphQLString },
		// 		content: { type: GraphQLString },
		// 	},
		// 	resolve(parent, args, context) {
		// 		return context.api.updatePost(parent, args, context);
		// 	},
		// },
		// deletePost: {
		// 	type: PostType,
		// 	args: {
		// 		id: { type: new GraphQLNonNull(GraphQLID) },
		// 	},
		// 	resolve(parent, args, context) {
		// 		return context.api.deletePost(parent, args, context);
		// 	},
		// },
	},
});
export default RootMutation;

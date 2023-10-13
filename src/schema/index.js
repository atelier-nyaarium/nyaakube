import RootMutation from "@/schema/RootMutation";
import RootQuery from "@/schema/RootQuery";
import { GraphQLSchema } from "graphql";

const schema = new GraphQLSchema({
	query: RootQuery,
	mutation: RootMutation,
});
export default schema;

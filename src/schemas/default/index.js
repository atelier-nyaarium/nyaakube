import RootMutation from "@/schemas/default/RootMutation";
import RootQuery from "@/schemas/default/RootQuery";
import { GraphQLSchema } from "graphql";

const schema = new GraphQLSchema({
	query: RootQuery,
	mutation: RootMutation,
});
export default schema;

import RootMutation from "@/schemas/default/graphql/RootMutation";
import RootQuery from "@/schemas/default/graphql/RootQuery";
import { GraphQLSchema } from "graphql";

const schema = new GraphQLSchema({
	query: RootQuery,
	mutation: RootMutation,
});
export default schema;

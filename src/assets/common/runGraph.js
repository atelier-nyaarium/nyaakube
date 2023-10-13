import { GraphQLSchema, graphql } from "graphql";

export default async function runGraph({ schema, context, source }) {
	if (!(schema instanceof GraphQLSchema)) {
		throw new TypeError(
			"runGraph({ schema, context, source }) : 'schema' must be an instance of GraphQLSchema.",
		);
	}

	if (!context?.api) {
		throw new TypeError(
			"runGraph({ schema, context, source }) : 'context.api' must be defined as a collection of functions that your schema uses.",
		);
	}

	if (typeof source !== "string") {
		throw new TypeError(
			"runGraph({ schema, context, source }) : 'source' must be a GraphQL string. May be a Query or Mutation.",
		);
	}

	return await graphql({
		schema,
		source,
		contextValue: context,
	});
}

import { GraphQLSchema, graphql } from "graphql";

/**
 * Executes a GraphQL query or mutation.
 *
 * @param {Object} params - The parameters for the function.
 * @param {GraphQLSchema} params.schema - The GraphQL schema to be used.
 * @param {Object} params.context - The context to be used. Must have an 'api' property that is a collection of functions used by the schema.
 * @param {string} params.source - The GraphQL string to be executed. May be a Query or Mutation.
 *
 * @throws {TypeError} If 'params.schema' is not an instance of GraphQLSchema.
 * @throws {TypeError} If 'params.context.api' is not defined.
 * @throws {TypeError} If 'params.source' is not a string.
 *
 * @returns {Promise<Object>} A promise that resolves to the result of the GraphQL operation.
 *
 * @example
 * const schema = new GraphQLSchema({ query, mutation });
 * const context = { api: { functions for your schema } };
 * const source = `mutation { createPost . . . }`;
 * const result = await runGraph({ schema, context, source });
 * -> { "createPost": { "title": "Hi", "content": "cool" } }
 */
export async function runGraph({ schema, context, source }) {
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

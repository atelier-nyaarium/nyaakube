import { GraphQLSchema, graphql } from "graphql";
import { jsonToGraphQLQuery } from "json-to-graphql-query";

export interface RunGraphParams {
	schema: GraphQLSchema;
	context: { api: Record<string, any>; [key: string]: any };
	query?: Record<string, any>;
	source?: string;
}

/**
 * Executes a GraphQL query or mutation.
 *
 * - `params.query` and `params.source` are optional, but one must be provided.
 *
 * - If using `params.query` mode:
 *     - Outer most `query` and `mutation` keys are case sensitive for type checking.
 *     - It will default to GraphQLQuery (`query`) if you omit both.
 *
 * Uses json-to-graphql-query to convert object to query string
 * > https://www.npmjs.com/package/json-to-graphql-query
 *
 * @param params - The parameters for the GraphQL operation.
 *
 * @throws {TypeError} If 'params.schema' is not an instance of GraphQLSchema.
 * @throws {TypeError} If 'params.context.api' is not defined.
 * @throws {TypeError} If 'params.query' is not an object.
 * @throws {TypeError} If 'params.source' is not a string.
 *
 * @returns A promise that resolves to the result of the GraphQL operation.
 *
 * @example
 * const schema = new GraphQLSchema({ query: RootQuery, mutation: RootMutation });
 * const context = { api: { functions for your schema } };
 * const query = { mutation: { createPost: { __args: { where: { id: 42 } } } } };
 * const result = await runGraph({ schema, context, query });
 * -> { "createPost": { "title": "Hi", "content": "cool" } }
 */
export async function runGraph({
	schema,
	context,
	query,
	source,
}: RunGraphParams): Promise<any> {
	if (!(schema instanceof GraphQLSchema)) {
		throw new TypeError(
			"runGraph({ schema, context, query, source }) : 'schema' must be an instance of GraphQLSchema.",
		);
	}

	if (!context?.api) {
		throw new TypeError(
			"runGraph({ schema, context, query, source }) : 'context.api' must be defined as a collection of functions that your schema uses.",
		);
	}

	if (query !== undefined && typeof query !== "object") {
		throw new TypeError(
			"runGraph({ schema, context, query, source }) : 'query' is optional, but must be an object.",
		);
	}

	if (source !== undefined && typeof source !== "string") {
		throw new TypeError(
			"runGraph({ schema, context, query, source }) : 'source' is optional, but must be a string.",
		);
	}

	if (query === undefined && source === undefined) {
		throw new TypeError(
			"runGraph({ schema, context, query, source }) : 'query' or 'source' must be provided.",
		);
	}

	if (query) {
		if (!("query" in query) && !("mutation" in query)) {
			query = { query };
		}

		source = jsonToGraphQLQuery(query, { pretty: true });
	}

	return await graphql({
		schema,
		source: source!,
		contextValue: context,
	});
}

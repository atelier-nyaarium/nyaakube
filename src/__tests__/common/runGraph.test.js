import { runGraph } from "@/assets/common/runGraph";
import {
	GraphQLID,
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString,
} from "graphql";

describe("runGraph", () => {
	const UserType = new GraphQLObjectType({
		name: "User",
		fields: () => ({
			id: { type: GraphQLID },
			name: { type: GraphQLString },
			email: { type: GraphQLString },
		}),
	});

	const RootQuery = new GraphQLObjectType({
		name: "Query",
		fields: {
			getUser: {
				type: UserType,
				args: { id: { type: GraphQLID } },
				async resolve(parent, args, context) {
					return context.api.getUserById(parent, args);
				},
			},
			crashMe: {
				type: UserType,
				args: { id: { type: GraphQLID } },
				async resolve(parent, args, context) {
					return context.api.crashMe(parent, args);
				},
			},
		},
	});

	const testUser = { id: "1", name: "Mii Yuu", email: "mii.yuu@email.com" };

	const mockApi = {
		async getUserById(parent, args, context) {
			return testUser;
		},
		async crashMe(parent, args, context) {
			throw new Error("Crash!");
		},
	};

	const schema = new GraphQLSchema({ query: RootQuery });
	const context = {
		api: mockApi,
	};

	it(`should execute a GraphQL query`, async () => {
		const query = {
			getUser: {
				// matching testUser
				__args: { id: "1" },
				id: true,
				name: true,
				email: true,
			},
		};

		await expect(runGraph({ schema, context, query })).resolves.toEqual({
			data: {
				getUser: testUser,
			},
		});
	});

	it(`should return an error object if the topology is bad`, async () => {
		const query = {
			badQuery: {
				__args: { id: "1" },
				id: true,
				name: true,
				email: true,
			},
		};

		// result has key "errors"
		const result = await runGraph({ schema, context, query });
		expect(result).toHaveProperty("errors");
	});

	it(`should return an error object if the resolver failed`, async () => {
		const query = {
			crashMe: {
				__args: { id: "1" },
				id: true,
				name: true,
				email: true,
			},
		};

		// result has key "errors"
		const result = await runGraph({ schema, context, query });
		expect(result).toHaveProperty("errors");
	});

	it(`should throw an error if 'schema' is not an instance of GraphQLSchema`, async () => {
		await expect(runGraph({ schema: {}, context })).rejects.toThrow(
			TypeError,
		);
	});

	it(`should throw an error if 'context.api' is not defined`, async () => {
		await expect(runGraph({ schema, source: "" })).rejects.toThrow(
			TypeError,
		);
	});

	it(`should throw an error if 'query' is not an object`, async () => {
		await expect(
			runGraph({ schema, context, query: "not an object" }),
		).rejects.toThrow(TypeError);
	});

	it(`should throw an error if 'source' is not a string`, async () => {
		await expect(runGraph({ schema, context, source: {} })).rejects.toThrow(
			TypeError,
		);
	});

	it(`should throw an error if neither 'query' nor 'source' is provided`, async () => {
		await expect(runGraph({ schema, context })).rejects.toThrow(TypeError);
	});
});

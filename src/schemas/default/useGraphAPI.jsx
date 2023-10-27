import { fetchJSON } from "@/assets/client";
import { jsonToGraphQLQuery } from "json-to-graphql-query";
import PropTypes from "prop-types";
import React, { createContext, useCallback, useContext } from "react";

const QueryAPIContext = createContext(null);

export function useGraphAPI() {
	const api = useContext(QueryAPIContext);
	if (!api) {
		throw new Error("useGraphAPI must be used within a QueryProvider");
	}
	return api;
}

export function QueryProvider({ children, namespace = "default" }) {
	const graph = useCallback(
		async (query) => {
			return fetchJSON(`/api/graph/${namespace}`, {
				source: jsonToGraphQLQuery(query, { pretty: true }),
			});
		},
		[namespace],
	);

	return (
		<QueryAPIContext.Provider value={graph}>
			{children}
		</QueryAPIContext.Provider>
	);
}

QueryProvider.propTypes = {
	children: PropTypes.any,
	namespace: PropTypes.string,
};

/* If GraphQL is hosted in memory, use this instead:
export function QueryProvider({ children }) {
	const api = useMemo(() => new ClientAPI(), []);

	const graph = useCallback(
		(source) => {
			return runGraph({
				schema,
				context: { api },
				source OR query,
			});
		},
		[api],
	);

	return (
		<QueryAPIContext.Provider value={graph}>
			{children}
		</QueryAPIContext.Provider>
	);
}
*/

import { runGraph } from "@/assets/common";
import schema from "@/schema";
import ClientAPI from "@/schema/api/ClientAPI";
import PropTypes from "prop-types";
import React, { createContext, useCallback, useContext, useMemo } from "react";

const QueryAPIContext = createContext(null);

export function useGraphAPI() {
	const api = useContext(QueryAPIContext);
	if (!api) {
		throw new Error("useGraphAPI must be used within a QueryProvider");
	}
	return api;
}

export function QueryProvider({ children }) {
	const api = useMemo(() => new ClientAPI(), []);

	const graph = useCallback(
		(source) => {
			if (typeof source !== "string") {
				throw new Error(
					"graph(source) : 'source' must be a GraphQL string. May be a Query or Mutation.",
				);
			}

			return runGraph({
				schema,
				context: { api },
				source,
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

QueryProvider.propTypes = {
	children: PropTypes.node,
};

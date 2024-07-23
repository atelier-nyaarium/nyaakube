import { createContext, ReactNode, useContext } from "react";

const NonceContext = createContext<string | undefined>(undefined);

export function useNonce() {
	return useContext(NonceContext);
}

export function NonceProvider({
	value,
	children,
}: {
	value: string;
	children: ReactNode;
}): JSX.Element {
	return (
		<NonceContext.Provider value={value}>{children}</NonceContext.Provider>
	);
}

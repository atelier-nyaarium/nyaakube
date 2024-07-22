import { Card, CardContent, Typography } from "@mui/material";
import { memo, ReactNode, useMemo } from "react";
import { useSession } from "~/components/Session";

interface CanProps {
	children: ReactNode;
	perform: string;
	context?: Record<string, unknown>;
}

/**
 * A component that checks if the user has permission to perform an action.
 *
 * @param props.children - The children to render if the user has permission.
 * @param props.perform - The permission to check.
 * @param props.context - The context to pass to the permission checker.
 *
 * @returns The Can component.
 */
export const Can = memo(function Can({ children, perform, context }: CanProps) {
	const { session } = useSession();

	const hasAccess = useMemo(() => {
		if (session?.roles === null) return false;
		if (typeof session?.roles !== "object") return false;

		const role = session.roles[perform];

		// TODO: Handle additional context stuff

		return !!role;
	}, [perform, session.roles]);

	return (
		<>
			{hasAccess ? (
				children
			) : (
				<Card>
					<CardContent>
						<Typography variant="h5">Access Denied</Typography>
						<Typography variant="body1">
							You do not have permission to view this resource.
						</Typography>
					</CardContent>
				</Card>
			)}
		</>
	);
});

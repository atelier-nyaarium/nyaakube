import { useSession } from "@/components/Session";
import { Card, CardContent, Typography } from "@mui/material";
import PropTypes from "prop-types";
import React, { useMemo } from "react";

/**
 * A component that checks if the user has permission to perform an action.
 *
 * @param {Object} props.children - The children to render if the user has permission.
 * @param {string} props.perform - The permission to check.
 * @param {Object} [props.context] - The context to pass to the permission checker.
 *
 * @returns {JSX.Element} The Can component.
 */
export default function Can({ children, perform, context }) {
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
}

Can.propTypes = {
	children: PropTypes.any,
	perform: PropTypes.string.isRequired,
	context: PropTypes.object,
};

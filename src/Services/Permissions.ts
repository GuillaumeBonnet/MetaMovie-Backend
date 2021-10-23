import { isUserLogged } from "../Utils/userUtils";

type Role = "ANONYMOUS" | "LOGGED";
type Permission =
	| "READ_DECKS"
	| "CREATE_DECKS"
	| "EDIT_OWN_DECKS"
	| "DELETE_OWN_DECKS";

type ObjectPermission = "DELETE" | "EDIT";

const permissionMap = new Map<Role, Permission[]>();
permissionMap.set("ANONYMOUS", ["READ_DECKS"]);
permissionMap.set("LOGGED", [
	"READ_DECKS",
	"CREATE_DECKS",
	"EDIT_OWN_DECKS",
	"DELETE_OWN_DECKS",
]);

const getRole = (userId: number) => {
	const role: Role = userId ? "LOGGED" : "ANONYMOUS";
	return role;
};

const getDeckPermissions = (deck: { userId: number }, userId: number) => {
	const permissions: ObjectPermission[] = [];
	for (const perm of permissionMap.get(getRole(userId)) || []) {
		if (perm == "DELETE_OWN_DECKS") {
			if (deck.userId == userId) {
				permissions.push("DELETE");
			}
		} else if (perm == "EDIT_OWN_DECKS") {
			if (deck.userId == userId) {
				permissions.push("EDIT");
			}
		}
	}
	return permissions;
};

const hasPermission = (
	req: Parameters<typeof isUserLogged>[0],
	permission: Permission
) => {
	return !!permissionMap
		.get(getRole(req.session?.userId))
		?.includes(permission);
};
export type { Permission, ObjectPermission };
export { permissionMap, getDeckPermissions, getRole, hasPermission };

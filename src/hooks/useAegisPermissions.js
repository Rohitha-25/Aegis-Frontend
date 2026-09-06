import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

function decodeJwtPayload(token) {
    try {
        const payload = token.split(".")[1];

        const normalized = payload
                        .replace(/-/g, "+")
                        .replace(/_/g, "/");

        const decoded = atob(normalized);

        return JSON.parse(decoded);
    } catch (error) {
        console.error("Unable to decode access token: ", error);
        return {};
    }
}

function useAegisPermissions() {
    const {isAuthenticated, getAccessTokenSilently} = useAuth0();

    const [permissions, setPermissions] = useState([]);

    useEffect(() => {
        const loadPermissions = async () => {
            if (!isAuthenticated) {
                setPermissions([]);
                return;
            }

            try {
                const token = await getAccessTokenSilently({
                    authorizationParams: {
                        audience: "https://aegisagent-api"
                    }
                });

                const payload = decodeJwtPayload(token);

                setPermissions(payload.permissions || []);
            } catch (error) {
                console.error("Unable to load permissions: ", error);
                setPermissions([]);
            }
        };

        loadPermissions();
    }, [
        isAuthenticated,
        getAccessTokenSilently
    ]);

    return {
        permissions,
        isAdmin: permissions.includes("agent:manage"),
    };
}

export default useAegisPermissions;
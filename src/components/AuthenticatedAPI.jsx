import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import api from "../services/api";

function AuthenticatedAPI({ children }) {
    
    const { getAccessTokenSilently } = useAuth0();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const requestInterceptor = api
                                    .interceptors
                                    .request
                                    .use(
                                        async (config) => {

                                            const token = await getAccessTokenSilently({
                                                    authorizationParams: {
                                                        audience: "https://aegisagent-api",
                                                        scope: "agent:read agent:execute agent:manage"
                                                    }
                                            });

                                            config.headers = config.headers || {};
                                            config.headers.Authorization = `Bearer ${token}`;

                                            return config;
                                        }
                                    );
        setReady(true)

        return () => {
            api
            .interceptors
            .request
            .eject(
                requestInterceptor
            );
        };

    }, [getAccessTokenSilently]);

    if (!ready) {
        return null;
    }

    return children;
}

export default AuthenticatedAPI;
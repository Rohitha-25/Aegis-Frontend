import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import api from "../services/api";

function AuthenticatedAPI({ children }) {
    
    const { getAccessTokenSilently } = useAuth0();

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

        return () => {
            api
            .interceptors
            .request
            .eject(
                requestInterceptor
            );
        };

    }, [getAccessTokenSilently]);

    return children;
}

export default AuthenticatedAPI;
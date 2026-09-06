import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import api from "../services/api";
import useAegisPermissions from "../hooks/useAegisPermissions";
import StatusBadge from "../components/StatusBadge";

function Security() {
    const [auditEvents, setAuditEvents] = useState([]);
    const [riskEvents, setRiskEvents] = useState([]);
    const [privilegeRequests, setPrivilegeRequests] = useState([]);

    const {isAuthenticated, isLoading} = useAuth0();

    const { isAdmin } = useAegisPermissions();

    const [error, setError] = useState("");

    useEffect(() => {
        if (isAuthenticated && isAdmin) {
            loadSecurityData();
        }
    }, [isAuthenticated, isAdmin]);

    const loadSecurityData = async () => {
        try {
            setError("");

            const [
                auditResponse,
                riskResponse,
                pamResponse
            ] = await Promise.all([
                api.get("/audit"),
                api.get("/risk"),
                api.get("/pam")
            ]);

            setAuditEvents(auditResponse.data);
            setRiskEvents(riskResponse.data);
            setPrivilegeRequests(pamResponse.data);

        } catch (error) {
            console.error("Failed to load security data: ", error);
            setError("Security data could not be loaded.");
        }
    };

    if (isLoading) {
        return <div>Loading..</div>;
    }

    if (!isAuthenticated) {
        return (
            <div className="page">
                <div className="page-message">
                    <h1>Authentication Required!</h1>
                    <p>Please login to view security info.</p>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="access-denied">
                <h1>Security Center</h1>
                <p>
                    Administrator privileges are required
                    to access the security monitoring.
                </p>
            </div>
        );
    }

    return (
        <div className="page">

            <h1>Security Center</h1>

            {error && (
                <p className="error">{error}</p>
            )}

            <section>

                <h2>Risk Events</h2>

                {riskEvents.length === 0 ? (
                    <p>No risk events.</p>
                ) : (
                    <div className="security-events">
                        {riskEvents.map(event => (
                            <div className="security-card" key={event.id}>
                                <h3>{event.eventType}</h3>
                                <p>Agent: {event.agent?.agentIdentifier}</p>
                                <p>Risk:{" "}
                                    <span className={`risk-${event.riskLevel.toLowerCase()}`}>
                                        {event.riskLevel}
                                    </span>
                                </p>
                                <p>{event.reason}</p>
                            </div>
                        ))}
                    </div>
                )}

            </section>

            <section>

                <h2>Audit Events</h2>

                {auditEvents.length === 0 ? (
                    <p>No audit events.</p>
                ) : (
                    <div className="security-events">
                        {auditEvents.map(event => (
                            <div className="security-card" key={event.id}>
                                <p>
                                    <strong>{event.eventType}</strong>
                                </p>
                                <p>Agent: {event.agent?.agentIdentifier}</p>
                                <p>Action: {event.action}</p>
                                <p>Decision:{" "}
                                    <span className={`decision-${event.decision.toLowerCase()}`}>
                                        {event.decision}
                                    </span>
                                </p>
                                <p>Reason: {event.reason}</p>
                            </div>
                        ))}
                    </div>
                )}

            </section>

            <section>

                <h2>Privileged Requests</h2>

                {privilegeRequests.length === 0 ? (
                    <p>No requests made.</p>
                ) : (
                    <div className="security-events">
                        {privilegeRequests.map(request => (
                            <div className="security-card" key={request.id}>
                                <p>
                                    <strong>{request.requestId}</strong>
                                </p>
                                <p>Agent: {request.agent?.agentIdentifier}</p>
                                <p>Operation: {request.operation}</p>
                                <p>Resource: {request.resource}</p>
                                <p>Status: <StatusBadge status={request.status} /></p>
                            </div>
                        ))}
                    </div>
                )}

            </section>
        </div>
    );
}

export default Security;
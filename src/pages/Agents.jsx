import { useEffect, useState } from "react";
import api from "../services/api";
import AgentCard from "../components/AgentCard";
import { useAuth0 } from "@auth0/auth0-react";
import useAegisPermissions from "../hooks/useAegisPermissions";

function Agents() {
    const [agents, setAgents] = useState([]);
    const [error, setError] = useState("");

    const {isAuthenticated, isLoading} = useAuth0();

    const {isAdmin} = useAegisPermissions();

    useEffect(() => {
        if (isAuthenticated) {
            loadAgents();
        }
    }, [isAuthenticated]);

    const loadAgents = async () => {
        try {
            const response = await api.get("/agents");
            setAgents(response.data);
        } catch (error) {
            console.error("Failed to load agents: ", error);
        }
    };

    const updateAgentStatus = async (agentId, action) => {
        try {
            setError("");

            const response = await api.put(`/agents/${agentId}/${action}`);

            setAgents(currentAgents => currentAgents.map(
                agent => agent.id === agentId ? response.data : agent
            ));
        } catch (error) {
            console.error(`Failed to ${action} agent: `, error);
            setError(
                error.response?.data?.message || 
                `Failed to ${action} agent.`
            );
        }
    };

    const activateAgent = (agentId) => updateAgentStatus(agentId, "active");
    const suspendAgent = (agentId) => updateAgentStatus(agentId, "suspend");
    const revokeAgent = (agentId) => updateAgentStatus(agentId, "revoke");

    if (isLoading) {
        return <div>Loading..</div>;
    }

    if (!isAuthenticated) {
        return (
            <div className="page">
                <div className="page-message">
                    <h1>Authentication Required!</h1>
                    <p>Please login to view agents.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page">

            <h1>Agent Team</h1>

            {error && (
                <p className="error">{error}</p>
            )}

            <div className="agent-grid">
                {agents.map(agent => (
                    <AgentCard 
                        key={agent.id} 
                        agent={agent}
                        isAdmin={isAdmin}
                        onActivate={activateAgent}
                        onSuspend={suspendAgent}
                        onRevoke={revokeAgent}
                    />
                ))}
            </div>

        </div>
    );
}

export default Agents;
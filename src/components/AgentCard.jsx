import StatusBadge from "./StatusBadge";
import agentConfig from "../data/agentConfig";

function AgentCard({ 
            agent,
            isAdmin,
            onActivate,
            onSuspend,
            onRevoke
}) {

    return (
        <div className="agent-card">

            <div className="agent-icon">
                {agentConfig[agent.agentIdentifier?.toUpperCase()]?.icon || "🤖"}
            </div>

            <h3>{agent.agentIdentifier}</h3>

            <p className="agent-name">
                {agent.agentName}
            </p>

            <p className="agent-role">
                {agentConfig[agent.agentIdentifier?.toUpperCase()]?.title || "A.E.G.I.S. Agent"}
            </p>

            <div className="agent-details">

                <p>
                    <strong>Description: </strong>
                    {agent.description}
                </p>
                <p>
                    <strong>Status: </strong>
                    <StatusBadge status={agent.status} />
                </p>
                <p>
                    <strong>Owner: </strong>
                    {agent.owner}
                </p>
                <p>
                    <strong>Purpose: </strong>
                    {agent.purpose}
                </p>

            </div>

            {isAdmin && (
                <div className="agent-actions">

                    {agent.status === "REGISTERED" && (
                        <button 
                            className="agent-action activate"
                            onClick={() => onActivate(agent.id)}
                        >
                            Activate
                        </button>
                    )}

                    {agent.status === "ACTIVE" && (
                        <button
                            className="agent-action suspend"
                            onClick={() => onSuspend(agent.id)}
                        >
                            Suspend
                        </button>
                    )}

                    {agent.status !== "REVOKED" && agent.status !== "RETIRED" && (
                        <button
                            className="agent-action revoke"
                            onClick={() => {
                                const confirm = window.confirm(
                                    `Are you sure you want to revoke ${agent.agentName}?`
                                );

                                if (confirm) {
                                    onRevoke(agent.id);
                                }
                            }}
                        >
                            Revoke
                        </button>
                    )}

                </div>
            )}

        </div>
    );
}

export default AgentCard;
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import api from "../services/api";
import agentConfig from "../data/agentConfig";
import { useNavigate } from "react-router-dom";

function Tasks() {
    const [agents, setAgents] = useState([]);
    const [agentId, setAgentId] = useState("");
    const [request, setRequest] = useState("");
    const [result, setResult] = useState(null);
    const [loadingAgents, setLoadingAgents] = useState(true);
    const [executing, setExecuting] = useState(false);

    const navigate = useNavigate();

    const {isAuthenticated, isLoading} = useAuth0();

    const [error, setError] = useState("");

    useEffect(() => {
        if (isAuthenticated) {
            loadAgents();
        }
    }, [isAuthenticated]);

    const loadAgents = async () => {
        try {
            setError("");

            const response = await api.get("/agents");
            setAgents(response.data);
        } catch (error) {
            console.error("Failed to load agents: ", error);
            setError("Failed to load available agents.");
        } finally {
            setLoadingAgents(false);
        }
    };

    const executeTask = async () => {
        if (!agentId) {
            setError("Please select an agent.");
            return;
        }

        if (!request.trim()) {
            setError("Please enter a request.");
            return;
        }

        try {
            setError("");
            setResult(null);
            setExecuting(true);

            const response = await api.post("/tasks", {
                agentId: Number(agentId),
                request: request.trim()
            });

            setResult(response.data);
        } catch (error) {
            console.error("Task execution failed: ", error);

            setError (
                error.response?.data?.message || "Task execution failed."
            );
        } finally {
            setExecuting(false);
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
                    <p>Please login to use agent tasks.</p>
                </div>
            </div>
        );
    }

    const selectedAgent = agents.find(
        agent => agent.id === Number(agentId)
    );

    const selectedCapability = agentConfig[selectedAgent?.agentIdentifier?.toUpperCase()];

    return (
        <div className="task-page-header">

            <h1>Agent Tasks</h1>
            <p>Select an A.E.G.I.S. agent and interact with its authorized capabilities.</p>

            <div className="task-form">

                <select
                    id="agent"
                    value={agentId}
                    onChange={(e) => {
                        setAgentId(e.target.value);
                        setRequest("");
                        setResult(null);
                        setError("");
                    }}
                    disabled={loadingAgents || executing}
                >
                    <option value="">
                        -- Select an Agent --
                    </option>

                    {agents.map(agent => (
                        <option
                            key={agent.id}
                            value={agent.id}
                            disabled={agent.status !== "ACTIVE"}
                        >
                            {agentConfig[agent.agentIdentifier?.toUpperCase()]?.icon || "🤖"}{" "}
                            {agent.agentIdentifier} ({agent.status})
                        </option>
                    ))}

                </select>

                {selectedAgent && selectedCapability && (
                    <div className="selected-agent">

                        <div className="selected-agent-content">

                            <div className="selected-agent-title">
                                <span>{selectedCapability.icon}</span>
                                <h3>{selectedAgent.agentName}</h3>
                            </div>

                            <p className="agent-capability">
                                {selectedCapability.title}
                            </p>

                            <p>
                                {selectedCapability.description}
                            </p>

                        </div>
                    </div>
                )}

                {selectedAgent?.agentIdentifier?.toUpperCase() === "ORACLE" ? (
                    <button
                        type="button"
                        onClick={() => navigate("/knowledge-base")}
                    >
                        ↪ Knowledge Base
                    </button>

                ) : (
                    <>
                        <textarea
                            id="request"
                            value={request}
                            onChange={(e) => setRequest(e.target.value)}
                            placeholder={
                                selectedCapability?.placeholder ||
                                "What task should the agent take on?"
                            }
                            disabled={executing}
                        />

                        <button
                            onClick={executeTask}
                            disabled={executing || loadingAgents}
                        >
                            {executing
                                ? "Executing.."
                                : selectedCapability?.buttonText ||
                                "Execute Task"}
                        </button>
                    </>

                )}
            </div>

            {error && (<p className="error">{error}</p>)}

            {result && (
                <div className="result-card">

                    <div className="result-header">
                        <h2>Task Result</h2>

                        <span 
                            className={`task-status status-${result.status?.toLowerCase()}`}
                        >
                            {result.status}
                        </span>
                    </div>

                    <div className="result-meta">

                        <div>
                            <span>Task ID</span>
                            <strong>{result.taskId}</strong>
                        </div>

                        <div>
                            <span>Agent</span>
                            <strong>
                                {result.agent?.agentIdentifier}
                            </strong>
                        </div>

                    </div>

                    <div className="result-response">
                        <h3>Response</h3>
                        <div className="result-response-content">
                            {result.response}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Tasks;
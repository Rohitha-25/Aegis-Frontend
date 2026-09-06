import { useEffect, useState } from 'react'
import api from '../services/api';
import AgentCard from '../components/AgentCard';
import { useAuth0 } from '@auth0/auth0-react';
import useAegisPermissions from '../hooks/useAegisPermissions';

function Dashboard() {
    const [agents, setAgents] = useState([]);
    const [riskEvents, setRiskEvents] = useState([]);
    const [auditEvents, setAuditEvents] = useState([]);

    const {isAuthenticated, isLoading, loginWithRedirect, user} = useAuth0();

    const { isAdmin } = useAegisPermissions();

    useEffect(() => {
        if (isAuthenticated) {
            loadDashboard();
        }
    }, [isAuthenticated, isAdmin]);

    const loadDashboard = async () => {
        try {
            const agentsResponse = await api.get("/agents");
            setAgents(agentsResponse.data);

            if (isAdmin) {
                const riskResponse = await api.get("/risk");
                const auditResponse = await api.get("/audit");
                setRiskEvents(riskResponse.data);
                setAuditEvents(auditResponse.data);
            }

        } catch (error) {
            console.error("Failed to load agents:", error);
        }
    };

    if (isLoading) {
        return <div>Loading..</div>;
    }

    if (!isAuthenticated) {
        return (
            <div className="login-page">
                <div className="login-card">
                    <img
                        src="/aegis-logo.png"
                        alt="Aegis"
                        className="login-logo"
                    />
                    <h1>A.E.G.I.S.</h1>
                    <h4>
                        AI Enterprise Governance & Identity Security
                    </h4>

                    <button onClick={() => loginWithRedirect()}>
                        Login with Auth0
                    </button>
                </div>
            </div>
        );
    }

    const firstName = user?.given_name || 
                      user?.name?.trim().split(/\s+/)[0] || 
                      user?.email?.split("@")[0] ||
                      "User";

    return (
        <div className='dashboard'>

            <div className='dashboard-header'>
                <div>
                    <h2>A.E.G.I.S.</h2>
                    <p>AI Enterprise Governance & Identity Security</p>
                </div>

                <div className='user-menu'>
                    <h4>Hi, {firstName}</h4>
                    <span className='role-badge'>
                        {isAdmin ? "ADMIN" : "USER"}
                    </span>
                </div>
            </div>

            <div className='stats'>

                <div className='stat-card'>
                    <h3>Agents Count</h3>
                    <p>{agents.length}</p>
                </div>

                <div className='stat-card'>
                    <h3>Active Agents</h3>
                    <p>
                        {
                            agents.filter(
                                agent => agent.status === "ACTIVE"
                            ).length
                        }
                    </p>
                </div>

                {isAdmin && (
                    <>
                        <div className='stat-card'>
                            <h3>Risk Events</h3>
                            <p>{riskEvents.length}</p>
                        </div>

                        <div className='stat-card'>
                            <h3>Audit Events</h3>
                            <p>{auditEvents.length}</p>
                        </div>
                    </>
                )}

            </div>

            <section>

                <h2>Agent Team</h2>

                <div className='agent-grid'>
                    
                    {agents.map(agent => (
                        <AgentCard key={agent.id} agent={agent} />
                    ))}
                    
                </div>

            </section>

            <section className='security-overview'>
                
                <h2>Security Overview</h2>

                <div className='security-grid'>

                    <div className='security-card'>
                        <h3>Authentication</h3>
                        <p>Auth0 + OAuth 2.0 + JWT</p>
                    </div>

                    <div className='security-card'>
                        <h3>Authorization</h3>
                        <p>Scope-based least privilege</p>
                    </div>

                    <div className='security-card'>
                        <h3>Workload Identity</h3>
                        <p>SPIFFE-inspired Identity Model</p>
                    </div>

                    <div className='security-card'>
                        <h3>Privileged Access</h3>
                        <p>PAM + JIT</p>
                    </div>

                </div>

            </section>
        </div>
    );
}

export default Dashboard;
import { Link } from "react-router-dom";
import useAegisPermissions from "../hooks/useAegisPermissions";
import { useAuth0 } from "@auth0/auth0-react";

function Navbar() {
    const {isAuthenticated, logout} = useAuth0();

    const { isAdmin } = useAegisPermissions();

    return (
        <nav className="navbar">

            <div className="logo">
                A.E.G.I.S.
            </div>

            <div className="nav-links">

                {isAuthenticated && (
                    <>
                        <Link to="/">Dashboard</Link>
                        <Link to="/agents">Agents</Link>
                        <Link to="/knowledge-base">
                            Knowledge Base
                        </Link>
                        <Link to="/tasks">Tasks</Link>
                        {isAdmin && (
                            <Link to="/security">
                                Security
                            </Link>
                        )}

                        <button className='logout-button'
                            onClick={() => logout({
                                logoutParams: {
                                    returnTo: window.location.origin
                                }
                            })}
                        >
                            Logout
                        </button>
                    </>
                )}

            </div>

        </nav>
    );
}

export default Navbar;
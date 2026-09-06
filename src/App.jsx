import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Agents from "./pages/Agents";
import Tasks from "./pages/Tasks";
import Security from "./pages/Security";
import KnowledgeBase from "./pages/KnowledgeBase";



function App() {
    return (
        <BrowserRouter>

            <Navbar />

            <Routes>

                <Route 
                    path="/"
                    element={<Dashboard />}
                />

                <Route 
                    path="/agents"
                    element={<Agents />}
                />

                <Route 
                    path="/knowledge-base"
                    element={<KnowledgeBase />}
                />

                <Route 
                    path="/tasks"
                    element={<Tasks />}
                />

                <Route 
                    path="/security"
                    element={<Security />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;
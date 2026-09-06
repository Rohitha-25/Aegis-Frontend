import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import useAegisPermissions from "../hooks/useAegisPermissions";
import api from "../services/api";

function KnowledgeBase() {
    const [documents, setDocuments] = useState([]);
    const [file, setFile] = useState(null);
    const [category, setCategory] = useState("Security");

    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [question, setQuestion] = useState("");
    const [oracleResponse, setOracleResponse] = useState(null);
    const [askingOracle, setAskingOracle] = useState(false);

    const [oracle, setOracle] = useState(null);

    const { isAuthenticated, isLoading } = useAuth0();
    const { isAdmin } = useAegisPermissions();

    useEffect(() => {
        if (isAuthenticated) {
            loadDocuments();
            loadOracle();
        }
    }, [isAuthenticated]);

    const loadDocuments = async () => {
         try {
            setError("");

            const response = await api.get("/documents");

            setDocuments(response.data);
        } catch (error) {
            console.error("Failed to load documents:", error);
            setError("Unable to load the knowledge base.");
        } finally {
            setLoading(false);
        }
    };

    const loadOracle = async () => {
        try {
            const response = await api.get("/agents");
            const oracleAgent = response.data.find(
                agent => agent.agentIdentifier?.toUpperCase() === "ORACLE"
            );

            setOracle(oracleAgent || null);
        } catch (error) {
            console.error("Failed to load Oracle: ", error);
            setError("Unable to load Oracle.");
        }
    };

    const handleUpload = async (event) => {
        event.preventDefault();

        if (!file) {
            setError("Please select a document.");
            return;
        }

        try {
            setError("");
            setSuccess("");
            setUploading(true);

            const formData = new FormData();

            formData.append("file", file);
            formData.append("category", category);

            const response = await api.post(
                "/documents/upload",
                formData
            );

            setDocuments((current) => [
                ...current,
                response.data
            ]);

            setFile(null);

            event.target.reset();

            setSuccess(
                `"${response.data.title}" was uploaded successfully.`
            );

        } catch (error) {
            console.error("Document upload failed:", error);

            setError(
                error.response?.data?.message ||
                "Document upload failed."
            );
        } finally {
            setUploading(false);
        }
    };

    const askOracle = async (event) => {
        event.preventDefault();

        if (!question.trim()) {
            setError("Please ask Oracle a question.");
            return;
        }

        if (!oracle) {
            setError("Oracle agent is not available.");
            return;
        }

        if (oracle.status !== "ACTIVE") {
            setError("Oracle is currently inactive.");
            return;
        }

        try {
            setError("");
            setOracleResponse(null);
            setAskingOracle(true);

            const response = await api.post("/tasks", {
                agentId: oracle.id,
                request: question.trim()
            });

            setOracleResponse(response.data);

        } catch (error) {
            console.error("Oracle request failed:", error);

            setError(
                error.response?.data?.message ||
                error.message ||
                "Oracle could not process your question."
            );
        } finally {
            setAskingOracle(false);
        }
    };

    if (isLoading) {
        return <div>Loading..</div>
    }

    if (!isAuthenticated) {
        return (
            <div className="page">
                <div className="page-message">
                    <h1>Authentication Required!</h1>
                    <p>Please login to access the knowledge base.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page-header">
                <h1>Knowledge Base</h1>

                <p>
                    Browse approved enterprise documents and use Oracle
                    to answer questions from their content.
                </p>
            </div>

            {isAdmin && (
                <section className="knowledge-upload-card">
                    <div className="knowledge-section-header">
                        <div>
                            <h2>Add an Enterprise Document</h2>

                            <p>
                                Upload a PDF or text document to add it to
                                the Aegis knowledge base.
                            </p>
                        </div>
                    </div>

                    <form
                        className="document-upload-form"
                        onSubmit={handleUpload}
                    >

                        <div className="form-group">

                            <label htmlFor="document-file">
                                Document
                            </label>

                            <input
                                id="document-file"
                                type="file"
                                accept=".pdf,.txt"
                                onChange={(event) =>
                                    setFile(event.target.files[0] || null)
                                }
                                disabled={uploading}
                            />

                        </div>

                        <div className="form-group">

                            <label htmlFor="document-category">
                                Category
                            </label>

                            <select
                                id="document-category"
                                value={category}
                                onChange={(event) =>
                                    setCategory(event.target.value)
                                }
                                disabled={uploading}
                            >
                                <option value="Security">
                                    Security
                                </option>

                                <option value="Identity">
                                    Identity
                                </option>

                                <option value="Tools">
                                    Tools
                                </option>

                                <option value="Privileged Access">
                                    Privileged Access
                                </option>

                                <option value="Non-Human Identity">
                                    Non-Human Identity
                                </option>

                                <option value="Workload Identity">
                                    Workload Identity
                                </option>

                                <option value="Audit">
                                    Audit
                                </option>

                                <option value="Security Investigation">
                                    Security Investigation
                                </option>

                                <option value="Governance">
                                    Governance
                                </option>
                            </select>

                        </div>

                        <button
                            type="submit"
                            disabled={uploading}
                        >
                            {uploading
                                ? "Uploading.."
                                : "Upload Document"}
                        </button>
                    </form>
                </section>
            )}

            {error && (
                <p className="error">{error}</p>
            )}

            {success && (
                <p className="success">{success}</p>
            )}

            <section className="knowledge-documents">

                <div className="knowledge-section-header">
                    <div>
                        <h2>Enterprise Documents</h2>
                        <p>
                            Documents currently available to Oracle.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <p>Loading documents...</p>
                ) : documents.length === 0 ? (
                    <div className="empty-state">
                        <h3>No documents yet!</h3>

                        <p>
                            Upload an approved enterprise document to
                            start building the knowledge base.
                        </p>
                    </div>
                ) : (
                    <div className="document-grid">

                        {documents.map((document) => (
                            <div
                                className="document-card"
                                key={document.id}
                            >

                                <div className="document-card-top">

                                    <span className="document-icon">
                                        📄
                                    </span>

                                    <span className="document-category">
                                        {document.category}
                                    </span>

                                </div>

                                <h3>
                                    {document.title}
                                </h3>

                                <p>
                                    Uploaded document available for
                                    Oracle's semantic search.
                                </p>

                                <span className="document-id">
                                    Document {document.id}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="oracle-section">
                <div className="knowledge-section-header">
                    <div>
                        <h2>Ask Oracle</h2>
                        <p>
                            Ask questions about the approved enterprise
                            documents in the knowledge base.
                        </p>
                        <p className="oracle-agent-status">
                            {oracle
                                ? oracle.status === "ACTIVE"
                                    ? "Oracle is ready to answer questions."
                                    : "Oracle is currently inactive."
                                : "Oracle agent is unavailable."}
                        </p>
                    </div>
                </div>

                <form
                    className="oracle-question-form"
                    onSubmit={askOracle}
                >
                    <textarea
                        value={question}
                        onChange={(event) =>
                            setQuestion(event.target.value)
                        }
                        placeholder="Eg: What controls apply to non-human identities?"
                        disabled={askingOracle}
                    />

                    <button
                        type="submit"
                        disabled={askingOracle}
                    >
                        {askingOracle
                            ? "Oracle is thinking.."
                            : "Ask Oracle"}
                    </button>
                </form>

                {oracleResponse && (
                    <div className="oracle-response-card">

                        <div className="oracle-response-header">

                            <div>
                                <span className="result-label">
                                    ORACLE RESPONSE
                                </span>
                                <h3>
                                    Knowledge & Document Agent
                                </h3>
                            </div>

                            <span
                                className={`result-status status-${oracleResponse.status?.toLowerCase()}`}
                            >
                                {oracleResponse.status}
                            </span>

                        </div>

                        <div className="oracle-response-content">
                            {oracleResponse.response}
                        </div>

                    </div>
                )}

            </section>
        </div>
    );
}

export default KnowledgeBase;
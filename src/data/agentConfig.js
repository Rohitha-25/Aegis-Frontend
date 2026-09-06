const agentConfig = {
    ORACLE: {
        icon: "⚡",
        title: "Knowledge & Document Agent",
        description:
            "Answers questions using the approved enterprise knowledge base.",
        placeholder:
            "Eg: What controls apply to non-human identities?",
        buttonText: "Ask Oracle"
    },

    SHADOW: {
        icon: "🐈‍⬛",
        title: "Security Investigation Agent",
        description:
            "Searches security audit events and analyzes suspicious activity.",
        placeholder:
            "Eg: Why was Oracle allowed to use document.search?",
        buttonText: "Investigate"
    },

    TITAN: {
        icon: "💪",
        title: "Privileged Operations Agent",
        description:
            "Requests and performs approved privileged operations through PAM and JIT access.",
        placeholder:
            "Eg: Request access to restart the demo-service.",
        buttonText: "Request Privileged Access"
    },

    FORGE: {
        icon: "🦾",
        title: "Engineering Agent",
        description:
            "Analyzes code and engineering artifacts for technical and security issues.",
        placeholder:
            "Eg: Review this service for security issues.",
        buttonText: "Execute"
    },

    SENTINEL: {
        icon: "🛡️",
        title: "Governance Agent",
        description:
            "Supports governance, policy review, and compliance analysis.",
        placeholder:
            "Eg: Identify the controls required for this policy.",
        buttonText: "Execute"
    },

    WEB: {
        icon: "🕸️",
        title: "Research Agent",
        description:
            "Performs approved external research and information gathering.",
        placeholder:
            "Eg: Research the latest security guidance for this topic.",
        buttonText: "Research"
    },

    VISION: {
        icon: "🧠",
        title: "Analysis & Orchestration Agent",
        description:
            "Coordinates information and helps route tasks to appropriate agents.",
        placeholder:
            "Eg: Analyze this request and suggest the appropriate agent.",
        buttonText: "Orchestrate"
    }
};

export default agentConfig;
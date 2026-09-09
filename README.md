## A.E.G.I.S. — Frontend

### Overview
A.E.G.I.S. (AI Enterprise Governance & Identity Security) is an avengers-inspired security-focused multi-agent platform that demonstrates authentication, least-privilege authorization, tool governance, auditability, risk controls, PAM/JIT workflows and AI-assisted knowledge/security analysis.

The frontend follows a key principle:
It presents capabilities based on the authenticated user's permissions and delegates authorization to the backend.

### Features
- Auth0 Universal Login with OAuth 2.0 / OIDC
- JWT access-token acquisition for the A.E.G.I.S. API
- Role-aware UI for Aegis Admin and Aegis User
- Agent dashboard and lifecycle visibility
- Oracle knowledge-base experience
- Shadow security-investigation experience
- Titan privileged-operation workflow
- Security and audit visibility for administrators
- Protected Axios API calls with bearer-token injection
- Responsive dark-themed enterprise dashboard

### Frontend Architecture
```
Browser
  ↓
React + Vite
  ↓
Auth0 React SDK
  ↓
Access Token
  ↓
Axios API Client
  ↓
Spring Boot Backend
```

### Authentication & Authorization
```
Auth0 Universal Login
       ↓
Access Token
       ↓
Authorization: Bearer <token>
       ↓
Spring Security
       ↓
API permission enforcement
```

#### Application permissions:
<table>
  <tr>
    <th>Role</th>
    <th>Permissions</th>
  </tr>

  <tr>
    <td>Aegis User</td>
    <td>agent:read, agent:execute</td>
  </tr>

  <tr>
    <td>Aegis Admin</td>
    <td>agent:read, agent:execute, agent:manage</td>
  </tr>
</table>

The frontend uses the user's effective authorization state to display role-aware functionality, while the backend remains the authoritative enforcement point.

### Agents
#### Oracle
Oracle is the knowledge and document retrieval agent. Users can submit natural-language questions, which the backend resolves through semantic document retrieval and Gemini-generated responses.
#### Shadow
Shadow is the security investigation agent. It searches semantic representations of audit events and uses Gemini to analyze potentially suspicious or denied activity.
#### Titan
Titan is the privileged operations agent. Requests for sensitive operations are routed through the backend's PAM/JIT workflow before a simulated privileged operation is performed.

### Tech Stack
<table>
  <tr>
    <th>Category</th>
    <th>Technology</th>
  </tr>

  <tr>
    <td>UI & Build</td>
    <td>React + Vite</td>
  </tr>

  <tr>
    <td>Routing</td>
    <td>React Router</td>
  </tr>

  <tr>
    <td>Authentication</td>
    <td>Auth0</td>
  </tr>

  <tr>
    <td>HTTP</td>
    <td>Axios</td>
  </tr>
</table>

### Project Structure
```
src/
├── components/       # Reusable UI components
├── hooks/            # Permission/auth related hooks
├── pages/            # Dashboard, Agents, Knowledge Base, Tasks, Security
├── services/         # Axios API client
├── App.jsx           # Application routing / composition
└── main.jsx          # Application entry point
```

### Local Setup

#### Prerequisites
- Node.js 18+
- npm 9+

#### 1. Clone
```
git clone https://github.com/Rohitha-25/Aegis-Frontend.git
cd Aegis-Frontend
```

#### 2. Install Dependencies
```
npm install
```

#### 3. Configure environment variables
Create a .env file in the project root:
```
VITE_API_URL=http://localhost:8080/api
VITE_AUTH0_DOMAIN=your-auth0-domain
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
```

#### 3. Run
```
npm run dev
```

#### Related Repository
https://github.com/Rohitha-25/Aegis-Backend

# Vulnerable MCP Server

> **⚠️ WARNING: DO NOT DEPLOY THIS SERVER IN A PRODUCTION ENVIRONMENT.**
> This server is **INTENTIONALLY VULNERABLE** and contains remote code execution, SQL injection, and other security flaws. It is designed solely for educational purposes and for testing MCP security scanners.

## Overview

This is a Model Context Protocol (MCP) server implementation that operates over HTTP (SSE/POST). It mimics a legitimate server but includes several common security vulnerabilities to serve as a target for security testing tools.

## Features & Vulnerabilities

The server implements the following tools, each harboring specific vulnerabilities:

1.  **SQL Injection** (`get_user_details`)
    -   Input is directly concatenated into a SQLite query.
    -   Allows dumping the database (including passwords).

2.  **Command Injection / RCE** (`cleanup_logs`)
    -   Input is passed directly to `child_process.exec`.
    -   Allows executing arbitrary system commands.

3.  **Shadow Tools** (`debug_access`)
    -   A hidden tool that is callable but does not appear in the `listTools` response.
    -   Simulates undocumented or "shadow" functionality.

4.  **Data Exfiltration** (`submit_feedback`)
    -   Simulates sending user input to an external malicious server.

5.  **Tool Poisoning** (`configure_server`)
    -   Allows unauthenticated modification of server configuration state.

6.  **Cross-Origin Resource Sharing (CORS)**
    -   Configured with `Access-Control-Allow-Origin: *`, allowing any website to interact with the local server.

## Vulnerability Matrix

| Component / Tool | Vulnerability Type | Severity | Description |
| :--- | :--- | :--- | :--- |
| `get_user_details` | SQL Injection (SQLi) | **Critical** | Unsanitized string concatenation in SQL query allows database dump. |
| `cleanup_logs` | Command Injection (RCE) | **Critical** | Unsanitized input passed to shell execution allows arbitrary command run. |
| `debug_access` | Shadow / Hidden Tool | **High** | Functionality exists but is not advertised in `listTools`, violating protocol transparency. |
| `submit_feedback` | Data Exfiltration | **Medium** | Sensitive data sent to external endpoints without user consent. |
| `configure_server` | Tool Poisoning / State Mod | **High** | Unauthenticated state changes can alter server behavior or disable security. |
| Server Config | CORS Misconfiguration | **Medium** | Wildcard origin (`*`) allows cross-site request forgery interactions. |


## Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/vulnerable-mcp-server.git
    cd vulnerable-mcp-server
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## Usage

### Starting the Server

To start the server in development mode:

```bash
npm start
```

The server will start on port **3000**.
-   **SSE Endpoint**: `http://localhost:3000/sse`
-   **Message Endpoint**: `http://localhost:3000/message`

### Verifying Vulnerabilities

A test client script is included to demonstrate the vulnerabilities.

```bash
npm run test-client
```

## License

MIT

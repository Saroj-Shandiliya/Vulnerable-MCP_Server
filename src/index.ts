import express from "express";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { VulnerableMcpServer } from "./mcp-server";
import cors from "cors";

const app = express();
const mcpServer = new VulnerableMcpServer();
const server = mcpServer.getServer();

// Cross Origin Vulnerability: Allow all origins
app.use(cors({ origin: "*" }));

let transport: SSEServerTransport | null = null;

app.get("/sse", async (req, res) => {
    console.log("New SSE connection");
    transport = new SSEServerTransport("/message", res);
    await server.connect(transport);
});

app.post("/message", async (req, res) => {
    console.log("Received message");
    if (!transport) {
        res.status(500).send("No active transport");
        return;
    }
    await transport.handlePostMessage(req, res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Vulnerable MCP Server running on port ${PORT}`);
    console.log(`SSE Endpoint: http://localhost:${PORT}/sse`);
    console.log(`Message Endpoint: http://localhost:${PORT}/message`);
});

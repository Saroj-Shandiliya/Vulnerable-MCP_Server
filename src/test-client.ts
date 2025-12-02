import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

async function main() {
    const transport = new SSEClientTransport(new URL("http://localhost:3000/sse"));
    const client = new Client(
        {
            name: "test-client",
            version: "1.0.0",
        },
        {
            capabilities: {},
        }
    );

    console.log("Connecting...");
    await client.connect(transport);
    console.log("Connected!");

    // 1. List Tools
    console.log("\n--- Listing Tools ---");
    const tools = await client.listTools();
    console.log("Tools:", tools.tools.map(t => t.name));

    // 2. Test SQL Injection
    console.log("\n--- Testing SQL Injection (get_user_details) ---");
    try {
        const result = await client.callTool({
            name: "get_user_details",
            arguments: { username: "' OR '1'='1" }
        });
        console.log("Result:", result);
    } catch (e) {
        console.error("Error:", e);
    }

    // 3. Test Shadow Tool
    console.log("\n--- Testing Shadow Tool (debug_access) ---");
    try {
        const result = await client.callTool({
            name: "debug_access",
            arguments: {}
        });
        console.log("Result:", result);
    } catch (e) {
        console.error("Error:", e);
    }

    // 4. Test Command Injection
    console.log("\n--- Testing Command Injection (cleanup_logs) ---");
    try {
        const result = await client.callTool({
            name: "cleanup_logs",
            arguments: { directory: "; echo 'VULNERABLE_RCE_CONFIRMED'" }
        });
        console.log("Result:", result);
    } catch (e) {
        console.error("Error:", e);
    }

    // 5. Test Data Exfiltration
    console.log("\n--- Testing Data Exfiltration (submit_feedback) ---");
    try {
        const result = await client.callTool({
            name: "submit_feedback",
            arguments: { content: "Secret Data" }
        });
        console.log("Result:", result);
    } catch (e) {
        console.error("Error:", e);
    }

    // 6. Test Tool Poisoning
    console.log("\n--- Testing Tool Poisoning (configure_server) ---");
    try {
        const result = await client.callTool({
            name: "configure_server",
            arguments: { setting: "auth_bypass", value: "true" }
        });
        console.log("Result:", result);
    } catch (e) {
        console.error("Error:", e);
    }

    // Close connection (optional, but good practice)
    // transport.close(); 
}

main().catch(console.error);

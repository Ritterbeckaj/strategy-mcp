#!/usr/bin/env node
/**
 * CI smoke test — spawns the server over stdio the same way a client would,
 * completes the MCP handshake, and asserts every advertised tool actually answers.
 *
 * Fails the build on: no handshake, tool count drift, or any tool returning isError.
 */
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const EXPECTED = ["swot_analysis", "marketing_mix", "lean_canvas", "decision_matrix"];

const p = spawn(process.execPath, [join(root, "index.js")], { stdio: ["pipe", "pipe", "pipe"] });
let buf = "";
let stderr = "";
p.stdout.on("data", (d) => (buf += d.toString()));
p.stderr.on("data", (d) => (stderr += d.toString()));

const send = (o) => p.stdin.write(JSON.stringify(o) + "\n");

function waitFor(id, ms = 8000) {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const tick = setInterval(() => {
      const line = buf
        .split("\n")
        .filter((l) => l.trim().startsWith("{"))
        .map((l) => {
          try {
            return JSON.parse(l);
          } catch {
            return null;
          }
        })
        .find((o) => o && o.id === id);
      if (line) {
        clearInterval(tick);
        resolve(line);
      } else if (Date.now() - started > ms) {
        clearInterval(tick);
        reject(new Error(`timeout waiting for response id=${id}\nstderr: ${stderr}`));
      }
    }, 50);
  });
}

const fail = (msg) => {
  console.error("FAIL:", msg);
  p.kill();
  process.exit(1);
};

send({
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "smoke", version: "1" } },
});

const init = await waitFor(1).catch((e) => fail(e.message));
console.log("handshake:", JSON.stringify(init.result?.serverInfo));
send({ jsonrpc: "2.0", method: "notifications/initialized", params: {} });

send({ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} });
const list = await waitFor(2).catch((e) => fail(e.message));
const names = (list.result?.tools || []).map((t) => t.name).sort();

if (names.join(",") !== [...EXPECTED].sort().join(",")) {
  fail(`tool set drift — advertised ${JSON.stringify(names)}, expected ${JSON.stringify(EXPECTED)}`);
}
console.log("tools:", names.join(", "));

const CALLS = {
  swot_analysis: { subject: "smoke test venture", strengths: ["speed"] },
  marketing_mix: { product: "smoke test product", market: "developers" },
  lean_canvas: { name: "smoke", problem: "smoke problem", solution: "smoke solution" },
  decision_matrix: {
    question: "smoke",
    options: ["a", "b"],
    criteria: ["x", "y"],
    weights: [0.5, 0.5],
  },
};

let id = 10;
for (const name of EXPECTED) {
  send({ jsonrpc: "2.0", id, method: "tools/call", params: { name, arguments: CALLS[name] } });
  const res = await waitFor(id).catch((e) => fail(e.message));
  const text = res.result?.content?.[0]?.text || "";
  if (res.result?.isError || !text.length) fail(`${name} returned an error: ${text.slice(0, 200)}`);
  console.log(`${name.padEnd(18)} ok  ${text.length} chars`);
  id++;
}

p.kill();
console.log("smoke: all four tools answered");

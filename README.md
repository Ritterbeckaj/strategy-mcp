# Strategy MCP

Deterministic strategic-planning frameworks as a local MCP server. Runs anywhere
Node 18+ runs, makes **zero network calls**, and needs **no API keys**.

Four tools are free and MIT-licensed in this repo. Eight more (twelve total) ship
as [StrategyBrain Pro](#strategybrain-pro).

```
swot_analysis   marketing_mix   lean_canvas   decision_matrix     ← free (this repo)
```

## Free tools (MIT)

| Tool | What it actually returns |
|---|---|
| `swot_analysis` | S/W/O/T, then **S-O / W-O / S-T / W-T cross-mapping** and 3–5 offensive + defensive actions. Not just the four quadrants. |
| `marketing_mix` | The 4Ps — product, price, place, promotion — plus the one-line pitch that connects them. |
| `lean_canvas` | One-page business model: problem → segments → UVP → solution → channels → revenue → costs → metrics → unfair advantage. |
| `decision_matrix` | Options scored against weighted criteria, ranked, with the margin between winner and runner-up. |

Every tool is a pure function of its input. Same input, same output, no model
call, no drift between runs, nothing sent anywhere.

## Install

**Requirements:** Node 18 or newer.

```bash
git clone https://github.com/Ritterbeckaj/strategy-mcp.git
cd strategy-mcp
npm install
```

Note the **absolute path** to `index.js` — every client below needs it.

### OpenCode

`~/.config/opencode/opencode.json`:

```json
{
  "mcp": {
    "servers": {
      "strategy": {
        "type": "local",
        "command": ["node", "/absolute/path/to/strategy-mcp/index.js"]
      }
    }
  }
}
```

### Claude Code

```bash
claude mcp add strategy -- node /absolute/path/to/strategy-mcp/index.js
```

### Claude Desktop / Cursor

Claude Desktop — `claude_desktop_config.json`
(macOS: `~/Library/Application Support/Claude/`, Windows: `%APPDATA%\Claude\`).
Cursor — `~/.cursor/mcp.json`. Same shape:

```json
{
  "mcpServers": {
    "strategy": {
      "command": "node",
      "args": ["/absolute/path/to/strategy-mcp/index.js"]
    }
  }
}
```

Restart the client. The four tools appear as `swot_analysis`, `marketing_mix`,
`lean_canvas`, `decision_matrix`.

Then just ask:

> "Run a SWOT on my print-on-demand merch line and tell me which threat actually kills it."

## Or use the hosted servers (no install)

The same tools — plus FactCheck and LeadGen — run as remote MCP endpoints over
Streamable HTTP. Useful when you can't install anything locally:

| Server | Endpoint | Tools |
|---|---|---|
| StrategyBrain | `https://strategybrain-mcp.factcheck-mcp-worker.workers.dev/mcp` | 12 |
| FactCheck | `https://factcheck-mcp.factcheck-mcp-worker.workers.dev/mcp` | 7 |
| LeadGen | `https://leadgen-mcp.factcheck-mcp-worker.workers.dev/mcp` | 6 |

Header on every request:

```
x-api-key: oc_trial_5a4900841684ff7d265ba3028bcb1fcc
```

That's a **shared public demo key: 100 calls/day across all users**. Fine for
testing whether it works in your client. If you need a real quota, buy a pack
and you get your own key.

## What touches the network

READMEs in this category tend to say "fully offline" and stop there. Enumerated
instead:

| Pack | Tools | Network |
|---|---|---|
| StrategyBrain (this repo's free 4 + Pro's 8) | 12 | **none** |
| Monetize MCP | 8 | **none** |
| FactCheck MCP | 7 | Wikipedia, Semantic Scholar, optional Google Fact Check |
| LeadGen MCP | 6 | DuckDuckGo |

20 of 33 tools are air-gapped. The other 13 call free, keyless, read-only public
endpoints. `GOOGLE_FACTCHECK_API_KEY` is optional — the server degrades to
Wikipedia + Semantic Scholar without it. When a network call fails, the tool
returns `UNVERIFIED` rather than inventing a result.

## StrategyBrain Pro

The other eight frameworks, same offline/no-key design:

`porter_five_forces` · `pestle_analysis` · `ansoff_matrix` · `jobs_to_be_done` ·
`tam_sam_som` · `okr_plan` · `roadmap_plan` · `brainstorm_session`

**[$12 — StrategyBrain Pro](https://ritterbeck.gumroad.com/l/strategybrain-pro)** ·
**[$29 with a 30-minute setup call](https://ritterbeck.gumroad.com/l/strategybrain-pro)**
· 30-day refund if it isn't useful.

Free entry point: **[Monetize MCP — 8 tools, $0+](https://ritterbeck.gumroad.com/l/monetize-mcp)**.
Test the install before paying for anything.

Full set — all four packs, 33 tools:
**[The MCP Toolkit](https://ritterbeck.gumroad.com/mcp-bundle)** ($29, or $79 with setup).

## Why open-core

The four tools here are the ones that survive being used on their own. The Pro
pack funds maintenance and the next batch. If the free tools earn it, buy Pro.
If they don't, you've lost nothing but a `npm install`.

## Publishing your own

MIT — fork it, rename it in `package.json` and in the `McpServer` constructor,
`npm publish`. The name `strategy-mcp` is unclaimed on npm as of this commit.

## License

MIT — see [LICENSE](LICENSE). The Pro tools are proprietary and are not in this
repository.

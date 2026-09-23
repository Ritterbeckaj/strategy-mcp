# Strategy MCP — open-core strategy frameworks for OpenCode (and any MCP client)

Deterministic strategic-planning frameworks as a local, free, open-source MCP server.
No API keys. Works offline. Runs wherever Node 18+ runs.

**4 free core tools in this repo. 8 more in [StrategyBrain Pro →](https://gumroad.com/YOURHANDLE).**

## What you get free (MIT)

| Tool | What it does |
|---|---|
| `swot_analysis` | SWOT with S-O / W-O / S-T / W-T cross-mapping + offensive/defensive actions |
| `marketing_mix` | The 4Ps: Product, Price, Place, Promotion + the pitch line |
| `lean_canvas` | One-page business model canvas (problem → unfair advantage) |
| `decision_matrix` | Score options against weighted criteria → ranked decision |

## What Pro adds (8 frameworks, $29)

Porter's Five Forces · PESTLE · Ansoff Matrix · Jobs-to-be-Done · TAM/SAM/SOM ·
OKR planning · Brainstorm sessions · Roadmap planning — plus a full prompt playbook
and update commits. **[Get StrategyBrain Pro](https://gumroad.com/YOURHANDLE)**

## Install (2 minutes)

```bash
npm install          # in this repo
```

Wire it into OpenCode (`~/.config/opencode/opencode.json`):

```json
{
  "mcp": {
    "servers": {
      "strategy": { "type": "local", "command": ["node", "/absolute/path/to/strategy-mcp/index.js"] }
    }
  }
}
```

Restart OpenCode. Then just ask, e.g.:

> "Run a SWOT on my print-on-demand merch line" → `strategy_swot_analysis`

## Or publish it yourself (npm)

It's MIT — fork, rename in `package.json`, `npm publish`.

## Why open-core?

You get the honest core, free. The Pro pack funds maintenance, updates, and the
next frameworks. If the free tools genuinely help you, Pro is a no-brainer —
if not, you lost nothing. That's the deal.

## License

MIT — see [LICENSE](LICENSE). Pro tools are proprietary and not in this repo.
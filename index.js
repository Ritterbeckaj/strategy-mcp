#!/usr/bin/env node
/**
 * Strategy MCP — open-core edition (MIT).
 *
 * Free core tools: swot_analysis, marketing_mix, lean_canvas, decision_matrix.
 *
 * Pro (8 more frameworks: Porter's Five Forces, PESTLE, Ansoff, Jobs-to-be-Done,
 * TAM/SAM/SOM, OKR, brainstorm_session, roadmap_plan) is available at:
 *   https://ritterbeck.gumroad.com (StrategyBrain Pro)
 * The Pro pack is proprietary and not part of this repository.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({ name: "strategy-mcp", version: "0.1.0" });

server.tool(
  "swot_analysis",
  "Run a SWOT analysis: strengths, weaknesses, opportunities, threats, then derive 3-5 offensive and defensive strategic actions.",
  {
    subject: z.string().describe("What is being analyzed (business, product line, niche, campaign)"),
    strengths: z.array(z.string()).optional(),
    weaknesses: z.array(z.string()).optional(),
    opportunities: z.array(z.string()).optional(),
    threats: z.array(z.string()).optional(),
  },
  async ({ subject, strengths = [], weaknesses = [], opportunities = [], threats = [] }) => {
    const view = {
      type: "SWOT",
      subject,
      internal: { strengths, weaknesses },
      external: { opportunities, threats },
      cross_mapping: [
        "S-O (attack): use which strength to seize which opportunity?",
        "W-O (build): what weakness blocks an opportunity, and how to fix it?",
        "S-T (defend): which strength mitigates which threat?",
        "W-T (survive): what risk must be neutralized first?",
      ],
      output: ["3-5 offensive actions (SO/WO)", "3-5 defensive actions (ST/WT)", "1 top priority per quadrant"],
    };
    return json(view);
  }
);

server.tool(
  "lean_canvas",
  "One-page business model (9 blocks). Provide any 2+ blocks; the template guides completion of the rest.",
  {
    name: z.string().describe("Venture / product name"),
    problem: z.string().optional(),
    solution: z.string().optional(),
    key_metrics: z.string().optional(),
    unique_value_proposition: z.string().optional(),
    unfair_advantage: z.string().optional(),
    channels: z.string().optional(),
    customer_segments: z.string().optional(),
    cost_structure: z.string().optional(),
    revenue_streams: z.string().optional(),
  },
  async (a) => {
    const view = {
      type: "Lean Canvas",
      name: a.name,
      canvas: {
        problem: a.problem ?? "Top 1-3 problems",
        solution: a.solution ?? "Minimal feature set per problem",
        key_metrics: a.key_metrics ?? "3 numbers that prove traction",
        unique_value_proposition: a.unique_value_proposition ?? "Single clear message: why buy",
        unfair_advantage: a.unfair_advantage ?? "What cannot be copied/bought",
        channels: a.channels ?? "How you reach customers",
        customer_segments: a.customer_segments ?? "Who pays (early adopters first)",
        cost_structure: a.cost_structure ?? "Fixed + variable costs",
        revenue_streams: a.revenue_streams ?? "Pricing + revenue model",
      },
      output: ["Fill every gap", "Flag the riskiest assumption per block", "Design 1 experiment to de-risk the top assumption"],
    };
    return json(view);
  }
);

server.tool(
  "decision_matrix",
  "Score options against weighted criteria to pick objectively. Pass equal-length arrays or leave blank for template.",
  {
    question: z.string().describe("The decision to make"),
    options: z.array(z.string()).optional(),
    criteria: z.array(z.string()).optional(),
    weights: z.array(z.number()).optional().describe("Must sum to 1.0; same length as criteria"),
  },
  async ({ question, options = [], criteria = [], weights = [] }) => {
    const view = {
      type: "Decision matrix",
      question,
      table: options.length ? { options, criteria, weights } : {
        hint: "Fill: options (2-6), criteria (3-6), weights summing to 1.0",
        sample: { options: ["Option A", "Option B"], criteria: ["Cost", "Speed", "Impact"], weights: [0.4, 0.3, 0.3] },
      },
      scoring: "Score each option 1-10 per criterion; total = SUM(score * weight). Highest wins; document why.",
      output: ["Weighted totals per option", "Sensitivity: swap top-2 weights and recheck", "One decision + contingency"],
    };
    return json(view);
  }
);

server.tool(
  "marketing_mix",
  "4P plan: Product, Price, Place (channels), Promotion, plus the pitch line.",
  {
    product: z.string(),
    target_customer: z.string().optional(),
    product_offer: z.string().optional(),
    price: z.string().optional(),
    place: z.string().optional(),
    promotion: z.string().optional(),
  },
  async ({ product, ...p }) => {
    const view = {
      type: "Marketing mix (4Ps)",
      product,
      mix: {
        product_offer: p.product_offer ?? "Features, benefits, packaging, variants",
        price: p.price ?? "List price, anchor, discounts, perceived value",
        place: p.place ?? "Channels: store, marketplace, social, email, POD platform",
        promotion: p.promotion ?? "Hooks per channel + launch sequence (7 days)",
      },
      target_customer: p.target_customer ?? "Define 1 persona: who, what problem, where they hang out",
      output: ["One-sentence pitch", "Launch sequence day-by-day", "3 test creatives to A/B in week 1"],
    };
    return json(view);
  }
);


function json(v) {
  return { content: [{ type: "text", text: JSON.stringify(v, null, 2) }] };
}

const transport = new StdioServerTransport();
await server.connect(transport);
import { NextResponse } from "next/server";
import { z } from "zod";
import { agentInputSchema, buildAgentPlan } from "@/lib/agent";

type RequestBody = {
  input: unknown;
  apiKey?: string;
  model?: string;
};

export async function POST(req: Request) {
  const rawBody = (await req.json().catch(() => null)) as RequestBody | null;
  if (!rawBody) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const body = rawBody;
  let parsedInput: ReturnType<typeof agentInputSchema.parse> | null = null;

  try {
    parsedInput = agentInputSchema.parse(body.input);

    if (body.apiKey && process.env.VERCEL_ENV !== "development") {
      console.warn("Received API key in production build, using runtime key only.");
    }

    const plan = await maybeGenerateWithLLM(body.apiKey, body.model, parsedInput);

    return NextResponse.json({
      plan: plan ?? buildAgentPlan(parsedInput),
      usedLLM: Boolean(plan && body?.apiKey)
    });
  } catch (error) {
    console.error(error);
    if (!parsedInput) {
      return NextResponse.json(
        { error: "Invalid agent input payload." },
        { status: 422 }
      );
    }

    return NextResponse.json({
      error: "Failed to generate plan. Returning deterministic fallback.",
      plan: buildAgentPlan(parsedInput)
    });
  }
}

async function maybeGenerateWithLLM(
  apiKey: string | undefined,
  model: string | undefined,
  input: ReturnType<typeof agentInputSchema.parse>
) {
  if (!apiKey) {
    return null;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model ?? "gpt-4.1-mini",
        response_format: { type: "json_schema", json_schema: agentSchema },
        input: [
          {
            role: "system",
            content: `You are MotionDirector, an elite video creative director.
Output rich JSON following the schema. Use punchy copy, kinetic visuals, modern platform tactics.
Reference the provided input to tailor scenes, voiceover, and transitions.`
          },
          {
            role: "user",
            content: `Generate a launch-ready motion plan:\n${JSON.stringify(
              input,
              null,
              2
            )}`
          }
        ]
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const text = await response.text();
      console.warn("LLM request failed:", text);
      return null;
    }

    const data = await response.json();
    const parsed = JSON.parse(data.output[0].content[0].text) as unknown;
    const plan = agentPlanSchema.parse(parsed);
    return plan;
  } catch (error) {
    console.warn("LLM generation error", error);
    return null;
  }
}

const agentSceneSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    title: { type: "string" },
    purpose: { type: "string" },
    duration: { type: "integer" },
    voiceover: { type: "string" },
    onScreenText: { type: "string" },
    visualDirection: { type: "string" },
    transitions: { type: "string" },
    brollIdeas: { type: "array", items: { type: "string" } },
    soundDesign: { type: "string" }
  },
  required: [
    "id",
    "title",
    "purpose",
    "duration",
    "voiceover",
    "onScreenText",
    "visualDirection",
    "transitions",
    "brollIdeas",
    "soundDesign"
  ],
  additionalProperties: false
} as const;

const agentSchema = {
  name: "AgentPlan",
  schema: {
    type: "object",
    properties: {
      summary: { type: "string" },
      hook: { type: "string" },
      narrativeArc: { type: "array", items: { type: "string" } },
      scenes: { type: "array", items: agentSceneSchema },
      captions: { type: "array", items: { type: "string" } },
      soundtrack: {
        type: "object",
        properties: {
          mood: { type: "string" },
          tempo: { type: "string" },
          instrumentation: { type: "string" }
        },
        required: ["mood", "tempo", "instrumentation"]
      },
      aiAssets: {
        type: "object",
        properties: {
          images: { type: "array", items: { type: "string" } },
          voice: { type: "string" },
          motion: { type: "array", items: { type: "string" } }
        },
        required: ["images", "voice", "motion"]
      },
      automation: { type: "array", items: { type: "string" } },
      deliveryChecklist: { type: "array", items: { type: "string" } },
      metadata: {
        type: "object",
        properties: {
          durationSeconds: { type: "integer" },
          aspectRatio: { type: "string" },
          platform: { type: "string" }
        },
        required: ["durationSeconds", "aspectRatio", "platform"]
      }
    },
    required: [
      "summary",
      "hook",
      "narrativeArc",
      "scenes",
      "captions",
      "soundtrack",
      "aiAssets",
      "automation",
      "deliveryChecklist",
      "metadata"
    ],
    additionalProperties: false
  }
} as const;

const agentPlanSchema = z.object({
  summary: z.string(),
  hook: z.string(),
  narrativeArc: z.array(z.string()),
  scenes: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      purpose: z.string(),
      duration: z.number().int(),
      voiceover: z.string(),
      onScreenText: z.string(),
      visualDirection: z.string(),
      transitions: z.string(),
      brollIdeas: z.array(z.string()),
      soundDesign: z.string()
    })
  ),
  captions: z.array(z.string()),
  soundtrack: z.object({
    mood: z.string(),
    tempo: z.string(),
    instrumentation: z.string()
  }),
  aiAssets: z.object({
    images: z.array(z.string()),
    voice: z.string(),
    motion: z.array(z.string())
  }),
  automation: z.array(z.string()),
  deliveryChecklist: z.array(z.string()),
  metadata: z.object({
    durationSeconds: z.number().int(),
    aspectRatio: z.string(),
    platform: z.string()
  })
});

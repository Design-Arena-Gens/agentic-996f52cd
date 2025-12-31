"use client";

import { useEffect, useMemo, useState } from "react";
import { AgentPlan, AgentInput, buildAgentPlan } from "@/lib/agent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AgentPlanPanel } from "@/components/agent/plan-panel";
import { VideoPreview } from "@/components/agent/video-preview";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const DEFAULT_INPUT: AgentInput = {
  prompt: "Launch our AI-native video agent that builds kinetic marketing spots",
  targetAudience: "Growth teams at product-led SaaS startups",
  goal: "Drive waitlist sign-ups",
  tone: "bold",
  platform: "TikTok",
  durationSeconds: 45,
  aspectRatio: "9:16",
  brandKeywords: ["AI-native", "Kinetic", "Conversion-first"],
  callToAction: "Join the waitlist",
  includeCaptions: true
};

export default function HomePage() {
  const [agentInput, setAgentInput] = useState<AgentInput>(DEFAULT_INPUT);
  const [plan, setPlan] = useState<AgentPlan>(() => buildAgentPlan(DEFAULT_INPUT));
  const [apiKey, setApiKey] = useState("");
  const [rememberKey, setRememberKey] = useState(false);
  const [usedLLM, setUsedLLM] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const storedKey = window.localStorage.getItem("agentic-video-openai-key");
    if (storedKey) {
      setApiKey(storedKey);
      setRememberKey(true);
    }
  }, []);

  useEffect(() => {
    if (!rememberKey) {
      window.localStorage.removeItem("agentic-video-openai-key");
      return;
    }
    if (apiKey) {
      window.localStorage.setItem("agentic-video-openai-key", apiKey);
    }
  }, [apiKey, rememberKey]);

  const totalDuration = useMemo(
    () => plan.scenes.reduce((acc, scene) => acc + scene.duration, 0),
    [plan]
  );

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: agentInput,
          apiKey: apiKey || undefined
        })
      });

      if (!response.ok) {
        throw new Error("Request failed.");
      }

      const data = await response.json();
      setPlan(data.plan);
      setUsedLLM(Boolean(data.usedLLM));
      toast.success(
        data.usedLLM
          ? "LLM co-directed this plan."
          : "Plan generated with deterministic agent."
      );
    } catch (error) {
      console.error(error);
      const fallback = buildAgentPlan(agentInput);
      setPlan(fallback);
      setUsedLLM(false);
      toast.error("LLM failed. Using deterministic plan instead.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 pb-24">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,117,255,0.25),_transparent_55%)]" />
        <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 pt-16 md:px-8 lg:px-12">
          <header className="space-y-6">
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-brand-200">
              <Badge className="border-brand-400/40 bg-brand-500/10 text-brand-100">
                Agentic Stack
              </Badge>
              <span>Shotlist · Voiceover · CTA · Automations</span>
            </div>
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-5">
                <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                  Launch an AI Director that actually ships{" "}
                  <span className="text-transparent bg-gradient-to-br from-brand-400 via-sky-300 to-brand-500 bg-clip-text">
                    scroll-stopping videos
                  </span>
                  .
                </h1>
                <p className="max-w-2xl text-lg text-slate-300">
                  Feed the agent your product and goal. It orchestrates the hook, shot list,
                  motion prompts, soundtrack direction, and delivery checklist ready for Vercel deployment.
                </p>
                <div className="flex flex-wrap gap-3 text-sm text-slate-400">
                  <span>⚡ Deterministic fallback agent on-device</span>
                  <span>🎬 Optional GPT-4.1 co-pilot via bring-your-own-key</span>
                  <span>🧠 Built for marketing & content ops teams</span>
                </div>
              </div>
              <VideoPreview plan={plan} />
            </div>
          </header>

          <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6 shadow-2xl shadow-brand-500/5 backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-white">Direct the brief</h2>
                <p className="text-sm text-slate-400">
                  Describe the campaign and adjust the creative guardrails.
                </p>
                <div className="mt-5 space-y-5">
                  <div>
                    <Label htmlFor="prompt">Product or hero message</Label>
                    <Textarea
                      id="prompt"
                      value={agentInput.prompt}
                      onChange={(event) =>
                        setAgentInput((prev) => ({ ...prev, prompt: event.target.value }))
                      }
                      placeholder="What story should the agent tell?"
                    />
                  </div>
                  <div>
                    <Label htmlFor="audience">Target audience</Label>
                    <Input
                      id="audience"
                      value={agentInput.targetAudience}
                      onChange={(event) =>
                        setAgentInput((prev) => ({
                          ...prev,
                          targetAudience: event.target.value
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="goal">Primary goal</Label>
                    <Input
                      id="goal"
                      value={agentInput.goal}
                      onChange={(event) =>
                        setAgentInput((prev) => ({ ...prev, goal: event.target.value }))
                      }
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="platform">Platform</Label>
                      <select
                        id="platform"
                        value={agentInput.platform}
                        onChange={(event) =>
                          setAgentInput((prev) => ({
                            ...prev,
                            platform: event.target.value as AgentInput["platform"]
                          }))
                        }
                        className="h-11 w-full rounded-xl border border-slate-800 bg-slate-900/70 px-3 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                      >
                        <option value="TikTok">TikTok</option>
                        <option value="Instagram Reels">Instagram Reels</option>
                        <option value="YouTube Shorts">YouTube Shorts</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="YouTube">YouTube (full)</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="tone">Tone</Label>
                      <select
                        id="tone"
                        value={agentInput.tone}
                        onChange={(event) =>
                          setAgentInput((prev) => ({
                            ...prev,
                            tone: event.target.value as AgentInput["tone"]
                          }))
                        }
                        className="h-11 w-full rounded-xl border border-slate-800 bg-slate-900/70 px-3 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                      >
                        <option value="bold">Bold</option>
                        <option value="friendly">Friendly</option>
                        <option value="inspirational">Inspirational</option>
                        <option value="playful">Playful</option>
                        <option value="serious">Serious</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <Label htmlFor="duration">Duration (seconds)</Label>
                      <div className="flex items-center gap-3">
                        <input
                          id="duration"
                          type="range"
                          min={20}
                          max={150}
                          value={agentInput.durationSeconds}
                          onChange={(event) =>
                            setAgentInput((prev) => ({
                              ...prev,
                              durationSeconds: Number(event.target.value)
                            }))
                          }
                          className="h-1 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-brand-500"
                        />
                        <span className="w-10 text-sm text-slate-300">
                          {agentInput.durationSeconds}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="aspect">Aspect ratio</Label>
                      <select
                        id="aspect"
                        value={agentInput.aspectRatio}
                        onChange={(event) =>
                          setAgentInput((prev) => ({
                            ...prev,
                            aspectRatio: event.target.value as AgentInput["aspectRatio"]
                          }))
                        }
                        className="h-11 w-full rounded-xl border border-slate-800 bg-slate-900/70 px-3 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                      >
                        <option value="9:16">9:16 (Vertical)</option>
                        <option value="1:1">1:1 (Square)</option>
                        <option value="16:9">16:9 (Horizontal)</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="cta">Call to action</Label>
                      <Input
                        id="cta"
                        value={agentInput.callToAction}
                        onChange={(event) =>
                          setAgentInput((prev) => ({
                            ...prev,
                            callToAction: event.target.value
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="keywords">Brand keywords</Label>
                    <Input
                      id="keywords"
                      placeholder="Comma separated (e.g. AI-native, cinematic, kinetic)"
                      value={agentInput.brandKeywords.join(", ")}
                      onChange={(event) => {
                        const keywords = event.target.value
                          .split(",")
                          .map((word) => word.trim())
                          .filter(Boolean);
                        setAgentInput((prev) => ({
                          ...prev,
                          brandKeywords: keywords
                        }));
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        Generate caption timings
                      </p>
                      <p className="text-xs text-slate-400">
                        Enable auto-closed captions for accessibility & retention.
                      </p>
                    </div>
                    <Checkbox
                      checked={agentInput.includeCaptions}
                      onChange={(event) =>
                        setAgentInput((prev) => ({
                          ...prev,
                          includeCaptions: event.target.checked
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 backdrop-blur-sm">
                <h3 className="text-sm font-semibold text-white">Bring your own LLM</h3>
                <p className="text-xs text-slate-400">
                  Optional: the agent can call OpenAI Responses for richer language.
                  Keys are stored locally in your browser.
                </p>
                <div className="mt-4 space-y-4">
                  <Input
                    placeholder="sk-..."
                    value={apiKey}
                    onChange={(event) => setApiKey(event.target.value)}
                  />
                  <div className="flex items-center justify-between">
                    <Checkbox
                      label="Remember this key on this device"
                      checked={rememberKey}
                      onChange={(event) => setRememberKey(event.target.checked)}
                    />
                    <span className="text-xs text-slate-500">
                      Stored in localStorage only.
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                loading={isGenerating}
                className="w-full text-base"
              >
                {isGenerating ? "Compositing plan..." : "Generate video plan"}
              </Button>
              {usedLLM && (
                <p className="text-xs text-brand-200">
                  ✳️ Enhanced with GPT-4.1 via your API key. Remove the key to revert to deterministic mode.
                </p>
              )}
            </div>

            <div className="space-y-6">
              <AgentPlanPanel plan={plan} />
              <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
                <h3 className="text-lg font-semibold text-white">
                  Delivery-ready metadata
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Quick reference for editors, producers, or Zapier automations.
                </p>
                <dl className="mt-4 grid gap-3 text-sm text-slate-200 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 px-3 py-2">
                    <dt className="text-xs uppercase tracking-[0.2em] text-brand-300">
                      Total duration
                    </dt>
                    <dd className="text-base font-medium text-white">
                      {totalDuration}s
                    </dd>
                  </div>
                  <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 px-3 py-2">
                    <dt className="text-xs uppercase tracking-[0.2em] text-brand-300">
                      Scenes
                    </dt>
                    <dd className="text-base font-medium text-white">
                      {plan.scenes.length}
                    </dd>
                  </div>
                  <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 px-3 py-2">
                    <dt className="text-xs uppercase tracking-[0.2em] text-brand-300">
                      Soundtrack
                    </dt>
                    <dd>{plan.soundtrack.mood}</dd>
                  </div>
                  <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 px-3 py-2">
                    <dt className="text-xs uppercase tracking-[0.2em] text-brand-300">
                      CTA
                    </dt>
                    <dd>{plan.aiAssets.motion.at(-1)}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

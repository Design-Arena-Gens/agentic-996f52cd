"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AgentPlan } from "@/lib/agent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function AgentPlanPanel({ plan }: { plan: AgentPlan }) {
  const totalDuration = useMemo(
    () => plan.scenes.reduce((acc, scene) => acc + scene.duration, 0),
    [plan.scenes]
  );

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(plan, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "agentic-video-plan.json";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Exported plan JSON.");
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-brand-500/10 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-white">
              Agent Output
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-400">{plan.summary}</p>
          </div>
          <Button variant="secondary" onClick={handleDownload}>
            Download plan JSON
          </Button>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Badge>{plan.metadata.durationSeconds}s runtime</Badge>
          <Badge>{plan.metadata.aspectRatio} canvas</Badge>
          <Badge>{plan.metadata.platform}</Badge>
          <Badge>{plan.soundtrack.tempo}</Badge>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-[2fr,3fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-300">
              Hook Strategy
            </p>
            <p className="mt-2 text-sm text-slate-200">{plan.hook}</p>
            <div className="mt-4 h-px bg-gradient-to-r from-brand-500/50 via-brand-500/0 to-transparent" />
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-brand-300">
              Narrative Flow
            </p>
            <ul className="mt-2 space-y-1 text-sm text-slate-300">
              {plan.narrativeArc.map((arc, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                  {arc}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-300">
              Soundtrack Direction
            </p>
            <p className="mt-2 text-sm text-slate-200">{plan.soundtrack.mood}</p>
            <p className="mt-2 text-xs text-slate-400">
              {plan.soundtrack.instrumentation}
            </p>
            <div className="mt-4 h-px bg-gradient-to-r from-brand-500/50 via-brand-500/0 to-transparent" />
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-brand-300">
              Automation Stack
            </p>
            <ul className="mt-2 grid gap-2 text-sm text-slate-300 md:grid-cols-2">
              {plan.automation.map((task, index) => (
                <li key={index} className="rounded-xl border border-slate-800/60 bg-slate-900/60 px-3 py-2">
                  {task}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Timeline Blueprint</h3>
          <p className="text-sm text-slate-400">
            Storyline pacing mapped to total runtime for rapid editing.
          </p>
        </div>
        <div className="space-y-3 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
          {plan.scenes.map((scene, index) => {
            const ratio = Math.max(12, Math.round((scene.duration / totalDuration) * 100));
            return (
              <div key={scene.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500/20 text-xs font-semibold text-brand-200">
                      {index + 1}
                    </span>
                    <span className="text-slate-200">{scene.title}</span>
                  </div>
                  <span>{scene.duration}s</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600"
                    style={{ width: `${ratio}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Scene Cards</h3>
          <p className="text-sm text-slate-400">
            Camera direction, copy, and motion cues generated for each beat.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <AnimatePresence initial={false}>
            {plan.scenes.map((scene) => (
              <motion.article
                key={scene.id}
                layout
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 180, damping: 20 }}
                className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-lg shadow-brand-500/10 backdrop-blur-[2px]"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-brand-400/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-brand-300">
                      {scene.title}
                    </p>
                    <h4 className="mt-1 text-base font-semibold text-white">
                      {scene.purpose}
                    </h4>
                  </div>
                  <span className="rounded-full border border-brand-400/40 bg-brand-500/10 px-3 py-1 text-xs text-brand-100">
                    {scene.duration}s
                  </span>
                </div>
                <div className="mt-4 space-y-3 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-brand-300">
                      Voiceover
                    </p>
                    <p className="mt-1 text-slate-200">{scene.voiceover}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-brand-300">
                      On-screen text
                    </p>
                    <p className="mt-1 text-slate-200">{scene.onScreenText}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-brand-300">
                      Visual Direction
                    </p>
                    <p className="mt-1 text-slate-200">{scene.visualDirection}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-brand-300">
                      Transition + Sound
                    </p>
                    <p className="mt-1 text-slate-200">
                      {scene.transitions.trim()}. {scene.soundDesign}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-brand-300">
                      B-roll Prompts
                    </p>
                    <ul className="mt-1 list-disc space-y-1 pl-4 text-slate-300">
                      {scene.brollIdeas.map((idea, index) => (
                        <li key={index}>{idea}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {plan.captions.length > 0 && (
        <section className="space-y-3 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Caption Pack</h3>
            <Badge className="border-brand-400/30 bg-brand-500/10 text-brand-100">
              Auto-synced
            </Badge>
          </div>
          <ul className="grid gap-2 text-sm text-slate-200 md:grid-cols-2">
            {plan.captions.map((caption, index) => (
              <li
                key={index}
                className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3"
              >
                {caption}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-lg font-semibold text-white">AI Asset Queue</h3>
          <p className="mt-2 text-sm text-slate-400">
            Ready-to-run prompts for your generation stack.
          </p>
          <div className="mt-4 space-y-3 text-sm text-slate-200">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-brand-300">
                Voice
              </p>
              <p className="mt-1">{plan.aiAssets.voice}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-brand-300">
                Imagery Prompts
              </p>
              <ul className="mt-1 grid gap-2 text-slate-200 md:grid-cols-2">
                {plan.aiAssets.images.map((prompt, index) => (
                  <li
                    key={index}
                    className="rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs"
                  >
                    {prompt}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-brand-300">
                Motion Cues
              </p>
              <ul className="mt-1 space-y-1 text-slate-200">
                {plan.aiAssets.motion.map((motion, index) => (
                  <li key={index} className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2">
                    {motion}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
        <article className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-lg font-semibold text-white">Delivery Checklist</h3>
          <p className="mt-2 text-sm text-slate-400">
            Hand-off steps generated with platform compliance in mind.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-200">
            {plan.deliveryChecklist.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2"
              >
                <span className="mt-1 inline-flex h-2.5 w-2.5 flex-shrink-0 rounded-full bg-brand-400" />
                {item}
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}

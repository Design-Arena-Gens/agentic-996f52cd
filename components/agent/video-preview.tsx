"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AgentPlan } from "@/lib/agent";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const gradients = [
  "from-brand-500 via-purple-500 to-slate-900",
  "from-cyan-500 via-blue-500 to-slate-900",
  "from-lime-500 via-emerald-500 to-slate-900",
  "from-orange-500 via-rose-500 to-slate-900"
];

export function VideoPreview({ plan }: { plan: AgentPlan }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }
    const scene = plan.scenes[activeIndex];
    const timeout = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % plan.scenes.length);
    }, Math.max(2500, scene.duration * 120));

    return () => clearTimeout(timeout);
  }, [plan.scenes, activeIndex, isPlaying]);

  useEffect(() => {
    setActiveIndex(0);
  }, [plan]);

  const aspectPadding = useMemo(() => {
    switch (plan.metadata.aspectRatio) {
      case "16:9":
        return "pb-[56.25%]";
      case "1:1":
        return "pb-[100%]";
      case "9:16":
      default:
        return "pb-[177.77%]";
    }
  }, [plan.metadata.aspectRatio]);

  const scene = plan.scenes[activeIndex] ?? plan.scenes[0];

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6 shadow-2xl shadow-brand-500/10 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Live Preview</h2>
          <p className="text-sm text-slate-400">
            Conceptual storyboard preview cycling through the agent&apos;s scenes.
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => setIsPlaying((prev) => !prev)}
        >
          {isPlaying ? "Pause loop" : "Resume loop"}
        </Button>
      </div>
      <div className={cn("relative mt-6 w-full overflow-hidden rounded-3xl", aspectPadding)}>
        <div className="absolute inset-0 rounded-3xl border border-slate-800 bg-slate-950/80">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={scene?.id}
              className={cn(
                "absolute inset-0 flex flex-col justify-between p-6 text-white",
                "bg-gradient-to-br",
                gradients[activeIndex % gradients.length]
              )}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <div className="flex items-start justify-between">
                <div className="rounded-full border border-white/20 bg-black/20 px-3 py-1 text-xs uppercase tracking-[0.3em]">
                  {scene?.title}
                </div>
                <div className="text-right text-xs text-white/80">
                  Scene {activeIndex + 1} / {plan.scenes.length}
                </div>
              </div>
              <div className="space-y-4">
                <motion.p
                  key={`text-${scene?.id}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-2xl font-semibold leading-tight md:text-3xl"
                >
                  {scene?.onScreenText}
                </motion.p>
                <motion.p
                  key={`voice-${scene?.id}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="text-sm text-white/80 md:text-base"
                >
                  {scene?.voiceover}
                </motion.p>
              </div>
              <div className="grid gap-2 text-[11px] uppercase tracking-[0.3em] text-white/60">
                <span>{scene?.visualDirection}</span>
                <span>
                  {scene?.transitions} • {scene?.soundDesign}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {plan.scenes.map((item, index) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveIndex(index);
              setIsPlaying(false);
            }}
            className={cn(
              "rounded-2xl border border-slate-800 bg-slate-950/80 p-3 text-left transition-all hover:border-brand-400/60 hover:bg-brand-500/10",
              index === activeIndex &&
                "border-brand-400 bg-brand-500/10 shadow-lg shadow-brand-500/20"
            )}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-brand-200">
              Beat {index + 1}
            </p>
            <p className="mt-1 text-sm font-medium text-slate-100">
              {item.title}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {item.purpose}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

import { z } from "zod";

export const IdeasListSchema = z.object({
  ideas: z.array(z.object({
    idea_id: z.string().min(1),
    title: z.string().min(1),
    angle: z.string().min(1),
    format: z.string().min(1),
    target_length_seconds: z.number().int().positive(),
    difficulty: z.enum(["low", "medium", "high"]),
    hook_options: z.array(z.string().min(1)).min(3),
    cta: z.string().min(1),
  })).min(5),
});

export type IdeasList = z.infer<typeof IdeasListSchema>;

export const FullDraftSchema = z.object({
  idea_id: z.string().min(1),
  title: z.string().min(1),
  hook: z.object({
    spoken: z.string().min(1),
    on_screen_text: z.string().min(1),
  }),
  script: z.object({
    voiceover: z.array(z.string().min(1)).min(2),
    on_screen_text: z.array(z.string().min(1)).min(2),
    timing_seconds: z.array(z.number().int().nonnegative()).min(3),
  }),
  shotlist: z.array(z.object({
    sec_from: z.number().int().nonnegative(),
    sec_to: z.number().int().positive(),
    scene: z.string().min(1),
    camera: z.string().min(1),
    broll: z.string().optional().default(""),
  })).min(3),
  pattern_interrupts: z.array(z.string().min(1)).min(1),
  caption_variants: z.object({
    short: z.string().min(1),
    medium: z.string().min(1),
    long: z.string().min(1),
  }),
  hashtags: z.array(z.string().min(2)).min(5),
  compliance_notes: z.array(z.string()).default([]),
});

export type FullDraft = z.infer<typeof FullDraftSchema>;

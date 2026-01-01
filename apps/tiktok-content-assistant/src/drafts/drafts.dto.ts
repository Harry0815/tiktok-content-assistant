import { z } from "zod";
import { FullDraftSchema } from "@tca-shared";

export const CreateDraftSchema = z.object({
  brandId: z.string().min(1),
  brief: z.string().min(1),
  style: z.string().min(1),
  lengthSec: z.number().int().positive(),
  goal: z.string().min(1),
});

export const GenerateDraftSchema = z.object({
  idea_id: z.string().min(1),
  idea: z.any().optional() // optionally pass full idea object from frontend
});

export const RefineSchema = z.object({
  instruction: z.string().min(1),
  currentDraft: FullDraftSchema,
});

export type CreateDraftDto = z.infer<typeof CreateDraftSchema>;
export type GenerateDraftDto = z.infer<typeof GenerateDraftSchema>;
export type RefineDto = z.infer<typeof RefineSchema>;

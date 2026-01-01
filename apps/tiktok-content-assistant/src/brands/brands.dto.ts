import { z } from "zod";

export const CreateBrandSchema = z.object({
  name: z.string().min(1),
  language: z.string().default("de"),
  tonality: z.string().min(1),
  dos: z.string().optional(),
  donts: z.string().optional(),
  usp: z.string().optional(),
  ctaDefault: z.string().optional(),
  examples: z.string().optional(),
});

export type CreateBrandDto = z.infer<typeof CreateBrandSchema>;

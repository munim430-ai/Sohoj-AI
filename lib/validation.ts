/**
 * Request input schemas. Validating at the boundary keeps malformed or hostile
 * payloads out of the RAG, billing, and storage paths.
 */
import { z } from 'zod'

export const chatSchema = z.object({
  message: z.string().trim().min(1, 'Message is required').max(4000, 'Message too long'),
  // organizationId is intentionally NOT accepted from the client for authed
  // calls; it is derived from the session. The widget path supplies it and is
  // validated as a UUID, then checked against an allow-listed origin.
  organizationId: z.string().uuid().optional(),
})

export const checkoutSchema = z.object({
  amount: z.number().int().positive().max(1_000_000),
  creditsToAdd: z.number().int().min(100, 'Minimum 100 credits').max(1_000_000),
})

export const updateOrgSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  custom_domain: z
    .string()
    .trim()
    .max(253)
    .regex(/^[a-z0-9.-]+$/i, 'Invalid domain')
    .nullable()
    .optional(),
  branding: z
    .object({
      logo_url: z.string().url().nullable().optional(),
      primary_color: z
        .string()
        .regex(/^#[0-9a-fA-F]{6}$/, 'Invalid color')
        .optional(),
      company_name: z.string().max(120).nullable().optional(),
      show_powered_by: z.boolean().optional(),
    })
    .optional(),
})

export const createOrgSchema = z.object({
  name: z.string().trim().min(1).max(120),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
})

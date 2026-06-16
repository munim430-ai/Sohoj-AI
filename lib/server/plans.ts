// Subscription plans — single source of truth for entitlement limits.
// Mirrors PRICING.md. Monthly only; no annual plans.

export type Plan = 'free' | 'basic' | 'pro'

export interface PlanLimits {
  plan: Plan
  /** Max registered Android devices. */
  deviceLimit: number
  /** Max synced transactions per billing month (0 = automatic sync not allowed). */
  monthlyTxnLimit: number
  /** Whether automatic detection (notification listener) sync is permitted. */
  autoDetection: boolean
  /** Manual paste / SMS-share imports are always allowed. */
  manualImports: boolean
  branding: boolean
  ads: boolean
  advancedAnalytics: boolean
  priceBdt: number
}

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  free: {
    plan: 'free',
    deviceLimit: 1,
    monthlyTxnLimit: 0, // no automatic sync; manual only
    autoDetection: false,
    manualImports: true,
    branding: true,
    ads: true,
    advancedAnalytics: false,
    priceBdt: 0,
  },
  basic: {
    plan: 'basic',
    deviceLimit: 1,
    monthlyTxnLimit: 3000,
    autoDetection: true,
    manualImports: true,
    branding: false,
    ads: false,
    advancedAnalytics: false,
    priceBdt: 1999,
  },
  pro: {
    plan: 'pro',
    deviceLimit: 3,
    monthlyTxnLimit: 15000,
    autoDetection: true,
    manualImports: true,
    branding: false,
    ads: false,
    advancedAnalytics: true,
    priceBdt: 4999,
  },
}

export function limitsFor(plan: Plan): PlanLimits {
  return PLAN_LIMITS[plan]
}

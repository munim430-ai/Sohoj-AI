// Hard backend entitlement enforcement. Every decision is explicit — never a
// silent failure. The Android client cannot bypass these (writes happen here).

import { Plan, limitsFor } from './plans'

export type TxnSource = 'notification' | 'sms_share' | 'manual_paste'

export type DenyCode = 'DEVICE_LIMIT' | 'TXN_LIMIT' | 'PLAN_NO_AUTO'

export interface Decision {
  allowed: boolean
  code?: DenyCode
  reason?: string
}

export const ALLOW: Decision = { allowed: true }

/** Can this org register one more device? */
export function evaluateDeviceRegistration(plan: Plan, activeDeviceCount: number): Decision {
  const { deviceLimit } = limitsFor(plan)
  if (activeDeviceCount >= deviceLimit) {
    return {
      allowed: false,
      code: 'DEVICE_LIMIT',
      reason: `Plan '${plan}' allows ${deviceLimit} device(s); ${activeDeviceCount} already active. Revoke a device or upgrade.`,
    }
  }
  return ALLOW
}

/** Is a single transaction of the given source admissible right now? */
export function evaluateTransaction(
  plan: Plan,
  source: TxnSource,
  monthlyUsedSoFar: number,
): Decision {
  const limits = limitsFor(plan)

  // Manual imports are always allowed (subject to month cap for paid plans).
  const isAuto = source === 'notification'
  if (isAuto && !limits.autoDetection) {
    return {
      allowed: false,
      code: 'PLAN_NO_AUTO',
      reason: `Plan '${plan}' is manual-import only. Upgrade to Basic for automatic detection.`,
    }
  }

  // Free has no monthly synced cap because it only accepts manual imports;
  // paid plans enforce the monthly transaction limit.
  if (plan !== 'free' && monthlyUsedSoFar >= limits.monthlyTxnLimit) {
    return {
      allowed: false,
      code: 'TXN_LIMIT',
      reason: `Monthly limit of ${limits.monthlyTxnLimit} transactions reached for plan '${plan}'.`,
    }
  }
  return ALLOW
}

export interface SyncItem {
  dedupeHash: string
  source: TxnSource
}

export interface SyncEvaluation {
  accepted: SyncItem[]
  rejected: { item: SyncItem; code: DenyCode; reason: string }[]
}

/**
 * Idempotent + limit-aware batch evaluation. Already-seen dedupe hashes are
 * skipped (idempotency); the rest are admitted until the monthly cap is hit.
 */
export function evaluateSyncBatch(
  plan: Plan,
  monthlyUsedSoFar: number,
  knownHashes: Set<string>,
  items: SyncItem[],
): SyncEvaluation {
  const accepted: SyncItem[] = []
  const rejected: SyncEvaluation['rejected'] = []
  let used = monthlyUsedSoFar

  for (const item of items) {
    if (knownHashes.has(item.dedupeHash)) continue // idempotent: silently de-duped
    const d = evaluateTransaction(plan, item.source, used)
    if (d.allowed) {
      accepted.push(item)
      if (item.source !== 'manual_paste') used += 1
    } else {
      rejected.push({ item, code: d.code!, reason: d.reason! })
    }
  }
  return { accepted, rejected }
}

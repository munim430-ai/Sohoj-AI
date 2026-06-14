-- Migration 002: atomic credit accounting, payment idempotency, RLS hardening.

-- 1. Atomic credit deduction.
-- Returns the new balance and whether the deduction succeeded. Enterprise
-- (credit_balance = -1) is treated as unlimited and never decremented.
CREATE OR REPLACE FUNCTION deduct_credits(p_org_id UUID, p_amount BIGINT DEFAULT 1)
RETURNS TABLE(success BOOLEAN, remaining BIGINT)
LANGUAGE plpgsql
AS $$
DECLARE
  v_tier TEXT;
  v_balance BIGINT;
BEGIN
  SELECT subscription_tier, credit_balance
    INTO v_tier, v_balance
  FROM organizations
  WHERE id = p_org_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 0::BIGINT;
    RETURN;
  END IF;

  -- Unlimited tier: no decrement.
  IF v_tier = 'enterprise' OR v_balance = -1 THEN
    RETURN QUERY SELECT TRUE, -1::BIGINT;
    RETURN;
  END IF;

  IF v_balance < p_amount THEN
    RETURN QUERY SELECT FALSE, v_balance;
    RETURN;
  END IF;

  UPDATE organizations
     SET credit_balance = credit_balance - p_amount,
         updated_at = NOW()
   WHERE id = p_org_id;

  RETURN QUERY SELECT TRUE, (v_balance - p_amount);
END;
$$;

-- 2. Atomic credit top-up (used by the verified payment webhook).
CREATE OR REPLACE FUNCTION add_credits(p_org_id UUID, p_amount BIGINT)
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
  v_balance BIGINT;
BEGIN
  UPDATE organizations
     SET credit_balance = CASE
           WHEN subscription_tier = 'enterprise' OR credit_balance = -1 THEN -1
           ELSE credit_balance + p_amount
         END,
         updated_at = NOW()
   WHERE id = p_org_id
   RETURNING credit_balance INTO v_balance;
  RETURN v_balance;
END;
$$;

-- 3. Payment idempotency: a webhook must only ever apply credits once.
ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS processed_at TIMESTAMP WITH TIME ZONE;

-- 4. Rate-limit / abuse bookkeeping table (best-effort, cheap).
CREATE TABLE IF NOT EXISTS rate_limit_events (
  id BIGSERIAL PRIMARY KEY,
  bucket_key TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_rate_limit_bucket_time
  ON rate_limit_events (bucket_key, created_at DESC);

-- 5. Lock down service-role-only functions from the anon role.
REVOKE ALL ON FUNCTION deduct_credits(UUID, BIGINT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION add_credits(UUID, BIGINT) FROM PUBLIC, anon;

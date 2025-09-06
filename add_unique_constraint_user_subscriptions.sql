-- Add UNIQUE constraint on user_id in user_subscriptions table
-- This ensures only one subscription record per user

ALTER TABLE user_subscriptions 
ADD CONSTRAINT unique_user_subscription 
UNIQUE (user_id);

-- Optional: Add index for better performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id 
ON user_subscriptions (user_id);

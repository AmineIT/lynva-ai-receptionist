-- Add foreign key constraint to users table for business_id
-- This ensures data integrity between users and businesses tables

-- First, remove any orphaned records (users without valid business_id)
DELETE FROM users WHERE business_id IS NOT NULL AND business_id NOT IN (SELECT id FROM businesses);

-- Add the foreign key constraint
ALTER TABLE users 
ADD CONSTRAINT users_business_id_fkey 
FOREIGN KEY (business_id) 
REFERENCES businesses(id) 
ON DELETE CASCADE;

-- Add index for better performance on business_id queries
CREATE INDEX IF NOT EXISTS idx_users_business_id ON users(business_id);

-- Add comment to document the relationship
COMMENT ON COLUMN users.business_id IS 'Foreign key reference to businesses table. Each user belongs to one business.';

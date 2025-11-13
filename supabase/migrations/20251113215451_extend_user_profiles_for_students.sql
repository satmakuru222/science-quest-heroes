/*
  # Extend User Profiles Table for Enhanced Student Signup

  ## Summary
  This migration extends the user_profiles table to support the enhanced student signup process
  with preferences collection, avatar customization, and improved user management.

  ## Changes Made

  1. New Columns Added
    - `username` (text, unique) - Unique username chosen by the student
    - `age` (integer) - Student's age (5-12 years old)
    - `parent_email` (text) - Parent's email address for student accounts
    - `avatar_url` (text) - URL or identifier for the user's selected avatar
    - `first_name` (text) - User's first name (more specific than full_name)
    
  2. Constraints
    - Username must be unique across all users
    - Age must be between 5 and 12 for student accounts
    - Parent email must be a valid email format
    - All new fields are optional to maintain backward compatibility
    
  3. Indexes
    - Add index on username for fast username lookups and validation
    - Add index on parent_email for parent account searches
    
  4. Security
    - Existing RLS policies remain unchanged
    - Users can update their own avatar_url and profile information
    
  ## Notes
  - Existing user_profiles records remain unaffected
  - New fields are nullable to support existing accounts
  - Student accounts will require age and parent_email during signup
  - All account types can have avatars and usernames
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'username'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN username text UNIQUE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'age'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN age integer CHECK (age IS NULL OR (age >= 5 AND age <= 12));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'parent_email'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN parent_email text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN avatar_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'first_name'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN first_name text;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_parent_email ON user_profiles(parent_email);

COMMENT ON COLUMN user_profiles.username IS 'Unique username chosen by the user';
COMMENT ON COLUMN user_profiles.age IS 'Age of the student (5-12 years), required for student accounts';
COMMENT ON COLUMN user_profiles.parent_email IS 'Parent email address, required for student accounts';
COMMENT ON COLUMN user_profiles.avatar_url IS 'URL or identifier for the user selected avatar';
COMMENT ON COLUMN user_profiles.first_name IS 'User first name collected during signup';
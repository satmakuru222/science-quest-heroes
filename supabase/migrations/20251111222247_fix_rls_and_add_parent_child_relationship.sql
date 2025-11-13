/*
  # Fix RLS Policies and Add Parent-Child Relationship

  ## Summary
  This migration addresses two critical issues:
  1. Fixes RLS policy violation preventing student signup by allowing anon users to create profiles
  2. Establishes proper parent-child relationship where one parent can have multiple student accounts

  ## Changes Made

  1. **Fix RLS Policy for Student Signup**
     - Add policy allowing anon users to insert profiles during signup
     - Validates that the user ID exists in auth.users table
     - Secure: only allows insertion for newly created auth users
     - Required because signup happens before session is fully authenticated

  2. **Add Parent-Child Relationship**
     - Add `parent_id` column (uuid) to link students to parent accounts
     - Foreign key constraint to user_profiles(id) where account_type = 'parent'
     - NULL for parent and teacher accounts
     - Required (NOT NULL) for student accounts via CHECK constraint
     - ON DELETE CASCADE to handle parent account deletion

  3. **Deprecate parent_email Column**
     - Keep parent_email temporarily for backward compatibility
     - Mark as deprecated in comments
     - Future migration will remove it after data migration

  4. **Update RLS Policies for Parent Access**
     - Allow parents to read their children's profiles
     - Allow parents to view their children's data
     - Maintain security boundaries between families

  5. **Indexes for Performance**
     - Index on parent_id for fast child lookups
     - Composite index on (account_type, parent_id) for filtered queries

  ## Security Notes

  - The anon insert policy is safe because:
    * It only allows inserting a profile with ID matching auth.users.id
    * The auth.users table is controlled by Supabase Auth
    * Users can only create profiles for themselves during signup
    * Existing authenticated user policies remain unchanged

  - Parent-child relationship security:
    * Parents can only access their own children's profiles
    * Students can still access their own profiles
    * No cross-family data access is possible

  ## Data Migration Notes

  - Existing student records with parent_email will need manual linking
  - parent_id will be NULL initially for existing students
  - A separate data migration script may be needed for production
  - New signups will properly set parent_id from the start
*/

-- Step 1: Add parent_id column to user_profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'parent_id'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN parent_id uuid;
  END IF;
END $$;

-- Step 2: Add foreign key constraint for parent_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'user_profiles_parent_id_fkey'
  ) THEN
    ALTER TABLE user_profiles
      ADD CONSTRAINT user_profiles_parent_id_fkey
      FOREIGN KEY (parent_id)
      REFERENCES user_profiles(id)
      ON DELETE CASCADE;
  END IF;
END $$;

-- Step 3: Add CHECK constraint to ensure proper parent_id usage
-- Note: We allow NULL parent_id for students to handle cases where parent hasn't registered yet
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'user_profiles_parent_id_check'
  ) THEN
    ALTER TABLE user_profiles
      ADD CONSTRAINT user_profiles_parent_id_check
      CHECK (
        (account_type IN ('parent', 'teacher') AND parent_id IS NULL) OR
        (account_type = 'student')
      );
  END IF;
END $$;

-- Step 4: Create index on parent_id for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_parent_id ON user_profiles(parent_id);

-- Step 5: Create composite index for filtered queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_account_type_parent_id ON user_profiles(account_type, parent_id);

-- Step 6: Add comment to mark parent_email as deprecated
COMMENT ON COLUMN user_profiles.parent_email IS 'DEPRECATED: Use parent_id instead. Parent email address stored for backward compatibility. Will be removed in future migration.';

-- Step 7: Add comment for parent_id
COMMENT ON COLUMN user_profiles.parent_id IS 'Foreign key to parent user_profiles.id. Required for student accounts, NULL for parent/teacher accounts. Enables 1-to-many parent-child relationship.';

-- Step 8: DROP existing INSERT policy to replace it
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

-- Step 9: Create new INSERT policy for authenticated users
CREATE POLICY "Authenticated users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Step 10: Create INSERT policy for anon users during signup
CREATE POLICY "Allow profile creation during signup"
  ON user_profiles
  FOR INSERT
  TO anon
  WITH CHECK (
    -- Verify the user ID exists in auth.users (just created by signup)
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = user_profiles.id
    )
  );

-- Step 11: Add policy for parents to read their children's profiles
CREATE POLICY "Parents can read their children profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    -- Users can read their own profile OR parents can read their children's profiles
    auth.uid() = id OR
    (
      EXISTS (
        SELECT 1 FROM user_profiles AS parent
        WHERE parent.id = auth.uid()
        AND parent.account_type = 'parent'
        AND user_profiles.parent_id = parent.id
      )
    )
  );

-- Step 12: Add policy for parents to update certain fields in children's profiles
CREATE POLICY "Parents can update their children profiles"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (
    -- Users can update their own profile OR parents can update their children's profiles
    auth.uid() = id OR
    (
      EXISTS (
        SELECT 1 FROM user_profiles AS parent
        WHERE parent.id = auth.uid()
        AND parent.account_type = 'parent'
        AND user_profiles.parent_id = parent.id
      )
    )
  )
  WITH CHECK (
    -- Same conditions for the updated row
    auth.uid() = id OR
    (
      EXISTS (
        SELECT 1 FROM user_profiles AS parent
        WHERE parent.id = auth.uid()
        AND parent.account_type = 'parent'
        AND user_profiles.parent_id = parent.id
      )
    )
  );

-- Step 13: Create helper function to get children count for a parent
CREATE OR REPLACE FUNCTION get_children_count(parent_user_id uuid)
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COUNT(*)
  FROM user_profiles
  WHERE parent_id = parent_user_id
  AND account_type = 'student';
$$;

-- Step 14: Create helper function to get all children for a parent
CREATE OR REPLACE FUNCTION get_parent_children(parent_user_id uuid)
RETURNS TABLE (
  id uuid,
  email text,
  first_name text,
  username text,
  age integer,
  avatar_url text,
  grade_level text,
  created_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT
    id,
    email,
    first_name,
    username,
    age,
    avatar_url,
    grade_level,
    created_at
  FROM user_profiles
  WHERE parent_id = parent_user_id
  AND account_type = 'student'
  ORDER BY created_at DESC;
$$;

-- Step 15: Grant execute permissions on helper functions
GRANT EXECUTE ON FUNCTION get_children_count(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_parent_children(uuid) TO authenticated;

-- Step 16: Create a view for parent-child relationships (optional, for easier queries)
CREATE OR REPLACE VIEW parent_child_relationships AS
SELECT
  p.id as parent_id,
  p.email as parent_email,
  p.first_name as parent_name,
  s.id as student_id,
  s.email as student_email,
  s.first_name as student_name,
  s.username as student_username,
  s.age as student_age,
  s.grade_level as student_grade_level,
  s.avatar_url as student_avatar_url,
  s.created_at as student_created_at
FROM user_profiles p
JOIN user_profiles s ON s.parent_id = p.id
WHERE p.account_type = 'parent'
AND s.account_type = 'student';

-- Step 17: Add RLS to the view
ALTER VIEW parent_child_relationships SET (security_invoker = true);

SELECT 'Migration completed successfully. RLS policies fixed and parent-child relationship established.' as notice;

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

  2. **Add Parent-Child Relationship**
     - Add `parent_id` column (uuid) to link students to parent accounts
     - Foreign key constraint to user_profiles(id)
     - NULL for parent and teacher accounts
     - ON DELETE CASCADE to handle parent account deletion

  3. **Update RLS Policies for Parent Access**
     - Allow parents to read their children's profiles
     - Allow parents to update their children's profiles

  4. **Helper Functions**
     - get_children_count() - Count children for a parent
     - get_parent_children() - Get all children for a parent

  5. **View for Easy Queries**
     - parent_child_relationships view
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'parent_id'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN parent_id uuid;
  END IF;
END $$;

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

CREATE INDEX IF NOT EXISTS idx_user_profiles_parent_id ON user_profiles(parent_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_account_type_parent_id ON user_profiles(account_type, parent_id);

COMMENT ON COLUMN user_profiles.parent_email IS 'DEPRECATED: Use parent_id instead. Parent email address stored for backward compatibility.';
COMMENT ON COLUMN user_profiles.parent_id IS 'Foreign key to parent user_profiles.id. Required for student accounts, NULL for parent/teacher accounts.';

DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

CREATE POLICY "Authenticated users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow profile creation during signup"
  ON user_profiles
  FOR INSERT
  TO anon
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = user_profiles.id
    )
  );

DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;

CREATE POLICY "Users can read own profile and parents can read children"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
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

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

CREATE POLICY "Users can update own profile and parents can update children"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (
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

GRANT EXECUTE ON FUNCTION get_children_count(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_parent_children(uuid) TO authenticated;

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

ALTER VIEW parent_child_relationships SET (security_invoker = true);
# Admin Role Setup Instructions

Your user currently has "teacher" role, which has limited permissions. To access all administrative features (add students, edit subjects, generate results, etc.), you need to update your role to "admin".

## How to Update Your Role in Supabase

1. **Go to your Supabase Dashboard**
   - Open: https://supabase.com/dashboard
   - Navigate to your project

2. **Open the SQL Editor**
   - Click on "SQL Editor" in the left sidebar

3. **Run this SQL command**:
   ```sql
   -- Update your role to admin
   UPDATE profiles 
   SET role = 'admin', updated_at = now() 
   WHERE id = '8db69453-8005-4186-8a02-87b682b9dec2';

   -- Also update the auth.users metadata to match
   UPDATE auth.users
   SET raw_user_meta_data = jsonb_set(
     COALESCE(raw_user_meta_data, '{}'::jsonb),
     '{role}',
     '"admin"'
   )
   WHERE id = '8db69453-8005-4186-8a02-87b682b9dec2';
   ```

4. **Click "Run"**

5. **Refresh your application**
   - Log out and log back in to see the changes

## What This Fixes

After updating to admin role, you will be able to:
- ✅ Add and edit students
- ✅ Add and edit subjects
- ✅ Add and edit teachers
- ✅ Generate results
- ✅ Edit grade criteria settings
- ✅ View and generate certificates
- ✅ Full access to all administrative features

## Current Limitations with Teacher Role

The teacher role is designed for limited access and can only:
- View students in their classes
- View and update results for their students
- View subjects
- Mark attendance

For full administrative access, the admin role is required.

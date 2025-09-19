-- Add triggers and functions for automatic timestamps and profile creation

-- Create function to handle automatic profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', new.email), 'teacher');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function for updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_results_updated_at BEFORE UPDATE ON results FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default school
INSERT INTO schools (name, address, phone, email, principal_name) VALUES
('Adventist College Secondary School', 'Mauritius', '+230 1234567', 'admin@adventistcollege.mu', 'Dr. John Smith')
ON CONFLICT DO NOTHING;

-- Insert default subjects for grades 7-13
INSERT INTO subjects (name, code, grade_levels, description, is_core_subject) VALUES
('Mathematics', 'MATH', '{7,8,9,10,11,12,13}', 'Core mathematics curriculum', true),
('English Language', 'ENG', '{7,8,9,10,11,12,13}', 'English language and literature', true),
('Science', 'SCI', '{7,8,9}', 'General science for lower grades', true),
('Biology', 'BIO', '{10,11,12,13}', 'Biological sciences', true),
('Chemistry', 'CHEM', '{10,11,12,13}', 'Chemical sciences', true),
('Physics', 'PHYS', '{10,11,12,13}', 'Physical sciences', true),
('History', 'HIST', '{7,8,9,10,11,12,13}', 'World and regional history', false),
('Geography', 'GEO', '{7,8,9,10,11,12,13}', 'Physical and human geography', false),
('French', 'FR', '{7,8,9,10,11,12,13}', 'French language', false),
('Physical Education', 'PE', '{7,8,9,10,11,12,13}', 'Physical education and sports', false),
('Art', 'ART', '{7,8,9,10,11,12,13}', 'Visual arts and creativity', false),
('Music', 'MUS', '{7,8,9,10,11,12,13}', 'Music theory and practice', false),
('Computer Science', 'CS', '{9,10,11,12,13}', 'Computer programming and IT', false),
('Economics', 'ECON', '{11,12,13}', 'Economic principles and analysis', false),
('Accounting', 'ACC', '{11,12,13}', 'Financial accounting principles', false),
('Design Technology', 'DT', '{9,10,11,12,13}', 'Design and technology projects', false)
ON CONFLICT (code) DO NOTHING;
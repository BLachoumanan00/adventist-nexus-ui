-- Enhanced database schema for comprehensive school management system

-- Update students table with enhanced fields for disciplinary records and flexible responsible party contacts
ALTER TABLE students ADD COLUMN IF NOT EXISTS disciplinary_records JSONB DEFAULT '[]'::jsonb;
ALTER TABLE students ADD COLUMN IF NOT EXISTS responsible_parties JSONB DEFAULT '[]'::jsonb;
ALTER TABLE students ADD COLUMN IF NOT EXISTS remarks TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';

-- Update teachers table with flexible fields
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}'::jsonb;

-- Add subjects table with grade level support
CREATE TABLE IF NOT EXISTS subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) UNIQUE,
  grade_levels INTEGER[] DEFAULT '{7,8,9,10,11,12,13}',
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add student_subjects junction table
CREATE TABLE IF NOT EXISTS student_subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(student_id, subject_id)
);

-- Add attendance table for tracking student presence
CREATE TABLE IF NOT EXISTS attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  notes TEXT,
  marked_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, date)
);

-- Add results table for exam/test results
CREATE TABLE IF NOT EXISTS results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  exam_type VARCHAR(50) NOT NULL,
  exam_date DATE,
  marks_obtained DECIMAL(5,2),
  total_marks DECIMAL(5,2),
  grade VARCHAR(5),
  remarks TEXT,
  academic_year VARCHAR(10),
  term VARCHAR(20),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add communications table for parent-school messaging
CREATE TABLE IF NOT EXISTS communications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  recipient_name VARCHAR(100),
  recipient_phone VARCHAR(20),
  recipient_email VARCHAR(100),
  message_type VARCHAR(20) NOT NULL CHECK (message_type IN ('attendance', 'behavior', 'academic', 'general')),
  subject VARCHAR(200),
  message TEXT NOT NULL,
  method VARCHAR(10) NOT NULL CHECK (method IN ('sms', 'email', 'call')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed')),
  sent_at TIMESTAMP WITH TIME ZONE,
  sent_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subjects
CREATE POLICY "Users can view all subjects" ON subjects FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage subjects" ON subjects FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for student_subjects
CREATE POLICY "Users can view all student subjects" ON student_subjects FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage student subjects" ON student_subjects FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for attendance
CREATE POLICY "Users can view all attendance" ON attendance FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage attendance" ON attendance FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for results
CREATE POLICY "Users can view all results" ON results FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage results" ON results FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for communications
CREATE POLICY "Users can view all communications" ON communications FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage communications" ON communications FOR ALL USING (auth.role() = 'authenticated');

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_results_updated_at BEFORE UPDATE ON results FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default subjects for all grades
INSERT INTO subjects (name, code, grade_levels, description) VALUES
('Mathematics', 'MATH', '{7,8,9,10,11,12,13}', 'Core mathematics curriculum'),
('English Language', 'ENG', '{7,8,9,10,11,12,13}', 'English language and literature'),
('Science', 'SCI', '{7,8,9}', 'General science for lower grades'),
('Biology', 'BIO', '{10,11,12,13}', 'Biological sciences'),
('Chemistry', 'CHEM', '{10,11,12,13}', 'Chemical sciences'),
('Physics', 'PHYS', '{10,11,12,13}', 'Physical sciences'),
('History', 'HIST', '{7,8,9,10,11,12,13}', 'World and regional history'),
('Geography', 'GEO', '{7,8,9,10,11,12,13}', 'Physical and human geography'),
('French', 'FR', '{7,8,9,10,11,12,13}', 'French language'),
('Physical Education', 'PE', '{7,8,9,10,11,12,13}', 'Physical education and sports'),
('Art', 'ART', '{7,8,9,10,11,12,13}', 'Visual arts and creativity'),
('Music', 'MUS', '{7,8,9,10,11,12,13}', 'Music theory and practice'),
('Computer Science', 'CS', '{9,10,11,12,13}', 'Computer programming and IT'),
('Economics', 'ECON', '{11,12,13}', 'Economic principles and analysis'),
('Accounting', 'ACC', '{11,12,13}', 'Financial accounting principles'),
('Design Technology', 'DT', '{9,10,11,12,13}', 'Design and technology projects')
ON CONFLICT (code) DO NOTHING;
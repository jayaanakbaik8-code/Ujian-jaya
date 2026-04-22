-- SCHEMA FOR SMK PRIMA UNGGUL ONLINE EXAM SYSTEM

-- 1. Profiles Table (Extends Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'SISWA' CHECK (role IN ('ADMIN', 'GURU', 'TENEGA_KEPENDIDIKAN', 'SISWA')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Students Table (For NIS management)
CREATE TABLE students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nis TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  class_name TEXT NOT NULL,
  email TEXT UNIQUE, -- Optional link to auth
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Exams Table
CREATE TABLE exams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  created_by UUID REFERENCES profiles(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Questions Table
CREATE TABLE questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of strings
  correct_answer_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Results Table
CREATE TABLE results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  student_id UUID NOT NULL, -- Can be from profiles or students table depending on auth implementation
  score NUMERIC DEFAULT 0,
  answers JSONB DEFAULT '{}', -- questionId -> selectedIndex
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(exam_id, student_id)
);

-- ENABLE RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- POLICIES (Simple version for demo)
-- Admin & Guru can do everything
-- Others can read relevant bits

CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profiles" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger to handle new user role
-- The first user to sign up will be ADMIN
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.profiles) = 0 THEN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'ADMIN');
  ELSE
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'SISWA');
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

/*
  # Initial Schema Setup for Student Attendance System

  1. New Tables
    - `groups`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text, nullable)
      - `created_at` (timestamp)
      - `user_id` (uuid, references auth.users)

    - `students`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, nullable)
      - `group_id` (uuid, references groups)
      - `created_at` (timestamp)

    - `attendance_records`
      - `id` (uuid, primary key)
      - `date` (date)
      - `student_id` (uuid, references students)
      - `status` (text, check constraint for valid statuses)
      - `created_at` (timestamp)
      - `group_id` (uuid, references groups)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create groups table
CREATE TABLE IF NOT EXISTS groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own groups"
  ON groups
  USING (auth.uid() = user_id);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage students in their groups"
  ON students
  USING (
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = students.group_id
      AND groups.user_id = auth.uid()
    )
  );

-- Create attendance_records table
CREATE TABLE IF NOT EXISTS attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  student_id uuid REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL CHECK (status IN ('present', 'absent', 'justified')),
  created_at timestamptz DEFAULT now(),
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE NOT NULL
);

ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage attendance records for their groups"
  ON attendance_records
  USING (
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = attendance_records.group_id
      AND groups.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_group_id ON students(group_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_date ON attendance_records(date);
CREATE INDEX IF NOT EXISTS idx_attendance_records_group_id ON attendance_records(group_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_student_id ON attendance_records(student_id);
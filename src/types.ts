/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'ADMIN' | 'GURU' | 'TENEGA_KEPENDIDIKAN' | 'SISWA';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface Student {
  id: string;
  nis: string;
  name: string;
  class_name: string;
  created_at: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  created_by: string;
  created_at: string;
  is_active: boolean;
}

export interface Question {
  id: string;
  exam_id: string;
  question_text: string;
  options: string[]; // ['A: choice', 'B: choice', ...]
  correct_answer_index: number;
  created_at: string;
}

export interface ExamResult {
  id: string;
  exam_id: string;
  student_id: string;
  score: number;
  answers: Record<string, number>; // questionId -> optionIndex
  started_at: string;
  completed_at: string;
}

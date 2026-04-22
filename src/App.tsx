import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './components/AppLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import StudentManagement from './pages/StudentManagement';
import ExamManagement from './pages/ExamManagement';
import QuestionManagement from './pages/QuestionManagement';
import Monitoring from './pages/Monitoring';
import ExamTakingPage from './pages/ExamTakingPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Main App with Sidebar */}
          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<AppLayout><Dashboard /></AppLayout>} />
            
            {/* Admin Only */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/app/users" element={<AppLayout><UserManagement /></AppLayout>} />
              <Route path="/app/students" element={<AppLayout><StudentManagement /></AppLayout>} />
            </Route>

            {/* Admin & Guru */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'GURU']} />}>
              <Route path="/app/exams" element={<AppLayout><ExamManagement /></AppLayout>} />
              <Route path="/app/questions" element={<AppLayout><QuestionManagement /></AppLayout>} />
              <Route path="/app/results" element={<AppLayout><Monitoring /></AppLayout>} />
            </Route>

            {/* Admin & Tendik */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'TENEGA_KEPENDIDIKAN']} />}>
              <Route path="/app/monitoring" element={<AppLayout><Monitoring /></AppLayout>} />
            </Route>

            {/* Exam Taking (Special Layout if needed, but here simple route) */}
            <Route path="/app/exam/:examId" element={<ExamTakingPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

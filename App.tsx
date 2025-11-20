import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import StudentList from './views/StudentList';
import CurriculumManager from './views/CurriculumManager';
import StudentDetail from './views/StudentDetail';
import Dashboard from './views/Dashboard';
import { MontessoriProvider } from './context/MontessoriContext';

function App() {
  return (
    <MontessoriProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<StudentList />} />
            <Route path="/student/:id" element={<StudentDetail />} />
            <Route path="/curriculum" element={<CurriculumManager />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </HashRouter>
    </MontessoriProvider>
  );
}

export default App;

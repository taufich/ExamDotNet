import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import SDashboard from './components/SDashboard';
import TakeExam from './components/TakeExam';
import ProfilePage from './components/ProfilePage';
import ResultsPage from './components/ResultsPage';
import TDashboard from './components/TDashboard';
import CreateExam from './components/CreateExam';
import UpdateExam from './components/UpdateExam';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<SDashboard />} />
        <Route path="/exam/:id" element={<TakeExam />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/teacher-dashboard" element={<TDashboard />} />
        <Route path="/create-exam" element={<CreateExam />} />
        <Route path="/update-exam/:id" element={<UpdateExam />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

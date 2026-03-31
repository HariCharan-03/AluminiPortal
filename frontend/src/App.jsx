import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(30, 27, 75, 0.95)',
            backdropFilter: 'blur(20px)',
            color: '#e0e7ff',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '12px',
            padding: '14px 18px',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          },
          success: {
            iconTheme: { primary: '#818cf8', secondary: '#1e1b4b' },
          },
          error: {
            iconTheme: { primary: '#f87171', secondary: '#1e1b4b' },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

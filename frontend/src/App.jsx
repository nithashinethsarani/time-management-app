import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Pomodoro from './pages/Pomodoro';
import Schedule from './pages/Schedule';
import Reports from './pages/Reports';
import Profile from './pages/Profile';

function App() {
    return (
        <ThemeProvider>
            <NotificationProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/pomodoro" element={<Pomodoro />} />
                        <Route path="/schedule" element={<Schedule />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/" element={<Navigate to="/login" />} />
                    </Routes>
                </BrowserRouter>
            </NotificationProvider>
        </ThemeProvider>
    );
}

export default App;
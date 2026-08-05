import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isDark, toggleTheme } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const links = [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/schedule', label: 'Schedule' },
        { to: '/pomodoro', label: 'Pomodoro' },
        { to: '/reports', label: 'Reports' },
    ];

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-sm transition-colors">
            <div className="px-4 sm:px-6 py-4 flex justify-between items-center">
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">⏱ TimeManager</span>

                {/* Desktop links - hidden on mobile */}
                <div className="hidden md:flex items-center gap-8">
                    <div className="flex gap-1">
                        {links.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                    location.pathname === link.to
                                        ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            to="/profile"
                            className={`w-9 h-9 flex items-center justify-center rounded-lg text-lg transition ${
                                location.pathname === '/profile'
                                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                            title="Profile settings"
                        >
                            👤
                        </Link>
                        <button
                            onClick={toggleTheme}
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {isDark ? '☀️' : '🌙'}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Mobile hamburger button - hidden on desktop */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                >
                    {menuOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* Mobile dropdown menu */}
            {menuOpen && (
                <div className="md:hidden px-4 pb-4 flex flex-col gap-2 border-t border-gray-100 dark:border-gray-700 pt-4">
                    {links.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            onClick={() => setMenuOpen(false)}
                            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                                location.pathname === link.to
                                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        to="/profile"
                        onClick={() => setMenuOpen(false)}
                        className={`px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                            location.pathname === '/profile'
                                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        👤 Profile
                    </Link>
                    <button
                        onClick={toggleTheme}
                        className="px-4 py-2.5 rounded-lg text-sm font-medium text-left text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                        {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
                    </button>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium text-left hover:bg-red-100 dark:hover:bg-red-900/50 transition"
                    >
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
}

export default Navbar;

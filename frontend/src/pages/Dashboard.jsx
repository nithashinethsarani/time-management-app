import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getMySchedules } from '../api/scheduleApi';
import { getMySessions } from '../api/pomodoroApi';
import { useNotification } from '../context/NotificationContext';

const DAY_MAP = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function Dashboard() {
    const [scheduleCount, setScheduleCount] = useState(0);
    const [completedPomodoros, setCompletedPomodoros] = useState(0);
    const [totalFocusMinutes, setTotalFocusMinutes] = useState(0);
    const [todaySchedules, setTodaySchedules] = useState([]);

    const { permission, requestPermission, sendNotification } = useNotification();
    const notifiedRef = useRef(new Set()); // දැනටමත් notify කරපු schedule IDs ටික, duplicate notifications වළක්වගන්න

    useEffect(() => {
        loadStats();
    }, []);

    // හැම 30 seconds කටම, schedules check කරලා, reminder time එකට ළඟදී ආවොත් notify කරනවා
    useEffect(() => {
        const interval = setInterval(() => {
            checkSchedulesForReminders();
        }, 30000);
        return () => clearInterval(interval);
    }, [todaySchedules, permission]);

    const checkSchedulesForReminders = () => {
        if (permission !== 'granted') return;

        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        todaySchedules.forEach((s) => {
            if (notifiedRef.current.has(s.id)) return;

            const [startHour, startMin] = s.startTime.split(':').map(Number);
            const scheduleMinutes = startHour * 60 + startMin;
            const reminderMinutes = s.reminderMinutesBefore ?? 10;
            const notifyAt = scheduleMinutes - reminderMinutes;

            if (currentMinutes >= notifyAt && currentMinutes < scheduleMinutes) {
                sendNotification(`Upcoming: ${s.title}`, {
                    body: `Starts at ${s.startTime.substring(0, 5)} (in ${reminderMinutes} min)`,
                    icon: '/favicon.svg',
                });
                notifiedRef.current.add(s.id);
            }
        });
    };

    const loadStats = async () => {
        try {
            const schedules = await getMySchedules();
            setScheduleCount(schedules.length);

            const todayKey = DAY_MAP[new Date().getDay()];
            const filtered = schedules
                .filter((s) => s.daysOfWeek.split(',').includes(todayKey))
                .sort((a, b) => a.startTime.localeCompare(b.startTime));
            setTodaySchedules(filtered);

            const sessions = await getMySessions();
            const completed = sessions.filter((s) => s.completed && s.type === 'WORK');
            setCompletedPomodoros(completed.length);

            const totalMinutes = completed.reduce((sum, s) => sum + s.plannedDurationMinutes, 0);
            setTotalFocusMinutes(totalMinutes);
        } catch (err) {
            console.error('Failed to load stats', err);
        }
    };

    const cards = [
        {
            to: '/schedule',
            title: 'Study Schedule',
            desc: 'Plan your study times and set reminders',
            icon: '📅',
            color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
        },
        {
            to: '/pomodoro',
            title: 'Pomodoro Timer',
            desc: 'Run focus sessions and track your breaks',
            icon: '🍅',
            color: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300',
        },
        {
            to: '/reports',
            title: 'Reports',
            desc: 'View your time usage and productivity',
            icon: '📊',
            color: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300',
        },
    ];

    const stats = [
        { label: 'Active Schedules', value: scheduleCount, icon: '📅', color: 'text-blue-600 dark:text-blue-400' },
        { label: 'Completed Pomodoros', value: completedPomodoros, icon: '🍅', color: 'text-red-500 dark:text-red-400' },
        { label: 'Total Focus Time', value: `${totalFocusMinutes} min`, icon: '⏱️', color: 'text-indigo-600 dark:text-indigo-400' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Navbar />
            <div className="max-w-6xl mx-auto px-6 py-10">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">Welcome back 👋</h1>
                <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">Welcome to your time management dashboard</p>

                {/* Notification Permission Banner */}
                {permission === 'default' && (
                    <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🔔</span>
                            <p className="text-sm text-amber-800 dark:text-amber-300">
                                Enable notifications to get reminders before your study sessions start.
                            </p>
                        </div>
                        <button
                            onClick={requestPermission}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg transition whitespace-nowrap"
                        >
                            Enable Notifications
                        </button>
                    </div>
                )}
                {permission === 'denied' && (
                    <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-8">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            🔕 Notifications are blocked. Enable them in your browser settings to get schedule reminders.
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 flex items-center gap-5 transition-colors"
                        >
                            <div className="text-5xl">{stat.icon}</div>
                            <div>
                                <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
                                <p className="text-base text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-10">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Today's Schedule</h2>
                    {todaySchedules.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400">
                            No study sessions scheduled for today.
                            <Link to="/schedule" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline ml-1">
                                Add one?
                            </Link>
                        </p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {todaySchedules.map((s) => (
                                <div
                                    key={s.id}
                                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg px-4 py-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">📖</span>
                                        <div>
                                            <p className="font-medium text-gray-800 dark:text-gray-100">{s.title}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {s.startTime.substring(0, 5)} - {s.endTime.substring(0, 5)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-5">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {cards.map((card) => (
                        <Link
                            key={card.to}
                            to={card.to}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 hover:shadow-md transition border border-gray-100 dark:border-gray-700"
                        >
                            <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl mb-5 ${card.color}`}>
                                {card.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{card.title}</h3>
                            <p className="text-base text-gray-500 dark:text-gray-400">{card.desc}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
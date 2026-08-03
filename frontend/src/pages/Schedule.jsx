import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { createSchedule, getMySchedules, updateSchedule, deleteSchedule } from '../api/scheduleApi';

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const DAY_LABELS = { MON: 'Monday', TUE: 'Tuesday', WED: 'Wednesday', THU: 'Thursday', FRI: 'Friday', SAT: 'Saturday', SUN: 'Sunday' };

function Schedule() {
    const [schedules, setSchedules] = useState([]);
    const [title, setTitle] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [selectedDays, setSelectedDays] = useState([]);
    const [reminderMinutesBefore, setReminderMinutesBefore] = useState(10);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
            const data = await getMySchedules();
            setSchedules(data);
        } catch (err) {
            console.error('Failed to load schedules', err);
        }
    };

    const toggleDay = (day) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter((d) => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    const resetForm = () => {
        setTitle('');
        setStartTime('');
        setEndTime('');
        setSelectedDays([]);
        setReminderMinutesBefore(10);
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (selectedDays.length === 0) {
            setError('Please select at least one day');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                title,
                startTime: startTime.length === 5 ? startTime + ':00' : startTime,
                endTime: endTime.length === 5 ? endTime + ':00' : endTime,
                daysOfWeek: selectedDays.join(','),
                reminderMinutesBefore: Number(reminderMinutesBefore),
            };

            if (editingId) {
                await updateSchedule(editingId, payload);
            } else {
                await createSchedule(payload);
            }

            resetForm();
            fetchSchedules();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save schedule');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (s) => {
        setEditingId(s.id);
        setTitle(s.title);
        setStartTime(s.startTime.substring(0, 5));
        setEndTime(s.endTime.substring(0, 5));
        setSelectedDays(s.daysOfWeek.split(','));
        setReminderMinutesBefore(s.reminderMinutesBefore ?? 10);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        resetForm();
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this schedule?')) return;
        try {
            await deleteSchedule(id);
            if (editingId === id) resetForm();
            fetchSchedules();
        } catch (err) {
            alert('Failed to delete');
        }
    };

    // දවසක් අනුව, ඒ දවසට schedule වෙච්ච items ටික ගන්නවා, time අනුව sort කරලා
    const getSchedulesForDay = (day) => {
        return schedules
            .filter((s) => s.daysOfWeek.split(',').includes(day))
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Navbar />
            <div className="max-w-6xl mx-auto px-6 py-10">
               <div className="flex justify-between items-center mb-6">
    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Study Schedule</h1>
    <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-xl">
        <button
            onClick={() => setViewMode('list')}
            className={`px-6 py-3 rounded-lg text-base font-semibold transition ${
                viewMode === 'list'
                    ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400'
            }`}
        >
            📋 List
        </button>
        <button
            onClick={() => setViewMode('calendar')}
            className={`px-6 py-3 rounded-lg text-base font-semibold transition ${
                viewMode === 'calendar'
                    ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400'
            }`}
        >
            🗓️ Calendar
        </button>
    </div>
</div>
                <div className="max-w-2xl">
                    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                {editingId ? 'Edit Schedule' : 'New Schedule'}
                            </h3>
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>

                        {error && (
                            <p className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm px-3 py-2 rounded-lg mb-4">{error}</p>
                        )}

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                            <input
                                type="text"
                                placeholder="e.g. Maths Study"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label>
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Days</label>
                            <div className="flex flex-wrap gap-2">
                                {DAYS.map((day) => (
                                    <button
                                        type="button"
                                        key={day}
                                        onClick={() => toggleDay(day)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                                            selectedDays.includes(day)
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Reminder (minutes before)
                            </label>
                            <input
                                type="number"
                                value={reminderMinutesBefore}
                                onChange={(e) => setReminderMinutesBefore(e.target.value)}
                                min="0"
                                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60"
                        >
                            {loading ? 'Saving...' : editingId ? 'Update Schedule' : 'Create Schedule'}
                        </button>
                    </form>
                </div>

                {/* List View */}
                {viewMode === 'list' && (
                    <div className="max-w-2xl">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">My Schedules</h3>
                        {schedules.length === 0 && <p className="text-gray-500 dark:text-gray-400">No schedules yet.</p>}
                        <div className="flex flex-col gap-3">
                            {schedules.map((s) => (
                                <div
                                    key={s.id}
                                    className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-4 flex justify-between items-center ${
                                        editingId === s.id ? 'border-indigo-400 dark:border-indigo-500 ring-2 ring-indigo-100 dark:ring-indigo-900' : 'border-gray-100 dark:border-gray-700'
                                    }`}
                                >
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-gray-100">{s.title}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{s.startTime} - {s.endTime}</p>
                                        <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{s.daysOfWeek}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditClick(s)}
                                            className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(s.id)}
                                            className="px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Calendar View */}
                {viewMode === 'calendar' && (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Weekly View</h3>
                        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                            {DAYS.map((day) => {
                                const daySchedules = getSchedulesForDay(day);
                                return (
                                    <div
                                        key={day}
                                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 min-h-[200px]"
                                    >
                                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">
                                            {DAY_LABELS[day]}
                                        </h4>
                                        {daySchedules.length === 0 ? (
                                            <p className="text-xs text-gray-400 dark:text-gray-500">No sessions</p>
                                        ) : (
                                            <div className="flex flex-col gap-2">
                                                {daySchedules.map((s) => (
                                                    <div
                                                        key={s.id}
                                                        onClick={() => handleEditClick(s)}
                                                        className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-lg p-2 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition"
                                                    >
                                                        <p className="text-xs font-semibold text-indigo-800 dark:text-indigo-300 truncate">{s.title}</p>
                                                        <p className="text-xs text-indigo-600 dark:text-indigo-400">
                                                            {s.startTime.substring(0, 5)} - {s.endTime.substring(0, 5)}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Schedule;
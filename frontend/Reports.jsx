import { useState } from 'react';
import Navbar from '../components/Navbar';
import { getReport } from '../api/reportApi';

const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

function Reports() {
    const [startDate, setStartDate] = useState(getTodayDate());
    const [endDate, setEndDate] = useState(getTodayDate());
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerateReport = async () => {
        setError('');
        setLoading(true);
        try {
            const start = `${startDate}T00:00:00`;
            const end = `${endDate}T23:59:59`;
            const data = await getReport(start, end);
            setReport(data);
        } catch (err) {
            setError('Failed to load report');
        } finally {
            setLoading(false);
        }
    };

    const maxMinutes = report ? Math.max(...Object.values(report.appBreakdown), 1) : 1;

    const stats = report
        ? [
              { label: 'Total Activity (min)', value: report.totalActivityMinutes, color: 'text-indigo-600 dark:text-indigo-400' },
              { label: 'Work Time (min)', value: report.totalWorkMinutes, color: 'text-red-500 dark:text-red-400' },
              { label: 'Break Time (min)', value: report.totalBreakMinutes, color: 'text-green-500 dark:text-green-400' },
              { label: 'Completed Pomodoros', value: report.completedPomodoros, color: 'text-amber-500 dark:text-amber-400' },
          ]
        : [];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Navbar />
            <div className="max-w-3xl mx-auto px-6 py-10">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Reports</h1>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-wrap gap-4 items-end mb-8">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <button
                        onClick={handleGenerateReport}
                        disabled={loading}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition disabled:opacity-60"
                    >
                        {loading ? 'Loading...' : 'Generate Report'}
                    </button>
                </div>

                {error && (
                    <p className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm px-3 py-2 rounded-lg mb-4">{error}</p>
                )}

                {!report && !loading && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-10 text-center">
                        <p className="text-4xl mb-3">📊</p>
                        <p className="text-gray-500 dark:text-gray-400">
                            Select a date range and click "Generate Report" to see your productivity data.
                        </p>
                    </div>
                )}

                {report && (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 text-center"
                                >
                                    <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Breakdown by App</h3>
                            {Object.keys(report.appBreakdown).length === 0 && (
                                <p className="text-gray-500 dark:text-gray-400">No data.</p>
                            )}
                            <div className="flex flex-col gap-3">
                                {Object.entries(report.appBreakdown).map(([appName, minutes]) => (
                                    <div key={appName} className="flex items-center gap-3">
                                        <span className="w-24 text-sm font-medium text-gray-700 dark:text-gray-300">{appName}</span>
                                        <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-5 overflow-hidden">
                                            <div
                                                className="bg-indigo-500 h-full rounded-full transition-all"
                                                style={{ width: `${(minutes / maxMinutes) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400 w-16 text-right">{minutes} min</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Reports;
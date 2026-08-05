import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { startSession, endSession } from '../api/pomodoroApi';

const WORK_MINUTES = 25;
const SHORT_BREAK_MINUTES = 5;
const LONG_BREAK_MINUTES = 15;
const SESSIONS_BEFORE_LONG_BREAK = 4;

function Pomodoro() {
    const [type, setType] = useState('WORK');
    const [secondsLeft, setSecondsLeft] = useState(WORK_MINUTES * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [showInfo, setShowInfo] = useState(false);
    const [workSessionsCompleted, setWorkSessionsCompleted] = useState(0);
    const [completedType, setCompletedType] = useState(null); // session එකක් ඉවර වෙලා, next step එකක් wait කරනවා
    const [nextType, setNextType] = useState(null);

    const intervalRef = useRef(null);
    const audioRef = useRef(null);

    useEffect(() => {
        if (isRunning && secondsLeft > 0) {
            intervalRef.current = setInterval(() => {
                setSecondsLeft((prev) => prev - 1);
            }, 1000);
        } else if (secondsLeft === 0 && isRunning) {
            handleSessionComplete();
        }
        return () => clearInterval(intervalRef.current);
    }, [isRunning, secondsLeft]);

    const getDurationForType = (t) => {
        if (t === 'WORK') return WORK_MINUTES;
        if (t === 'SHORT_BREAK') return SHORT_BREAK_MINUTES;
        return LONG_BREAK_MINUTES;
    };

    const playAlarm = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch((err) => console.error('Could not play alarm', err));
        }
    };

    const startTimerFor = async (sessionType) => {
        try {
            const duration = getDurationForType(sessionType);
            const session = await startSession(sessionType, duration);
            setType(sessionType);
            setSecondsLeft(duration * 60);
            setSessionId(session.id);
            setIsRunning(true);
            setCompletedType(null);
            setNextType(null);
        } catch (err) {
            alert('Could not start session. Please check that you are logged in.');
        }
    };

    const handleStart = () => startTimerFor(type);

    const handlePause = () => setIsRunning(false);
    const handleResume = () => setIsRunning(true);

    const getNextSessionType = (finishedType, workCount) => {
        if (finishedType === 'WORK') {
            const newCount = workCount + 1;
            return newCount % SESSIONS_BEFORE_LONG_BREAK === 0 ? 'LONG_BREAK' : 'SHORT_BREAK';
        }
        return 'WORK';
    };

    const handleSessionComplete = async () => {
        setIsRunning(false);
        playAlarm();

        if (sessionId) {
            try {
                await endSession(sessionId);
            } catch (err) {
                console.error('Failed to end session', err);
            }
        }

        const finishedType = type;
        if (finishedType === 'WORK') {
            setWorkSessionsCompleted((prev) => prev + 1);
        }

        const next = getNextSessionType(finishedType, workSessionsCompleted);
        setSessionId(null);
        setCompletedType(finishedType); // "session complete" card එක පෙන්නන්න
        setNextType(next);
    };

    const handleStartNext = () => {
        startTimerFor(nextType);
    };

    const handleDismissComplete = () => {
        setType(nextType);
        setSecondsLeft(getDurationForType(nextType) * 60);
        setCompletedType(null);
        setNextType(null);
    };

    const handleReset = () => {
        setIsRunning(false);
        clearInterval(intervalRef.current);
        setSecondsLeft(getDurationForType(type) * 60);
        setSessionId(null);
        setCompletedType(null);
        setNextType(null);
    };

    const handleTypeChange = (newType) => {
        setType(newType);
        setIsRunning(false);
        clearInterval(intervalRef.current);
        setSecondsLeft(getDurationForType(newType) * 60);
        setSessionId(null);
        setCompletedType(null);
        setNextType(null);
    };

    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const totalSeconds = getDurationForType(type) * 60;

    const typeColors = {
        WORK: 'text-red-500 border-red-500',
        SHORT_BREAK: 'text-green-500 border-green-500',
        LONG_BREAK: 'text-blue-500 border-blue-500',
    };

    const typeLabels = {
        WORK: 'Work session',
        SHORT_BREAK: 'Short Break',
        LONG_BREAK: 'Long Break',
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Navbar />

            <audio ref={audioRef} src="/alarm.mp3" />

            <div className="max-w-md mx-auto px-6 py-10 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Pomodoro Timer</h1>
                    <button
                        onClick={() => setShowInfo(!showInfo)}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                        title="How does this work?"
                    >
                        i
                    </button>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    🔥 {workSessionsCompleted} work session{workSessionsCompleted !== 1 ? 's' : ''} completed today
                </p>

                {showInfo && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-xl p-5 text-left mb-6">
                        <h3 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-2">How the Pomodoro Technique works</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                            The Pomodoro Technique is a time management method that breaks your work
                            into focused intervals, separated by short breaks:
                        </p>
                        <ol className="text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside space-y-1 mb-3">
                            <li>Work with full focus for <strong>25 minutes</strong> (one "Pomodoro")</li>
                            <li>Take a <strong>5-minute</strong> short break</li>
                            <li>After every 4 Pomodoros, take a longer <strong>15-minute</strong> break</li>
                        </ol>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            This app will automatically prompt you to start the next session when one finishes.
                        </p>
                    </div>
                )}

                {/* Session Complete Card - browser dialog එකට වෙනුවට */}
                {completedType && (
                    <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-6 mb-8">
                        <p className="text-3xl mb-2">🎉</p>
                        <p className="font-semibold text-green-800 dark:text-green-300 mb-1">
                            {typeLabels[completedType]} complete!
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-400 mb-4">
                            Ready for your next {typeLabels[nextType].toLowerCase()}?
                        </p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={handleStartNext}
                                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                            >
                                Start {typeLabels[nextType]}
                            </button>
                            <button
                                onClick={handleDismissComplete}
                                className="px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-lg transition hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                Later
                            </button>
                        </div>
                    </div>
                )}

                {!completedType && (
                    <>
                        <div className="flex justify-center gap-2 mb-8">
                            {[
                                { key: 'WORK', label: 'Work' },
                                { key: 'SHORT_BREAK', label: 'Short Break' },
                                { key: 'LONG_BREAK', label: 'Long Break' },
                            ].map((t) => (
                                <button
                                    key={t.key}
                                    onClick={() => handleTypeChange(t.key)}
                                    disabled={isRunning}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${
                                        type === t.key
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        <div
                            className={`w-64 h-64 mx-auto rounded-full border-8 flex items-center justify-center bg-white dark:bg-gray-800 shadow-lg mb-8 ${typeColors[type]}`}
                        >
                            <span className="text-5xl font-mono font-bold text-gray-800 dark:text-gray-100">
                                {formatTime(secondsLeft)}
                            </span>
                        </div>

                        <div className="flex justify-center gap-3">
                            {!isRunning && secondsLeft === totalSeconds && (
                                <button
                                    onClick={handleStart}
                                    className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                                >
                                    Start
                                </button>
                            )}
                            {isRunning && (
                                <button
                                    onClick={handlePause}
                                    className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition"
                                >
                                    Pause
                                </button>
                            )}
                            {!isRunning && secondsLeft > 0 && secondsLeft !== totalSeconds && (
                                <button
                                    onClick={handleResume}
                                    className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                                >
                                    Resume
                                </button>
                            )}
                            <button
                                onClick={handleReset}
                                className="px-8 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-lg transition"
                            >
                                Reset
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Pomodoro;

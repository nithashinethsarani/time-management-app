import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { verifyEmail } from '../api/authApi';

function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setErrorMessage('Invalid verification link.');
            return;
        }

        const doVerify = async () => {
            try {
                await verifyEmail(token);
                setStatus('success');
            } catch (err) {
                setStatus('error');
                setErrorMessage(err.response?.data?.error || 'Verification failed. The link may be invalid or expired.');
            }
        };

        doVerify();
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 px-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center">
                {status === 'verifying' && (
                    <>
                        <p className="text-4xl mb-4">⏳</p>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Verifying your email...</h2>
                        <p className="text-gray-500">Please wait a moment.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <p className="text-4xl mb-4">✅</p>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Email Verified!</h2>
                        <p className="text-gray-500 mb-6">Your email has been successfully verified.</p>
                        <Link
                            to="/dashboard"
                            className="inline-block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition"
                        >
                            Go to Dashboard
                        </Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <p className="text-4xl mb-4">❌</p>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Verification Failed</h2>
                        <p className="text-gray-500 mb-6">{errorMessage}</p>
                        <Link to="/dashboard" className="text-indigo-600 font-medium hover:underline">
                            Go to Dashboard
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default VerifyEmail;
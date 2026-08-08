import { useState } from 'react';

import { Link } from 'react-router-dom';

import { forgotPassword } from '../api/authApi';



function ForgotPassword() {

    const [email, setEmail] = useState('');

    const [error, setError] = useState('');

    const [success, setSuccess] = useState(false);

    const [loading, setLoading] = useState(false);



    const handleSubmit = async (e) => {

        e.preventDefault();

        setError('');

        setLoading(true);



        try {

            await forgotPassword(email);

            setSuccess(true);

        } catch (err) {

            setError('Something went wrong. Please try again.');

        } finally {

            setLoading(false);

        }

    };



    return (

        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 px-4">

            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">

                <h2 className="text-3xl font-bold text-gray-800 mb-1">Forgot Password?</h2>

                <p className="text-gray-500 mb-6">Enter your email and we'll send you a reset link</p>



                {success ? (

                    <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg mb-4">

                        If that email exists in our system, a password reset link has been sent. Please check your inbox.

                    </div>

                ) : (

                    <form onSubmit={handleSubmit}>

                        {error && (

                            <p className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg mb-4">

                                {error}

                            </p>

                        )}



                        <div className="mb-6">

                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>

                            <input

                                type="email"

                                placeholder="you@example.com"

                                value={email}

                                onChange={(e) => setEmail(e.target.value)}

                                required

                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"

                            />

                        </div>



                        <button

                            type="submit"

                            disabled={loading}

                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60"

                        >

                            {loading ? 'Sending...' : 'Send Reset Link'}

                        </button>

                    </form>

                )}



                <p className="text-center text-sm text-gray-500 mt-6">

                    Remembered your password?{' '}

                    <Link to="/login" className="text-indigo-600 font-medium hover:underline">

                        Login

                    </Link>

                </p>

            </div>

        </div>

    );

}



export default ForgotPassword;
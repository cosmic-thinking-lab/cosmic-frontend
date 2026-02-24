import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../hooks/useAdmin';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login, loading } = useAdmin();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const data = await login({ email, password });
            if (data.success) {
                localStorage.setItem('adminToken', data.token);
                // Remove insecure flag if it exists
                if (localStorage.getItem('isAdminAuthenticated')) {
                    localStorage.removeItem('isAdminAuthenticated');
                }
                navigate('/admin/dashboard');
            }
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || 'An error occurred. Please check backend connection.');
        }
    };

    return (
        <div className="min-h-screen bg-[#0d0d1a] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
                    <p className="text-gray-400">Please sign in to continue</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all font-inter"
                            placeholder="admin@cosmic.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all font-inter"
                            placeholder="••••••••"
                        />
                    </div>
                    {error && <p className="text-red-400 text-sm text-center font-medium">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-gray-200 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;

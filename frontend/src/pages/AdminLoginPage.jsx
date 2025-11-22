// src/pages/AdminLoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../services/api';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await loginAdmin({ email, password });
            const { access_token } = response.data;

            navigate('/admin/dashboard');

        } catch (err) {
            console.error("Login gagal:", err);
            setError(err.response?.data?.message || "Email atau password salah.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center mt-10">
            <div className="w-full max-w-md">
                <form onSubmit={handleSubmit}>
                    <Card title="Login Administrator">
                        {error && <p className="mb-4 text-center text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}
                        <div className="space-y-4">
                            <Input
                                label="Email"
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="admin@example.com"
                            />
                            <Input
                                label="Password"
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? 'Logging in...' : 'Login'}
                            </Button>
                        </div>
                    </Card>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;
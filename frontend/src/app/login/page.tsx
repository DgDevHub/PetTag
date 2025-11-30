'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Dog, Mail, Lock, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center space-x-2 mb-8">
                    <Dog className="w-10 h-10 text-orange-500" />
                    <span className="text-3xl font-bold bg-linear-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                        PetTag
                    </span>
                </Link>

                {/* Card */}
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                        Bem-vindo de volta! 🐾
                    </h1>
                    <p className="text-gray-600 text-center mb-8">
                        Entre para proteger seus pets
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                E-mail
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-gray-900 transition-colors placeholder:text-gray-400"
                                    placeholder="seu@email.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Senha
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-gray-900 transition-colors placeholder:text-gray-400"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-linear-to-r from-orange-500 to-pink-500 text-white py-3 rounded-xl font-bold text-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Entrando...</span>
                                </>
                            ) : (
                                <span>Entrar</span>
                            )}
                        </button>
                    </form>

                    {/* Register Link */}
                    <p className="text-center mt-6 text-gray-600">
                        Ainda não tem conta?{' '}
                        <Link href="/register" className="text-orange-500 font-bold hover:text-orange-600">
                            Cadastre-se grátis
                        </Link>
                    </p>
                </div>

                {/* Back to Home */}
                <Link
                    href="/"
                    className="block text-center mt-6 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    ← Voltar para início
                </Link>
            </div>
        </div>
    );
}

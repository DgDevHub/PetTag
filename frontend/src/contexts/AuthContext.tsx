'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const refreshUser = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await api.get('/users/me');
            setUser(response.data);
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await api.post('/users/login', { email, password });
            localStorage.setItem('token', response.data.token);
            setUser(response.data.user);
            toast.success('Login realizado com sucesso! 🐾');
            router.push('/dashboard');
        } catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao fazer login';
            toast.error(message);
            throw error;
        }
    };

    const register = async (name: string, email: string, password: string, phone?: string) => {
        try {
            await api.post('/users/register', { name, email, password, phone });
            toast.success('Conta criada com sucesso! 🎉');
            await login(email, password);
        } catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao criar conta';
            toast.error(message);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await api.post('/users/logout');
            localStorage.removeItem('token');
            setUser(null);
            toast.success('Até logo! 👋');
            router.push('/');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            // Mesmo com erro, limpa o estado local
            localStorage.removeItem('token');
            setUser(null);
            router.push('/');
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

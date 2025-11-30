'use client';

import { Dog } from 'lucide-react';

interface LoadingProps {
    message?: string;
}

export default function Loading({ message = 'Carregando...' }: LoadingProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
            <div className="text-center">
                <div className="relative inline-block">
                    <div className="animate-bounce">
                        <Dog className="w-16 h-16 text-orange-500" strokeWidth={2} />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-75"></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-150"></div>
                        </div>
                    </div>
                </div>
                <p className="mt-8 text-lg text-gray-700 font-medium">{message}</p>
            </div>
        </div>
    );
}

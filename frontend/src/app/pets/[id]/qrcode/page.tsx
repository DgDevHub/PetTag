'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { Dog, ArrowLeft, Download, ExternalLink, Edit, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

interface QRCode {
    id: string;
    qrCodeId: string;
    isActive: boolean;
    ownerName: string;
    ownerPhone: string;
    ownerEmail: string;
    ownerAddress: string;
    emergencyContact: string;
    emergencyPhone: string;
    rewardOffered: boolean;
    rewardAmount: string;
    additionalInfo: string;
    backgroundColor: string;
    foregroundColor: string;
    scanCount: number;
    pet: {
        id: string;
        name: string;
        species: string;
        breed: string;
        photo: string;
    };
}

export default function ViewQRCode() {
    const params = useParams();
    const router = useRouter();
    const petId = params.id as string;

    const [qrCode, setQRCode] = useState<QRCode | null>(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        fetchQRCode();
    }, [petId]);

    const fetchQRCode = async () => {
        try {
            const response = await api.get(`/pets/${petId}/qrcode`);
            setQRCode(response.data);
        } catch (error: any) {
            console.error('Erro ao buscar QR Code:', error);
            if (error.response?.status === 404) {
                toast.error('QR Code não encontrado');
                router.push('/dashboard');
            } else {
                toast.error('Erro ao carregar QR Code');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!qrCode) return;
        
        setDownloading(true);
        try {
            const response = await api.get(`/qrcode/download/${qrCode.qrCodeId}`, {
                responseType: 'blob',
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `qrcode-${qrCode.pet.name}.png`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            toast.success('QR Code baixado com sucesso! 🎉');
        } catch (error) {
            console.error('Erro ao baixar QR Code:', error);
            toast.error('Erro ao baixar QR Code');
        } finally {
            setDownloading(false);
        }
    };

    const handleDelete = async () => {
        if (!qrCode || !confirm('Tem certeza que deseja deletar este QR Code?')) return;

        try {
            await api.delete(`/qrcode/${qrCode.id}`);
            toast.success('QR Code deletado com sucesso!');
            router.push('/dashboard');
        } catch (error) {
            toast.error('Erro ao deletar QR Code');
        }
    };

    const publicUrl = qrCode ? `${window.location.origin}/pet/${qrCode.qrCodeId}` : '';

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500 mb-4"></div>
                        <p className="text-gray-600">Carregando QR Code...</p>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    if (!qrCode) {
        return null;
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-linear-to-br from-orange-50 via-pink-50 to-purple-50 py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Header */}
                    <div className="mb-8">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors mb-4"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Voltar ao Dashboard</span>
                        </Link>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                {qrCode.pet.photo ? (
                                    <img
                                        src={qrCode.pet.photo}
                                        alt={qrCode.pet.name}
                                        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                                    />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
                                        <Dog className="w-10 h-10 text-orange-500" />
                                    </div>
                                )}
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        QR Code de {qrCode.pet.name}
                                    </h1>
                                    <p className="text-gray-600">
                                        Escaneado {qrCode.scanCount} {qrCode.scanCount === 1 ? 'vez' : 'vezes'}
                                    </p>
                                </div>
                            </div>
                            <div className={`px-4 py-2 rounded-full font-medium ${
                                qrCode.isActive 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-red-100 text-red-700'
                            }`}>
                                {qrCode.isActive ? 'Ativo' : 'Inativo'}
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* QR Code Preview */}
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
                                Seu QR Code
                            </h2>
                            <div className="bg-gray-50 rounded-xl p-8 mb-6 flex items-center justify-center">
                                <img
                                    src={`http://localhost:3000/api/qrcode/view/${qrCode.qrCodeId}`}
                                    alt="QR Code"
                                    className="max-w-full h-auto"
                                    key={qrCode.qrCodeId}
                                />
                            </div>
                            
                            {/* Actions */}
                            <div className="space-y-3">
                                <Link
                                    href={`/pets/${petId}/qrcode/edit`}
                                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-xl transition-all hover:scale-105"
                                >
                                    <Edit className="w-5 h-5" />
                                    <span>Editar QR Code</span>
                                </Link>

                                <button
                                    onClick={handleDownload}
                                    disabled={downloading}
                                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50"
                                >
                                    {downloading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                            <span>Baixando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-5 h-5" />
                                            <span>Baixar QR Code</span>
                                        </>
                                    )}
                                </button>

                                <Link
                                    href={publicUrl}
                                    target="_blank"
                                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all hover:scale-105"
                                >
                                    <Eye className="w-5 h-5" />
                                    <span>Ver Página Pública (Teste)</span>
                                    <ExternalLink className="w-4 h-4" />
                                </Link>

                                <button
                                    onClick={handleDelete}
                                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 border-2 border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-all"
                                >
                                    <Trash2 className="w-5 h-5" />
                                    <span>Deletar QR Code</span>
                                </button>
                            </div>
                        </div>

                        {/* Info Card */}
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">
                                Informações do QR Code
                            </h2>
                            
                            <div className="space-y-4">
                                {/* Dados do Dono */}
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-2">Contato Principal</h3>
                                    <div className="text-gray-700 space-y-1">
                                        <p><strong>Nome:</strong> {qrCode.ownerName}</p>
                                        <p><strong>Telefone:</strong> {qrCode.ownerPhone}</p>
                                        {qrCode.ownerEmail && (
                                            <p><strong>Email:</strong> {qrCode.ownerEmail}</p>
                                        )}
                                        <p><strong>Endereço:</strong> {qrCode.ownerAddress}</p>
                                    </div>
                                </div>

                                {/* Contato de Emergência */}
                                {qrCode.emergencyContact && (
                                    <div className="pt-4 border-t">
                                        <h3 className="font-bold text-gray-900 mb-2">Contato de Emergência</h3>
                                        <div className="text-gray-700 space-y-1">
                                            <p><strong>Nome:</strong> {qrCode.emergencyContact}</p>
                                            {qrCode.emergencyPhone && (
                                                <p><strong>Telefone:</strong> {qrCode.emergencyPhone}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Recompensa */}
                                {qrCode.rewardOffered && (
                                    <div className="pt-4 border-t">
                                        <h3 className="font-bold text-green-600 mb-2">💰 Recompensa Oferecida</h3>
                                        <p className="text-gray-700">{qrCode.rewardAmount}</p>
                                    </div>
                                )}

                                {/* Informações Adicionais */}
                                {qrCode.additionalInfo && (
                                    <div className="pt-4 border-t">
                                        <h3 className="font-bold text-gray-900 mb-2">Informações Adicionais</h3>
                                        <p className="text-gray-700">{qrCode.additionalInfo}</p>
                                    </div>
                                )}

                                {/* Link Público */}
                                <div className="pt-4 border-t">
                                    <h3 className="font-bold text-gray-900 mb-2">Link Público</h3>
                                    <div className="bg-gray-50 rounded-lg p-3 break-all">
                                        <code className="text-sm text-gray-700">{publicUrl}</code>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Este é o link que será aberto quando alguém escanear o QR Code
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="mt-8 bg-linear-to-r from-orange-100 to-pink-100 rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                            Como usar seu QR Code? 🤔
                        </h3>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex items-start space-x-2">
                                <span className="text-orange-500 font-bold">1.</span>
                                <span>Baixe a imagem do QR Code clicando no botão acima</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="text-orange-500 font-bold">2.</span>
                                <span>Imprima o QR Code e cole na coleira do seu pet</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="text-orange-500 font-bold">3.</span>
                                <span>Quando alguém escanear, verá todas as suas informações de contato</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="text-orange-500 font-bold">4.</span>
                                <span>Use o botão "Ver Página Pública" para testar como ficará para quem encontrar seu pet</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

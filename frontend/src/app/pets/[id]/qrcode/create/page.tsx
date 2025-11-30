'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { Dog, ArrowLeft, Save, Phone, Mail, MapPin, AlertCircle, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

interface Pet {
    id: string;
    name: string;
    species: string;
    breed: string;
    photo: string;
}

export default function CreateQRCode() {
    const params = useParams();
    const router = useRouter();
    const petId = params.id as string;

    const [pet, setPet] = useState<Pet | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        ownerName: '',
        ownerPhone: '',
        ownerEmail: '',
        ownerAddress: '',
        emergencyContact: '',
        emergencyPhone: '',
        rewardOffered: false,
        rewardAmount: '',
        additionalInfo: '',
    });

    useEffect(() => {
        fetchPet();
    }, [petId]);

    const fetchPet = async () => {
        try {
            const response = await api.get(`/pets/${petId}`);
            setPet(response.data);
        } catch (error) {
            console.error('Erro ao buscar pet:', error);
            toast.error('Pet não encontrado');
            router.push('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData({ ...formData, [name]: checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await api.post(`/pets/${petId}/qrcode`, formData);
            toast.success('QR Code criado com sucesso! 🎉');
            router.push(`/pets/${petId}/qrcode`);
        } catch (error: any) {
            console.error('Erro ao criar QR Code:', error);
            toast.error(error.response?.data?.error || 'Erro ao criar QR Code');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-linear-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500 mb-4"></div>
                        <p className="text-gray-600">Carregando...</p>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-linear-to-br from-orange-50 via-pink-50 to-purple-50 py-12">
                <div className="container mx-auto px-4 max-w-3xl">
                    {/* Header */}
                    <div className="mb-8">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors mb-4"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Voltar ao Dashboard</span>
                        </Link>
                        <div className="flex items-center space-x-4">
                            {pet?.photo ? (
                                <img
                                    src={pet.photo}
                                    alt={pet.name}
                                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
                                    <Dog className="w-10 h-10 text-orange-500" />
                                </div>
                            )}
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Criar QR Code para {pet?.name} 🐾
                                </h1>
                                <p className="text-gray-600">
                                    Preencha os dados de contato para quem encontrar seu pet
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
                        {/* Alert */}
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6 flex items-start space-x-3">
                            <AlertCircle className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-bold text-blue-900 mb-1">Informação Importante</h3>
                                <p className="text-blue-700 text-sm">
                                    Essas informações serão exibidas quando alguém escanear o QR Code do seu pet. 
                                    Certifique-se de fornecer dados de contato atualizados!
                                </p>
                            </div>
                        </div>

                        {/* Dados do Dono */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                <Phone className="w-6 h-6 text-orange-500" />
                                <span>Dados de Contato</span>
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Seu Nome *
                                    </label>
                                    <input
                                        type="text"
                                        name="ownerName"
                                        value={formData.ownerName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-gray-900 transition-colors placeholder:text-gray-400"
                                        placeholder="João Silva"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Telefone *
                                    </label>
                                    <input
                                        type="tel"
                                        name="ownerPhone"
                                        value={formData.ownerPhone}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-gray-900 transition-colors placeholder:text-gray-400"
                                        placeholder="(11) 98765-4321"
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        name="ownerEmail"
                                        value={formData.ownerEmail}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-gray-900 transition-colors placeholder:text-gray-400"
                                        placeholder="joao@email.com"
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Endereço *
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <textarea
                                        name="ownerAddress"
                                        value={formData.ownerAddress}
                                        onChange={handleChange}
                                        required
                                        rows={2}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-gray-900 transition-colors resize-none placeholder:text-gray-400"
                                        placeholder="Rua das Flores, 123 - Bairro - Cidade/UF"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contato de Emergência */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                <AlertCircle className="w-6 h-6 text-red-500" />
                                <span>Contato de Emergência</span>
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nome
                                    </label>
                                    <input
                                        type="text"
                                        name="emergencyContact"
                                        value={formData.emergencyContact}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-gray-900 transition-colors placeholder:text-gray-400"
                                        placeholder="Maria Silva"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Telefone
                                    </label>
                                    <input
                                        type="tel"
                                        name="emergencyPhone"
                                        value={formData.emergencyPhone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-gray-900 transition-colors placeholder:text-gray-400"
                                        placeholder="(11) 91234-5678"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Recompensa */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                <DollarSign className="w-6 h-6 text-green-500" />
                                <span>Recompensa (Opcional)</span>
                            </h2>
                            <div className="flex items-center space-x-3 mb-4">
                                <input
                                    type="checkbox"
                                    name="rewardOffered"
                                    checked={formData.rewardOffered}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                                />
                                <label className="text-gray-700">
                                    Oferecer recompensa por encontrar meu pet
                                </label>
                            </div>
                            {formData.rewardOffered && (
                                <input
                                    type="text"
                                    name="rewardAmount"
                                    value={formData.rewardAmount}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-gray-900 transition-colors placeholder:text-gray-400"
                                    placeholder="Ex: R$ 500,00"
                                />
                            )}
                        </div>

                        {/* Informações Adicionais */}
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Informações Adicionais
                            </label>
                            <textarea
                                name="additionalInfo"
                                value={formData.additionalInfo}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-gray-900 transition-colors resize-none placeholder:text-gray-400"
                                placeholder="Comportamento do pet, cuidados especiais, etc."
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-linear-to-r from-orange-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {submitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                    <span>Criando QR Code...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    <span>Criar QR Code</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </ProtectedRoute>
    );
}

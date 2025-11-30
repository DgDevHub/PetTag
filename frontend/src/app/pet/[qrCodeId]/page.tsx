'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Dog, Phone, Mail, MapPin, AlertCircle, Heart, DollarSign } from 'lucide-react';

interface QRCodeData {
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
    pet: {
        id: string;
        name: string;
        species: string;
        breed: string;
        color: string;
        age: number;
        weight: number;
        photo: string;
        medicalInfo: string;
        observations: string;
    };
}

export default function PublicPetPage() {
    const params = useParams();
    const qrCodeId = params.qrCodeId as string;

    const [data, setData] = useState<QRCodeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPetInfo();
    }, [qrCodeId]);

    const fetchPetInfo = async () => {
        try {
            const response = await fetch(`/api/qrcode/public/${qrCodeId}`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    setError('QR Code não encontrado');
                } else if (response.status === 403) {
                    setError('Este QR Code está desativado');
                } else {
                    setError('Erro ao carregar informações');
                }
                return;
            }

            const result = await response.json();
            setData(result);
        } catch (err) {
            console.error('Erro ao buscar informações do pet:', err);
            setError('Erro ao carregar informações. Verifique sua conexão.');
        } finally {
            setLoading(false);
        }
    };

    const handleContact = (phone: string) => {
        window.location.href = `tel:${phone}`;
    };

    const handleEmail = (email: string) => {
        window.location.href = `mailto:${email}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 mb-4"></div>
                    <p className="text-gray-600 text-lg">Carregando informações do pet...</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Oops!
                    </h1>
                    <p className="text-gray-600">
                        {error || 'Não foi possível encontrar as informações deste pet.'}
                    </p>
                </div>
            </div>
        );
    }

    const pet = data.pet;

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 py-8 px-4">
            <div className="container mx-auto max-w-4xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center space-x-2 mb-4">
                        <Dog className="w-10 h-10 text-orange-500" />
                        <span className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                            PetTag
                        </span>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Você Encontrou {pet.name}!
                    </h1>
                    <p className="text-xl text-gray-600">
                        Este pet tem um dono que está procurando por ele
                    </p>
                </div>

                {/* Pet Photo */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
                    <div className="h-96 bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
                        {pet.photo ? (
                            <img
                                src={pet.photo}
                                alt={pet.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <Dog className="w-32 h-32 text-orange-300" />
                        )}
                    </div>
                </div>

                {/* Alert Box */}
                <div className="bg-red-50 border-4 border-red-300 rounded-2xl p-6 mb-6 flex items-start space-x-4">
                    <Heart className="w-8 h-8 text-red-500 shrink-0 mt-1 animate-pulse" />
                    <div>
                        <h2 className="text-2xl font-bold text-red-900 mb-2">
                            Por favor, entre em contato com o dono!
                        </h2>
                        <p className="text-red-700 text-lg">
                            Este pet tem um lar e uma família que o ama muito. 
                            Use os contatos abaixo para devolvê-lo para casa.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Pet Info */}
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Informações do Pet
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500">Nome</p>
                                <p className="text-lg font-bold text-gray-900">{pet.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Espécie / Raça</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {pet.species} {pet.breed && `• ${pet.breed}`}
                                </p>
                            </div>
                            {pet.color && (
                                <div>
                                    <p className="text-sm text-gray-500">Cor</p>
                                    <p className="text-lg font-bold text-gray-900">{pet.color}</p>
                                </div>
                            )}
                            {pet.age && (
                                <div>
                                    <p className="text-sm text-gray-500">Idade</p>
                                    <p className="text-lg font-bold text-gray-900">{pet.age} {pet.age === 1 ? 'ano' : 'anos'}</p>
                                </div>
                            )}
                            {pet.weight && (
                                <div>
                                    <p className="text-sm text-gray-500">Peso</p>
                                    <p className="text-lg font-bold text-gray-900">{pet.weight} kg</p>
                                </div>
                            )}
                            {pet.medicalInfo && (
                                <div>
                                    <p className="text-sm text-gray-500">Informações Médicas</p>
                                    <p className="text-gray-700">{pet.medicalInfo}</p>
                                </div>
                            )}
                            {pet.observations && (
                                <div>
                                    <p className="text-sm text-gray-500">Observações</p>
                                    <p className="text-gray-700">{pet.observations}</p>
                                </div>
                            )}
                            {data.additionalInfo && (
                                <div>
                                    <p className="text-sm text-gray-500">Informações Adicionais</p>
                                    <p className="text-gray-700">{data.additionalInfo}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        {/* Owner Contact */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Contato do Dono
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Nome</p>
                                    <p className="text-lg font-bold text-gray-900">{data.ownerName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Telefone</p>
                                    <button
                                        onClick={() => handleContact(data.ownerPhone)}
                                        className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 font-bold text-lg"
                                    >
                                        <Phone className="w-5 h-5" />
                                        <span>{data.ownerPhone}</span>
                                    </button>
                                </div>
                                {data.ownerEmail && (
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Email</p>
                                        <button
                                            onClick={() => handleEmail(data.ownerEmail)}
                                            className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 font-medium"
                                        >
                                            <Mail className="w-5 h-5" />
                                            <span className="break-all">{data.ownerEmail}</span>
                                        </button>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Endereço</p>
                                    <div className="flex items-start space-x-2 text-gray-700">
                                        <MapPin className="w-5 h-5 shrink-0 mt-0.5" />
                                        <span>{data.ownerAddress}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Emergency Contact */}
                        {data.emergencyContact && (
                            <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center space-x-2">
                                    <AlertCircle className="w-6 h-6 text-orange-500" />
                                    <span>Contato de Emergência</span>
                                </h3>
                                <div className="space-y-2">
                                    <p className="text-gray-700">
                                        <strong>Nome:</strong> {data.emergencyContact}
                                    </p>
                                    {data.emergencyPhone && (
                                        <button
                                            onClick={() => handleContact(data.emergencyPhone)}
                                            className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 font-bold"
                                        >
                                            <Phone className="w-5 h-5" />
                                            <span>{data.emergencyPhone}</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Reward */}
                        {data.rewardOffered && data.rewardAmount && (
                            <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-green-900 mb-2 flex items-center space-x-2">
                                    <DollarSign className="w-6 h-6 text-green-600" />
                                    <span>Recompensa Oferecida!</span>
                                </h3>
                                <p className="text-2xl font-bold text-green-700">
                                    {data.rewardAmount}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Contact Button */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => handleContact(data.ownerPhone)}
                        className="inline-flex items-center space-x-3 px-10 py-5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-bold text-xl hover:shadow-2xl transition-all hover:scale-105"
                    >
                        <Phone className="w-7 h-7" />
                        <span>Ligar para o Dono Agora</span>
                    </button>
                    <p className="text-gray-600 mt-4 text-sm">
                        Obrigado por ajudar a reunir {pet.name} com sua família!
                    </p>
                </div>

                {/* Footer */}
                <div className="mt-12 text-center text-gray-500 text-sm">
                    <p>Powered by <strong className="text-orange-500">PetTag</strong> - Sistema de identificação de pets</p>
                </div>
            </div>
        </div>
    );
}

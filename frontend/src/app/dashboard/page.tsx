'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { Dog, Plus, QrCode, LogOut, Edit, Trash2, AlertTriangle, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Pet {
    id: string;
    name: string;
    species: string;
    breed: string;
    photo: string;
    qrCode: {
        id: string;
        qrCodeId: string;
        isActive: boolean;
    } | null;
}

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState<{ 
        isOpen: boolean; 
        petId: string | null; 
        petName: string | null;
        petPhoto: string | null;
    }>({
        isOpen: false,
        petId: null,
        petName: null,
        petPhoto: null
    });
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchPets();
    }, []);

    const fetchPets = async () => {
        try {
            const response = await api.get('/pets');
            setPets(response.data);
        } catch (error) {
            console.error('Erro ao buscar pets:', error);
            toast.error('Erro ao carregar seus pets');
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePet = async (petId: string) => {
        setDeleting(true);
        try {
            await api.delete(`/pets/${petId}`);
            setPets(pets.filter(p => p.id !== petId));
            toast.success('Pet deletado com sucesso!');
            setDeleteModal({ isOpen: false, petId: null, petName: null, petPhoto: null });
        } catch (error) {
            toast.error('Erro ao deletar pet');
        } finally {
            setDeleting(false);
        }
    };

    const openDeleteModal = (petId: string, petName: string, petPhoto: string | null) => {
        setDeleteModal({ isOpen: true, petId, petName, petPhoto });
    };

    const closeDeleteModal = () => {
        if (!deleting) {
            setDeleteModal({ isOpen: false, petId: null, petName: null, petPhoto: null });
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-linear-to-br from-orange-50 via-pink-50 to-purple-50">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-2">
                            <Dog className="w-8 h-8 text-orange-500" />
                            <span className="text-2xl font-bold bg-linear-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                                PetTag
                            </span>
                        </Link>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">Olá, <strong>{user?.name}</strong>!</span>
                            <button
                                onClick={logout}
                                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-orange-500 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Sair</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="container mx-auto px-4 py-12">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                Meus Pets 🐾
                            </h1>
                            <p className="text-gray-600">
                                Gerencie os QR Codes dos seus pets
                            </p>
                        </div>
                        <Link
                            href="/pets/new"
                            className="flex items-center space-x-2 px-6 py-3 bg-linear-to-r from-orange-500 to-pink-500 text-white rounded-full font-bold hover:shadow-xl transition-all hover:scale-105"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Adicionar Pet</span>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500"></div>
                        </div>
                    ) : pets.length === 0 ? (
                        <div className="text-center py-20">
                            <Dog className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Nenhum pet cadastrado ainda
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Adicione seu primeiro pet para começar a protegê-lo!
                            </p>
                            <Link
                                href="/pets/new"
                                className="inline-flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-full font-bold hover:bg-orange-600 transition-all"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Adicionar Primeiro Pet</span>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pets.map((pet) => (
                                <div
                                    key={pet.id}
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1"
                                >
                                    <div className="h-48 bg-linear-to-br from-orange-100 to-pink-100 flex items-center justify-center overflow-hidden">
                                        {pet.photo ? (
                                            <img
                                                src={pet.photo}
                                                alt={pet.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    console.log('Erro ao carregar imagem:', pet.photo);
                                                    const imgElement = e.target as HTMLImageElement;
                                                    imgElement.style.display = 'none';
                                                    imgElement.parentElement!.innerHTML = '<div class="w-24 h-24"><svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-300"><circle cx="12" cy="8" r="3"/><path d="M12 14c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z"/></svg></div>';
                                                }}
                                            />
                                        ) : (
                                            <Dog className="w-24 h-24 text-orange-300" />
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                            {pet.name}
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            {pet.species} {pet.breed && `• ${pet.breed}`}
                                        </p>
                                        
                                        {pet.qrCode ? (
                                            <Link
                                                href={`/pets/${pet.id}/qrcode`}
                                                className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors mb-2"
                                            >
                                                <QrCode className="w-5 h-5" />
                                                <span>Ver QR Code</span>
                                            </Link>
                                        ) : (
                                            <Link
                                                href={`/pets/${pet.id}/qrcode/create`}
                                                className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors mb-2"
                                            >
                                                <Plus className="w-5 h-5" />
                                                <span>Criar QR Code</span>
                                            </Link>
                                        )}

                                        <div className="flex space-x-2">
                                            <Link
                                                href={`/pets/${pet.id}/edit`}
                                                className="flex items-center justify-center space-x-1 flex-1 px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:border-orange-500 hover:text-orange-500 transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                                <span>Editar</span>
                                            </Link>
                                            <button
                                                onClick={() => openDeleteModal(pet.id, pet.name, pet.photo)}
                                                className="flex items-center justify-center space-x-1 flex-1 px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:border-red-500 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                <span>Excluir</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>

                {/* Modal de Confirmação de Exclusão */}
                {deleteModal.isOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in">
                            {/* Header do Modal */}
                            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-white">Confirmar Exclusão</h3>
                                    <button
                                        onClick={closeDeleteModal}
                                        disabled={deleting}
                                        className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors disabled:opacity-50"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex items-center space-x-4">
                                    {deleteModal.petPhoto ? (
                                        <img
                                            src={deleteModal.petPhoto}
                                            alt={deleteModal.petName || 'Pet'}
                                            className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center border-4 border-white">
                                            <Dog className="w-8 h-8 text-white" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <p className="text-white text-lg font-semibold">{deleteModal.petName}</p>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <AlertTriangle className="w-4 h-4 text-white" />
                                            <p className="text-white text-sm opacity-90">Ação irreversível</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Conteúdo do Modal */}
                            <div className="p-6">
                                <p className="text-gray-700 text-base mb-2">
                                    Você tem certeza que deseja deletar este pet?
                                </p>
                                <p className="text-sm text-gray-500">
                                    Esta ação não pode ser desfeita. O pet, seu QR Code e todas as imagens associadas serão permanentemente removidos.
                                </p>
                            </div>

                            {/* Footer do Modal */}
                            <div className="bg-gray-50 px-6 py-4 flex space-x-3">
                                <button
                                    onClick={closeDeleteModal}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => deleteModal.petId && handleDeletePet(deleteModal.petId)}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                >
                                    {deleting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                            <span>Excluindo...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="w-5 h-5" />
                                            <span>Excluir Pet</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}

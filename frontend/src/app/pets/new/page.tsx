'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { Dog, ArrowLeft, Camera, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewPetPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [formData, setFormData] = useState({
        name: '',
        species: 'Cachorro',
        breed: '',
        color: '',
        age: '',
        weight: '',
        photo: '',
        medicalInfo: '',
        observations: ''
    });

    const handleInputChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Criar preview local
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        const formDataUpload = new FormData();
        formDataUpload.append('photo', file);

        setUploading(true);
        try {
            const response = await api.post('/upload/pet', formDataUpload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData({ ...formData, photo: response.data.url });
            toast.success('Foto enviada!');
        } catch (error) {
            toast.error('Erro ao enviar foto');
            setImagePreview(''); // Limpar preview em caso de erro
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/pets', formData);
            toast.success('Pet cadastrado com sucesso! 🐾');
            router.push('/dashboard');
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Erro ao cadastrar pet');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-linear-to-br from-orange-50 via-pink-50 to-purple-50 py-12 px-4">
                <div className="max-w-2xl mx-auto">
                    <Link href="/dashboard" className="inline-flex items-center text-gray-600 hover:text-orange-500 mb-6">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Voltar para Dashboard
                    </Link>

                    <div className="bg-white rounded-3xl shadow-2xl p-8">
                        <div className="text-center mb-8">
                            <Dog className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Adicionar Novo Pet</h1>
                            <p className="text-gray-600">Preencha as informações do seu amiguinho</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Photo Upload */}
                            <div className="text-center">
                                <label className="cursor-pointer inline-block">
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                    <div className="w-32 h-32 mx-auto bg-linear-to-br from-orange-100 to-pink-100 rounded-full flex items-center justify-center hover:shadow-lg transition-all overflow-hidden">
                                        {imagePreview || formData.photo ? (
                                            <img 
                                                src={imagePreview || formData.photo} 
                                                alt="Pet" 
                                                className="w-full h-full object-cover" 
                                            />
                                        ) : uploading ? (
                                            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                                        ) : (
                                            <Camera className="w-12 h-12 text-orange-500" />
                                        )}
                                    </div>
                                    <p className="mt-2 text-sm text-gray-600">Clique para adicionar foto</p>
                                </label>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-gray-900 placeholder:text-gray-400" placeholder="Rex" required />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Espécie *</label>
                                    <select name="species" value={formData.species} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-gray-900 placeholder:text-gray-400">
                                        <option value="Cachorro">Cachorro</option>
                                        <option value="Gato">Gato</option>
                                        <option value="Outro">Outro</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Raça</label>
                                    <input type="text" name="breed" value={formData.breed} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-gray-900 placeholder:text-gray-400" placeholder="Vira-lata" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Cor</label>
                                    <input type="text" name="color" value={formData.color} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-gray-900 placeholder:text-gray-400" placeholder="Marrom" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Idade</label>
                                    <input type="text" name="age" value={formData.age} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-gray-900 placeholder:text-gray-400" placeholder="3 anos" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Peso</label>
                                    <input type="text" name="weight" value={formData.weight} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-gray-900 placeholder:text-gray-400" placeholder="15kg" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Informações Médicas</label>
                                <textarea name="medicalInfo" value={formData.medicalInfo} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-gray-900 placeholder:text-gray-400" rows={3} placeholder="Alergias, medicamentos, etc..."></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                                <textarea name="observations" value={formData.observations} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-gray-900 placeholder:text-gray-400" rows={3} placeholder="Comportamento, características especiais..."></textarea>
                            </div>

                            <button type="submit" disabled={loading} className="w-full bg-linear-to-r from-orange-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 flex items-center justify-center space-x-2">
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Cadastrando...</span>
                                    </>
                                ) : (
                                    <span>Cadastrar Pet</span>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

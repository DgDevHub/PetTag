'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { Dog, ArrowLeft, Camera, Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EditPetPage() {
    const router = useRouter();
    const params = useParams();
    const petId = params.id as string;
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [imageKey, setImageKey] = useState(Date.now()); // Para forçar reload da imagem
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

    useEffect(() => {
        fetchPet();
    }, [petId]);

    const fetchPet = async () => {
        try {
            const response = await api.get(`/pets/${petId}`);
            const pet = response.data;
            
            
            setFormData({
                name: pet.name || '',
                species: pet.species || 'Cachorro',
                breed: pet.breed || '',
                color: pet.color || '',
                age: pet.age || '',
                weight: pet.weight || '',
                photo: pet.photo || '',
                medicalInfo: pet.medicalInfo || '',
                observations: pet.observations || ''
            });
            
            // Define a foto como preview inicial
            if (pet.photo) {
                setImagePreview(pet.photo);
            }
        } catch (error: any) {
            console.error('Erro ao buscar pet:', error);
            toast.error('Pet não encontrado');
            router.push('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Criar preview local imediatamente
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
            setImageKey(Date.now()); // Força reload
        };
        reader.readAsDataURL(file);

        const formDataUpload = new FormData();
        formDataUpload.append('photo', file);
        
        // Guarda a foto antiga antes de fazer upload
        const oldPhoto = formData.photo;

        setUploading(true);
        try {
            // 1. Faz upload da nova foto
            const response = await api.post('/upload/pet', formDataUpload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            const newPhotoUrl = response.data.url;
            
            // 2. Atualiza o pet com a nova foto (isso vai deletar a antiga automaticamente)
            await api.put(`/pets/${petId}`, {
                ...formData,
                photo: newPhotoUrl
            });
            
            // 3. Atualiza o estado local
            setFormData({ ...formData, photo: newPhotoUrl });
            setImagePreview(newPhotoUrl);
            setImageKey(Date.now());
            
            toast.success('Foto atualizada com sucesso!');
            
        } catch (error) {
            console.error('Erro ao atualizar foto:', error);
            toast.error('Erro ao atualizar foto');
            // Volta para a foto antiga em caso de erro
            setImagePreview(oldPhoto || '');
            setFormData({ ...formData, photo: oldPhoto });
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            await api.put(`/pets/${petId}`, formData);
            toast.success('Pet atualizado com sucesso! 🐾');
            router.push('/dashboard');
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Erro ao atualizar pet');
        } finally {
            setSaving(false);
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
            <div className="min-h-screen bg-linear-to-br from-orange-50 via-pink-50 to-purple-50 py-12 px-4">
                <div className="max-w-2xl mx-auto">
                    <Link href="/dashboard" className="inline-flex items-center text-gray-600 hover:text-orange-500 mb-6">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Voltar para Dashboard
                    </Link>

                    <div className="bg-white rounded-3xl shadow-2xl p-8">
                        <div className="text-center mb-8">
                            <Dog className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar Pet</h1>
                            <p className="text-gray-600">Atualize as informações do seu amiguinho</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Photo Upload */}
                            <div className="text-center">
                                <label className="cursor-pointer inline-block">
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                    <div className="w-32 h-32 mx-auto bg-linear-to-br from-orange-100 to-pink-100 rounded-full flex items-center justify-center hover:shadow-lg transition-all overflow-hidden">
                                        {imagePreview || formData.photo ? (
                                            <img 
                                                key={imageKey}
                                                src={`${imagePreview || formData.photo}?t=${imageKey}`}
                                                alt="Pet" 
                                                className="w-full h-full object-cover" 
                                            />
                                        ) : uploading ? (
                                            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                                        ) : (
                                            <Camera className="w-12 h-12 text-orange-500" />
                                        )}
                                    </div>
                                    <p className="mt-2 text-sm text-gray-600">Clique para alterar foto</p>
                                </label>
                            </div>

                            {/* Name & Species */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-gray-900 transition-colors placeholder:text-gray-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Espécie *</label>
                                    <select
                                        name="species"
                                        value={formData.species}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-gray-900 transition-colors placeholder:text-gray-400"
                                    >
                                        <option value="Cachorro">Cachorro</option>
                                        <option value="Gato">Gato</option>
                                        <option value="Outro">Outro</option>
                                    </select>
                                </div>
                            </div>

                            {/* Breed & Color */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Raça</label>
                                    <input
                                        type="text"
                                        name="breed"
                                        value={formData.breed}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-gray-900 transition-colors placeholder:text-gray-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Cor</label>
                                    <input
                                        type="text"
                                        name="color"
                                        value={formData.color}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-gray-900 transition-colors placeholder:text-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Age & Weight */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Idade (anos)</label>
                                    <input
                                        type="text"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleInputChange}
                                        placeholder="Ex: 3 anos"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-gray-900 transition-colors placeholder:text-gray-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Peso (kg)</label>
                                    <input
                                        type="text"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleInputChange}
                                        placeholder="Ex: 15kg"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-gray-900 transition-colors placeholder:text-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Medical Info */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Informações Médicas</label>
                                <textarea
                                    name="medicalInfo"
                                    value={formData.medicalInfo}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-gray-900 transition-colors resize-none placeholder:text-gray-400"
                                    placeholder="Alergias, medicamentos, etc."
                                />
                            </div>

                            {/* Observations */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                                <textarea
                                    name="observations"
                                    value={formData.observations}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-gray-900 transition-colors resize-none placeholder:text-gray-400"
                                    placeholder="Comportamento, características especiais, etc."
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full flex items-center justify-center space-x-2 bg-linear-to-r from-orange-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        <span>Salvando...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-6 h-6" />
                                        <span>Salvar Alterações</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

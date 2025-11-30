'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { Dog, ArrowLeft, Save, Eye, Palette, Type, Image as ImageIcon, Layout } from 'lucide-react';
import toast from 'react-hot-toast';

interface QRCode {
    id: string;
    qrCodeId: string;
    backgroundColor: string;
    foregroundColor: string;
    textTop: string | null;
    textBottom: string | null;
    textTopColor: string;
    textBottomColor: string;
    textTopSize: number;
    textBottomSize: number;
    qrSize: number;
    borderRadius: number;
    padding: number;
    customBackground: string | null;
    pet: {
        id: string;
        name: string;
        photo: string;
    };
}

export default function EditQRCode() {
    const params = useParams();
    const router = useRouter();
    const petId = params.id as string;

    const [qrCode, setQRCode] = useState<QRCode | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingBg, setUploadingBg] = useState(false);
    const [activeTab, setActiveTab] = useState<'colors' | 'text' | 'layout' | 'background'>('colors');
    const [previewBackgroundFile, setPreviewBackgroundFile] = useState<File | null>(null);
    const [previewBackgroundDataUrl, setPreviewBackgroundDataUrl] = useState<string>('');

    const [formData, setFormData] = useState({
        backgroundColor: '#FFFFFF',
        foregroundColor: '#000000',
        backgroundOpacity: 1,
        textTop: '',
        textBottom: '',
        textTopColor: '#000000',
        textBottomColor: '#000000',
        textTopSize: 24,
        textBottomSize: 20,
        qrSize: 512,
        borderRadius: 0,
        padding: 20,
        customBackground: ''
    });

    useEffect(() => {
        fetchQRCode();
    }, [petId]);

    const fetchQRCode = async () => {
        try {
            const response = await api.get(`/pets/${petId}/qrcode`);
            const data = response.data;
            setQRCode(data);
            setFormData({
                backgroundColor: data.backgroundColor || '#FFFFFF',
                foregroundColor: data.foregroundColor || '#000000',
                backgroundOpacity: data.backgroundOpacity ?? 1,
                textTop: data.textTop || '',
                textBottom: data.textBottom || '',
                textTopColor: data.textTopColor || '#000000',
                textBottomColor: data.textBottomColor || '#000000',
                textTopSize: data.textTopSize || 24,
                textBottomSize: data.textBottomSize || 20,
                qrSize: data.qrSize || 512,
                borderRadius: data.borderRadius || 0,
                padding: data.padding || 20,
                customBackground: data.customBackground || ''
            });
        } catch (error: any) {
            console.error('Erro ao buscar QR Code:', error);
            toast.error('Erro ao carregar QR Code');
            router.push('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!qrCode) return;

        setSaving(true);
        try {
            let finalFormData = { ...formData };

            // Se existe um arquivo pendente de upload, envia para o Cloudinary primeiro
            if (previewBackgroundFile) {
                setUploadingBg(true);
                try {
                    const uploadFormData = new FormData();
                    uploadFormData.append('background', previewBackgroundFile);

                    const response = await api.post('/upload/qrcode', uploadFormData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });

                    finalFormData.customBackground = response.data.url;
                    toast.success('Background enviado para o Cloudinary!');
                } catch (uploadError) {
                    console.error('Erro ao fazer upload:', uploadError);
                    toast.error('Erro ao enviar background');
                    setSaving(false);
                    setUploadingBg(false);
                    return;
                } finally {
                    setUploadingBg(false);
                }
            }

            // Salva o QR Code com a URL final do Cloudinary (ou URL normal se colada)
            await api.put(`/qrcode/${qrCode.id}`, finalFormData);
            toast.success('QR Code atualizado com sucesso!');
            
            // Limpa estados temporários
            setPreviewBackgroundFile(null);
            setPreviewBackgroundDataUrl('');
            
            router.push(`/pets/${petId}/qrcode`);
        } catch (error) {
            console.error('Erro ao salvar:', error);
            toast.error('Erro ao atualizar QR Code');
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleBackgroundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Valida tipo de arquivo
        if (!file.type.startsWith('image/')) {
            toast.error('Por favor, selecione uma imagem válida');
            return;
        }

        // Valida tamanho (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('A imagem deve ter no máximo 5MB');
            return;
        }

        // Cria data URL para preview (não envia para Cloudinary ainda)
        const reader = new FileReader();
        reader.onloadend = () => {
            const dataUrl = reader.result as string;
            setPreviewBackgroundDataUrl(dataUrl);
            setPreviewBackgroundFile(file);
            handleInputChange('customBackground', dataUrl); // Usa data URL temporariamente
            toast.success('Imagem carregada! Clique em "Salvar" para aplicar.');
        };
        reader.readAsDataURL(file);
    };

    // Função para converter hex + opacity em rgba
    const hexToRgba = (hex: string, opacity: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };

    // Função para gerar URL do preview com todos os parâmetros
    const getPreviewUrl = () => {
        if (!qrCode) return '';
        
        const params = new URLSearchParams({
            bg: formData.backgroundColor.replace('#', ''),
            fg: formData.foregroundColor.replace('#', ''),
            opacity: formData.backgroundOpacity.toString(),
            qrSize: formData.qrSize.toString(),
            padding: formData.padding.toString(),
            borderRadius: formData.borderRadius.toString(),
        });

        if (formData.textTop) {
            params.append('textTop', formData.textTop);
            params.append('textTopColor', formData.textTopColor.replace('#', ''));
            params.append('textTopSize', formData.textTopSize.toString());
        }

        if (formData.textBottom) {
            params.append('textBottom', formData.textBottom);
            params.append('textBottomColor', formData.textBottomColor.replace('#', ''));
            params.append('textBottomSize', formData.textBottomSize.toString());
        }

        // Para customBackground:
        // - Não envia data URLs (são temporárias, só para preview local)
        // - Mas se for Data URL, envia um marcador para forçar transparência no QR Code
        // - Só envia URLs do Cloudinary ou externas se diferentes do banco
        const isDataUrl = formData.customBackground?.startsWith('data:');
        
        if (isDataUrl) {
            // Força o backend a gerar QR Code com fundo transparente
            params.append('customBackground', 'preview');
        } else if (formData.customBackground && formData.customBackground !== qrCode.customBackground) {
            params.append('customBackground', formData.customBackground);
        } else if (formData.customBackground === '' && qrCode.customBackground) {
            // Se removeu o background, envia vazio
            params.append('customBackground', '');
        }

        const url = `/api/qrcode/view/${qrCode.qrCodeId}?${params.toString()}`;
        return url;
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-linear-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500 mb-4"></div>
                        <p className="text-gray-600">Carregando editor...</p>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    if (!qrCode) return null;

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 py-6 md:py-12 px-4">
                <div className="container mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-6 md:mb-8">
                        <Link
                            href={`/pets/${petId}/qrcode`}
                            className="inline-flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors mb-4"
                        >
                            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                            <span className="text-sm md:text-base">Voltar</span>
                        </Link>
                        <div className="flex items-center space-x-3 md:space-x-4">
                            {qrCode.pet.photo ? (
                                <img
                                    src={qrCode.pet.photo}
                                    alt={qrCode.pet.name}
                                    className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-4 border-white shadow-lg"
                                />
                            ) : (
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-orange-100 flex items-center justify-center">
                                    <Dog className="w-6 h-6 md:w-8 md:h-8 text-orange-500" />
                                </div>
                            )}
                            <div>
                                <h1 className="text-xl md:text-3xl font-bold text-gray-900">
                                    Editor Avançado de QR Code
                                </h1>
                                <p className="text-sm md:text-base text-gray-600">
                                    Personalize completamente o QR Code de {qrCode.pet.name}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
                        {/* Editor Panel */}
                        <div className="space-y-4 md:space-y-6">
                            {/* Tabs */}
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                                <div className="grid grid-cols-2 md:flex border-b">
                                    <button
                                        onClick={() => setActiveTab('colors')}
                                        className={`flex items-center justify-center space-x-1 md:space-x-2 px-3 md:px-6 py-3 md:py-4 font-bold text-xs md:text-base transition-colors ${
                                            activeTab === 'colors'
                                                ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        <Palette className="w-4 h-4 md:w-5 md:h-5" />
                                        <span className="hidden sm:inline">Cores</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('text')}
                                        className={`flex items-center justify-center space-x-1 md:space-x-2 px-3 md:px-6 py-3 md:py-4 font-bold text-xs md:text-base transition-colors ${
                                            activeTab === 'text'
                                                ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        <Type className="w-4 h-4 md:w-5 md:h-5" />
                                        <span className="hidden sm:inline">Textos</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('layout')}
                                        className={`flex items-center justify-center space-x-1 md:space-x-2 px-3 md:px-6 py-3 md:py-4 font-bold text-xs md:text-base transition-colors ${
                                            activeTab === 'layout'
                                                ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        <Layout className="w-4 h-4 md:w-5 md:h-5" />
                                        <span className="hidden sm:inline">Layout</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('background')}
                                        className={`flex items-center justify-center space-x-1 md:space-x-2 px-3 md:px-6 py-3 md:py-4 font-bold text-xs md:text-base transition-colors ${
                                            activeTab === 'background'
                                                ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        <ImageIcon className="w-4 h-4 md:w-5 md:h-5" />
                                        <span className="hidden sm:inline">Fundo</span>
                                    </button>
                                </div>

                                {/* Tab Content */}
                                <div className="p-4 md:p-6">
                                    {/* Colors Tab */}
                                    {activeTab === 'colors' && (
                                        <div className="space-y-4 md:space-y-6">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-3">
                                                    Cor de Fundo do QR Code
                                                </label>
                                                <div className="flex items-center space-x-2 md:space-x-3">
                                                    <input
                                                        type="color"
                                                        value={formData.backgroundColor}
                                                        onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                                                        className="w-16 h-12 md:w-20 md:h-16 rounded-xl cursor-pointer border-2 border-gray-300 hover:border-orange-400 transition-colors"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={formData.backgroundColor}
                                                        onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                                                        className="flex-1 px-3 md:px-4 py-2 md:py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none text-gray-900 text-sm md:text-base"
                                                        placeholder="#FFFFFF"
                                                    />
                                                </div>
                                                
                                                {/* Controle de Opacidade */}
                                                <div className="mt-4">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Opacidade do Fundo: {Math.round(formData.backgroundOpacity * 100)}%
                                                    </label>
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="1"
                                                        step="0.01"
                                                        value={formData.backgroundOpacity}
                                                        onChange={(e) => handleInputChange('backgroundOpacity', parseFloat(e.target.value))}
                                                        className="w-full h-2 md:h-3"
                                                    />
                                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                        <span>Transparente</span>
                                                        <span>Opaco</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-3">
                                                    Cor dos Pontos do QR Code
                                                </label>
                                                <div className="flex items-center space-x-2 md:space-x-3">
                                                    <input
                                                        type="color"
                                                        value={formData.foregroundColor}
                                                        onChange={(e) => handleInputChange('foregroundColor', e.target.value)}
                                                        className="w-16 h-12 md:w-20 md:h-16 rounded-xl cursor-pointer border-2 border-gray-300 hover:border-orange-400 transition-colors"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={formData.foregroundColor}
                                                        onChange={(e) => handleInputChange('foregroundColor', e.target.value)}
                                                        className="flex-1 px-3 md:px-4 py-2 md:py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none text-gray-900 text-sm md:text-base"
                                                        placeholder="#000000"
                                                    />
                                                </div>
                                            </div>

                                            {/* Preset Colors */}
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-3">
                                                    Combinações Prontas
                                                </label>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                                                    {[
                                                        { bg: '#FFFFFF', fg: '#000000', name: 'Clássico' },
                                                        { bg: '#000000', fg: '#FFFFFF', name: 'Invertido' },
                                                        { bg: '#FFF7ED', fg: '#EA580C', name: 'Laranja' },
                                                        { bg: '#FCE7F3', fg: '#DB2777', name: 'Rosa' },
                                                        { bg: '#EDE9FE', fg: '#7C3AED', name: 'Roxo' },
                                                        { bg: '#DBEAFE', fg: '#2563EB', name: 'Azul' }
                                                    ].map((preset) => (
                                                        <button
                                                            key={preset.name}
                                                            onClick={() => {
                                                                handleInputChange('backgroundColor', preset.bg);
                                                                handleInputChange('foregroundColor', preset.fg);
                                                            }}
                                                            className="flex flex-col items-center space-y-2 p-3 rounded-xl border-2 border-gray-200 hover:border-orange-400 hover:shadow-lg transition-all"
                                                        >
                                                            <div className="flex space-x-1">
                                                                <div
                                                                    className="w-8 h-8 rounded-lg border border-gray-300"
                                                                    style={{ backgroundColor: preset.bg }}
                                                                />
                                                                <div
                                                                    className="w-8 h-8 rounded-lg border border-gray-300"
                                                                    style={{ backgroundColor: preset.fg }}
                                                                />
                                                            </div>
                                                            <span className="text-xs font-medium text-gray-700">{preset.name}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Text Tab */}
                                    {activeTab === 'text' && (
                                        <div className="space-y-6">
                                            {/* Text Top */}
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-3">
                                                    ⬆️ Texto Superior
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.textTop}
                                                    onChange={(e) => handleInputChange('textTop', e.target.value)}
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none text-gray-900 placeholder:text-gray-400"
                                                    placeholder="Ex: SE ME ENCONTROU, ME AJUDE!"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Cor do Texto
                                                    </label>
                                                    <div className="flex items-center space-x-2">
                                                        <input
                                                            type="color"
                                                            value={formData.textTopColor}
                                                            onChange={(e) => handleInputChange('textTopColor', e.target.value)}
                                                            className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-300"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={formData.textTopColor}
                                                            onChange={(e) => handleInputChange('textTopColor', e.target.value)}
                                                            className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-gray-900 text-sm"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Tamanho: {formData.textTopSize}px
                                                    </label>
                                                    <input
                                                        type="range"
                                                        min="12"
                                                        max="48"
                                                        value={formData.textTopSize}
                                                        onChange={(e) => handleInputChange('textTopSize', parseInt(e.target.value))}
                                                        className="w-full h-2 md:h-3"
                                                    />
                                                </div>
                                            </div>

                                            <div className="border-t pt-4 md:pt-6">
                                                <label className="block text-sm font-bold text-gray-700 mb-3">
                                                    ⬇️ Texto Inferior
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.textBottom}
                                                    onChange={(e) => handleInputChange('textBottom', e.target.value)}
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none text-gray-900 placeholder:text-gray-400"
                                                    placeholder="Ex: LIGUE PARA O DONO"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Cor do Texto
                                                    </label>
                                                    <div className="flex items-center space-x-2">
                                                        <input
                                                            type="color"
                                                            value={formData.textBottomColor}
                                                            onChange={(e) => handleInputChange('textBottomColor', e.target.value)}
                                                            className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-300"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={formData.textBottomColor}
                                                            onChange={(e) => handleInputChange('textBottomColor', e.target.value)}
                                                            className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-gray-900 text-sm"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Tamanho: {formData.textBottomSize}px
                                                    </label>
                                                    <input
                                                        type="range"
                                                        min="12"
                                                        max="48"
                                                        value={formData.textBottomSize}
                                                        onChange={(e) => handleInputChange('textBottomSize', parseInt(e.target.value))}
                                                        className="w-full h-2 md:h-3"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Layout Tab */}
                                    {activeTab === 'layout' && (
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-3">
                                                    📏 Tamanho do QR Code: {formData.qrSize}px
                                                </label>
                                                <input
                                                    type="range"
                                                    min="256"
                                                    max="1024"
                                                    step="32"
                                                    value={formData.qrSize}
                                                    onChange={(e) => handleInputChange('qrSize', parseInt(e.target.value))}
                                                    className="w-full h-12"
                                                />
                                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                                    <span>256px (Pequeno)</span>
                                                    <span>1024px (Grande)</span>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-3">
                                                    🔲 Espaçamento Interno: {formData.padding}px
                                                </label>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={formData.padding}
                                                    onChange={(e) => handleInputChange('padding', parseInt(e.target.value))}
                                                    className="w-full h-12"
                                                />
                                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                                    <span>Nenhum</span>
                                                    <span>Muito</span>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-3">
                                                    ⭕ Arredondamento dos Cantos: {formData.borderRadius}px
                                                </label>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="50"
                                                    value={formData.borderRadius}
                                                    onChange={(e) => handleInputChange('borderRadius', parseInt(e.target.value))}
                                                    className="w-full h-12"
                                                />
                                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                                    <span>Quadrado</span>
                                                    <span>Arredondado</span>
                                                </div>
                                            </div>

                                            {/* Preset Layouts */}
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-3">
                                                    ✨ Layouts Prontos
                                                </label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {[
                                                        { size: 512, padding: 20, radius: 0, name: 'Padrão 📐', desc: 'Clássico e limpo' },
                                                        { size: 768, padding: 40, radius: 20, name: 'Grande 🔲', desc: 'Para impressão' },
                                                        { size: 384, padding: 10, radius: 0, name: 'Compacto 📦', desc: 'Espaço pequeno' },
                                                        { size: 512, padding: 50, radius: 30, name: 'Suave ☁️', desc: 'Moderno e amigável' },
                                                        { size: 600, padding: 30, radius: 15, name: 'Médio ⚖️', desc: 'Balanceado' },
                                                        { size: 640, padding: 60, radius: 40, name: 'Elegante 💎', desc: 'Premium e refinado' }
                                                    ].map((preset) => (
                                                        <button
                                                            key={preset.name}
                                                            onClick={() => {
                                                                handleInputChange('qrSize', preset.size);
                                                                handleInputChange('padding', preset.padding);
                                                                handleInputChange('borderRadius', preset.radius);
                                                            }}
                                                            className="p-4 rounded-xl border-2 border-gray-200 hover:border-orange-400 hover:shadow-lg transition-all text-left hover:bg-orange-50"
                                                        >
                                                            <div className="font-bold text-gray-900 mb-1">{preset.name}</div>
                                                            <div className="text-xs text-gray-500 mb-2">{preset.desc}</div>
                                                            <div className="text-xs text-gray-400">
                                                                {preset.size}px · Padding {preset.padding}px · Radius {preset.radius}px
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Background Tab */}
                                    {activeTab === 'background' && (
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-3">
                                                    📷 Upload de Imagem de Fundo
                                                </label>
                                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-400 transition-colors">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleBackgroundUpload}
                                                        className="hidden"
                                                        id="background-upload"
                                                        disabled={uploadingBg}
                                                    />
                                                    <label
                                                        htmlFor="background-upload"
                                                        className="cursor-pointer"
                                                    >
                                                        {uploadingBg ? (
                                                            <div className="flex flex-col items-center">
                                                                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500 mb-4"></div>
                                                                <p className="text-gray-600">Enviando imagem...</p>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-center">
                                                                <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                                                                <p className="text-gray-900 font-medium mb-1">
                                                                    Clique para selecionar uma imagem
                                                                </p>
                                                                <p className="text-sm text-gray-500">
                                                                    PNG, JPG ou JPEG até 5MB
                                                                </p>
                                                            </div>
                                                        )}
                                                    </label>
                                                </div>
                                            </div>

                                            {formData.customBackground && (
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-3">
                                                        🖼️ Preview do Background
                                                    </label>
                                                    <div className="relative">
                                                        <img
                                                            src={formData.customBackground}
                                                            alt="Background Preview"
                                                            className="w-full h-48 object-cover rounded-xl border-2 border-gray-300"
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                handleInputChange('customBackground', '');
                                                                setPreviewBackgroundFile(null);
                                                                setPreviewBackgroundDataUrl('');
                                                            }}
                                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="border-t pt-6">
                                                <label className="block text-sm font-bold text-gray-700 mb-3">
                                                    🔗 Ou Cole uma URL de Imagem
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.customBackground}
                                                    onChange={(e) => handleInputChange('customBackground', e.target.value)}
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none text-gray-900 placeholder:text-gray-400"
                                                    placeholder="https://exemplo.com/imagem.jpg"
                                                />
                                                <p className="text-xs text-gray-500 mt-2">
                                                    Cole a URL de uma imagem da internet
                                                </p>
                                            </div>

                                            <div className="bg-linear-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                                                <p className="text-sm text-gray-600">
                                                    💡 <strong>Dica:</strong> Use imagens com cores suaves para que o QR Code continue legível!
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Save Button */}
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full flex items-center justify-center space-x-2 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl font-bold text-base md:text-lg hover:shadow-2xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 md:h-6 md:w-6 border-t-2 border-b-2 border-white"></div>
                                        <span>Salvando...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5 md:w-6 md:h-6" />
                                        <span>Salvar Alterações</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Preview Panel */}
                        <div className="lg:sticky lg:top-8 h-fit">
                            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8">
                                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 text-center flex items-center justify-center space-x-2">
                                    <Eye className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
                                    <span>Preview em Tempo Real</span>
                                </h2>
                                
                                <div 
                                    className="bg-gray-50 rounded-xl p-4 md:p-8 mb-4 md:mb-6 flex flex-col items-center justify-center min-h-[300px] md:min-h-[600px] relative overflow-hidden"
                                >
                                    {/* Preview com composição visual se tiver Data URL de background */}
                                    {formData.customBackground?.startsWith('data:') ? (
                                        <div 
                                            className="relative inline-block"
                                            style={{
                                                borderRadius: `${formData.borderRadius}px`,
                                                overflow: 'hidden',
                                                backgroundImage: `url(${formData.customBackground})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center'
                                            }}
                                        >
                                            {/* QR Code sobre o background com opacidade aplicada */}
                                            <img
                                                src={getPreviewUrl()}
                                                alt="QR Code Preview"
                                                className="relative block"
                                                style={{
                                                    mixBlendMode: formData.backgroundOpacity < 1 ? 'normal' : 'normal'
                                                }}
                                                key={JSON.stringify({...formData, customBackground: ''})}
                                            />
                                        </div>
                                    ) : (
                                        /* Preview normal do backend (com URL ou sem background) */
                                        <img
                                            src={getPreviewUrl()}
                                            alt="QR Code Preview"
                                            className="block max-w-full h-auto"
                                            key={JSON.stringify(formData)}
                                        />
                                    )}
                                </div>

                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3 md:p-4">
                                    <p className="text-xs md:text-sm text-gray-600 text-center">
                                        <strong>Dica:</strong> As alterações aparecem automaticamente no preview. Clique em "Salvar" para aplicar.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

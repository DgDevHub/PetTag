'use client';

import Link from "next/link";
import { Dog, QrCode, Heart, Shield, Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Dog className="w-8 h-8 text-orange-500" />
            <span className="text-2xl font-bold bg-linear-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              PetTag
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <Link
                href="/dashboard"
                className="px-6 py-2 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition-all hover:scale-105 shadow-lg"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-6 py-2 text-gray-700 hover:text-orange-500 font-medium transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition-all hover:scale-105 shadow-lg"
                >
                  Começar Grátis
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-medium">
              🐾 Proteja seu melhor amigo
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Seu pet nunca mais
            <span className="bg-linear-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              {" "}se perderá
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Crie QR Codes personalizados para a coleira do seu pet. Se ele se perder, 
            quem encontrar poderá escanear e entrar em contato com você instantaneamente! 💕
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-4 bg-linear-to-r from-orange-500 to-pink-500 text-white rounded-full font-bold text-lg hover:shadow-2xl transition-all hover:scale-105 flex items-center space-x-2"
            >
              <span>Criar Meu QR Code Grátis</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#como-funciona"
              className="px-8 py-4 bg-white text-gray-700 rounded-full font-bold text-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Como Funciona
            </Link>
          </div>
        </div>

        {/* Hero Image/Animation */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-linear-to-r from-orange-200 to-pink-200 blur-3xl opacity-30 rounded-full"></div>
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="w-32 h-32 bg-linear-to-br from-orange-100 to-pink-100 rounded-3xl flex items-center justify-center mb-4 animate-bounce">
                  <Dog className="w-16 h-16 text-orange-500" />
                </div>
                <p className="text-sm font-medium text-gray-600">Seu Pet</p>
              </div>
              <div className="flex flex-col items-center">
                <ArrowRight className="w-8 h-8 text-gray-400 mb-2" />
                <QrCode className="w-12 h-12 text-orange-500" />
                <ArrowRight className="w-8 h-8 text-gray-400 mt-2" />
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-linear-to-br from-purple-100 to-blue-100 rounded-3xl flex items-center justify-center mb-4">
                  <Heart className="w-16 h-16 text-pink-500 animate-pulse" />
                </div>
                <p className="text-sm font-medium text-gray-600">De volta pra casa!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="como-funciona" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Como Funciona? É Simples! ✨
          </h2>
          <p className="text-xl text-gray-600">
            Em apenas 3 passos seu pet estará protegido
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
            <div className="w-16 h-16 bg-linear-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mb-6">
              <Dog className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              1. Cadastre seu Pet
            </h3>
            <p className="text-gray-600">
              Adicione as informações do seu pet: nome, foto, raça, e seus dados de contato
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
            <div className="w-16 h-16 bg-linear-to-br from-pink-100 to-pink-200 rounded-2xl flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-pink-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              2. Personalize o QR Code
            </h3>
            <p className="text-gray-600">
              Escolha cores, adicione uma frase especial e faça o QR Code com a cara do seu pet
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
            <div className="w-16 h-16 bg-linear-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              3. Imprima e Proteja
            </h3>
            <p className="text-gray-600">
              Baixe o QR Code, imprima em qualquer gráfica e coloque na coleira do seu pet
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-linear-to-r from-orange-500 to-pink-500 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Pronto para proteger seu pet? 🐾
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a milhares de tutores que já protegem seus pets com PetTag
          </p>
          <Link
            href="/register"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-orange-500 rounded-full font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
          >
            <span>Começar Agora Grátis</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Dog className="w-6 h-6 text-orange-500" />
          <span className="font-bold text-gray-900">PetTag</span>
        </div>
        <p className="text-sm">
          Feito com 💕 para proteger nossos melhores amigos
        </p>
      </footer>
    </div>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share, PlusSquare, MoreVertical, Home, Smartphone } from "lucide-react";
import Link from "next/link";

export default function ComoInstalarPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white safe-area-top safe-area-bottom">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 pt-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Como Instalar</h1>
        </div>

        <p className="text-slate-400 mb-6 text-center">
          Transforme o site em um app nativo no seu celular!
        </p>

        {/* iPhone */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-white flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🍎</span>
              </div>
              iPhone (Safari)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Step number={1} text="Abra o app no Safari" />
            <Step 
              number={2} 
              text={
                <span className="flex items-center gap-2 flex-wrap">
                  Toque no botão <Share className="w-5 h-5 text-blue-400" /> Compartilhar
                </span>
              } 
            />
            <Step 
              number={3} 
              text={
                <span className="flex items-center gap-2 flex-wrap">
                  Role e toque em <strong className="text-amber-400">"Adicionar à Tela de Início"</strong>
                </span>
              } 
            />
            <Step 
              number={4} 
              text={
                <span className="flex items-center gap-2 flex-wrap">
                  Toque em <strong className="text-green-400">"Adicionar"</strong>
                </span>
              } 
            />
            
            <div className="bg-slate-900/50 rounded-xl p-4 mt-4">
              <p className="text-sm text-slate-300">
                <Home className="w-4 h-4 inline mr-1" />
                O ícone aparecerá na sua tela inicial como um app normal!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Android */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-white flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              Android (Chrome)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Step number={1} text="Abra o app no Chrome" />
            <Step 
              number={2} 
              text={
                <span className="flex items-center gap-2 flex-wrap">
                  Toque nos <MoreVertical className="w-5 h-5 text-slate-400" /> 3 pontinhos
                </span>
              } 
            />
            <Step 
              number={3} 
              text={
                <span className="flex items-center gap-2 flex-wrap">
                  Selecione <strong className="text-amber-400">"Adicionar à tela inicial"</strong>
                </span>
              } 
            />
            <Step 
              number={4} 
              text={
                <span className="flex items-center gap-2 flex-wrap">
                  Toque em <strong className="text-green-400">"Instalar"</strong> ou <strong className="text-green-400">"Adicionar"</strong>
                </span>
              } 
            />

            <div className="bg-slate-900/50 rounded-xl p-4 mt-4">
              <p className="text-sm text-slate-300">
                <Smartphone className="w-4 h-4 inline mr-1" />
                Pronto! O app fica igual aos outros apps do seu celular!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Vantagens */}
        <Card className="bg-green-500/10 border-green-500/30">
          <CardHeader className="pb-4">
            <CardTitle className="text-green-400 text-lg">Por que instalar?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start gap-2">
                <PlusSquare className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Abre mais rápido (sem digitar endereço)</span>
              </li>
              <li className="flex items-start gap-2">
                <PlusSquare className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Fica na tela inicial com ícone bonito</span>
              </li>
              <li className="flex items-center gap-2">
                <PlusSquare className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>Sem barra de endereço do navegador</span>
              </li>
              <li className="flex items-start gap-2">
                <PlusSquare className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Funciona quase como app nativo!</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Link href="/" className="block mt-8">
          <Button variant="outline" className="w-full h-14 border-slate-600 text-white hover:bg-slate-700">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar para o Jogo
          </Button>
        </Link>
      </div>
    </main>
  );
}

function Step({ number, text }: { number: number; text: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 font-bold text-slate-900">
        {number}
      </div>
      <div className="text-slate-300 pt-1">{text}</div>
    </div>
  );
}

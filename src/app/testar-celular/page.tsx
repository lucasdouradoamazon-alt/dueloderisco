"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Wifi, Smartphone, Globe, CheckCircle, 
  Copy, AlertCircle, ChevronRight
} from "lucide-react";
import Link from "next/link";

export default function TestarCelularPage() {
  const [copied, setCopied] = useState(false);

  const copyIp = () => {
    navigator.clipboard.writeText("192.168.1.xxx");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white safe-area-top safe-area-bottom">
      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="flex items-center gap-3 mb-6 pt-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Testar no Celular</h1>
        </div>

        <p className="text-slate-400 text-center mb-6">
          3 formas de testar com amigos
        </p>

        {/* OPÇÃO 1: MESMA REDE WIFI */}
        <Card className="bg-blue-500/10 border-blue-500/30 mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-blue-400 flex items-center gap-3 text-lg">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Wifi className="w-5 h-5" />
              </div>
              Opção 1: Mesmo WiFi
              <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">Fácil</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="space-y-3 text-slate-300 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">1.</span>
                <span>Celular e PC no <strong>mesmo WiFi</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">2.</span>
                <span>No PC, abra o CMD e digite: <code className="bg-slate-700 px-2 py-0.5 rounded">ipconfig</code></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">3.</span>
                <span>Anote o <strong>Endereço IPv4</strong> (ex: 192.168.1.15)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">4.</span>
                <span>Rode: <code className="bg-slate-700 px-2 py-0.5 rounded">npm run dev:host</code></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">5.</span>
                <span>No celular, acesse o IP com :3000</span>
              </li>
            </ol>

            <div className="bg-slate-900/50 rounded-lg p-4 mt-4">
              <p className="text-sm text-slate-400 mb-2">Exemplo:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-slate-800 px-3 py-2 rounded text-green-400 text-sm">
                  http://192.168.1.15:3000
                </code>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={copyIp}
                  className={copied ? "text-green-400" : "text-slate-400"}
                >
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* OPÇÃO 2: HOTSPOT */}
        <Card className="bg-amber-500/10 border-amber-500/30 mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-amber-400 flex items-center gap-3 text-lg">
              <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              Opção 2: Hotspot do Celular
              <span className="text-xs bg-amber-500 text-white px-2 py-1 rounded-full">Alternativa</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 text-sm mb-4">
              Se o WiFi não funcionar, use a internet do celular:
            </p>
            <ol className="space-y-3 text-slate-300 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">1.</span>
                <span>Ative <strong>Roteador/ Hotspot</strong> no celular</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">2.</span>
                <span>Conecte o PC no WiFi do celular</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">3.</span>
                <span>No CMD do PC: <code className="bg-slate-700 px-2 py-0.5 rounded">ipconfig</code></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">4.</span>
                <span>Use o novo IP para acessar no celular</span>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* OPÇÃO 3: DEPLOY */}
        <Card className="bg-green-500/10 border-green-500/30 mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-green-400 flex items-center gap-3 text-lg">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              Opção 3: Colocar na Internet
              <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">Melhor!</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 text-sm mb-4">
              Assim qualquer pessoa acessa de qualquer lugar:
            </p>
            <ol className="space-y-3 text-slate-300 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-bold">1.</span>
                <span>Crie conta em <strong>vercel.com</strong> (grátis)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-bold">2.</span>
                <span>Compacte a pasta do projeto (sem node_modules)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-bold">3.</span>
                <span>Arraste o ZIP na Vercel</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-bold">4.</span>
                <span>Pronto! Link tipo: <code className="bg-slate-700 px-2 py-0.5 rounded">duelo.vercel.app</code></span>
              </li>
            </ol>

            <div className="bg-slate-900/50 rounded-lg p-4 mt-4">
              <p className="text-sm text-amber-400">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                Ideal para festas! Manda o link no WhatsApp.
              </p>
            </div>
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

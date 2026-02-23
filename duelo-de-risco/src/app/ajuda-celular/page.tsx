"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Wifi, AlertCircle, CheckCircle, 
  Copy, RefreshCw, Smartphone, Laptop 
} from "lucide-react";
import Link from "next/link";

export default function AjudaCelularPage() {
  const [ip, setIp] = useState<string>("localhost");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const host = window.location.hostname;
    setIp(host === "localhost" ? "SEU_IP_AQUI" : host);
  }, []);

  const copyIp = () => {
    navigator.clipboard.writeText(`http://${ip}:3000`);
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
          <h1 className="text-2xl font-bold">Abrir no Celular</h1>
        </div>

        {/* URL do servidor */}
        <Card className="bg-amber-500/10 border-amber-500/50 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-amber-400 flex items-center gap-2 text-lg">
              <Laptop className="w-5 h-5" />
              URL do Seu Servidor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-900 rounded-xl p-4 flex items-center justify-between">
              <code className="text-green-400 text-lg">http://{ip}:3000</code>
              <Button 
                onClick={copyIp} 
                variant="ghost" 
                size="sm"
                className={copied ? "text-green-400" : "text-slate-400"}
              >
                {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </Button>
            </div>
            <p className="text-sm text-slate-400 mt-3">
              Digite este endereço no navegador do celular
            </p>
          </CardContent>
        </Card>

        {/* Passo a passo */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-lg">Passo a Passo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Step 
              number={1} 
              title="Mesma Rede WiFi"
              description="Celular e computador devem estar no mesmo WiFi"
              icon={<Wifi className="w-5 h-5 text-blue-400" />}
            />
            <Step 
              number={2} 
              title="Servidor Rodando"
              description="npm run dev deve estar executando no PC"
              icon={<RefreshCw className="w-5 h-5 text-green-400" />}
            />
            <Step 
              number={3} 
              title="Abra no Celular"
              description="Digite o IP acima no Chrome/Safari do celular"
              icon={<Smartphone className="w-5 h-5 text-amber-400" />}
            />
          </CardContent>
        </Card>

        {/* Problemas comuns */}
        <Card className="bg-red-500/10 border-red-500/30 mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-red-400 flex items-center gap-2 text-lg">
              <AlertCircle className="w-5 h-5" />
              Problemas Comuns
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Problem 
              title="Não carrega / Erro de conexão"
              solutions={[
                "Verifique se celular e PC estão no MESMO WiFi",
                "Desative firewall temporariamente",
                "Tente desligar e ligar o roteador",
                "Use o hotspot do celular no PC"
              ]}
            />
            <Problem 
              title="Só funciona no PC (localhost)"
              solutions={[
                "Pare o servidor (Ctrl+C)",
                "Execute: npm run dev:host",
                "Ou crie arquivo next.config.ts com host: '0.0.0.0'"
              ]}
            />
            <Problem 
              title="Não sei o IP do PC"
              solutions={[
                "Windows: abra CMD e digite 'ipconfig'",
                "Procure por 'Endereço IPv4'",
                "Geralmente começa com 192.168.x.x"
              ]}
            />
          </CardContent>
        </Card>

        {/* Alternativa */}
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardHeader className="pb-4">
            <CardTitle className="text-blue-400 text-lg">Alternativa Fácil</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 mb-4">
              Se não conseguir, use o <strong>DevTools do Chrome</strong> no PC:
            </p>
            <ol className="space-y-2 text-slate-300 text-sm list-decimal list-inside">
              <li>Abra o app no PC (localhost:3000)</li>
              <li>Pressione <kbd className="bg-slate-700 px-2 py-1 rounded">F12</kbd></li>
              <li>Clique no ícone 📱 (Toggle Device Toolbar)</li>
              <li>Selecione um modelo de celular (iPhone/Android)</li>
              <li>Pronto! Simula a tela do celular!</li>
            </ol>
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

function Step({ number, title, description, icon }: { 
  number: number; 
  title: string; 
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 font-bold text-white">
        {number}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          {icon}
          <h3 className="font-bold text-white">{title}</h3>
        </div>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
    </div>
  );
}

function Problem({ title, solutions }: { title: string; solutions: string[] }) {
  return (
    <div className="bg-slate-900/50 rounded-xl p-4">
      <h3 className="font-bold text-white mb-3">{title}</h3>
      <ul className="space-y-2">
        {solutions.map((sol, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
            <span className="text-green-400 mt-1">✓</span>
            <span>{sol}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, ExternalLink, Copy, CheckCircle, 
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ConfigurarGooglePage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
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
          <h1 className="text-2xl font-bold">Google Login</h1>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
          <p className="text-blue-400 text-sm">
            <AlertCircle className="w-4 h-4 inline mr-1" />
            Opcional! O <strong>Modo Demo</strong> funciona sem login.
          </p>
        </div>

        {/* PASSO 1 */}
        <Card className="bg-slate-800/50 border-slate-700 mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-3 text-base">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">1</div>
              Acesse o Supabase
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-slate-300 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Vá em <a href="https://supabase.com/dashboard" target="_blank" rel="noopener" className="text-green-400 underline">supabase.com/dashboard</a></span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Entre no seu projeto</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Menu lateral: <strong>Authentication</strong></span>
              </li>
            </ol>

            <div className="bg-slate-900 rounded-lg p-3 mt-3">
              <p className="text-xs text-slate-500">Depois vá em:</p>
              <p className="text-sm text-amber-400 font-medium">Authentication → Providers</p>
            </div>
          </CardContent>
        </Card>

        {/* PASSO 2 */}
        <Card className="bg-slate-800/50 border-slate-700 mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-3 text-base">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">2</div>
              Ativar Google
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-slate-300 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Procure <strong>Google</strong> na lista</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Ative o toggle (cinza → verde)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Copie o <strong>Redirect URL</strong></span>
              </li>
            </ol>

            <div className="bg-slate-900 rounded-lg p-3 mt-3 flex items-center justify-between">
              <code className="text-xs text-green-400 truncate mr-2">
                https://xxx.supabase.co/auth/v1/callback
              </code>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => copy("https://seu-projeto.supabase.co/auth/v1/callback", "r")}
              >
                {copied === "r" ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* PASSO 3 */}
        <Card className="bg-slate-800/50 border-slate-700 mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-3 text-base">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">3</div>
              Google Cloud
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-slate-300 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span>Acesse <a href="https://console.cloud.google.com/" target="_blank" rel="noopener" className="text-blue-400 underline">console.cloud.google.com</a></span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span>Crie um projeto</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span>Vá em <strong>APIs & Services → Credentials</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span><strong>Create Credentials → OAuth client ID</strong></span>
              </li>
            </ol>

            <div className="bg-slate-900 rounded-lg p-3 mt-3">
              <p className="text-xs text-slate-500 mb-1">Preencha:</p>
              <ul className="text-xs text-slate-300 space-y-1">
                <li>• Application type: <strong>Web application</strong></li>
                <li>• Name: <strong>Duelo de Risco</strong></li>
                <li>• Authorized redirect URIs: <span className="text-amber-400">(cole o do Supabase)</span></li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* PASSO 4 */}
        <Card className="bg-slate-800/50 border-slate-700 mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-3 text-base">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">4</div>
              Copiar Chaves
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-slate-300 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Clique <strong>"Create"</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Copie: <strong>Client ID</strong> e <strong>Client Secret</strong></span>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* PASSO 5 */}
        <Card className="bg-green-500/10 border-green-500/30 mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-400 flex items-center gap-3 text-base">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">5</div>
              Colar no Supabase
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-slate-300 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Volte em Supabase → Providers → Google</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Cole <strong>Client ID</strong> e <strong>Client Secret</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Clique <strong>"Save"</strong></span>
              </li>
            </ol>
          </CardContent>
        </Card>

        <Link href="/" className="block mt-8">
          <Button variant="outline" className="w-full h-14 border-slate-600 text-white hover:bg-slate-700">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
        </Link>
      </div>
    </main>
  );
}

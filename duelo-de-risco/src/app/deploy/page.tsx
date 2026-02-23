"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Upload, CheckCircle, Globe, Package, 
  ChevronRight, ExternalLink, AlertCircle
} from "lucide-react";
import Link from "next/link";

export default function DeployPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white safe-area-top safe-area-bottom">
      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="flex items-center gap-3 mb-6 pt-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Colocar na Internet</h1>
        </div>

        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
          <p className="text-green-400 text-sm">
            <Globe className="w-4 h-4 inline mr-1" />
            <strong>Grátis e rápido!</strong> Seu jogo online em 5 minutos.
          </p>
        </div>

        {/* PASSO 1 */}
        <Card className="bg-slate-800/50 border-slate-700 mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                1
              </div>
              Criar Conta Vercel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-slate-300 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Acesse <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline inline-flex items-center">vercel.com <ExternalLink className="w-3 h-3 ml-1"/></a></span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Clique em <strong>"Sign Up"</strong> (Cadastrar)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Use sua conta do GitHub ou e-mail</span>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* PASSO 2 */}
        <Card className="bg-slate-800/50 border-slate-700 mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                2
              </div>
              Preparar Projeto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-slate-300 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Vá na pasta <code className="bg-slate-700 px-1.5 rounded">duelo-de-risco</code></span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Apague a pasta <code className="bg-slate-700 px-1.5 rounded">node_modules</code></span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Apague a pasta <code className="bg-slate-700 px-1.5 rounded">.next</code> (se existir)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Compacte tudo em um <strong>ZIP</strong></span>
              </li>
            </ol>

            <div className="bg-amber-500/10 rounded-lg p-3 mt-3">
              <p className="text-amber-400 text-xs">
                <AlertCircle className="w-3 h-3 inline mr-1" />
                Não inclua node_modules! Ocupa muito espaço.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* PASSO 3 */}
        <Card className="bg-slate-800/50 border-slate-700 mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                3
              </div>
              Fazer Deploy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-slate-300 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>No painel da Vercel, clique <strong>"Add New..."</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Escolha <strong>"Project"</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Na seção <strong>"Import Git Repository"</strong>, procure <strong>"Import Other"</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Arraste seu arquivo <strong>ZIP</strong></span>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* PASSO 4 */}
        <Card className="bg-slate-800/50 border-slate-700 mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                4
              </div>
              Configurar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-slate-300 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Framework: selecione <strong>Next.js</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Clique <strong>"Deploy"</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Aguarde 2-3 minutos...</span>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* PASSO 5 */}
        <Card className="bg-green-500/10 border-green-500/30 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-400 flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">
                5
              </div>
              Pronto!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 text-sm mb-3">
              Você receberá um link como:
            </p>
            <code className="block bg-slate-900 px-4 py-3 rounded-lg text-green-400 text-center">
              https://duelo-de-risco.vercel.app
            </code>
            <p className="text-slate-400 text-sm mt-3">
              Compartilhe com os amigos e jogue! 🎮
            </p>
          </CardContent>
        </Card>

        {/* DICAS */}
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-amber-400 text-base">Dicas Importantes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-slate-300 text-sm">
              • O link funciona 24h por dia, 7 dias por semana
            </p>
            <p className="text-slate-300 text-sm">
              • Grátis para uso pessoal (limite de tráfego generoso)
            </p>
            <p className="text-slate-300 text-sm">
              • Pode configurar domínio próprio depois
            </p>
            <p className="text-slate-300 text-sm">
              • Para atualizar: faça novo deploy com o mesmo ZIP
            </p>
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

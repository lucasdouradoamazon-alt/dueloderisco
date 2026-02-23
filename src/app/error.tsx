"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
      <Card className="max-w-md w-full bg-slate-800 border-slate-700">
        <CardContent className="pt-6 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Ops! Algo deu errado</h2>
          <p className="text-slate-400 mb-6">
            {error.message || "Ocorreu um erro inesperado."}
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={reset} variant="outline" className="border-slate-600">
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar novamente
            </Button>
            <Link href="/">
              <Button>
                <Home className="w-4 h-4 mr-2" />
                Início
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

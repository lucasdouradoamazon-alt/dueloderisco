"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sword, Users, Trophy, Shield, RefreshCw, XCircle,
  ArrowLeft, Play, Timer, Loader2, Crown, Skull,
} from "lucide-react";
import Link from "next/link";
import { drawCard } from "@/lib/utils/game";
import { CardType } from "@/types/game";

interface DemoPlayer {
  id: string;
  name: string;
  avatar: string;
}

interface DemoMatch {
  playerA: DemoPlayer;
  playerB: DemoPlayer;
  playerACard: CardType;
  playerAAction?: "keep" | "swap";
  playerBDecision?: "accept" | "reject";
  winner?: DemoPlayer;
  status: "waiting" | "player_a_turn" | "player_b_deciding" | "finished";
  deadline?: number;
}

const PLAYERS: DemoPlayer[] = [
  { id: "1", name: "Você", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=you" },
  { id: "2", name: "Carlos", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos" },
  { id: "3", name: "Ana", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ana" },
  { id: "4", name: "Maria", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria" },
];

function formatTimeRemaining(deadline: number): string {
  const remaining = deadline - Date.now();
  if (remaining <= 0) return "00:00";
  const seconds = Math.floor(remaining / 1000);
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export default function DemoPage() {
  const [view, setView] = useState<"lobby" | "game" | "deciding" | "result">("lobby");
  const [currentMatch, setCurrentMatch] = useState<DemoMatch | null>(null);
  const [round, setRound] = useState(1);
  const [history, setHistory] = useState<{ match: DemoMatch; round: number }[]>([]);
  const [timeLeft, setTimeLeft] = useState("60:00");
  const [progress, setProgress] = useState(100);

  const startMatch = () => {
    const opponents = PLAYERS.filter((p) => p.id !== "1");
    const opponent = opponents[Math.floor(Math.random() * opponents.length)];

    setCurrentMatch({
      playerA: PLAYERS[0],
      playerB: opponent,
      playerACard: drawCard(),
      status: "player_a_turn",
    });
    setView("game");
  };

  const processResult = useCallback((match: DemoMatch, action: "keep" | "swap", decision: "accept" | "reject") => {
    const finalCardA = decision === "accept"
      ? match.playerACard === "win" ? "lose" : "win"
      : match.playerACard;

    const winner = finalCardA === "win" ? match.playerA : match.playerB;

    const finishedMatch: DemoMatch = {
      ...match,
      playerAAction: action,
      playerBDecision: decision,
      winner,
      status: "finished",
    };

    setCurrentMatch(finishedMatch);
    setHistory((prev) => [...prev, { match: finishedMatch, round }]);
    setView("result");
  }, [round]);

  const makeAction = (action: "keep" | "swap") => {
    if (!currentMatch) return;
    const deadline = Date.now() + 60000;
    setCurrentMatch({
      ...currentMatch,
      playerAAction: action,
      status: "player_b_deciding",
      deadline,
    });
    setView("deciding");
  };

  useEffect(() => {
    if (view !== "deciding" || !currentMatch?.deadline) return;

    const interval = setInterval(() => {
      const remaining = currentMatch.deadline! - Date.now();
      const pct = Math.max(0, (remaining / 60000) * 100);
      
      setTimeLeft(formatTimeRemaining(currentMatch.deadline!));
      setProgress(pct);

      if (remaining <= 0) {
        clearInterval(interval);
        const randomDecision: "accept" | "reject" = Math.random() > 0.5 ? "accept" : "reject";
        processResult(currentMatch, currentMatch.playerAAction || "keep", randomDecision);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [view, currentMatch, processResult]);

  const nextRound = () => {
    if (currentMatch?.winner?.id === "1") {
      setRound(round + 1);
      startMatch();
    } else {
      setRound(1);
      setHistory([]);
      setView("lobby");
    }
  };

  const runningOut = progress < 16;

  // LOBBY
  if (view === "lobby") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white safe-area-top safe-area-bottom">
        <div className="container mx-auto px-4 py-6 max-w-md">
          <div className="text-center mb-8 pt-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mb-4 shadow-2xl">
              <Sword className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Modo Demo</h1>
            <p className="text-slate-400 text-sm">Teste com timer de 60s</p>
          </div>

          <Card className="bg-slate-800/50 border-slate-700 mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <Users className="w-5 h-5" /> Jogadores
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {PLAYERS.map((player, index) => (
                  <div key={player.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-700/50">
                    <span className="text-slate-500 w-6 text-sm">#{index + 1}</span>
                    <img src={player.avatar} alt={player.name} className="w-12 h-12 rounded-full bg-slate-600" />
                    <span className="font-medium">
                      {player.name}
                      {player.id === "1" && <Badge className="ml-2 bg-blue-500">Você</Badge>}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button onClick={startMatch} className="w-full h-16 text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 mb-4 shadow-lg shadow-green-500/20">
            <Play className="w-6 h-6 mr-2" />
            Iniciar Partida Demo
          </Button>

          <Link href="/" className="block">
            <Button variant="outline" className="w-full h-14 border-slate-600 text-white hover:bg-slate-700">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar para Início
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  // GAME
  if (view === "game" && currentMatch) {
    const isWin = currentMatch.playerACard === "win";
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white safe-area-top safe-area-bottom">
        <div className="container mx-auto px-4 py-6 max-w-md">
          <div className="text-center mb-6">
            <Badge className="bg-slate-700 text-slate-300 text-sm px-3 py-1">Rodada {round}</Badge>
          </div>

          {/* Card Display - Mobile optimized */}
          <div className="text-center mb-8">
            <p className="text-slate-400 mb-3 text-sm">Sua carta é:</p>
            <div className={`inline-flex flex-col items-center justify-center w-40 h-52 rounded-2xl border-4 ${
              isWin 
                ? "bg-gradient-to-br from-green-500/30 to-green-600/30 border-green-500 shadow-2xl shadow-green-500/30" 
                : "bg-gradient-to-br from-red-500/30 to-red-600/30 border-red-500 shadow-2xl shadow-red-500/30"
            }`}>
              {isWin ? (
                <Crown className="w-16 h-16 text-green-400 mb-3" />
              ) : (
                <Skull className="w-16 h-16 text-red-400 mb-3" />
              )}
              <span className={`text-2xl font-bold ${isWin ? "text-green-400" : "text-red-400"}`}>
                {isWin ? "VITÓRIA" : "DERROTA"}
              </span>
            </div>
          </div>

          {/* Opponent */}
          <div className="text-center mb-8">
            <p className="text-slate-400 mb-3 text-sm">Contra:</p>
            <div className="flex items-center justify-center gap-3 bg-slate-800/50 rounded-2xl p-4">
              <img src={currentMatch.playerB.avatar} alt={currentMatch.playerB.name} className="w-14 h-14 rounded-full bg-slate-600" />
              <span className="text-lg font-medium">{currentMatch.playerB.name}</span>
            </div>
          </div>

          {/* Actions - Big buttons for mobile */}
          <div className="space-y-4">
            <p className="text-center text-slate-300 mb-4 font-medium">O que você quer fazer?</p>

            <Button onClick={() => makeAction("keep")} className="w-full h-20 text-lg bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20">
              <Shield className="w-7 h-7 mr-3" />
              <div className="text-left">
                <div className="font-bold">MANTER</div>
                <div className="text-xs text-blue-200 font-normal">Ficar com minha carta</div>
              </div>
            </Button>

            <Button onClick={() => makeAction("swap")} variant="outline" className="w-full h-20 text-lg border-2 border-amber-500 text-amber-400 hover:bg-amber-500/10">
              <RefreshCw className="w-7 h-7 mr-3" />
              <div className="text-left">
                <div className="font-bold">TROCAR</div>
                <div className="text-xs text-amber-300 font-normal">Oferecer troca</div>
              </div>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // DECIDING (Timer)
  if (view === "deciding" && currentMatch) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white safe-area-top safe-area-bottom flex items-center">
        <div className="container mx-auto px-4 py-6 max-w-md text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-6 text-amber-400" />
          <h2 className="text-2xl font-bold mb-2">Aguardando...</h2>
          <p className="text-slate-400 mb-6">{currentMatch.playerB.name} está decidindo</p>

          <div className={`bg-slate-800 rounded-3xl p-8 border-2 ${runningOut ? "border-red-500 animate-pulse" : "border-amber-500/30"}`}>
            <Timer className={`w-10 h-10 mx-auto mb-4 ${runningOut ? "text-red-400" : "text-amber-400"}`} />
            <span className={`text-6xl font-mono font-bold ${runningOut ? "text-red-400" : "text-amber-400"}`}>
              {timeLeft}
            </span>
            
            <div className="w-full bg-slate-700 rounded-full h-4 mt-6 overflow-hidden">
              <div className={`h-full transition-all duration-100 ${runningOut ? "bg-red-500" : "bg-amber-400"}`} style={{ width: `${progress}%` }} />
            </div>

            {runningOut && (
              <p className="text-red-400 text-base mt-4 font-bold">⏰ Tempo acabando!</p>
            )}
          </div>

          <div className="mt-8 p-4 bg-slate-800/50 rounded-xl">
            <p className="text-slate-300 text-sm">Você escolheu: <span className="text-amber-400 font-bold">{currentMatch.playerAAction === "keep" ? "MANTER" : "TROCAR"}</span></p>
          </div>
        </div>
      </main>
    );
  }

  // RESULT
  if (view === "result" && currentMatch) {
    const iWon = currentMatch.winner?.id === "1";
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white safe-area-top safe-area-bottom">
        <div className="container mx-auto px-4 py-6 max-w-md">
          <div className="pt-8">
            <Card className={`text-center py-10 ${iWon ? "bg-green-500/20 border-green-500" : "bg-red-500/20 border-red-500"}`}>
              <CardContent className="px-6">
                {iWon ? (
                  <Trophy className="w-24 h-24 mx-auto text-green-400 mb-6" />
                ) : (
                  <XCircle className="w-24 h-24 mx-auto text-red-400 mb-6" />
                )}
                <h1 className="text-4xl font-bold mb-2">{iWon ? "Você Venceu!" : "Você Perdeu!"}</h1>
                <p className="text-slate-300 mb-6">{iWon ? "Parabéns!" : "Mais sorte na próxima!"}</p>

                <div className="my-6 space-y-3 text-left bg-slate-900/60 p-5 rounded-2xl">
                  <p className="text-slate-300">
                    Sua carta: <span className={currentMatch.playerACard === "win" ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
                      {currentMatch.playerACard === "win" ? "VITÓRIA" : "DERROTA"}
                    </span>
                  </p>
                  <p className="text-slate-300">
                    Você: <span className="text-amber-400 font-bold">{currentMatch.playerAAction === "keep" ? "MANTER" : "TROCAR"}</span>
                  </p>
                  <p className="text-slate-300">
                    {currentMatch.playerB?.name}: <span className="text-blue-400 font-bold">
                      {currentMatch.playerBDecision === "accept" ? "ACEITOU" : "RECUSOU"}
                    </span>
                  </p>
                </div>

                {iWon ? (
                  <Button onClick={nextRound} className="bg-green-600 hover:bg-green-700 h-14 text-lg px-8">
                    <Play className="w-5 h-5 mr-2" />
                    Próxima Rodada
                  </Button>
                ) : (
                  <Button onClick={nextRound} variant="outline" className="border-slate-600 h-14 text-lg px-8">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Jogar Novamente
                  </Button>
                )}
              </CardContent>
            </Card>

            {history.length > 1 && (
              <Card className="mt-6 bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">Histórico</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {history.map((h, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-xl">
                        <span className="text-sm text-slate-400">Rodada {h.round}</span>
                        <Badge className={h.match.winner?.id === "1" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                          {h.match.winner?.id === "1" ? "Vitória" : "Derrota"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    );
  }

  return null;
}

"use client";

import React, { useState, useEffect } from 'react';
import BottomNav from '@/components/layout/BottomNav';
import IntentionsWall from '@/components/couple/IntentionsWall';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, updateDoc, setDoc, getDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Share2, Users, LogOut, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

const Couple = () => {
  const [coupleId, setCoupleId] = useState<string | null>(null);
  const [partnerName, setPartnerName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const userId = "user_demo_456"; // Mock
  const userName = "Rodrigo"; // Mock

  useEffect(() => {
    const userRef = doc(db, 'users', userId);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCoupleId(data.coupleId || null);
        if (data.coupleId) {
          setupCoupleListener(data.coupleId);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const setupCoupleListener = (id: string) => {
    onSnapshot(doc(db, 'couples', id), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const partner = data.partner1 === userId ? data.partner2Name : data.partner1Name;
        setPartnerName(partner);
      }
    });
  };

  const generateInvite = async () => {
    const code = Math.random().toString(36).substr(2, 6).toUpperCase();
    try {
      await setDoc(doc(db, 'invites', code), {
        creatorId: userId,
        creatorName: userName,
        createdAt: serverTimestamp()
      });
      setInviteCode(code);
      toast.success("Código gerado!");
    } catch (error) {
      toast.error("Erro ao gerar código.");
    }
  };

  const joinCouple = async () => {
    if (!joinCode) return;
    try {
      const inviteRef = doc(db, 'invites', joinCode.toUpperCase());
      const inviteSnap = await getDoc(inviteRef);
      
      if (inviteSnap.exists()) {
        const inviteData = inviteSnap.data();
        const newCoupleId = `couple_${Math.random().toString(36).substr(2, 9)}`;
        
        await setDoc(doc(db, 'couples', newCoupleId), {
          partner1: inviteData.creatorId,
          partner1Name: inviteData.creatorName,
          partner2: userId,
          partner2Name: userName,
          createdAt: serverTimestamp()
        });
        
        await updateDoc(doc(db, 'users', userId), { coupleId: newCoupleId });
        await updateDoc(doc(db, 'users', inviteData.creatorId), { coupleId: newCoupleId });
        await deleteDoc(inviteRef);
        
        toast.success("Conectado com sucesso!");
      } else {
        toast.error("Código inválido.");
      }
    } catch (error) {
      toast.error("Erro ao conectar.");
    }
  };

  const disconnect = async () => {
    if (!coupleId || !confirm("Deseja realmente desconectar?")) return;
    try {
      // Em um app real, precisaríamos buscar o ID do parceiro primeiro
      await updateDoc(doc(db, 'users', userId), { coupleId: null });
      toast.info("Desconectado.");
    } catch (error) {
      toast.error("Erro ao desconectar.");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast.success("Código copiado!");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-24 p-6">
      <header className="mb-8 pt-4">
        <h1 className="text-2xl font-black text-[#2c3e6b] uppercase tracking-tight">
          Conexão de Casal
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Caminhando juntos para o céu</p>
      </header>

      {!coupleId ? (
        <div className="space-y-6">
          <Card className="p-8 rounded-[2.5rem] border-none shadow-sm text-center space-y-6">
            <div className="w-20 h-20 bg-[#e8f0f7] rounded-3xl flex items-center justify-center text-4xl mx-auto">
              💑
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-[#2c3e6b]">Conecte-se com seu cônjuge</h2>
              <p className="text-sm text-muted-foreground">
                Acompanhem as orações um do outro e compartilhem intenções diárias.
              </p>
            </div>

            {!inviteCode ? (
              <Button 
                onClick={generateInvite}
                className="w-full h-14 rounded-2xl bg-[#c9a84c] text-white font-bold text-lg"
              >
                Gerar Código de Convite
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-[#f5f5f5] rounded-2xl border-2 border-dashed border-[#c9a84c] flex items-center justify-between">
                  <span className="text-2xl font-black tracking-[0.3em] text-[#2c3e6b] ml-2">
                    {inviteCode}
                  </span>
                  <Button variant="ghost" size="icon" onClick={copyToClipboard} className="rounded-xl">
                    {isCopied ? <Check className="text-green-600" /> : <Copy size={20} />}
                  </Button>
                </div>
                <p className="text-[10px] font-bold uppercase text-[#c9a84c]">Envie este código para seu cônjuge</p>
              </div>
            )}
          </Card>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#f5f5f5] px-2 text-muted-foreground font-bold">Ou</span></div>
          </div>

          <Card className="p-6 rounded-[2rem] border-none shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#2c3e6b] text-center">Já tem um código?</h3>
            <div className="flex gap-2">
              <Input 
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Digite o código..."
                className="h-12 rounded-xl border-2 border-[#e8f0f7] text-center font-bold uppercase tracking-widest"
              />
              <Button onClick={joinCouple} className="h-12 rounded-xl bg-[#2c3e6b] px-6">
                Conectar
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <div className="space-y-8">
          <Card className="p-6 rounded-[2rem] border-none bg-[#2c3e6b] text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">
                ✨
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Conectado com</p>
                <h2 className="text-xl font-bold">{partnerName}</h2>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Users size={120} />
            </div>
          </Card>

          <IntentionsWall coupleId={coupleId} userName={userName} />

          <Button 
            variant="ghost" 
            onClick={disconnect}
            className="w-full text-muted-foreground hover:text-destructive flex gap-2"
          >
            <LogOut size={18} /> Desconectar Casal
          </Button>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Couple;
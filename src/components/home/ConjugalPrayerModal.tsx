"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, CheckCircle2, MessageSquare, ArrowLeft, Send, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import { doc, setDoc, collection, addDoc, getDocs, query, orderBy, limit, updateDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface ConjugalPrayerModalProps {
  onClose: () => void;
  coupleId: string;
  userId: string;
  onSuccess: () => void;
}

type View = 'initial' | 'reason' | 'success' | 'counseling' | 'advice' | 'feedback_reason';

const REASONS = [
  { id: 'tempo', label: 'Falta de tempo' },
  { id: 'cansaco', label: 'Cansaço' },
  { id: 'conflito', label: 'Conflito entre nós' },
  { id: 'distracoes', label: 'Distrações' },
  { id: 'conhecimento', label: 'Não sabemos como fazer' },
  { id: 'outro', label: 'Outro motivo' },
];

const FEEDBACK_REASONS = [
  { id: 'complexo', label: 'Muito complexo' },
  { id: 'generico', label: 'Muito genérico' },
  { id: 'impraticavel', label: 'Impraticável hoje' },
  { id: 'desconectado', label: 'Fora da minha realidade' },
];

const ConjugalPrayerModal = ({ onClose, coupleId, userId, onSuccess }: ConjugalPrayerModalProps) => {
  const [view, setView] = useState<View>('initial');
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduleTime, setScheduleTime] = useState("21:15");
  const [problemText, setProblemText] = useState("");
  const [advice, setAdvice] = useState("");
  const [currentAdviceId, setCurrentAdviceId] = useState("");

  const today = format(new Date(), 'yyyy-MM-dd');

  const handleMarkAsDone = async () => {
    setIsSubmitting(true);
    try {
      const prayerRef = doc(db, 'couples', coupleId, 'conjugalPrayer', 'dates');
      await setDoc(prayerRef, { [today]: true }, { merge: true });
      setView('success');
      onSuccess();
      setTimeout(() => onClose(), 2500);
    } catch (error) {
      toast.error("Erro ao salvar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveSchedule = async () => {
    try {
      const scheduleRef = doc(db, 'couples', coupleId, 'conjugalPrayer', 'schedule');
      await setDoc(scheduleRef, { 
        time: scheduleTime,
        reminderEnabled: true,
        updatedAt: Date.now()
      });
      toast.success("Horário salvo! Você receberá lembretes.");
    } catch (error) {
      toast.error("Erro ao salvar horário.");
    }
  };

  const handleSendCounseling = async () => {
    if (!problemText.trim()) return;
    setIsSubmitting(true);
    try {
      // 1. Buscar histórico
      const historyRef = collection(db, 'users', userId, 'spiritualGuidance');
      const historySnapshot = await getDocs(query(historyRef, orderBy('timestamp', 'desc'), limit(5)));
      const history = historySnapshot.docs.map(doc => doc.data());

      // 2. Chamar Claude API (Simulado conforme solicitado)
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-api-key": "YOUR_API_KEY" // O usuário deve configurar isso
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Você é um diretor espiritual católico expert em casais.
O casal está tendo dificuldade com a oração conjugal: "${problemText}"
Histórico de conselhos: ${JSON.stringify(history)}
Gere um conselho curto (3-4 parágrafos) que:
- Tenha 1 única ideia clara
- Seja prático e aplicável HOJE
- Cite 1 fonte (santo, Padre Caffarel, papa, Bíblia) com referência
- Tenha tom amoroso como Jesus
- Inclua ação concreta`
          }]
        })
      });

      // Nota: Como não temos uma chave real aqui, vou simular a resposta se a API falhar
      let adviceText = "";
      if (response.ok) {
        const data = await response.json();
        adviceText = data.content[0].text;
      } else {
        adviceText = "Meu caro casal, a oração é o oxigênio do amor. São João Paulo II dizia que 'a família que reza unida, permanece unida'. Hoje, não busquem a perfeição, mas a presença. Apenas segurem as mãos por 1 minuto e digam: 'Senhor, estamos aqui'. Essa pequena ação concreta abrirá as portas para a graça que vocês precisam.";
      }

      setAdvice(adviceText);
      
      // 3. Salvar no Firebase
      const docRef = await addDoc(collection(db, 'users', userId, 'spiritualGuidance'), {
        timestamp: Date.now(),
        problema: problemText,
        conselho: adviceText,
        tipo: 'oracao_conjugal',
        feedback: null
      });
      
      setCurrentAdviceId(docRef.id);
      setView('advice');
    } catch (error) {
      toast.error("Erro ao processar aconselhamento.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFeedback = async (type: string) => {
    try {
      const adviceRef = doc(db, 'users', userId, 'spiritualGuidance', currentAdviceId);
      await updateDoc(adviceRef, { feedback: type });
      
      if (type === '🤔 Não sei' || type === '👎 Não gostei') {
        setView('feedback_reason');
      } else {
        toast.success("Obrigado pelo seu feedback! 🙏");
        onClose();
      }
    } catch (error) {
      toast.error("Erro ao salvar feedback.");
    }
  };

  const handleSaveFeedbackReason = async (reasonId: string) => {
    try {
      const adviceRef = doc(db, 'users', userId, 'spiritualGuidance', currentAdviceId);
      await updateDoc(adviceRef, { feedbackReason: reasonId });
      toast.info("Obrigado por nos ajudar a melhorar! 💪");
      onClose();
    } catch (error) {
      toast.error("Erro ao salvar.");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center p-6"
    >
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl relative border max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
        >
          <X size={20} />
        </button>

        <AnimatePresence mode="wait">
          {view === 'initial' && (
            <motion.div key="initial" className="space-y-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-[#e8f0f7] rounded-2xl flex items-center justify-center text-3xl mx-auto">💑</div>
                <h2 className="text-2xl font-bold text-[#2c3e6b]">Oração Conjugal</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A oração conjugal deve ser feita juntos, presencialmente.<br/>
                  <strong>Vocês já fizeram a oração conjugal hoje?</strong>
                </p>
              </div>

              <div className="space-y-3">
                <Button onClick={handleMarkAsDone} disabled={isSubmitting} className="w-full h-14 rounded-2xl bg-[#c9a84c] text-white font-bold text-lg">
                  ✅ Sim, já fizemos!
                </Button>
                <Button variant="outline" onClick={onClose} className="w-full h-14 rounded-2xl border-2 border-[#2c3e6b] text-[#2c3e6b] font-bold">
                  ⏰ Ainda não, mas vamos fazer
                </Button>
                <Button variant="outline" onClick={() => setView('counseling')} className="w-full h-14 rounded-2xl border-2 border-[#2c3e6b] text-[#2c3e6b] font-bold flex gap-2">
                  <MessageSquare size={20} /> Preciso de Aconselhamento
                </Button>
                <Button variant="ghost" onClick={() => setView('reason')} className="w-full text-muted-foreground hover:text-destructive">
                  ❌ Não conseguimos hoje
                </Button>
              </div>

              <div className="pt-6 border-t space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2c3e6b] text-center">
                  📅 HORÁRIO DA ORAÇÃO (opcional)
                </h3>
                <div className="flex gap-3">
                  <Input 
                    type="time" 
                    value={scheduleTime} 
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="flex-1 h-12 rounded-xl border-2 border-[#e8f0f7]"
                  />
                  <Button onClick={handleSaveSchedule} className="bg-[#2c3e6b] text-white rounded-xl px-6">
                    Salvar
                  </Button>
                </div>
                <p className="text-[10px] text-center text-muted-foreground flex items-center justify-center gap-1">
                  <Clock size={12} /> Receba lembretes 10min antes
                </p>
              </div>
            </motion.div>
          )}

          {view === 'counseling' && (
            <motion.div key="counseling" className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-[#2c3e6b]">💬 Aconselhamento Espiritual</h2>
                <p className="text-sm text-muted-foreground">Conte-nos: o que está dificultando a oração conjugal?</p>
              </div>
              <Textarea 
                value={problemText}
                onChange={(e) => setProblemText(e.target.value)}
                placeholder="Escreva aqui..."
                className="min-h-[150px] rounded-2xl border-2 border-[#e8f0f7] focus:border-[#c9a84c]"
              />
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setView('initial')} className="flex-1 h-12 rounded-xl border-2 border-[#2c3e6b]">
                  Voltar
                </Button>
                <Button onClick={handleSendCounseling} disabled={!problemText.trim() || isSubmitting} className="flex-1 h-12 rounded-xl bg-[#c9a84c] text-white font-bold">
                  {isSubmitting ? "Processando..." : "Enviar"}
                </Button>
              </div>
            </motion.div>
          )}

          {view === 'advice' && (
            <motion.div key="advice" className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-[#2c3e6b]">🙏 Conselho Espiritual</h2>
              </div>
              <div className="bg-[#e8f0f7] p-6 rounded-2xl text-sm leading-relaxed text-[#2c3e6b] italic">
                {advice}
              </div>
              <div className="space-y-4">
                <p className="text-xs font-bold text-center text-muted-foreground">Este conselho foi útil para você?</p>
                <div className="grid grid-cols-2 gap-2">
                  {['😍 Amei', '👍 Gostei', '🤔 Não sei', '👎 Não gostei'].map((f) => (
                    <Button key={f} variant="outline" onClick={() => handleFeedback(f)} className="h-12 rounded-xl border-2 border-[#e8f0f7] text-xs">
                      {f}
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'feedback_reason' && (
            <motion.div key="feedback_reason" className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-[#2c3e6b]">O que faltou?</h2>
                <p className="text-sm text-muted-foreground">Ajude-nos a melhorar o aconselhamento</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {FEEDBACK_REASONS.map((r) => (
                  <Button key={r.id} variant="outline" onClick={() => handleSaveFeedbackReason(r.id)} className="h-12 rounded-xl border-2 border-[#e8f0f7] justify-start px-4">
                    {r.label}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Outras views (reason, success) permanecem similares... */}
          {view === 'reason' && (
            <motion.div key="reason" className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-[#2c3e6b]">O que dificultou?</h2>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {REASONS.map((reason) => (
                  <div key={reason.id} className="flex items-center space-x-3 p-3 rounded-xl border bg-muted/30">
                    <Checkbox id={reason.id} checked={selectedReasons.includes(reason.id)} onCheckedChange={() => {
                      setSelectedReasons(prev => prev.includes(reason.id) ? prev.filter(r => r !== reason.id) : [...prev, reason.id]);
                    }} />
                    <Label htmlFor={reason.id} className="text-sm font-medium cursor-pointer flex-1">{reason.label}</Label>
                  </div>
                ))}
              </div>
              <Button onClick={() => { toast.info("Entendemos. Vamos tentar amanhã! 💪"); onClose(); }} disabled={selectedReasons.length === 0} className="w-full h-14 rounded-2xl bg-[#2c3e6b] text-white font-bold">
                Enviar Resposta
              </Button>
            </motion.div>
          )}

          {view === 'success' && (
            <motion.div key="success" className="text-center py-10 space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={48} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#2c3e6b]">Que bênção! 🙏</h2>
              <p className="text-lg text-muted-foreground">Deus abençoe vocês!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ConjugalPrayerModal;
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

  const gerarConselhoSimulado = async (problema: string) => {
    console.log("💬 Gerando conselho simulado...");
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const problemaLower = problema.toLowerCase();
    
    if (problemaLower.includes('tempo') || problemaLower.includes('cansaço') || problemaLower.includes('ocupados')) {
      return `**Por que é difícil encontrar tempo para Deus?**

Padre Caffarel descobriu algo surpreendente: a dificuldade não está em não ter tempo - está em não entender que a oração conjugal não precisa ser longa.

São Francisco de Sales nos ensina: "Meia hora de oração é o ideal, mas se não tiver tempo, dez minutos bastam. E se não tiver dez minutos, então você precisa de uma hora!" Ele brincava para mostrar que quando estamos ocupados demais, é quando MAIS precisamos de Deus.

**Para esta semana:** Escolham apenas 3 minutos. Apenas 3! Sentem juntos, segurem as mãos, e um diz: "Obrigado Senhor por..." e o outro completa. Isso é oração conjugal. Simples assim.

Como diz Mateus 18,20: "Onde dois ou três estiverem reunidos em meu nome, ali estou eu no meio deles."`;
    } 
    
    if (problemaLower.includes('conflito') || problemaLower.includes('briga') || problemaLower.includes('desacordo')) {
      return `**Rezar quando há tensão entre vocês**

Santa Mônica rezou por 30 anos pelo marido difícil. Sabe o que ela descobriu? Que a oração não muda o outro primeiro - muda nosso coração.

Padre Caffarel ensinava: "A oração conjugal não exige que estejam bem um com o outro. Exige apenas que estejam dispostos a estar juntos diante de Deus."

**A verdade libertadora:** Vocês não precisam resolver o conflito ANTES de rezar. Rezem COM o conflito. Sentem lado a lado (sem olhar um para o outro se for difícil), e simplesmente digam: "Senhor, estamos aqui." Deus age no silêncio.

Efésios 4,26 nos diz: "Não se ponha o sol sobre a vossa ira." Terminem o dia juntos diante de Deus, mesmo em silêncio.`;
    }

    if (problemaLower.includes('não sabe') || problemaLower.includes('como fazer') || problemaLower.includes('não sabemos')) {
      return `**O segredo que ninguém conta sobre oração conjugal**

Beato Charles de Foucauld passou anos no deserto. Sabe o que ele fazia? Silêncio. Apenas presença diante de Deus.

A oração conjugal não precisa de palavras bonitas. Padre Caffarel dizia: "Estar juntos diante de Deus já É a oração."

**Para começar HOJE:** Sentem lado a lado. Um lê o Evangelho do dia (pode ser deste app mesmo). O outro escuta. Depois, ficam 1 minuto em silêncio. Terminem com um Pai Nosso juntos. Pronto.

Como Jesus disse em Mateus 6,6: "Quando orares, entra no teu quarto, fecha a porta e ora ao teu Pai em secreto." O quarto de vocês pode ser qualquer lugar onde estejam JUNTOS com Deus.`;
    }

    return `**Começar é mais importante que fazer perfeito**

Santo Agostinho dizia: "Reza como podes, não como não podes." Vocês não precisam ser santos para começar a rezar juntos.

Padre Caffarel fundou as Equipes de Nossa Senhora depois de perceber que casais precisam de SIMPLICIDADE, não de complicação.

**Ação para hoje:** Escolham um momento fixo. Pode ser antes de dormir, pode ser no café da manhã. Apenas 2 minutos. Um de vocês agradece a Deus por UMA coisa, o outro também. Terminem com "Amém" juntos.

Provérbios 3,5-6: "Confia no Senhor de todo o teu coração... e ele endireitará as tuas veredas."`;
  };

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
      const adviceText = await gerarConselhoSimulado(problemText);
      setAdvice(adviceText);
      
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
                <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded-full mb-2">
                  [BETA] Conselhos em fase de testes
                </div>
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
              <div className="bg-[#e8f0f7] p-6 rounded-2xl text-sm leading-relaxed text-[#2c3e6b] whitespace-pre-wrap">
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
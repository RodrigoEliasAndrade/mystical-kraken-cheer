"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Heart, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Intention {
  id: string;
  text: string;
  author: string;
  prayed: boolean;
}

interface IntentionsWallProps {
  coupleId: string;
  userName: string;
}

const IntentionsWall = ({ coupleId, userName }: IntentionsWallProps) => {
  const [intentions, setIntentions] = useState<Intention[]>([]);
  const [newIntention, setNewIntention] = useState("");

  useEffect(() => {
    if (!coupleId) return;

    const q = query(
      collection(db, 'couples', coupleId, 'intentions'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Intention[];
      setIntentions(items);
    });

    return () => unsubscribe();
  }, [coupleId]);

  const handleAdd = async () => {
    if (!newIntention.trim()) return;
    try {
      await addDoc(collection(db, 'couples', coupleId, 'intentions'), {
        text: newIntention,
        author: userName,
        prayed: false,
        createdAt: serverTimestamp()
      });
      setNewIntention("");
    } catch (error) {
      toast.error("Erro ao adicionar intenção.");
    }
  };

  const togglePrayed = async (id: string, current: boolean) => {
    try {
      await updateDoc(doc(db, 'couples', coupleId, 'intentions', id), {
        prayed: !current
      });
    } catch (error) {
      toast.error("Erro ao atualizar.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'couples', coupleId, 'intentions', id));
    } catch (error) {
      toast.error("Erro ao excluir.");
    }
  };

  return (
    <div className="bg-white rounded-[2rem] p-6 border shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2c3e6b]">
          Mural de Intenções
        </h3>
        <Heart size={16} className="text-[#c9a84c]" />
      </div>

      <div className="flex gap-2">
        <Input 
          value={newIntention}
          onChange={(e) => setNewIntention(e.target.value)}
          placeholder="Nova intenção..."
          className="rounded-xl border-2 border-[#e8f0f7] focus:border-[#c9a84c]"
        />
        <Button onClick={handleAdd} size="icon" className="rounded-xl bg-[#2c3e6b] shrink-0">
          <Plus size={20} />
        </Button>
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {intentions.map((item) => (
          <div 
            key={item.id}
            className={cn(
              "p-4 rounded-2xl border transition-all flex items-center justify-between gap-3",
              item.prayed ? "bg-green-50 border-green-100 opacity-70" : "bg-[#f5f5f5] border-transparent"
            )}
          >
            <div className="flex-1 cursor-pointer" onClick={() => togglePrayed(item.id, item.prayed)}>
              <p className={cn("text-sm font-medium", item.prayed && "line-through text-green-700")}>
                {item.text}
              </p>
              <span className="text-[9px] font-bold uppercase text-muted-foreground">
                Por: {item.author}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {item.prayed && <span className="text-xs">🙏</span>}
              <button 
                onClick={() => handleDelete(item.id)}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {intentions.length === 0 && (
          <p className="text-center text-xs text-muted-foreground py-4 italic">
            Nenhuma intenção no momento.
          </p>
        )}
      </div>
    </div>
  );
};

export default IntentionsWall;
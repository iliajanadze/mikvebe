import React, { useState } from 'react';
import { Recipe } from '../types/chef';
import { X, Send, Sparkles, ChefHat, MessageSquare, Bot } from 'lucide-react';

interface AskChefModalProps {
  recipe: Recipe | null;
  detectedIngredients: string[];
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: 'user' | 'chef';
  text: string;
}

const QUICK_QUESTIONS = [
  'რითი შემიძლია ჩავანაცვლო ყველი?',
  'როგორ მოვამზადო თუ ღუმელი არ მაქვს?',
  'რამდენ ხანს შემიძლია შევინახო მაცივარში?',
  'როგორ გავხადო კერძი ნაკლებად კალორიული?',
  'რომელი სოუსი ან გარნირი მოუხდება?',
];

export const AskChefModal: React.FC<AskChefModalProps> = ({
  recipe,
  detectedIngredients,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'chef',
      text: recipe
        ? `გამარჯობა! მე ვარ თქვენი შეფი. გაქვთ რაიმე შეკითხვა კერძზე "${recipe.title}"? სიამოვნებით დაგეხმარებით ინგრედიენტების ჩანაცვლებაში, მომზადების ხრიკებში ან შენახვის წესებში.`
        : 'გამარჯობა! მე ვარ თქვენი პირადი შეფი. რა კულინარიული შეკითხვა გაქვთ?',
    },
  ]);
  const [isSending, setIsSending] = useState(false);

  const handleAsk = async (textToAsk?: string) => {
    const q = textToAsk || question;
    if (!q.trim() || isSending) return;

    const newMessages: Message[] = [...messages, { sender: 'user', text: q }];
    setMessages(newMessages);
    setQuestion('');
    setIsSending(true);

    try {
      const res = await fetch('/api/chef/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          recipeContext: recipe
            ? {
                title: recipe.title,
                ingredients: recipe.primaryIngredients.map((i) => i.name),
              }
            : null,
          currentIngredients: detectedIngredients,
        }),
      });

      const data = await res.json();
      if (data.answer) {
        setMessages([...newMessages, { sender: 'chef', text: data.answer }]);
      } else {
        setMessages([
          ...newMessages,
          { sender: 'chef', text: 'ბოდიში, პასუხის მიღება ვერ მოხერხდა. გთხოვთ სცადოთ კვლავ.' },
        ]);
      }
    } catch (err: any) {
      setMessages([
        ...newMessages,
        { sender: 'chef', text: 'შეცდომა კავშირისას. გთხოვთ სცადოთ ცოტა ხანში.' },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[620px] max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-amber-200/70 bg-gradient-to-r from-amber-500 to-orange-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif-geo text-lg font-bold">ჰკითხეთ შეფს</h3>
              <p className="text-xs text-amber-100">
                {recipe ? `კონსულტაცია: ${recipe.title}` : 'კულინარიული რჩევები და ჩანაცვლებები'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Questions pills */}
        <div className="p-3 bg-amber-50/70 border-b border-amber-200/50 overflow-x-auto flex gap-2 shrink-0 scrollbar-none">
          {QUICK_QUESTIONS.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleAsk(item)}
              disabled={isSending}
              className="text-[11px] font-medium whitespace-nowrap bg-white hover:bg-amber-100 text-amber-900 border border-amber-200/80 px-2.5 py-1 rounded-lg transition-colors shadow-2xs"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-stone-50/50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${
                m.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.sender === 'chef' && (
                <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs shrink-0 shadow-xs mt-1">
                  👨‍🍳
                </div>
              )}
              <div
                className={`max-w-[82%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-amber-600 text-white rounded-tr-none'
                    : 'bg-white border border-stone-200 text-stone-800 shadow-2xs rounded-tl-none whitespace-pre-line'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs shrink-0">
                👨‍🍳
              </div>
              <div className="bg-white border border-stone-200 text-stone-500 text-xs px-3.5 py-2.5 rounded-2xl rounded-tl-none flex items-center gap-2 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]" />
                <span className="text-stone-600 font-medium ml-1">შეფი ფიქრობს...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-stone-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="დაწერეთ თქვენი შეკითხვა შეფს..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={!question.trim() || isSending}
              className={`p-2.5 sm:px-4 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm inline-flex items-center gap-1.5 transition-all ${
                !question.trim() || isSending
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
              }`}
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">გაგზავნა</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, MessageSquare, Star, X, AlertCircle } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  userName?: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  userEmail = '',
  userName = '',
}) => {
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('გთხოვთ შეავსოთ სახელი, ელ.ფოსტა და შეტყობინება');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim() || 'მიკვებე - მომხმარებლის შეტყობინება',
          message: message.trim(),
          rating,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'შეტყობინების გაგზავნა ვერ მოხერხდა');
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setMessage('');
        setSubject('');
        onClose();
      }, 2500);
    } catch (err: any) {
      setError(err?.message || 'შეცდომა გაგზავნისას');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-amber-200/80 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-amber-200/60 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-geo text-lg font-bold text-stone-900">
                მოგვწერეთ / უკუკავშირი
              </h3>
              <p className="text-xs text-stone-500">
                შენიშვნა, იდეა ან შეკითხვა დიეტოლოგთან
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="font-serif-geo text-xl font-bold text-stone-900">
                შეტყობინება გაგზავნილია!
              </h4>
              <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                დიდი მადლობა უკუკავშირისთვის. ჩვენი გუნდი დაუყოვნებლივ გაეცნობა თქვენს წერილს.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">
                    თქვენი სახელი *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="მაგ: გიორგი"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">
                    ელ.ფოსტა *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  თემა / საკითხი
                </label>
                <input
                  type="text"
                  placeholder="მაგ: კვების გეგმა, ტექნიკური შეკითხვა ან წინადადება"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  აპლიკაციის შეფასება:
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className={`p-1.5 rounded-lg transition-transform hover:scale-110 ${
                        rating >= star ? 'text-amber-500' : 'text-stone-300'
                      }`}
                    >
                      <Star className={`w-5 h-5 ${rating >= star ? 'fill-amber-500' : ''}`} />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-stone-600 ml-2">
                    {rating} / 5
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  შეტყობინება *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="გაგვიზიარეთ თქვენი აზრი, შეკითხვა ან შენიშვნა..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>იგზავნება...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>შეტყობინების გაგზავნა</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

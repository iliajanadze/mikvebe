import React, { useState, useEffect } from 'react';
import { Mail, Send, CheckCircle2, Star, X, AlertCircle, Settings2, Info, Loader2, Sparkles, ExternalLink } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  userName?: string;
}

const RATING_LABELS: Record<number, string> = {
  1: '1/5 - გაუმჯობესება სჭირდება',
  2: '2/5 - საშუალო',
  3: '3/5 - კარგია',
  4: '4/5 - ძალიან კარგია!',
  5: '5/5 - შესანიშნავია, აღფრთოვანებული ვარ! ⭐',
};

const DEFAULT_TARGET_EMAIL = 'iliajanadze999@gmail.com';

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
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // Formspree custom Form ID support (optional for user)
  const [showConfig, setShowConfig] = useState(false);
  const [formspreeId, setFormspreeId] = useState<string>(() => {
    return localStorage.getItem('mikvebe_custom_formspree_id') || '';
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [needsActivation, setNeedsActivation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userName && !name) setName(userName);
    if (userEmail && !email) setEmail(userEmail);
  }, [userName, userEmail]);

  if (!isOpen) return null;

  const handleSaveFormspreeId = (val: string) => {
    setFormspreeId(val);
    if (val.trim()) {
      localStorage.setItem('mikvebe_custom_formspree_id', val.trim());
    } else {
      localStorage.removeItem('mikvebe_custom_formspree_id');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('გთხოვთ შეავსოთ სახელი, ელ.ფოსტა და შეტყობინება');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setNeedsActivation(false);

    try {
      // 1. Try sending via backend /api/feedback route
      let backendSuccess = false;
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
            customFormspreeId: formspreeId.trim() || undefined,
          }),
        });

        const data = await res.json().catch(() => ({}));

        if (res.ok && data.success) {
          backendSuccess = true;
          if (data.needsActivation) {
            setNeedsActivation(true);
          }
        }
      } catch (backendErr) {
        console.warn('Backend feedback fetch failed, trying direct client dispatch:', backendErr);
      }

      // 2. Direct client-side fallback if backend failed or not available
      if (!backendSuccess) {
        // Fallback: Direct call to FormSubmit
        const fallbackRes = await fetch(`https://formsubmit.co/ajax/${DEFAULT_TARGET_EMAIL}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            'სახელი': name.trim(),
            'ელ.ფოსტა': email.trim(),
            'შეფასება': `${rating} / 5 ⭐`,
            'თემა': subject.trim() || 'მიკვებე - მომხმარებლის შეტყობინება',
            'შეტყობინება': message.trim(),
            _subject: `[მიკვებე] ახალი უკუკავშირი (${rating}★): ${name.trim()}`,
            _replyto: email.trim(),
            _template: 'table',
          }),
        });

        const fbData: any = await fallbackRes.json().catch(() => ({}));
        if (fbData && fbData.message && fbData.message.includes('needs Activation')) {
          setNeedsActivation(true);
        }
      }

      // Also send to custom Formspree directly if configured on client
      if (formspreeId.trim()) {
        const cleanId = formspreeId.trim().replace(/https?:\/\/formspree\.io\/f\//, '');
        try {
          await fetch(`https://formspree.io/f/${cleanId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              name: name.trim(),
              email: email.trim(),
              rating: `${rating} / 5`,
              subject: subject.trim() || 'მიკვებე შეტყობინება',
              message: message.trim(),
            }),
          });
        } catch (fspreeClientErr) {
          console.warn('Direct Formspree dispatch error:', fspreeClientErr);
        }
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'შეტყობინების გაგზავნისას დაფიქსირდა შეცდომა');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setNeedsActivation(false);
    setMessage('');
    setSubject('');
    setError(null);
    onClose();
  };

  const currentActiveRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-amber-200/90 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-amber-200/60 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-600 text-white flex items-center justify-center shadow-md shadow-amber-900/10">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-geo text-lg font-bold text-stone-900 flex items-center gap-2">
                მოგვწერეთ / უკუკავშირი
              </h3>
              <p className="text-xs text-stone-500 flex items-center gap-1.5">
                <span>ადრესატი:</span>
                <span className="font-mono text-[11px] font-semibold text-amber-900 bg-amber-100/80 px-1.5 py-0.5 rounded">
                  {DEFAULT_TARGET_EMAIL}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowConfig(!showConfig)}
              className={`p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors ${
                showConfig ? 'bg-amber-100 text-amber-900' : ''
              }`}
              title="პარამეტრები (Formspree / ინტეგრაცია)"
            >
              <Settings2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Optional Formspree / Advanced Settings Toggle */}
        {showConfig && (
          <div className="p-4 bg-amber-50/70 border-b border-amber-200 text-xs space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between font-bold text-amber-950">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Formspree ინტეგრაცია (არასავალდებულო)
              </span>
              <a
                href="https://formspree.io"
                target="_blank"
                rel="noreferrer"
                className="text-amber-700 hover:underline flex items-center gap-1 text-[11px]"
              >
                formspree.io <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              ნაგულისხმევად შეტყობინებები პირდაპირ იგზავნება <strong>{DEFAULT_TARGET_EMAIL}</strong>-ზე (FormSubmit სერვისით, უფასოდ და პაროლების გარეშე).
              თუ გსურთ გამოიყენოთ <strong>Formspree</strong>-ს პირადი ID, ჩასვით ქვემოთ:
            </p>
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="მაგ: mqkenbyz ან სრული URL"
                value={formspreeId}
                onChange={(e) => handleSaveFormspreeId(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-white rounded-lg border border-amber-300 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              {formspreeId && (
                <button
                  type="button"
                  onClick={() => handleSaveFormspreeId('')}
                  className="px-2 py-1 bg-stone-200 hover:bg-stone-300 rounded text-[11px] text-stone-700"
                >
                  გასუფთავება
                </button>
              )}
            </div>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6">
          {isSuccess ? (
            <div className="py-6 text-center space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h4 className="font-serif-geo text-xl font-bold text-stone-900">
                  შეტყობინება გაიგზავნა!
                </h4>
                <p className="text-xs text-stone-600 mt-1 max-w-sm mx-auto leading-relaxed">
                  თქვენი შეტყობინება (სახელი, ელ.ფოსტა, {rating}★ შეფასება და ტექსტი) წარმატებით გამოიგზავნა ადრესატთან:
                </p>
                <div className="inline-block mt-2 px-3 py-1 rounded-full bg-amber-100 text-amber-950 font-mono text-xs font-bold border border-amber-300">
                  {DEFAULT_TARGET_EMAIL}
                </div>
              </div>

              {needsActivation && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-left text-xs space-y-1.5 text-amber-950">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <Info className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>პირველი გაგზავნის ერთჯერადი დადასტურება:</span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    თქვენს ელ.ფოსტაზე (<strong>{DEFAULT_TARGET_EMAIL}</strong>) გამოგზავნილია წერილი FormSubmit-ისგან სათაურით <em>"Activate Form"</em>.
                    უბრალოდ გახსენით წერილი და დააჭირეთ ერთ ღილაკს ("Activate Form"), რის შემდეგაც ყველა შეტყობინება შეუფერხებლად მოგივათ პირდაპირ ინბოქსში!
                  </p>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  დახურვა
                </button>
              </div>
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
                    თქვენი სახელი <span className="text-amber-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="მაგ: გიორგი ან ანა"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">
                    თქვენი ელ.ფოსტა <span className="text-amber-600">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  თემა / საკითხი
                </label>
                <input
                  type="text"
                  placeholder="მაგ: კვების გეგმა, ახალი რეცეპტის იდეა ან ტექნიკური შეკითხვა"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                />
              </div>

              {/* Interactive Star Rating */}
              <div className="p-3 bg-amber-50/50 rounded-2xl border border-amber-200/70">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold text-stone-800">
                    აპლიკაციის შეფასება:
                  </label>
                  <span className="text-[11px] font-semibold text-amber-900">
                    {RATING_LABELS[currentActiveRating]}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setRating(star)}
                      className="p-1 rounded-lg transition-transform hover:scale-125 focus:outline-none"
                      title={`${star} ვარსკვლავი`}
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          currentActiveRating >= star
                            ? 'text-amber-500 fill-amber-500 filter drop-shadow-[0_1px_2px_rgba(245,158,11,0.4)]'
                            : 'text-stone-300 hover:text-stone-400'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-black text-amber-950 ml-auto bg-white px-2 py-0.5 rounded-lg border border-amber-200">
                    {rating} / 5
                  </span>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  შეტყობინება <span className="text-amber-600">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="გაგვიზიარეთ თქვენი აზრი, შეკითხვა დიეტოლოგთან ან შენიშვნა..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white resize-none transition-all"
                />
              </div>

              {/* Notice */}
              <div className="flex items-center gap-2 text-[11px] text-stone-500 px-1">
                <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>
                  თქვენი შეტყობინება მომენტალურად გაეგზავნება ადმინისტრატორს ელ.ფოსტაზე: <strong>{DEFAULT_TARGET_EMAIL}</strong>
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-amber-900/15 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>იგზავნება ელ.ფოსტაზე...</span>
                  </>
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

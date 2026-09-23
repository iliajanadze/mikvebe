import React, { useState } from 'react';
import { UserAccount } from '../types/userAccount';
import { FullMonthDietPlan } from '../types/dietPlan';
import {
  User,
  ShieldCheck,
  Calendar,
  Sparkles,
  Award,
  Key,
  LogOut,
  Mail,
  CheckCircle2,
  Trash2,
  Clock,
  Flame,
  X,
  ExternalLink,
} from 'lucide-react';

interface UserAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  savedPlans: FullMonthDietPlan[];
  onSelectPlan: (plan: FullMonthDietPlan) => void;
  onDeletePlan: (planId: string) => void;
  onLoginOrRegister: (userData: { name: string; email: string }) => void;
  onLogout: () => void;
}

export const UserAccountModal: React.FC<UserAccountModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  savedPlans,
  onSelectPlan,
  onDeletePlan,
  onLoginOrRegister,
  onLogout,
}) => {
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  if (!isOpen) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    const finalName = nameInput.trim() || emailInput.split('@')[0] || 'მომხმარებელი';
    onLoginOrRegister({ name: finalName, email: emailInput.trim() });
    setNameInput('');
    setEmailInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-amber-200/80 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-amber-200/60 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-geo text-lg font-bold text-stone-900">
                  მომხმარებლის პროფილი
                </h3>
                {currentUser && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    ID: {currentUser.id}
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500">
                1-თვიანი გეგმების დაცული შენახვა & პრემიუმ დეშბორდი
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

        {/* Content */}
        <div className="p-6 space-y-6">
          {currentUser ? (
            /* Logged in state */
            <div className="space-y-6">
              {/* Account badge banner */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-serif-geo text-base font-bold text-stone-900 flex items-center gap-1.5">
                      <span>{currentUser.name}</span>
                      <Award className="w-4 h-4 text-amber-600" />
                    </h4>
                    <p className="text-xs text-stone-500">{currentUser.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-200/80 text-amber-950 border border-amber-300">
                        {currentUser.membershipStatus}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        რეგისტრაცია: {new Date(currentUser.createdAt).toLocaleDateString('ka-GE')}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-xs font-bold text-stone-700 flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>გამოსვლა</span>
                </button>
              </div>

              {/* Saved 1-Month Plans */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    შენახული 1-თვიანი გეგმები ({savedPlans.length})
                  </h5>
                  <span className="text-[11px] text-stone-500">
                    ყოველთვის ხელმისაწვდომი თქვენს პროფილში
                  </span>
                </div>

                {savedPlans.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-2">
                    <Sparkles className="w-8 h-8 text-amber-600/60 mx-auto" />
                    <p className="text-xs font-medium text-stone-600">
                      თქვენ ჯერ არ გაქვთ შენახული 1-თვიანი გეგმა.
                    </p>
                    <p className="text-[11px] text-stone-500">
                      დააჭირეთ „1-თვიანი დიეტა“ ღილაკს, შეავსეთ მონაცემები და გეგმა ავტომატურად
                      ჩაჯდება თქვენს პირად ანგარიშში!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    {savedPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className="p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 transition-all flex items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-stone-900">
                              🎯 {plan.target.goal}
                            </span>
                            <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1">
                              <Flame className="w-3 h-3 text-amber-600" />
                              {plan.target.targetDailyCalories} კკალ/დღეში
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500">
                            შედგენილია: {new Date(plan.createdAt).toLocaleDateString('ka-GE')} • 4 კვირა (28 დღე)
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              onSelectPlan(plan);
                              onClose();
                            }}
                            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-2xs flex items-center gap-1 transition-colors"
                          >
                            <span>გახსნა</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => onDeletePlan(plan.id)}
                            className="p-1.5 rounded-xl bg-stone-100 hover:bg-rose-50 text-stone-500 hover:text-rose-600 transition-colors"
                            title="წაშლა"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Log in / Register form */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  შექმენით ანგარიში ან შედით
                </h4>
                <p className="text-xs text-stone-600">
                  შეინახეთ თქვენი 1-თვიანი კვების გეგმა, საყიდლების სია და წყლის შეხსენებები
                  პერსონალურ პროფილში უნიკალური ID-ით.
                </p>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-3">
                {isRegisterMode && (
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      თქვენი სახელი
                    </label>
                    <input
                      type="text"
                      placeholder="მაგ: მარიამი"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">
                    ელ.ფოსტა *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  <span>{isRegisterMode ? 'რეგისტრაცია & ID მიღება' : 'შესვლა პირად პროფილში'}</span>
                </button>
              </form>

              <div className="text-center pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(!isRegisterMode)}
                  className="text-xs font-bold text-amber-700 hover:text-amber-900 transition-colors"
                >
                  {isRegisterMode
                    ? 'უკვე გაქვთ პროფილი? შედით ელ.ფოსტით'
                    : 'ახალი ხართ? დაარეგისტრირეთ თქვენი ექაუნთი'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

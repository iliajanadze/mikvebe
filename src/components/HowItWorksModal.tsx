import React from 'react';
import { X, Camera, Sparkles, ChefHat, HeartHandshake, CheckCircle2 } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-amber-200/70 bg-amber-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-geo text-lg font-bold text-stone-900">
                როგორ მუშაობს AI შეფი?
              </h3>
              <p className="text-xs text-stone-600">
                მარტივი ნაბიჯები გემრიელი კერძის მოსამზადებლად
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-stone-800">
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
              1
            </div>
            <div>
              <h4 className="font-serif-geo font-bold text-base text-stone-900">
                გადაუღეთ ფოტო ან ატვირთეთ სურათი
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                გახსენით მაცივარი, დაალაგეთ პროდუქტები სამზარეულოს მაგიდაზე და გადაუღეთ მკაფიო ფოტო. ან აირჩიეთ ჩვენი მზა ნიმუშებიდან ერთ-ერთი.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
              2
            </div>
            <div>
              <h4 className="font-serif-geo font-bold text-base text-stone-900">
                შეფი ამოიცნობს ინგრედიენტებს
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                ხელოვნური ინტელექტი დეტალურად გააანალიზებს ფოტოს, ამოიცნობს ბოსტნეულს, ხორცს, ყველს, სანელებლებს და მოგცემთ სიას, სადაც შეგიძლიათ დაამატოთ ან ამოიღოთ პროდუქტი.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
              3
            </div>
            <div>
              <h4 className="font-serif-geo font-bold text-base text-stone-900">
                მიიღეთ 2-3 გემრიელი რეცეპტი ქართულად
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                შეფი შემოგთავაზებთ მრავალფეროვან, მარტივ და ორიგინალურ კერძებს ეტაპობრივი ინსტრუქციებით, შეფის საიდუმლო ხრიკებითა და რეკომენდებული სასმელებით.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
              4
            </div>
            <div>
              <h4 className="font-serif-geo font-bold text-base text-stone-900">
                მომზადების რეჟიმი & შეფის კონსულტაცია
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                გააქტიურეთ ხმოვანი ასისტენტი, რომ მომზადებისას ხელების დაბინძურების გარეშე მოუსმინოთ ნაბიჯებს, გამოიყენეთ ჩაშენებული ტაიმერი და ნებისმიერ დროს ჰკითხეთ შეფს ალტერნატივებზე!
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-stone-200 bg-stone-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs"
          >
            გასაგებია, დავიწყოთ!
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ImageUploader } from './components/ImageUploader';
import { IngredientsBadgeList } from './components/IngredientsBadgeList';
import { RecipeCard } from './components/RecipeCard';
import { CookingModeModal } from './components/CookingModeModal';
import { AskChefModal } from './components/AskChefModal';
import { SavedRecipesModal } from './components/SavedRecipesModal';
import { CookingTimerWidget } from './components/CookingTimerWidget';
import { HowItWorksModal } from './components/HowItWorksModal';
import { DietPlanModal } from './components/DietPlanModal';
import { FeedbackModal } from './components/FeedbackModal';
import { UserAccountModal } from './components/UserAccountModal';
import {
  CookingMethodSelector,
  CookingMethodFilter,
} from './components/CookingMethodSelector';
import { getCookingMethod } from './utils/calorieUtils';
import {
  ChefAnalysisResult,
  IngredientDetected,
  Recipe,
  UserPreferences,
} from './types/chef';
import { FullMonthDietPlan } from './types/dietPlan';
import { UserAccount } from './types/userAccount';
import { ChefHat, AlertCircle, RefreshCw, Sparkles, Utensils, MessageSquare, Droplets, Calendar } from 'lucide-react';

const STORAGE_SAVED_RECIPES_KEY = 'ai_chef_saved_recipes_v1';
const STORAGE_USER_ACCOUNT_KEY = 'mikvebe_user_account_v1';
const STORAGE_SAVED_PLANS_KEY = 'mikvebe_saved_diet_plans_v1';

export default function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const [preferences, setPreferences] = useState<UserPreferences>({
    dietary: 'ყველაფერი',
    mealType: 'ნებისმიერი',
    servings: 2,
    additionalIngredients: [],
    excludedIngredients: [],
    extraNote: '',
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ChefAnalysisResult | null>(null);

  // User Account state
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_USER_ACCOUNT_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Saved 1-month diet plans
  const [savedDietPlans, setSavedDietPlans] = useState<FullMonthDietPlan[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_SAVED_PLANS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Active selected diet plan to open in modal
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<FullMonthDietPlan | null>(null);

  // Modals state
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_SAVED_RECIPES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [showSavedModal, setShowSavedModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [showDietPlanModal, setShowDietPlanModal] = useState<boolean>(false);
  const [showAccountModal, setShowAccountModal] = useState<boolean>(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);

  const [cookingModeRecipe, setCookingModeRecipe] = useState<Recipe | null>(null);
  const [askChefRecipe, setAskChefRecipe] = useState<Recipe | null>(null);
  const [isAskChefOpen, setIsAskChefOpen] = useState<boolean>(false);
  const [activeTimer, setActiveTimer] = useState<{ minutes: number; label: string } | null>(null);
  const [activeMethodFilter, setActiveMethodFilter] = useState<CookingMethodFilter>('all');
  const [targetServings, setTargetServings] = useState<number>(2);

  // Save recipes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SAVED_RECIPES_KEY, JSON.stringify(savedRecipes));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }, [savedRecipes]);

  // Save user account to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_USER_ACCOUNT_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_USER_ACCOUNT_KEY);
      }
    } catch (e) {
      console.warn('Could not save user account:', e);
    }
  }, [currentUser]);

  // Save 1-month diet plans to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SAVED_PLANS_KEY, JSON.stringify(savedDietPlans));
    } catch (e) {
      console.warn('Could not save diet plans:', e);
    }
  }, [savedDietPlans]);

  // Handle plan save from DietPlanModal
  const handleSaveDietPlan = (plan: FullMonthDietPlan) => {
    setSavedDietPlans((prev) => {
      const exists = prev.some((p) => p.id === plan.id);
      if (exists) return prev;
      return [plan, ...prev];
    });

    // Auto-create anonymous account if not already logged in
    if (!currentUser) {
      const randomId = `MIK-${Math.floor(10000 + Math.random() * 90000)}`;
      setCurrentUser({
        id: randomId,
        name: 'ჩემი ანგარიში',
        email: 'user@mikvebe.ge',
        createdAt: new Date().toISOString(),
        membershipStatus: 'პრემიუმ (აქტიური)',
        savedPlanIds: [plan.id],
      });
    } else {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              savedPlanIds: Array.from(new Set([...prev.savedPlanIds, plan.id])),
            }
          : null
      );
    }
  };

  const handleDeleteDietPlan = (planId: string) => {
    setSavedDietPlans((prev) => prev.filter((p) => p.id !== planId));
    if (selectedPlanForModal?.id === planId) {
      setSelectedPlanForModal(null);
    }
  };

  const handleLoginOrRegister = (userData: { name: string; email: string }) => {
    const id = `MIK-${Math.floor(10000 + Math.random() * 90000)}`;
    const newAccount: UserAccount = {
      id,
      name: userData.name,
      email: userData.email,
      createdAt: new Date().toISOString(),
      membershipStatus: 'პრემიუმ (აქტიური)',
      savedPlanIds: savedDietPlans.map((p) => p.id),
    };
    setCurrentUser(newAccount);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleImageSelected = (base64OrUrl: string, presetId: string | null) => {
    setSelectedImage(base64OrUrl);
    setSelectedPreset(presetId);
    setError(null);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setSelectedPreset(null);
    setAnalysisResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chef/analyze-and-cook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: selectedImage,
          presetId: selectedPreset,
          preferences,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'შეცდომა რეცეპტების მომზადებისას');
      }

      setAnalysisResult(data);
      setTargetServings(preferences.servings || 2);

      // Smooth scroll down to results
      setTimeout(() => {
        const resultsSection = document.getElementById('recipes-section');
        resultsSection?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message ||
          'სურათის ანალიზისას დაფიქსირდა შეცდომა. დარწმუნდით, რომ სურათი მკაფიოა და სცადეთ კვლავ.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSaveRecipe = (recipe: Recipe) => {
    setSavedRecipes((prev) => {
      const exists = prev.some((r) => r.id === recipe.id);
      if (exists) {
        return prev.filter((r) => r.id !== recipe.id);
      } else {
        return [recipe, ...prev];
      }
    });
  };

  const handleRemoveSavedRecipe = (id: string) => {
    setSavedRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  const handleRemoveDetectedIngredient = (name: string) => {
    if (!analysisResult) return;
    setAnalysisResult({
      ...analysisResult,
      detectedIngredients: analysisResult.detectedIngredients.filter((i) => i.name !== name),
    });
  };

  const handleAddDetectedIngredient = (ing: IngredientDetected) => {
    if (!analysisResult) return;
    setAnalysisResult({
      ...analysisResult,
      detectedIngredients: [...analysisResult.detectedIngredients, ing],
    });
  };

  const openAskChef = (recipe: Recipe | null) => {
    setAskChefRecipe(recipe);
    setIsAskChefOpen(true);
  };

  const startTimer = (minutes: number, label: string) => {
    setActiveTimer({ minutes, label });
  };

  return (
    <div className="min-h-screen bg-stone-100/50 flex flex-col font-sans">
      {/* Header */}
      <Header
        savedCount={savedRecipes.length}
        currentUser={currentUser}
        onOpenSaved={() => setShowSavedModal(true)}
        onOpenHelp={() => setShowHelpModal(true)}
        onOpenDietPlan={() => {
          setSelectedPlanForModal(null);
          setShowDietPlanModal(true);
        }}
        onOpenAccount={() => setShowAccountModal(true)}
        onOpenFeedback={() => setShowFeedbackModal(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
        {/* Hero Introduction Banner */}
        <section className="text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold border border-amber-300/60">
            <ChefHat className="w-3.5 h-3.5 text-amber-700" />
            <span>თქვენი პერსონალური შეფ-მზარეული</span>
          </div>
          <h1 className="font-serif-geo text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
            რა მოვამზადოთ დღეს?
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            გადაუღეთ ფოტო თქვენს პროდუქტებს ან აირჩიეთ ნიმუში. შეფი ამოიცნობს ინგრედიენტებს და
            შემოგთავაზებთ 2-3 გემრიელ, მარტივ რეცეპტს ქართულად!
          </p>

          {/* Clinical Dietitian & Personal Chef Banner */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowDietPlanModal(true)}
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600/10 via-orange-500/15 to-amber-600/10 hover:from-amber-600/20 hover:to-orange-600/20 border border-amber-300 text-amber-950 font-bold text-xs sm:text-sm shadow-xs transition-all hover:scale-[1.01]"
            >
              <span className="text-base">🥗</span>
              <span>გსურთ 1-თვიანი პერსონალური კვების გეგმა და დიეტა?</span>
              <span className="bg-amber-600 text-white text-[11px] px-2 py-0.5 rounded-full font-bold">
                დიეტოლოგი & შეფი
              </span>
            </button>
          </div>
        </section>

        {/* Step 1: Image Uploader & Presets */}
        <ImageUploader
          selectedImage={selectedImage}
          selectedPreset={selectedPreset}
          onImageSelected={handleImageSelected}
          onClearImage={handleClearImage}
          preferences={preferences}
          onPreferencesChange={setPreferences}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
        />

        {/* Error Notification */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-rose-900 text-xs sm:text-sm animate-in fade-in duration-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">შეცდომა</p>
                <p className="mt-0.5 text-stone-700">{error}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              {selectedImage && (
                <button
                  type="button"
                  onClick={handleAnalyze}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all shadow-2xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>ხელახლა ცდა</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setError(null)}
                className="text-stone-500 hover:text-stone-800 font-bold text-xs px-2.5 py-1.5"
              >
                დახურვა
              </button>
            </div>
          </div>
        )}

        {/* Loading Skeleton during Analysis */}
        {isLoading && (
          <div className="p-8 sm:p-12 bg-white rounded-3xl border border-amber-200 shadow-sm text-center flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-300">
            <div className="relative">
              <div className="w-18 h-18 rounded-3xl bg-amber-100 flex items-center justify-center text-amber-700 animate-pulse-slow">
                <ChefHat className="w-10 h-10" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center text-white">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
              </div>
            </div>

            <div>
              <h3 className="font-serif-geo text-xl font-bold text-stone-900">
                შეფი სწავლობს თქვენს ინგრედიენტებს...
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto mt-1">
                ვიცნობთ პროდუქტებს, ვადგენთ საუკეთესო კულინარიულ კომბინაციებს და ვწერთ მარტივ, ეტაპობრივ რეცეპტებს ქართულად.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
              <span>გთხოვთ დაელოდოთ რამდენიმე წამი...</span>
            </div>
          </div>
        )}

        {/* Results Section */}
        {analysisResult && !isLoading && (
          <div id="recipes-section" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Step 2: Detected Ingredients Badges */}
            <IngredientsBadgeList
              ingredients={analysisResult.detectedIngredients}
              chefCommentary={analysisResult.chefCommentary}
              onRemoveIngredient={handleRemoveDetectedIngredient}
              onAddIngredient={handleAddDetectedIngredient}
            />

            {/* Recipes Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-lg">
                  <Utensils className="w-3.5 h-3.5" />
                  ნაბიჯი 2
                </span>
                <h2 className="font-serif-geo text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                  შეფის შემოთავაზებული რეცეპტები
                </h2>
                <p className="text-xs sm:text-sm text-stone-600">
                  აირჩიეთ სასურველი კერძი, გაეცანით შეფის საიდუმლო რჩევას და დაიწყეთ მომზადება
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openAskChef(null)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>ჰკითხეთ შეფს</span>
                </button>
                <button
                  type="button"
                  onClick={handleAnalyze}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 rounded-xl text-xs sm:text-sm font-semibold transition-all"
                  title="ხელახლა გენერირება"
                >
                  <RefreshCw className="w-4 h-4 text-stone-500" />
                  <span className="hidden sm:inline">ახალი ვარიანტები</span>
                </button>
              </div>
            </div>

            {/* 3 Preparation Choices / Categories Bar & People Count Selector */}
            <CookingMethodSelector
              recipes={analysisResult.recipes}
              activeFilter={activeMethodFilter}
              onSelectFilter={setActiveMethodFilter}
              servings={targetServings}
              onServingsChange={setTargetServings}
            />

            {/* Recipe Cards List */}
            {(() => {
              const filteredRecipes = analysisResult.recipes.filter((r) => {
                if (activeMethodFilter === 'all') return true;
                return getCookingMethod(r) === activeMethodFilter;
              });

              if (filteredRecipes.length === 0) {
                return (
                  <div className="p-8 bg-white rounded-3xl border border-dashed border-stone-300 text-center space-y-3">
                    <p className="text-sm font-medium text-stone-600">
                      არჩეულ კატეგორიაში ({activeMethodFilter}) კერძი ვერ მოიძებნა.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveMethodFilter('all')}
                      className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors"
                    >
                      ყველა რეცეპტის ნახვა ({analysisResult.recipes.length})
                    </button>
                  </div>
                );
              }

              return (
                <div className="space-y-8">
                  {filteredRecipes.map((recipe, idx) => (
                    <RecipeCard
                      key={recipe.id || idx}
                      recipe={recipe}
                      index={idx}
                      initialServings={targetServings}
                      isSaved={savedRecipes.some((r) => r.id === recipe.id)}
                      onToggleSave={handleToggleSaveRecipe}
                      onOpenCookingMode={(rec) => setCookingModeRecipe(rec)}
                      onAskChef={(rec) => openAskChef(rec)}
                      onStartTimer={startTimer}
                    />
                  ))}
                </div>
              );
            })()}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenFeedback={() => setShowFeedbackModal(true)}
        onOpenDietPlan={() => {
          setSelectedPlanForModal(null);
          setShowDietPlanModal(true);
        }}
        onOpenAccount={() => setShowAccountModal(true)}
      />

      {/* Floating Kitchen Timer Widget if active */}
      <CookingTimerWidget
        timerData={activeTimer}
        onClose={() => setActiveTimer(null)}
      />

      {/* Floating Ask Chef Action Button */}
      <button
        type="button"
        onClick={() => openAskChef(null)}
        className="fixed bottom-5 left-5 z-40 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white p-3 sm:px-4 sm:py-3 rounded-2xl shadow-xl border border-amber-300/40 flex items-center gap-2 font-serif-geo font-bold text-xs sm:text-sm transition-transform active:scale-95"
      >
        <span className="text-base">👨‍🍳</span>
        <span className="hidden xs:inline">ჰკითხე შეფს</span>
      </button>

      {/* Modals */}
      <CookingModeModal
        recipe={cookingModeRecipe}
        onClose={() => setCookingModeRecipe(null)}
      />

      <AskChefModal
        recipe={askChefRecipe}
        detectedIngredients={
          analysisResult?.detectedIngredients.map((i) => i.name) || []
        }
        isOpen={isAskChefOpen}
        onClose={() => setIsAskChefOpen(false)}
      />

      <SavedRecipesModal
        isOpen={showSavedModal}
        onClose={() => setShowSavedModal(false)}
        savedRecipes={savedRecipes}
        onRemoveSaved={handleRemoveSavedRecipe}
        onOpenCookingMode={(rec) => setCookingModeRecipe(rec)}
      />

      <HowItWorksModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />

      <DietPlanModal
        isOpen={showDietPlanModal}
        initialPlan={selectedPlanForModal}
        onClose={() => {
          setShowDietPlanModal(false);
          setSelectedPlanForModal(null);
        }}
        onSavePlan={handleSaveDietPlan}
        isPlanSaved={
          selectedPlanForModal
            ? savedDietPlans.some((p) => p.id === selectedPlanForModal.id)
            : false
        }
      />

      <UserAccountModal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        currentUser={currentUser}
        savedPlans={savedDietPlans}
        onSelectPlan={(plan) => {
          setSelectedPlanForModal(plan);
          setShowDietPlanModal(true);
        }}
        onDeletePlan={handleDeleteDietPlan}
        onLoginOrRegister={handleLoginOrRegister}
        onLogout={handleLogout}
      />

      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        userName={currentUser?.name || ''}
        userEmail={currentUser?.email || ''}
      />
      <Analytics />
    </div>
  );
}

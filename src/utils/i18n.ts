export type Language = 'ka' | 'en' | 'ru';

export interface Translations {
  appName: string;
  appTagline: string;
  languageSelectTitle: string;
  languageSelectSubtitle: string;
  continueBtn: string;
  themeToggle: string;
  language: string;

  // Header Nav
  navMealGen: string;
  navPhotoSearch: string;
  navDietPlan: string;
  navPremium: string;
  navProfile: string;
  navSaved: string;
  navHelp: string;
  navFeedback: string;

  // Hero
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDietBanner: string;

  // Meal Generator (Free)
  mealGenTitle: string;
  mealGenSubtitle: string;
  mealGenFried: string;
  mealGenBoiled: string;
  mealGenSoup: string;
  mealGenShuffleBtn: string;
  mealGenViewRecipe: string;
  mealGenPrepTime: string;
  mealGenDifficulty: string;
  mealGenIngredients: string;
  mealGenInstructions: string;
  mealGenChefTip: string;
  mealGenClose: string;
  mealGenNoPhotoTitle: string;
  mealGenNoPhotoSubtitle: string;
  mealGenGenerateBtn: string;
  mealGenHideList: string;
  diffEasy: string;
  diffMedium: string;
  diffChef: string;

  // Photo Recipe Search
  photoSearchTitle: string;
  photoSearchSubtitle: string;
  photoFreeBadge: string;
  photoUploadOrSnap: string;
  photoDragText: string;
  photoUploadBtn: string;
  photoCameraBtn: string;
  photoPresetsTitle: string;
  photoAnalyzeBtn: string;
  photoAnalyzing: string;
  photoClear: string;
  photoCalorieLockTitle: string;
  photoCalorieLockDesc: string;
  photoCalorieUnlockBtn: string;
  photoIngredientsFound: string;
  photoRecipeInstructions: string;

  // Premium Section & Modal ($5/mo)
  premiumTitle: string;
  premiumSubtitle: string;
  premiumPrice: string;
  premiumBadge: string;
  premiumActiveBadge: string;
  premiumFeature1: string;
  premiumFeature1Desc: string;
  premiumFeature2: string;
  premiumFeature2Desc: string;
  premiumFeature3: string;
  premiumFeature3Desc: string;
  premiumFeature4: string;
  premiumFeature4Desc: string;
  premiumFeature5: string;
  premiumFeature5Desc: string;
  premiumSubscribeBtn: string;
  premiumTestUnlockBtn: string;
  premiumDeactivateBtn: string;
  premiumStatusActive: string;
  premiumIncluded: string;

  // Diet Plan & Sports
  dietPlanTitle: string;
  dietPlanSubtitle: string;
  dietAge: string;
  dietGender: string;
  dietFemale: string;
  dietMale: string;
  dietHeight: string;
  dietWeight: string;
  dietGoal: string;
  dietGoalLoss: string;
  dietGoalGain: string;
  dietGoalMaintain: string;
  dietSportsQuestion: string;
  dietSportsSubtitle: string;
  dietSportsDays: string;
  dietSportsDaysUnit: string;
  dietSportsHours: string;
  dietSportsHoursUnit: string;
  dietTargetCalories: string;
  dietTdee: string;
  dietBmr: string;
  dietWater: string;
  dietProtein: string;
  dietFats: string;
  dietCarbs: string;
  dietGenerateBtn: string;
  dietGenerating: string;

  // Common
  loading: string;
  error: string;
  close: string;
  save: string;
  saved: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  ka: {
    appName: 'მიკვებე',
    appTagline: 'თქვენი პერსონალური AI დიეტოლოგი & შეფი',
    languageSelectTitle: 'კეთილი იყოს თქვენი მობრძანება „მიკვებეში“!',
    languageSelectSubtitle: 'გთხოვთ, აირჩიოთ სასურველი ენა აპლიკაციის გასაგრძელებლად:',
    continueBtn: 'გაგრძელება',
    themeToggle: 'თემის გადართვა',
    language: 'ენა',

    navMealGen: 'კერძების გენერატორი',
    navPhotoSearch: 'ფოტოთი ძებნა',
    navDietPlan: '1-თვიანი დიეტა',
    navPremium: 'VIP & პრემიუმი',
    navProfile: 'პროფილი',
    navSaved: 'შენახული',
    navHelp: 'დახმარება',
    navFeedback: 'უკუკავშირი',

    heroBadge: 'უფასო კულინარიული & დიეტოლოგიური პლატფორმა',
    heroTitle: 'რა მოვამზადოთ დღეს?',
    heroSubtitle: 'მიიღეთ უფასოდ 2 შემწვარი, 2 მოხარშული და 2 წვნიანი კერძი, ან ატვირთეთ ფოტო და იპოვეთ რეცეპტები მომენტალურად!',
    heroDietBanner: 'პერსონალური 1-თვიანი კვების გეგმა და სპორტული კალორიების დათვლა',

    mealGenTitle: 'კერძების უფასო გენერატორი',
    mealGenSubtitle: 'სისტემა ერთდროულად გთავაზობთ 2 შემწვარ, 2 მოხარშულ და 2 წვნიან კერძს. დააჭირეთ „სხვას“ და მყისიერად მიიღეთ ახალი იდეები!',
    mealGenFried: '2 შემწვარი კერძი',
    mealGenBoiled: '2 მოხარშული კერძი',
    mealGenSoup: '2 წვნიანი კერძი',
    mealGenShuffleBtn: 'სხვა (ახალი კერძები)',
    mealGenViewRecipe: 'რეცეპტის ნახვა',
    mealGenPrepTime: 'დრო',
    mealGenDifficulty: 'სირთულე',
    mealGenIngredients: 'საჭირო ინგრედიენტები',
    mealGenInstructions: 'მომზადების წესი',
    mealGenChefTip: 'შეფის საიდუმლო რჩევა',
    mealGenClose: 'დახურვა',
    mealGenNoPhotoTitle: 'არ გაქვთ პროდუქტების ფოტო?',
    mealGenNoPhotoSubtitle: 'მოითხოვეთ კერძების იდეები მყისიერად: 2 შემწვარი, 2 მოხარშული და 2 წვნიანი კერძი (კალორიების გარეშე, რეცეპტებითა და ინგრედიენტებით).',
    mealGenGenerateBtn: 'კერძების შემოთავაზება („სხვა“)',
    mealGenHideList: 'სიის დახურვა',
    diffEasy: 'მარტივი',
    diffMedium: 'საშუალო',
    diffChef: 'შეფის დონე',

    photoSearchTitle: 'ფოტოთი რეცეპტის ძებნა',
    photoSearchSubtitle: 'გადაუღეთ ფოტო კერძს ან მაცივრის პროდუქტებს და უფასოდ გაიგეთ, რა კერძია და როგორ მომზადდეს!',
    photoFreeBadge: 'უფასო რეჟიმი (კალორიების გარეშე)',
    photoUploadOrSnap: 'ატვირთეთ ფოტო ან გადაიღეთ კამერით',
    photoDragText: 'გადმოათრიეთ სურათი აქ ან დააჭირეთ ასარჩევად',
    photoUploadBtn: 'ფაილის ატვირთვა',
    photoCameraBtn: 'კამერით გადაღება',
    photoPresetsTitle: 'ან აირჩიეთ მზა ნიმუში:',
    photoAnalyzeBtn: 'რეცეპტის პოვნა ფოტოთი',
    photoAnalyzing: 'შეფი ამოიცნობს პროდუქტებს...',
    photoClear: 'სურათის წაშლა',
    photoCalorieLockTitle: '🔒 კალორიების სრული დათვლა (პრემიუმ ფუნქცია)',
    photoCalorieLockDesc: 'უფასო რეჟიმში იღებთ სრულ რეცეპტს და ინგრედიენტებს. თეფშის კალორიების, ცილების, ცხიმებისა და ნახშირწყლების ზუსტი ანალიზისთვის გაიაქტიურეთ პრემიუმი ($5/თვეში).',
    photoCalorieUnlockBtn: 'პრემიუმის გააქტიურება',
    photoIngredientsFound: 'ამოცნობილი ინგრედიენტები',
    photoRecipeInstructions: 'მომზადების ეტაპები',

    premiumTitle: 'VIP & პრემიუმ პაკეტი',
    premiumSubtitle: 'სრული კულინარიული და კლინიკური დიეტოლოგიური პაკეტი',
    premiumPrice: 'VIP პაკეტი',
    premiumBadge: 'VIP & Premium',
    premiumActiveBadge: '💎 PREMIUM აქტიურია',
    premiumFeature1: 'ფოტოთი კალორიების სრული დათვლა',
    premiumFeature1Desc: 'მთლიანი თეფშის ან კერძის ფოტოს ანალიზი, ზუსტი კალორიები, ცილები, ცხიმები და ნახშირწყლები.',
    premiumFeature2: 'პერსონალური 1-თვიანი კვების გეგმა',
    premiumFeature2Desc: 'კლინიკური დიეტოლოგის მიერ შედგენილი ინდივიდუალური 4-კვირიანი მენიუ ზუსტი საათებით.',
    premiumFeature3: 'სპორტული აქტივობის ზუსტი გათვლა',
    premiumFeature3Desc: 'მიუთითეთ კვირაში რამდენჯერ და დღეში რამდენი საათი ვარჯიშობთ - შეფი მოარგებს კალორიებს წონის მატებისთვის ან კლებისთვის.',
    premiumFeature4: 'ჭკვიანი შეფ-ასისტენტი (Ask Chef)',
    premiumFeature4Desc: 'ულიმიტო კონსულტაცია რეცეპტებზე, ინგრედიენტების ჩანაცვლებაზე და კულინარიულ ხრიკებზე.',
    premiumFeature5: 'წყლის ბალანსის განრიგი & საყიდლების სია',
    premiumFeature5Desc: 'ჰიდრატაციის შეხსენებები და კვირეული საყიდლების ავტომატური სია კატეგორიებად.',
    premiumSubscribeBtn: 'პრემიუმის გააქტიურება',
    premiumTestUnlockBtn: 'სატესტო გააქტიურება (Instant Unlock)',
    premiumDeactivateBtn: 'პრემიუმის გამორთვა',
    premiumStatusActive: 'თქვენი პრემიუმ გამოწერა აქტიურია! ყველა ფუნქცია განბლოკილია.',
    premiumIncluded: 'პაკეტში შედის:',

    dietPlanTitle: 'პერსონალური კვების გეგმა & დიეტოლოგი',
    dietPlanSubtitle: 'შეიყვანეთ თქვენი პარამეტრები და სპორტული აქტივობა წონის ზუსტი კლების ან მატებისთვის',
    dietAge: 'ასაკი',
    dietGender: 'სქესი',
    dietFemale: 'ქალი',
    dietMale: 'კაცი',
    dietHeight: 'სიმაღლე (სმ)',
    dietWeight: 'წონა (კგ)',
    dietGoal: 'თქვენი მიზანი',
    dietGoalLoss: 'წონის კლება (დეფიციტი)',
    dietGoalGain: 'წონის მატება / კუნთი (სურპლუსი)',
    dietGoalMaintain: 'წონის შენარჩუნება',
    dietSportsQuestion: 'დადიხართ სპორტზე / ვარჯიშობთ?',
    dietSportsSubtitle: 'სისტემა ზუსტად გამოთვლის დახარჯულ ენერგიას და მოარგებს კალორიებს',
    dietSportsDays: 'კვირაში რამდენჯერ?',
    dietSportsDaysUnit: 'დღე/კვირაში',
    dietSportsHours: 'დღეში რამდენი საათი?',
    dietSportsHoursUnit: 'საათი/დღეში',
    dietTargetCalories: 'სამიზნე კალორია/დღეში',
    dietTdee: 'დღიური ხარჯი (TDEE)',
    dietBmr: 'ბაზალური მეტაბოლიზმი (BMR)',
    dietWater: 'წყლის ნორმა',
    dietProtein: 'ცილა',
    dietFats: 'ცხიმი',
    dietCarbs: 'ნახშირწყალი',
    dietGenerateBtn: '1-თვიანი გეგმის შედგენა',
    dietGenerating: 'დიეტოლოგი ადგენს თქვენს გეგმას...',

    loading: 'იტვირთება...',
    error: 'შეცდომა',
    close: 'დახურვა',
    save: 'შენახვა',
    saved: 'შენახულია',
  },

  en: {
    appName: 'Mikvebe',
    appTagline: 'Your Personal AI Dietitian & Chef',
    languageSelectTitle: 'Welcome to Mikvebe!',
    languageSelectSubtitle: 'Please choose your preferred language to continue:',
    continueBtn: 'Continue',
    themeToggle: 'Toggle Theme',
    language: 'Language',

    navMealGen: 'Meal Generator',
    navPhotoSearch: 'Photo Recipe',
    navDietPlan: '1-Month Diet',
    navPremium: 'Premium $5',
    navProfile: 'Profile',
    navSaved: 'Saved',
    navHelp: 'Help',
    navFeedback: 'Feedback',

    heroBadge: 'Free Culinary & Nutrition Platform',
    heroTitle: 'What are we cooking today?',
    heroSubtitle: 'Get 2 Fried, 2 Boiled, and 2 Soups instantly for free, or upload a photo to find matching recipes!',
    heroDietBanner: 'Personal 1-Month Diet Plan & Sports Calorie Calculations',

    mealGenTitle: 'Free Meal Generator',
    mealGenSubtitle: 'The system instantly recommends 2 Fried, 2 Boiled, and 2 Soup dishes. Click "Different" to get fresh inspirations immediately!',
    mealGenFried: '2 Fried Dishes',
    mealGenBoiled: '2 Boiled / Steamed',
    mealGenSoup: '2 Soups & Stews',
    mealGenShuffleBtn: 'Different (New Dishes)',
    mealGenViewRecipe: 'View Recipe',
    mealGenPrepTime: 'Time',
    mealGenDifficulty: 'Difficulty',
    mealGenIngredients: 'Required Ingredients',
    mealGenInstructions: 'Cooking Instructions',
    mealGenChefTip: "Chef's Pro Tip",
    mealGenClose: 'Close',
    mealGenNoPhotoTitle: "Don't have an ingredient photo?",
    mealGenNoPhotoSubtitle: 'Get meal ideas instantly: 2 fried, 2 boiled, and 2 soup dishes (no calories, recipes and ingredients only).',
    mealGenGenerateBtn: 'Suggest Dishes ("Other")',
    mealGenHideList: 'Hide List',
    diffEasy: 'Easy',
    diffMedium: 'Medium',
    diffChef: "Chef's Level",

    photoSearchTitle: 'Photo Recipe Search',
    photoSearchSubtitle: 'Snap or upload a photo of food or fridge ingredients to get cooking instructions and ingredients for free!',
    photoFreeBadge: 'Free Mode (No Calories)',
    photoUploadOrSnap: 'Upload photo or take with camera',
    photoDragText: 'Drag & drop image here or click to browse',
    photoUploadBtn: 'Upload File',
    photoCameraBtn: 'Take Photo',
    photoPresetsTitle: 'Or select a sample fridge:',
    photoAnalyzeBtn: 'Find Recipes with AI',
    photoAnalyzing: 'Chef is identifying products...',
    photoClear: 'Remove Photo',
    photoCalorieLockTitle: '🔒 Full Calorie Count (Premium Feature)',
    photoCalorieLockDesc: 'Free mode gives you full recipe steps and ingredients. For plate calories, protein, fats, and carbs analysis, activate Premium ($5/mo).',
    photoCalorieUnlockBtn: 'Unlock Premium ($5/mo)',
    photoIngredientsFound: 'Detected Ingredients',
    photoRecipeInstructions: 'Cooking Steps',

    premiumTitle: 'All-in-One Premium Package',
    premiumSubtitle: 'Only $5/month - Complete culinary intelligence and clinical dietitian plan',
    premiumPrice: '$5 / month',
    premiumBadge: 'All-in-One Premium',
    premiumActiveBadge: '💎 PREMIUM ACTIVE',
    premiumFeature1: 'Full Calorie Counting by Photo',
    premiumFeature1Desc: 'Complete plate analysis with exact calories, proteins, fats, carbs, and portion weights.',
    premiumFeature2: 'Personal 1-Month Diet Plan',
    premiumFeature2Desc: 'Personalized 4-week clinical meal plan with exact timings, recipes, and instructions.',
    premiumFeature3: 'Sports & Workout Calorie Tailoring',
    premiumFeature3Desc: 'Specify how many days/week and hours/day you exercise to calibrate calories for weight loss or muscle gain.',
    premiumFeature4: 'Unlimited AI Chef Assistant',
    premiumFeature4Desc: 'Consult with the AI Chef anytime on substitutions, wine pairings, and culinary techniques.',
    premiumFeature5: 'Smart Hydration & Shopping Lists',
    premiumFeature5Desc: 'Custom water intake reminder timeline and categorized weekly grocery checklists.',
    premiumSubscribeBtn: 'Subscribe ($5/month)',
    premiumTestUnlockBtn: 'Test Activation (Instant Unlock)',
    premiumDeactivateBtn: 'Cancel / Reset Premium',
    premiumStatusActive: 'Your Premium membership is active! All features are unlocked.',
    premiumIncluded: "What's included:",

    dietPlanTitle: 'Personal Diet Plan & Nutritionist',
    dietPlanSubtitle: 'Enter your biometric details and sports activity for targeted weight loss or healthy weight gain',
    dietAge: 'Age',
    dietGender: 'Gender',
    dietFemale: 'Female',
    dietMale: 'Male',
    dietHeight: 'Height (cm)',
    dietWeight: 'Weight (kg)',
    dietGoal: 'Primary Goal',
    dietGoalLoss: 'Weight Loss (Deficit)',
    dietGoalGain: 'Weight Gain / Muscle (Surplus)',
    dietGoalMaintain: 'Maintenance',
    dietSportsQuestion: 'Do you practice sports or workout?',
    dietSportsSubtitle: 'The system computes your exercise burn and aligns calories for optimal progress',
    dietSportsDays: 'How many times per week?',
    dietSportsDaysUnit: 'days/week',
    dietSportsHours: 'How many hours per day?',
    dietSportsHoursUnit: 'hours/day',
    dietTargetCalories: 'Target Daily Calories',
    dietTdee: 'Total Daily Expenditure (TDEE)',
    dietBmr: 'Basal Metabolic Rate (BMR)',
    dietWater: 'Daily Water Goal',
    dietProtein: 'Protein',
    dietFats: 'Fats',
    dietCarbs: 'Carbs',
    dietGenerateBtn: 'Generate 1-Month Plan',
    dietGenerating: 'Dietitian is crafting your plan...',

    loading: 'Loading...',
    error: 'Error',
    close: 'Close',
    save: 'Save',
    saved: 'Saved',
  },

  ru: {
    appName: 'Миквебе (Mikvebe)',
    appTagline: 'Ваш персональный AI диетолог и шеф-повар',
    languageSelectTitle: 'Добро пожаловать в «Миквебе»!',
    languageSelectSubtitle: 'Пожалуйста, выберите предпочитаемый язык интерфейса:',
    continueBtn: 'Продолжить',
    themeToggle: 'Переключить тему',
    language: 'Язык',

    navMealGen: 'Генератор блюд',
    navPhotoSearch: 'Поиск по фото',
    navDietPlan: 'Диета на 1 месяц',
    navPremium: 'Премиум $5',
    navProfile: 'Профиль',
    navSaved: 'Сохранено',
    navHelp: 'Помощь',
    navFeedback: 'Отзывы',

    heroBadge: 'Бесплатная кулинарная и диетологическая платформа',
    heroTitle: 'Что приготовим сегодня?',
    heroSubtitle: 'Получите бесплатно 2 жареных, 2 вареных блюда и 2 супа сразу, или загрузите фото для быстрого поиска рецептов!',
    heroDietBanner: 'Персональный план питания на 1 месяц и учет спортивной активности',

    mealGenTitle: 'Бесплатный генератор блюд',
    mealGenSubtitle: 'Система одновременно предлагает 2 жареных, 2 вареных и 2 супа. Нажмите «Другие», чтобы мгновенно получить свежие идеи!',
    mealGenFried: '2 Жареных блюда',
    mealGenBoiled: '2 Вареных / На пару',
    mealGenSoup: '2 Супа / Горячих',
    mealGenShuffleBtn: 'Другие (Новые блюда)',
    mealGenViewRecipe: 'Смотреть рецепт',
    mealGenPrepTime: 'Время',
    mealGenDifficulty: 'Сложность',
    mealGenIngredients: 'Необходимые ингредиенты',
    mealGenInstructions: 'Способ приготовления',
    mealGenChefTip: 'Совет от шефа',
    mealGenClose: 'Закрыть',
    mealGenNoPhotoTitle: 'Нет фото продуктов?',
    mealGenNoPhotoSubtitle: 'Получите идеи блюд мгновенно: 2 жареных, 2 вареных и 2 супа (без калорий, только рецепты и ингредиенты).',
    mealGenGenerateBtn: 'Предложить блюда («Другое»)',
    mealGenHideList: 'Закрыть список',
    diffEasy: 'Просто',
    diffMedium: 'Средне',
    diffChef: 'Уровень шефа',

    photoSearchTitle: 'Поиск рецепта по фото',
    photoSearchSubtitle: 'Сфотографируйте готовое блюдо или продукты в холодильнике и бесплатно узнайте, что это и как приготовить!',
    photoFreeBadge: 'Бесплатный режим (без калорий)',
    photoUploadOrSnap: 'Загрузите фото или снимите на камеру',
    photoDragText: 'Перетащите изображение сюда или нажмите для выбора',
    photoUploadBtn: 'Загрузить файл',
    photoCameraBtn: 'Снять на камеру',
    photoPresetsTitle: 'Или выберите готовый образец:',
    photoAnalyzeBtn: 'Найти рецепты с AI',
    photoAnalyzing: 'Шеф распознает продукты...',
    photoClear: 'Удалить фото',
    photoCalorieLockTitle: '🔒 Полный подсчет калорий (Премиум)',
    photoCalorieLockDesc: 'В бесплатном режиме доступны рецепт и список ингредиентов. Для детального подсчета калорий, белков, жиров и углеводов оформите Премиум ($5/мес).',
    photoCalorieUnlockBtn: 'Подключить Премиум ($5/мес)',
    photoIngredientsFound: 'Распознанные ингредиенты',
    photoRecipeInstructions: 'Шаги приготовления',

    premiumTitle: 'Премиум подписка - All-in-One Premium',
    premiumSubtitle: 'Всего $5/месяц - полный комплекс кулинарии и клинической диетологии',
    premiumPrice: '$5 / месяц',
    premiumBadge: 'All-in-One Premium',
    premiumActiveBadge: '💎 ПРЕМИУМ АКТИВЕН',
    premiumFeature1: 'Полный подсчет калорий по фото',
    premiumFeature1Desc: 'Анализ тарелки: точные калории, белки, жиры, углеводы и размер порции.',
    premiumFeature2: 'Индивидуальный план питания на 1 месяц',
    premiumFeature2Desc: '4 недели сбалансированного клинического меню с точным расписанием по часам.',
    premiumFeature3: 'Учет тренировок и спорта',
    premiumFeature3Desc: 'Укажите, сколько дней в неделю и часов в день вы занимаетесь - шеф подберет калораж для похудения или набора массы.',
    premiumFeature4: 'Неограниченный шеф-консультант (Ask Chef)',
    premiumFeature4Desc: 'Задавайте любые вопросы по замене ингредиентов, соусам и кулинарным секретам.',
    premiumFeature5: 'Контроль водного баланса и список покупок',
    premiumFeature5Desc: 'Умные напоминания о воде и удобный еженедельный список продуктов по категориям.',
    premiumSubscribeBtn: 'Оформить подписку ($5/месяц)',
    premiumTestUnlockBtn: 'Активировать тест (Instant Unlock)',
    premiumDeactivateBtn: 'Отключить Премиум',
    premiumStatusActive: 'Ваша премиум-подписка активна! Все возможности разблокированы.',
    premiumIncluded: 'В подписку входит:',

    dietPlanTitle: 'Персональный план питания и диетолог',
    dietPlanSubtitle: 'Укажите биометрические параметры и спорт для точного сброса или набора веса',
    dietAge: 'Возраст',
    dietGender: 'Пол',
    dietFemale: 'Женский',
    dietMale: 'Мужской',
    dietHeight: 'Рост (см)',
    dietWeight: 'Вес (кг)',
    dietGoal: 'Ваша цель',
    dietGoalLoss: 'Снижение веса (дефицит)',
    dietGoalGain: 'Набор веса / мышцы (профицит)',
    dietGoalMaintain: 'Поддержание формы',
    dietSportsQuestion: 'Занимаетесь спортом / фитнесом?',
    dietSportsSubtitle: 'Система рассчитает расход энергии и скорректирует суточную норму',
    dietSportsDays: 'Сколько раз в неделю?',
    dietSportsDaysUnit: 'дней/неделю',
    dietSportsHours: 'Сколько часов в день?',
    dietSportsHoursUnit: 'часов/день',
    dietTargetCalories: 'Целевые калории в день',
    dietTdee: 'Суточный расход (TDEE)',
    dietBmr: 'Базовый метаболизм (BMR)',
    dietWater: 'Норма воды',
    dietProtein: 'Белки',
    dietFats: 'Жиры',
    dietCarbs: 'Углеводы',
    dietGenerateBtn: 'Составить план на 1 месяц',
    dietGenerating: 'Диетолог составляет ваш план...',

    loading: 'Загрузка...',
    error: 'Ошибка',
    close: 'Закрыть',
    save: 'Сохранить',
    saved: 'Сохранено',
  },
};

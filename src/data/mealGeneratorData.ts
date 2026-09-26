import { Language } from '../utils/i18n';

export interface GeneratorDish {
  id: string;
  category: 'fried' | 'boiled' | 'soup';
  name: Record<Language, string>;
  description: Record<Language, string>;
  cookingTime: string;
  difficulty: 'easy' | 'medium' | 'chef';
  imageEmoji: string;
  badgeColor: string;
  ingredients: Record<Language, string[]>;
  instructions: Record<Language, string[]>;
  chefTip: Record<Language, string>;
}

export const GENERATOR_DISHES: GeneratorDish[] = [
  // --- შემწვარი (FRIED / SAUTÉED / ROASTED) ---
  {
    id: 'fried_1',
    category: 'fried',
    name: {
      ka: 'შემწვარი ორაგული ლიმონით და როზმარინით',
      en: 'Pan-Seared Salmon with Lemon & Rosemary',
      ru: 'Жареный лосось с лимоном и розмарином',
    },
    description: {
      ka: 'ხრაშუნა კანით და ნაზი, წვნიანი გულით მომზადებული ორაგულის სტეიკი.',
      en: 'Crispy skin salmon steak with tender flaky center and aromatic citrus butter.',
      ru: 'Стейк из лосося с хрустящей корочкой и ароматным цитрусовым маслом.',
    },
    cookingTime: '15-20 წთ',
    difficulty: 'easy',
    imageEmoji: '🐟',
    badgeColor: 'from-amber-500 to-orange-500',
    ingredients: {
      ka: ['ორაგულის ფილე 200გ', 'ზეითუნის ზეთი 1 ს.კ.', 'ლიმონის წვენი', 'ახალი როზმარინი', 'მარილი & შავი პილპილი'],
      en: ['Salmon fillet 200g', 'Olive oil 1 tbsp', 'Lemon juice', 'Fresh rosemary', 'Salt & black pepper'],
      ru: ['Филе лосося 200г', 'Оливковое масло 1 ст.л.', 'Лимонный сок', 'Свежий розмарин', 'Соль и черный перец'],
    },
    instructions: {
      ka: [
        'ორაგულის კანი კარგად გაამშრალეთ ქაღალდის ხელსახოცით და მოაყარეთ მარილი.',
        'ტაფა კარგად გააცხელეთ ზეთით, მოათავსეთ ორაგული კანით ქვევით 4 წუთით.',
        'გადააბრუნეთ, დაუმატეთ როზმარინი, ლიმონი და კიდევ 3-4 წუთი შეწვით.',
      ],
      en: [
        'Pat salmon skin completely dry and season with salt and pepper.',
        'Heat skillet with olive oil over medium-high, place salmon skin-side down for 4 mins.',
        'Flip over, add rosemary sprig and lemon juice, sear for another 3-4 mins.',
      ],
      ru: [
        'Обсушите кожу лосося салфеткой и приправьте солью и перцем.',
        'Разогрейте сковороду с маслом, положите рыбу кожей вниз на 4 минуты.',
        'Переверните, добавьте веточку розмарина и лимонный сок, готовьте еще 3-4 минуты.',
      ],
    },
    chefTip: {
      ka: 'თევზი ტაფაზე არ ამოძრაოთ სანამ კანი თავისით არ მოსცილდება ზედაპირს - ეს გარანტირებულ ხრაშუნს მოგცემთ!',
      en: 'Do not move the fish until the skin naturally releases from the pan for ultimate crispiness!',
      ru: 'Не двигайте рыбу, пока кожица сама не отойдет от сковороды для идеальной корочки!',
    },
  },
  {
    id: 'fried_2',
    category: 'fried',
    name: {
      ka: 'ქათმის მკერდი ხრაშუნა ბოსტნეულით (Wok/ტაფა)',
      en: 'Pan-Fried Chicken Breast with Sautéed Veggies',
      ru: 'Куриная грудка с обжаренными овощами',
    },
    description: {
      ka: 'დიეტური, ცილებით მდიდარი სწრაფი სადილი ნივრითა და წიწაკით.',
      en: 'Lean, protein-packed fast skillet with bell peppers, garlic, and greens.',
      ru: 'Легкий белковый обед с болгарским перцем, чесноком и зеленью.',
    },
    cookingTime: '20 წთ',
    difficulty: 'easy',
    imageEmoji: '🍗',
    badgeColor: 'from-amber-600 to-amber-700',
    ingredients: {
      ka: ['ქათმის ფილე 250გ', 'ბულგარული წიწაკა 1ც', 'ყაბაყი 1ც', 'ნიორი 2 კბილი', 'სოიოს სოუსი 1 ჩ.კ.'],
      en: ['Chicken fillet 250g', 'Bell pepper 1pc', 'Zucchini 1pc', 'Garlic 2 cloves', 'Soy sauce 1 tsp'],
      ru: ['Куриное филе 250г', 'Болгарский перец 1 шт', 'Кабачок 1 шт', 'Чеснок 2 зубчика', 'Соевый соус 1 ч.л.'],
    },
    instructions: {
      ka: [
        'ქათამი დაჭერით თხელ ზოლებად, ბოსტნეული კი მოგრძო ნაჭრებად.',
        'ცხელ ტაფაზე შეწვით ქათამი 5 წუთი, სანამ ოქროსფერი არ გახდება.',
        'დაუმატეთ ბოსტნეული, ნიორი და შეწვით კიდევ 4-5 წუთი მაღალ ცეცხლზე.',
      ],
      en: [
        'Slice chicken into thin strips and vegetables into bite-sized pieces.',
        'Sear chicken in a hot pan for 5 minutes until golden.',
        'Toss in veggies and minced garlic, stir-fry on high heat for 4-5 minutes.',
      ],
      ru: [
        'Нарежьте курицу тонкими полосками, а овощи соломкой.',
        'Обжарьте курицу на сильном огне 5 минут до золотистого цвета.',
        'Добавьте овощи и чеснок, обжаривайте на сильном огне еще 4-5 минут.',
      ],
    },
    chefTip: {
      ka: 'ბოსტნეული არ ჩაშუშოთ - მაღალ ცეცხლზე სწრაფი შეწვა მათ ხრაშუნა სტრუქტურას და ვიტამინებს უნარჩუნებს.',
      en: 'Keep the heat high so the vegetables stay crunchy and retain their vitamins.',
      ru: 'Готовьте на сильном огне, чтобы овощи оставались сочными и хрустящими.',
    },
  },
  {
    id: 'fried_3',
    category: 'fried',
    name: {
      ka: 'შემწვარი ბადრიჯანი ნიგვზითა და ბროწეულით',
      en: 'Pan-Fried Eggplant Rolls with Walnut Paste',
      ru: 'Жареные баклажаны с ореховой начинкой',
    },
    description: {
      ka: 'ქართული სუფრის კლასიკა - ნაზად შეწვილი ბადრიჯნის ფირფიტები სურნელოვანი ნიგვზით.',
      en: 'Golden pan-fried eggplant ribbons rolled around traditional spiced Georgian walnut sauce.',
      ru: 'Классические рулетики из баклажанов с пряной ореховой пастой и зернами граната.',
    },
    cookingTime: '25 წთ',
    difficulty: 'medium',
    imageEmoji: '🍆',
    badgeColor: 'from-purple-600 to-indigo-600',
    ingredients: {
      ka: ['ბადრიჯანი 2ც', 'გატარებული ნიგოზი 100გ', 'ნიორი 2 კბილი', 'უცხო სუნელი & ქინძი', 'ბროწეულის მარცვლები'],
      en: ['Eggplants 2pcs', 'Ground walnuts 100g', 'Garlic 2 cloves', 'Blue fenugreek & coriander', 'Pomegranate seeds'],
      ru: ['Баклажаны 2 шт', 'Молотые грецкие орехи 100г', 'Чеснок 2 зубчика', 'Уцхо-сунели и кинза', 'Зерна граната'],
    },
    instructions: {
      ka: [
        'ბადრიჯანი დაჭერით სიგრძეზე თხელ ფირფიტებად, მოაყარეთ მარილი და 10 წუთში შეამშრალეთ.',
        'შეწვით ტაფაზე ორივე მხრიდან ოქროსფერ შეფერილობამდე.',
        'ნიგოზს შეურიეთ ნიორი, სუნელები, ცოტა წყალი და წაუსვით შემწვარ ფირფიტებს.',
      ],
      en: [
        'Slice eggplants lengthwise into thin ribbons, salt and pat dry after 10 mins.',
        'Pan-fry ribbons on medium heat until tender and golden brown.',
        'Mix walnuts with garlic, herbs and a dash of water, spread and roll gently.',
      ],
      ru: [
        'Нарежьте баклажаны вдоль тонкими полосками, посолите и обсушите.',
        'Обжарьте с двух сторон до золотистого цвета.',
        'Смешайте орехи с чесноком, специями и водой, смажьте полоски и заверните.',
      ],
    },
    chefTip: {
      ka: 'ბადრიჯნის შეწვისას გამოიყენეთ მცირე ზეთი და ტეფლონის ტაფა, რომ ზედმეტად არ შეიწოვოს ცხიმი.',
      en: 'Use a non-stick pan and brush lightly with oil to prevent the eggplant from soaking up excess fat.',
      ru: 'Используйте антипригарную сковороду и смазывайте ее маслом кисточкой, чтобы не было лишнего жира.',
    },
  },
  {
    id: 'fried_4',
    category: 'fried',
    name: {
      ka: 'შემწვარი ხბოს მედალიონები ტყემლის სოუსით',
      en: 'Pan-Seared Veal Medallions with Tkemali',
      ru: 'Медальоны из телятины с ткемали',
    },
    description: {
      ka: 'ნაზი ხბოს ხორცი, შეწვილი კარაქში და მორთული მჟავე ტყემლით.',
      en: 'Tender pan-seared veal cutlets served with zesty Georgian wild plum sauce.',
      ru: 'Нежнейшая телятина, обжаренная на сливочном масле, с домашним ткемали.',
    },
    cookingTime: '20 წთ',
    difficulty: 'chef',
    imageEmoji: '🥩',
    badgeColor: 'from-rose-600 to-amber-700',
    ingredients: {
      ka: ['ხბოს სუკი 250გ', 'კარაქი 20გ', 'ტყემალი 2 ს.კ.', 'ქონდარი', 'მარილი & პილპილი'],
      en: ['Veal tenderloin 250g', 'Butter 20g', 'Tkemali plum sauce 2 tbsp', 'Summer savory', 'Salt & pepper'],
      ru: ['Телячья вырезка 250г', 'Сливочное масло 20г', 'Соус ткемали 2 ст.л.', 'Чабер', 'Соль и перец'],
    },
    instructions: {
      ka: [
        'ხორცი დაჭერით 2 სმ სისქის ნაჭრებად, შეაზავეთ მარილითა და ქონდრით.',
        'ძალიან ცხელ ტაფაზე შეწვით კარაქში თითო მხარეს 2.5 წუთი.',
        'გადმოდგით, დაასვენეთ 3 წუთი და მიირთვით ტყემალთან ერთად.',
      ],
      en: [
        'Cut veal into 2cm thick medallions and season with savory, salt and pepper.',
        'Sear in hot butter for 2.5 minutes per side for medium tenderness.',
        'Rest for 3 minutes before slicing and drizzling with tkemali.',
      ],
      ru: [
        'Нарежьте телятину медальонами толщиной 2 см, приправьте специями.',
        'Обжарьте на сливочном масле по 2.5 минуты с каждой стороны.',
        'Дайте мясу отдохнуть 3 минуты и подавайте с соусом ткемали.',
      ],
    },
    chefTip: {
      ka: 'ხორცი შეწვის შემდეგ აუცილებლად დაასვენეთ ფოლგის ქვეშ - წვენი შიგნით გადანაწილდება და საოცრად წვნიანი დარჩება.',
      en: 'Always let meat rest for 3 minutes after searing to ensure all juices remain inside!',
      ru: 'Всегда давайте мясу отдохнуть после обжарки, чтобы сохранить все соки внутри!',
    },
  },

  // --- მოხარშული (BOILED / STEAMED / POACHED) ---
  {
    id: 'boiled_1',
    category: 'boiled',
    name: {
      ka: 'მოხარშული საქონლის ხორცი მწვანილებით და ნივრით',
      en: 'Tender Boiled Beef with Fresh Herbs & Garlic',
      ru: 'Отварная говядина со свежей зеленью и чесноком',
    },
    description: {
      ka: 'ნაზი, პირში დნობადი მოხარშული ხორცი მდიდარი ნატურალური ბულიონით.',
      en: 'Slow-simmered melt-in-mouth beef brisket infused with bay leaf, herbs, and garlic.',
      ru: 'Нежная отварная говядина, тающая во рту, с бульоном и пряными травами.',
    },
    cookingTime: '50-60 წთ',
    difficulty: 'easy',
    imageEmoji: '🥩',
    badgeColor: 'from-emerald-600 to-teal-600',
    ingredients: {
      ka: ['საქონლის რბილი ხორცი 300გ', 'დაფნის ფოთოლი 2ც', 'ხახვი 1ც', 'ახალი ოხრახუში/ქინძი', 'ნიორი 3 კბილი'],
      en: ['Beef brisket 300g', 'Bay leaf 2pcs', 'Onion 1pc', 'Fresh parsley/coriander', 'Garlic 3 cloves'],
      ru: ['Мякоть говядины 300г', 'Лавровый лист 2 шт', 'Лук 1 шт', 'Свежая зелень', 'Чеснок 3 зубчика'],
    },
    instructions: {
      ka: [
        'ხორცი მოათავსეთ მდუღარე წყალში, მოქაფეთ და დაუმატეთ მთლიანი ხახვი და დაფნა.',
        'ადუღეთ დაბალ ცეცხლზე დარბილებამდე (დაახლ. 50 წთ).',
        'ამოიღეთ, დაჭერით თხელ ნაჭრებად და მოაყარეთ დანაყილი ნიორი და მწვანილი.',
      ],
      en: [
        'Place beef into boiling water, skim the foam, add whole onion and bay leaves.',
        'Simmer on gentle heat until fork-tender (approx. 50 mins).',
        'Slice thinly and dress with crushed garlic and fresh chopped herbs.',
      ],
      ru: [
        'Положите мясо в кипящую воду, снимите пену, добавьте луковицу и лавровый лист.',
        'Варите на медленном огне до мягкости (около 50 минут).',
        'Нарежьте ломтиками и посыпьте чесноком и рубленой зеленью.',
      ],
    },
    chefTip: {
      ka: 'თუ ხორცს მდუღარე წყალში ჩაუშვებთ, წვენი შიგნით ჩაიკეტება და ხორცი საოცრად წვნიანი გამოვა!',
      en: 'Always plunge beef into actively boiling water to seal the juices inside.',
      ru: 'Опускайте мясо именно в кипящую воду, чтобы сохранить все соки внутри куска.',
    },
  },
  {
    id: 'boiled_2',
    category: 'boiled',
    name: {
      ka: 'ორთქლზე მოხარშული ორაგული ბროკოლით',
      en: 'Steamed Salmon with Tender Broccoli & Lemon',
      ru: 'Лосось на пару с брокколи и лимоном',
    },
    description: {
      ka: 'იდეალური დიეტური კერძი ომეგა-3-ით და ნულოვანი ზედმეტი ცხიმით.',
      en: 'Ultra-healthy steamed salmon steak paired with crisp-tender broccoli florets.',
      ru: 'Идеальное диетическое блюдо, богатое омега-3, с нежной брокколи.',
    },
    cookingTime: '15 წთ',
    difficulty: 'easy',
    imageEmoji: '🥦',
    badgeColor: 'from-green-600 to-emerald-700',
    ingredients: {
      ka: ['ორაგულის ფილე 200გ', 'ბროკოლი 150გ', 'ლიმონი', 'ზღვის მარილი', 'თეთრი პილპილი'],
      en: ['Salmon fillet 200g', 'Broccoli 150g', 'Lemon', 'Sea salt', 'White pepper'],
      ru: ['Филе лосося 200г', 'Брокколи 150г', 'Лимон', 'Морская соль', 'Белый перец'],
    },
    instructions: {
      ka: [
        'ორთქლსახარშში ან ქვაბის საწურზე მოათავსეთ ორაგულის ნაჭერი.',
        'გარშემო შემოუწყვეთ ბროკოლის ყვავილები და ლიმონის თხელი რგოლები.',
        'ორთქლზე ხარშეთ თავდახურული 10-12 წუთი.',
      ],
      en: [
        'Place salmon fillet in a steamer basket over simmering water.',
        'Surround with fresh broccoli florets and lemon wheels.',
        'Cover and steam gently for 10-12 minutes until salmon is flaky.',
      ],
      ru: [
        'Положите филе лосося в пароварку над кипящей водой.',
        'Рядом разложите соцветия брокколи и дольки лимона.',
        'Накройте крышкой и готовьте на пару 10-12 минут.',
      ],
    },
    chefTip: {
      ka: 'ბროკოლის მომზადებისთანავე გადაავლეთ ყინულიანი წყალი - შეინარჩუნებს ხასხასა მწვანე ფერს.',
      en: 'Rinse broccoli with iced water immediately after steaming to preserve the bright green color.',
      ru: 'Окуните брокколи в холодную воду после варки, чтобы сохранить яркий зеленый цвет.',
    },
  },
  {
    id: 'boiled_3',
    category: 'boiled',
    name: {
      ka: 'მოხარშული ინდაურის ფილე წიწიბურითა და ისპანახით',
      en: 'Boiled Turkey Breast with Buckwheat & Spinach',
      ru: 'Отварное филе индейки с гречкой и шпинатом',
    },
    description: {
      ka: 'სუფთა სპორტული კვება: მაღალი ცილა, ნელი ნახშირწყლები და რკინა.',
      en: 'Optimal athlete fuel: clean lean protein, complex buckwheat carbs, and iron-rich spinach.',
      ru: 'Чистый фитнес-обед: максимум белка, полезные углеводы и железо.',
    },
    cookingTime: '25 წთ',
    difficulty: 'easy',
    imageEmoji: '🦃',
    badgeColor: 'from-teal-600 to-cyan-700',
    ingredients: {
      ka: ['ინდაურის ფილე 200გ', 'წიწიბურა 80გ', 'ისპანახი 100გ', 'ზეითუნის ზეთი 1 ჩ.კ.', 'მარილი'],
      en: ['Turkey breast 200g', 'Buckwheat 80g', 'Baby spinach 100g', 'Olive oil 1 tsp', 'Salt'],
      ru: ['Филе индейки 200г', 'Гречка 80г', 'Шпинат 100г', 'Оливковое масло 1 ч.л.', 'Соль'],
    },
    instructions: {
      ka: [
        'ინდაურის ფილე მოხარშეთ მარილიან წყალში 20 წუთით.',
        'პარალელურად მოხარშეთ წიწიბურა (1:2 პროპორციით წყალთან).',
        'ისპანახი ჩაშუშეთ 1 წუთი ორთქლზე და შეურიეთ მზა კერძს.',
      ],
      en: [
        'Simmer turkey breast in lightly salted water for 20 minutes.',
        'Cook buckwheat in 1:2 water ratio until tender and fluffy.',
        'Wilt fresh spinach for 1 minute and combine together on a plate.',
      ],
      ru: [
        'Отварите филе индейки в подсоленной воде 20 минут.',
        'Параллельно сварите рассыпчатую гречку.',
        'Припустите шпинат 1 минуту и выложите все на тарелку.',
      ],
    },
    chefTip: {
      ka: 'ინდაურის ბულიონს ნუ გადაღვრით - მასშივე მოხარშული წიწიბურა ორმაგად გემრიელი ხდება!',
      en: 'Do not discard the turkey broth - cook the buckwheat directly in it for rich flavor!',
      ru: 'Сварите гречку прямо в бульоне от индейки - получится в два раза вкуснее!',
    },
  },
  {
    id: 'boiled_4',
    category: 'boiled',
    name: {
      ka: 'მოხარშული კვერცხი ავოკადოსა და კიტრის სალათით',
      en: 'Poached/Soft-Boiled Eggs with Avocado Cucumber Salad',
      ru: 'Отварные яйца с салатом из авокадо и огурца',
    },
    description: {
      ka: 'სრულყოფილი ენერგეტიკული საუზმე ან მსუბუქი სადილი ჯანსაღი ცხიმებით.',
      en: 'Creamy soft-boiled eggs atop fresh diced avocado, crisp cucumbers, and seeds.',
      ru: 'Яйца всмятку со свежим авокадо, огурцами и тыквенными семечками.',
    },
    cookingTime: '10 წთ',
    difficulty: 'easy',
    imageEmoji: '🥚',
    badgeColor: 'from-amber-500 to-yellow-600',
    ingredients: {
      ka: ['კვერცხი 2ც', 'მწიფე ავოკადო 1/2', 'კიტრი 1ც', 'გოგრის თესლი 1 ჩ.კ.', 'ლიმონის წვენი'],
      en: ['Eggs 2pcs', 'Ripe avocado 1/2', 'Cucumber 1pc', 'Pumpkin seeds 1 tsp', 'Lemon juice'],
      ru: ['Яйца 2 шт', 'Спелое авокадо 1/2', 'Огурец 1 шт', 'Тыквенные семечки 1 ч.л.', 'Лимонный сок'],
    },
    instructions: {
      ka: [
        'კვერცხი ჩაუშვით მდუღარე წყალში და ხარშეთ ზუსტად 6.5 წუთი რბილი გულისთვის.',
        'ავოკადო და კიტრი დაჭერით კუბიკებად, მოასხით ლიმონი და მარილი.',
        'გაფცქვენით კვერცხი, გაჭერით შუაზე და დაალაგეთ სალათზე.',
      ],
      en: [
        'Lower eggs into boiling water and cook for exactly 6.5 minutes for jammy yolks.',
        'Dice avocado and cucumber, season with lemon juice and salt.',
        'Peel eggs, slice in half, place over the fresh salad and sprinkle seeds.',
      ],
      ru: [
        'Опустите яйца в кипящую воду и варите ровно 6.5 минут для жидкого желтка.',
        'Нарежьте авокадо и огурец кубиками, заправьте соком лимона.',
        'Очистите яйца, разрежьте пополам и выложите на салат.',
      ],
    },
    chefTip: {
      ka: 'ხარშვის შემდეგ კვერცხი 2 წუთით ჩადეთ ყინულიან წყალში - ნაჭუჭი უმარტივესად მოსცილდება.',
      en: 'Ice bath immediately for 2 mins to make peeling effortless!',
      ru: 'Опустите яйца в ледяную воду сразу после варки - скорлупа снимется идеально.',
    },
  },

  // --- წვნიანი (SOUPS / STEWS) ---
  {
    id: 'soup_1',
    category: 'soup',
    name: {
      ka: 'ქათმის ტრადიციული ჩიხირთმა',
      en: 'Traditional Georgian Chicken Chikhirtma',
      ru: 'Традиционная грузинская чихиртма из курицы',
    },
    description: {
      ka: 'მდიდარი, ხავერდოვანი ბულიონი კვერცხით, ძმრითა და ქინძით - სხეულის ნამდვილი ელექსირი.',
      en: 'Velvety, herb-infused Georgian chicken soup tempered with eggs and a touch of vinegar.',
      ru: 'Бархатистый, согревающий суп с курицей, яйцом, кинзой и легкой кислинкой.',
    },
    cookingTime: '35 წთ',
    difficulty: 'medium',
    imageEmoji: '🥣',
    badgeColor: 'from-amber-600 to-yellow-700',
    ingredients: {
      ka: ['ქათმის ხორცი 300გ', 'ხახვი 2ც', 'ფქვილი 1 ს.კ.', 'კვერცხის გული 2ც', 'თეთრი ძმარი 1 ს.კ.', 'ქინძი'],
      en: ['Chicken 300g', 'Onions 2pcs', 'Flour 1 tbsp', 'Egg yolks 2pcs', 'White vinegar 1 tbsp', 'Coriander'],
      ru: ['Курица 300г', 'Лук 2 шт', 'Мука 1 ст.л.', 'Яичные желтки 2 шт', 'Уксус 1 ст.л.', 'Кинза'],
    },
    instructions: {
      ka: [
        'ქათამი მოხარშეთ, ამოიღეთ და დაჩილეთ; ბულიონი გადაწურეთ.',
        'ხახვი მოშუშეთ კარაქში ფქვილთან ერთად და დაასხით ცხელი ბულიონი.',
        'კვერცხის გულები ათქვიფეთ ძმართან და ცოტა ბულიონთან ერთად, ნელ-ნელა შეურიეთ წვნიანს.',
      ],
      en: [
        'Simmer chicken, shred the meat, and strain the golden broth.',
        'Sauté onions in butter with flour, then gradually whisk in the hot broth.',
        'Beat egg yolks with vinegar and ladlefuls of warm broth, then gently stir back into the soup.',
      ],
      ru: [
        'Сварите курицу, разберите на кусочки, процедите бульон.',
        'Спассеруйте лук с мукой и добавьте горячий бульон.',
        'Взбейте желтки с уксусом и половником теплого бульона, введите тонкой струйкой.',
      ],
    },
    chefTip: {
      ka: 'კვერცხის ჩასხმისას წვნიანი აღარ უნდა ადუღდეს, თორემ აიჭრება - ცეცხლი გამორთული უნდა იყოს.',
      en: 'Turn off the heat before stirring in egg temper so the yolks stay silky without curdling.',
      ru: 'Выключите огонь перед добавлением желтков, чтобы суп остался гладким и не свернулся.',
    },
  },
  {
    id: 'soup_2',
    category: 'soup',
    name: {
      ka: 'სოკოს არომატული კრემ-სუპი',
      en: 'Creamy Wild Mushroom Soup with Thyme',
      ru: 'Ароматный грибной крем-суп с тимьяном',
    },
    description: {
      ka: 'ხავერდოვანი, ღრმა ტყის არომატით გაჯერებული სოკოს წვნიანი.',
      en: 'Rich, earthy sautéed mushrooms blended into a smooth velvety soup with fresh thyme.',
      ru: 'Бархатистый крем-суп из шампиньонов и лесных грибов со сливками.',
    },
    cookingTime: '25 წთ',
    difficulty: 'easy',
    imageEmoji: '🍄',
    badgeColor: 'from-stone-600 to-amber-800',
    ingredients: {
      ka: ['სოკო (ქამა/ხის) 300გ', 'კარტოფილი 1ც', 'ხახვი 1ც', 'ნაღები (ან მცენარეული რძე) 100მლ', 'ბეგქონდარა'],
      en: ['Mushrooms 300g', 'Potato 1pc', 'Onion 1pc', 'Light cream 100ml', 'Fresh thyme'],
      ru: ['Грибы 300г', 'Картофель 1 шт', 'Лук 1 шт', 'Сливки 100мл', 'Тимьян'],
    },
    instructions: {
      ka: [
        'სოკო და ხახვი მოშუშეთ კარაქში 7 წუთით, სანამ არ გაოქროსფერდება.',
        'დაუმატეთ დაჭრილი კარტოფილი, წყალი ან ბულიონი და ხარშეთ 15 წუთი.',
        'დააბლენდერეთ ერთგვაროვან მასამდე, დაუმატეთ ნაღები და მიიყვანეთ ადუღებამდე.',
      ],
      en: [
        'Sauté mushrooms and onions in butter until deeply browned.',
        'Add diced potatoes and vegetable stock, simmer for 15 mins until tender.',
        'Puree with an immersion blender, pour in cream, and heat through with thyme.',
      ],
      ru: [
        'Обжарьте грибы с луком до золотистого цвета.',
        'Добавьте картофель и бульон, варите 15 минут до мягкости.',
        'Пюрируйте блендером, влейте сливки и прогрейте с тимьяном.',
      ],
    },
    chefTip: {
      ka: 'რამდენიმე ლამაზი სოკოს ფირფიტა ცალკე შეწვით ხრაშუნად და სუფრასთან გატანისას ზემოდან დაადეთ!',
      en: 'Sear a few mushroom slices separately until crispy to garnish the top before serving!',
      ru: 'Обжарьте несколько красивых ломтиков грибов отдельно для эффектной подачи!',
    },
  },
  {
    id: 'soup_3',
    category: 'soup',
    name: {
      ka: 'წითელი ოსპის მარგებელი წვნიანი პიტნით',
      en: 'Red Lentil Detox Soup with Mint & Lemon',
      ru: 'Чечевичный суп с мятой и лимоном',
    },
    description: {
      ka: 'ბოჭკოთი და მცენარეული ცილით სავსე, მსუბუქი და საოცრად გემრიელი წვნიანი.',
      en: 'Nourishing Turkish/Mediterranean style red lentil soup with warm cumin and fresh mint.',
      ru: 'Легкий и сытный суп из красной чечевицы с кумином, мятой и лимоном.',
    },
    cookingTime: '20 წთ',
    difficulty: 'easy',
    imageEmoji: '🥣',
    badgeColor: 'from-orange-600 to-amber-700',
    ingredients: {
      ka: ['წითელი ოსპი 150გ', 'სტაფილო 1ც', 'ხახვი 1ც', 'კუმინი 1/2 ჩ.კ.', 'მშრალი პიტნა', 'ლიმონი'],
      en: ['Red lentils 150g', 'Carrot 1pc', 'Onion 1pc', 'Ground cumin 1/2 tsp', 'Dried mint', 'Lemon'],
      ru: ['Красная чечевица 150г', 'Морковь 1 шт', 'Лук 1 шт', 'Кумин 1/2 ч.л.', 'Сушеная мята', 'Лимон'],
    },
    instructions: {
      ka: [
        'ქვაბში მოშუშეთ ხახვი და სტაფილო ზეითუნის ზეთში.',
        'დაუმატეთ გარეცხილი წითელი ოსპი, დაასხით 800მლ მდუღარე წყალი და ხარშეთ 15 წუთი.',
        'დააბლენდერეთ, შეაზავეთ კუმინით, პიტნით და მიირთვით ლიმონის წვენით.',
      ],
      en: [
        'Sauté diced onion and carrot in olive oil until sweet and softened.',
        'Add rinsed red lentils, pour 800ml boiling water, and boil for 15 minutes.',
        'Puree smooth, season with cumin, crushed mint, and serve with fresh lemon wedges.',
      ],
      ru: [
        'Спассеруйте лук и морковь на оливковом масле.',
        'Добавьте промытую чечевицу, залейте 800мл воды и варите 15 минут.',
        'Взбейте блендером, добавьте мяту, кумин и подавайте с долькой лимона.',
      ],
    },
    chefTip: {
      ka: 'წითელი ოსპი წინასწარ ჩალბობას არ საჭიროებს და 15 წუთში სრულად იხარშება!',
      en: 'Red lentils do not need pre-soaking and cook completely tender in just 15 minutes!',
      ru: 'Красная чечевица не требует замачивания и готова всего за 15 минут!',
    },
  },
  {
    id: 'soup_4',
    category: 'soup',
    name: {
      ka: 'ტრადიციული ქართული ხარჩო საქონლის ხორცით',
      en: 'Authentic Georgian Beef Kharcho Soup',
      ru: 'Настоящее грузинское харчо с говядиной',
    },
    description: {
      ka: 'ცხარე, მჟავე, ნივრითა და უცხო სუნელით გაჯერებული განთქმული ქართული წვნიანი.',
      en: 'Robust, spiced Georgian beef soup with rice, sour plum puree, garlic, and fresh herbs.',
      ru: 'Пряный, наваристый суп с говядиной, рисом, ткемали, чесноком и зеленью.',
    },
    cookingTime: '55 წთ',
    difficulty: 'chef',
    imageEmoji: '🍲',
    badgeColor: 'from-red-600 to-amber-800',
    ingredients: {
      ka: ['საქონლის ხორცი 300გ', 'მრგვალი ბრინჯი 60გ', 'ტყემალი/ტომატი 2 ს.კ.', 'ხახვი 2ც', 'უცხო სუნელი & ქინძი', 'ნიორი 3 კბილი'],
      en: ['Beef chuck 300g', 'Round rice 60g', 'Tkemali or tomato paste 2 tbsp', 'Onions 2pcs', 'Blue fenugreek & coriander', 'Garlic 3 cloves'],
      ru: ['Говядина 300г', 'Круглый рис 60г', 'Ткемали или томат 2 ст.л.', 'Лук 2 шт', 'Уцхо-сунели и кинза', 'Чеснок 3 зубчика'],
    },
    instructions: {
      ka: [
        'საქონლის ხორცი მოხარშეთ წყალში დარბილებამდე, ბულიონი გადაწურეთ.',
        'დაუმატეთ გარეცხილი ბრინჯი და მოშუშული ხახვი ტომატთან ერთად.',
        'ბოლოს შეურიეთ ტყემალი, დანაყილი ნიორი, სუნელები და ახალი ქინძი.',
      ],
      en: [
        'Boil beef chunks until succulent and tender, strain the rich broth.',
        'Add rinsed rice and sautéed onions with tomato puree into the simmering soup.',
        'Finish with tart plum sauce, crushed garlic, spices, and a handful of fresh cilantro.',
      ],
      ru: [
        'Отварите говядину до мягкости, процедите наваристый бульон.',
        'Добавьте рис и пассерованный лук с томатом.',
        'В конце добавьте ткемали, чеснок, специи и щедрую горсть свежей кинзы.',
      ],
    },
    chefTip: {
      ka: 'ხარჩოს საიდუმლო ნამდვილ ტყემალში და ნივრის ბოლოს დამატებაშია - ასე არომატი არ იკარგება.',
      en: 'Add garlic at the very end off the heat to preserve its bold aromatic punch!',
      ru: 'Добавляйте чеснок в самом конце, сняв с огня, чтобы сохранить яркий аромат!',
    },
  },
];

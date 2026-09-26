import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const CANDIDATE_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-3-flash-preview',
  'gemini-flash-latest',
  'gemini-3.8-flash',
  'gemini-3.1-flash-lite',
];

async function generateWithFallbackAndRetry(params: {
  contents: any;
  config?: any;
}) {
  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[AI Chef] Calling Gemini model: ${model} (attempt ${attempt})`);
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });

        if (response && response.text) {
          return response;
        }
      } catch (err: any) {
        lastError = err;
        const msg = err?.message || String(err);
        console.warn(`[AI Chef] Error with model ${model} (attempt ${attempt}):`, msg);

        const isTransient =
          msg.includes('503') ||
          msg.includes('UNAVAILABLE') ||
          msg.includes('high demand') ||
          msg.includes('429') ||
          msg.includes('RESOURCE_EXHAUSTED');

        if (isTransient && attempt === 1) {
          // Wait 800ms before retrying the same model
          await new Promise((r) => setTimeout(r, 800));
          continue;
        }

        // Try next candidate model
        break;
      }
    }
  }

  throw lastError || new Error('მოდელი დროებით მიუწვდომელია');
}

function parseJsonClean(rawText: string) {
  let text = rawText.trim();
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
  }
  return JSON.parse(text);
}

// Endpoint: Analyze image & generate 6 recipes in Georgian (strictly 2 fried, 2 boiled, 2 soup)
app.post('/api/chef/analyze-and-cook', async (req, res) => {
  try {
    const { image, presetId, preferences, excludeTitles = [], knownIngredients = [] } = req.body;

    let mimeType = 'image/jpeg';
    let base64Data = '';

    if (presetId) {
      // Map presetId to server image file if provided
      const presetFiles: Record<string, string> = {
        classic: 'fridge_ingredients_classic_1790179563875.jpg',
        healthy: 'healthy_greens_produce_1790179577562.jpg',
        dinner: 'dinner_chicken_veggies_1790179589351.jpg',
      };
      const fileName = presetFiles[presetId];
      if (fileName) {
        const filePath = path.join(__dirname, 'src', 'assets', 'images', fileName);
        if (fs.existsSync(filePath)) {
          const buffer = fs.readFileSync(filePath);
          base64Data = buffer.toString('base64');
          mimeType = 'image/jpeg';
        }
      }
    }

    if (!base64Data && image) {
      if (typeof image === 'string' && image.startsWith('data:')) {
        const match = image.match(/^data:([^;]+);base64,(.+)$/);
        if (match) {
          mimeType = match[1];
          base64Data = match[2];
        } else {
          base64Data = image.replace(/^data:[^;]+;base64,/, '');
        }
      } else {
        base64Data = image;
      }
    }

    if (!base64Data) {
      return res.status(400).json({ error: 'გთხოვთ ატვირთოთ ფოტო ან აირჩიოთ წინასწარ გამზადებული პროდუქტები.' });
    }

    const dietary = preferences?.dietary || 'ყველაფერი';
    const mealType = preferences?.mealType || 'ნებისმიერი';
    const servings = preferences?.servings || 2;
    const additionalIngredients = preferences?.additionalIngredients || [];
    const excludedIngredients = preferences?.excludedIngredients || [];
    const extraNote = preferences?.extraNote || '';

    const knownListStr = Array.isArray(knownIngredients) && knownIngredients.length > 0
      ? knownIngredients
          .map((item: any) => (typeof item === 'string' ? item : item.name))
          .filter(Boolean)
          .join(', ')
      : '';

    const isRegeneration = Array.isArray(excludeTitles) && excludeTitles.length > 0;

    const systemInstruction = `შენ ხარ გამოცდილი, შემოქმედებითი და გულისხმიერი ქართველი შეფ-მზარეული (Executive Chef).
შენი მისიაა:
1. ყურადღებით შეხედო მოწოდებულ სურათს და ზუსტად ამოიცნო მასზე არსებული ყველა საკვები პროდუქტი და ინგრედიენტი (ბოსტნეული, ხორცი, რძის პროდუქტები, მწვანილი, სანელებლები, ხილი და ა.შ.).
2. შეადგინო ზუსტად 6 მრავალფეროვანი, უგემრიელესი და რეალისტური რეცეპტი მკაცრად შემდეგი განაწილებით:
   - ზუსტად 2 კერძი: „შემწვარი“ (ტაფაზე შემწვარი, ღუმელში გამომცხვარი ან დაბრაწული)
   - ზუსტად 2 კერძი: „მოხარშული“ (მოხარშული, ორთქლზე დამზადებული ან პოშირებული)
   - ზუსტად 2 კერძი: „წვნიანი“ (სუპი, წვნიანი ბულიონი, ჩაშუშული სოუსით)
   (სულ: ზუსტად 6 რეცეპტი: 2 შემწვარი, 2 მოხარშული, 2 წვნიანი).
3. თითოეულ რეცეპტს ზუსტად მიუთითე cookingMethod: აუცილებლად „შემწვარი“, „მოხარშული“ ან „წვნიანი“ (2 შემწვარი, 2 მოხარშული, 2 წვნიანი).
4. თითოეულ რეცეპტს მიუთითე servings: ${servings} (ზუსტად იმდენ ადამიანზე, რამდენიც მოთხოვნილია) და ინგრედიენტების ზუსტი რაოდენობები (გრამები, ცალი, მლ) გათვალე სწორედ ამ ${servings} ადამიანის ულუფაზე.
5. თითოეულ კერძზე გამოთვალე calorieBreakdown (პრემიუმ მომხმარებლებისთვის):
   - totalDishCalories: მთლიანი მომზადებული კერძის სრული კალორია (ყველა პორციის ჯამი, მთელი რიცხვი, მაგ: 650)
   - caloriesPerServing: ერთი პორციის კალორია (მაგ: 325)
   - items: ინგრედიენტების დეტალური ჩამონათვალი მათი კალორიებით (მაგ: კვერცხი 140 კკალ, კარაქი 120 კკალ, პომიდორი 35 კკალ, მწვანილი 10 კკალ და ა.შ.)
   - macros: ცილა, ნახშირწყლები, ცხიმები
6. პასუხი დაწერე სრულად ქართულ ენაზე, სტრუქტურულად, გასაგებად და დახვეწილად.
7. გაითვალისწინე, რომ სახლში ტიპურად მოიპოვება საბაზისო სანელებლები (წყალი, მარილი, პილპილი, ზეთი, კარაქი, შაქარი). ყველა სხვა ძირითადი ინგრედიენტი უნდა ეყრდნობოდეს ფოტოს ან მომხმარებლის მიერ დამატებულ ინგრედიენტებს.
8. მკაცრად დაიცავი მომხმარებლის კვების რეჟიმი (${dietary}):
   ${dietary === 'ვეგეტარიანული' ? '- კატეგორიულად არ გამოიყენო ხორცი, ქათამი, თევზი ან ზღვის პროდუქტები! მხოლოდ მცენარეული/რძის/კვერცხის ინგრედიენტები.' : ''}
   ${dietary === 'სამარხვო' ? '- კატეგორიულად არ გამოიყენო ცხოველური პროდუქტები (არც ხორცი, არც თევზი, არც რძის პროდუქტი, არც კარაქი, არც კვერცხი)! მხოლოდ მცენარეული სამარხვო ინგრედიენტები.' : ''}
   ${dietary === 'დაბალკალორიული' ? '- შეარჩიე დაბალკალორიული, მსუბუქი, უცხიმო და ჯანსაღი რეცეპტები.' : ''}
   ${dietary === 'სწრაფი 20 წთ' ? '- თითოეული კერძის მომზადება უნდა ეტეოდეს მაქსიმუმ 20 წუთში.' : ''}
${mealType !== 'ნებისმიერი' ? `9. კერძის ტიპი: ყველა შემოთავაზებული კერძი უნდა იყოს მორგებული ტიპზე: „${mealType}“.` : ''}`;

    const userPrompt = `გთხოვ, დეტალურად შეისწავლო ეს ფოტო.
მომხმარებლის პრეფერენციები:
- კვების რეჟიმი / შეზღუდვა: ${dietary}
- კერძის ტიპი: ${mealType}
- პორციის რაოდენობა: ${servings} პერსონაზე
${additionalIngredients.length > 0 ? `- დამატებით ხელმისაწვდომი ინგრედიენტები: ${additionalIngredients.join(', ')}` : ''}
${excludedIngredients.length > 0 ? `- არ გამოიყენო ეს ინგრედიენტები: ${excludedIngredients.join(', ')}` : ''}
${extraNote ? `- დამატებითი სურვილი: ${extraNote}` : ''}
${knownListStr ? `\n- ამავე ატვირთული ფოტოდან უკვე ამოცნობილია შემდეგი ინგრედიენტები: ${knownListStr}.\nკატეგორიული მოთხოვნა: შეინარჩუნე ეს ინგრედიენტები და ზუსტად ამ ფოტოსა და ამავე ინგრედიენტებზე დაყრდნობით შეადგინე სრულიად ახალი 6 კერძი (ზუსტად 2 შემწვარი, 2 მოხარშული, 2 წვნიანი)!` : ''}
${isRegeneration ? `\n\nმნიშვნელოვანი წესი: მომხმარებელმა დააჭირა ღილაკს „სხვა“! მომხმარებელმა უკვე ნახა ეს კერძები და სურს სრულიად ახალი იდეები:
უკვე ნანახი კერძები (კატეგორიულად არ გაიმეორო არცერთი მათგანი!): ${excludeTitles.join(', ')}.
დააგენერირე სრულიად ახალი, განსხვავებული 6 კერძი ზუსტად ამავე ფოტოსა და ამავე ინგრედიენტებიდან!` : ''}

გამოიცანი/დაადასტურე ფოტოზე არსებული პროდუქტები და შემოგვთავაზე ზუსტად 6 ${isRegeneration ? 'სრულიად ახალი და განსხვავებული' : ''} გემრიელი რეცეპტი მკაცრად შემდეგი განაწილებით: ზუსტად 2 „შემწვარი“, 2 „მოხარშული“ და 2 „წვნიანი“ კერძი (სულ 6 კერძი), თითოეულის მომზადების წესითა და ინგრედიენტებით.`;

    const response = await generateWithFallbackAndRetry({
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
          {
            text: userPrompt,
          },
        ],
      },
      config: {
        systemInstruction,
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedIngredients: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: 'ინგრედიენტის სახელი ქართულად' },
                  category: {
                    type: Type.STRING,
                    description: 'კატეგორია (ბოსტნეული, ხორცი/თევზი, რძის პროდუქტი, მწვანილი/სანელებელი, მარცვლეული, ხილი, სხვა)',
                  },
                  confidence: { type: Type.STRING, description: 'მაღალი ან საშუალო' },
                  estimatedQuantity: { type: Type.STRING, description: 'სავარაუდო რაოდენობა თუ ჩანს' },
                },
                required: ['name', 'category', 'confidence'],
              },
            },
            chefCommentary: {
              type: Type.STRING,
              description: 'შეფის გულთბილი მისალმება და მოკლე კომენტარი ამ ინგრედიენტების პოტენციალზე',
            },
            recipes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING, description: 'კერძის მადისაღმძვრელი სათაური ქართულად' },
                  subtitle: { type: Type.STRING, description: 'მოკლე დევიზი ან ქვესათაური' },
                  summary: { type: Type.STRING, description: 'შეფის აღწერა და შეფასება' },
                  prepTime: { type: Type.STRING, description: 'მომზადების დრო (მაგ: 10 წუთი)' },
                  cookTime: { type: Type.STRING, description: 'ხარშვის/შეწვის დრო (მაგ: 20 წუთი)' },
                  totalTime: { type: Type.STRING, description: 'სრული დრო (მაგ: 30 წუთი)' },
                  difficulty: { type: Type.STRING, description: 'ძალიან მარტივი, მარტივი, ან საშუალო' },
                  servings: { type: Type.INTEGER, description: 'პორციების რაოდენობა' },
                  caloriesEstimate: { type: Type.STRING, description: 'სავარაუდო კალორიულობა პორციაზე (მაგ: ~350 კკალ)' },
                  tags: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'თეგები (მაგ: სწრაფი, ჯანსაღი, ტაფაზე, ვეგეტარიანული და ა.შ.)',
                  },
                  primaryIngredients: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        amount: { type: Type.STRING },
                        note: { type: Type.STRING },
                      },
                      required: ['name', 'amount'],
                    },
                  },
                  pantryItems: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        amount: { type: Type.STRING },
                      },
                      required: ['name', 'amount'],
                    },
                  },
                  steps: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        stepNumber: { type: Type.INTEGER },
                        title: { type: Type.STRING },
                        instruction: { type: Type.STRING },
                        tip: { type: Type.STRING },
                        durationMinutes: { type: Type.INTEGER },
                      },
                      required: ['stepNumber', 'title', 'instruction'],
                    },
                  },
                  chefSecret: { type: Type.STRING, description: 'შეფის საიდუმლო რჩევა ამ კერძისთვის' },
                  wineOrDrinkPairing: { type: Type.STRING, description: 'რეკომენდებული ღვინო ან გამაგრილებელი სასმელი' },
                  nutritionHighlights: { type: Type.STRING, description: 'ჯანმრთელობისა და ენერგიის მოკლე შეფასება' },
                  cookingMethod: {
                    type: Type.STRING,
                    description: 'მომზადების ტიპი: აუცილებლად ერთ-ერთი: "წვნიანი", "შემწვარი", ან "მოხარშული"',
                  },
                  calorieBreakdown: {
                    type: Type.OBJECT,
                    description: 'კალორიების სრული და დეტალური დაშლა ინგრედიენტების მიხედვით',
                    properties: {
                      totalDishCalories: {
                        type: Type.INTEGER,
                        description: 'მთლიანი მომზადებული კერძის სრული კალორია (მთელი რიცხვი, მაგ: 650)',
                      },
                      caloriesPerServing: {
                        type: Type.INTEGER,
                        description: 'ერთი პორციის კალორია (მთელი რიცხვი, მაგ: 325)',
                      },
                      items: {
                        type: Type.ARRAY,
                        description: 'თითოეული ინგრედიენტის კალორიულობა',
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            name: { type: Type.STRING, description: 'ინგრედიენტი' },
                            amount: { type: Type.STRING, description: 'რაოდენობა' },
                            calories: { type: Type.INTEGER, description: 'კალორია (რიცხვი)' },
                          },
                          required: ['name', 'amount', 'calories'],
                        },
                      },
                      macros: {
                        type: Type.OBJECT,
                        properties: {
                          protein: { type: Type.STRING, description: 'ცილა (მაგ: 25გ)' },
                          carbs: { type: Type.STRING, description: 'ნახშირწყლები (მაგ: 35გ)' },
                          fat: { type: Type.STRING, description: 'ცხიმები (მაგ: 18გ)' },
                        },
                      },
                    },
                    required: ['totalDishCalories', 'caloriesPerServing', 'items'],
                  },
                },
                required: [
                  'id',
                  'title',
                  'subtitle',
                  'summary',
                  'cookingMethod',
                  'prepTime',
                  'cookTime',
                  'totalTime',
                  'difficulty',
                  'servings',
                  'caloriesEstimate',
                  'tags',
                  'primaryIngredients',
                  'pantryItems',
                  'steps',
                  'chefSecret',
                  'wineOrDrinkPairing',
                  'nutritionHighlights',
                ],
              },
            },
          },
          required: ['detectedIngredients', 'chefCommentary', 'recipes'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('მოდელმა ცარიელი პასუხი დააბრუნა');
    }

    const data = parseJsonClean(text);

    // Merge / preserve knownIngredients if provided so verified photo ingredients are never lost
    if (Array.isArray(knownIngredients) && knownIngredients.length > 0) {
      if (!Array.isArray(data.detectedIngredients)) {
        data.detectedIngredients = [];
      }
      const existingNames = new Set(
        data.detectedIngredients.map((i: any) => (i?.name || '').trim().toLowerCase())
      );
      knownIngredients.forEach((known: any) => {
        const name = typeof known === 'string' ? known : known?.name;
        if (name && !existingNames.has(name.trim().toLowerCase())) {
          data.detectedIngredients.push(
            typeof known === 'object' && known !== null
              ? known
              : { name, category: 'სხვა', confidence: 'მაღალი' }
          );
          existingNames.add(name.trim().toLowerCase());
        }
      });
    }

    if (Array.isArray(data.recipes)) {
      // Normalize cookingMethod strings based on title, summary, and method
      data.recipes.forEach((rec: any) => {
        const methodStr = `${rec.cookingMethod || ''} ${rec.title || ''} ${rec.summary || ''}`.toLowerCase();
        if (
          methodStr.includes('შემწვ') ||
          methodStr.includes('ტაფა') ||
          methodStr.includes('ღუმელ') ||
          methodStr.includes('დაბრაწ') ||
          methodStr.includes('გამომცხვ')
        ) {
          rec.cookingMethod = 'შემწვარი';
        } else if (
          methodStr.includes('წვნიან') ||
          methodStr.includes('სუპ') ||
          methodStr.includes('ბულიონ') ||
          methodStr.includes('ჩაშუშ') ||
          methodStr.includes('ბორშ') ||
          methodStr.includes('შაკშუკ')
        ) {
          rec.cookingMethod = 'წვნიანი';
        } else if (
          methodStr.includes('მოხარშ') ||
          methodStr.includes('ორთქლ') ||
          methodStr.includes('პოშირ') ||
          methodStr.includes('სალათ') ||
          methodStr.includes('მდუღარე')
        ) {
          rec.cookingMethod = 'მოხარშული';
        }
      });

      // Strictly ensure exact 2 fried, 2 boiled, 2 soup allocation
      if (data.recipes.length === 6) {
        const counts: Record<'შემწვარი' | 'მოხარშული' | 'წვნიანი', number> = {
          'შემწვარი': 0,
          'მოხარშული': 0,
          'წვნიანი': 0,
        };

        // First pass: keep up to 2 for each method
        const assigned: Array<'შემწვარი' | 'მოხარშული' | 'წვნიანი' | null> = [null, null, null, null, null, null];
        data.recipes.forEach((rec: any, idx: number) => {
          const m = rec.cookingMethod as 'შემწვარი' | 'მოხარშული' | 'წვნიანი';
          if ((m === 'შემწვარი' || m === 'მოხარშული' || m === 'წვნიანი') && counts[m] < 2) {
            counts[m]++;
            assigned[idx] = m;
          }
        });

        // Determine which methods still need quota to reach exactly 2 each
        const remainingNeeded: ('შემწვარი' | 'მოხარშული' | 'წვნიანი')[] = [];
        (['შემწვარი', 'მოხარშული', 'წვნიანი'] as const).forEach((m) => {
          while (counts[m] < 2) {
            remainingNeeded.push(m);
            counts[m]++;
          }
        });

        // Fill remaining unassigned slots
        data.recipes.forEach((rec: any, idx: number) => {
          if (!assigned[idx]) {
            const assignedMethod = remainingNeeded.shift() || 'შემწვარი';
            rec.cookingMethod = assignedMethod;
          } else {
            rec.cookingMethod = assigned[idx];
          }
        });
      }
    }

    return res.json(data);
  } catch (error: any) {
    console.error('Error analyzing image and cooking:', error);
    const msg = error?.message || '';
    const userFriendlyMsg =
      msg.includes('503') || msg.includes('high demand') || msg.includes('UNAVAILABLE')
        ? 'AI მოდელი დროებით გადატვირთულია მაღალი მოთხოვნის გამო. გთხოვთ სცადოთ კიდევ ერთხელ (ღილაკზე დაჭერით).'
        : (error?.message || 'შეცდომა რეცეპტების გენერირებისას. გთხოვთ სცადოთ თავიდან.');

    return res.status(500).json({
      error: userFriendlyMsg,
    });
  }
});

// Endpoint: Ask Chef a question about cooking, ingredient replacement, or technique
app.post('/api/chef/ask', async (req, res) => {
  try {
    const { question, recipeContext, currentIngredients } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'კითხვა აუცილებელია' });
    }

    const systemInstruction = `შენ ხარ გამოცდილი, კეთილგანწყობილი და კრეატიული შეფი. მომხმარებელი გეკითხება კულინარიულ რჩევას.
უპასუხე სრულად ქართულად, პროფესიონალურად, მეგობრულად და პრაქტიკულად. მიეცი კონკრეტული რჩევები და ჩანაცვლების ვარიანტები.`;

    const prompt = `კონტექსტი:
${recipeContext ? `კერძი: ${recipeContext.title}\nინგრედიენტები: ${JSON.stringify(recipeContext.ingredients || [])}` : ''}
${currentIngredients ? `ხელმისაწვდომი პროდუქტები: ${JSON.stringify(currentIngredients)}` : ''}

მომხმარებლის შეკითხვა შეფს:
"${question}"

გთხოვთ უპასუხოთ ქართულად, ამომწურავად და საინტერესოდ.`;

    const response = await generateWithFallbackAndRetry({
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({ answer: response.text });
  } catch (error: any) {
    console.error('Error asking chef:', error);
    const msg = error?.message || '';
    const userFriendlyMsg =
      msg.includes('503') || msg.includes('high demand') || msg.includes('UNAVAILABLE')
        ? 'შეფი დროებით დაკავებულია. გთხოვთ რამდენიმე წამში კვლავ დასვათ შეკითხვა.'
        : (error?.message || 'შეცდომა შეფის პასუხისას.');

    return res.status(500).json({ error: userFriendlyMsg });
  }
});

// Premium Endpoint ($5/mo All-in-One): Analyze ready plate/dish for accurate calories & macros
app.post('/api/chef/analyze-plate-calories', async (req, res) => {
  try {
    const { image, notes } = req.body;

    let mimeType = 'image/jpeg';
    let base64Data = '';

    if (image && typeof image === 'string') {
      if (image.startsWith('data:')) {
        const match = image.match(/^data:([^;]+);base64,(.+)$/);
        if (match) {
          mimeType = match[1];
          base64Data = match[2];
        } else {
          base64Data = image.replace(/^data:[^;]+;base64,/, '');
        }
      } else {
        base64Data = image;
      }
    }

    if (!base64Data) {
      return res.status(400).json({ error: 'გთხოვთ ატვირთოთ მზა კერძის ან თეფშის ფოტო.' });
    }

    const systemInstruction = `შენ ხარ უმაღლესი კატეგორიის კლინიკური დიეტოლოგი, სპორტული ნუტრიციოლოგი და შეფი.
შენი ამოცანაა:
1. ყურადღებით დააკვირდე მომზადებული კერძის ან მთლიანი თეფშის ფოტოს.
2. ზუსტად ამოიცნო თეფშზე არსებული ყველა შემადგენელი ნაწილი (ხორცი/თევზი, გარნირი, ბოსტნეული, სოუსი, პური, საკმაზი და ა.შ.).
3. შეაფასო ულუფის წონა (გრამებში) და თითოეული ინგრედიენტის ზუსტი კალორიულობა და მაკრონუტრიენტები (ცილა, ცხიმი, ნახშირწყლები).
4. გამოთვალო მთლიანი თეფშის სრული კალორია (totalCalories), ჯამური ცილა (proteinGrams), ცხიმი (fatGrams) და ნახშირწყლები (carbsGrams).
5. მიაწოდო პროფესიონალური დიეტოლოგიური შეფასება (dietitianFeedback) და სპორტსმენებისთვის/ვარჯიშისთვის მორგებული რჩევა (sportsFit).
6. პასუხი დააბრუნე ქართულ ენაზე, მკაცრად JSON ფორმატში.`;

    const userPrompt = `გთხოვთ, ზუსტად დათვალოთ ამ თეფშზე/კერძში არსებული ყველა კალორია და მაკრონუტრიენტი.
${notes ? `დამატებითი მინიშნება: ${notes}` : ''}
დაშალე თითოეული პროდუქტი (რაოდენობა, კალორია, ცილა, ცხიმი, ნახშირწყალი) და შეაფასე კვებითი ღირებულება.`;

    const response = await generateWithFallbackAndRetry({
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Data,
            },
          },
          {
            text: userPrompt,
          },
        ],
      },
      config: {
        systemInstruction,
        temperature: 0.3,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dishName: { type: Type.STRING, description: 'კერძის/თეფშის დასახელება' },
            confidence: { type: Type.STRING, description: 'სიზუსტის დონე (მაღალი, საშუალო)' },
            estimatedWeightGrams: { type: Type.INTEGER, description: 'სრული ულუფის სავარაუდო წონა გრამებში' },
            totalCalories: { type: Type.INTEGER, description: 'მთლიანი თეფშის კალორია (კკალ)' },
            macros: {
              type: Type.OBJECT,
              properties: {
                proteinGrams: { type: Type.INTEGER, description: 'ცილა (გრამი)' },
                carbsGrams: { type: Type.INTEGER, description: 'ნახშირწყლები (გრამი)' },
                fatGrams: { type: Type.INTEGER, description: 'ცხიმები (გრამი)' },
              },
              required: ['proteinGrams', 'carbsGrams', 'fatGrams'],
            },
            items: {
              type: Type.ARRAY,
              description: 'თეფშზე არსებული თითოეული პროდუქტი',
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: 'პროდუქტის სახელი' },
                  portion: { type: Type.STRING, description: 'სავარაუდო ულუფა (მაგ: 150გ)' },
                  calories: { type: Type.INTEGER, description: 'კალორია' },
                  protein: { type: Type.STRING, description: 'ცილა (მაგ: 25გ)' },
                  fat: { type: Type.STRING, description: 'ცხიმი (მაგ: 12გ)' },
                  carbs: { type: Type.STRING, description: 'ნახშირწყალი (მაგ: 30გ)' },
                },
                required: ['name', 'portion', 'calories', 'protein', 'fat', 'carbs'],
              },
            },
            healthScore: { type: Type.INTEGER, description: 'ჯანმრთელობის ინდექსი 1-100' },
            dietitianFeedback: { type: Type.STRING, description: 'დიეტოლოგის პროფესიული შეფასება' },
            sportsFit: { type: Type.STRING, description: 'რეკომენდაცია სპორტსმენებისთვის (წონის კლება/მატება/ვარჯიში)' },
          },
          required: [
            'dishName',
            'confidence',
            'estimatedWeightGrams',
            'totalCalories',
            'macros',
            'items',
            'healthScore',
            'dietitianFeedback',
            'sportsFit',
          ],
        },
      },
    });

    const parsed = parseJsonClean(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error analyzing plate calories:', error);
    return res.status(500).json({
      error: error?.message || 'კალორიების ანალიზისას დაფიქსირდა შეცდომა. გთხოვთ სცადოთ თავიდან.',
    });
  }
});

// 4-Week Clinical Dietitian & Personal Chef Plan Endpoint
app.post('/api/chef/generate-diet-plan', async (req, res) => {
  try {
    const { target, preferences = {} } = req.body;
    if (!target || !target.age || !target.heightCm || !target.weightKg) {
      return res.status(400).json({ error: 'გთხოვთ მიუთითოთ ყველა ფიზიკური პარამეტრი' });
    }

    const systemInstruction = `შენ ხარ უმაღლესი კატეგორიის პროფესიონალი კლინიკური დიეტოლოგი, ნუტრიციოლოგი და პერსონალური შეფი.
შენი ამოცანაა, მომხმარებლის ფიზიკური მონაცემების მიხედვით შეადგინო სრული, დეტალური, მაქსიმალურად ზუსტი და დაბალანსებული კვების გეგმა ქართულ ენაზე.

მკაცრი წესები და სტანდარტები:
1. **ზუსტი საათები (timeSlot):** თითოეულ კერძს (საუზმე, წახემსება, სადილი, ვახშამი) აუცილებლად მიუწერე მიღების ზუსტი საათი (მაგ: საუზმე: "09:00", წახემსება: "12:00", სადილი: "15:00", ვახშამი: "19:00").
2. **სრული და ამოწურვადი შესაძენი სია (Shopping List):**
   - აბსოლუტურად ყველა ინგრედიენტი (თაფლი, ნიგოზი, თხილი, ზეითუნის ზეთი, კარაქი, მარილი, პილპილი, სუნელები, ლიმონი, მწვანილები, მარცვლეული, ხორცი, თევზი და ა.შ.), რომელიც კვირის რეცეპტებშია ნახსენები, სავალდებულო წესით უნდა შევიდეს შესაძენი პროდუქტების სიაში!
   - არცერთი ინგრედიენტი არ გამოგრჩეს!
   - რაოდენობები მიუთითე მკაფიოდ და ზუსტად (მაგ: "ნიგოზი - 250 გრ", "თაფლი - 1 ქილა (300 გრ)", "ზეითუნის ზეთი - 500 მლ", "ქათმის ფილე - 1.2 კგ", "შვრია - 800 გრ", "კვერცხი - 18 ცალი").
   - დააჯგუფე ლოგიკურ კატეგორიებად: „ხორცი და თევზი“, „რძის პროდუქტები & კვერცხი“, „ბოსტნეული & მწვანილი“, „ხილი & კენკრა“, „თხილეული & თაფლი“, „მარცვლეული & ბურღულეული“, „ზეთები & სანელებლები“.
3. **რეალისტური, მარტივი და ზუსტი:**
   - კერძები უნდა იყოს ადვილად მოსამზადებელი, ქართულ ბაზარზე იოლად ხელმისაწვდომი პროდუქტებით.
   - პორციები და კალორიები მკაცრად უნდა ჯდებოდეს გამოთვლილ დღიურ კალორაჟში.
   - ყოველგვარი აბსტრაქტული ან დაუმთავრებელი სიების გარეშე.

პასუხი აუცილებლად დააბრუნე მკაცრად JSON ფორმატში, Schema-ს შესაბამისად.`;

    const sportsInfo = target.doesSports
      ? `მომხმარებელი რეგულარულად ვარჯიშობს: კვირაში ${target.sportsDaysPerWeek || 3} დღე, დღეში ${target.sportsHoursPerDay || 1} საათი (${target.sportsType || 'ფიტნესი/ძალისმიერი/კარდიო'}). გაითვალისწინე ვარჯიშის წინა (pre-workout) და შემდგომი (post-workout) ცილოვანი კვება!`
      : 'მომხმარებელი არ ვარჯიშობს აქტიურად სპორტზე (მჯდომარე/ზომიერი დღიური აქტივობა).';

    const userPrompt = `მომხმარებლის ფიზიკური მონაცემები:
- ასაკი: ${target.age} წელი
- სქესი: ${target.gender || 'ქალი'}
- სიმაღლე: ${target.heightCm} სმ
- წონა: ${target.weightKg} კგ
- სპორტული აქტივობა: ${sportsInfo}
- მიზანი: ${target.goal} (ზუსტი მორგება წონის კლებისთვის ან მატებისთვის!)
- გამოთვლილი დღიური კალორაჟი: ${target.targetDailyCalories} კკალ
- მიზნობრივი მაკრონუტრიენტები: ცილები ~${target.macros?.proteinGrams}გ (${target.macros?.proteinPercent}%), ცხიმები ~${target.macros?.fatGrams}გ (${target.macros?.fatPercent}%), ნახშირწყლები ~${target.macros?.carbsGrams}გ (${target.macros?.carbsPercent}%)
- რეკომენდებული წყლის რაოდენობა: ${target.dailyWaterLiters} ლიტრი/დღეში
- დამატებითი შეზღუდვები/სურვილები: ${preferences.notes || 'არ არის'}

შეადგინე სრული, დეტალური 4-კვირიანი კლინიკური კვების გეგმა.
ყოველი კვირა (კვირა 1, კვირა 2, კვირა 3, კვირა 4) უნდა შეიცავდეს 7 დღეს (ორშაბათი, სამშაბათი, ოთხშაბათი, ხუთშაბათი, პარასკევი, შაბათი, კვირა) თითოეულისთვის 4 კვებით:
- საუზმე (timeSlot: "09:00" ან მსგავსი)
- წახემსება (timeSlot: "12:00" ან მსგავსი)
- სადილი (timeSlot: "15:00" ან მსგავსი)
- ვახშამი (timeSlot: "19:00" ან მსგავსი)
თითოეულს დაურთე მომზადების ინსტრუქცია და ზუსტი ინგრედიენტები გრამებში.

განსაკუთრებული ყურადღება მიაქციე Shopping List-ს: სიაში აუცილებლად შეიტანე აბსოლუტურად ყველა პროდუქტი (თაფლი, ნიგოზი, ზეთი, კარაქი, სანელებლები, მწვანილი და ა.შ.) ზუსტი რაოდენობებით!`;

    const mealSchema = {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        timeSlot: { type: Type.STRING, description: 'კერძის მიღების საათი, მაგ: 09:00, 12:00, 15:00, 19:00' },
        calories: { type: Type.INTEGER },
        protein: { type: Type.STRING },
        fat: { type: Type.STRING },
        carbs: { type: Type.STRING },
        portion: { type: Type.STRING },
        ingredients: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              amount: { type: Type.STRING },
            },
            required: ['name', 'amount'],
          },
        },
        instructions: { type: Type.STRING },
        cookingTimeMinutes: { type: Type.INTEGER },
        prepTip: { type: Type.STRING },
      },
      required: ['name', 'timeSlot', 'calories', 'protein', 'fat', 'carbs', 'ingredients', 'instructions'],
    };

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        dietitianIntro: { type: Type.STRING },
        weeks: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              weekNumber: { type: Type.INTEGER },
              weekTitle: { type: Type.STRING },
              weekObjective: { type: Type.STRING },
              days: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    dayNumber: { type: Type.INTEGER },
                    dayName: { type: Type.STRING },
                    focusNote: { type: Type.STRING },
                    totalDayCalories: { type: Type.INTEGER },
                    breakfast: mealSchema,
                    snack: mealSchema,
                    lunch: mealSchema,
                    dinner: mealSchema,
                  },
                  required: ['dayNumber', 'dayName', 'breakfast', 'snack', 'lunch', 'dinner', 'totalDayCalories'],
                },
              },
              shoppingList: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    items: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          quantity: { type: Type.STRING },
                        },
                        required: ['name', 'quantity'],
                      },
                    },
                  },
                  required: ['category', 'items'],
                },
              },
              weeklyTips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['weekNumber', 'weekTitle', 'weekObjective', 'days', 'shoppingList', 'weeklyTips'],
          },
        },
        hydrationGuidelines: {
          type: Type.OBJECT,
          properties: {
            dailyTargetLiters: { type: Type.NUMBER },
            hourlySchedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING },
                  action: { type: Type.STRING },
                },
                required: ['time', 'action'],
              },
            },
            importantRules: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['dailyTargetLiters', 'hourlySchedule', 'importantRules'],
        },
        generalClinicalRecommendations: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
      required: ['dietitianIntro', 'weeks', 'hydrationGuidelines', 'generalClinicalRecommendations'],
    };

    console.log('[AI Dietitian] Generating 1-month comprehensive diet plan for:', target);

    const response = await generateWithFallbackAndRetry({
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema,
        temperature: 0.4,
      },
    });

    const parsedData = JSON.parse(response.text || '{}');
    const fullPlan = {
      id: `diet-plan-${Date.now()}`,
      createdAt: new Date().toISOString(),
      target,
      ...parsedData,
    };

    return res.json(fullPlan);
  } catch (error: any) {
    console.error('Error generating diet plan:', error);
    const msg = error?.message || '';
    const userFriendlyMsg =
      msg.includes('503') || msg.includes('high demand') || msg.includes('UNAVAILABLE')
        ? 'დიეტოლოგი დროებით დაკავებულია. გთხოვთ რამდენიმე წამში სცადოთ ხელახლა.'
        : (error?.message || 'შეცდომა კვების გეგმის გენერირებისას.');

    return res.status(500).json({ error: userFriendlyMsg });
  }
});

// In-memory feedback store (stores recent submissions for reliability and backup)
interface StoredFeedback {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  rating: number | string;
  timestamp: string;
  deliveredTo: string[];
}
const recentFeedbackStore: StoredFeedback[] = [];

// Feedback & Contact Form Endpoint
app.post('/api/feedback', async (req, res) => {
  try {
    const { name, email, subject, message, rating, customFormspreeId } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        error: 'გთხოვთ შეავსოთ სავალდებულო ველები: სახელი, ელ.ფოსტა და შეტყობინება',
      });
    }

    const targetEmail = process.env.FEEDBACK_TARGET_EMAIL || 'iliajanadze999@gmail.com';
    const formspreeId = (customFormspreeId || process.env.FORMSPREE_ID || '').toString().trim();
    const timestamp = new Date().toISOString();
    const formattedDate = new Date().toLocaleString('ka-GE', { timeZone: 'Asia/Tbilisi' });

    console.log(`[Mikvebe Feedback] From: ${name} <${email}>, Subject: ${subject || 'უკუკავშირი'}, Rating: ${rating || 'N/A'}`);
    console.log(`[Mikvebe Feedback Body]:\n${message}`);

    const deliveredTo: string[] = [];
    let needsActivation = false;
    let activationMessage = '';

    // Determine host / referer for email forwarder
    const originHeader = (req.headers.origin as string) ||
      (req.headers.referer as string) ||
      process.env.APP_URL ||
      'https://ais-dev-7elnec6uua37ymbojkuien-185139964716.europe-west2.run.app';

    // 1. Forward via FormSubmit (Direct to target email without API keys)
    try {
      const formSubmitRes = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Referer': originHeader,
          'Origin': originHeader,
        },
        body: JSON.stringify({
          'სახელი (Name)': name,
          'ელ.ფოსტა (Email)': email,
          'შეფასება (Rating)': `${rating || 5} / 5 ⭐`,
          'თემა (Subject)': subject || 'მიკვებე - მომხმარებლის შეტყობინება',
          'შეტყობინება (Message)': message,
          'გაგზავნის დრო (Time)': formattedDate,
          _subject: `[მიკვებე] უკუკავშირი (${rating || 5}★) - ${name}`,
          _replyto: email,
          _template: 'table',
          _captcha: 'false',
        }),
      });

      const fsData: any = await formSubmitRes.json().catch(() => ({}));
      console.log('[Feedback] FormSubmit response:', fsData);

      if (fsData && fsData.message && fsData.message.includes('needs Activation')) {
        needsActivation = true;
        activationMessage = fsData.message;
        deliveredTo.push('FormSubmit (Pending activation email confirmation)');
      } else if (formSubmitRes.ok || fsData.success === 'true' || fsData.success === true) {
        deliveredTo.push(`FormSubmit -> ${targetEmail}`);
      }
    } catch (fsErr) {
      console.warn('[Feedback] FormSubmit forward error:', fsErr);
    }

    // 2. Forward via Formspree if Formspree ID is configured or provided
    if (formspreeId) {
      try {
        const cleanId = formspreeId.replace(/https?:\/\/formspree\.io\/f\//, '').trim();
        const fspreeRes = await fetch(`https://formspree.io/f/${cleanId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            subject: subject || 'მიკვებე - მომხმარებლის შეტყობინება',
            rating: `${rating || 5} / 5`,
            message,
            targetEmail,
            submittedAt: formattedDate,
          }),
        });

        const fspreeData = await fspreeRes.json().catch(() => ({}));
        console.log('[Feedback] Formspree response:', fspreeData);
        if (fspreeRes.ok || (fspreeData && fspreeData.ok)) {
          deliveredTo.push(`Formspree (${cleanId})`);
        }
      } catch (fspreeErr) {
        console.warn('[Feedback] Formspree forward error:', fspreeErr);
      }
    }

    // 3. Forward via Web3Forms if access key is present
    if (process.env.WEB3FORMS_ACCESS_KEY) {
      try {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: process.env.WEB3FORMS_ACCESS_KEY,
            name,
            email,
            subject: subject || `მიკვებე - უკუკავშირი: ${name}`,
            message: `სახელი: ${name}\nელ.ფოსტა: ${email}\nშეფასება: ${rating || 5}/5 ⭐\n\nშეტყობინება:\n${message}\n\nთარიღი: ${formattedDate}`,
            from_name: 'მიკვებე აპლიკაცია',
          }),
        });
        deliveredTo.push('Web3Forms');
      } catch (w3Err) {
        console.warn('[Feedback] Web3Forms forward error:', w3Err);
      }
    }

    // Always store in recent feedback memory queue
    const record: StoredFeedback = {
      id: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name,
      email,
      subject: subject || 'უკუკავშირი',
      message,
      rating: rating || 5,
      timestamp,
      deliveredTo,
    };
    recentFeedbackStore.unshift(record);
    if (recentFeedbackStore.length > 50) {
      recentFeedbackStore.pop();
    }

    return res.json({
      success: true,
      message: 'მადლობა! თქვენი შეტყობინება წარმატებით მიღებულია.',
      targetEmail,
      deliveredTo,
      needsActivation,
      activationMessage,
      receivedAt: timestamp,
    });
  } catch (err: any) {
    console.error('[Feedback] Error handling submission:', err);
    return res.status(500).json({ error: 'შეტყობინების გაგზავნა ვერ მოხერხდა' });
  }
});

// Endpoint to view recent submitted feedbacks (for testing/admin verification)
app.get('/api/feedback/recent', (_req, res) => {
  return res.json({
    total: recentFeedbackStore.length,
    targetEmail: process.env.FEEDBACK_TARGET_EMAIL || 'iliajanadze999@gmail.com',
    feedbacks: recentFeedbackStore,
  });
});


async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Chef server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

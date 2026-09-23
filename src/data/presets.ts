import classicImg from '../assets/images/fridge_ingredients_classic_1790179563875.jpg';
import healthyImg from '../assets/images/healthy_greens_produce_1790179577562.jpg';
import dinnerImg from '../assets/images/dinner_chicken_veggies_1790179589351.jpg';

export interface PresetImage {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  description: string;
  likelyIngredients: string[];
}

export const PRESET_IMAGES: PresetImage[] = [
  {
    id: 'classic',
    title: 'მაცივრის კლასიკა',
    subtitle: 'კვერცხი, პომიდორი, ყველი, მწვანილი',
    imageUrl: classicImg,
    description: 'სოფლის კვერცხი, მწიფე პომიდორი, ყველი, ხახვი, კარაქი, ნიორი და ახალი მწვანილი',
    likelyIngredients: ['კვერცხი', 'პომიდორი', 'ყველი', 'ხახვი', 'ნიორი', 'კარაქი', 'ქინძი/ოხრახუში'],
  },
  {
    id: 'healthy',
    title: 'ჯანსაღი & მწვანე',
    subtitle: 'ავოკადო, ისპანახი, კიტრი, ლიმონი',
    imageUrl: healthyImg,
    description: 'მწიფე ავოკადო, ნედლი ისპანახი, ხრაშუნა კიტრი, წვნიანი ლიმონი და ზეითუნის ზეთი',
    likelyIngredients: ['ავოკადო', 'ისპანახი', 'კიტრი', 'ლიმონი', 'ნიორი', 'ზეითუნის ზეთი'],
  },
  {
    id: 'dinner',
    title: 'გემრიელი სადილი',
    subtitle: 'ქათამი, კარტოფილი, სოკო, სტაფილო',
    imageUrl: dinnerImg,
    description: 'ნედლი ქათმის ფილე, ახალი კარტოფილი, ქამა სოკო, სტაფილო, როზმარინი და ნიორი',
    likelyIngredients: ['ქათმის ფილე', 'კარტოფილი', 'სოკო', 'სტაფილო', 'როზმარინი', 'ნიორი'],
  },
];

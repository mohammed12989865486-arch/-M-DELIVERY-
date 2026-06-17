import { MenuItem, Category } from './types';

export const CATEGORIES: Category[] = [
  { id: 'all', nameAr: 'الكل', nameEn: 'All', iconName: 'Grid' },
  { id: 'appetizers', nameAr: 'المقبلات', nameEn: 'Appetizers', iconName: 'Soup' },
  { id: 'mains', nameAr: 'الأطباق الرئيسية', nameEn: 'Main Dishes', iconName: 'Utensils' },
  { id: 'grills', nameAr: 'المشويات', nameEn: 'Grills', iconName: 'Flame' },
  { id: 'desserts', nameAr: 'الحلويات', nameEn: 'Desserts', iconName: 'Cake' },
  { id: 'drinks', nameAr: 'المشروبات', nameEn: 'Drinks', iconName: 'Coffee' }
];

export const MENU_ITEMS: MenuItem[] = [];

export const PROMO_CODES: { [code: string]: { percent: number; minOrder: number } } = {
  'MEAL10': { percent: 10, minOrder: 50 },
  'WELCOME': { percent: 15, minOrder: 100 },
  'FREE5': { percent: 5, minOrder: 0 }
};

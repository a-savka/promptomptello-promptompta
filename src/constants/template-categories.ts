export const TEMPLATE_CATEGORIES = [
    'Образование',
    'Маркетинг',
    'Разработка',
    'Аналитика',
    'Творчество'
] as const;

export type TemplateCategory = typeof TEMPLATE_CATEGORIES[number];

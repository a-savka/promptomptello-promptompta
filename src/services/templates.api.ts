import type { PromptTemplate, PromptTemplateCreateDto, PromptTemplateUpdateDto } from 'src/types/prompt-template';
import { TEMPLATE_CATEGORIES } from 'src/constants/template-categories';

const MOCK_DELAY = 500;

let templates: PromptTemplate[] = [
    {
        id: 1,
        name: 'Базовый промпт для генерации текста',
        category: TEMPLATE_CATEGORIES[0],
        promptText: 'Напиши подробный текст на тему "{topic}" объемом около {words} слов.'
    },
    {
        id: 2,
        name: 'Промпт для анализа данных',
        category: TEMPLATE_CATEGORIES[3],
        promptText: 'Проанализируй следующие данные и предоставь выводы:\n\n{data}'
    },
    {
        id: 3,
        name: 'Промпт для создания кода',
        category: TEMPLATE_CATEGORIES[2],
        promptText: 'Напиши функцию на {language}, которая выполняет {task}.'
    }
];

let nextId = 4;

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const templatesApi = {
    async list(): Promise<PromptTemplate[]> {
        await delay(MOCK_DELAY);
        return [...templates];
    },

    async getById(id: number): Promise<PromptTemplate> {
        await delay(MOCK_DELAY);
        const template = templates.find(t => t.id === id);
        if (!template) {
            throw new Error(`Template with id ${id} not found`);
        }
        return { ...template };
    },

    async create(dto: PromptTemplateCreateDto): Promise<PromptTemplate> {
        await delay(MOCK_DELAY);
        const newTemplate: PromptTemplate = {
            id: nextId++,
            ...dto
        };
        templates.push(newTemplate);
        return { ...newTemplate };
    },

    async update(id: number, dto: PromptTemplateUpdateDto): Promise<PromptTemplate> {
        await delay(MOCK_DELAY);
        const index = templates.findIndex(t => t.id === id);
        if (index === -1) {
            throw new Error(`Template with id ${id} not found`);
        }
        templates[index] = { ...templates[index], ...dto };
        return { ...templates[index] };
    },

    async delete(id: number): Promise<void> {
        await delay(MOCK_DELAY);
        const index = templates.findIndex(t => t.id === id);
        if (index === -1) {
            throw new Error(`Template with id ${id} not found`);
        }
        templates.splice(index, 1);
    },

    async search(query: string): Promise<PromptTemplate[]> {
        await delay(MOCK_DELAY);
        const q = query.toLowerCase();
        return templates.filter(t =>
            t.name.toLowerCase().includes(q) ||
            t.category.toLowerCase().includes(q) ||
            t.promptText.toLowerCase().includes(q)
        );
    },

    async suggest(query: string): Promise<PromptTemplate[]> {
        await delay(200);
        const q = query.toLowerCase();
        return templates.filter(t =>
            t.name.toLowerCase().includes(q)
        ).slice(0, 5);
    }
};

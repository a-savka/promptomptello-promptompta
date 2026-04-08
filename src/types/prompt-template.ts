export interface PromptTemplate {
    id: number;
    name: string;
    category: string;
    promptText: string;
}

export type PromptTemplateCreateDto = Omit<PromptTemplate, 'id'>;
export type PromptTemplateUpdateDto = Partial<PromptTemplateCreateDto>;

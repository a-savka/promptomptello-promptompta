import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { templatesApi } from 'src/services/templates.api';
import type { PromptTemplate, PromptTemplateCreateDto, PromptTemplateUpdateDto } from 'src/types/prompt-template';

export function useTemplatesQuery() {
    return useQuery({
        queryKey: ['templates'],
        queryFn: () => templatesApi.list()
    });
}

export function useTemplateQuery(id: number) {
    return useQuery({
        queryKey: ['templates', id],
        queryFn: () => templatesApi.getById(id),
        enabled: id > 0
    });
}

export function useCreateTemplateMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dto: PromptTemplateCreateDto) => templatesApi.create(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['templates'] });
        }
    });
}

export function useUpdateTemplateMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, dto }: { id: number; dto: PromptTemplateUpdateDto }) =>
            templatesApi.update(id, dto),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['templates'] });
            queryClient.invalidateQueries({ queryKey: ['templates', data.id] });
        }
    });
}

export function useDeleteTemplateMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => templatesApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['templates'] });
        }
    });
}

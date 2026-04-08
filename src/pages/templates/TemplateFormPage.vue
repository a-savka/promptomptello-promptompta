<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">
      {{ isEdit ? 'Редактирование шаблона' : 'Добавление шаблона' }}
    </div>

    <br />
    <br />

    <q-form @submit="onSubmit" class="q-gutter-md" style="max-width: 600px">
      <q-input
        v-model="form.name"
        label="Название"
        outlined
        :rules="[val => !!val || 'Название обязательно']"
      />

      <q-select
        v-model="form.category"
        :options="categoryOptions"
        label="Категория"
        outlined
        emit-value
        map-options
        :rules="[val => !!val || 'Категория обязательна']"
      />

      <q-input
        v-model="form.promptText"
        label="Текст промпта"
        type="textarea"
        outlined
        rows="8"
        :rules="[val => !!val || 'Текст промпта обязателен']"
      />

      <div class="row q-gutter-sm">
        <q-btn
          type="submit"
          color="primary"
          :label="isEdit ? 'Сохранить' : 'Создать'"
          :loading="isSaving"
        />
        <q-btn
          color="grey"
          label="Отмена"
          :to="{ name: 'templates' }"
        />
      </div>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { TEMPLATE_CATEGORIES } from 'src/constants/template-categories';
import { useTemplateQuery, useCreateTemplateMutation, useUpdateTemplateMutation } from 'src/services/templates.hooks';
import type { PromptTemplateUpdateDto } from 'src/types/prompt-template';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();

const templateId = computed(() => {
  const id = route.params.id;
  return id ? parseInt(id as string, 10) : null;
});

const isEdit = computed(() => templateId.value !== null);

const categoryOptions = TEMPLATE_CATEGORIES.map(cat => ({
  label: cat,
  value: cat
}));

const form = ref({
  name: '',
  category: '',
  promptText: ''
});

const { data: existingTemplate, isLoading: isLoadingTemplate } = useTemplateQuery(templateId.value || 0);

watch(existingTemplate, (template) => {
  if (template) {
    form.value = {
      name: template.name,
      category: template.category,
      promptText: template.promptText
    };
  }
}, { immediate: true });

const createMutation = useCreateTemplateMutation();
const updateMutation = useUpdateTemplateMutation();

const isSaving = computed(() => createMutation.isPending.value || updateMutation.isPending.value);

async function onSubmit() {
  if (!form.value.name || !form.value.category || !form.value.promptText) {
    return;
  }

  try {
    if (isEdit.value) {
      const dto: PromptTemplateUpdateDto = { ...form.value };
      await updateMutation.mutateAsync({ id: templateId.value!, dto });
      $q.notify({
        type: 'positive',
        message: 'Шаблон успешно обновлен'
      });
    } else {
      await createMutation.mutateAsync({ ...form.value });
      $q.notify({
        type: 'positive',
        message: 'Шаблон успешно создан'
      });
    }
    router.push({ name: 'templates' });
  } catch {
    $q.notify({
      type: 'negative',
      message: isEdit.value ? 'Ошибка при обновлении шаблона' : 'Ошибка при создании шаблона'
    });
  }
}
</script>

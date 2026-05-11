<template>
  <q-page class="q-pa-md">
    <h1 class="text-h5 q-mb-md">
      {{ isEdit ? 'Редактирование шаблона' : 'Добавление шаблона' }}
    </h1>

    <q-form @submit="onSubmit" class="q-gutter-md" style="max-width: 600px" aria-label="Форма шаблона промпта">
      <q-input
        v-model="form.name"
        label="Название"
        outlined
        aria-required="true"
        :rules="[val => !!val || 'Название обязательно']"
      />

      <q-select
        v-model="form.category"
        :options="categoryOptions"
        label="Категория"
        outlined
        emit-value
        map-options
        aria-required="true"
        :rules="[val => !!val || 'Категория обязательна']"
      />

      <div class="text-subtitle2 q-mb-sm" id="prompt-text-label">Текст промпта</div>
      <PromptEditor
        v-model="form.promptText"
        placeholder="Введите текст промпта..."
        :rows="10"
        aria-labelledby="prompt-text-label"
      />

      <div class="row q-gutter-sm">
        <q-btn
          type="submit"
          color="primary"
          :label="isEdit ? 'Сохранить' : 'Создать'"
          :loading="isSaving"
          :aria-label="isEdit ? 'Сохранить изменения шаблона' : 'Создать новый шаблон'"
        />
        <q-btn
          color="grey"
          label="Отмена"
          :aria-label="'Вернуться к списку шаблонов'"
          :to="{ name: 'templates' }"
        />
      </div>
    </q-form>

    <div
      aria-live="polite"
      aria-atomic="true"
      class="sr-only"
    >
      <template v-if="isSaving">Сохранение шаблона</template>
      <template v-else-if="isLoadingTemplate">Загрузка данных шаблона</template>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { TEMPLATE_CATEGORIES } from 'src/constants/template-categories';
import { useTemplateQuery, useCreateTemplateMutation, useUpdateTemplateMutation } from 'src/services/templates.hooks';
import type { PromptTemplateUpdateDto } from 'src/types/prompt-template';
import PromptEditor from 'src/components/PromptEditor.vue';

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
    $q.notify({
      type: 'warning',
      message: 'Заполните все поля'
    });
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

<template>
  <q-page class="q-pa-md">
    <div class="row justify-between items-center q-mb-md">
      <h1 class="text-h5 q-my-none">Шаблоны</h1>
      <q-btn
        color="primary"
        label="Добавить шаблон"
        icon="add"
        :to="{ name: 'template-new' }"
      />
    </div>

    <q-table
      :rows="templates || []"
      :columns="columns"
      row-key="id"
      :loading="isLoading"
      flat
      bordered
      aria-label="Список шаблонов промптов"
      :aria-busy="isLoading ? 'true' : undefined"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            flat
            dense
            color="primary"
            icon="edit"
            label="Редактировать"
            :aria-label="'Редактировать шаблон: ' + props.row.name"
            :to="{ name: 'template-edit', params: { id: props.row.id } }"
          />
          <q-btn
            flat
            dense
            color="negative"
            icon="delete"
            label="Удалить"
            :aria-label="'Удалить шаблон: ' + props.row.name"
            @click="confirmDelete(props.row)"
          />
        </q-td>
      </template>

      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
    </q-table>

    <div
      aria-live="polite"
      aria-atomic="true"
      class="sr-only"
    >
      <template v-if="isLoading">Загрузка шаблонов</template>
      <template v-else-if="templates?.length">
        Загружено {{ templates.length }} шаблонов
      </template>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import type { QTableColumn } from 'quasar';
import { useTemplatesQuery, useDeleteTemplateMutation } from 'src/services/templates.hooks';
import type { PromptTemplate } from 'src/types/prompt-template';

const router = useRouter();
const $q = useQuasar();

const { data: templates, isLoading } = useTemplatesQuery();
const deleteMutation = useDeleteTemplateMutation();

const columns: QTableColumn[] = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'name', label: 'Название', field: 'name', align: 'left', sortable: true },
  { name: 'category', label: 'Категория', field: 'category', align: 'left', sortable: true },
  { name: 'actions', label: 'Действия', field: 'actions', align: 'left' }
];

function confirmDelete(template: PromptTemplate) {
  $q.dialog({
    title: 'Подтверждение',
    message: `Вы действительно хотите удалить шаблон "${template.name}"?`,
    cancel: { label: 'Отмена', flat: true },
    ok: { label: 'Удалить', color: 'negative' }
  }).onOk(() => {
    deleteMutation.mutate(template.id, {
      onSuccess: () => {
        $q.notify({
          type: 'positive',
          message: 'Шаблон успешно удален'
        });
      },
      onError: () => {
        $q.notify({
          type: 'negative',
          message: 'Ошибка при удалении шаблона'
        });
      }
    });
  });
}
</script>

<template>
  <q-page class="q-pa-md">
    <div class="row justify-between items-center q-mb-md">
      <div class="text-h5">Шаблоны</div>
      <q-btn color="primary" label="Добавить" icon="add" :to="{ name: 'template-new' }" />
    </div>

    <q-table
      :rows="templates || []"
      :columns="columns"
      row-key="id"
      :loading="isLoading"
      flat
      bordered
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            flat
            dense
            color="primary"
            icon="edit"
            label="Редактировать"
            :to="{ name: 'template-edit', params: { id: props.row.id } }"
          />
          <q-btn
            flat
            dense
            color="negative"
            icon="delete"
            label="Удалить"
            @click="confirmDelete(props.row)"
          />
        </q-td>
      </template>

      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
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

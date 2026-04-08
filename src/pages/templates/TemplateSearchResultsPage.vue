<template>
  <q-page class="q-pa-md">
    <div class="row justify-between items-center q-mb-md">
      <div class="text-h5">Результаты поиска</div>
      <q-btn color="primary" label="Новый поиск" icon="search" :to="{ name: 'template-search' }" />
    </div>

    <q-input
      v-model="localQuery"
      label="Поиск"
      outlined
      dense
      class="q-mb-md"
      style="max-width: 600px"
      @keyup.enter="updateSearch"
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
      <template v-slot:append>
        <q-btn flat dense icon="search" @click="updateSearch" />
      </template>
    </q-input>

    <div v-if="isLoading" class="text-center q-pa-lg">
      <q-spinner color="primary" size="3em" />
    </div>

    <div v-else-if="results?.length === 0" class="text-center q-pa-lg">
      <q-icon name="search_off" size="64px" color="grey" />
      <div class="text-h6 q-mt-sm">Ничего не найдено</div>
      <div class="text-grey">Попробуйте изменить запрос</div>
    </div>

    <q-list v-else bordered separator>
      <q-item v-for="template in results" :key="template.id" clickable>
        <q-item-section avatar>
          <q-icon name="view_quilt" color="primary" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-weight-medium">{{ template.name }}</q-item-label>
          <q-item-label caption>{{ template.category }}</q-item-label>
          <q-item-label class="text-grey-8 q-mt-xs">{{ template.promptText }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn
            flat
            dense
            color="primary"
            icon="edit"
            label="Редактировать"
            :to="{ name: 'template-edit', params: { id: template.id } }"
          />
        </q-item-section>
      </q-item>
    </q-list>

    <div v-if="results?.length" class="text-caption text-grey q-mt-sm">
      Найдено: {{ results.length }}
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSearchTemplatesQuery } from 'src/services/templates.hooks';

const route = useRoute();
const router = useRouter();

const queryFromUrl = computed(() => (route.query.q as string) || '');

const localQuery = ref(queryFromUrl.value);

watch(() => route.query.q, (val) => {
  localQuery.value = (val as string) || '';
});

const { data: results, isLoading } = useSearchTemplatesQuery(queryFromUrl);

function updateSearch() {
  if (localQuery.value.length >= 3) {
    router.push({
      name: 'search-results',
      query: { q: localQuery.value }
    });
  }
}
</script>

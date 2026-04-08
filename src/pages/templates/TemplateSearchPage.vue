<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">Поиск шаблонов</div>

    <div style="max-width: 600px; position: relative">
      <q-input
        v-model="searchQuery"
        label="Введите запрос для поиска шаблонов"
        outlined
        dense
        @keyup.enter="performSearch"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>

        <template v-slot:append>
          <q-btn
            flat
            dense
            icon="search"
            :disable="searchQuery.length < 3"
            @click="performSearch"
          />
        </template>
      </q-input>

      <div
        v-if="showSuggestions && debouncedQuery.length >= 3"
        class="suggestions-list"
      >
        <q-inner-loading :showing="isFetching" />

        <q-list bordered>
          <q-item
            v-for="template in suggestions"
            :key="template.id"
            clickable
            @click="selectSuggestion(template.name)"
          >
            <q-item-section avatar>
              <q-icon name="view_quilt" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ template.name }}</q-item-label>
              <q-item-label caption>{{ template.category }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item v-if="!isFetching && suggestions?.length === 0">
            <q-item-section>
              <q-item-label class="text-grey">Ничего не найдено</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <div class="text-caption text-grey q-mt-sm">
        Минимум 3 символа для поиска
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useDebounceFn } from '@vueuse/core';
import { useSuggestTemplatesQuery } from 'src/services/templates.hooks';

const router = useRouter();

const searchQuery = ref('');
const debouncedQuery = ref('');

const { data: suggestions, isFetching } = useSuggestTemplatesQuery(debouncedQuery);

const showSuggestions = computed(() => debouncedQuery.value.length >= 3);

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

watch(searchQuery, (val) => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debouncedQuery.value = val;
  }, 300);
});

function selectSuggestion(name: string) {
  searchQuery.value = name;
  debouncedQuery.value = name;
  performSearch();
}

const performSearch = useDebounceFn(() => {
  if (searchQuery.value.length >= 3) {
    router.push({
      name: 'search-results',
      query: { q: searchQuery.value }
    });
  }
}, 300);
</script>

<style scoped>
.suggestions-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 10;
  background: white;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
</style>

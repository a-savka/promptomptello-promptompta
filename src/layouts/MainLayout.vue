<template>
    <q-layout view="hHh Lpr lFf">

      <!-- HEADER -->
      <q-header elevated class="bg-primary" role="banner">
        <q-toolbar>

          <q-btn
            flat
            dense
            round
            icon="menu"
            aria-label="Открыть меню"
            @click="toggleLeftDrawer"
          />

          <q-toolbar-title class="text-weight-bold" role="heading" aria-level="1">
            Promptomptello Promptompta
          </q-toolbar-title>

        </q-toolbar>
      </q-header>

      <!-- LEFT MENU -->
      <q-drawer
        v-model="leftDrawerOpen"
        show-if-above
        bordered
        side="left"
        role="navigation"
        aria-label="Основное меню"
      >
        <q-list padding role="none">

          <q-item-label header>
            Навигация
          </q-item-label>

          <q-item clickable v-ripple to="/" exact :aria-current="isActive('/')" role="link">
            <q-item-section avatar>
              <q-icon name="home" aria-hidden="true" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Главная</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/prompts" role="link">
            <q-item-section avatar>
              <q-icon name="travel_explore" aria-hidden="true" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Каталог промптов</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/templates" role="link">
            <q-item-section avatar>
              <q-icon name="view_quilt" aria-hidden="true" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Шаблоны</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/template-search" role="link">
            <q-item-section avatar>
              <q-icon name="search" aria-hidden="true" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Поиск шаблона</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/editor" role="link">
            <q-item-section avatar>
              <q-icon name="edit_note" aria-hidden="true" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Редактор промптов</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator spaced />

          <q-item clickable v-ripple to="/knowledge" role="link">
            <q-item-section avatar>
              <q-icon name="school" aria-hidden="true" />
            </q-item-section>
            <q-item-section>
              <q-item-label>База знаний</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/research" role="link">
            <q-item-section avatar>
              <q-icon name="science" aria-hidden="true" />
            </q-item-section>
            <q-item-section>
              <q-item-label>База исследований</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator spaced />

          <q-item-label header>
            Личный кабинет
          </q-item-label>

          <q-item clickable v-ripple to="/profile" role="link">
            <q-item-section avatar>
              <q-icon name="person" aria-hidden="true" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Профиль</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/profile/favorites" role="link">
            <q-item-section avatar>
              <q-icon name="favorite" aria-hidden="true" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Избранное</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/profile/my-templates" role="link">
            <q-item-section avatar>
              <q-icon name="folder" aria-hidden="true" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Мои шаблоны</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/profile/settings" role="link">
            <q-item-section avatar>
              <q-icon name="settings" aria-hidden="true" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Настройки</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator spaced />

          <q-item clickable v-ripple @click="logout" v-if="isLoggedIn">
            <q-item-section avatar>
              <q-icon name="logout" aria-hidden="true" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Выйти</q-item-label>
            </q-item-section>
          </q-item>

        </q-list>
      </q-drawer>

      <!-- PAGE CONTENT -->
      <q-page-container
        id="main-content"
        role="main"
        aria-live="polite"
        aria-atomic="true"
        tabindex="-1"
      >
        <router-view />
      </q-page-container>

    </q-layout>
</template>

<script lang="ts">
  import { defineComponent, ref, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useAuthStore } from 'src/stores/auth'

  export default defineComponent({
    name: 'MainLayout',

    setup () {
      const route = useRoute()
      const leftDrawerOpen = ref(false)
      const authStore = useAuthStore()
      const isLoggedIn = computed(() => !!authStore.accessToken)

      const isActive = (path: string): string | undefined =>
        route.path === path ? 'page' : undefined

      const toggleLeftDrawer = (): void => {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }

      const logout = (): void => {
        authStore.logout()
      }

      return {
        leftDrawerOpen,
        isLoggedIn,
        isActive,
        toggleLeftDrawer,
        logout
      }
    }
  })
</script>

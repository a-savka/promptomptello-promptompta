<template>
    <q-layout view="hHh Lpr lFf">
  
      <!-- HEADER -->
  
      <q-header elevated class="bg-primary">
        <q-toolbar>
  
          <q-btn
            flat
            dense
            round
            icon="menu"
            @click="toggleLeftDrawer"
          />
  
          <q-toolbar-title class="text-weight-bold">
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
      >
  
        <q-list padding>
  
          <q-item-label header>
            Навигация
          </q-item-label>
  
          <!-- Главная -->
  
          <q-item clickable v-ripple to="/" exact>
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
  
            <q-item-section>
              <q-item-label>Главная</q-item-label>
            </q-item-section>
          </q-item>
  
          <!-- Prompt Hub -->
  
          <q-item clickable v-ripple to="/prompts">
            <q-item-section avatar>
              <q-icon name="travel_explore" />
            </q-item-section>
  
            <q-item-section>
              <q-item-label>Каталог промптов</q-item-label>
            </q-item-section>
          </q-item>
  
          <!-- Templates -->
  
          <q-item clickable v-ripple to="/templates">
            <q-item-section avatar>
              <q-icon name="view_quilt" />
            </q-item-section>
  
            <q-item-section>
              <q-item-label>Шаблоны</q-item-label>
            </q-item-section>
          </q-item>
  
          <!-- Editor -->
  
          <q-item clickable v-ripple to="/editor">
            <q-item-section avatar>
              <q-icon name="edit_note" />
            </q-item-section>
  
            <q-item-section>
              <q-item-label>Редактор промптов</q-item-label>
            </q-item-section>
          </q-item>
  
          <q-separator spaced />
  
          <!-- Knowledge -->
  
          <q-item clickable v-ripple to="/knowledge">
            <q-item-section avatar>
              <q-icon name="school" />
            </q-item-section>
  
            <q-item-section>
              <q-item-label>База знаний</q-item-label>
            </q-item-section>
          </q-item>
  
          <!-- Research -->
  
          <q-item clickable v-ripple to="/research">
            <q-item-section avatar>
              <q-icon name="science" />
            </q-item-section>
  
            <q-item-section>
              <q-item-label>База исследований</q-item-label>
            </q-item-section>
          </q-item>
  
          <q-separator spaced />
  
          <!-- Profile section -->
  
          <q-item-label header>
            Личный кабинет
          </q-item-label>
  
          <q-item clickable v-ripple to="/profile">
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>
  
            <q-item-section>
              <q-item-label>Профиль</q-item-label>
            </q-item-section>
          </q-item>
  
          <q-item clickable v-ripple to="/profile/favorites">
            <q-item-section avatar>
              <q-icon name="favorite" />
            </q-item-section>
  
            <q-item-section>
              <q-item-label>Избранное</q-item-label>
            </q-item-section>
          </q-item>
  
          <q-item clickable v-ripple to="/profile/my-templates">
            <q-item-section avatar>
              <q-icon name="folder" />
            </q-item-section>
  
            <q-item-section>
              <q-item-label>Мои шаблоны</q-item-label>
            </q-item-section>
          </q-item>
  
          <q-item clickable v-ripple to="/profile/settings">
            <q-item-section avatar>
              <q-icon name="settings" />
            </q-item-section>
  
            <q-item-section>
              <q-item-label>Настройки</q-item-label>
            </q-item-section>
          </q-item>
  
          <q-separator spaced />
  
          <!-- Logout -->
  
          <q-item clickable v-ripple @click="logout" v-if="isLoggedIn">
            <q-item-section avatar>
              <q-icon name="logout" />
            </q-item-section>
  
            <q-item-section>
              <q-item-label>Выйти</q-item-label>
            </q-item-section>
          </q-item>
  
        </q-list>
  
      </q-drawer>
  
      <!-- PAGE CONTENT -->
  
      <q-page-container>
        <router-view />
      </q-page-container>
  
    </q-layout>
</template>
  
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { useAuthStore } from 'src/stores/auth'
import { computed } from 'vue';
  
  export default defineComponent({
    name: 'MainLayout',
  
    setup () {
  
      const leftDrawerOpen = ref(false)
      const authStore = useAuthStore()
      const isLoggedIn = computed(() => !!authStore.accessToken)
  
      const toggleLeftDrawer = (): void => {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
  
      const logout = (): void => {
        authStore.logout()
      }
  
      return {
        leftDrawerOpen,
        isLoggedIn,
        toggleLeftDrawer,
        logout
      }
    }
  })
  </script>

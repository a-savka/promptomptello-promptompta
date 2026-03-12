import type { RouteRecordRaw } from 'vue-router';


const routes: RouteRecordRaw[] = [
    {
      path: '/',
      component: () => import('layouts/MainLayout.vue'),
      children: [

        // Главная страница
        {
          path: '',
          name: 'home',
          component: () => import('pages/HomePage.vue')
        },
  
        // ===== Аутентификация =====
  
        {
          path: 'login',
          name: 'login',
          component: () => import('pages/LoginPage.vue')
        },
  
        {
          path: 'register',
          name: 'register',
          component: () => import('pages/RegisterPage.vue')
        },
  
        // ===== Редактор промптов =====
  
        {
          path: 'editor',
          name: 'prompt-editor',
          component: () => import('pages/PromptEditorPage.vue'),
          meta: { requiresAuth: true }
        },
  
        // ===== Prompt Hub (каталог) =====
  
        {
          path: 'prompts',
          name: 'prompts',
          component: () => import('pages/prompts/PromptHubPage.vue')
        },
  
        {
          path: 'prompts/:id',
          name: 'prompt-view',
          component: () => import('pages/prompts/PromptViewPage.vue'),
          props: true
        },
  
        // ===== Шаблоны =====
  
        {
          path: 'templates',
          name: 'templates',
          component: () => import('pages/templates/TemplatesPage.vue')
        },
  
        // ===== База знаний =====
  
        {
          path: 'knowledge',
          name: 'knowledge-base',
          component: () => import('pages/knowledge/KnowledgeBasePage.vue')
        },
  
        // ===== База исследований =====
  
        {
          path: 'research',
          name: 'research-base',
          component: () => import('pages/research/ResearchBasePage.vue')
        },
  
        // ===== Личный кабинет =====
  
        {
          path: 'profile',

          meta: { requiresAuth: true },
          children: [
  
            {
              path: '',
              name: 'profile',
              component: () => import('pages/profile/ProfilePage.vue')
            },
  
            {
              path: 'favorites',
              name: 'favorites',
              component: () => import('pages/profile/FavoritesPage.vue')
            },
  
            {
              path: 'my-templates',
              name: 'my-templates',
              component: () => import('pages/profile/MyTemplatesPage.vue')
            },
  
            {
              path: 'settings',
              name: 'settings',
              component: () => import('pages/profile/SettingsPage.vue')
            }
          ]
        }
  
      ]
    },
  
    // ===== 404 =====
  
    {
      path: '/:catchAll(.*)*',
      component: () => import('pages/ErrorNotFound.vue')
    }
  ]

export default routes;

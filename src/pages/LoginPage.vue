<!-- src/pages/LoginPage.vue -->
<template>
    <q-page class="q-pa-md">
        <div class="login-page full-height flex flex-center">
            <q-card class="q-pa-lg" style="width: 100%; max-width: 400px">
                <q-card-section class="text-center">
                    <div class="text-h5 q-mb-md">Вход в систему</div>
                </q-card-section>
        
                <q-card-section>
                    <q-form @submit="onSubmit" class="">
                        <q-input
                            v-model="form.email"
                            label="Email"
                            type="email"
                            bg-color="white"
                            :rules="[val => !!val || 'Email обязателен', val => /.+@.+\..+/.test(val) || 'Некорректный email']"
                        />
            
                        <q-input
                            v-model="form.password"
                            label="Пароль"
                            type="password"
                            :rules="[val => !!val || 'Пароль обязателен']"
                        />
            
                        <q-btn
                            label="Войти"
                            type="submit"
                            color="primary"
                            class="full-width"
                        />
                    </q-form>
                </q-card-section>
            </q-card>
        </div>
    </q-page>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useAuthStore } from 'src/stores/auth';
  import { useQuasar } from 'quasar';
  
  const router = useRouter();
  const route = useRoute();
  const $q = useQuasar();

  console.log('$q available:', !!$q) // true
  console.log('$q.notify type:', typeof $q.notify) // 'function'

  const authStore = useAuthStore();
  
  const form = ref({
    email: '',
    password: '',
  });
  
  const onSubmit = async () => {
    const expires = new Date();
    expires.setMonth(expires.getMonth() + 1);
    try {
      authStore.setAuth({
        accessToken: 'mock-access-token',
        tokenType: 'Bearer',
        expiresIn: expires.getTime(),
      });
      
      $q.notify({
        type: 'positive',
        message: 'Успешный вход!',
      });
  
      // Редирект на страницу, с которой перенаправили, или на главную
      const redirect = route.query.redirect as string || '/';
      router.replace(redirect);
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };
  </script>
  
<style scoped>
.login-page {
    min-height: 100vh;
}
</style>

import { test, expect } from '@playwright/test'

test.describe('Навигация', () => {
  test('переход по страницам через сайдбар', async ({ page }) => {
    await page.goto('/#/')
    await expect(page.locator('.q-page')).toBeVisible()

    // Клик по пункту "Каталог промптов" в сайдбаре
    await page.getByText('Каталог промптов').click()
    await expect(page).toHaveURL(/\/prompts/)

    // Клик по пункту "Шаблоны"
    await page.getByText('Шаблоны', { exact: true }).click()
    await expect(page).toHaveURL(/\/templates/)

    // Клик по пункту "База знаний"
    await page.getByText('База знаний').click()
    await expect(page).toHaveURL(/\/knowledge/)

    // Клик по пункту "Поиск шаблона"
    await page.getByText('Поиск шаблона').click()
    await expect(page).toHaveURL(/\/template-search/)
  })
})

test.describe('Шаблоны: создание и проверка', () => {
  test('создание нового шаблона и отображение в списке', async ({ page }) => {
    await page.goto('/#/templates')
    await expect(page.getByText('Шаблоны', { exact: true }).first()).toBeVisible()

    // Нажимаем "Добавить"
    await page.getByText('Добавить').click()
    await expect(page).toHaveURL(/\/templates\/new/)

    // Заполняем форму
    await page.locator('input').first().fill('Тестовый шаблон')
    await page.locator('.q-field').nth(1).click()
    await page.getByText('Маркетинг').click()
    await page.locator('.prompt-editor__input').fill('Тестовый промпт с {{var}} и `code`')

    // Нажимаем "Создать"
    await page.getByText('Создать').click()

    // Ждём редирект на список шаблонов
    await expect(page).toHaveURL(/\/templates/)

    // Проверяем, что новый шаблон появился в таблице (ждём завершения запроса)
    await expect(page.getByText('Тестовый шаблон')).toBeVisible({ timeout: 5000 })
  })
})

test.describe('Шаблоны: редактирование и удаление', () => {
  test('редактирование существующего шаблона', async ({ page }) => {
    await page.goto('/#/templates')
    await expect(page.getByText('Шаблоны', { exact: true }).first()).toBeVisible()

    // Нажимаем "Редактировать" на первом шаблоне
    await page.getByText('Редактировать').first().click()
    await expect(page).toHaveURL(/\/templates\/\d+\/edit/)

    // Ждём загрузки существующих данных (mock delay 500ms + watch)
    await page.waitForTimeout(600)

    // Меняем название
    await page.locator('input').first().fill('Обновлённый шаблон')

    // Сохраняем
    await page.getByText('Сохранить').click()

    // Ждём редирект на список в рамках SPA
    await expect(page).toHaveURL(/\/templates/, { timeout: 5000 })

    // Ждём завершения загрузки таблицы (инвалидация + refetch)
    await expect(page.locator('.q-inner-loading')).not.toBeVisible({ timeout: 5000 })

    // Проверяем обновлённое название
    await expect(page.getByText('Обновлённый шаблон')).toBeVisible({ timeout: 5000 })
  })

  test('удаление шаблона', async ({ page }) => {
    await page.goto('/#/templates')
    await expect(page.getByText('Шаблоны', { exact: true }).first()).toBeVisible()

    // Нажимаем "Удалить" на первом шаблоне
    await page.getByText('Удалить').first().click()

    // Ждём появления диалога, затем кликаем по кнопке внутри него
    const dialog = page.locator('.q-dialog')
    await expect(dialog).toBeVisible()
    await dialog.getByText('Удалить', { exact: true }).click()

    // Ждём уведомления об удалении
    await expect(page.getByText('Шаблон успешно удален')).toBeVisible({ timeout: 5000 })
  })
})

test.describe('Поиск шаблонов', () => {
  test('поиск с подсказками и результатами', async ({ page }) => {
    await page.goto('/#/template-search')
    await expect(page.getByText('Поиск шаблонов')).toBeVisible()

    // Вводим запрос (минимум 3 символа)
    await page.locator('input').first().fill('Базовый')

    // Ждём появления подсказок (дебаунс 300мс + мок-задержка 200мс + рендер)
    await page.waitForTimeout(1000)
    await expect(page.getByText('Базовый промпт для генерации текста')).toBeVisible({ timeout: 5000 })

    // Кликаем по подсказке
    await page.getByText('Базовый промпт для генерации текста').click()

    // Должны оказаться на странице результатов
    await expect(page).toHaveURL(/\/template-search\/results/)
    await expect(page.getByText('Результаты поиска')).toBeVisible()
  })
})

test.describe('Auth guard', () => {
  test('редирект на /login для защищённых маршрутов и вход', async ({ page }) => {
    // Пытаемся зайти на /editor без авторизации
    await page.goto('/#/editor')
    await expect(page).toHaveURL(/\/login/)
    await expect(page.locator('input[type="email"]')).toBeVisible()

    // Проверяем параметр redirect (hash-роутер не кодирует / в %2F)
    await expect(page).toHaveURL(/redirect=\/editor/)

    // Заполняем форму входа
    await page.locator('input[type="email"]').fill('test@example.com')
    await page.locator('input[type="password"]').fill('password123')
    await page.getByText('Войти').click()

    // После входа должны быть перенаправлены обратно на /editor
    await expect(page).toHaveURL(/\/editor/, { timeout: 5000 })
  })
})

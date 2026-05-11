<template>
  <div
    class="prompt-editor"
    :class="{ 'prompt-editor--focused': isFocused, 'prompt-editor--disabled': disabled }"
  >
    <div class="prompt-editor__backdrop">
      <pre
        class="prompt-editor__highlight"
        aria-hidden="true"
        v-html="highlightedText"
      />
      <textarea
        ref="textareaRef"
        class="prompt-editor__input"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :rows="rows"
        @input="onInput"
        @scroll="onScroll"
        @focus="isFocused = true"
        @blur="isFocused = false"
        @keydown="onKeydown"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { highlightText } from 'src/utils/highlight'

const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  rows?: number
}>(), {
  modelValue: '',
  placeholder: '',
  disabled: false,
  readonly: false,
  rows: 10,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const isFocused = ref(false)

const highlightedText = computed(() => highlightText(props.modelValue))

function onInput(e: Event) {
  const target = e.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

function onScroll() {
  const textarea = textareaRef.value
  if (!textarea) return
  const highlight = textarea.parentElement?.querySelector('.prompt-editor__highlight') as HTMLElement | null
  if (highlight) {
    highlight.scrollTop = textarea.scrollTop
    highlight.scrollLeft = textarea.scrollLeft
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Tab') {
    e.preventDefault()
    const textarea = textareaRef.value
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newValue = props.modelValue.substring(0, start) + '  ' + props.modelValue.substring(end)
    emit('update:modelValue', newValue)
    nextTick(() => {
      textarea.selectionStart = textarea.selectionEnd = start + 2
    })
  }
}

watch(() => props.modelValue, () => {
  nextTick(onScroll)
})

function focus() {
  textareaRef.value?.focus()
}

defineExpose({ focus })
</script>

<style lang="scss">
.prompt-editor {
  border: 1px solid #c0c0c0;
  border-radius: 4px;
  overflow: hidden;
  transition: border-color 0.2s;

  &--focused {
    border-color: #1976D2;
  }

  &--disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  &__backdrop {
    position: relative;
    display: flex;
  }

  &__highlight,
  &__input {
    width: 100%;
    margin: 0;
    padding: 12px;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 14px;
    line-height: 1.6;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-wrap: break-word;
    box-sizing: border-box;
  }

  &__highlight {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    pointer-events: none;
    background: #fff;
    color: #333;
    z-index: 1;
  }

  &__input {
    position: relative;
    z-index: 2;
    min-height: 200px;
    border: none;
    outline: none;
    resize: vertical;
    background: transparent;
    color: transparent;
    caret-color: #000;

    &::placeholder {
      color: #aaa;
    }
  }

  .token-inline-code {
    color: #e3116c;
    background: #f5f5f5;
    border-radius: 3px;
    padding: 0 2px;
  }

  .token-json-key {
    color: #0451a5;
  }

  .token-json-string {
    color: #0c8024;
  }

  .token-variable {
    color: #d9534f;
    background: #fce4e4;
    border-radius: 3px;
    padding: 0 2px;
  }

  .token-xml-tag {
    color: #800000;
  }

  .token-header {
    color: #1976D2;
    font-weight: 700;
  }

  .token-decorator {
    color: #795da3;
    font-weight: 700;
  }

  .token-separator {
    color: #999;
  }

  .token-arrow {
    color: #e67e22;
    font-weight: 700;
  }

  .token-metaglyph {
    color: #9b59b6;
    font-weight: 700;
  }

  .token-accent {
    color: #2c3e50;
    font-weight: 700;
  }
}
</style>

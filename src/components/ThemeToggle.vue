<script setup lang="ts">
import { ref, watch } from 'vue'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'vibe-coding-runoob-theme'

function getInitialTheme(): Theme {
  try {
    const savedTheme = localStorage.getItem(STORAGE_KEY)
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
  } catch {
    // Fall back to the system preference when storage is unavailable.
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const theme = ref<Theme>(getInitialTheme())

watch(
  theme,
  (value) => {
    document.documentElement.classList.toggle('dark', value === 'dark')
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
      // Keep the selected theme for the current session if storage is unavailable.
    }
  },
  { immediate: true },
)

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <button
    type="button"
    :aria-label="theme === 'dark' ? '切换到亮色模式' : '切换到深色模式'"
    :title="theme === 'dark' ? '切换到亮色模式' : '切换到深色模式'"
    class="grid size-11 place-items-center rounded-md border border-slate-200 bg-white text-lg text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-amber-300 dark:hover:bg-slate-700"
    @click="toggleTheme"
  >
    <span aria-hidden="true">{{ theme === 'dark' ? '☾' : '☼' }}</span>
  </button>
</template>
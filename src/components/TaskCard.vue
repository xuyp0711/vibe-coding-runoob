<script setup lang="ts">
import type { Task, TaskPriority } from '../types/task'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  toggle: [taskId: string]
  delete: [taskId: string]
}>()

const priorityStyles: Record<TaskPriority, string> = {
  high: 'border-l-red-500 dark:border-l-red-400',
  medium: 'border-l-yellow-500 dark:border-l-yellow-400',
  low: 'border-l-green-500 dark:border-l-green-400',
}

const priorityLabels: Record<TaskPriority, string> = {
  high: '高优先级',
  medium: '中优先级',
  low: '低优先级',
}
</script>

<template>
  <article
    :class="[
      'group flex items-start gap-4 rounded-lg border border-slate-200 border-l-4 bg-white p-4 shadow-sm transition-transform duration-200 hover:scale-[1.02] dark:border-y-slate-700 dark:border-r-slate-700 dark:bg-slate-900',
      priorityStyles[props.task.priority],
    ]"
  >
    <label class="-ml-3 -mt-3 grid size-11 shrink-0 cursor-pointer place-items-center">
      <input
        type="checkbox"
        :checked="props.task.status === 'done'"
        :aria-label="`标记任务「${props.task.title}」为${props.task.status === 'done' ? '未完成' : '完成'}`"
        class="size-4 cursor-pointer accent-indigo-600"
        @change="emit('toggle', props.task.id)"
      />
    </label>

    <div class="min-w-0 flex-1">
      <div class="flex items-start justify-between gap-3">
        <h3
          :class="[
            'break-words text-sm font-semibold text-slate-900 dark:text-slate-100',
            { 'text-slate-400 line-through dark:text-slate-500': props.task.status === 'done' },
          ]"
        >
          {{ props.task.title }}
        </h3>
        <button
          type="button"
          :aria-label="`删除任务「${props.task.title}」`"
          class="-mr-2 -mt-2 grid size-11 shrink-0 place-items-center rounded text-xl leading-none text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:text-slate-500 dark:hover:bg-red-950 dark:hover:text-red-400"
          @click="emit('delete', props.task.id)"
        >
          ×
        </button>
      </div>

      <p class="mt-1 whitespace-pre-wrap break-words text-sm leading-5 text-slate-600 dark:text-slate-300">
        {{ props.task.description }}
      </p>

      <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
        <span class="font-medium text-slate-500 dark:text-slate-400">{{ priorityLabels[props.task.priority] }}</span>
        <span class="text-slate-500 dark:text-slate-400">截止日期：{{ props.task.dueDate }}</span>
      </div>
    </div>
  </article>
</template>
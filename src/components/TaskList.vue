<script setup lang="ts">
import { computed, ref } from 'vue'
import TaskCard from './TaskCard.vue'
import type { Task, TaskStatus } from '../types/task'

type TaskFilter = 'all' | TaskStatus

const props = defineProps<{
  tasks: Task[]
}>()

const emit = defineEmits<{
  toggle: [taskId: string]
  delete: [taskId: string]
}>()

const activeFilter = ref<TaskFilter>('all')

const filters: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'todo', label: '待办' },
  { value: 'in-progress', label: '进行中' },
  { value: 'done', label: '完成' },
]

const visibleTasks = computed(() =>
  [...props.tasks]
    .sort((first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt))
    .filter((task) => activeFilter.value === 'all' || task.status === activeFilter.value),
)
</script>

<template>
  <section aria-label="任务列表">
    <div class="mb-5 flex flex-wrap gap-2" role="group" aria-label="按状态筛选任务">
      <button
        v-for="filter in filters"
        :key="filter.value"
        type="button"
        :aria-pressed="activeFilter === filter.value"
        :class="[
          'min-h-11 rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
          activeFilter === filter.value
            ? 'bg-indigo-600 text-white'
            : 'bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700',
        ]"
        @click="activeFilter = filter.value"
      >
        {{ filter.label }}
      </button>
    </div>

    <ul v-if="visibleTasks.length" class="space-y-3">
      <li v-for="task in visibleTasks" :key="task.id">
        <TaskCard
          :task="task"
          @toggle="emit('toggle', $event)"
          @delete="emit('delete', $event)"
        />
      </li>
    </ul>

    <p
      v-else-if="props.tasks.length === 0"
      class="rounded-lg border border-dashed border-slate-300 px-5 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400"
    >
      还没有任务，点击下方按钮创建第一个吧
    </p>
    <p v-else class="rounded-lg border border-dashed border-slate-300 px-5 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
      当前筛选下没有任务
    </p>
  </section>
</template>
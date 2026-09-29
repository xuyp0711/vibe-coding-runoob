<script setup lang="ts">
import { computed, ref } from 'vue'
import TaskCard from './TaskCard.vue'
import type { Task, TaskStatus } from '../types/task'

const props = defineProps<{
  tasks: Task[]
}>()

const emit = defineEmits<{
  toggle: [taskId: string]
  delete: [taskId: string]
  'status-change': [taskId: string, status: TaskStatus]
}>()

const columns: { status: TaskStatus; label: string }[] = [
  { status: 'todo', label: '待办' },
  { status: 'in-progress', label: '进行中' },
  { status: 'done', label: '已完成' },
]

const draggingTaskId = ref<string | null>(null)
const draggingOverStatus = ref<TaskStatus | null>(null)

const columnsWithTasks = computed(() =>
  columns.map((column) => ({
    ...column,
    tasks: props.tasks.filter((task) => task.status === column.status),
  })),
)

function startDrag(event: DragEvent, taskId: string) {
  draggingTaskId.value = taskId
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', taskId)
  }
}

function dropTask(event: DragEvent, status: TaskStatus) {
  event.preventDefault()
  const taskId = event.dataTransfer?.getData('text/plain') || draggingTaskId.value
  const task = props.tasks.find((item) => item.id === taskId)

  if (task && task.status !== status) {
    emit('status-change', task.id, status)
  }

  draggingTaskId.value = null
  draggingOverStatus.value = null
}
</script>

<template>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-3" aria-label="看板任务列">
    <section
      v-for="column in columnsWithTasks"
      :key="column.status"
      :aria-label="`${column.label}任务列`"
      :class="[
        'min-w-0 rounded-lg bg-slate-100 p-3 transition-colors dark:bg-slate-900',
        draggingOverStatus === column.status ? 'bg-indigo-50 ring-2 ring-inset ring-indigo-300 dark:bg-indigo-950 dark:ring-indigo-700' : '',
      ]"
      @dragover.prevent="draggingOverStatus = column.status"
      @drop="dropTask($event, column.status)"
    >
      <div class="mb-3 flex items-center justify-between px-1 py-1">
        <h2 class="text-sm font-semibold text-slate-800 dark:text-slate-200">{{ column.label }}</h2>
        <span class="rounded bg-white px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          {{ column.tasks.length }}
        </span>
      </div>

      <ul class="min-h-36 space-y-3">
        <li v-for="task in column.tasks" :key="task.id">
          <TaskCard
            :task="task"
            draggable="true"
            :class="draggingTaskId === task.id ? 'opacity-50' : 'cursor-grab active:cursor-grabbing'"
            @dragstart="startDrag($event, task.id)"
            @dragend="draggingTaskId = null; draggingOverStatus = null"
            @toggle="emit('toggle', $event)"
            @delete="emit('delete', $event)"
          />
        </li>
        <li v-if="column.tasks.length === 0" class="grid min-h-32 place-items-center rounded-md border border-dashed border-slate-300 px-4 text-center text-xs text-slate-400 dark:border-slate-700 dark:text-slate-500">
          拖动任务到此列
        </li>
      </ul>
    </section>
  </div>
</template>
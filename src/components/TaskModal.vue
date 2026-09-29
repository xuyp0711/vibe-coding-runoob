<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import type { Task, TaskPriority } from '../types/task'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [isOpen: boolean]
  create: [task: Task]
}>()

const titleError = ref('')
const form = reactive<{
  title: string
  description: string
  priority: TaskPriority
}>({
  title: '',
  description: '',
  priority: 'medium',
})

function resetForm() {
  form.title = ''
  form.description = ''
  form.priority = 'medium'
  titleError.value = ''
}

function closeModal() {
  emit('update:modelValue', false)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.modelValue) {
    closeModal()
  }
}

function getLocalDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function submitTask() {
  const title = form.title.trim()
  if (!title) {
    titleError.value = '标题不能为空'
    return
  }

  const now = new Date()
  const today = getLocalDate(now)
  emit('create', {
    id: crypto.randomUUID(),
    title,
    description: form.description.trim(),
    status: 'todo',
    priority: form.priority,
    dueDate: today,
    createdAt: now.toISOString(),
  })
  closeModal()
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) resetForm()
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="props.modelValue"
      class="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-slate-950/50 p-0 sm:items-center sm:p-4"
      @click.self="closeModal"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        class="max-h-[90dvh] w-full max-w-lg animate-[task-sheet-in_240ms_cubic-bezier(0.22,1,0.36,1)] overflow-y-auto rounded-t-2xl bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl dark:bg-slate-900 motion-reduce:animate-none sm:animate-none sm:rounded-xl sm:p-6"
      >
        <div class="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id="task-modal-title" class="text-lg font-semibold text-slate-900 dark:text-slate-100">新建任务</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">填写任务信息并添加到列表</p>
          </div>
          <button
            type="button"
            aria-label="关闭弹窗"
            class="grid size-11 shrink-0 place-items-center rounded text-xl leading-none text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-indigo-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            @click="closeModal"
          >
            ×
          </button>
        </div>

        <form class="space-y-5" @submit.prevent="submitTask">
          <div>
            <label for="task-title" class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              标题 <span class="text-red-600 dark:text-red-400">*</span>
            </label>
            <input
              id="task-title"
              v-model.trim="form.title"
              type="text"
              :aria-invalid="Boolean(titleError)"
              :aria-describedby="titleError ? 'task-title-error' : undefined"
              class="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-900"
              placeholder="输入任务标题"
              @input="titleError = ''"
            />
            <p v-if="titleError" id="task-title-error" class="mt-1.5 text-sm text-red-600 dark:text-red-400">
              {{ titleError }}
            </p>
          </div>

          <div>
            <label for="task-description" class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              描述 <span class="font-normal text-slate-400 dark:text-slate-500">（选填）</span>
            </label>
            <textarea
              id="task-description"
              v-model="form.description"
              rows="3"
              class="w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-900"
              placeholder="补充任务详情"
            ></textarea>
          </div>

          <div>
            <label for="task-priority" class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              优先级
            </label>
            <select
              id="task-priority"
              v-model="form.priority"
              class="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-base text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-indigo-900"
            >
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
            </select>
          </div>

          <div class="flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              type="button"
              class="h-11 rounded-md px-4 text-sm font-medium text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800"
              @click="closeModal"
            >
              取消
            </button>
            <button
              type="submit"
              class="h-11 rounded-md bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              创建任务
            </button>
          </div>
        </form>
      </section>
    </div>
  </Teleport>
</template>
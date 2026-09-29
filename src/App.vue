<script setup lang="ts">
import { computed, ref } from 'vue'
import KanbanBoard from './components/KanbanBoard.vue'
import TaskList from './components/TaskList.vue'
import TaskModal from './components/TaskModal.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import { addTask, deleteTask, tasks, updateTask } from './stores/taskStore'
import type { TaskStatus } from './types/task'

type ViewMode = 'list' | 'kanban'

const isTaskModalOpen = ref(false)
const isMobileMenuOpen = ref(false)
const activeView = ref<ViewMode>('list')
const completedCount = computed(
  () => tasks.filter((task) => task.status === 'done').length,
)

function toggleTask(taskId: string) {
  const task = tasks.find((item) => item.id === taskId)
  if (task) {
    updateTask({
      ...task,
      status: task.status === 'done' ? 'todo' : 'done',
    })
  }
}

function moveTask(taskId: string, status: TaskStatus) {
  const task = tasks.find((item) => item.id === taskId)
  if (task) updateTask({ ...task, status })
}

function selectView(view: ViewMode) {
  activeView.value = view
  isMobileMenuOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
    <header class="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <nav class="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8" aria-label="主导航">
        <a href="#" class="flex items-center gap-3 no-underline" aria-label="Vibe Coding Runoob 首页">
          <span class="grid size-9 place-items-center rounded-lg bg-indigo-600 text-sm font-bold text-white">V</span>
          <span class="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">Vibe Coding Runoob</span>
        </a>
        <div class="flex items-center gap-3">
          <span class="hidden text-sm text-slate-500 dark:text-slate-400 sm:block">任务管理</span>
          <ThemeToggle />
          <button
            type="button"
            class="grid size-11 place-items-center rounded-md text-xl text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:text-slate-200 dark:hover:bg-slate-800 sm:hidden"
            :aria-expanded="isMobileMenuOpen"
            aria-controls="mobile-navigation-menu"
            :aria-label="isMobileMenuOpen ? '关闭导航菜单' : '打开导航菜单'"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
          >
            <span aria-hidden="true">{{ isMobileMenuOpen ? '×' : '☰' }}</span>
          </button>
          <div
            v-if="isMobileMenuOpen"
            id="mobile-navigation-menu"
            class="absolute right-5 top-full z-40 mt-2 grid w-48 gap-1 rounded-lg border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900 sm:right-8 sm:hidden"
          >
            <button
              type="button"
              class="min-h-11 rounded-md px-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              @click="selectView('list')"
            >
              列表
            </button>
            <button
              type="button"
              class="min-h-11 rounded-md px-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              @click="selectView('kanban')"
            >
              看板
            </button>
          </div>
        </div>
      </nav>
    </header>

    <main class="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <section aria-labelledby="tasks-heading">
        <div class="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p class="mb-2 text-sm font-medium text-indigo-700 dark:text-indigo-400">工作空间</p>
            <h1 id="tasks-heading" class="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">我的任务</h1>
            <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">集中查看当前计划与任务进度</p>
          </div>
          <div class="flex flex-wrap items-center gap-5 text-sm">
            <div>
              <span class="font-semibold text-slate-900 dark:text-slate-100">{{ tasks.length }}</span>
              <span class="ml-1 text-slate-500 dark:text-slate-400">个任务</span>
            </div>
            <span class="h-4 w-px bg-slate-200 dark:bg-slate-700" aria-hidden="true"></span>
            <div>
              <span class="font-semibold text-emerald-700 dark:text-emerald-400">{{ completedCount }}</span>
              <span class="ml-1 text-slate-500 dark:text-slate-400">个已完成</span>
            </div>
            <button
              type="button"
              class="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-md bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400"
              @click="isTaskModalOpen = true"
            >
              <span aria-hidden="true" class="text-lg leading-none">+</span>
              新建任务
            </button>
            <TaskModal v-model="isTaskModalOpen" @create="addTask" />
          </div>
        </div>

        <div class="mb-5 hidden gap-1 border-b border-slate-200 dark:border-slate-800 sm:flex" role="tablist" aria-label="任务视图">
          <button
            type="button"
            role="tab"
            :aria-selected="activeView === 'list'"
            aria-controls="task-view-panel"
            :class="[
              'min-h-11 border-b-2 px-4 text-sm font-medium transition-colors',
              activeView === 'list'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100',
            ]"
            @click="selectView('list')"
          >
            列表
          </button>
          <button
            type="button"
            role="tab"
            :aria-selected="activeView === 'kanban'"
            aria-controls="task-view-panel"
            :class="[
              'min-h-11 border-b-2 px-4 text-sm font-medium transition-colors',
              activeView === 'kanban'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100',
            ]"
            @click="selectView('kanban')"
          >
            看板
          </button>
        </div>

        <div id="task-view-panel" role="tabpanel">
          <TaskList
            v-if="activeView === 'list'"
            :tasks="tasks"
            @toggle="toggleTask"
            @delete="deleteTask"
          />
          <KanbanBoard
            v-else
            :tasks="tasks"
            @toggle="toggleTask"
            @delete="deleteTask"
            @status-change="moveTask"
          />
        </div>
      </section>
    </main>
  </div>
</template>

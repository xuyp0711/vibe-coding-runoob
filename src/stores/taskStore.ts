import { reactive, watch } from 'vue'
import type { Task } from '../types/task'
import { hasSavedTasks, loadTasks, saveTasks } from '../utils/storage'

function createExampleTasks(): Task[] {
  return [
    {
      id: 'example-task-1',
      title: '整理项目需求与开发计划',
      description: '梳理核心功能，明确首个版本的开发范围。',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2026-09-30',
      createdAt: '2026-09-24',
    },
    {
      id: 'example-task-2',
      title: '搭建 Vue 项目基础结构',
      description: '完成页面入口、样式基础和组件目录规划。',
      status: 'done',
      priority: 'medium',
      dueDate: '2026-09-27',
      createdAt: '2026-09-22',
    },
    {
      id: 'example-task-3',
      title: '设计任务列表交互',
      description: '规划状态筛选、优先级标记和任务详情展示。',
      status: 'todo',
      priority: 'low',
      dueDate: '2026-10-02',
      createdAt: '2026-09-26',
    },
  ]
}

const initialTasks = hasSavedTasks() ? loadTasks() : createExampleTasks()

export const tasks = reactive<Task[]>(initialTasks)

watch(
  tasks,
  () => saveTasks(tasks),
  { deep: true, immediate: true },
)

export function addTask(task: Task): void {
  tasks.unshift(task)
}

export function updateTask(updatedTask: Task): void {
  const task = tasks.find((item) => item.id === updatedTask.id)
  if (task) Object.assign(task, updatedTask)
}

export function deleteTask(taskId: string): void {
  const taskIndex = tasks.findIndex((task) => task.id === taskId)
  if (taskIndex !== -1) tasks.splice(taskIndex, 1)
}
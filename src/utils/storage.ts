import type { Task } from '../types/task'

export const TASKS_STORAGE_KEY = 'vibe-coding-runoob-tasks'

export function hasSavedTasks(): boolean {
  try {
    return localStorage.getItem(TASKS_STORAGE_KEY) !== null
  } catch {
    return false
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    // Storage can be unavailable or full; keep the in-memory app usable.
  }
}

export function loadTasks(): Task[] {
  try {
    const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY)
    if (storedTasks === null) return []

    const parsedTasks: unknown = JSON.parse(storedTasks)
    return Array.isArray(parsedTasks) ? (parsedTasks as Task[]) : []
  } catch {
    return []
  }
}
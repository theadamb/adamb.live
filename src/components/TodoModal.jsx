import { useState, useEffect } from 'react'
import { X, Trash2, Edit2, Star, GripVertical, Settings2 } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

function SortableTask({ task, onToggle, onDelete, onEdit, onFocusToggle, isDragDisabled }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, disabled: isDragDisabled })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.5 : 1,
  } : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center bg-white/10 backdrop-blur-md rounded-lg p-3 mb-2 ${
        isDragging ? 'shadow-lg' : ''
      }`}
    >
      <div {...listeners} {...attributes} className="cursor-grab px-2">
        <GripVertical className="w-4 h-4 text-white/50 hover:text-white/70" />
      </div>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="mr-3"
      />
      <span className={`flex-grow text-white ${task.completed ? 'line-through text-white/50' : ''}`}>
        {task.text}
      </span>
      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onFocusToggle(task)}
          className={`p-1.5 rounded-full transition-colors ${
            task.isFocused ? 'text-yellow-400 hover:text-yellow-500' : 'text-white/50 hover:text-white'
          }`}
          title="Set as focus task"
        >
          <Star className="w-4 h-4" />
        </button>
        <button
          onClick={() => onEdit(task)}
          className="text-white/50 hover:text-white p-1.5 rounded-full transition-colors"
          title="Edit task"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="text-white/50 hover:text-red-400 p-1.5 rounded-full transition-colors"
          title="Delete task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function TodoSettings({ onDeleteCompleted, onDeleteCurrent, showCompleted, setShowCompleted }) {
  return (
    <div className="bg-black/20 backdrop-blur-md rounded-lg p-4">
      <h3 className="text-white font-bold mb-4">Task Settings</h3>
      <div className="space-y-3">
        <button
          onClick={onDeleteCompleted}
          className="w-full text-left px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          Delete completed tasks
        </button>
        <button
          onClick={onDeleteCurrent}
          className="w-full text-left px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          Delete current tasks
        </button>
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-white/70">Show completed tasks</span>
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className={`w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${
              showCompleted ? 'bg-green-500' : 'bg-gray-400'
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-200 ease-in-out ml-1 ${
              showCompleted ? 'translate-x-6' : ''
            }`} />
          </button>
        </div>
      </div>
    </div>
  )
}

function TodoModal({ onClose, focusedTask, setFocusedTask, onTaskComplete }) {
  // Initialize state with localStorage values
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem('tasks')
      return savedTasks ? JSON.parse(savedTasks) : []
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error)
      return []
    }
  })

  const [showCompleted, setShowCompleted] = useState(() => {
    try {
      const saved = localStorage.getItem('showCompleted')
      return saved ? JSON.parse(saved) : true
    } catch (error) {
      return true
    }
  })

  const [newTask, setNewTask] = useState('')
  const [editingTask, setEditingTask] = useState(null)
  const [showSettings, setShowSettings] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Save tasks whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  // Save showCompleted setting whenever it changes
  useEffect(() => {
    localStorage.setItem('showCompleted', JSON.stringify(showCompleted))
  }, [showCompleted])

  // Sync focused task with tasks state
  useEffect(() => {
    const focusedTaskInTasks = tasks.find(task => task.isFocused)
    if (focusedTaskInTasks) {
      setFocusedTask(focusedTaskInTasks)
    } else if (focusedTask) {
      setFocusedTask(null)
    }
  }, [tasks])

  const addTask = (text) => {
    if (text.trim()) {
      const newTasks = [
        ...tasks,
        {
          id: Date.now().toString(),
          text: text.trim(),
          completed: false,
          isFocused: false
        }
      ]
      setTasks(newTasks)
      setNewTask('')
    }
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const updated = { ...task, completed: !task.completed }
        if (updated.completed) {
          // Only increment counter when task is being marked as complete
          onTaskComplete()
        }
        if (updated.completed && updated.isFocused) {
          updated.isFocused = false
          setFocusedTask(null)
        }
        return updated
      }
      return task
    }))
  }

  const deleteTask = (id) => {
    const taskToDelete = tasks.find(t => t.id === id)
    if (taskToDelete?.isFocused) {
      setFocusedTask(null)
    }
    setTasks(tasks.filter(task => task.id !== id))
  }

  const startEditingTask = (task) => {
    setEditingTask(task)
    setNewTask(task.text)
  }

  const updateTask = () => {
    if (editingTask && newTask.trim()) {
      const updatedTasks = tasks.map(task =>
        task.id === editingTask.id
          ? { ...task, text: newTask.trim() }
          : task
      )
      setTasks(updatedTasks)

      if (editingTask.isFocused) {
        setFocusedTask({ ...editingTask, text: newTask.trim() })
      }

      setEditingTask(null)
      setNewTask('')
    }
  }

  const toggleFocus = (task) => {
    const updatedTasks = tasks.map(t => ({
      ...t,
      isFocused: t.id === task.id ? !t.isFocused : false
    }))

    setTasks(updatedTasks)

    const updatedTask = updatedTasks.find(t => t.id === task.id)
    setFocusedTask(updatedTask.isFocused ? updatedTask : null)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const deleteCompleted = () => {
    const updatedTasks = tasks.filter(task => !task.completed)
    setTasks(updatedTasks)
    if (focusedTask?.completed) {
      setFocusedTask(null)
    }
    setShowSettings(false)
  }

  const deleteCurrent = () => {
    const updatedTasks = tasks.filter(task => task.completed)
    setTasks(updatedTasks)
    if (focusedTask && !focusedTask.completed) {
      setFocusedTask(null)
    }
    setShowSettings(false)
  }

  const visibleTasks = showCompleted ? tasks : tasks.filter(task => !task.completed)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white/10 backdrop-blur-lg rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Tasks</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-white/70 hover:text-white p-2 rounded-full transition-colors"
            >
              <Settings2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {showSettings ? (
          <TodoSettings
            onDeleteCompleted={deleteCompleted}
            onDeleteCurrent={deleteCurrent}
            showCompleted={showCompleted}
            setShowCompleted={setShowCompleted}
          />
        ) : (
          <>
            <div className="mb-4">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    editingTask ? updateTask() : addTask(newTask)
                  }
                }}
                placeholder={editingTask ? `Editing: ${editingTask.text}` : "Add a new task..."}
                className="w-full bg-white/10 text-white placeholder-white/50 rounded-lg px-4 py-2 outline-none focus:bg-white/20 transition-colors"
              />
              {editingTask && (
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    onClick={() => {
                      setEditingTask(null)
                      setNewTask('')
                    }}
                    className="text-white/70 hover:text-white text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={updateTask}
                    className="text-white bg-white/20 hover:bg-white/30 px-3 py-1 rounded-md text-sm"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            <div className="flex-grow overflow-y-auto">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={visibleTasks} strategy={verticalListSortingStrategy}>
                  {visibleTasks.map((task) => (
                    <SortableTask
                      key={task.id}
                      task={task}
                      onToggle={toggleTask}
                      onDelete={deleteTask}
                      onEdit={startEditingTask}
                      onFocusToggle={toggleFocus}
                      isDragDisabled={!!editingTask}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default TodoModal
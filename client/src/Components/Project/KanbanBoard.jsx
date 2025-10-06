import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus, MoreVertical, Calendar, User, Flag } from 'lucide-react';

const KanbanBoard = ({ projectId, socket }) => {
  const [columns, setColumns] = useState({
    todo: { id: 'todo', title: 'To Do', tasks: [] },
    inProgress: { id: 'inProgress', title: 'In Progress', tasks: [] },
    done: { id: 'done', title: 'Done', tasks: [] }
  });
  const [showAddTask, setShowAddTask] = useState(null);

  useEffect(() => {
    fetchTasks();

    // Socket.io real-time updates
    if (socket) {
      socket.on('taskCreated', (task) => {
        addTaskToColumn(task.status, task);
      });

      socket.on('taskUpdated', (task) => {
        updateTask(task);
      });

      socket.on('taskDeleted', (taskId) => {
        removeTask(taskId);
      });
    }

    return () => {
      if (socket) {
        socket.off('taskCreated');
        socket.off('taskUpdated');
        socket.off('taskDeleted');
      }
    };
  }, [projectId, socket]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/tasks`);
      const tasks = await response.json();
      
      const newColumns = {
        todo: { ...columns.todo, tasks: [] },
        inProgress: { ...columns.inProgress, tasks: [] },
        done: { ...columns.done, tasks: [] }
      };

      tasks.forEach(task => {
        if (newColumns[task.status]) {
          newColumns[task.status].tasks.push(task);
        }
      });

      setColumns(newColumns);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTaskToColumn = (columnId, task) => {
    setColumns(prev => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        tasks: [...prev[columnId].tasks, task]
      }
    }));
  };

  const updateTask = (updatedTask) => {
    setColumns(prev => {
      const newColumns = { ...prev };
      Object.keys(newColumns).forEach(columnId => {
        newColumns[columnId] = {
          ...newColumns[columnId],
          tasks: newColumns[columnId].tasks.map(task =>
            task.id === updatedTask.id ? updatedTask : task
          )
        };
      });
      return newColumns;
    });
  };

  const removeTask = (taskId) => {
    setColumns(prev => {
      const newColumns = { ...prev };
      Object.keys(newColumns).forEach(columnId => {
        newColumns[columnId] = {
          ...newColumns[columnId],
          tasks: newColumns[columnId].tasks.filter(task => task.id !== taskId)
        };
      });
      return newColumns;
    });
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceTasks = [...sourceColumn.tasks];
    const destTasks = source.droppableId === destination.droppableId ? sourceTasks : [...destColumn.tasks];

    const [movedTask] = sourceTasks.splice(source.index, 1);
    destTasks.splice(destination.index, 0, movedTask);

    const newColumns = {
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        tasks: sourceTasks
      },
      [destination.droppableId]: {
        ...destColumn,
        tasks: destTasks
      }
    };

    setColumns(newColumns);

    // Update backend
    try {
      await fetch(`/api/tasks/${movedTask.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: destination.droppableId })
      });

      if (socket) {
        socket.emit('taskMoved', {
          taskId: movedTask.id,
          newStatus: destination.droppableId
        });
      }
    } catch (error) {
      console.error('Error updating task:', error);
      setColumns(columns); // Revert on error
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.values(columns).map((column) => (
            <div key={column.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {column.title}
                  <span className="ml-2 text-sm text-gray-500">
                    ({column.tasks.length})
                  </span>
                </h3>
                <button
                  onClick={() => setShowAddTask(column.id)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <Plus size={20} className="text-gray-600" />
                </button>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[200px] space-y-3 ${
                      snapshot.isDraggingOver ? 'bg-blue-50' : ''
                    } rounded-lg p-2 transition-colors`}
                  >
                    {column.tasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 ${
                              snapshot.isDragging ? 'shadow-lg' : ''
                            } transition-shadow`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-gray-800 flex-1">
                                {task.title}
                              </h4>
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <MoreVertical size={16} className="text-gray-600" />
                              </button>
                            </div>

                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {task.description}
                            </p>

                            <div className="flex items-center gap-2 flex-wrap">
                              {task.priority && (
                                <span
                                  className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${getPriorityColor(
                                    task.priority
                                  )}`}
                                >
                                  <Flag size={12} />
                                  {task.priority}
                                </span>
                              )}

                              {task.dueDate && (
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <Calendar size={12} />
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>

                            {task.assignee && (
                              <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                                <User size={16} />
                                <span>{task.assignee.name}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
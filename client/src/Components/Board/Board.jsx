/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import Column from './Column';
import TaskModal from './TaskModal';
import { io } from 'socket.io-client';

const Board = ({ projectId }) => {
  const [columns, setColumns] = useState({
    todo: {
      id: 'todo',
      title: 'To Do',
      taskIds: []
    },
    inprogress: {
      id: 'inprogress',
      title: 'In Progress',
      taskIds: []
    },
    done: {
      id: 'done',
      title: 'Done',
      taskIds: []
    }
  });

  const [tasks, setTasks] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [socket, setSocket] = useState(null);

  // Initialize Socket.io connection
  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');
    setSocket(newSocket);

    newSocket.emit('joinProject', projectId);

    // Listen for real-time updates
    newSocket.on('taskUpdated', (updatedTask) => {
      setTasks(prev => ({
        ...prev,
        [updatedTask.id]: updatedTask
      }));
    });

    newSocket.on('taskMoved', ({ taskId, sourceColumn, destColumn, sourceIndex, destIndex }) => {
      handleTaskMoveFromSocket(taskId, sourceColumn, destColumn, sourceIndex, destIndex);
    });

    return () => newSocket.close();
  }, [projectId]);

  // Fetch initial data
  useEffect(() => {
    fetchBoardData();
  }, [projectId]);

  const fetchBoardData = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/board`);
      const data = await response.json();
      setTasks(data.tasks);
      setColumns(data.columns);
    } catch (error) {
      console.error('Error fetching board data:', error);
    }
  };

  const handleTaskMoveFromSocket = (taskId, sourceColumn, destColumn, sourceIndex, destIndex) => {
    setColumns(prev => {
      const newColumns = { ...prev };
      const sourceCol = { ...newColumns[sourceColumn] };
      const destCol = { ...newColumns[destColumn] };

      // Remove from source
      sourceCol.taskIds = sourceCol.taskIds.filter(id => id !== taskId);

      // Add to destination
      destCol.taskIds.splice(destIndex, 0, taskId);

      newColumns[sourceColumn] = sourceCol;
      newColumns[destColumn] = destCol;

      return newColumns;
    });
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = columns[source.droppableId];
    const finish = columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds
      };

      setColumns({
        ...columns,
        [newColumn.id]: newColumn
      });
    } else {
      const startTaskIds = Array.from(start.taskIds);
      startTaskIds.splice(source.index, 1);
      const newStart = {
        ...start,
        taskIds: startTaskIds
      };

      const finishTaskIds = Array.from(finish.taskIds);
      finishTaskIds.splice(destination.index, 0, draggableId);
      const newFinish = {
        ...finish,
        taskIds: finishTaskIds
      };

      setColumns({
        ...columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish
      });

      // Emit socket event
      if (socket) {
        socket.emit('moveTask', {
          projectId,
          taskId: draggableId,
          sourceColumn: source.droppableId,
          destColumn: destination.droppableId,
          sourceIndex: source.index,
          destIndex: destination.index
        });
      }

      // Update backend
      try {
        await fetch(`/api/tasks/${draggableId}/move`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: destination.droppableId,
            position: destination.index
          })
        });
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  };

  const handleCreateTask = (columnId) => {
    setSelectedTask({ columnId });
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (taskData.id) {
        // Update existing task
        const response = await fetch(`/api/tasks/${taskData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData)
        });
        const updatedTask = await response.json();
        
        setTasks(prev => ({
          ...prev,
          [updatedTask.id]: updatedTask
        }));

        if (socket) {
          socket.emit('updateTask', { projectId, task: updatedTask });
        }
      } else {
        // Create new task
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...taskData, projectId })
        });
        const newTask = await response.json();
        
        setTasks(prev => ({
          ...prev,
          [newTask.id]: newTask
        }));

        setColumns(prev => ({
          ...prev,
          [taskData.columnId]: {
            ...prev[taskData.columnId],
            taskIds: [...prev[taskData.columnId].taskIds, newTask.id]
          }
        }));

        if (socket) {
          socket.emit('createTask', { projectId, task: newTask });
        }
      }
      
      setIsModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleDeleteTask = async (taskId, columnId) => {
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE'
      });

      setTasks(prev => {
        const newTasks = { ...prev };
        delete newTasks[taskId];
        return newTasks;
      });

      setColumns(prev => ({
        ...prev,
        [columnId]: {
          ...prev[columnId],
          taskIds: prev[columnId].taskIds.filter(id => id !== taskId)
        }
      }));

      if (socket) {
        socket.emit('deleteTask', { projectId, taskId });
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const columnOrder = ['todo', 'inprogress', 'done'];

  return (
    <div className="h-full bg-gray-50 p-6">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 h-full overflow-x-auto pb-4">
          {columnOrder.map(columnId => {
            const column = columns[columnId];
            const columnTasks = column.taskIds.map(taskId => tasks[taskId]).filter(Boolean);

            return (
              <Column
                key={column.id}
                column={column}
                tasks={columnTasks}
                onCreateTask={handleCreateTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            );
          })}
        </div>
      </DragDropContext>

      {isModalOpen && (
        <TaskModal
          task={selectedTask}
          onSave={handleSaveTask}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
};

export default Board;
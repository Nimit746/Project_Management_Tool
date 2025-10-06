import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import ProjectList from './ProjectList';
import ProjectDetail from './ProjectDetail';
import CreateProjectModal from './CreateProjectModal';

const ProjectContainer = () => {
  const [socket, setSocket] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  useEffect(() => {
    // Initialize Socket.io connection
    const newSocket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setConnectionStatus('connected');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnectionStatus('disconnected');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setConnectionStatus('error');
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    if (socket) {
      socket.emit('joinProject', project.id);
    }
  };

  const handleBackToProjects = () => {
    if (socket && selectedProject) {
      socket.emit('leaveProject', selectedProject.id);
    }
    setSelectedProject(null);
  };

  const handleCreateProject = (newProject) => {
    setShowCreateModal(false);
    // Optionally refresh the project list or navigate to the new project
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Connection Status Indicator */}
      {connectionStatus !== 'connected' && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div
            className={`text-center py-2 text-sm ${
              connectionStatus === 'connecting'
                ? 'bg-yellow-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {connectionStatus === 'connecting' && 'Connecting to server...'}
            {connectionStatus === 'disconnected' && 'Connection lost. Reconnecting...'}
            {connectionStatus === 'error' && 'Connection error. Please refresh the page.'}
          </div>
        </div>
      )}

      {/* Main Content */}
      {!selectedProject ? (
        <ProjectList
          onProjectSelect={handleProjectSelect}
          onCreateProject={() => setShowCreateModal(true)}
        />
      ) : (
        <ProjectDetail
          project={selectedProject}
          onBack={handleBackToProjects}
          socket={socket}
        />
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
};

export default ProjectContainer;
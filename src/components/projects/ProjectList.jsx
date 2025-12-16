import React, { useState } from 'react';

const ProjectList = ({ initialProjects }) => {
    const [projects] = useState(initialProjects);
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'

    return (
        <div className="project-list-container">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-200' : 'bg-transparent'}`}
                    >
                        List
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-200' : 'bg-transparent'}`}
                    >
                        Grid
                    </button>
                </div>
            </div>

            {viewMode === 'list' ? (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="p-4 font-semibold text-gray-600">Proyecto</th>
                                <th className="p-4 font-semibold text-gray-600">Código</th>
                                <th className="p-4 font-semibold text-gray-600">Cliente</th>
                                <th className="p-4 font-semibold text-gray-600">Estado</th>
                                <th className="p-4 font-semibold text-gray-600">Avance</th>
                                <th className="p-4 font-semibold text-gray-600">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project) => (
                                <tr key={project.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-gray-900">{project.name}</td>
                                    <td className="p-4 text-gray-500">{project.code}</td>
                                    <td className="p-4 text-gray-600">{project.client || '-'}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium 
                                            ${project.status === 'active' ? 'bg-green-100 text-green-700' :
                                                project.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-gray-100 text-gray-700'}`}>
                                            {project.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-[100px]">
                                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
                                        </div>
                                        <span className="text-xs text-gray-500 mt-1">{project.progress}%</span>
                                    </td>
                                    <td className="p-4">
                                        <a href={`/proyectos/${project.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                            Ver Detalles
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                                    <span className="text-sm text-gray-500">{project.code}</span>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-medium 
                                    ${project.status === 'active' ? 'bg-green-100 text-green-700' :
                                        project.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-gray-100 text-gray-700'}`}>
                                    {project.status}
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description || 'Sin descripción'}</p>
                            <div className="mb-4">
                                <div className="flex justify-between text-xs mb-1">
                                    <span>Avance</span>
                                    <span>{project.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                                </div>
                            </div>
                            <a href={`/proyectos/${project.id}`} className="block text-center w-full py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium transition-colors">
                                Ver Detalles
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectList;

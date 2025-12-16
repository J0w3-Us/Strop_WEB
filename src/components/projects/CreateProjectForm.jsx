import React, { useState } from 'react';
import { dataService } from '../../services/dataService';

const CreateProjectForm = ({ onSuccess, onCancel }) => {
    const [activeTab, setActiveTab] = useState('manual'); // 'manual' | 'excel'
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        client: '',
        location: '',
        startDate: '',
        endDate: '',
        description: ''
    });
    const [importFile, setImportFile] = useState(null);
    const [importStatus, setImportStatus] = useState('idle'); // 'idle' | 'parsing' | 'ready' | 'success' | 'error'

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleManualSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const newProject = await dataService.projects.create({
                ...formData,
                code: formData.name.substring(0, 2).toUpperCase(), // Auto-generate simple code
                status: 'active'
            });

            // Si se pasa onSuccess, llamar y no redirigir
            if (onSuccess) {
                onSuccess(newProject);
            } else {
                window.location.href = '/proyectos';
            }
        } catch (error) {
            console.error(error);
            alert('Error al crear proyecto');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
        if (file) {
            setImportFile(file);
            setImportStatus('ready');
        }
    };

    const handleImportSubmit = async () => {
        if (!importFile) return;
        setIsLoading(true);
        try {
            const result = await dataService.projects.importFromExcel(importFile);
            if (result.success) {
                setImportStatus('success');
                setTimeout(() => {
                    if (onSuccess) onSuccess();
                    else window.location.href = '/proyectos';
                }, 1500);
            }
        } catch (error) {
            console.error(error);
            setImportStatus('error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold mb-1 text-gray-800">Nuevo Proyecto</h2>
            <p className="text-gray-500 mb-6 text-sm">Crea un proyecto manualmente o importa desde Excel</p>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    onClick={() => setActiveTab('manual')}
                    className={`flex-1 py-3 text-center text-sm font-medium transition-colors 
                        ${activeTab === 'manual' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Formulario Manual
                </button>
                <button
                    onClick={() => setActiveTab('excel')}
                    className={`flex-1 py-3 text-center text-sm font-medium transition-colors 
                        ${activeTab === 'excel' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Importar Excel
                </button>
            </div>

            <div className="">
                {activeTab === 'manual' ? (
                    <form onSubmit={handleManualSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">Nombre del Proyecto</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                    value={formData.name}
                                    placeholder="Ej. Torre Aurora"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">Cliente</label>
                                <input
                                    type="text"
                                    name="client"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                    value={formData.client}
                                    placeholder="Ej. Grupo Inmobiliario"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">Dirección</label>
                                <input
                                    type="text"
                                    name="location"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                    value={formData.location}
                                    placeholder="Ej. Av. Reforma 123"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">Fecha Inicio</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                    value={formData.startDate}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">Fecha Fin (Estimada)</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                    value={formData.endDate}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">Descripción</label>
                                <textarea
                                    name="description"
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm resize-none"
                                    value={formData.description}
                                    placeholder="Breve descripción del proyecto..."
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50"
                            >
                                {isLoading ? 'Creando...' : 'Crear Proyecto'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="text-center py-12">
                        {importStatus === 'success' ? (
                            <div className="text-green-600">
                                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                <h3 className="text-lg font-medium">Importación exitosa</h3>
                                <p className="text-gray-500 mt-2">Redirigiendo a proyectos...</p>
                            </div>
                        ) : (
                            <div
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleFileDrop}
                                className="border-2 border-dashed border-gray-300 rounded-xl p-12 hover:border-blue-500 transition-colors cursor-pointer bg-gray-50"
                            >
                                <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                <p className="text-gray-600 font-medium mb-1">Arrastra tu archivo Excel aquí</p>
                                <p className="text-sm text-gray-500 mb-6">o selecciona un archivo de tu equipo</p>

                                <input
                                    type="file"
                                    accept=".xlsx, .xls"
                                    className="hidden"
                                    id="file-upload"
                                    onChange={handleFileDrop}
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 cursor-pointer shadow-sm"
                                >
                                    Seleccionar Archivo
                                </label>

                                {importFile && (
                                    <div className="mt-6 p-4 bg-blue-50 rounded-lg text-left max-w-sm mx-auto flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" /></svg>
                                            <span className="text-sm font-medium text-gray-900 truncate">{importFile.name}</span>
                                        </div>
                                        <button onClick={() => setImportFile(null)} className="text-gray-400 hover:text-red-500">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                        </button>
                                    </div>
                                )}

                                {importFile && (
                                    <button
                                        onClick={handleImportSubmit}
                                        disabled={isLoading}
                                        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 w-full max-w-xs"
                                    >
                                        {isLoading ? 'Importando...' : 'Confirmar Importación'}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateProjectForm;

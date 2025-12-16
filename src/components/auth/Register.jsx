
import React, { useState } from 'react';
import { apiService } from '../../services/apiService';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        organizationName: ''
    });
    const [error, setError] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        // TODO: Implementar validación estricta de contraseña (mayúsculas, números, símbolos) según @Astro...
        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden.");
            setIsLoading(false);
            return;
        }

        try {
            await apiService.register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                organizationName: formData.organizationName
            });

            setIsSuccess(true);
            // Redirigir al login después de unos segundos
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);

        } catch (err) {
            setError(err.message || "Error al registrar cuenta.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="auth-card">
                <div className="success-message">
                    <div className="success-title">¡Registro Exitoso!</div>
                    <p>Tu cuenta ha sido creada correctamente.</p>
                    <p>Redirigiendo al login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-card">
            <div className="auth-header">
                <h2 className="auth-title">Crear Cuenta</h2>
                <p className="auth-subtitle">Comienza a gestionar tus proyectos de construcción</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Nombre Completo</label>
                        <input
                            name="name"
                            type="text"
                            className="form-input"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Juan Pérez"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Nombre de Empresa</label>
                        <input
                            name="organizationName"
                            type="text"
                            className="form-input"
                            value={formData.organizationName}
                            onChange={handleChange}
                            required
                            placeholder="Constructora ABC"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                        name="email"
                        type="email"
                        className="form-input"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="admin@constructora.com"
                        disabled={isLoading}
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Contraseña</label>
                        <input
                            name="password"
                            type="password"
                            className="form-input"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                            placeholder="••••••••"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Confirmar Contraseña</label>
                        <input
                            name="confirmPassword"
                            type="password"
                            className="form-input"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="••••••••"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                {error && (
                    <div className="error-alert">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                        </svg>
                        {error}
                    </div>
                )}

                <button type="submit" disabled={isLoading} className="auth-button">
                    {isLoading ? 'Creando Cuenta...' : 'Crear Cuenta'}
                </button>
            </form>

            <div className="auth-footer">
                ¿Ya tienes cuenta? <a href="/login" className="auth-link">Iniciar Sesión</a>
            </div>
        </div>
    );
}


import React, { useState } from 'react';
import { apiService } from '../../services/apiService';
import { setAuthSuccess, setAuthError, setAuthLoading } from '../../store/authStore';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError(null);
        setIsLoading(true);
        setAuthLoading(true);

        try {
            // TODO: Implementar validación de email (regex) según reglas de @Astro_...
            // TODO: Validar longitud mínima de contraseña antes de enviar

            const response = await apiService.login({ email, password });

            // Guardar sesión en el store global
            setAuthSuccess(response.user, response.token);

            // SIMULACIÓN: Establecer cookie para Middleware
            document.cookie = `sb-access-token=${response.token}; path=/; max-age=3600; SameSite=Lax`;

            // TODO: Aquí se deben establecer las Cookies HttpOnly para la sesión segura (server-side)
            // fetch('/api/auth/signin', { method: 'POST', body: ... })

            console.log('Login exitoso, redirigiendo...');
            window.location.href = '/dashboard';

        } catch (error) {
            console.error('Login error:', error);
            setLocalError(error.message);
            setAuthError(error.message);
        } finally {
            setIsLoading(false);
            setAuthLoading(false);
        }
    };

    return (
        <div className='auth-card'>
            <div className="auth-header">
                <h2 className="auth-title">Bienvenido a STROP</h2>
                <p className="auth-subtitle">Gestión inteligente de obras.</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label htmlFor="email" className="form-label">Correo Electrónico</label>
                    <input
                        id="email"
                        type="email"
                        className="form-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="admin@strop.com"
                        disabled={isLoading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <input
                        id="password"
                        type="password"
                        className="form-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="******"
                        disabled={isLoading}
                    />
                </div>

                {localError && (
                    <div className="error-alert">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                        </svg>
                        {localError}
                    </div>
                )}

                <button type="submit" disabled={isLoading} className="auth-button">
                    {isLoading ? 'Ingresando...' : 'Iniciar Sesión'}
                </button>
            </form>

            <div className="auth-footer">
                ¿No tienes cuenta? <a href="/registro" className="auth-link">Regístrate aquí</a>
            </div>
        </div>
    );
}

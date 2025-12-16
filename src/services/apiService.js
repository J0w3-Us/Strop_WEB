
// src/services/apiService.js

/**
 * Servicio de API simulado para autenticación y datos.
 * Funciona como un "Mock Backend" local.
 */

const MOCK_DELAY = 800; // Latencia ligera para sentirlo real pero rápido

// Base de datos local simulada (en memoria)
const MOCK_DB = {
    users: [
        {
            id: 'user_admin',
            email: 'admin@strop.com',
            password: 'password123', // En un caso real, esto estaría hasheado
            name: 'Admin Strop',
            role: 'owner_admin',
            organization_id: 'org_main'
        }
    ]
};

export const apiService = {
    /**
     * Iniciar sesión
     * @param {Object} credenciales - { email, password }
     */
    login: async ({ email, password }) => {
        return new Promise((resolve, reject) => {
            console.log(`[MockAPI] Intentando login para: ${email}`);

            setTimeout(() => {
                // 1. Buscar usuario en "DB" local
                const user = MOCK_DB.users.find(u => u.email === email);

                // 2. Validar contraseña (Simulación simple)
                // Nota: Permitimos entrar con CUALQUIER contraseña si es > 6 chars para facilitar pruebas,
                // SALVO que coincida con el admin hardcodeado, que validamos estricto para demo.
                const isAdminUser = email === 'admin@strop.com';
                const passwordValid = isAdminUser ? password === 'password123' : password.length >= 6;

                if (user && passwordValid) {
                    console.log('[MockAPI] Login exitoso');
                    resolve({
                        user: {
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            role: user.role,
                            organization_id: user.organization_id
                        },
                        token: `mock_token_${Date.now()}_${Math.random().toString(36).substring(2)}`
                    });
                } else if (!isAdminUser && password.length >= 6) {
                    // Permitir acceso a usuarios "nuevos" o no registrados en mock para facilitar testeo
                    console.log('[MockAPI] Login exitoso (Usuario genérico)');
                    resolve({
                        user: {
                            id: `user_${Date.now()}`,
                            email: email,
                            name: 'Usuario Test',
                            role: 'resident',
                            organization_id: 'org_demo'
                        },
                        token: `mock_token_${Date.now()}_generic`
                    });
                } else {
                    console.error('[MockAPI] Credenciales inválidas');
                    reject(new Error('Credenciales inválidas. (Tip: usa admin@strop.com / password123 o cualquier email con pass > 6 chars)'));
                }
            }, MOCK_DELAY);
        });
    },

    /**
     * Registrar nuevo usuario
     */
    register: async (datosUsuario) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!datosUsuario.email.includes('@')) {
                    reject(new Error('Email inválido.'));
                    return;
                }

                // Simular guardado en DB
                const newUser = {
                    id: `user_${Date.now()}`,
                    ...datosUsuario,
                    role: 'owner_admin' // El que crea la cuenta suele ser el admin
                };
                MOCK_DB.users.push(newUser);

                console.log('[MockAPI] Usuario registrado:', newUser);

                resolve({
                    success: true,
                    message: 'Cuenta creada exitosamente.'
                });
            }, MOCK_DELAY);
        });
    },

    logout: async () => {
        return new Promise((resolve) => resolve({ success: true }));
    }
};

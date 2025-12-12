// Client login logic (moved out of the Astro template)
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        const form = document.querySelector('.login-form');
        if (!form) return;

        const pw = document.getElementById('password');
        const toggle = document.getElementById('pw-toggle');
        const submit = document.getElementById('login-submit');
        const spinner = submit ? submit.querySelector('.btn-spinner') : null;
        const btnText = submit ? submit.querySelector('.btn-text') : null;
        const err = document.getElementById('form-error');

        function showError(message) {
            if (!err) return;
            err.textContent = message;
            err.hidden = false;
        }

        // Toggle password visibility
        if (toggle && pw) {
            toggle.addEventListener('click', () => {
                const showing = pw.type === 'text';
                pw.type = showing ? 'password' : 'text';
                toggle.setAttribute('aria-pressed', String(!showing));
                const icon = toggle.querySelector('.material-symbols-outlined');
                if (icon) icon.textContent = showing ? 'visibility' : 'visibility_off';
            });
        }

        // Submit handler with disabled state and spinner
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!submit) return;

            // reset error
            if (err) {
                err.textContent = '';
                err.hidden = true;
            }

            submit.disabled = true;
            if (spinner) spinner.hidden = false;
            if (btnText) btnText.style.opacity = '0.6';

            try {
                // Simulate API by fetching a local JSON of mock users
                const emailVal = String(form.email?.value || form.email?.getAttribute?.('value') || '');
                const passwordVal = String(form.password?.value || form.password?.getAttribute?.('value') || '');

                const res = await fetch('/mock/users.json', { method: 'GET', credentials: 'same-origin' });
                if (!res.ok) throw new Error('No se pudo cargar el mock de usuarios');
                const users = await res.json().catch(() => []);

                const match = Array.isArray(users)
                    ? users.find((u) => (u.email === emailVal || u.username === emailVal) && u.password === passwordVal)
                    : null;

                if (match) {
                    // simulate storing token and user
                    localStorage.setItem('authToken', 'mock-token-' + Date.now());
                    localStorage.setItem('user', JSON.stringify({ name: match.name, email: match.email }));
                    window.location.href = match.redirectTo || '/dashbord';
                    return;
                }

                showError('Usuario o contraseña incorrectos');
            } catch (ex) {
                showError('Error interno. Intenta de nuevo.');
                console.error('Mock login failed', ex);
            } finally {
                submit.disabled = false;
                if (spinner) spinner.hidden = true;
                if (btnText) btnText.style.opacity = '';
            }
        });
    });
})();

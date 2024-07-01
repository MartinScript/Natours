import '@babel/polyfill';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';

const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const updateForm = document.querySelector('.form-user-data');
const passwordUpdateForm = document.querySelector('.form-user-password');


if (loginForm) {
    loginForm.addEventListener('submit', (el) => {
        el.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    })
};

if (logOutBtn) {
    logOutBtn.addEventListener('click', logout);
};

if (updateForm) {
    updateForm.addEventListener('submit', (el) => {
        el.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        updateSettings({ name, email }, 'data');
    })
};

if (passwordUpdateForm) {
    passwordUpdateForm.addEventListener('submit', async (el) => {
        el.preventDefault();
        document.querySelector('.btn--save-password').textContent = 'Updating...';

        const passwordCurrent = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        await updateSettings({ passwordCurrent, password, passwordConfirm }, 'password');

        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
        document.querySelector('.btn--save-password').textContent = 'Save password';
    })
};
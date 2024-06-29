import axios from 'axios';

const form = document.querySelector('.form');

export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:3000/api/v1/users/login',
            data: {
                email,
                password
            }
        });
        if (res.data.status === 'success') {
            alert('Login successful');
            window.setTimeout(() => {
                location.assign('/')
            }, 1500)
        }
    } catch (err) {
        alert(err.response.data.message);
    }
};
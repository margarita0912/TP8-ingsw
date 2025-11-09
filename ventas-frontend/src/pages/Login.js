import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import api from '../api/axios';
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const handleLogin = async () => {
        try {
            const res = await api.post('/login', { nombre: email, clave: password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('rol', res.data.rol);
            window.location.href = '/';
        }
        catch (err) {
            setError('Credenciales inválidas');
        }
    };
    return (_jsxs("div", { children: [_jsx("h2", { children: "\uD83D\uDD10 Login" }), _jsx("input", { placeholder: "Email", value: email, onChange: e => setEmail(e.target.value) }), _jsx("input", { placeholder: "Password", type: "password", value: password, onChange: e => setPassword(e.target.value) }), _jsx("button", { onClick: handleLogin, children: "Ingresar" }), error && _jsx("p", { style: { color: 'red' }, children: error })] }));
}

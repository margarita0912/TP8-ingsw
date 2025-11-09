import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import api from '../api/axios';
export default function CrearUsuario() {
    const [nombre, setNombre] = useState('');
    const [clave, setClave] = useState('');
    const [rolNuevo, setRolNuevo] = useState('comprador');
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');
    const [permitido, setPermitido] = useState(false);
    useEffect(() => {
        const rol = localStorage.getItem('rol');
        setPermitido(rol === 'precio');
    }, []);
    const crear = async () => {
        setError('');
        setExito('');
        try {
            const token = localStorage.getItem('token');
            await api.post('/usuarios', { nombre, clave, rol: rolNuevo }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExito('✅ Usuario creado con éxito');
            setNombre('');
            setClave('');
            setRolNuevo('comprador');
        }
        catch (err) {
            setError('❌ Error al crear usuario');
        }
    };
    if (!permitido) {
        return (_jsx("div", { className: "text-center mt-10 text-red-600 font-semibold", children: "\u26D4 No ten\u00E9s permisos para acceder a esta secci\u00F3n." }));
    }
    return (_jsxs("div", { className: "max-w-md mx-auto mt-10 bg-white p-6 rounded shadow-md border border-gray-200", children: [_jsx("h2", { className: "text-2xl font-bold mb-4 text-blue-700", children: "\uD83D\uDC64 Crear Usuario" }), _jsx("label", { className: "block mb-2 font-medium", children: "Nombre" }), _jsx("input", { className: "border p-2 w-full mb-4 rounded", value: nombre, onChange: e => setNombre(e.target.value), placeholder: "Ej: lucas" }), _jsx("label", { className: "block mb-2 font-medium", children: "Clave" }), _jsx("input", { className: "border p-2 w-full mb-4 rounded", type: "password", value: clave, onChange: e => setClave(e.target.value), placeholder: "Ej: clave123" }), _jsx("label", { className: "block mb-2 font-medium", children: "Rol" }), _jsxs("select", { className: "border p-2 w-full mb-4 rounded", value: rolNuevo, onChange: e => setRolNuevo(e.target.value), children: [_jsx("option", { value: "comprador", children: "Comprador" }), _jsx("option", { value: "vendedor", children: "Vendedor" }), _jsx("option", { value: "precio", children: "Precio" })] }), _jsx("button", { className: "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full", onClick: crear, children: "Crear Usuario" }), exito && _jsx("p", { className: "text-green-600 mt-4", children: exito }), error && _jsx("p", { className: "text-red-600 mt-4", children: error })] }));
}

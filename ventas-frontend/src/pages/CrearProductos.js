import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import api from '../api/axios';
export default function CrearProductos() {
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [stock, setStock] = useState('');
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');
    const [permitido, setPermitido] = useState(false);
    useEffect(() => {
        const rol = localStorage.getItem('rol');
        setPermitido(rol === 'vendedor' || rol === 'comprador');
    }, []);
    const crear = async () => {
        setError('');
        setExito('');
        if (!nombre || precio === '' || stock === '') {
            setError('Todos los campos son obligatorios');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await api.post('/productos', { nombre, precio, stock }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExito('✅ Producto creado con éxito');
            setNombre('');
            setPrecio('');
            setStock('');
        }
        catch (err) {
            setError('❌ Error al crear producto');
        }
    };
    if (!permitido) {
        return (_jsx("div", { className: "text-center mt-10 text-red-600 font-semibold", children: "\u26D4 No ten\u00E9s permisos para acceder a esta secci\u00F3n." }));
    }
    return (_jsxs("div", { className: "max-w-md mx-auto mt-10 bg-white p-6 rounded shadow-md border border-gray-200", children: [_jsx("h2", { className: "text-2xl font-bold mb-4 text-blue-700", children: "\uD83D\uDCE6 Crear Producto" }), _jsx("label", { className: "block mb-2 font-medium", children: "Nombre" }), _jsx("input", { className: "border p-2 w-full mb-4 rounded", value: nombre, onChange: e => setNombre(e.target.value), placeholder: "Ej: Camisa" }), _jsx("label", { className: "block mb-2 font-medium", children: "Precio" }), _jsx("input", { className: "border p-2 w-full mb-4 rounded", type: "number", value: precio, onChange: e => setPrecio(parseFloat(e.target.value)), placeholder: "Ej: 2500", min: 0 }), _jsx("label", { className: "block mb-2 font-medium", children: "Stock" }), _jsx("input", { className: "border p-2 w-full mb-4 rounded", type: "number", value: stock, onChange: e => setStock(parseInt(e.target.value)), placeholder: "Ej: 10", min: 0 }), _jsx("button", { className: "bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full", onClick: crear, children: "Crear Producto" }), exito && _jsx("p", { className: "text-green-600 mt-4", children: exito }), error && _jsx("p", { className: "text-red-600 mt-4", children: error })] }));
}

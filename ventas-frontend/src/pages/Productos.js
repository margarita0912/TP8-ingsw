import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import api from '../api/axios';
export default function Productos() {
    const [productos, setProductos] = useState([]);
    useEffect(() => {
        api.get('/productos')
            .then(res => setProductos(res.data))
            .catch(err => console.error(err));
    }, []);
    return (_jsxs("div", { children: [_jsx("h2", { children: "\uD83D\uDCE6 Productos" }), _jsx("ul", { children: productos.map((p) => (_jsxs("li", { children: [p.nombre, " \u2014 $", p.precio, " \u2014 Stock: ", p.stock] }, p.id))) })] }));
}

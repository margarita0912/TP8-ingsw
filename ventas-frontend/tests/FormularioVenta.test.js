import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
function FormularioVenta() {
    const [producto, setProducto] = React.useState('');
    const [precio, setPrecio] = React.useState(0);
    return (_jsxs("form", { children: [_jsxs("label", { children: ["Producto:", _jsx("input", { value: producto, onChange: (e) => setProducto(e.target.value), placeholder: "Nombre del producto" })] }), _jsxs("label", { children: ["Precio:", _jsx("input", { type: "number", value: precio, onChange: (e) => setPrecio(Number(e.target.value)), placeholder: "Precio" })] }), _jsx("button", { type: "submit", children: "Enviar" })] }));
}
test('permite ingresar producto y precio', () => {
    render(_jsx(FormularioVenta, {}));
    const inputProducto = screen.getByPlaceholderText('Nombre del producto');
    const inputPrecio = screen.getByPlaceholderText('Precio');
    fireEvent.change(inputProducto, { target: { value: 'Teclado' } });
    fireEvent.change(inputPrecio, { target: { value: '2500' } });
    expect(inputProducto).toHaveValue('Teclado');
    expect(inputPrecio).toHaveValue(2500);
});

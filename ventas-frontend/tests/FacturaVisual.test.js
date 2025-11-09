import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// tests/FacturaVisual.test.tsx
import { render, screen } from '@testing-library/react';
function FacturaVisual({ producto, precio }) {
    return (_jsxs("div", { children: [_jsx("h2", { children: "Factura" }), _jsxs("p", { children: ["Producto: ", producto] }), _jsxs("p", { children: ["Precio: $", precio] })] }));
}
test('renderiza factura con datos correctos', () => {
    render(_jsx(FacturaVisual, { producto: "Mouse", precio: 100 }));
    expect(screen.getByText('Factura')).toBeInTheDocument();
    expect(screen.getByText('Producto: Mouse')).toBeInTheDocument();
    expect(screen.getByText('Precio: $100')).toBeInTheDocument();
});

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
export default function EntornoSelector() {
    const [entorno, setEntorno] = useState(localStorage.getItem('entorno') || 'qa');
    const cambiarEntorno = (nuevo) => {
        setEntorno(nuevo);
        localStorage.setItem('entorno', nuevo);
        window.location.reload();
    };
    return (_jsxs("div", { style: { marginBottom: '1rem' }, children: [_jsx("label", { children: "\uD83C\uDF10 Entorno actual: " }), _jsxs("select", { value: entorno, onChange: (e) => cambiarEntorno(e.target.value), children: [_jsx("option", { value: "qa", children: "QA" }), _jsx("option", { value: "prod", children: "PROD" })] })] }));
}

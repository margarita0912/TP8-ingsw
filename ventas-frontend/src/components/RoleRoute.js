import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
// src/components/RoleRoute.tsx
import { Navigate } from 'react-router-dom';
export default function RoleRoute({ allowed, children, }) {
    const rol = localStorage.getItem('rol') || '';
    return allowed.includes(rol) ? _jsx(_Fragment, { children: children }) : _jsx(Navigate, { to: "/", replace: true });
}

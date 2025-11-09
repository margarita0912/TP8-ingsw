import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Link } from 'react-router-dom';
import EntornoSelector from './components/EntornoSelector';
import RoleRoute from './components/RoleRoute';
import Login from './pages/Login';
import Productos from './pages/Productos';
import Ventas from './pages/Ventas';
import CrearUsuario from './pages/CrearUsuario';
import CrearProductos from './pages/CrearProductos';
function App() {
    const rol = localStorage.getItem('rol') || ''; // 'admin' | 'vendedor' | 'comprador' | 'precio' | ''
    return (_jsxs("div", { style: { padding: '2rem' }, children: [_jsx("h1", { children: "\uD83D\uDECD\uFE0F Ventas App" }), _jsx(EntornoSelector, {}), _jsxs("nav", { children: [_jsx(Link, { to: "/", children: "Productos" }), ['vendedor'].includes(rol) && _jsxs(_Fragment, { children: [" | ", _jsx(Link, { to: "/ventas", children: "Ventas" })] }), _jsxs(_Fragment, { children: [" | ", _jsx(Link, { to: "/login", children: "Login" })] }), ['comprador', 'precio'].includes(rol) && (_jsxs(_Fragment, { children: [" | ", _jsx(Link, { to: "/crear-usuario", children: "Crear Usuario" })] })), ['vendedor', 'comprador'].includes(rol) && (_jsxs(_Fragment, { children: [" | ", _jsx(Link, { to: "/crear-producto", children: "Crear Producto" })] }))] }), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Productos, {}) }), _jsx(Route, { path: "/ventas", element: _jsx(RoleRoute, { allowed: ['vendedor'], children: _jsx(Ventas, {}) }) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/crear-usuario", element: _jsx(RoleRoute, { allowed: ['comprador', 'precio'], children: _jsx(CrearUsuario, {}) }) }), _jsx(Route, { path: "/crear-producto", element: _jsx(RoleRoute, { allowed: ['vendedor', 'comprador'], children: _jsx(CrearProductos, {}) }) })] })] }));
}
export default App;

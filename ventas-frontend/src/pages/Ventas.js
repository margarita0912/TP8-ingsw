import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import api from '../api/axios';
export default function Ventas() {
    const [productos, setProductos] = useState([]);
    const [productoId, setProductoId] = useState(''); // guardamos el ID seleccionado como string
    const [cantidad, setCantidad] = useState(1);
    const [descuento, setDescuento] = useState(0);
    const [items, setItems] = useState([]);
    const [error, setError] = useState('');
    const [filtrarStock, setFiltrarStock] = useState(true);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                setLoading(true);
                const res = await api.get('/productos');
                // Normalizamos por si el backend usa otras claves o tipos
                const normalizados = (res.data || []).map((raw) => ({
                    id: Number(raw.id ??
                        raw.ID ??
                        raw.producto_id ??
                        raw.productoId),
                    nombre: String(raw.nombre ?? raw.name ?? raw.descripcion ?? raw.descripcion_corta ?? 'Sin nombre'),
                    precio: Number(raw.precio ?? raw.price ?? raw.PRECIO ?? 0),
                    stock: Number(raw.stock ?? raw.STOCK ?? 0),
                }));
                console.log('Productos normalizados:', normalizados);
                setProductos(normalizados);
                setError('');
            }
            catch (err) {
                console.error('Error al cargar productos:', err);
                setError(`Error al cargar productos: ${err.response?.data?.error || err.message}`);
            }
            finally {
                setLoading(false);
            }
        };
        fetchProductos();
    }, []);
    const agregarItem = () => {
        if (!productoId) {
            setError('Seleccioná un producto válido');
            return;
        }
        // Buscamos por igualdad de string para evitar problemas de tipo
        const producto = productos.find(p => String(p.id) === productoId);
        if (!producto) {
            console.warn('IDs disponibles:', productos.map(p => p.id));
            console.warn('productoId seleccionado:', productoId);
            setError('Producto no encontrado');
            return;
        }
        if (filtrarStock && producto.stock < cantidad) {
            setError(`Stock insuficiente. Disponible: ${producto.stock}`);
            return;
        }
        if (cantidad <= 0) {
            setError('La cantidad debe ser mayor a 0');
            return;
        }
        const precioFinal = producto.precio - (producto.precio * descuento / 100);
        const nuevoItem = {
            productoId: producto.id,
            nombre: producto.nombre,
            cantidad,
            precioUnitario: producto.precio,
            descuento,
            precioFinal,
            subtotal: precioFinal * cantidad
        };
        setItems(prev => [...prev, nuevoItem]);
        setProductoId(''); // reseteo
        setCantidad(1);
        setDescuento(0);
        setError('');
    };
    const eliminarItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };
    const registrarVenta = async () => {
        if (items.length === 0) {
            setError('Agregá al menos un producto');
            return;
        }
        try {
            setLoading(true);
            setError('');
            const usuarioId = 1; // TODO: reemplazar por el ID real del usuario (auth)
            // Enviamos UNA request por cada item, en el formato que espera tu back
            const operaciones = items.map((item) => {
                const body = {
                    usuario_id: usuarioId,
                    producto_id: item.productoId,
                    cantidad: item.cantidad,
                    descuento: item.descuento
                };
                console.log('Enviando item:', body);
                return api.post('/ventas', body);
            });
            await Promise.all(operaciones);
            alert('✅ Venta registrada exitosamente');
            setItems([]);
            // Recargar productos (stock actualizado)
            const resProductos = await api.get('/productos');
            const normalizados = (resProductos.data || []).map((raw) => ({
                id: Number(raw.id ?? raw.ID ?? raw.producto_id ?? raw.productoId),
                nombre: String(raw.nombre ?? raw.name ?? raw.descripcion ?? 'Sin nombre'),
                precio: Number(raw.precio ?? raw.price ?? raw.PRECIO ?? 0),
                stock: Number(raw.stock ?? raw.STOCK ?? 0),
            }));
            setProductos(normalizados);
        }
        catch (err) {
            console.error('Error al registrar venta:', err);
            setError(`Error al registrar venta: ${err.response?.data?.error || err.message}`);
        }
        finally {
            setLoading(false);
        }
    };
    const totalBruto = items.reduce((sum, item) => sum + item.subtotal, 0);
    const iva = totalBruto * 0.21;
    const totalFinal = totalBruto + iva;
    const productosFiltrados = filtrarStock
        ? productos.filter(p => p.stock > 0)
        : productos;
    return (_jsxs("div", { className: "max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow-md", children: [_jsx("h2", { className: "text-2xl font-bold mb-6 text-blue-700", children: "\uD83E\uDDFE Registrar Venta" }), loading && _jsx("p", { className: "text-blue-600 mb-4", children: "\u23F3 Cargando..." }), error && _jsxs("p", { className: "text-red-600 mb-4", children: ["\u274C ", error] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block font-medium mb-1", children: "Producto" }), _jsxs("select", { className: "border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500", value: productoId, onChange: e => {
                            console.log('Select value:', e.target.value);
                            setProductoId(e.target.value);
                            setError('');
                        }, disabled: loading, children: [_jsx("option", { value: "", children: "-- Seleccionar producto --" }), productosFiltrados.map(p => (_jsxs("option", { value: String(p.id), children: [p.nombre, " - $", p.precio.toFixed(2), " (Stock: ", p.stock, ")"] }, p.id)))] }), productos.length === 0 && !loading && (_jsx("p", { className: "text-gray-500 text-sm mt-1", children: "No hay productos disponibles" }))] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block font-medium mb-1", children: "Cantidad" }), _jsx("input", { type: "number", className: "border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500", value: cantidad, onChange: e => setCantidad(Math.max(1, parseInt(e.target.value) || 1)), min: 1, disabled: loading })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-medium mb-1", children: "Descuento (%)" }), _jsx("input", { type: "number", className: "border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500", value: descuento, onChange: e => setDescuento(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0))), min: 0, max: 100, step: 0.1, disabled: loading })] })] }), _jsx("button", { className: "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full mb-4 disabled:bg-gray-400 disabled:cursor-not-allowed", onClick: agregarItem, disabled: loading || !productoId, children: "\u2795 Agregar al carrito" }), _jsx("div", { className: "mb-4", children: _jsxs("label", { className: "inline-flex items-center cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: filtrarStock, onChange: e => setFiltrarStock(e.target.checked), className: "mr-2" }), _jsx("span", { className: "text-sm", children: "Mostrar solo productos con stock" })] }) }), items.length > 0 && (_jsxs("div", { className: "mt-6", children: [_jsx("h3", { className: "text-xl font-semibold mb-2", children: "\uD83D\uDED2 Detalle de la venta" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full border text-sm", children: [_jsx("thead", { className: "bg-gray-100", children: _jsxs("tr", { children: [_jsx("th", { className: "border px-2 py-2", children: "Producto" }), _jsx("th", { className: "border px-2 py-2", children: "Cant." }), _jsx("th", { className: "border px-2 py-2", children: "Precio" }), _jsx("th", { className: "border px-2 py-2", children: "Desc." }), _jsx("th", { className: "border px-2 py-2", children: "Subtotal" }), _jsx("th", { className: "border px-2 py-2", children: "Acci\u00F3n" })] }) }), _jsx("tbody", { children: items.map((item, i) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "border px-2 py-2", children: item.nombre }), _jsx("td", { className: "border px-2 py-2 text-center", children: item.cantidad }), _jsxs("td", { className: "border px-2 py-2 text-right", children: ["$", item.precioUnitario.toFixed(2)] }), _jsxs("td", { className: "border px-2 py-2 text-center", children: [item.descuento, "%"] }), _jsxs("td", { className: "border px-2 py-2 text-right font-semibold", children: ["$", item.subtotal.toFixed(2)] }), _jsx("td", { className: "border px-2 py-2 text-center", children: _jsx("button", { onClick: () => eliminarItem(i), className: "text-red-600 hover:text-red-800 font-bold", title: "Eliminar", children: "\uD83D\uDDD1\uFE0F" }) })] }, i))) })] }) }), _jsx("div", { className: "bg-gray-100 p-4 rounded mt-4", children: _jsxs("div", { className: "text-right space-y-1", children: [_jsxs("p", { children: ["Total bruto: ", _jsxs("strong", { children: ["$", totalBruto.toFixed(2)] })] }), _jsxs("p", { children: ["IVA (21%): ", _jsxs("strong", { children: ["$", iva.toFixed(2)] })] }), _jsxs("p", { className: "text-blue-700 text-xl font-bold border-t-2 border-blue-700 pt-2", children: ["Total final: $", totalFinal.toFixed(2)] })] }) }), _jsx("button", { className: "bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 w-full mt-4 font-bold text-lg disabled:bg-gray-400", onClick: registrarVenta, disabled: loading || items.length === 0, children: "\uD83D\uDCB0 Confirmar Venta" })] }))] }));
}

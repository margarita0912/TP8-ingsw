import React, { useEffect, useState } from 'react'
import api from '../api/axios'

interface Producto {
    id: number
    nombre: string
    precio: number
    stock: number
}

export default function Productos() {
    const [productos, setProductos] = useState<Producto[]>([])

    useEffect(() => {
        api.get('/productos')
            .then(res => {
                // Asegurarnos de que res.data sea un array antes de setearlo
                const data = Array.isArray(res.data)
                    ? res.data
                    : (Array.isArray(res.data?.data) ? res.data.data : [])
                if (!Array.isArray(res.data)) {
                    console.warn('Warning: /productos returned non-array payload, normalizando a array', res.data)
                }
                setProductos(data)
            })
            .catch(err => console.error(err))
    }, [])

    return (
        <div>
            <h2>📦 Productos</h2>
            <ul>
                {productos.map((p) => (
                    <li key={p.id}>
                        {p.nombre} — ${p.precio} — Stock: {p.stock}
                    </li>
                ))}
            </ul>
        </div>
    )
}
import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Productos() {
    const [productos, setProductos] = useState([])

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
                {productos.map((p: any) => (
                    <li key={p.id}>
                        {p.nombre} — ${p.precio} — Stock: {p.stock}
                    </li>
                ))}
            </ul>
        </div>
    )
}
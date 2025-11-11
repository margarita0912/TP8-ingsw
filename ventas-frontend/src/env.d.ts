/// <reference types="vite/client" />

// Declaraciones de entorno para Vite
// Añade aquí todas las variables VITE_* que uses en el frontend

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    // readonly VITE_OTHER?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

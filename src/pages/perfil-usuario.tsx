import React, { useEffect, useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { Usuario } from '../types/types';
import { authService } from '../services/authService';


export const PerfilUsuario: React.FC = () => {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const toast = useRef<Toast>(null);

    const loadProfile = async () => {
        try {
            const data = await authService.getProfile();
            console.log("Usuario autenticado:", data); // Verifica en la consola que los roles estén llegando
            setUsuario(data);
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar el perfil del usuario', life: 3000 });
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    return (
        <div className="p-d-flex p-jc-center p-ai-center" style={{ height: '100vh' }}>
            <Toast ref={toast} />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                <div>
                    <h2 className="p-text-center">Perfil del Usuario</h2>
                    {usuario && (
                        <Card title={usuario.nombreCompleto} subTitle={usuario.email} style={{ width: '25em' }} className="p-shadow-5">
                            <p><strong>Teléfono:</strong> {usuario.telefono}</p>
                            <p><strong>Fecha de Creación:</strong> {usuario.fechaCreacion ? new Date(usuario.fechaCreacion).toLocaleDateString() : ''}</p>
                            <p><strong>Última Conexión:</strong> {usuario.ultimaConexion ? new Date(usuario.ultimaConexion).toLocaleDateString() : ''}</p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PerfilUsuario;

import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService'; // Importar el authService para cerrar sesión
import { useEffect, useState } from 'react';

export const Navbar: React.FC = () => {
    const navigate = useNavigate(); // Hook de React Router DOM para navegar entre rutas
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        setIsAuthenticated(authService.isAuthenticated());
    }, []);


    useEffect(() => {
        setIsAuthenticated(authService.isAuthenticated());
    }, []);

    const handleLogout = () => {
        authService.logout();
        setIsAuthenticated(false); // Actualizar el estado de autenticación
    };

    const items = [
        {
            label: 'Dashboard',
            icon: 'pi pi-home',
            command: () => navigate('/dashboard')
        },
        {
            label: 'Vehículos',
            icon: 'pi pi-car',
            command: () => navigate('/vehiculos')
        },
        {
            label: 'Talleres',
            icon: 'pi pi-briefcase',
            command: () => navigate('/talleres')
        },
        {
            label: 'Registros de Servicio',
            icon: 'pi pi-book',
            command: () => navigate('/registros-servicios')
        },
        {
            label: 'Reportes',
            icon: 'pi pi-chart-line',
            command: () => navigate('/reportes')
        },
        {
            label: 'Configuración',
            icon: 'pi pi-cog',
            command: () => navigate('/configuracion')
        },
        {
            label: 'Perfil de Usuario',
            icon: 'pi pi-user',
            command: () => navigate('/perfil-usuario')
        },
        // Nuevo botón de cerrar sesión
        {
            label: 'Cerrar sesión',
            icon: 'pi pi-sign-out',
            command: () => {
                handleLogout();
                navigate('/login'); // Redirigir al login después de cerrar sesión
            },
            className: 'logout-item' // Añadir clase para estilos personalizados
        }
    ];

    if (!isAuthenticated) {
        return null; // No renderizar el navbar si no está autenticado
    }

    return <Menubar model={items} />;
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';

const RegisterPage = () => {
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const toast = React.useRef<any>(null);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Las contraseñas no coinciden', life: 3000 });
            return;
        }

        try {
            const data = await authService.register({ nombreCompleto, email, telefono, password });
            console.log('Usuario registrado:', data);
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario registrado exitosamente', life: 3000 });
            setTimeout(() => {
                navigate('/login');
            }, 3000); // Redirect to login after 3 seconds
        } catch (err: any) {
            if (err.response && err.response.data && (err.response.data.message === 'Email already in use' || err.response.data.message === 'Phone number already in use')) {
                setError(err.response.data.message);
                toast.current?.show({ severity: 'warn', summary: 'Advertencia', detail: err.response.data.message, life: 3000 });
            } else {
                setError('Error al registrar al usuario');
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al registrar al usuario', life: 3000 });
            }
        }
    };

    return (
        <div className="register-container">
            <Card className="register-card">
                <h2 className="p-text-center">Registrar cuenta</h2>
                <form onSubmit={handleRegister} className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="nombreCompleto">Nombre Completo</label>
                        <InputText
                            id="nombreCompleto"
                            value={nombreCompleto}
                            onChange={(e) => setNombreCompleto(e.target.value)}
                            required
                            className="p-inputtext-sm p-d-block"
                        />
                    </div>

                    <div className="p-field">
                        <label htmlFor="email">Email</label>
                        <InputText
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="p-inputtext-sm p-d-block"
                        />
                    </div>

                    <div className="p-field">
                        <label htmlFor="telefono">Teléfono</label>
                        <InputText
                            id="telefono"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            required
                            className="p-inputtext-sm p-d-block"
                        />
                    </div>

                    <div className="p-field">
                        <label htmlFor="password">Contraseña</label>
                        <Password
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            toggleMask
                            feedback={false}
                            className="p-inputtext-sm p-d-block"
                        />
                    </div>

                    <div className="p-field">
                        <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                        <Password
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            toggleMask
                            feedback={false}
                            className="p-inputtext-sm p-d-block"
                        />
                    </div>

                    {error && (
                        <div className="p-d-flex p-jc-center p-mt-2">
                            <Toast ref={toast} />
                        </div>
                    )}
                    
                    <br />
                    <div className="p-d-flex p-jc-center">
                        <Button
                            type="submit"
                            label="Registrarse"
                            icon="pi pi-user"
                            className="p-button-primary"
                        />
                    </div>

                    <br />
                    <div className="p-d-flex p-jc-center p-mt-2">
                        <Button
                            label="Volver al Login"
                            icon="pi pi-sign-in"
                            className="p-button-secondary"
                            onClick={() => navigate('/login')}
                        />
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default RegisterPage;
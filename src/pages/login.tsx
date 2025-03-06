import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const toast = React.useRef<any>(null); // Ref to show the toast messages

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await authService.login(email, password);
            localStorage.setItem('token', response.token);
            navigate('/dashboard'); // Redirigir al dashboard después de logearse
            window.location.reload();
        } catch (err: any) {
            if (err.response && err.response.status === 404) {
                setError('Usuario no registrado o email no encontrado');
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Usuario no registrado o email no encontrado', life: 3000 });
            } else {
                setError('Credenciales incorrectas o error en el servidor');
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Credenciales incorrectas o error en el servidor', life: 3000 });
            }
        }
    };

    const handleRegister = () => {
        navigate('/register');
    };

    return (
        <div className="login-container">
            <Card title="Iniciar sesión" className="login-card">
                <form onSubmit={handleLogin} className="p-fluid">
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

                    {error && (
                        <div className="p-d-flex p-jc-center p-mt-2">
                            <Toast ref={toast} />
                        </div>
                    )}
                    <br />
                    <div className="p-d-flex p-jc-between">
                        <Button
                            type="submit"
                            label="Iniciar sesión"
                            icon={<FaSignInAlt />}
                            className="p-button-success p-button-outlined p-mr-2"
                        />
                    </div><br />
                    <div className="p-d-flex p-jc-between">
                        <Button
                            type="button"
                            label="Registrarse"
                            icon={<FaUserPlus />}
                            onClick={handleRegister}
                            className="p-button-secondary"
                        />
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default LoginPage;

import React, { useRef, useState, useEffect } from 'react';
import { Toast } from 'primereact/toast';
import { Usuario, Rol } from '../types/types';
import { usuarioService } from '../services/usuarioService';
import { rolService } from '../services/rolService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

export const Configuracion: React.FC = () => {
    const [roles, setRoles] = useState<Rol[]>([]);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const toast = useRef<Toast>(null);
    const [displayRolDialog, setDisplayRolDialog] = useState(false);
    const [displayUsuarioDialog, setDisplayUsuarioDialog] = useState(false);
    const [editingRol, setEditingRol] = useState<Partial<Rol>>({});
    const [editingUsuario, setEditingUsuario] = useState<Partial<Usuario>>({});
    const [displayRoleDialog, setDisplayRoleDialog] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Rol | null>(null);

    const loadRoles = async () => {
        try {
            const data = await rolService.findAll();
            setRoles(data);
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Roles cargados', life: 3000 });
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar los roles', life: 3000 });
        }
    };

    const loadUsuarios = async () => {
        try {
            const data = await usuarioService.findAll();
            setUsuarios(data);
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Usuarios cargados', life: 3000 });
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar los usuarios', life: 3000 });
        }
    };

    useEffect(() => {
        loadRoles();
        loadUsuarios();
    }, []);

    const openNewRol = () => {
        setEditingRol({});
        setDisplayRolDialog(true);
    };

    const openNewUsuario = () => {
        setEditingUsuario({});
        setDisplayUsuarioDialog(true);
    };

    const hideRolDialog = () => {
        setDisplayRolDialog(false);
    };

    const hideUsuarioDialog = () => {
        setDisplayUsuarioDialog(false);
    };

    const saveRol = async () => {
        try {
            if (editingRol.idRol) {
                await rolService.update(editingRol.idRol, editingRol);
                toast.current?.show({ severity: 'info', summary: 'Éxito', detail: 'Rol actualizado correctamente', life: 3000 });
            } else {
                await rolService.create(editingRol);
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Rol guardado correctamente', life: 3000 });
            }
            setDisplayRolDialog(false);
            loadRoles();
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al guardar el rol', life: 3000 });
        }
    };

    const saveUsuario = async () => {
        try {
            if (editingUsuario.idUsuario) {
                await usuarioService.update(editingUsuario.idUsuario, editingUsuario);
                toast.current?.show({ severity: 'info', summary: 'Éxito', detail: 'Usuario actualizado correctamente', life: 3000 });
            } else {
                await usuarioService.create(editingUsuario);
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario guardado correctamente', life: 3000 });
            }
            setDisplayUsuarioDialog(false);
            loadUsuarios();
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al guardar el usuario', life: 3000 });
        }
    };

    const asignarRol = async () => {
        if (!editingUsuario.idUsuario || !selectedRole) return;
        try {
            if (editingUsuario.idUsuario !== undefined && selectedRole.idRol !== undefined) {
                await usuarioService.asignarRol(editingUsuario.idUsuario, selectedRole.idRol);
            }
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Rol asignado correctamente', life: 3000 });
            setDisplayRoleDialog(false);
            loadUsuarios();
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al asignar el rol', life: 3000 });
        }
    };

    const removerRol = async () => {
        if (!editingUsuario.idUsuario || !selectedRole) return;
        try {
            if (editingUsuario.idUsuario !== undefined && selectedRole.idRol !== undefined) {
                await usuarioService.removerRol(editingUsuario.idUsuario, selectedRole.idRol);
                const updatedRoles = editingUsuario.roles?.filter(role => role.idRol !== selectedRole.idRol) || [];
                setEditingUsuario({
                    ...editingUsuario,
                    roles: updatedRoles
                });
            }
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Rol removido correctamente', life: 3000 });
            setDisplayRoleDialog(false);
            loadUsuarios();
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al remover el rol', life: 3000 });
        }
    };

    const footerRolDialog = (
        <div>
            <Button label='Cancelar' icon='pi pi-times' className='p-button-text' onClick={hideRolDialog}></Button>
            <Button label='Guardar' icon='pi pi-save' className='p-button-text' onClick={saveRol}></Button>
        </div>
    );

    const footerUsuarioDialog = (
        <div>
            <Button label='Cancelar' icon='pi pi-times' className='p-button-text' onClick={hideUsuarioDialog}></Button>
            <Button label='Guardar' icon='pi pi-save' className='p-button-text' onClick={saveUsuario}></Button>
        </div>
    );

    const handleDeleteRol = async (id: number) => {
        try {
            await rolService.delete(id);
            toast.current?.show({ severity: 'info', summary: 'Éxito', detail: 'Rol eliminado correctamente', life: 3000 });
            loadRoles();
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el rol', life: 3000 });
        }
    };

    const handleDeleteUsuario = async (id: number) => {
        try {
            await usuarioService.delete(id);
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario eliminado correctamente', life: 3000 });
            loadUsuarios();
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el usuario', life: 3000 });
        }
    };

    return (
        <div>
            <Toast ref={toast} />
            <h2>Gestión de Roles</h2>

            <Button label='Nuevo Rol' icon='pi pi-plus' onClick={openNewRol}></Button>

            <br /><br />
            <DataTable value={roles}>
                <Column field="idRol" header="Id" sortable></Column>
                <Column field="nombre" header="Nombre" sortable></Column>
                <Column field="descripcion" header="Descripción" sortable></Column>
                <Column header="Acciones" body={(rowData: Rol) => (
                    <>
                        <Button icon='pi pi-pencil' className='p-button-rounded p-button-success p-mr-2' onClick={() => { setEditingRol(rowData); setDisplayRolDialog(true); }}></Button>
                        <Button icon='pi pi-trash' className='p-button-rounded p-button-danger' onClick={() => rowData.idRol !== undefined && handleDeleteRol(rowData.idRol)}></Button>
                    </>
                )}></Column>
            </DataTable>

            <h2>Gestión de Usuarios</h2>

            <Button label='Nuevo Usuario' icon='pi pi-plus' onClick={openNewUsuario}></Button>

            <br /><br />
            <DataTable value={usuarios}>
                <Column field="idUsuario" header="Id" sortable></Column>
                <Column field="nombreCompleto" header="Nombre Completo" sortable></Column>
                <Column field="email" header="Email" sortable></Column>
                <Column field="telefono" header="Teléfono" sortable></Column>
                <Column field="roles" header="Roles" body={(rowData) => rowData.roles && rowData.roles.length > 0 ? rowData.roles.map((rol: Rol) => rol.nombre).join(', ') : 'Sin Roles'}></Column>
                <Column field="fechaCreacion" header="Fecha de Creación" sortable body={(rowData) => rowData.fechaCreacion ? new Date(rowData.fechaCreacion).toLocaleDateString() : ''}></Column>
                <Column field="ultimaConexion" header="Última Conexión" sortable body={(rowData) => rowData.ultimaConexion ? new Date(rowData.ultimaConexion).toLocaleDateString() : ''}></Column>
                <Column header="Acciones" body={(rowData: Usuario) => (
                    <>
                        <Button icon='pi pi-pencil' className='p-button-rounded p-button-success p-mr-2' onClick={() => { setEditingUsuario(rowData); setDisplayUsuarioDialog(true); }}></Button>
                        <Button icon='pi pi-trash' className='p-button-rounded p-button-danger' onClick={() => rowData.idUsuario && handleDeleteUsuario(rowData.idUsuario)}></Button>
                        <Button icon='pi pi-user' className='p-button-rounded p-button-info' onClick={() => { setEditingUsuario(rowData); setDisplayRoleDialog(true) }}></Button>
                    </>
                )}></Column>
            </DataTable>

            <Dialog visible={displayRolDialog} header={editingRol.idRol ? 'Editar Rol' : 'Nuevo Rol'} onHide={hideRolDialog} footer={footerRolDialog}>
                <div className='p-field'>
                    <label htmlFor='nombre'>Rol: </label>
                    <InputText id='nombre' value={editingRol.nombre} onChange={(e) => setEditingRol({ ...editingRol, nombre: e.target.value })} required autoFocus />
                </div><br />
                <div className='p-field'>
                    <label htmlFor='descripcion'>Descripción: </label>
                    <InputText id='descripcion' value={editingRol.descripcion} onChange={(e) => setEditingRol({ ...editingRol, descripcion: e.target.value })} />
                </div>
            </Dialog>

            <Dialog visible={displayUsuarioDialog} header={editingUsuario.idUsuario ? 'Editar Usuario' : 'Nuevo Usuario'} onHide={hideUsuarioDialog} footer={footerUsuarioDialog}>
                <div className='p-field'>
                    <label htmlFor='nombreCompleto'>Nombre Completo: </label>
                    <InputText id='nombreCompleto' value={editingUsuario.nombreCompleto} onChange={(e) => setEditingUsuario({ ...editingUsuario, nombreCompleto: e.target.value })} required autoFocus />
                </div><br />
                <div className='p-field'>
                    <label htmlFor='email'>Email: </label>
                    <InputText id='email' value={editingUsuario.email} onChange={(e) => setEditingUsuario({ ...editingUsuario, email: e.target.value })} required />
                </div><br />
                <div className='p-field'>
                    <label htmlFor='telefono'>Teléfono: </label>
                    <InputText id='telefono' value={editingUsuario.telefono} onChange={(e) => setEditingUsuario({ ...editingUsuario, telefono: e.target.value })} required />
                </div><br />
            </Dialog>

            <Dialog
                visible={displayRoleDialog}
                header="Asignar Rol"
                onHide={() => setDisplayRoleDialog(false)}
            >
                <div className='p-field'>
                    <label htmlFor='rol'>Seleccione un rol: </label>
                    <Dropdown id='rol'
                        value={selectedRole}
                        options={roles}
                        optionLabel='nombre'
                        placeholder='Seleccione ...'
                        onChange={(e) => setSelectedRole(e.value)}
                    />
                </div><br />
                <div className='p-mt-3'>
                    <Button label='Cancelar' icon='pi pi-times' className='p-button-text' onClick={() => setDisplayRoleDialog(false)}></Button>
                    <Button label='Asignar' icon='pi pi-save' className='p-button-success' onClick={asignarRol}></Button>
                    <Button label='Remover' icon='pi pi-trash' className='p-button-danger' onClick={removerRol}></Button>
                </div>
            </Dialog>
        </div>
    );
};

export default Configuracion;
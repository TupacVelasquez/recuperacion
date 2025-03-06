import React, { useRef, useState, useEffect } from 'react';
import { Toast } from 'primereact/toast';
import { Taller } from '../types/types';
import { tallerService } from '../services/tallerService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

const Talleres: React.FC = () => {
    const [talleres, setTalleres] = useState<Taller[]>([]);
    const toast = useRef<Toast>(null);
    const [displayDialog, setDisplayDialog] = useState(false);
    const [editingTaller, setEditingTaller] = useState<Partial<Taller>>({});

    const loadTalleres = async () => {
        try {
            const data = await tallerService.findAll();
            setTalleres(data);
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Talleres cargados', life: 3000 });
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar los talleres', life: 3000 });
        }
    };

    useEffect(() => {
        loadTalleres();
    }, []);

    const openNew = () => {
        setEditingTaller({});
        setDisplayDialog(true);
    };

    const hideDialog = () => {
        setDisplayDialog(false);
    };

    const saveTaller = async () => {
        try {
            if (editingTaller.idTaller) {
                await tallerService.update(editingTaller.idTaller, editingTaller);
                toast.current?.show({severity: 'info', summary: 'Éxito', detail: 'Taller actualizado correctamente', life: 3000});
            } else {
                await tallerService.create(editingTaller);
                toast.current?.show({severity: 'success', summary: 'Éxito', detail: 'Taller guardado correctamente', life: 3000});
            }
            setDisplayDialog(false);
            loadTalleres();
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al guardar el taller', life: 3000 });
        }
    }

    const footerDialog = (
        <div>
            <Button label='Cancelar' icon='pi pi-times' className='p-button-text' onClick={hideDialog}></Button>
            <Button label='Guardar' icon='pi pi-save' className='p-button-text' onClick={saveTaller}></Button>
        </div>
    );

    const handleDelete = async (idTaller: number) => {
        try {
            await tallerService.delete(idTaller);
            toast.current?.show({ severity: 'info', summary: 'Éxito', detail: 'Taller eliminado correctamente', life: 3000 });
            loadTalleres();
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el taller', life: 3000 });
        }
    };

    return (
        <div>
            <Toast ref={toast} />
            <h2>Gestión de Talleres</h2>

            <Button label='Nuevo Taller' icon='pi pi-plus' onClick={openNew}></Button>

            <br /><br />

            <DataTable value={talleres}>
                <Column field="idTaller" header="Id" sortable></Column>
                <Column field="nombre" header="Nombre" sortable></Column>
                <Column field="direccion" header="Dirección" sortable></Column>
                <Column field="telefono" header="Teléfono" sortable></Column>
                <Column field="correoContacto" header="Correo de Contacto" sortable></Column>
                <Column field="horariosAtencion" header="Horarios de Atención" sortable></Column>
                <Column field="especialidades" header="Especialidades" body={(rowData: Taller) => rowData.especialidades?.join(', ')} sortable></Column>
                <Column header="Acciones" body={(rowData: Taller) => (
                    <>
                        <Button icon='pi pi-pencil' className='p-button-rounded p-button-success p-mr-2' onClick={() => { setEditingTaller(rowData); setDisplayDialog(true); }}></Button>
                        <Button icon='pi pi-trash' className='p-button-rounded p-button-danger' onClick={() => rowData.idTaller !== undefined && handleDelete(rowData.idTaller)}></Button>
                    </>
                )}></Column>
            </DataTable>

            <Dialog visible={displayDialog} header={editingTaller.idTaller ? 'Editar Taller' : 'Nuevo Taller'} onHide={hideDialog} footer={footerDialog}>

                <div className='p-field'>
                    <label htmlFor='nombre'>Nombre: </label>
                    <InputText id='nombre' value={editingTaller.nombre} onChange={(e) => setEditingTaller({ ...editingTaller, nombre: e.target.value })} required autoFocus />
                </div><br />
                <div className='p-field'>
                    <label htmlFor='direccion'>Dirección: </label>
                    <InputText id='direccion' value={editingTaller.direccion} onChange={(e) => setEditingTaller({ ...editingTaller, direccion: e.target.value })} />
                </div><br />
                <div className='p-field'>
                    <label htmlFor='telefono'>Teléfono: </label>
                    <InputText id='telefono' value={editingTaller.telefono} onChange={(e) => setEditingTaller({ ...editingTaller, telefono: e.target.value })} />
                </div><br />
                <div className='p-field'>
                    <label htmlFor='correoContacto'>Correo de Contacto: </label>
                    <InputText id='correoContacto' type='email' value={editingTaller.correoContacto} onChange={(e) => setEditingTaller({ ...editingTaller, correoContacto: e.target.value })} />
                </div><br />
                <div className='p-field'>
                    <label htmlFor='horariosAtencion'>Horarios de Atención: </label>
                    <Dropdown id='horariosAtencion' value={editingTaller.horariosAtencion} options={['08:00 - 12:00', '12:00 - 16:00', '16:00 - 20:00']} onChange={(e) => setEditingTaller({ ...editingTaller, horariosAtencion: e.value })} placeholder="Seleccione un horario" />
                </div><br />
                <div className='p-field'>
                    <label htmlFor='especialidades'>Especialidades: </label>
                    <Dropdown id='especialidades' value={editingTaller.especialidades} options={['Mecánica General', 'Electricidad Automotriz', 'Pintura y Carrocería', 'Aire Acondicionado']} onChange={(e) => setEditingTaller({ ...editingTaller, especialidades: e.value })} multiple placeholder="Seleccione especialidades" />
                </div>

            </Dialog>

        </div>
    );
};

export default Talleres;
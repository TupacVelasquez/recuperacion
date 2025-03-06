import React, { useRef, useState, useEffect } from 'react';
import { Toast } from 'primereact/toast';
import { Vehiculo } from '../types/types';
import { vehiculoService } from '../services/vehiculoService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { RadioButton } from 'primereact/radiobutton';


const Vehiculos: React.FC = () => {
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
    const toast = useRef<Toast>(null);
    const [displayDialog, setDisplayDialog] = useState(false);
    const [editingVehiculo, setEditingVehiculo] = useState<Partial<Vehiculo>>({});

    const loadVehiculos = async () => {
        try {
            const data = await vehiculoService.findAll();
            setVehiculos(data);
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Vehículos cargados', life: 3000 });
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar los vehículos', life: 3000 });
        }
    };

    useEffect(() => {
        loadVehiculos();
    }, []);

    const openNew = () => {
        setEditingVehiculo({});
        setDisplayDialog(true);
    };

    const hideDialog = () => {
        setDisplayDialog(false);
    };

    const saveVehiculo = async () => {
        try {
            if (editingVehiculo.idVehiculo) {
                await vehiculoService.update(editingVehiculo.idVehiculo, editingVehiculo);
                toast.current?.show({severity: 'info', summary: 'Éxito', detail: 'Vehículo actualizado correctamente', life: 3000});
            } else {
                await vehiculoService.create(editingVehiculo);
                toast.current?.show({severity: 'success', summary: 'Éxito', detail: 'Vehículo guardado correctamente', life: 3000});
            }
            setDisplayDialog(false);
            loadVehiculos();
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al guardar el vehículo', life: 3000 });
        }
    }

    const footerDialog = (
        <div>
            <Button label='Cancelar' icon='pi pi-times' className='p-button-text' onClick={hideDialog}></Button>
            <Button label='Guardar' icon='pi pi-save' className='p-button-text' onClick={saveVehiculo}></Button>
        </div>
    );

    const handleDelete = async (idVehiculo: number) => {
        try {
            await vehiculoService.delete(idVehiculo);
            toast.current?.show({ severity: 'info', summary: 'Éxito', detail: 'Vehículo eliminado correctamente', life: 3000 });
            loadVehiculos();
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el vehículo', life: 3000 });
        }
    };

    return (
        <div>
            <Toast ref={toast} />
            <h2>Gestión de Vehículos</h2>

            <Button label='Nuevo Vehículo' icon='pi pi-plus' onClick={openNew}></Button>

            <br /><br />

            <DataTable value={vehiculos}>
                <Column field="idVehiculo" header="Id" sortable></Column>
                <Column field="marca" header="Marca" sortable></Column>
                <Column field="modelo" header="Modelo" sortable></Column>
                <Column field="anio" header="Año" sortable></Column>
                <Column field="numeroPlaca" header="Placa" sortable></Column>
                <Column field="color" header="Color" sortable></Column>
                <Column field="tipoCombustible" header="Tipo de Combustible" sortable></Column>
                <Column field="odometro" header="Odómetro" sortable></Column>
                <Column field="tipoVehiculo" header="Tipo de Vehículo" sortable></Column>
                <Column header="Acciones" body={(rowData: Vehiculo) => (
                    <>
                        <Button icon='pi pi-pencil' className='p-button-rounded p-button-success p-mr-2' onClick={() => { setEditingVehiculo(rowData); setDisplayDialog(true); }}></Button>
                        <Button icon='pi pi-trash' className='p-button-rounded p-button-danger' onClick={() => rowData.idVehiculo !== undefined && handleDelete(rowData.idVehiculo)}></Button>
                    </>
                )}></Column>
            </DataTable>

            <Dialog visible={displayDialog} header={editingVehiculo.idVehiculo ? 'Editar Vehículo' : 'Nuevo Vehículo'} onHide={hideDialog} footer={footerDialog}>

                <div className='p-field'>
                    <label htmlFor='marca'>Marca: </label>
                    <InputText id='marca' value={editingVehiculo.marca} onChange={(e) => setEditingVehiculo({ ...editingVehiculo, marca: e.target.value })} required autoFocus />
                </div><br />
                <div className='p-field'>
                    <label htmlFor='modelo'>Modelo: </label>
                    <InputText id='modelo' value={editingVehiculo.modelo} onChange={(e) => setEditingVehiculo({ ...editingVehiculo, modelo: e.target.value })} />
                </div><br />
                
                <div className='p-field'>
                <label htmlFor='anio'>Año: </label>
                <Calendar
                    id='anio'
                    value={editingVehiculo.anio ? new Date(editingVehiculo.anio, 0, 1) : null}
                    onChange={(e) => setEditingVehiculo({ ...editingVehiculo, anio: e.value?.getFullYear() })}
                    view="year"
                    dateFormat="yy"
                    showButtonBar
                />
                </div>
                <br />


                <div className='p-field'>
                    <label htmlFor='numeroPlaca'>Placa: </label>
                    <InputText 
                        id='numeroPlaca' 
                        value={editingVehiculo.numeroPlaca || ''}  // Evita valores null o undefined
                        onChange={(e) => setEditingVehiculo({ ...editingVehiculo, numeroPlaca: e.target.value })}
                    />
                </div><br />


                <div className='p-field'>
                    <label htmlFor='color'>Color: </label>
                    <InputText id='color' value={editingVehiculo.color} onChange={(e) => setEditingVehiculo({ ...editingVehiculo, color: e.target.value })} />
                </div><br />

                <div className='p-field'>
                    <label htmlFor='tipoCombustible'>Tipo de Combustible: </label>
                    <div className="p-formgroup-inline">
                        <div className="p-field-radiobutton">
                            <RadioButton 
                                id="diesel" 
                                name="tipoCombustible" 
                                value="Diésel" 
                                checked={editingVehiculo.tipoCombustible === "Diésel"} 
                                onChange={(e) => setEditingVehiculo({ ...editingVehiculo, tipoCombustible: e.value })} 
                            />
                            <label htmlFor="diesel">Diésel</label>
                        </div>

                        <div className="p-field-radiobutton">
                            <RadioButton 
                                id="gasolina" 
                                name="tipoCombustible" 
                                value="Gasolina" 
                                checked={editingVehiculo.tipoCombustible === "Gasolina"} 
                                onChange={(e) => setEditingVehiculo({ ...editingVehiculo, tipoCombustible: e.value })} 
                            />
                            <label htmlFor="gasolina">Gasolina</label>
                        </div>

                        <div className="p-field-radiobutton">
                            <RadioButton 
                                id="electrico" 
                                name="tipoCombustible" 
                                value="Eléctrico" 
                                checked={editingVehiculo.tipoCombustible === "Eléctrico"} 
                                onChange={(e) => setEditingVehiculo({ ...editingVehiculo, tipoCombustible: e.value })} 
                            />
                            <label htmlFor="electrico">Eléctrico</label>
                        </div>
                    </div>
                </div><br />


                <div className='p-field'>
                    <label htmlFor='odometro'>Odómetro: </label>
                    <InputNumber
                        id='odometro'
                        value={editingVehiculo.odometro || 0} // Evita valores nulos
                        onValueChange={(e) => setEditingVehiculo({ ...editingVehiculo, odometro: e.value ?? undefined })}
                        mode="decimal"
                        useGrouping={false} // Evita separación por miles
                    />
                </div><br />

                <div className='p-field'>
                    <label htmlFor='tipoVehiculo'>Tipo de Vehículo: </label>
                    <Dropdown 
                        id='tipoVehiculo' 
                        value={editingVehiculo.tipoVehiculo} 
                        options={[
                            { label: 'Automóvil', value: 'automóvil' },
                            { label: 'Camión', value: 'camión' },
                            { label: 'Motocicleta', value: 'motocicleta' }
                        ]}
                        onChange={(e) => setEditingVehiculo({ ...editingVehiculo, tipoVehiculo: e.value })}
                        placeholder="Seleccione un tipo"
                    />
                </div>

            </Dialog>

        </div>
    );
};

export default Vehiculos;
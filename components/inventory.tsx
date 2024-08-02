"use client";
import { useEffect, useState } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent, DropdownMenu } from "@/components/ui/dropdown-menu";
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card";
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {  useSession } from 'next-auth/react';
import Modal from './Modal';
import { Popup } from './popup';
import { Input } from "@/components/ui/input";
import Sweet from 'sweetalert2'
import { CarIcon, LayoutDashboardIcon, SettingsIcon, UsersIcon } from 'lucide-react';

interface Vehicle {
  id: number;
  vin: string;
  carMake: string;
  model: string;
  year: number;
  color: string;
  price: number;
  engineType: string;
  transmissionType: string;
  mileage: number;
  description: string;
  dealershipId: number;
  vehicleType: string;
  status: string; 
}

export function Inventory() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const {data : session} = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshInventory = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  useEffect(() => {
    axios.get('https://localhost:7126/api/v1/Vehicle')
      .then(response => {
        const { data } = response;
        if (data && data.succeeded) {
          setVehicles(data.data);
        } else {
          Sweet.fire({
            title: 'Hubo un error encontrando los vehículos',
            text: `${data.message}`, 
            icon: 'error',
            confirmButtonColor:'#d30000'
          });
        }
      })
      .catch(error => {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.Message || 'Un error desconocido ocurrió';
          Sweet.fire({
            title: 'Hubo un error encontrando los vehículos',
            text: `${errorMessage}`, 
            icon: 'error',
            confirmButtonColor:'#d30000'
          });
        }
        else if (error instanceof Error) {
          Sweet.fire({
            title: 'Hubo un error encontrando los vehículos',
            text: `${error.message}`, 
            icon: 'error',
            confirmButtonColor:'#d30000'
          });
        } else {
          Sweet.fire({
            title: 'Hubo un error encontrando los vehículos',
            text: `Un error desconocido ocurrió`,
            icon: 'error',
            confirmButtonColor:'#d30000'
          });
        }
      });
  }, [refreshTrigger]);

  useEffect(() => {
    if (vehicles) {
      const filtered = vehicles.filter(vehicle =>
        (vehicle.carMake?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (vehicle.vin?.toLowerCase().includes(searchTerm.toLowerCase()) || '')||
        (vehicle.year?.toString().includes(searchTerm.toLowerCase()) || '')
      );
      setFilteredVehicles(filtered);
    } else {
      setFilteredVehicles([]);
    }
  }, [searchTerm, vehicles]);
 
  
  const handleDelete = async(vehicleId: number) => {
    setLoading(true);
    try {
      const vehicle = vehicles.find(v => v.id == vehicleId);
      if(!vehicle){
        throw new Error("Vehicle not found")
      }
      const response = await axios.delete(`https://localhost:7126/api/v1/Vehicle/${vehicleId}`,{        
        headers: {
          Authorization: `Bearer ${session?.user.jwToken}`,
        },
      });
      const { data } = response;
      if (response.status === 204) {
        console.log("Vehicle deleted successfully:", vehicleId);
        Sweet.fire({
          title: 'Vehículo eliminado',
          text: `El vehículo ha sido eliminado correctamente`, 
          icon: 'success',
          showConfirmButton: false,
          timer: 900
        });
        setVehicles(prevVehicles => prevVehicles.filter(vehicle => vehicle.id !== vehicleId));
      } else {
        Sweet.fire({
          title: 'Hubo un error eliminando el vehículo',
          text: `Un error desconocido ocurrió`,
          icon: 'error',
          confirmButtonColor:'#d30000'
        });
      }
    } catch (error) {
      console.error("There was an error updating the status!", error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.Message || 'Un error desconocido ocurrió';
        Sweet.fire({
          title: 'Hubo un error actualizando el estado del vehículo',
          text: `${errorMessage}`, 
          icon: 'error',
          confirmButtonColor:'#d30000'
        });
      }
      else if (error instanceof Error) {
        Sweet.fire({
          title: 'Hubo un error actualizando el estado del vehículo',
          text: `${error.message}`, 
          icon: 'error',
          confirmButtonColor:'#d30000'
        });
      } else {
        Sweet.fire({
          title: 'Hubo un error actualizando el estado del vehículo',
          text: `Un error desconocido ocurrió`,
          icon: 'error',
          confirmButtonColor:'#d30000'
        });
      }
    }
      finally {
      setLoading(false);
    }    
}

  const handleStatusChange = async (vehicleId: number, newStatus: string) => {
    setLoading(true);
    try {
      const vehicle = vehicles.find(v => v.id === vehicleId);
      if (!vehicle) {
        throw new Error("Vehicle not found");
      }
      const patchData = [
        { op: "replace", path: "/status", value: newStatus }
      ];
      const response = await axios.patch(`https://localhost:7126/api/v1/Vehicle/${vehicleId}`, patchData, {
        headers: {
          'Authorization': `Bearer ${session?.user.jwToken}`,
          'Content-Type': 'application/json-patch+json'
        }
      });
      const { data } = response;
      if (data && data.succeeded) {
        setVehicles(prevVehicles =>
          prevVehicles.map(vehicle =>
            vehicle.id === vehicleId ? { ...vehicle, status: newStatus } : vehicle
          )
        );
      } else {
        console.error("Failed to update status:", data.message);
      }
    } catch (error) {
      console.error("There was an error updating the status!", error);
    } finally {
      setLoading(false);
    }   
  };
  const router = useRouter();

  const handleEdit = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };
 
  return (
    <div className="flex min-h-screen w-full flex-col">      
      <div className="flex flex-1">
        <div className="hidden border-r bg-gray-100/40 lg:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-4 text-sm font-medium">
                <Link
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
                  href="/dashboard">
                  <LayoutDashboardIcon className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900"
                  href="/inventory">
                  <CarIcon className="h-4 w-4"/>
                  Inventario
                </Link>              
                <Link
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
                  href="/settings">
                  <SettingsIcon className="h-4 w-4" />
                  Configuración
                </Link>
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col">
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Inventario</CardTitle>
              <CardDescription>Ver y gestionar el inventario actual de vehículos.</CardDescription>
            </div>
            <Button className="bg-green-500 hover:bg-green-600 text-white" size="sm" onClick={() => setIsModalOpen(true)}>
              Agregar un vehículo nuevo
            </Button>
          </CardHeader>
              <CardContent>
              <div className="mb-4">
              <Input
                placeholder="Busque por marca, modelo, año o VIN"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
             </div>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/4">Vehículo</TableHead>
                  <TableHead className="w-1/6">Color</TableHead>
                  <TableHead className="w-1/6">VIN</TableHead>
                  <TableHead className="w-1/6">Estado</TableHead>
                  <TableHead className="w-1/4 text-center">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map(vehicle => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="w-1/4">{vehicle.year} {vehicle.carMake} {vehicle.model}</TableCell>
                    <TableCell className="w-1/6">{vehicle.color}</TableCell>
                    <TableCell className="w-1/6">{vehicle.vin}</TableCell>
                    <TableCell className="w-1/6">{vehicle.status}</TableCell> 
                    <TableCell className="w-1/4">
                      <div className="flex justify-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline" disabled={loading}>
                              Cambiar estado
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleStatusChange(vehicle.id, 'Disponible')}>Disponible</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(vehicle.id, 'Reservado')}>Reservado</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(vehicle.id, 'Vendido')}>Vendido</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => 
                            Sweet.fire({
                              title: '¿Estás seguro de que deseas eliminar este vehiculo?',
                              text: 'Esta acción no es reversible',
                              icon: 'warning',
                              showCancelButton: true,
                              confirmButtonColor:'#d33',
                              cancelButtonColor: '#000000',
                              confirmButtonText:'Sí',
                              cancelButtonText:'Cancelar'
                              }).then((result =>{
                                if(result.value)
                                {
                                  handleDelete(vehicle.id)
                                }
                              })) }
                        >
                          Eliminar
                        </Button>
                        <Button size="sm" onClick={() => handleEdit(vehicle)}>
                          Editar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
              </CardContent>
            </Card>              
          </main>
        </div>       
      </div>
      <Modal isOpen={isModalOpen} onClose={() => {
        setIsModalOpen(false);
        setSelectedVehicle(null);
      }}>
        <Popup
          onClose={() => {
            setIsModalOpen(false);
            setSelectedVehicle(null);
            refreshInventory();
          }}
          vehicleToEdit={selectedVehicle}
        />
      </Modal>
    </div>
    
  );
  
}


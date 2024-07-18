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
  const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, vehicleId: null });
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');



  useEffect(() => {
    axios.get('https://localhost:7126/api/v1/Vehicle')
      .then(response => {
        const { data } = response;
        if (data && data.succeeded) {
          setVehicles(data.data);
        } else {
          console.error("Failed to fetch data:", data.message);
        }
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

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

  const handleDeleteConfirmation = (vehicleId) => {
    setDeleteConfirmation({ isOpen: true, vehicleId });
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmation.vehicleId) {
      await handleDelete(deleteConfirmation.vehicleId);
    }
    setDeleteConfirmation({ isOpen: false, vehicleId: null });
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, vehicleId: null });
  };
  
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
        setVehicles(prevVehicles => prevVehicles.filter(vehicle => vehicle.id !== vehicleId));
      } else {
        console.error("Failed to delete vehicle");
      }
    } catch (error) {
      console.error("There was an error updating the status!", error);
    } finally {
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
                  Inventory
                </Link>               
                <Link
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
                  href="/dealerform">
                  <UsersIcon className="h-4 w-4" />
                  Add new dealership
                </Link>                
                <Link
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
                  href="#">
                  <SettingsIcon className="h-4 w-4" />
                  Settings
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
              <CardTitle>Inventory</CardTitle>
              <CardDescription>View and manage the current inventory of vehicles.</CardDescription>
            </div>
            <Button className="bg-green-500 hover:bg-green-600 text-white" size="sm" onClick={() => setIsModalOpen(true)}>
              Add New Car
            </Button>
          </CardHeader>
              <CardContent>
              <div className="mb-4">
              <Input
                placeholder="Search by make, model, year, or VIN"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
             </div>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/4">Vehicle</TableHead>
                  <TableHead className="w-1/6">Color</TableHead>
                  <TableHead className="w-1/6">VIN</TableHead>
                  <TableHead className="w-1/6">Status</TableHead>
                  <TableHead className="w-1/4 text-center">Action</TableHead>
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
                              Change Status
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleStatusChange(vehicle.id, 'Available')}>Available</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(vehicle.id, 'Reserved')}>Reserved</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(vehicle.id, 'Sold')}>Sold</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteConfirmation(vehicle.id)}
                        >
                          Remove
                        </Button>
                        <Button size="sm" onClick={() => handleEdit(vehicle)}>
                          Edit
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
        <DeleteConfirmation 
        isOpen={deleteConfirmation.isOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      </div>
      <Modal isOpen={isModalOpen} onClose={() => {
        setIsModalOpen(false);
        setSelectedVehicle(null);
      }}>
        <Popup
          onClose={() => {
            setIsModalOpen(false);
            setSelectedVehicle(null);
          }}
          vehicleToEdit={selectedVehicle}
        />
      </Modal>
    </div>
    
  );
  
}
function DeleteConfirmation({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
        <p className="mb-4">Are you sure you want to delete this vehicle?</p>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>Delete</Button>
        </div>
      </div>
    </div>
  );
}
function CarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  )
}


function LayoutDashboardIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  )
}


function SettingsIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}


function UsersIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

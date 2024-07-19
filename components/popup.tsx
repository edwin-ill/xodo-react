'use client';

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select";
import Modal from './Modal';
import Sweet from 'sweetalert2';
import { useSession } from 'next-auth/react';

const basecloudinaryUrl = "https://api.cloudinary.com/v1_1/diyhxd1my"
const uploadImgUrl = `${basecloudinaryUrl}/image/upload`;
const deleteImgUrl = `${basecloudinaryUrl}/image/destroy`;
const uploadPreset = "nwpzqpdi";
const baseUrl = 'https://localhost:7126/api/v1';
const vehicleUrl = `${baseUrl}/Vehicle`;
const imageUrl = `${baseUrl}/Image`;
const cloudName = 'diyhxd1my';


interface VehicleImage {
  id?: number;
  vehicleId: number | null;
  imageUrl: string;
  public_id: string;
}

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
  vehicleImages: VehicleImage[];
}

interface PopupProps {
  onClose: () => void;
  vehicleToEdit?: Vehicle | null;
}

type PatchOperation = {
  operationType: number;
  path: string;
  op: string;
  from: string;
  value: any;
};

export function Popup({ onClose, vehicleToEdit = null }: PopupProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const {data : session} = useSession();
  const [vehicleData, setVehicleData] = useState<Partial<Vehicle>>({});
  const [vehicleImages, setVehicleImages] = useState<VehicleImage[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<FileList | null>(null);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [localImagePreviews, setLocalImagePreviews] = useState<string[]>([]);
  const [dealerships, setDealerships] = useState<Array<{id: number, name: string, address: string}>>([]);

  const handleNavigate = () => {
    router.push('/inventory');
  };

  useEffect(() => {
    if (vehicleToEdit) {
      setIsEditing(true);
      setVehicleData(vehicleToEdit);
      setVehicleImages(vehicleToEdit.vehicleImages || []);
      setExistingImages(vehicleToEdit.vehicleImages?.map(img => img.imageUrl) || []);
    }
  }, [vehicleToEdit]);

  useEffect(() => {
    fetchDealerships();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVehicleData(prev => ({ ...prev, [name]: value }));
  };

  const fetchDealerships = async () => {
    try {
      const response = await axios.get('https://localhost:7126/api/v1/Dealership');
      if (response.data.succeeded) {
        setDealerships(response.data.data
          .filter((dealership: any) => dealership.name && dealership.name.trim() !== '')
          .map((dealership: any) => ({
            id: dealership.id,
            name: dealership.name,
            address: dealership.address
          }))
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.Message || 'Un error desconocido ocurrió';
        Sweet.fire({
          title: 'Hubo un error encontrando los dealers',
          text: `${errorMessage}`, 
          icon: 'error',
          confirmButtonColor:'#d30000'
        });
      }
      if (error instanceof Error) {
        Sweet.fire({
          title: 'Hubo un error encontrando los dealers',
          text: `${error.message}`, 
          icon: 'error',
          confirmButtonColor:'#d30000'
        });
      } else {
        Sweet.fire({
          title: 'Hubo un error encontrando los dealers',
          text: `Un error desconocido ocurrió`,
          icon: 'error',
          confirmButtonColor:'#d30000'
        });
      }
    }
  };
 
  const uploadImageToCloudinary = async (image: File) => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", uploadPreset);
    const response = await axios.post(uploadImgUrl, formData);
    return {
      secure_url: response.data.secure_url,
      public_id: response.data.public_id,
    };
  };   
 
  const handleDeleteImage = useCallback(async (id: number) => {
    try {    
      
      await axios.delete(`https://localhost:7126/api/v1/Image/${id}`);
      setVehicleImages(prev => prev.filter(img => img.id !== id));
      setImagesToDelete(prev => {
        if (typeof id === 'number') {
          return [...prev, id];
        }
        return prev;
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.Message || 'Un error desconocido ocurrió';
        Sweet.fire({
          title: 'Hubo un error borrando la imagen',
          text: `${errorMessage}`, 
          icon: 'error',
          confirmButtonColor:'#d30000'
        });
      }
      else if (error instanceof Error) {
        Sweet.fire({
          title: 'Hubo un error borrando la imagen',
          text: `${error.message}`, 
          icon: 'error',
          confirmButtonColor:'#d30000'
        });
      } else {
        Sweet.fire({
          title: 'Hubo un error borrando la imagen',
          text: `Un error desconocido ocurrió`,
          icon: 'error',
          confirmButtonColor:'#d30000'
        });
      }
    }
  }, []);

  const handleAddImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
  
    const newPreviews = Array.from(files).map(file => URL.createObjectURL(file));
    setLocalImagePreviews(prev => [...prev, ...newPreviews]);
    setFilesToUpload(prev => {
      if (!prev) return files;
      const dataTransfer = new DataTransfer();
      Array.from(prev).forEach(file => dataTransfer.items.add(file));
      Array.from(files).forEach(file => dataTransfer.items.add(file));
      return dataTransfer.files;
    });
  }, []);

  const handleVINLookup = async () => {
    try {
      const response = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${vehicleData.vin}?format=json`);
      const data = response.data.Results[0];
      setVehicleData(prev => ({
        ...prev,
        carMake: data.Make || '',
        model: data.Model || '',
        year: data.ModelYear || '',
        engineType: data.EngineConfiguration || '',
        transmissionType: data.TransmissionStyle || '',
        description: `${data.Make} ${data.Model} ${data.ModelYear} - ${data.EngineHP} HP, ${data.FuelTypePrimary} engine`
      }));

      const makes = ["HONDA", "TOYOTA", "HYUNDAI", "KIA", "FORD"];
      const matchedMake = makes.find(make => make === data.Make.toUpperCase());
      if (matchedMake) {
        setVehicleData(prev => ({ ...prev, carMake: matchedMake }));
      }

      if (data.EngineConfiguration) {
        const engineConfig = data.EngineConfiguration.toLowerCase();
        if (engineConfig.includes('v-shaped')) {
          if(data.EngineCylinders === '6') { 
            setVehicleData(prev => ({ ...prev, engineType: 'v6' }));
          } else if(data.EngineCylinders === '8') {
            setVehicleData(prev => ({ ...prev, engineType: 'v8' }));
          }         
        } else if (engineConfig === 'in-line' && data.EngineCylinders === '4') {
          setVehicleData(prev => ({ ...prev, engineType: 'inline4' }));
        }
      }

      if (data.TransmissionStyle) {
        const transmissionStyle = data.TransmissionStyle.toLowerCase();
        if (transmissionStyle.includes('automatic')) {
          setVehicleData(prev => ({ ...prev, transmissionType: 'automatic' }));
        } else if (transmissionStyle.includes('manual')) {
          setVehicleData(prev => ({ ...prev, transmissionType: 'manual' }));
        }
      }
      if(data.Make == null)
      {
        Sweet.fire({
          title: 'No se encontró el vehículo',
          text: `El vehiculo especificado por el VIN no se pudo encontrar`, 
          icon: 'error',
          confirmButtonColor:'#d30000'
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.Message || 'Un error desconocido ocurrió';
        Sweet.fire({
          title: 'Hubo un error buscando el VIN',
          text: `${errorMessage}`, 
          icon: 'error',
          confirmButtonColor:'#d30000'
        });
      }
      else if (error instanceof Error) {
        Sweet.fire({
          title: 'Hubo un error buscando el VIN',
          text: `${error.message}`, 
          icon: 'error',
          confirmButtonColor:'#d30000'
        });
      } else {
        Sweet.fire({
          title: 'Hubo un error buscando el VIN',
          text: `Un error desconocido ocurrió`,
          icon: 'error',
          confirmButtonColor:'#d30000'
        });
      }
    }
  };
  useEffect(() => {
    return () => {
      localImagePreviews.forEach(preview => {
        URL.revokeObjectURL(preview);
      });
    };
  }, [localImagePreviews]);

  const getPatchOperations = (original: Partial<Vehicle>, updated: Partial<Vehicle>): PatchOperation[] => {
    const patchOperations: PatchOperation[] = [];
  
    for (const key in updated) {
      if (original[key] !== updated[key]) {
        patchOperations.push({
          operationType: 0,
          path: `/${key}`,
          op: 'replace',
          from: '',
          value: updated[key]
        });
      }
    }
  
    return patchOperations;
  };  
  const checkEmptyFields = () => {
    const requiredFields = [
      { name: 'vin', label: 'VIN' },
      { name: 'carMake', label: 'Car Make' },
      { name: 'model', label: 'Model' },
      { name: 'year', label: 'Year' },
      { name: 'color', label: 'Color' },
      { name: 'price', label: 'Price' },
      { name: 'engineType', label: 'Engine Type' },
      { name: 'transmissionType', label: 'Transmission Type' },
      { name: 'mileage', label: 'Mileage' },
      { name: 'vehicleType', label: 'Vehicle Type' },
    ];

    const emptyFields = requiredFields.filter(field => !vehicleData[field.name as keyof Partial<Vehicle>]);

    if (vehicleImages.length === 0 && !filesToUpload?.length) {
      emptyFields.push({ name: 'images', label: 'Images' });
    }
  

    return emptyFields;
  };
  const handleSubmit = async () => {
    const emptyFields = checkEmptyFields();
    if (emptyFields.length > 0) {
      Sweet.fire({
        icon: 'warning',
        title: 'Campos faltantes',
        text: `Por favor llena los siguientes campos: ${emptyFields.map(field => field.label).join(', ')}`,
        confirmButtonColor:'#d30000'
      });
      return;
    }
    try {
      let vehicleId: number | null = null;
      if (isEditing && vehicleToEdit) {
        const patchOperations = getPatchOperations(vehicleToEdit, vehicleData);
        await axios.patch(`${vehicleUrl}/${vehicleToEdit.id}`, patchOperations, {
          headers: {
            'Authorization': `Bearer ${session?.user.jwToken}`,
            'Content-Type': 'application/json-patch+json' }
        });
        vehicleId = vehicleToEdit.id;
      } else {
        const vehiclePayload = {
          ...vehicleData,
          status: 'Available'
        };
        const response = await axios.post(vehicleUrl, vehiclePayload);
        vehicleId = response.data.id;
      }

      if (vehicleId && filesToUpload?.length) {
        
        for (let i = 0; i < filesToUpload.length; i++) {
          try {
            const file = filesToUpload[i];
            const imageUrl = await uploadImageToCloudinary(file);
            const imageResponse = await axios.post('https://localhost:7126/api/v1/Image/', {
              imageUrl: imageUrl.secure_url,
              vehicleId: vehicleId,
              publicId: imageUrl.public_id 
            },
            {
              headers: {
                'Authorization': `Bearer ${session?.user.jwToken}`
              }
            });            
          } catch (error) {
            if (axios.isAxiosError(error)) {
              const errorMessage = error.response?.data?.Message || 'Un error desconocido ocurrió';
              Sweet.fire({
                title: 'Hubo un error subiendo la imagen',
                text: `${errorMessage}`, 
                icon: 'error',
                confirmButtonColor:'#d30000'
              });
            }
            else if (error instanceof Error) {
              Sweet.fire({
                title: `Hubo un error subiendo la imagen ${i + 1}`,
                text: `${error.message}`, 
                icon: 'error',
                confirmButtonColor:'#d30000'
              });
            } else {
              Sweet.fire({
                title: `Hubo un subiendo la imagen ${i + 1}`,
                text: `Un error desconocido ocurrió`,
                icon: 'error',
                confirmButtonColor:'#d30000'
              });
            }
          }
        }
      } else {
        
      }
      Sweet.fire({
        title: `El vehículo se ${isEditing ? 'editó' : 'agregó'} correctamente`,
        text: `La operación fue un exito`,
        icon: 'success',
        confirmButtonColor:'#d30000'
      });
      handleNavigate();
      onClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.Message || 'An unknown error occurred';
        Sweet.fire({
          title: 'Hubo un error agregando el vehículo',
          text: `El siguiente error ocurrió: ${errorMessage}`, 
          icon: 'error',
          confirmButtonColor:'#d30000'
        });
      } else if (error instanceof Error) {
        Sweet.fire({
          title: 'Hubo un error agregando el vehículo',
          text: `El siguiente error ocurrió: ${error.message}`, 
          icon: 'error',
          confirmButtonColor:'#d30000'
        });
      } else {
        Sweet.fire({
          title: 'Hubo un error agregando el vehículo',
          text: 'Un error desconocido ocurrió',
          icon: 'error',
          confirmButtonColor:'#d30000'
        });
      }
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <Card>
        <CardHeader className ="bg-gray-900 text-white p-6 relative">
          <CardTitle  className="text-2xl font-bold">{isEditing ? 'Edit Vehicle' : 'Add Vehicle'}</CardTitle>
          <CardDescription className="text-gray-300">Enter vehicle details below</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
  <div className="grid grid-cols-3 gap-4">
    <div>
      <Label htmlFor="vin">VIN</Label>
      <div className="flex">
        <Input id="vin" name="vin" value={vehicleData.vin || ''} onChange={handleInputChange} />
        <Button onClick={handleVINLookup}>Lookup</Button>
      </div>
    </div>
    <div>
      <Label htmlFor="carMake">Car Make</Label>
      <Input id="carMake" name="carMake" value={vehicleData.carMake || ''} onChange={handleInputChange} />
    </div>
    <div>
      <Label htmlFor="model">Model</Label>
      <Input id="model" name="model" value={vehicleData.model || ''} onChange={handleInputChange} />
    </div>
    <div>
      <Label htmlFor="year">Year</Label>
      <Input id="year" name="year" value={vehicleData.year || ''} onChange={handleInputChange} />
    </div>
    <div>
      <Label htmlFor="color">Color</Label>
      <Input id="color" name="color" value={vehicleData.color || ''} onChange={handleInputChange} />
    </div>
    <div>
      <Label htmlFor="price">Price</Label>
      <Input id="price" name="price" value={vehicleData.price || ''} onChange={handleInputChange} />
    </div>
    <div>
      <Label htmlFor="engineType">Engine Type</Label>
      <Input id="engineType" name="engineType" value={vehicleData.engineType || ''} onChange={handleInputChange} />
    </div>
    <div>
      <Label htmlFor="transmissionType">Transmission Type</Label>
      <Input id="transmissionType" name="transmissionType" value={vehicleData.transmissionType || ''} onChange={handleInputChange} />
    </div>
    <div>
      <Label htmlFor="mileage">Mileage</Label>
      <Input id="mileage" name="mileage" value={vehicleData.mileage || ''} onChange={handleInputChange} />
    </div>
    <div>
      <Label htmlFor="dealershipId">Dealership</Label>
      <Select 
        name="dealershipId" 
        value={vehicleData.dealershipId?.toString() || ''}
        onValueChange={(value) => setVehicleData(prev => ({ ...prev, dealershipId: parseInt(value) }))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a dealership" />
        </SelectTrigger>
        <SelectContent>
          {dealerships.map((dealership) => (
            <SelectItem key={dealership.id} value={dealership.id.toString()}>
            {dealership.name}, {dealership.address}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label htmlFor="vehicleType">Vehicle Type</Label>
      <Select name="vehicleType" value={vehicleData.vehicleType || ''} onValueChange={(value) => setVehicleData(prev => ({ ...prev, vehicleType: value }))}>
        <SelectTrigger>
          <SelectValue placeholder="Select a vehicle type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="SUV">SUV</SelectItem>
          <SelectItem value="Truck">Truck</SelectItem>
          <SelectItem value="Sedan">Sedan</SelectItem>
          <SelectItem value="Coupe">Coupe</SelectItem>
          <SelectItem value="Convertible">Convertible</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
  <div className="mt-4">
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" value={vehicleData.description || ''} onChange={handleInputChange} />
          </div>
          <div className="mt-4">
            <Label>Vehicle Images</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {vehicleImages.map((img, index) => (
                <div key={`existing-${index}`} className="relative w-24 h-24">
                  <img src={img.imageUrl} alt={`Vehicle ${index}`} className="w-full h-full object-cover" />
                  <button
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    onClick={() => 
                      {
                      img.id && handleDeleteImage(img.id)
                    }}
                  >
                    X
                  </button>
                </div>
              ))}
              {localImagePreviews.map((preview, index) => (
              <div key={`preview-${index}`} className="relative w-24 h-24">
                <img src={preview} alt={`New Vehicle ${index}`} className="w-full h-full object-cover" />
                <button
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  onClick={() => {
                    setLocalImagePreviews(prev => prev.filter((_, i) => i !== index));
                    setFilesToUpload(prev => {
                      if (prev) {
                        const dataTransfer = new DataTransfer();
                        Array.from(prev)
                          .filter((_, i) => i !== index)
                          .forEach(file => dataTransfer.items.add(file));
                        return dataTransfer.files;
                      }
                      return null;
                    });
                  }}
                >
                  X
                </button>
              </div>
            ))}

                <label className="w-24 h-24 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer">
                <input
                  type="file"
                  multiple
                  onChange={handleAddImage}
                  className="hidden"
                />
                <span className="text-4xl text-gray-300">+</span>
              </label>
            </div>
          </div>
        </CardContent>
        <CardFooter className='bg-gray-900 text-white p-6 flex justify-end'>
          <Button className="px-6 py-3 rounded-md bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors" onClick={handleSubmit}>{isEditing ? 'Update' : 'Add'}</Button>
          <Button className="px-6 py-3 rounded-md bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors" onClick={onClose}>Cancel</Button>
        </CardFooter>
      </Card>
    </Modal>
  );
}

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
import crypto from 'crypto';

const basecloudinaryUrl = "https://api.cloudinary.com/v1_1/diyhxd1my"
const uploadImgUrl = `${basecloudinaryUrl}/image/upload`;
const deleteImgUrl = `${basecloudinaryUrl}/image/destroy`;
const uploadPreset = "nwpzqpdi";
const baseUrl = 'https://localhost:7126/api/v1';
const vehicleUrl = `${baseUrl}/Vehicle`;
const imageUrl = `${baseUrl}/Image`;
const cloudName = 'diyhxd1my';
const apiKey = '347341592221484';


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
  const [vehicleData, setVehicleData] = useState<Partial<Vehicle>>({});
  const [vehicleImages, setVehicleImages] = useState<VehicleImage[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<FileList | null>(null);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [localImagePreviews, setLocalImagePreviews] = useState<string[]>([]);

  const handleNavigate = () => {
    router.push('/inventory');
  };

  useEffect(() => {
    if (vehicleToEdit) {
      setIsEditing(true);
      setVehicleData(vehicleToEdit);
      setVehicleImages(vehicleToEdit.vehicleImages || []);
      setExistingImages(vehicleToEdit.vehicleImages?.map(img => img.imageUrl) || []);
      console.log("Vehicle images set:", vehicleToEdit.vehicleImages);
    }
  }, [vehicleToEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVehicleData(prev => ({ ...prev, [name]: value }));
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
 
  
 
  const handleDeleteImage = useCallback(async (id: number, publicId: string) => {
    try {    
      
      await axios.delete(`https://localhost:7126/api/v1/Image/${id}`);
      setVehicleImages(prev => prev.filter(img => img.id !== id));
      setImagesToDelete(prev => {
        if (typeof id === 'number') {
          return [...prev, id];
        }
        return prev;
      });
      console.log("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
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

      console.log("API Response:", data);

      setVehicleData(prev => ({
        ...prev,
        carMake: data.Make || '',
        model: data.Model || '',
        year: data.ModelYear || '',
        engineType: data.EngineConfiguration || '',
        transmissionType: data.TransmissionStyle || '',
        description: `${data.Make} ${data.Model} ${data.ModelYear} - ${data.EngineHP} HP, ${data.FuelTypePrimary} engine`
      }));

      console.log("Setting CarMake:", data.Make);
      console.log("Setting Model:", data.Model);
      console.log("Setting Year:", data.ModelYear);
      console.log("Setting EngineType:", data.EngineConfiguration);
      console.log("Setting TransmissionType:", data.TransmissionStyle);

      const makes = ["HONDA", "TOYOTA", "HYUNDAI", "KIA", "FORD"];
      const matchedMake = makes.find(make => make === data.Make.toUpperCase());
      if (matchedMake) {
        setVehicleData(prev => ({ ...prev, carMake: matchedMake }));
        console.log("Matched CarMake:", matchedMake);
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
        console.log("Matched EngineType:", engineConfig);
      }

      if (data.TransmissionStyle) {
        const transmissionStyle = data.TransmissionStyle.toLowerCase();
        if (transmissionStyle.includes('automatic')) {
          setVehicleData(prev => ({ ...prev, transmissionType: 'automatic' }));
        } else if (transmissionStyle.includes('manual')) {
          setVehicleData(prev => ({ ...prev, transmissionType: 'manual' }));
        }
        console.log("Matched TransmissionType:", transmissionStyle);
      }
    } catch (error) {
      console.error('Error fetching VIN data:', error);
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

  const handleSubmit = async () => {
    try {
      let vehicleId: number | null = null;
      if (isEditing && vehicleToEdit) {
        const patchOperations = getPatchOperations(vehicleToEdit, vehicleData);
        await axios.patch(`${vehicleUrl}/${vehicleToEdit.id}`, patchOperations, {
          headers: { 'Content-Type': 'application/json-patch+json' }
        });
        vehicleId = vehicleToEdit.id;
        console.log(`Vehicle updated with ID: ${vehicleId}`);
      } else {
        const vehiclePayload = {
          ...vehicleData,
          dealershipId: 1, 
          status: 'Available'
        };
        const response = await axios.post(vehicleUrl, vehiclePayload);
        vehicleId = response.data.id;
        console.log(`New vehicle created with ID: ${vehicleId}`);
      }

      if (vehicleId && filesToUpload?.length) {
        console.log(`Uploading ${filesToUpload.length} images for vehicle ${vehicleId}`);
        
        for (let i = 0; i < filesToUpload.length; i++) {
          try {
            const file = filesToUpload[i];
            console.log(`Uploading image ${i + 1} to Cloudinary...`);
            const imageUrl = await uploadImageToCloudinary(file);
            console.log(`Image ${i + 1} uploaded to Cloudinary. URL: ${imageUrl.secure_url}`);
            console.log(imageUrl);
            
            console.log(`Posting image ${i + 1} to backend...`);
            const imageResponse = await axios.post('https://localhost:7126/api/v1/Image/', {
              imageUrl: imageUrl.secure_url,
              vehicleId: vehicleId,
              publicId: imageUrl.public_id 
            });            
            console.log(`Image ${i + 1} posted to backend. Response:`, imageResponse.data);
          } catch (error) {
            console.error(`Error uploading image ${i + 1}:`, error);
          }
        }
      } else {
        console.log(`No images to upload for vehicle ${vehicleId}`);
      }
  
      console.log(`Vehicle ${isEditing ? 'updated' : 'added'} successfully`);
      handleNavigate();
      onClose();
    } catch (error) {
      console.error('Error handling vehicle submission:', error);
      // Consider adding user-friendly error handling here
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
                        console.log("Imagenes de lo vehiculo:", vehicleImages)
                        console.log("imagene ma adentro", img)
                      console.log("Deleting image:", img.id, img.public_id);
                      img.id && handleDeleteImage(img.id, img.public_id)
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

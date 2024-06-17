'use client'
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const url = "https://localhost:7126/api/v1/Vehicle";

export function Popup() {
  const router = useRouter();
const handleNavigate = () => {
  router.push('/inventory');
};
  const [vin, setVIN] = useState('');
  const [CarMake, setCarMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [color, setColor] = useState('');
  const [price, setPrice] = useState('');
  const [engineType, setEngineType] = useState('');
  const [transmissionType, setTransmissionType] = useState('');
  const [mileage, setMileage] = useState('');
  const [description, setDescription] = useState('');
  const [dealershipId, setDealershipId] = useState('');
  const [vehicleType, setVehicleType] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(url, {
        carMake : CarMake,
        vIN : vin,
        model : model,
        year: year,
        color : color,
        price: price,
        engineType : engineType,
        transmissionType : transmissionType,
        mileage : mileage,
        dealershipId: dealershipId,
        description : description,
        vehicleType : vehicleType});
      console.log(response.data);
    }
    catch(error)
    {
      console.log(error);
    }
  }   

  return (
    <form className="space-y-6 mt-8" onSubmit={handleSubmit}>
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-gray-900 text-white p-6 relative">
        <CardTitle className="text-2xl font-bold">Add New Vehicle</CardTitle>
        <CardDescription className="text-gray-300">Enter the details of the new vehicle.</CardDescription>
        <Button className="absolute top-4 right-4 rounded-full" size="icon" variant="ghost" onClick={handleNavigate}>
        
          <XIcon className="w-5 h-5" />
          
        </Button>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
        
          <div className="space-y-4">
            <Label className="text-lg font-medium" htmlFor="CarMake">
              Make
            </Label>
            <Input
              className="px-4 py-3 rounded-md border border-gray-200 border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:border-gray-800"
              id="CarMake"
              placeholder="Enter make"
              value={CarMake}
              onChange={(e) => setCarMake(e.target.value)}
            />
          </div>
          <div className="space-y-4">
            <Label className="text-lg font-medium" htmlFor="model">
              Model
            </Label>
            <Input
              className="px-4 py-3 rounded-md border border-gray-200 border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:border-gray-800"
              id="model"
              placeholder="Enter model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <Label className="text-lg font-medium" htmlFor="year">
              Year
            </Label>
            <Input
              className="px-4 py-3 rounded-md border border-gray-200 border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:border-gray-800"
              id="year"
              placeholder="Enter year"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
          <div className="space-y-4">
            <Label className="text-lg font-medium" htmlFor="price">
              Price
            </Label>
            <Input
              className="px-4 py-3 rounded-md border border-gray-200 border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:border-gray-800"
              id="price"
              placeholder="Enter price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <Label className="text-lg font-medium" htmlFor="engine">
              Engine
            </Label>
            <Select>
              <SelectTrigger id="engine" className="px-4 py-3 rounded-md border border-gray-200 border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:border-gray-800">
                <SelectValue placeholder="Select engine" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 border-gray-300 dark:border-gray-600 dark:border-gray-800">
                <SelectItem className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700" value="v6">
                  V6
                </SelectItem>
                <SelectItem className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700" value="v8">
                  V8
                </SelectItem>
                <SelectItem className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700" value="inline4">
                  Inline 4
                </SelectItem>
              </SelectContent>
              
            </Select>
          </div>
          <div className="space-y-4">
            <Label className="text-lg font-medium" htmlFor="transmission">
              Transmission
            </Label>
            <Select>
              <SelectTrigger id="transmission" className="px-4 py-3 rounded-md border border-gray-200 border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:border-gray-800">
                <SelectValue placeholder="Select transmission" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 border-gray-300 dark:border-gray-600 dark:border-gray-800">
                <SelectItem className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700" value="automatic">
                  Automatic
                </SelectItem>
                <SelectItem className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700" value="manual">
                  Manual
                </SelectItem>
                <SelectItem className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700" value="cvt">
                  CVT
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <Label className="text-lg font-medium" htmlFor="mileage">
              Mileage
            </Label>
            <Input
              className="px-4 py-3 rounded-md border border-gray-200 border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:border-gray-800"
              id="mileage"
              placeholder="Enter mileage"
              type="number"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
            />
          </div>
          <div className="space-y-4">
            <Label className="text-lg font-medium" htmlFor="type">
              Type
            </Label>
            <Select>
              <SelectTrigger id="type" className="px-4 py-3 rounded-md border border-gray-200 border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:border-gray-800">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 border-gray-300 dark:border-gray-600 dark:border-gray-800">
                <SelectItem className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700" value="sedan">
                  Sedan
                </SelectItem>
                <SelectItem className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700" value="suv">
                  SUV
                </SelectItem>
                <SelectItem className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700" value="truck">
                  Truck
                </SelectItem>
              </SelectContent>
            </Select>
          </div>        
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <Label className="text-lg font-medium" htmlFor="Description">
              Description
            </Label>
            <Input
              className="px-4 py-3 rounded-md border border-gray-200 border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:border-gray-800"
              id="Description"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-4">
            <Label className="text-lg font-medium" htmlFor="year">
              Dealership
            </Label>
            <Input
              className="px-4 py-3 rounded-md border border-gray-200 border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:border-gray-800"
              id="dealershipId"
              placeholder="Enter dealership ID"
              value={dealershipId}
              onChange={(e) => setDealershipId(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <Label className="text-lg font-medium" htmlFor="year">
              Color
            </Label>
            <Input
              className="px-4 py-3 rounded-md border border-gray-200 border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:border-gray-800"
              id="color"
              placeholder="Enter color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
          <div className="space-y-4">
            <Label className="text-lg font-medium" htmlFor="year">
              VIN
            </Label>
            <Input
              className="px-4 py-3 rounded-md border border-gray-200 border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:border-gray-800"
              id="vin"
              placeholder="Enter VIN"
              value={vin}
              onChange={(e) => setVIN(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <Label htmlFor="campus" className="text-lg font-medium">
              Images
            </Label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="campus-image"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadIcon className="w-10 h-10 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF</p>
                </div>
                <input id="campus-image" type="file" className="hidden" />
                </label>
                </div>
                </div>
                </div>
        
      </CardContent>
      <CardFooter className="bg-gray-900 text-white p-6 flex justify-end">
        <Button
          className="px-6 py-3 rounded-md bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          type="submit">
          Save Vehicle
        </Button>        
      </CardFooter>      
    </Card>
    </form>
  )
}


function UploadIcon(props) {
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  )
}

function XIcon(props) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

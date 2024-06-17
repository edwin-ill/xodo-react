'use client'
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const url = "https://localhost:7126/api/v1/Dealership";

export function Dealerform() {
  const router = useRouter();
const handleNavigate = () => {
  router.push('/inventory');
};
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(url, {
        name : name,
        address : address,
        phoneNumber : phoneNumber,
        city: city,
        email : email,
      });
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
        <CardTitle className="text-2xl font-bold">Add New Dealership</CardTitle>
        <CardDescription className="text-gray-300">Enter the details of the new Dealership.</CardDescription>
        <Button className="absolute top-4 right-4 rounded-full" size="icon" variant="ghost" onClick={handleNavigate}>        
          <XIcon className="w-5 h-5" />          
        </Button>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">       
          <div className="space-y-4">
            <Label className="text-lg font-medium" htmlFor="name">
            Name
            </Label>
            <Input
              className="px-4 py-3 rounded-md border border-gray-200 border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:border-gray-800"
              id="name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>            
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <Label className="text-lg font-medium" htmlFor="Address">
              Address
            </Label>
            <Input
              className="px-4 py-3 rounded-md border border-gray-200 border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:border-gray-800"
              id="address"
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="space-y-4">
            <Label className="text-lg font-medium" htmlFor="phoneNumber">
            Phone Number
            </Label>
            <Input
              className="px-4 py-3 rounded-md border border-gray-200 border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:border-gray-800"
              id="phoneNumber"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <Label className="text-lg font-medium" htmlFor="email">
            Email
            </Label>
            <Input
              className="px-4 py-3 rounded-md border border-gray-200 border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:border-gray-800"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-4">
            <Label className="text-lg font-medium" htmlFor="city">
            City
            </Label>
            <Input
              className="px-4 py-3 rounded-md border border-gray-200 border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:border-gray-800"
              id="vin"
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
        </div>        
      </CardContent>
      <CardFooter className="bg-gray-900 text-white p-6 flex justify-end">
        <Button
          className="px-6 py-3 rounded-md bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          type="submit">
          Save dealership
        </Button>        
      </CardFooter>      
    </Card>
    </form>
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
      strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

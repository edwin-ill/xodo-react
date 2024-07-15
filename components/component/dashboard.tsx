'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from "next/link";
import { ThemeProvider } from 'next-themes';
import { Button } from "@/components/ui/button";
import { DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuContent, DropdownMenu } from "@/components/ui/dropdown-menu";
import { CardTitle, CardHeader, CardContent, Card} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useSession } from 'next-auth/react';

interface Vehicle {
  id: number;
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
  dealership: {
    id: number;
    name: string;
    address: string;
    city: string;
    phoneNumber: string;
    email: string;
  };
  vehicleImages: Array<{
    id: number;
    vehicleId: number;
    imageUrl: string;
  }>;
}

interface DashboardData {
  succeeded: boolean;
  message: string;
  errors: null | any;
  data: Vehicle[];
}

export function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const {data : session} = useSession();

  useEffect(() => {
    setIsLoading(true);
    axios.get('https://localhost:7126/api/v1/Vehicle')
      .then(response => {
        console.log("Dashboard data:", response.data);
        setDashboardData(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
        setError(error);
        setIsLoading(false);
      });
  }, []);

  return (
    <ThemeProvider>
      <div className="flex min-h-screen w-full flex-col">
        <header className="flex h-16 items-center border-b bg-gray-100 px-6">
          <Link className="flex items-center gap-2" href="#">
            <CarIcon className="h-6 w-6"/>
            <span className="text-lg font-semibold">Acme Car Dealership</span>
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="rounded-full" size="icon" variant="ghost">
                  <img
                    alt="Avatar"
                    className="rounded-full"
                    height="32"
                    src="/placeholder.svg"
                    style={{
                      aspectRatio: "32/32",
                      objectFit: "cover",
                    }}
                    width="32"
                  />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className="flex flex-1">
          <div className="hidden border-r bg-gray-100/40 lg:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
              <div className="flex-1 overflow-auto py-2">
                <nav className="grid items-start px-4 text-sm font-medium">
                  <Link
                    className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900"
                    href="#">
                    <LayoutDashboardIcon className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
                    <CarIcon className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardData?.data.length || 0}</div>
                    <p className="text-xs text-gray-500">Total number of vehicles</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Available Vehicles</CardTitle>
                    <CarIcon className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboardData?.data.filter(v => v.status === "Available").length || 0}
                    </div>
                    <p className="text-xs text-gray-500">Vehicles in stock</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Sold Vehicles</CardTitle>
                    <CarIcon className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboardData?.data.filter(v => v.status == "Sold").length || 0}
                    </div>
                    <p className="text-xs text-gray-500">Reserved vehicles</p>
                  </CardContent>
                </Card>                
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Inventory Management</CardTitle>
                    <CarIcon className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <span>New Vehicles</span>
                        <span className="font-medium">
                          {dashboardData?.data.filter(v => v.vehicleType === "1").length || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Reserved Vehicles</span>
                        <span className="font-medium">
                          {dashboardData?.data.filter(v => v.status == "Reserved").length || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Total Vehicles</span>
                        <span className="font-medium">{dashboardData?.data.length || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>               
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Performance</CardTitle>
                    <CarIcon className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <p>Add performance metrics here</p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4">
              <Tabs defaultValue="inventory">          
                <TabsContent value="inventory">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Make</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>Count</TableHead>
                        <TableHead>Price Range</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(() => {
                        const groupedData = (dashboardData?.data || []).reduce((acc, vehicle) => {
                          const make = vehicle.carMake.trim().toLowerCase();
                          const model = vehicle.model.trim().toLowerCase();
                          const year = vehicle.year;
                          const key = `${make}-${model}-${year}`;
                          
                          if (!acc[key]) {
                            acc[key] = {
                              make: vehicle.carMake,
                              model: vehicle.model,
                              year: vehicle.year,
                              count: 0,
                              prices: [],
                            };
                          }
                          
                          acc[key].count++;
                          acc[key].prices.push(vehicle.price);
                          
                          return acc;
                        }, {} as Record<string, {
                          make: string;
                          model: string;
                          year: number;
                          count: number;
                          prices: number[];
                        }>);

                        console.log("Grouped Data:", groupedData);  

                        return Object.values(groupedData)
                          .sort((a, b) => 
                            a.make.localeCompare(b.make) || 
                            a.model.localeCompare(b.model) || 
                            a.year - b.year
                          )
                          .map((group) => {
                            const minPrice = Math.min(...group.prices);
                            const maxPrice = Math.max(...group.prices);
                            const priceRange = minPrice === maxPrice 
                              ? `$${minPrice.toLocaleString()}`
                              : `$${minPrice.toLocaleString()} - $${maxPrice.toLocaleString()}`;

                            return (
                              <TableRow key={`${group.make}-${group.model}-${group.year}`}>
                                <TableCell>{group.make}</TableCell>
                                <TableCell>{group.model}</TableCell>
                                <TableCell>{group.year}</TableCell>
                                <TableCell>{group.count}</TableCell>
                                <TableCell>{priceRange}</TableCell>
                              </TableRow>
                            );
                          });
                      })()}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
              </div>
            </main>
          </div>
        </div>
      </div>
    </ThemeProvider>
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


'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from "next/link";
import { ThemeProvider } from 'next-themes';
import { Button } from "@/components/ui/button";
import { DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuContent, DropdownMenu } from "@/components/ui/dropdown-menu";
import { CardTitle, CardHeader, CardContent, Card, CardDescription} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import Cookies from 'js-cookie';

interface DashboardData {
  totalVehicles: number;
  totalVehiclesPercentage: number;
  newVehicles: number;
  newVehiclesPercentage: number;
  usedVehicles: number;
  usedVehiclesPercentage: number;
  pendingOrders: number;
  pendingOrdersPercentage: number;
  salesData: Array<{ month: string; sales: number }>;
  sales: Array<{ model: string; sales: number; revenue: number }>;
  inventory: Array<{ model: string; status: string; stock: number }>;
  newLeads: number;
  qualifiedLeads: number;
  salesLeads: number;
}

const token = Cookies.get('token');
axios.defaults.headers.post['Authorization'] = 'Bearer ${token}';

export function Dashboard() {
 const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {

    axios.get('https://localhost:7126/api/v1/Vehicle') 
      .then(response => {
        console.error("Dashboard data:", response.data);
        setDashboardData(response.data);
        
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
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
                  href="/popup">
                  <CarIcon className="h-4 w-4" />
                  Add new car
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
                    <div className="text-2xl font-bold">{}</div>
                    <p className="text-xs text-gray-500">+{}% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">New Vehicles</CardTitle>
                    <CarIcon className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{}</div>
                    <p className="text-xs text-gray-500">+{}% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Used Vehicles</CardTitle>
                    <CarIcon className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{}</div>
                    <p className="text-xs text-gray-500">+{}% from last month</p>
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
                        <span className="font-medium">{}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Used Vehicles</span>
                        <span className="font-medium">{}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Pending Orders</span>
                        <span className="font-medium">{}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>               
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Performance</CardTitle>
                    <CarIcon className="h-4 w-4 text-gray-500" />
                  </CardHeader>                  
                </Card>
              </div>
              <div className="grid gap-4">
                <Tabs defaultValue="inventory">          
                  <TabsContent value="inventory">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Model</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Stock</TableHead>
                        </TableRow>
                      </TableHeader>                      
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
}

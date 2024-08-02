'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from "next/link";
import { ThemeProvider } from 'next-themes';
import { CardTitle, CardHeader, CardContent, Card} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useSession } from 'next-auth/react';
import { LayoutDashboardIcon, CarIcon, UsersIcon, SettingsIcon } from 'lucide-react';
import Sweet from 'sweetalert2';

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
        setDashboardData(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.Message || 'Un error desconocido ocurrió';
          Sweet.fire({
            title: 'Hubo un error encontrando la información',
            text: `${errorMessage}`, 
            icon: 'error',
            confirmButtonColor:'#d30000'
          });
        }
        else if (error instanceof Error) {
          Sweet.fire({
            title: 'Hubo un error encontrando la información',
            text: `${error.message}`, 
            icon: 'error',
            confirmButtonColor:'#d30000'
          });
        } else {
          Sweet.fire({
            title: 'Hubo un error encontrando la información',
            text: `Un error desconocido ocurrió`,
            icon: 'error',
            confirmButtonColor:'#d30000'
          });
        }
        setError(error);
        setIsLoading(false);
      });
  }, []);

  return (
    <ThemeProvider>
      <div className="flex min-h-screen w-full flex-col">
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Número de vehículos</CardTitle>
                    <CarIcon className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardData?.data.length || 0}</div>
                    <p className="text-xs text-gray-500">Número total de vehículos</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Vehículos disponibles</CardTitle>
                    <CarIcon className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboardData?.data.filter(v => v.status === "Disponible").length || 0}
                    </div>
                    <p className="text-xs text-gray-500">Vehículos en stock</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Vehículos vendidos</CardTitle>
                    <CarIcon className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboardData?.data.filter(v => v.status == "Vendido").length || 0}
                    </div>
                    <p className="text-xs text-gray-500">Vehículos con estado de venta</p>
                  </CardContent>
                </Card>                
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Administración de inventario</CardTitle>
                    <CarIcon className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <span>Vehículos nuevos</span>
                        <span className="font-medium">
                          {dashboardData?.data.filter(v => v.vehicleType === "1").length || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Vehículos reservados</span>
                        <span className="font-medium">
                          {dashboardData?.data.filter(v => v.status == "Reservado").length || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Todos los vehículos</span>
                        <span className="font-medium">{dashboardData?.data.length || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>                               
              </div>
              <div className="grid gap-4">
              <Tabs defaultValue="inventory">          
                <TabsContent value="inventory">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Marca</TableHead>
                        <TableHead>Modelo</TableHead>
                        <TableHead>Año</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Rango de precios</TableHead>
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



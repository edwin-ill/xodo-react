"use client";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { CarIcon, LayoutDashboardIcon, SettingsIcon, PlusIcon, ImageIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { Dealerform } from "@/components/dealerform" 
import Sweet from 'sweetalert2'
import { useSession } from "next-auth/react";

type Dealership = {
  id: number;
  name: string;
  address: string;
  city: string;
  phoneNumber: string;
  email: string;
};

type User = {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  roles: string[];
};

export function Settings() {
  const [showDealerForm, setShowDealerForm] = useState(false);
  const [dealerships, setDealerships] = useState<Dealership[]>([]);  
  const [users, setUsers] = useState<User[]>([]);
  const {data : session} = useSession();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    async function fetchDealerships() {
      try {
        const response = await fetch("https://localhost:7126/api/v1/Dealership");
        const data = await response.json();
        if (data.succeeded) {
          setDealerships(data.data);
        } else {
          console.error("Error fetching dealerships:", data.message);
        }
      } catch (error) {
        console.error("Error fetching dealerships:", error);
      }
    }

    fetchDealerships();
  }, [refreshTrigger]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("https://localhost:7126/api/Account");
        const data = await response.json();
        console.log(data);
        if (data.succeeded) {
          setUsers(data.data);
        } else {
          console.error("Error fetching users:", data.message);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    fetchUsers();
  }, [refreshTrigger]);

  async function deleteUser(userId: string) {
    try {
      const response = await fetch(`https://localhost:7126/api/Account/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.user.jwToken}`
        }
      });
  
      if (response.status === 204) {
        refresh();
        Sweet.fire({
          title: 'Usuario eliminado correctamente',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } else {
        const data = await response.json();
        Sweet.fire({
          title: 'Error eliminado el usuario',
          text: data.message || 'Ocurrió un error eliminado el usuario',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error("Error eliminado el usuario:", error);
      Sweet.fire({
        title: 'Error eliminado el usuario',
        text: 'Ocurrió un error inesperado',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }
  
  async function deleteDealership(dealershipId: number) {
    try {
      const response = await fetch(`https://localhost:7126/api/v1/Dealership/${dealershipId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.user.jwToken}`
        }
      });
      const data = await response.json();
      if (response.status == 204) {
        refresh();
        Sweet.fire({
          title: 'Concesionario eliminado correctamente',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } else {
        Sweet.fire({
          title: 'Error eliminando concesionario',
          text: data.message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error("Error eliminando concesionario:", error);
      Sweet.fire({
        title: 'Error eliminando concesionario',
        text: 'Ocurrió un error inesperado',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
  
    const formData = {
      firstName: form['new-name'].value,
      lastName: form['new-lastname'].value,
      phone: form['new-phonenumber'].value,
      userName: form['new-username'].value,
      email: form['new-email'].value,
      password: form['new-password'].value,
      confirmPassword: form['confirm-password'].value,
      img: ""
    };
  
    try {
      const response = await fetch("https://localhost:7126/api/account/registeradmin", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user.jwToken}`
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (!data.hasError) {
        Sweet.fire({
          title: 'Cuenta creada correctamente',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        refresh();
        form.reset(); 
      } else {
        Sweet.fire({
          title: 'Error creando cuenta',
          text: data.error,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error("Error creando cuenta:", error);
      Sweet.fire({
        title: 'Error creando cuenta',
        text: 'Un error inesperado ocurrió',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };
  return (
    <div className="flex min-h-screen w-full flex-col">      
      <div className="flex flex-1"> 
        <div className="hidden border-r bg-gray-100/40 lg:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-4 text-sm font-medium">
                <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900" href="/dashboard">
                  <LayoutDashboardIcon className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900" href="/inventory">
                  <CarIcon className="h-4 w-4"/>
                  Inventario
                </Link>      
                <Link className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900" href="/settings">
                  <SettingsIcon className="h-4 w-4" />
                  Configuración
                </Link>
              </nav>
            </div>
          </div>
        </div>
        <main className="flex-1 grid gap-8 p-6 md:p-8">
          <section>
            <h2 className="text-2xl font-semibold">Crear cuenta nueva</h2>
            <Card className="mt-4">
              <CardContent className="pt-6">
              <form className="grid gap-4" autoComplete="off" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="new-name">Nombre</Label>
                <Input id="new-name" type="text" autoComplete="off" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-lastname">Apellido</Label>
                <Input id="new-lastname" type="text" autoComplete="off" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-phonenumber">Número de teléfono</Label>
                <Input id="new-phonenumber" type="text" autoComplete="off" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-username">Usuario</Label>
                <Input id="new-username" type="text" autoComplete="off" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-email">Correo electrónico</Label>
                <Input id="new-email" type="email" autoComplete="off" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-password">Contraseña</Label>
                <Input id="new-password" type="password" autoComplete="new-password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                <Input id="confirm-password" type="password" autoComplete="new-password" />
              </div>
              <Button type="submit">Crear cuenta</Button>
            </form>
            </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">Todas las cuentas</h2>
            <Card className="mt-4">
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Correo electrónico</TableHead>
                      <TableHead>Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.firstName}, {user.lastName}</TableCell>
                      <TableCell>{user.email}</TableCell>                      
                      <TableCell>
                      <Button variant="destructive" size="sm" onClick={() => 
                            Sweet.fire({
                              title: '¿Estás seguro de que deseas eliminar esta cuenta?',
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
                                  deleteUser(user.id)
                                }
                              })) }>Eliminar</Button>
                        
                      </TableCell>
                    </TableRow>
                  ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">Ubicaciones de los concesarionarios</h2>
            <Card className="mt-4">
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Dirección</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Correo electrónico</TableHead>
                      <TableHead>Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dealerships.map((dealership) => (
                      <TableRow key={dealership.id}>
                        <TableCell>{dealership.name}</TableCell>
                        <TableCell>{dealership.address}, {dealership.city}</TableCell>
                        <TableCell>{dealership.phoneNumber}</TableCell>
                        <TableCell>{dealership.email}</TableCell>
                        <TableCell>
                        <Button variant="destructive" size="sm" onClick={() => 
                            Sweet.fire({
                              title: '¿Estás seguro de que deseas eliminar este dealer?',
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
                                  deleteDealership(dealership.id)
                                }
                              })) }>Eliminar</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button className="mt-4" size="sm" onClick={() => setShowDealerForm(true)}>
                  <PlusIcon className="mr-2 h-4 w-4" /> Agregar una nueva ubicación
                </Button>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">Image Settings</h2>
            <Card className="mt-4">
              <CardContent className="pt-6">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="client-index-image">Client Page Index Image</Label>
                    <div className="flex items-center mt-2">
                      <Input id="client-index-image" type="file" accept="image/*" />
                      <Button className="ml-2" size="sm">
                        <ImageIcon className="mr-2 h-4 w-4" /> Upload
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="login-background-image">Login Background Image</Label>
                    <div className="flex items-center mt-2">
                      <Input id="login-background-image" type="file" accept="image/*" />
                      <Button className="ml-2" size="sm">
                        <ImageIcon className="mr-2 h-4 w-4" /> Upload
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">Configuración de cuenta</h2>
            <Card className="mt-4">
              <CardContent className="pt-6">
                <div className="grid gap-4">
                  <div>
                    <Button variant="outline" size="sm">Cambiar contraseña</Button>
                  </div>                 
                </div>
              </CardContent>
            </Card>
          </section>        
          {showDealerForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg overflow-hidden max-w-2xl w-full">
                <Dealerform onClose={() => {setShowDealerForm(false); refresh()}} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
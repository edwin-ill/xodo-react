import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { CarIcon, LayoutDashboardIcon, SettingsIcon, UsersIcon } from "lucide-react"

export function Settings() {
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
              className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900"
              href="/settings">
              <SettingsIcon className="h-4 w-4" />
              Settings
            </Link>
          </nav>  
        </div>
      </div>
    </div>
      <main className="flex-1 grid gap-8 p-6 md:p-8">
        <section>
          <h2 className="text-2xl font-semibold">Account Settings</h2>
          <div className="grid gap-6 mt-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" defaultValue="John Doe" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="john@example.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" defaultValue="+1 (555) 555-5555" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" rows={3} defaultValue="123 Main St, Anytown USA" />
            </div>
            <Button size="sm">Save Changes</Button>
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-semibold">Payment Methods</h2>
          <div className="grid gap-6 mt-6">
            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <CreditCardIcon className="h-6 w-6" />
                    <div>
                      <div className="font-medium">Visa **** 4321</div>
                      <div className="text-muted-foreground text-sm">Expires 12/24</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <WalletCardsIcon className="h-6 w-6" />
                    <div>
                      <div className="font-medium">PayPal</div>
                      <div className="text-muted-foreground text-sm">john@example.com</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Button size="sm">Add Payment Method</Button>
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-semibold">Order History</h2>
          <div className="grid gap-6 mt-6">
            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Link href="#" className="font-medium" prefetch={false}>
                          #123
                        </Link>
                      </TableCell>
                      <TableCell>June 23, 2022</TableCell>
                      <TableCell>$150.00</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Fulfilled</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Link href="#" className="font-medium" prefetch={false}>
                          #456
                        </Link>
                      </TableCell>
                      <TableCell>May 15, 2022</TableCell>
                      <TableCell>$75.00</TableCell>
                      <TableCell>
                        <Badge variant="outline">Refunded</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Link href="#" className="font-medium" prefetch={false}>
                          #789
                        </Link>
                      </TableCell>
                      <TableCell>April 2, 2022</TableCell>
                      <TableCell>$250.00</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Fulfilled</Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-semibold">Notification Settings</h2>
          <div className="grid gap-6 mt-6">
            <Card>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Email Notifications</div>
                      <div className="text-muted-foreground text-sm">
                        Receive email notifications for important updates.
                      </div>
                    </div>
                    <Switch id="email-notifications" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Push Notifications</div>
                      <div className="text-muted-foreground text-sm">
                        Receive push notifications for real-time updates.
                      </div>
                    </div>
                    <Switch id="push-notifications" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">SMS Notifications</div>
                      <div className="text-muted-foreground text-sm">
                        Receive SMS notifications for critical alerts.
                      </div>
                    </div>
                    <Switch id="sms-notifications" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-semibold">Security Settings</h2>
          <div className="grid gap-6 mt-6">
            <Card>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Two-Factor Authentication</div>
                      <div className="text-muted-foreground text-sm">
                        Add an extra layer of security to your account.
                      </div>
                    </div>
                    <Switch id="two-factor-auth" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Logout Sessions</div>
                      <div className="text-muted-foreground text-sm">Manage active sessions and log out devices.</div>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
    </div>
    
  )
}

function CreditCardIcon(props) {
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
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  )
}


function Package2Icon(props) {
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
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  )
}


function WalletCardsIcon(props) {
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
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2" />
      <path d="M3 11h3c.8 0 1.6.3 2.1.9l1.1.9c1.6 1.6 4.1 1.6 5.7 0l1.1-.9c.5-.5 1.3-.9 2.1-.9H21" />
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

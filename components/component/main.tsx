import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CardContent, Card } from "@/components/ui/card"

export function Main() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="bg-gray-900 text-white py-4 px-6 md:px-10">
        <div className="container mx-auto flex items-center justify-between">
          <Link className="flex items-center" href="#">
            <CarIcon className="h-8 w-8 mr-2" />
            <span className="text-xl font-bold">Acme Dealership</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link className="hover:underline" href="#">
              Home
            </Link>
            <Link className="hover:underline" href="#">
              Inventory
            </Link>
            <Link className="hover:underline" href="#">
              About
            </Link>
            <Link className="hover:underline" href="#">
              Contact
            </Link>
          </nav>
          <Button>Browse Inventory</Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="relative h-[60vh] md:h-[80vh]">
          <img
            alt="Hero Image"
            className="absolute inset-0 w-full h-full object-cover"
            height={1080}
            src="/placeholder.svg"
            style={{
              aspectRatio: "1920/1080",
              objectFit: "cover",
            }}
            width={1920}
          />
          <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
            <div className="text-center text-white space-y-6">
              <div className="flex items-center justify-center">
                <CarIcon className="h-12 w-12 mr-2" />
                <h1 className="text-4xl md:text-6xl font-bold">Acme Dealership</h1>
              </div>
              <p className="text-lg md:text-xl">Discover your dream car today.</p>
              <Button>Browse Inventory</Button>
            </div>
          </div>
        </section>
        <section className="bg-gray-100 py-12 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-2xl text-black md:text-3xl font-bold mb-8">Our Current Inventory</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <Card>
                <img
                  alt="Car Image"
                  className="w-full h-48 object-cover rounded-t-md"
                  height={300}
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "400/300",
                    objectFit: "cover",
                  }}
                  width={400}
                />
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold">2022 Toyota Camry</h3>
                  <p className="text-gray-500 text-sm">2022 | $25,999</p>
                </CardContent>
              </Card>
              <Card>
                <img
                  alt="Car Image"
                  className="w-full h-48 object-cover rounded-t-md"
                  height={300}
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "400/300",
                    objectFit: "cover",
                  }}
                  width={400}
                />
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold">2021 Honda Civic</h3>
                  <p className="text-gray-500 text-sm">2021 | $22,499</p>
                </CardContent>
              </Card>
              <Card>
                <img
                  alt="Car Image"
                  className="w-full h-48 object-cover rounded-t-md"
                  height={300}
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "400/300",
                    objectFit: "cover",
                  }}
                  width={400}
                />
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold">2020 Ford Mustang</h3>
                  <p className="text-gray-500 text-sm">2020 | $32,999</p>
                </CardContent>
              </Card>
              <Card>
                <img
                  alt="Car Image"
                  className="w-full h-48 object-cover rounded-t-md"
                  height={300}
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "400/300",
                    objectFit: "cover",
                  }}
                  width={400}
                />
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold">2019 Chevrolet Silverado</h3>
                  <p className="text-gray-500 text-sm">2019 | $38,499</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-gray-900 text-white py-6 px-4 md:px-6">
        <div className="container mx-auto flex items-center justify-between">
          <p className="text-sm">© 2024 Acme Dealership. All rights reserved.</p>
          <nav className="flex items-center space-x-4">
            <Link className="hover:underline" href="#">
              Privacy Policy
            </Link>
            <Link className="hover:underline" href="#">
              Terms of Service
            </Link>
            <Link className="hover:underline" href="#">
              Contact Us
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
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

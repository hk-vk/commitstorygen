import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function Component() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1a1333] px-4">
      <div className="relative w-64 h-64 mb-8">
        <div className="absolute -right-2 top-0 w-6 h-6 bg-red-500 rounded-full animate-bounce" />
        <Image
          src="/cat.png? height=400&width=400"
          alt="Coding Cat Mascot"
          width={400}
          height={400}
          className="drop-shadow-2xl animate-fade-in-up"
        />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-8 tracking-wide animate-fade-in">
        HEY LETS COMMIT A STORY
      </h1>
      <h4 className="text-4xl md:text-2xl font-bold text-white text-center mb-8 tracking-wide animate-fade-in" >
      Collaborate, code, and create amazing stories together
      </h4>
      <Link href="/generate">
        <Button
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-8 py-2 rounded-md transition-all hover:scale-105 active:scale-95 animate-fade-in"
        >
          Get Started
        </Button>
      </Link>
    </div>
  )
}

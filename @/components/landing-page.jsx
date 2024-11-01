"use client";

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { TextGenerateEffect } from "./text-generate-effect"
import { SparklesCore } from "./sparkles"
import { useState } from "react"

export function LandingPage() {
  const [sparkles, setSparkles] = useState(false);

  return (
    (<div
      className="min-h-screen flex flex-col items-center justify-center bg-[#1a1333] px-4 relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF" />
      </div>
      <div className="relative w-64 h-64 mb-8 group">
        <div
          className="absolute -right-2 top-0 w-6 h-6 bg-red-500 rounded-full animate-bounce"
          aria-hidden="true" />
        <Image
          src="/cat.png"
          alt="Coding Cat Mascot"
          width={256}
          height={256}
          className="drop-shadow-2xl animate-fade-in-up group-hover:scale-105 transition-transform duration-300"
          onLoadingComplete={() => setSparkles(true)} />
      </div>
      <div className="mb-4 text-center">
        <TextGenerateEffect
          words="HEY LETS COMMIT A STORY"
          className="text-3xl md:text-4xl font-bold text-white tracking-wide" />
      </div>
      <div className="mb-8 text-center">
        <TextGenerateEffect
          words="Collaborate, code, and create amazing stories together"
          className="text-lg md:text-xl text-gray-300 max-w-md mx-auto" />
      </div>
      <Link href="/get-started">
        <Button
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-8 py-2 rounded-md transition-all hover:scale-105 active:scale-95 animate-fade-in"
          aria-label="Get Started">
          Get Started
        </Button>
      </Link>
    </div>)
  );
}
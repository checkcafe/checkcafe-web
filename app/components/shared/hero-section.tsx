import { Link } from "@remix-run/react";
import FloatingCard from "./floating-card";
import { Armchair, Wifi } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
export default function HeroSection() {
  return (
    <section className="bg-background py-10 md:py-[74px]">
      <div className="container mx-auto px-5 md:px-[139px] flex flex-col-reverse md:flex-row gap-5 md:gap-0  justify-between">
        <div className="pt-2 md:pt-14">
          <h1 className="text-[#372816] font-jacques text-4xl md:text-5xl">
            Find your <span className="text-[#FF9129]">comfort</span>
          </h1>
          <h1 className="text-[#372816] font-jacques text-4xl md:text-5xl">
            Enjoy your work
          </h1>

          <p className="text-[#9BA0A7] text-lg md:text-2xl mt-10">
            Your Cozy Workspace Awaits
          </p>
          <p className="text-[#9BA0A7] text-lg md:text-2x">
            Your Guide to Cozy Cafes and Great Vibes
          </p>

          <Button
            asChild
            className="bg-[#372816] px-7 py-6 rounded-md mt-10 md:mt-32 text-lg md:text-2x"
          >
            <Link to="/places">Explore</Link>
          </Button>
        </div>
        <div className="relative px-6 md:px-0">
          <img
            src="/hero-image.jpg"
            width={500}
            height={500}
            className="rounded-md"
          ></img>
          <FloatingCard
            title="Price: $-$$$"
            className="top-14 md:top-24 left-[-10px] md:left-[-80px]"
          />
          <FloatingCard
            icon={<Armchair className="w-4 h-4 md:w-[30px] md:h-[30px]" />}
            title="6-Seat Capacity"
            className="bottom-5 md:bottom-14 left-[-10px] md:left-[-100px]"
          />
          <FloatingCard
            icon={<Wifi className="w-4 h-4 md:w-[30px] md:h-[30px]" />}
            title="WiFi: 150 Mbps"
            className="bottom-32 md:bottom-52 right-[-10px] md:right-[-100px]"
          />
        </div>
      </div>
    </section>
  );
}

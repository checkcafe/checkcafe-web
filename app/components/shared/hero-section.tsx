import { Link } from "@remix-run/react";
import { Button } from "components/ui/button";
import FloatingCard from "./floating-card";
import { Armchair, CircleDollarSign, Wifi } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="bg-amber-50 py-10 md:py-10 flex justify-center">
      <div className="px-5 flex flex-col-reverse md:flex-row gap-32">
        <div className="pt-2 md:pt-14 space-y-10">
          <h1 className="text-amber-00 font-brand text-4xl md:text-5xl">
            Find your <span className="text-amber-600">comfort</span>
            <br />
            <span>Enjoy your work</span>
          </h1>

          <p className="text-amber-700 text-lg max-w-xs">
            CheckCafe is the guide to various cafes and great vibes
          </p>

          <Button size="cta">
            <Link to="/places">Explore Places</Link>
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

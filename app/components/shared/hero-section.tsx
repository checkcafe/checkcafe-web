import { Link } from "@remix-run/react";
import { Armchair, Wifi } from "lucide-react";

import { FloatingCard } from "~/components/shared/floating-card";
import { Button } from "~/components/ui/button";

export default function HeroSection() {
  return (
    <section className="flex justify-center bg-amber-50 py-10 md:py-10">
      <div className="flex flex-col gap-32 px-5 md:flex-row">
        <div className="space-y-10 pt-2 md:pt-14">
          <h1 className="text-amber-00 font-brand text-4xl md:text-5xl">
            Find your <span className="text-amber-600">comfort</span>
            <br />
            <span>Enjoy your work</span>
          </h1>

          <p className="max-w-xl text-lg text-amber-700">
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
            className="left-[-10px] top-14 md:left-[-80px] md:top-24"
          />
          <FloatingCard
            icon={<Armchair className="h-4 w-4 md:h-[30px] md:w-[30px]" />}
            title="6-Seat Capacity"
            className="bottom-5 left-[-10px] md:bottom-14 md:left-[-100px]"
          />
          <FloatingCard
            icon={<Wifi className="h-4 w-4 md:h-[30px] md:w-[30px]" />}
            title="WiFi: 150 Mbps"
            className="bottom-32 right-[-10px] md:bottom-52 md:right-[-100px]"
          />
        </div>
      </div>
    </section>
  );
}

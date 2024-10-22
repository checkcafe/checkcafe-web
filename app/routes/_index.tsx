import type { MetaFunction } from "@remix-run/node"
import HeroSection from "~/components/shared/hero-section"
import { Button } from "~/components/ui/button"

export const meta: MetaFunction = () => {
    return [
        { title: "CheckCafe" },
        {
            name: "description",
            content: "Check the best cafe for social, food, WFC, and comfortable experience",
        },
    ]
}

export default function Index() {
    return (
        <div className="flex flex-col justify-center">
            <HeroSection />
        </div>
    )
}

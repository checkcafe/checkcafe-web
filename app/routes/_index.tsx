import type { MetaFunction } from "@remix-run/node";
import { ClockIcon, DollarIcon, WifiIcon } from "~/components/icons/icons";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

export const meta: MetaFunction = () => {
  return [
    { title: "CheckCafe" },
    {
      name: "description",
      content:
        "Check the best cafe for social, food, WFC, and comfortable experience",
    },
  ];
};

const dummyFavourite = [
  {
    id: 1,
    name: "Juni Bar & lounge",
    location: "Cikini, Jakarta Selatan",
    image: "https://picsum.photos/id/10/400/300",
    rangePrice: "$$",
    building: "1 Level Building",
    wifiSpeed: "100Mbps",
    openTime: " 9:00  - 21:00",
  },
  {
    id: 2,
    name: "May Bar & lounge",
    location: "Ciputat, Jakarta Selatan",
    image: "https://picsum.photos/id/20/400/300",
    rangePrice: "$$$",
    building: "2 Level Building",
    wifiSpeed: "100Mbps",
    openTime: " 9:00  - 21:00",
  },
];
export default function Index() {
  return (
    <div className='flex flex-col justify-center'>
      <header className='space-y-4 p-4'>
        <h1 className='text-2xl font-bold'>☕CheckCafe</h1>
        <h2 className='text-xl'>
          Check the best cafe for social, food, WFC, and comfortable experience
        </h2>
        <Button>Coming Soon</Button>
      </header>
      <section className='bg-[#F9D9AA] font-nunito flex flex-col items-center justify-center p-4 text-center'>
        <h3 className='font-bold text-4xl'>Most Favorited Places </h3>
        <div className='flex gap-8 justify-center mt-8'>
          {dummyFavourite.map((cafe) => (
            <Card key={cafe.id} className='flex gap-4 p-3 w-5/12 '>
              <img src='/cafe-dummy.png' alt={cafe.name} className='w-1/2' />
              <div className='flex flex-col justify-between'>
                <span>
                  <h4 className='font-bold'>{cafe.name}</h4>
                  <p className='text-slate-400 text-sm'>{cafe.location}</p>
                </span>
                <span>
                  <ol className='flex flex-col gap-2'>
                    <li className='flex gap-4 font-bold'>
                      <ClockIcon className='w-7 h-7' />
                      <p>{cafe.openTime}</p>
                    </li>
                    <li className='flex gap-4 font-bold'>
                      <DollarIcon className='w-7 h-7' />
                      <p>{cafe.rangePrice}</p>
                    </li>
                    <li className='flex gap-4 font-bold'>
                      <WifiIcon className='w-7 h-7' />
                      <p>{cafe.wifiSpeed}</p>
                    </li>
                  </ol>
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

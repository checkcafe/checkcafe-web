import { Badge } from "components/ui/badge";
import { DollarIcon, LoveIcon, PinIcon } from "~/components/icons/icons";

import { Card, CardContent, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";

// TODO: Could be more automatic from Swagger OpenAPI
type Place = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  cityId: string;
  userId: string;
  streetAddress: string;
};

// export async function loader() {
//   const response = await fetch("http://localhost:3000/places");
//   const places: Place[] = await response.json();

//   return json({ places });
// }

export default function About() {
  // const { places } = useLoaderData<typeof loader>();
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
      categories: [
        "Coffee",
        "Tea",
        "Juice",
        "Snacks",
        "Desserts",
        "Breakfast",
        "Lunch",
        "Dinner",
        "Appetizers",
        "Smoothies",
        "Beverages",
        "Salads",
        "Pastries",
        "Sandwiches",
        "Ice Cream",
      ],
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
      categories: [
        "Coffee",
        "Tea",
        "Juice",
        "Snacks",
        "Desserts",
        "Breakfast",
        "Lunch",
        "Dinner",
        "Appetizers",
        "Smoothies",
        "Beverages",
        "Salads",
        "Pastries",
        "Sandwiches",
        "Ice Cream",
      ],
    },
    {
      id: 3,
      name: "May Bar & lounge",
      location: "Ciputat, Jakarta Selatan",
      image: "https://picsum.photos/id/20/400/300",
      rangePrice: "$$$",
      building: "2 Level Building",
      wifiSpeed: "100Mbps",
      openTime: " 9:00  - 21:00",
      categories: [
        "Coffee",
        "Tea",
        "Juice",
        "Snacks",
        "Desserts",
        "Breakfast",
        "Lunch",
        "Dinner",
        "Appetizers",
        "Smoothies",
        "Beverages",
        "Salads",
        "Pastries",
        "Sandwiches",
        "Ice Cream",
      ],
    },
    {
      id: 4,
      name: "May Bar & lounge",
      location: "Ciputat, Jakarta Selatan",
      image: "https://picsum.photos/id/20/400/300",
      rangePrice: "$$$",
      building: "2 Level Building",
      wifiSpeed: "100Mbps",
      openTime: " 9:00  - 21:00",
      categories: [
        "Coffee",
        "Tea",
        "Juice",
        "Snacks",
        "Desserts",
        "Breakfast",
        "Lunch",
        "Dinner",
        "Appetizers",
        "Smoothies",
        "Beverages",
        "Salads",
        "Pastries",
        "Sandwiches",
        "Ice Cream",
      ],
    },
  ];
  return (
    <div className='container px-4 flex gap-8 justify-center'>
      <aside className='flex flex-col gap-4 w-3/12'>
        <h2 className='font-semibold text-base'>Filter</h2>

        <span>
          <label htmlFor='city'>City</label>
          <Input id='city' placeholder='Jakarta' name='city' type='search' />
        </span>
        <span>
          <p className='font-bold'>Price per person</p>
          <span className='flex gap-6'>
            <div className='w-1/2'>
              <label htmlFor='from'>From</label>
              <Input
                placeholder='Rp 50.000'
                id='from'
                name='from'
                type='number'
              />
            </div>
            <div className='w-1/2'>
              <label htmlFor='to'>To</label>
              <Input placeholder='Rp 100.000' id='to' name='to' type='number' />
            </div>
          </span>
        </span>
        <span>
          <p className='font-bold'>Open Hour</p>

          <span className='flex gap-6'>
            <div className='w-1/2'>
              <label htmlFor='from'>From</label>
              <Input placeholder='09:00' id='from' name='from' type='number' />
            </div>
            <div className='w-1/2'>
              <label htmlFor='to'>To</label>
              <Input placeholder='22:00' id='to' name='to' type='number' />
            </div>
          </span>
        </span>
      </aside>
      <main className='w-[62%] '>
        <ul className='w-full flex flex-col gap-7'>
          {dummyFavourite.map((cafe) => (
            <Card
              key={cafe.id}
              className='flex gap-4 w-full  border-[#F9D9AA] border h-[30vh] '
            >
              <img src='/cafe-dummy.png' alt={cafe.name} className='w-6/12' />
              <div className='flex flex-col justify-between p-3'>
                <CardTitle className=' flex justify-between'>
                  <span>
                    <h4 className='font-semibold text-2xl'>{cafe.name}</h4>
                    <span className='text-slate-400 text-sm flex gap-2'>
                      <PinIcon className='w-4 h-4' />
                      <p className='self-center text-sm'>{cafe.location}</p>
                    </span>
                  </span>
                  <LoveIcon className='' />
                </CardTitle>

                <CardContent className='items-end p-0'>
                  <span className='flex gap-4 font-bold mb-2'>
                    <DollarIcon className='w-4 h-4' />
                    <p className='text-sm'>{cafe.rangePrice}</p>
                  </span>
                  <ol className='flex gap-4'>
                    {cafe.categories.length > 6 ? (
                      <>
                        {cafe.categories.slice(0, 6).map((category) => (
                          <li key={category}>
                            <Badge className='font-medium text-sm bg-[#F1F1F1] text-[#8D8E8F] p-1 rounded'>
                              {category}
                            </Badge>
                          </li>
                        ))}
                        <li>
                          <Badge className='font-medium text-sm bg-[#F1F1F1] text-[#8D8E8F] p-1 rounded'>
                            +{cafe.categories.length - 6}
                          </Badge>
                        </li>
                      </>
                    ) : (
                      cafe.categories.map((category) => (
                        <li key={category}>
                          <Badge className='font-medium text-sm bg-[#F1F1F1] text-[#8D8E8F] p-1 rounded'>
                            {category}
                          </Badge>
                        </li>
                      ))
                    )}
                  </ol>
                </CardContent>
              </div>
            </Card>
          ))}
        </ul>
      </main>

      <ul>
        {/* {places.map((places) => {
          return <li key={places.name}>{places.name}</li>;
        })} */}
      </ul>
    </div>
  );
}

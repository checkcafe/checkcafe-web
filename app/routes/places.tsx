import { Badge } from "components/ui/badge";
import { useRef } from "react";
import { DollarIcon, LoveIcon, PinIcon } from "~/components/icons/icons";

import { Card, CardContent, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { MapboxView } from "~/components/ui/mapbox-view";

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

export default function Places() {
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
      openTime: "9:00 - 21:00",
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

      latitude: -6.190486,
      longitude: 106.832093,
    },
    {
      id: 2,
      name: "May Bar & lounge",
      location: "Ciputat, Jakarta Selatan",
      image: "https://picsum.photos/id/20/400/300",
      rangePrice: "$$$",
      building: "2 Level Building",
      wifiSpeed: "100Mbps",
      openTime: "9:00 - 21:00",
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

      latitude: -6.347617,
      longitude: 106.762981,
    },
    {
      id: 3,
      name: "May Bar & lounge",
      location: "Ciputat, Jakarta Selatan",
      image: "https://picsum.photos/id/20/400/300",
      rangePrice: "$$$",
      building: "2 Level Building",
      wifiSpeed: "100Mbps",
      openTime: "9:00 - 21:00",
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

      latitude: -6.267561,
      longitude: 106.813871,
    },
    {
      id: 4,
      name: "May Bar & lounge",
      location: "Ciputat, Jakarta Selatan",
      image: "https://picsum.photos/id/20/400/300",
      rangePrice: "$$$",
      building: "2 Level Building",
      wifiSpeed: "100Mbps",
      openTime: "9:00 - 21:00",
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

      latitude: -6.281593,
      longitude: 106.786297,
    },
    {
      id: 5,
      name: "May Bar & lounge",
      location: "Ciputat, Jakarta Selatan",
      image: "https://picsum.photos/id/20/400/300",
      rangePrice: "$$$",
      building: "2 Level Building",
      wifiSpeed: "100Mbps",
      openTime: "9:00 - 21:00",
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

      latitude: -6.224573,
      longitude: 106.799354,
    },
  ];

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleScrollToCard = (placeId: string) => {
    const cardIndex = dummyFavourite.findIndex(
      (place: any) => place.id === placeId
    );
    const selectedCard = cardRefs.current[cardIndex];
    if (selectedCard) {
      selectedCard.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="container mx-auto px-8 flex flex-col gap-8 pt-5">
      <div className="flex justify-between items-end pr-[8px]">
        <div className="flex gap-4 w-1/2">
          <span>
            <p className="font-bold">Price per person</p>
            <span className="flex gap-6">
              <div className="w-1/2">
                <label htmlFor="from">From</label>
                <Input
                  placeholder="Rp 50.000"
                  id="from"
                  name="from"
                  type="number"
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="to">To</label>
                <Input
                  placeholder="Rp 100.000"
                  id="to"
                  name="to"
                  type="number"
                />
              </div>
            </span>
          </span>
          <span>
            <p className="font-bold">Open Hour</p>
            <span className="flex gap-6">
              <div className="w-1/2">
                <label htmlFor="from">From</label>
                <Input
                  placeholder="09:00"
                  id="from"
                  name="from"
                  type="number"
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="to">To</label>
                <Input placeholder="22:00" id="to" name="to" type="number" />
              </div>
            </span>
          </span>
        </div>

        <button className="bg-[#372816] text-white font-semibold py-2 px-10 rounded-sm ">
          Apply
        </button>
      </div>

      <div className="flex gap-2">
        <main className="w-1/2">
          <ul className="w-full flex flex-col gap-7">
            {dummyFavourite.map((cafe, index) => (
              <Card
                key={cafe.id}
                ref={(el) => (cardRefs.current[index] = el)} // Attach ref to each card
                className="flex w-full border-[#F9D9AA] border h-[30vh]"
              >
                <img src="/cafe-dummy.png" alt={cafe.name} className="w-6/12" />
                <div className="flex flex-col justify-between p-3">
                  <CardTitle className="flex justify-between">
                    <span>
                      <h4 className="font-semibold text-2xl">{cafe.name}</h4>
                      <span className="text-slate-400 text-sm flex gap-2">
                        <PinIcon className="w-4 h-4" />
                        <p className="self-center text-sm">{cafe.location}</p>
                      </span>
                    </span>
                    <LoveIcon className="" />
                  </CardTitle>
                  <CardContent className="items-end p-0">
                    <span className="flex gap-4 font-bold mb-2">
                      <DollarIcon className="w-4 h-4" />
                      <p className="text-sm">{cafe.rangePrice}</p>
                    </span>
                    <ol className="flex gap-4">
                      {cafe.categories.length > 6 ? (
                        <>
                          {cafe.categories.slice(0, 6).map((category) => (
                            <li key={category}>
                              <Badge className="font-medium text-sm bg-[#F1F1F1] text-[#8D8E8F] p-1 rounded">
                                {category}
                              </Badge>
                            </li>
                          ))}
                          <li>
                            <Badge className="font-medium text-sm bg-[#F1F1F1] text-[#8D8E8F] p-1 rounded">
                              +{cafe.categories.length - 6}
                            </Badge>
                          </li>
                        </>
                      ) : (
                        cafe.categories.map((category) => (
                          <li key={category}>
                            <Badge className="font-medium text-sm bg-[#F1F1F1] text-[#8D8E8F] p-1 rounded">
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

        <aside className="w-1/2 h-full sticky top-0">
          <MapboxView
            places={dummyFavourite}
            onPlaceClick={handleScrollToCard}
          />
        </aside>
      </div>
    </div>
  );
}

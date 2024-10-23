import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import React from "react";

type Props = {};

export async function loader({ params }: LoaderFunctionArgs) {
  // console.log("params", params);
  const res = await fetch(`https://api.checkcafe.com/places/osh-jakarta`);
  const data = await res.json();
  // const formData = await request.formData();

  // const teamMember = {
  //   name: String(formData.get("name")),
  // };

  // console.log({ teamMember });

  return json({ data });
}

const PlaceSlug = (props: Props): React.ReactElement => {
  const { data } = useLoaderData<typeof loader>();
  console.log("data", data);

  return (
    <div className="px-32 py-20">
      <p className="text-3xl font-semibold text-[#82450C]">{data.name}</p>
      <p className="text-base font-normal text-[#372816] mb-8">
        {data.description}
      </p>
      <p className="text-sm font-medium text-[#372816] mb-2">
        {data.streetAddress}
      </p>
      <p className="text-sm font-medium text-[#372816]">{data.priceRange}</p>
      <p className="text-base font-semibold text-[#88C273] mt-6">
        Operational Time
      </p>
      <div className="mt-2">
        {data.operatingHours.map((item) => (
          <div key={item.id} className="flex flex-row w-72 justify-between">
            <p>{item.day}</p>
            <div className="flex flex-row">
              <p>
                {new Date(item.startDateTime)
                  .getUTCHours()
                  .toString()
                  .padStart(2, "0")}
                :
                {new Date(item.startDateTime)
                  .getUTCMinutes()
                  .toString()
                  .padStart(2, "0")}{" "}
                -{" "}
              </p>
              <p>
                {new Date(item.endDateTime)
                  .getUTCHours()
                  .toString()
                  .padStart(2, "0")}
                :
                {new Date(item.endDateTime)
                  .getUTCMinutes()
                  .toString()
                  .padStart(2, "0")}{" "}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaceSlug;

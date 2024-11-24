import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

import { FileUploaderRegular } from "@uploadcare/react-uploader";
import React, { useRef } from "react";

import "@uploadcare/react-uploader/core.css";

import {
  deleteFile,
  UploadcareSimpleAuthSchema,
} from "@uploadcare/rest-client";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import {
  Map,
  MapMouseEvent,
  MapRef,
  Marker,
  NavigationControl,
} from "react-map-gl";
import { z } from "zod";

import { Combobox } from "~/components/shared/form-input/combobox";
// import { MultipleOperatingHoursUpdate } from "~/components/shared/form-input/multiple-input-operating-hours-updated";
// import { OperatingHoursForm } from "~/components/shared/form-input/operating-hours-form";
import { Sliders } from "~/components/shared/sliders";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import {
  BACKEND_API_URL,
  MAPBOX_ACCESS_TOKEN,
  UPLOADCARE_PUBLIC_KEY,
  UPLOADCARE_SECRET_KEY,
} from "~/lib/env";
import { getAccessToken } from "~/lib/token";
import { cn } from "~/lib/utils";
import { City, Place } from "~/types/model";

React.useLayoutEffect = React.useEffect;

const uploadcareSimpleAuthSchema = new UploadcareSimpleAuthSchema({
  publicKey: UPLOADCARE_PUBLIC_KEY,
  secretKey: UPLOADCARE_SECRET_KEY,
});

const EditPlaceSchema = z.object({
  placePhotos: z.string().min(1).optional(),
  name: z.string().min(4).max(255),
  description: z.preprocess(
    value => (value === "" ? undefined : value),
    z.string().min(4).max(255).optional(),
  ),
  streetAddress: z.string().min(4).max(100),
  priceRangeMin: z.preprocess(
    value => (value === "" ? undefined : value),
    z.number().min(1).optional(),
  ),
  priceRangeMax: z.preprocess(
    value => (value === "" ? undefined : value),
    z.number().min(1).optional(),
  ),

  latitude: z
    .number()
    .min(-90, { message: "Latitude must be between -90 and 90." }),
  longitude: z
    .number()
    .min(-180, { message: "Longitude must be between -180 and 180." }),
  cityId: z.string().min(4),
});

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  if (!id) return redirect("/");

  const responsePlace = await fetch(`${BACKEND_API_URL}/places/${id}`);
  const place: Place = await responsePlace.json();

  if (!place) {
    throw new Response(null, { status: 404, statusText: "Place Not Found" });
  }

  const responseCity = await fetch(
    `${BACKEND_API_URL}/geo/cities?sort={ "name": "asc" }`,
  );

  const city: City[] = await responseCity.json();
  if (!city) {
    throw new Response(null, { status: 404, statusText: "City Not Found" });
  }
  return json({ place, city });
}

type placePhotosData = {
  order: number;
  url: string;
};

type Marker = {
  longitude: number;
  latitude: number;
} | null;

export default function EditPlace() {
  const { place, city } = useLoaderData<typeof loader>();
  const [cityId, setCityId] = useState(place.address.cityId);
  const [marker, setMarker] = useState<Marker>(
    place.latitude && place.longitude
      ? { latitude: place.latitude, longitude: place.longitude }
      : null,
  );
  const mapRef = useRef<MapRef | null>(null);

  const handleMapClick = (event: MapMouseEvent) => {
    const { lngLat } = event;
    setMarker({
      latitude: lngLat.lat,
      longitude: lngLat.lng,
    });
  };

  const handleMapLoad = () => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      const geocoder = new MapboxGeocoder({
        accessToken: MAPBOX_ACCESS_TOKEN,
        marker: false,
      });
      map.addControl(geocoder, "top-left");
    }
  };

  const [imageUrls, setImageUrls] = useState<placePhotosData[]>(place.photos);
  // const [form, fields] = useForm({
  //   shouldValidate: "onBlur",
  //   onValidate({ formData }) {
  //     return parse(formData, { schema: EditPlaceSchema });
  //   },
  //   defaultValue: {
  //     imageUrls: place.photos,
  //     name: place.name,
  //     streetAddress: place.address.street,
  //     description: place.description,
  //     priceRangeMin: place.priceRangeMin,
  //     priceRangeMax: place.priceRangeMax,
  //   },
  // });

  const [form, fields] = useForm({
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",

    // Setup client validation
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: EditPlaceSchema });
    },
    defaultValue: {
      // imageUrls: place.photos,
      name: place.name,
      streetAddress: place.address.street,
      description: place.description,
      priceRangeMin: place.priceRangeMin,
      priceRangeMax: place.priceRangeMax,
      latitude: place.latitude,
      longitude: place.longitude,
    },
  });
  function handleSetImageUrls(data: string[]) {
    data.forEach(url =>
      setImageUrls(imageUrls => [
        ...imageUrls,
        { order: imageUrls.length + 1, url },
      ]),
    );
  }

  function handleDeleteImageUrls(urlToRemove: string) {
    setImageUrls(prevState =>
      prevState.filter(item => item.url !== urlToRemove),
    );
  }

  // MOVE TO SERVER-SIDE
  async function deleteFiles(uuid: string) {
    await deleteFile({ uuid }, { authSchema: uploadcareSimpleAuthSchema });
  }
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-3xl space-y-8 px-4 py-20">
        <section className="container-button flex justify-between">
          <div className="container-action-button">
            <Form method="post" id="user-delete-place-by-id">
              <input type="hidden" name="action" value="delete" readOnly />
              <input type="hidden" name="placeId" value={place.id} readOnly />
              <Button variant={"destructive"} type="submit">
                <span className="flex items-center gap-2">
                  <TrashIcon />
                  <p>Delete</p>
                </span>
              </Button>
            </Form>
          </div>
          <div className="container-publish-button flex gap-4">
            <Button variant={"outline"} type="submit">
              <Link
                to={`/places/${place.slug}`}
                className="flex items-center gap-2"
              >
                View
              </Link>
            </Button>
            <Form method="post" id="change-status-publish">
              <input type="hidden" name="action" value="isPublish" />
              <input type="hidden" name="placeId" value={place.id} />
              <Button type="submit">
                {place?.isPublished ? "Unpublish" : "Publish"}
              </Button>
            </Form>
          </div>
        </section>
        <Form method="post" className="space-y-4" {...getFormProps(form)}>
          <h1 className="text-2xl font-bold">Edit Place</h1>

          {imageUrls && imageUrls.length > 0 && (
            <Sliders
              imageSlides={imageUrls.map((imageUrl: { url: string }) => ({
                imageUrl: imageUrl.url,
              }))}
              widthImage={200}
            />
          )}

          <input
            {...getInputProps(fields.placePhotos, { type: "text" })}
            hidden
            value={JSON.stringify(imageUrls) || "[]"}
            readOnly
          />

          <div>
            <FileUploaderRegular
              ctxName="checkcafe"
              sourceList="local, url, camera"
              classNameUploader="uc-light"
              pubkey={UPLOADCARE_PUBLIC_KEY}
              multiple={true}
              accept="image/png,image/jpeg"
              confirmUpload={true}
              // onFileUploadFailed={e => {
              //   console.log(e, "failed");
              // }}
              // onFileUploadSuccess={e => {
              //   console.log(e, "success");
              // }}
              onDoneClick={e => {
                if (e.successEntries.length > 0) {
                  const data = e.successEntries;
                  const urlData = data.map(item => item.cdnUrl);
                  handleSetImageUrls(urlData);
                }
              }}
              onFileRemoved={e => {
                if (e.uuid) deleteFiles(e.uuid);
                if (e.isRemoved && e.cdnUrl) {
                  handleDeleteImageUrls(e.cdnUrl);
                }
              }}
              // className="hidden"
            />
          </div>

          <div>
            <Label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </Label>
            <Input
              {...getInputProps(fields.name, { type: "text" })}
              type="text"
              id="name"
              placeholder="Place name"
              className={`mt-1 rounded-md border p-2 ${fields.name.errors ? "border-red-500" : "border-gray-300"}`}
            />
            {fields.name.errors && (
              <p className="mt-1 text-sm text-red-700">{fields.name.errors}</p>
            )}
          </div>
          <div>
            <Label
              htmlFor="streetAddress"
              className="block text-sm font-medium text-gray-700"
            >
              Street Address
            </Label>
            <Input
              {...getInputProps(fields.streetAddress, { type: "text" })}
              type="text"
              id="streetAddress"
              placeholder="Enter your streetAddress or email"
              className={cn(
                "mt-1 rounded-md border p-2",
                fields.streetAddress.errors
                  ? "border-red-500"
                  : "border-gray-300",
              )}
            />
            {fields.streetAddress.errors && (
              <p className="mt-1 text-sm text-red-700">
                {fields.streetAddress.errors}
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="cityId"
              className="block text-sm font-medium text-gray-700"
            >
              City
            </Label>
            <input
              {...getInputProps(fields.cityId, { type: "text" })}
              name={fields.cityId.name}
              hidden
              value={cityId}
            />
            <Combobox cities={city} setCityId={setCityId} cityId={cityId} />

            {fields.cityId.errors && (
              <p className="mt-1 text-sm text-red-700">
                {fields.cityId.errors}
              </p>
            )}
          </div>
          <div>
            <Label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </Label>
            <Textarea
              {...getTextareaProps(fields.description)}
              id="description"
              name={fields.description.name}
              placeholder="Description of the place"
              className={`mt-1 rounded-md border p-2 ${fields.description.errors ? "border-red-500" : "border-gray-300"}`}
            />
            {fields.description.errors && (
              <p className="mt-1 text-sm text-red-700">
                {fields.description.errors}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-gray-800">
              Average Price Range for Food and Beverage
            </h2>
            <div className="flex gap-10">
              <div>
                <Label
                  htmlFor="priceRangeMin"
                  className="block text-sm font-medium text-gray-700"
                >
                  Price (Min)
                </Label>
                <Input
                  {...getInputProps(fields.priceRangeMin, { type: "text" })}
                  type="number"
                  id="priceRangeMin"
                  name={fields.priceRangeMin.name}
                  placeholder="Enter minimum price"
                  min={0}
                  className={`mt-1 rounded-md border p-2 ${
                    fields.priceRangeMin.errors
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {fields.priceRangeMin.errors && (
                  <p className="mt-1 text-sm text-red-700">
                    {fields.priceRangeMin.errors}
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="priceRangeMax"
                  className="block text-sm font-medium text-gray-700"
                >
                  Price (Max)
                </Label>
                <Input
                  {...getInputProps(fields.priceRangeMax, { type: "text" })}
                  name={fields.priceRangeMax.name}
                  type="number"
                  id="priceRangeMax"
                  min={0}
                  placeholder="Enter maximum price"
                  className={`mt-1 rounded-md border p-2 ${
                    fields.priceRangeMax.errors
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {fields.priceRangeMax.errors && (
                  <p className="mt-1 text-sm text-red-700">
                    {fields.priceRangeMax.errors}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Label className="block text-sm font-medium text-gray-700">
            Set Point Location
          </Label>
          {fields.latitude.errors && (
            <p className="mt-1 text-sm text-red-700">
              {fields.latitude.errors}
            </p>
          )}
          <Map
            mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
            initialViewState={{
              longitude: place.longitude ?? 118.64493557421042,
              latitude: place.latitude ?? 0.1972476798250682,
              zoom: place.latitude && place.longitude ? 10 : 3,
            }}
            style={{ width: "100%", height: "50vh", borderRadius: 5 }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            onClick={handleMapClick}
            ref={mapRef}
            onLoad={handleMapLoad}
          >
            {marker && (
              <Marker
                longitude={marker.longitude}
                latitude={marker.latitude}
                color="red"
                anchor="center"
              />
            )}
            <NavigationControl />
          </Map>

          <input
            type="number"
            hidden
            name="latitude"
            value={marker ? String(marker.latitude) : ""}
          />
          <input
            type="number"
            hidden
            name="longitude"
            value={marker ? marker.longitude : ""}
          />

          <div>
            <Button type="submit">Save Place</Button>
          </div>
        </Form>

        <Separator />

        {/* <OperatingHoursForm
          placeData={{
            id: place.id,
            operatingHours: place.operatingHours ?? [],
          }}
        /> */}
        {/* <MultipleOperatingHoursUpdate
          placeData={{
            id: place.id,
            operatingHours: place.operatingHours ?? [],
          }}
        /> */}
      </div>
    </div>
  );
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { id } = params;
  if (!id) return redirect("/");

  const { accessToken } = await getAccessToken(request);
  const formData = await request.formData();
  const placeId = formData.get("placeId");
  const action = formData.get("action");
  if (!action) {
    const submission = parseWithZod(formData, { schema: EditPlaceSchema });
    const placePhotosData = JSON.parse(String(submission.payload.placePhotos));
    // console.info(
    //   placePhotosData,
    //   "placePhotosData",
    //   JSON.parse(String(submission.value?.placePhotos)),
    // );
    // console.dir({ placePhotosData }, { depth: null });

    // Send the submission back to the client if the status is not successful
    // if (submission.intent !== "submit" || !submission.value) {
    //   return json(submission);
    // }
    if (submission.status !== "success") {
      return json(submission.reply(), {
        // You can also use the status to determine the HTTP status code
        status: submission.status === "error" ? 400 : 200,
      });
    }

    const responsePlace = await fetch(`${BACKEND_API_URL}/places/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        ...submission.value,
        placePhotos: placePhotosData,
      }),
    });
    const place: Place = await responsePlace.json();
    if (!place) {
      throw new Response(null, { status: 404, statusText: "Place Not Found" });
    }
  } else if (action === "delete") {
    const responseDelete = await fetch(`${BACKEND_API_URL}/places/${placeId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const result: { message: string } = await responseDelete.json();
    if (!result) {
      throw new Response(null, { status: 404, statusText: "Place Not Found" });
    }
    return redirect("/");
  } else if (action === "isPublish") {
    const responseDelete = await fetch(
      `${BACKEND_API_URL}/places/${id}/isPublished`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const result: { message: string } = await responseDelete.json();
    if (!result) {
      throw new Response(null, {
        status: 404,
        statusText: "Chage Status Failed",
      });
    }
    return null;
  }

  return null;
}

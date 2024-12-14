import {
  getFormProps,
  getInputProps,
  getSelectProps,
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
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

import { FileUploaderRegular } from "@uploadcare/react-uploader";
import React, { useEffect, useRef } from "react";

import "@uploadcare/react-uploader/core.css";

import {
  deleteFile,
  UploadcareSimpleAuthSchema,
} from "@uploadcare/rest-client";
import { ArrowDown, ArrowUpIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import {
  Map,
  MapMouseEvent,
  MapRef,
  Marker,
  NavigationControl,
} from "react-map-gl";

import { Combobox } from "~/components/shared/form-input/combobox";
// import Tasks from "~/components/shared/form-input/try-array-nested";
import LoadingSpinner from "~/components/shared/loader-spinner";
import MapWithSearchbox from "~/components/shared/searchbox/mapWithSearchbox.client";
import { generateTimeOptions } from "~/components/shared/select-hour";
// import { MultipleOperatingHoursUpdate } from "~/components/shared/form-input/multiple-input-operating-hours-updated";
// import { OperatingHoursForm } from "~/components/shared/form-input/operating-hours-form";
import { Sliders } from "~/components/shared/sliders";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
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
import { EditPlaceSchema } from "~/schemas/places";
import { City, Facility, Place } from "~/types/model";
import { formatTime } from "~/utils/formatter";

React.useLayoutEffect = React.useEffect;

const uploadcareSimpleAuthSchema = new UploadcareSimpleAuthSchema({
  publicKey: UPLOADCARE_PUBLIC_KEY,
  secretKey: UPLOADCARE_SECRET_KEY,
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
  const responseFacilities = await fetch(`${BACKEND_API_URL}/facilities`);

  const facilities: Facility[] = await responseFacilities.json();
  if (!facilities) {
    throw new Response(null, { status: 404, statusText: "Facility Not Found" });
  }
  return json({ place, city, facilities });
}

type placePhotosData = {
  order: number;
  url: string;
};

type Marker = {
  longitude: number;
  latitude: number;
} | null;
const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
export default function EditPlace() {
  const navigation = useNavigation();
  const { place, city, facilities } = useLoaderData<typeof loader>();
  const [cityId, setCityId] = useState(place.address.cityId);
  const [open, setOpen] = useState<boolean>();
  const [marker, setMarker] = useState<Marker>(
    place.latitude && place.longitude
      ? { latitude: place.latitude, longitude: place.longitude }
      : null,
  );
  // const actionData = useActionData<typeof action>();

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
        autocomplete: true,
        mode: "mapbox.places",
      });
      map.addControl(geocoder, "top-left");
    }
  };

  const [imageUrls, setImageUrls] = useState<placePhotosData[]>(place.photos);

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
      descriptionPlace: place.description,
      priceRangeMin: place.priceRangeMin,
      priceRangeMax: place.priceRangeMax,
      latitude: place.latitude,
      longitude: place.longitude,
      operatingHours: place.operatingHours || [],
      placeFacilities: place.placeFacilities || [],
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

  const operatingHoursItems = fields.operatingHours.getFieldList();
  const canAddOperatingHour = operatingHoursItems.length < DAYS_OF_WEEK.length;
  const facilitiesItem = fields.placeFacilities.getFieldList();
  console.log(place.placeFacilities, "placefacilities");
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-3xl space-y-8 px-4 py-20">
        <section className="container-button flex justify-between">
          <div className="container-action-button">
            {/* <input type="hidden" name="placeId" value={place.} readOnly /> */}
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your place data and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Form method="post" id="user-delete-place-by-id">
                    <input
                      type="hidden"
                      name="username"
                      value={place.submitter.username}
                      readOnly
                    />{" "}
                    <input
                      type="hidden"
                      name="action"
                      value="delete"
                      readOnly
                    />
                    <input
                      type="hidden"
                      name="placeId"
                      value={place.id}
                      readOnly
                    />{" "}
                    <Button
                      variant={"destructive"}
                      type="submit"
                      onClick={() => setOpen(false)}
                    >
                      <span className="flex items-center gap-2">
                        <TrashIcon />
                        <p>Delete Places</p>
                      </span>
                    </Button>
                  </Form>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
              <input type="hidden" name="action" value="isPublish" readOnly />

              <input type="hidden" name="placeId" value={place.id} readOnly />
              <Button type="submit">
                {place?.isPublished ? "Unpublish" : "Publish"}
              </Button>
            </Form>
          </div>
        </section>
        <Form method="post" className="space-y-4" {...getFormProps(form)}>
          <input
            type="hidden"
            name="username"
            value={place.submitter.username}
            readOnly
          />{" "}
          <h1 className="text-2xl font-bold">Create Place</h1>
          <Label
            htmlFor="priceRangeMin"
            className="block text-sm font-bold text-gray-700"
          >
            Add picture
          </Label>
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
            defaultValue={JSON.stringify(imageUrls) || "[]"}
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
              className="block text-sm font-bold text-gray-700"
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
              className="block text-sm font-bold text-gray-700"
            >
              Street Address
            </Label>
            <Input
              {...getInputProps(fields.streetAddress, { type: "text" })}
              type="text"
              id="streetAddress"
              placeholder="Enter your streetAddress "
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
              className="block text-sm font-bold text-gray-700"
            >
              City
            </Label>
            <input
              {...getInputProps(fields.cityId, { type: "text" })}
              name={fields.cityId.name}
              hidden
              defaultValue={cityId}
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
              htmlFor="descriptionPlace"
              className="block text-sm font-bold text-gray-700"
            >
              Description
            </Label>
            <Textarea
              {...getTextareaProps(fields.descriptionPlace)}
              id="description"
              name={fields.descriptionPlace.name}
              placeholder="Description of the place"
              className={`mt-1 rounded-md border p-2 ${fields.descriptionPlace.errors ? "border-red-500" : "border-gray-300"}`}
            />
            {fields.descriptionPlace.errors && (
              <p className="mt-1 text-sm text-red-700">
                {fields.descriptionPlace.errors}
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
          <Label className="block text-sm font-bold text-gray-700">
            Set Point Location
          </Label>
          {fields.latitude.errors && (
            <p className="mt-1 text-sm text-red-700">
              {fields.latitude.errors}
            </p>
          )}
          <MapWithSearchbox coordinate={marker} setCoordinates={setMarker} />
          {/* <Map
            renderWorldCopies={true}
            mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
            initialViewState={{
              longitude: place.longitude ?? 118.64493557421042,
              latitude: place.latitude ?? 0.1972476798250682,
              zoom: place.latitude && place.longitude ? 10 : 3,
            }}
            style={{ width: "100%", height: "50vh", borderRadius: 5 }}
            mapStyle="mapbox://styles/mapbox/streets-v12"
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
          </Map> */}
          <input
            type="number"
            hidden
            name="latitude"
            value={marker ? String(marker.latitude) : ""}
            readOnly
          />
          <input
            type="number"
            hidden
            name="longitude"
            value={marker ? marker.longitude : ""}
            readOnly
          />
          <div className="my-4">
            <Label
              htmlFor="operatingHour"
              className="block text-sm font-bold text-gray-700"
            >
              Operating Hours{" "}
            </Label>{" "}
            <div className="my-4 flex gap-4">
              <Button
                {...form.insert.getButtonProps({
                  name: fields.operatingHours.name,
                })}
                disabled={!canAddOperatingHour}
              >
                Add Operating Hour
              </Button>
            </div>
            {operatingHoursItems.length === 0 && (
              <p>No operating hour yet, add one.</p>
            )}
            <ul className="space-y-2">
              {operatingHoursItems.map((item, index) => {
                const operatingHourFields = item.getFieldset();
                return (
                  <li key={item.key} className="flex items-center gap-2">
                    <OperatingHoursItemFieldset
                      config={operatingHourFields}
                      index={index}
                      form={form}
                      fields={fields}
                      itemLength={operatingHoursItems.length}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="my-4">
            <Label
              htmlFor="placeFacilities"
              className="block text-sm font-bold text-gray-700"
            >
              Place Facilities{" "}
            </Label>{" "}
            <div className="my-4 flex gap-4">
              <Button
                {...form.insert.getButtonProps({
                  name: fields.placeFacilities.name,
                })}
              >
                Add Facility
              </Button>
            </div>
            {facilitiesItem.length === 0 && <p>No facility yet, add one.</p>}
            <ul className="space-y-2">
              {facilitiesItem.map((item, index) => {
                const facilityFields = item.getFieldset();
                return (
                  <li key={item.key} className="flex items-center gap-2">
                    <FacilitiesItemFieldset
                      config={facilityFields}
                      index={index}
                      form={form}
                      fields={fields}
                      facilities={facilities}
                      itemLength={facilitiesItem.length}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <Button type="submit">
              {navigation.state === "submitting" ? (
                <LoadingSpinner />
              ) : (
                "Save Place"
              )}
            </Button>
          </div>
        </Form>
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
  const username = formData.get("username");
  const action = formData.get("action");
  if (!action) {
    const submission = parseWithZod(formData, { schema: EditPlaceSchema });
    const placePhotosData = JSON.parse(String(submission.payload.placePhotos));
    console.info({ ...submission.payload }, "submission");

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
        description: submission.value.descriptionPlace,
        placePhotos: placePhotosData,
      }),
    });
    const place: Place = await responsePlace.json();
    if (!place) {
      throw new Response(null, { status: 404, statusText: "Place Not Found" });
    }
    return redirect(`/dashboard/${username}`);
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
    return redirect(`/dashboard/${username}`);
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

function OperatingHoursItemFieldset({
  config,
  index,
  form,
  fields,
  itemLength,
}: {
  config: any;
  index: number;
  form: any;
  fields: any;
  itemLength: number;
}) {
  const timeOptions = generateTimeOptions();
  return (
    <fieldset className="flex w-full flex-col gap-1 sm:flex-row sm:gap-2">
      <div className="flex w-full gap-4">
        {/* Day Select Dropdown */}
        <div className="w-full">
          <Label htmlFor={`operatingHours.${index}.day`}>Day</Label>
          <Select
            {...getSelectProps(config.day)}
            key={config.day.key} // Pass key explicitly
            defaultValue={
              typeof config.day.initialValue === "string"
                ? config.day.initialValue
                : "Monday"
            }
            // value={config.day.initialValue}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a day" />
            </SelectTrigger>
            <SelectContent>
              {DAYS_OF_WEEK.map(day => (
                <SelectItem key={day} value={day}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>{" "}
          {config.day.errors && (
            <p className="mt-1 text-sm text-red-700">{config.day.errors}</p>
          )}
        </div>

        {/* Open Time Select Dropdown */}
        <div className="w-full">
          <Label htmlFor={`operatingHours.${index}.open`}>Open Time</Label>
          <Select
            {...getSelectProps(config.openingTime)}
            key={config.openingTime.key} // Pass key explicitly
            defaultValue={
              typeof config.openingTime.initialValue === "string"
                ? formatTime(config.openingTime.initialValue)
                : "09:00"
            }
            // value={formatTime(config.openingTime.initialValue)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="09:00" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map(time => {
                return (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {config.openTime.errors && (
            <p className="mt-1 text-sm text-red-700">
              {config.openTime.errors}
            </p>
          )}
        </div>

        {/* Close Time Select Dropdown */}
        <div className="w-full">
          <Label htmlFor={`operatingHours.${index}.close`}>Close Time</Label>
          <Select
            {...getSelectProps(config.closingTime)}
            key={config.closingTime.key} // Pass key explicitly
            defaultValue={
              typeof config.openingTime.initialValue === "string"
                ? formatTime(config.closingTime.initialValue)
                : "23:00"
            }
            // value={formatTime(config.closingTime.initialValue)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="23:00" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map(time => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {config.closeTime.errors && (
            <p className="mt-1 text-sm text-red-700">
              {config.closeTime.errors}
            </p>
          )}{" "}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 self-end">
          <Button
            {...form.reorder.getButtonProps({
              name: fields.operatingHours.name,
              from: index,
              to: Math.max(0, index - 1),
            })}
            disabled={index === 0}
          >
            <ArrowUpIcon />
          </Button>
          <Button
            {...form.reorder.getButtonProps({
              name: fields.operatingHours.name,
              from: index,
              to: Math.min(itemLength - 1, index + 1),
            })}
            disabled={index === itemLength - 1}
          >
            <ArrowDown />
          </Button>
          <Button
            {...form.remove.getButtonProps({
              name: fields.operatingHours.name,
              index,
            })}
            variant="destructive"
          >
            <TrashIcon />
          </Button>
        </div>
      </div>
    </fieldset>
  );
}

function FacilitiesItemFieldset({
  config,
  index,
  form,
  fields,
  facilities,
  itemLength,
}: {
  config: any;
  index: number;
  form: any;
  fields: any;
  facilities: Facility[];
  itemLength: number;
}) {
  return (
    <fieldset className="flex w-full flex-col gap-1 sm:flex-row sm:gap-2">
      <div className="flex w-full gap-4">
        {/* Day Selector */}
        <div>
          <Label htmlFor={`Facilities.${index}`}>Facility</Label>
          <Select
            {...getSelectProps(config.facilityId)}
            value={config.facilityId.defaultValue}
            key={config.facilityId.key} // Pass key explicitly
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select facility" />
            </SelectTrigger>
            <SelectContent>
              {facilities.map(facility => (
                <SelectItem key={facility.id} value={facility.id}>
                  {facility.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fields.facilityId.errors && (
            <p className="mt-1 text-sm text-red-700">
              {fields.facilityId.errors}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor={`description.${index}.facilities`}>Description</Label>
          <Input
            {...getInputProps(config.description, { type: "text" })}
            name={config.description.name}
            type="text"
            id="description"
            min={0}
            placeholder="Enter facility description"
            className={`mt-1 rounded-md border p-2 ${
              config.description.errors ? "border-red-500" : "border-gray-300"
            }`}
          />
          {config.description.errors && (
            <p className="mt-1 text-sm text-red-700">
              {config.description.errors}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 self-end">
          <Button
            {...form.reorder.getButtonProps({
              from: index,
              to: Math.max(0, index - 1),
            })}
            disabled={index === 0}
          >
            <ArrowUpIcon />
          </Button>
          <Button
            {...form.reorder.getButtonProps({
              name: fields.placeFacilities.name,
              from: index,
              to: Math.min(itemLength - 1, index + 1),
            })}
            disabled={index === itemLength - 1}
          >
            <ArrowDown />
          </Button>
          <Button
            {...form.remove.getButtonProps({
              name: fields.placeFacilities.name,
              index,
            })}
            variant="destructive"
          >
            <TrashIcon />
          </Button>
        </div>
      </div>
    </fieldset>
  );
}

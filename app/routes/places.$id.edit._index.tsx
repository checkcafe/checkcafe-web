import { useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { FileUploaderRegular } from "@uploadcare/react-uploader";
import React from "react";

import "@uploadcare/react-uploader/core.css";

import {
  deleteFile,
  UploadcareSimpleAuthSchema,
} from "@uploadcare/rest-client";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

import { Combobox } from "~/components/shared/form-input/combobox";
import { OperatingHoursForm } from "~/components/shared/form-input/operating-hours-form";
import { Sliders } from "~/components/shared/sliders";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import {
  BACKEND_API_URL,
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
  description: z.string().min(4).max(255).optional(),
  streetAddress: z.string().min(4).max(100),
  priceRangeMin: z.number().min(1).optional(),
  priceRangeMax: z.number().min(1).optional(),
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
export default function EditPlace() {
  const { place, city } = useLoaderData<typeof loader>();
  const [cityId, setCityId] = useState(place.address.cityId);

  const [imageUrls, setImageUrls] = useState<placePhotosData[]>(place.photos);
  const [form, fields] = useForm({
    shouldValidate: "onBlur",
    onValidate({ formData }) {
      return parse(formData, { schema: EditPlaceSchema });
    },
    defaultValue: {
      imageUrls: place.photos,
      name: place.name,
      streetAddress: place.address.street,
      description: place.description,
      priceRangeMin: place.priceRangeMin,
      priceRangeMax: place.priceRangeMax,
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
          <div className="container-publish-button">
            <Form method="post" id="change-status-publish">
              <input type="hidden" name="action" value="isPublish" />
              <input type="hidden" name="placeId" value={place.id} />
              <Button type="submit">
                {place?.isPublished ? "Unpublish" : "Publish"}
              </Button>
            </Form>
          </div>
        </section>
        <Form method="post" className="space-y-4" {...form.props}>
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
            name={fields.placePhotos.name}
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
              onFileUploadFailed={e => {
                console.log(e, "failed");
              }}
              onFileUploadSuccess={e => {
                console.log(e, "success");
              }}
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
              {...fields.name}
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
              {...fields.streetAddress}
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
              {...fields.cityId}
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
              {...fields.description}
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
                  {...fields.priceRangeMin}
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
                  {...fields.priceRangeMax}
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
          <div>
            <Button type="submit">Save Place</Button>
          </div>
        </Form>

        <Separator />

        <OperatingHoursForm
          placeData={{
            id: place.id,
            operatingHours: place.operatingHours ?? [],
          }}
        />
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
    const submission = parse(formData, { schema: EditPlaceSchema });
    console.dir({ submission }, { depth: null });
    const placePhotosData = JSON.parse(String(submission.value?.placePhotos));
    console.info(
      placePhotosData,
      "placePhotosData",
      JSON.parse(String(submission.value?.placePhotos)),
    );
    console.dir({ placePhotosData }, { depth: null });

    // Send the submission back to the client if the status is not successful
    if (submission.intent !== "submit" || !submission.value) {
      return json(submission);
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

    console.dir({ place }, { depth: null });
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

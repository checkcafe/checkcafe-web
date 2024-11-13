import { useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
// import { json, LoaderFunctionArgs } from "@remix-run/node";
// import { redirect, useActionData, useLoaderData } from "@remix-run/react";
import { FileUploaderRegular } from "@uploadcare/react-uploader";
import React, { useEffect } from "react";

import "@uploadcare/react-uploader/core.css";

import {
  deleteFile,
  UploadcareSimpleAuthSchema,
} from "@uploadcare/rest-client";
import { Trash, TrashIcon } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

import { Combobox } from "~/components/shared/form-input/combobox";
import { OperatingHoursForm } from "~/components/shared/form-input/operating-hours-form";
import { Sliders } from "~/components/shared/sliders";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import {
  BACKEND_API_URL,
  UPLOADCARE_PUBLIC_KEY,
  UPLOADCARE_SECRET_KEY,
} from "~/lib/env";
import { getAccessToken } from "~/lib/token";
import { cn } from "~/lib/utils";
import { City, Place } from "~/types/model";

// import { paths } from "~/types/schema";

React.useLayoutEffect = React.useEffect;

const uploadcareSimpleAuthSchema = new UploadcareSimpleAuthSchema({
  publicKey: UPLOADCARE_PUBLIC_KEY,
  secretKey: UPLOADCARE_SECRET_KEY,
});

const EditPlaceSchema = z.object({
  // imageUrls: z.array(z.object({ url: z.string() })).optional(),
  placePhotos: z.string().min(1).optional(),
  name: z.string().min(4).max(255),
  streetAddress: z.string().min(4).max(100),
  cityId: z.string().min(4),
});
// type PlaceItem =
//   paths["/places/{slugOrId}"]["get"]["responses"][200]["content"]["application/json"][""];
export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  if (!id) return redirect("/");

  const responsePlace = await fetch(`${BACKEND_API_URL}/places/${id}`);
  const place: Place = await responsePlace.json();

  if (!place) {
    throw new Response(null, { status: 404, statusText: "Place Not Found" });
  }
  const responseCity = await fetch(`${BACKEND_API_URL}/geo/cities`);
  const city: City[] = await responseCity.json();
  if (!city) {
    throw new Response(null, { status: 404, statusText: "City Not Found" });
  }
  return json({ place, city });
}

export default function EditPlace() {
  // console.log(imageUrls, "imageUrls");
  const fetcher = useFetcher();
  const { place, city } = useLoaderData<typeof loader>();
  // const actionData = useActionData<ActionData>();
  const [imageUrls, setImageUrls] = useState<{ url: string }[]>(place.photos);
  const [form, fields] = useForm({
    // Configure when each field should be validated
    shouldValidate: "onBlur",
    // Optional: Required only if you're validating on the server
    // actionData.def,
    // Optional: Client validation. Fallback to server validation if not provided
    onValidate({ formData }) {
      return parse(formData, { schema: EditPlaceSchema });
    },
    defaultValue: {
      imageUrls: [{ url: "https://example.com" }],
      name: place.name,
      streetAddress: place.address.street,
    },
  });

  const [cityId, setCityId] = React.useState(place.cityId);

  function handleSetImageUrls(data: string[]) {
    data.forEach(url => setImageUrls(imageUrls => [...imageUrls, { url }]));
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

  // useEffect(() => {
  //   console.log(imageUrls, "imageUrls");
  // }, [imageUrls]);
  // useEffect(() => {
  //   console.log(place, "place");
  // }, [place]);

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-3xl space-y-8 px-4 py-20">
        <section className="container-button flex justify-between">
          <div className="container-action-button">
            <Form method="post" id="user-delete-place-by-id">
              <input type="hidden" name="action" value="delete" />
              <input type="hidden" name="placeId" value={place.id} />
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
              <Button type="submit">Publish</Button>
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
                  // console.log(urlData, "urlData");
                  handleSetImageUrls(urlData);
                }
              }}
              onFileRemoved={e => {
                // console.log(e, "remove");

                // Call action to delete file
                if (e.uuid) deleteFiles(e.uuid);
                if (e.isRemoved && e.cdnUrl) {
                  handleDeleteImageUrls(e.cdnUrl);
                }
              }}
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
  // http://localhost:5173/places/cm3fnje7d000ljng6xn3nnoyg/edit?index;
  const formData = await request.formData();
  const placeId = formData.get("placeId");
  const action = formData.get("action");

  if (!action) {
    const submission = parse(formData, { schema: EditPlaceSchema });
    console.dir({ submission }, { depth: null });
    const { placePhotosData } = JSON.parse(
      String(submission.value?.placePhotos),
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
    console.log(result);
    if (!result) {
      throw new Response(null, { status: 404, statusText: "Place Not Found" });
    }
    return redirect("/");
  } else if (action === "isPublish") {
    const responseDelete = await fetch(`${BACKEND_API_URL}/places/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const result: { message: string } = await responseDelete.json();
    console.log(result);
    if (!result) {
      throw new Response(null, { status: 404, statusText: "Place Not Found" });
    }
    return redirect("/");
  }

  return null;
}

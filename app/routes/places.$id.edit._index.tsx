import { useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
// import { json, LoaderFunctionArgs } from "@remix-run/node";
// import { redirect, useActionData, useLoaderData } from "@remix-run/react";
import { FileUploaderRegular } from "@uploadcare/react-uploader";
import React from "react";

import "@uploadcare/react-uploader/core.css";

import {
  deleteFile,
  UploadcareSimpleAuthSchema,
} from "@uploadcare/rest-client";
import { useState } from "react";
import { z } from "zod";

import { Combobox } from "~/components/shared/form-input/combobox";
import { MultipleOperatingHours } from "~/components/shared/form-input/multiple-input-operating-hours";
import { Sliders } from "~/components/shared/sliders";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  BACKEND_API_URL,
  UPLOADCARE_PUBLIC_KEY,
  UPLOADCARE_SECRET_KEY,
} from "~/lib/env";
import { Place } from "~/types/model";

React.useLayoutEffect = React.useEffect;

const schema = z.object({
  name: z.string().min(4).max(255),
  streetAddress: z.string().min(4).max(100),
  cityId: z.string().min(4),
});
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  console.log({ formData });
  // const submission = parse(formData, { schema });

  // Send the submission back to the client if the status is not successful
  // if (submission.status !== "success") {
  //   return submission.reply();
  // }

  // const session = await auth.login(submission.value);
  // const session = false;
  // Send the submission with addional error message if login fails
  // if (!session) {
  //   return submission.reply({
  //     formErrors: ["Incorrect username or password"],
  //   });
  // }

  // return redirect("/dashboard");
  return null;
}
export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  if (!id) return redirect("/");

  const url = `${BACKEND_API_URL}/places/${id}`;
  const responsePlace = await fetch(url);
  const place: Place = await responsePlace.json();

  if (!place) {
    throw new Response(null, { status: 404, statusText: "Place Not Found" });
  }

  return json({
    place,
  });
}

type url = {
  url: string;
};
export default function EditPlace() {
  const { place } = useLoaderData<typeof loader>();
  // const actionData = useActionData<ActionData>();
  const [imageUrls, setImageUrls] = useState<url[]>([]);
  const [form, fields] = useForm({
    // Configure when each field should be validated
    shouldValidate: "onBlur",
    // Optional: Required only if you're validating on the server
    // actionData.def,
    // Optional: Client validation. Fallback to server validation if not provided
    onValidate({ formData }) {
      return parse(formData, { schema });
    },
  });

  function handleSetImageUrls(data: string[]) {
    data.forEach(url => setImageUrls(imageUrls => [...imageUrls, { url }]));
  }
  function handleDeleteImageUrls(urlToRemove: string) {
    setImageUrls(prevState =>
      prevState.filter(item => item.url !== urlToRemove),
    );
  }
  // console.log(imageUrls, "imageUrls");
  const uploadcareSimpleAuthSchema = new UploadcareSimpleAuthSchema({
    publicKey: UPLOADCARE_PUBLIC_KEY,
    secretKey: UPLOADCARE_SECRET_KEY,
  });

  async function deleteFiles(uuid: string) {
    await deleteFile({ uuid }, { authSchema: uploadcareSimpleAuthSchema });
  }

  return (
    <div className="flex justify-center">
      <form
        className="w-full max-w-3xl space-y-4 px-4 py-20"
        method="post"
        id={form.id}
      >
        {imageUrls && imageUrls.length > 0 && (
          <Sliders
            imageSlides={imageUrls.map((imageUrl: { url: string }) => ({
              imageUrl: imageUrl.url,
            }))}
            widthImage={200}
          />
        )}

        <input hidden defaultValue={JSON.stringify(imageUrls)} />

        <FileUploaderRegular
          sourceList="local, url, camera"
          classNameUploader="uc-light"
          pubkey={UPLOADCARE_PUBLIC_KEY}
          multiple={true}
          accept="image/png,image/jpeg"
          confirmUpload={true}
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
            if (e.uuid) deleteFiles(e.uuid);
            if (e.isRemoved && e.cdnUrl) {
              handleDeleteImageUrls(e.cdnUrl);
            }
          }}
        />

        <div>
          <Label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </Label>
          <Input
            type="text"
            name={fields.name.name}
            id="username"
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
            type="text"
            name={fields.streetAddress.name}
            id="streetAddress"
            placeholder="Enter your streetAddress or email"
            className={`mt-1 rounded-md border p-2 ${fields.streetAddress.errors ? "border-red-500" : "border-gray-300"}`}
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
          <Combobox />
          {/* <Input
             type="text"
             name={fields.cityId.name}
             id="cityId"
             placeholder="Enter your cityId or email"
             className={`mt-1 rounded-md border p-2 ${fields.cityId.errors ? "border-red-500" : "border-gray-300"}`}
           />
           {fields.cityId.errors && (
             <p className="mt-1 text-sm text-red-700">{fields.cityId.errors}</p>
           )} */}
        </div>

        <div>
          <Label
            htmlFor="operatingHours"
            className="block text-sm font-medium text-gray-700"
          >
            Operating Hours
          </Label>
          <MultipleOperatingHours
            placeData={{
              id: place.id,
              operatingHours: place.operatingHours ?? [],
            }}
          />
        </div>
      </form>
    </div>
  );
}

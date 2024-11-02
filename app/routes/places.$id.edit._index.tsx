import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { redirect, useActionData, useLoaderData } from "@remix-run/react";
import { FileUploaderRegular } from "@uploadcare/react-uploader";

import "@uploadcare/react-uploader/core.css";

import { z } from "zod";

import { Combobox } from "~/components/shared/form-input/combobox";
import { MultipleOperatingHours } from "~/components/shared/form-input/multiple-input-operating-hours";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { UPLOADCARE_PUBLIC_KEY } from "~/lib/env";
import { ActionData } from "~/types/auth";

const schema = z.object({
  name: z.string().min(4).max(255),
  streetAddress: z.string().min(4).max(100),
  cityId: z.string().min(4),
});
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  // Send the submission back to the client if the status is not successful
  if (submission.status !== "success") {
    return submission.reply();
  }

  // const session = await auth.login(submission.value);
  const session = false;
  // Send the submission with addional error message if login fails
  if (!session) {
    return submission.reply({
      formErrors: ["Incorrect username or password"],
    });
  }

  return redirect("/dashboard");
}
export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  if (!id) return redirect("/places");

  // const url = `${BACKEND_API_URL}/places/${id}`;

  // const responsePlace = await fetch(url);
  // const place: Place = await responsePlace.json();

  // if (!place) {
  //   throw new Response(null, { status: 404, statusText: "Place Not Found" });
  // }

  return json({
    place: {
      id: "temp",
    },
  });
}

export default function PlaceSlug() {
  const { place } = useLoaderData<typeof loader>();
  const actionData = useActionData<ActionData>();
  const [form, fields] = useForm({
    // Configure when each field should be validated
    shouldValidate: "onBlur",
    // Optional: Required only if you're validating on the server
    // actionData.def,
    // Optional: Client validation. Fallback to server validation if not provided
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });
  return (
    <div className="px-32 py-20">
      <form method="post" id={form.id} onSubmit={form.onSubmit}>
        <FileUploaderRegular
          sourceList="local, url, camera"
          classNameUploader="uc-light"
          pubkey={UPLOADCARE_PUBLIC_KEY}
          multiple={true}
          accept="image/png,image/jpeg "
          confirmUpload={true}
          onChange={e => {
            console.log(e, "es");
          }}
          onFileUploadSuccess={e => {
            console.log(e, "eurl");
          }}
        />

        <span>
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
            placeholder="Enter your username or email"
            className={`mt-1 rounded-md border p-2 ${fields.name.errors ? "border-red-500" : "border-gray-300"}`}
          />
          {fields.name.errors && (
            <p className="mt-1 text-sm text-red-700">{fields.name.errors}</p>
          )}
        </span>
        <span>
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
        </span>
        <span>
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
        </span>
        <span>
          <Label
            htmlFor="operatingHours"
            className="block text-sm font-medium text-gray-700"
          >
            Operating Hours
          </Label>
          <MultipleOperatingHours />
        </span>
      </form>
    </div>
  );
}

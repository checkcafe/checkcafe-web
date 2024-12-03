import {
  getFormProps,
  getInputProps,
  getSelectProps,
  useForm,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { ActionFunctionArgs } from "@remix-run/node";
import { json, useFetcher } from "@remix-run/react";
import { ArrowDown, ArrowUpIcon, Trash, TrashIcon } from "lucide-react";
import { useRef } from "react";
import { z } from "zod";

import { Alert } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { FormDescription, FormField, FormLabel } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { BACKEND_API_URL } from "~/lib/env";
import { getAccessToken } from "~/lib/token";
import { OperatingHour, schemaOperatingHoursPlace } from "~/schemas/places";
import { Place } from "~/types/model";

import SelectHour, { generateTimeOptions } from "../select-hour";

// Define the available time options and days of the week
const timeOptions = generateTimeOptions();
const daysData = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Component to update operating hours
export function MultipleOperatingHoursUpdate({
  placeData,
}: {
  placeData?: Pick<Place, "id" | "operatingHours">;
}) {
  const fetcher = useFetcher();
  const [form, fields] = useForm<z.infer<typeof schemaOperatingHoursPlace>>({
    shouldValidate: "onSubmit",
    onValidate({ formData }) {
      console.log(formData);
      return parseWithZod(formData, { schema: schemaOperatingHoursPlace });
    },
    defaultValue: {
      operatingHours: placeData?.operatingHours || [],
    },
  });

  const operatingHoursItems = fields.operatingHours.getFieldList();
  const canAddOperatingHours = operatingHoursItems.length <= 6;
  return (
    <form method="PUT" className="space-y-6" {...getFormProps(form)}>
      <fieldset className="space-y-2 disabled:opacity-80">
        {/* <input
          hidden
          {...getInputProps(fields.id, { type: "text" })}
          defaultValue={placeData?.id}
        /> */}
        <FormLabel id="operatingHours">Operating Hours</FormLabel>
        <div className="my-4 flex gap-4">
          <Button
            {...form.insert.getButtonProps({
              name: fields.operatingHours.name,
            })}
            disabled={!canAddOperatingHours}
          >
            Add Operating Hours
          </Button>
          <Button type="submit" variant="outline">
            Save
          </Button>
        </div>
        {operatingHoursItems.length === 0 && (
          <p>No operating hours yet, add one.</p>
        )}

        <ul className="space-y-2">
          {operatingHoursItems.map((item, index) => (
            <>
              <li key={item.key} className="flex items-center gap-2">
                <OperatingHoursItemFieldset
                  config={item.getFieldset()}
                  index={index}
                  form={form}
                  fields={fields}
                />
              </li>
            </>
          ))}
        </ul>
      </fieldset>
    </form>
  );
}

function OperatingHoursItemFieldset({
  config,
  index,
  form,
  fields,
}: {
  config: any;
  index: number;
  form: any;
  fields: any;
}) {
  return (
    <fieldset className="flex w-full flex-col gap-1 sm:flex-row sm:gap-2">
      <div className="flex w-full gap-4">
        {/* Day Selector */}
        <div>
          <Label htmlFor={`operatingHours.${index}.day`}>Day</Label>
          <Select {...getSelectProps(config.day.name)} defaultValue="Monday">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a day" />
            </SelectTrigger>
            <SelectContent>
              {daysData.map(day => (
                <SelectItem key={day} value={day}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Open Time Selector */}
        <div>
          <Label htmlFor={`operatingHours.${index}.openTime`}>Open</Label>
          <Select
            {...getSelectProps(config.openTime.name)}
            defaultValue="09:00"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="09:00" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map(time => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Close Time Selector */}
        <div>
          <Label htmlFor={`operatingHours.${index}.closeTime`}>Close</Label>
          <Select
            {...getSelectProps(config.closeTime.name)}
            defaultValue="23:00"
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
        </div>
        {/* Action Buttons */}
        <div className="flex gap-2 self-end">
          <Button
            {...form.reorder.getButtonProps({
              name: fields.operatingHours.name,
              from: index,
              to: index - 1,
            })}
          >
            <ArrowUpIcon />
          </Button>
          <Button
            {...form.reorder.getButtonProps({
              name: fields.operatingHours.name,
              from: index,
              to: index + 1,
            })}
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

// Action Function
export async function action({ request, params }: ActionFunctionArgs) {
  const { id } = params;
  const formData = await request.formData();
  console.info(id, "id");
  console.info(formData, "subs");
  const submission = parseWithZod(formData, {
    schema: schemaOperatingHoursPlace,
  });

  if (submission.status !== "success") {
    return json(submission.reply(), {
      status: 400,
    });
  }

  // Replace with actual update logic
  // Example:
  // const response = await fetch(`${BACKEND_API_URL}/places/${id}`, {
  //   method: "PATCH",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(submission.value),
  // });
  // if (!response.ok) {
  //   throw new Error("Failed to update operating hours");
  // }

  return null;
}

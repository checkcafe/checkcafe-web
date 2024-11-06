import {
  conform,
  FieldsetConfig,
  list,
  useFieldList,
  useFieldset,
  useForm,
} from "@conform-to/react";
import { parse } from "@conform-to/zod";
import { useFetcher } from "@remix-run/react";
import { useRef } from "react";
import { z } from "zod";

import { Alert } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { FormLabel } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { OperatingHour, schemaOperatingHoursPlace } from "~/schemas/places";
import { Place } from "~/types/model";
import { type SubmissionResult } from "~/types/submission";

export function OperatingHoursForm({
  placeData,
}: {
  placeData?: Pick<Place, "id" | "operatingHours">;
}) {
  const fetcher = useFetcher();
  const [form, { id, operatingHours }] = useForm<
    z.infer<typeof schemaOperatingHoursPlace>
  >({
    shouldValidate: "onSubmit",
    lastSubmission: fetcher.data as SubmissionResult,
    onValidate({ formData }) {
      return parse(formData, { schema: schemaOperatingHoursPlace });
    },
    defaultValue: {
      operatingHours: placeData?.operatingHours,
    },
  });

  const operatingHoursItems = useFieldList(form.ref, operatingHours);
  const hasOperatingHoursItems = operatingHoursItems.length > 0;
  // console.log(operatingHoursItems, "operatingHoursItems");
  // console.log(operatingHours, FormData, "operatingHours");
  // console.log({ ...list.insert(operatingHours.name) }, "insert");
  return (
    <fetcher.Form {...form.props} method="PUT" className="space-y-6">
      <fieldset className="space-y-2 disabled:opacity-80">
        <input hidden {...conform.input(id)} defaultValue={placeData?.id} />
        <FormLabel id="links">Operating Hours</FormLabel>

        <div>
          <Button
            type="button"
            variant="outline"
            {...list.insert(operatingHours.name)}
          >
            <span>Add</span>
          </Button>

          <Button
            type="button"
            name="intent"
            value="user-change-links"
            variant="outline"
          >
            Save
          </Button>
        </div>
        {!hasOperatingHoursItems && <p>No operating hours yet, add one.</p>}
        {hasOperatingHoursItems &&
          operatingHoursItems.map(operatingHoursItem => (
            <li key={operatingHoursItem.key} className="flex gap-2 py-1">
              <OperatingHoursItemFieldset {...operatingHoursItem} />
              <p>{operatingHoursItem.name}</p>
            </li>
          ))}
      </fieldset>
    </fetcher.Form>
  );
}

interface OperatingHoursItemFieldsetProps
  extends FieldsetConfig<z.input<typeof OperatingHour>> {}

function OperatingHoursItemFieldset({
  ...config
}: OperatingHoursItemFieldsetProps) {
  const ref = useRef<HTMLFieldSetElement>(null);
  const { day, openingTime, closingTime } = useFieldset(ref, config);

  return (
    <fieldset
      ref={ref}
      className="flex w-full flex-col gap-1 sm:flex-row sm:gap-2"
    >
      <div>
        <Input
          placeholder="https://example.com"
          className="w-full sm:w-auto"
          {...conform.input(day)}
        />
        {day.error && <Alert variant="destructive">{day.error}</Alert>}
      </div>

      <div>
        <Input
          placeholder="Example Name"
          className="w-full sm:w-auto"
          {...conform.input(openingTime)}
        />
        {openingTime.error && (
          <Alert variant="destructive">{openingTime.error}</Alert>
        )}
      </div>
      <div>
        <Input
          placeholder="Example Name"
          className="w-full sm:w-auto"
          {...conform.input(closingTime)}
        />
        {closingTime.error && (
          <Alert variant="destructive">{closingTime.error}</Alert>
        )}
      </div>
    </fieldset>
  );
}

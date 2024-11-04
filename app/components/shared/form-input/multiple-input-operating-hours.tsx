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
import { Input } from "~/components/ui/input";
import {
  OperatingHourSchema,
  schemaOperatingHoursPlace,
} from "~/schemas/places";

export function MultipleOperatingHours() {
  const fetcher = useFetcher();
  const [form, { id, operatingHours }] = useForm<
    z.infer<typeof schemaOperatingHoursPlace>
  >({
    shouldValidate: "onSubmit",
    //   lastSubmission: fetcher.data as SubmissionResult,
    onValidate({ formData }) {
      return parse(formData, { schema: schemaOperatingHoursPlace });
    },
    defaultValue: {
      operatingHours: [],
    },
  });

  const operatingHoursItems = useFieldList(form.ref, operatingHours);
  const hasOperatingHoursItems = operatingHoursItems.length > 0;
  //   const item = operatingHoursItems.map(operatingItem => operatingItem.name);
  return (
    <fetcher.Form {...form.props} method="PUT" className="space-y-6">
      <input hidden {...conform.input(id)} defaultValue={`${Math.random()}`} />{" "}
      <Button
        variant="outline"
        // disabled={!isAllowAddLink}
        onClick={() => {
          //   form.insert();
        }}
        {...list.insert(operatingHours.name)}
      >
        <span>Add</span>
      </Button>
      {!hasOperatingHoursItems && <p>No links yet, add one.</p>}
      {hasOperatingHoursItems &&
        operatingHoursItems.map(operatingHoursItem => (
          <li key={operatingHoursItem.key} className="flex gap-2 py-1">
            <OperatingHoursItemFieldset />
          </li>
        ))}
    </fetcher.Form>
  );
}

interface LinkItemFieldsetProps
  extends FieldsetConfig<z.input<typeof OperatingHourSchema>> {}

function OperatingHoursItemFieldset({ ...config }: LinkItemFieldsetProps) {
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

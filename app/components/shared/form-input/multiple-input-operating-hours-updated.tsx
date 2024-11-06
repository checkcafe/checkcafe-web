// import { getFormProps, getInputProps, useForm } from "@conform-to/react";
// import { parseWithZod } from "@conform-to/zod";
// import { useFetcher } from "@remix-run/react";
// import { useRef } from "react";
// import { z } from "zod";

// import { Alert } from "~/components/ui/alert";
// import { Button } from "~/components/ui/button";
// import { FormDescription, FormField, FormLabel } from "~/components/ui/form";
// import { Input } from "~/components/ui/input";
// import { OperatingHour, schemaOperatingHoursPlace } from "~/schemas/places";
// import { Place } from "~/types/model";

// // import { type SubmissionResult } from "~/types/submission";

// export function MultipleOperatingHoursUpdate({
//   placeData,
// }: {
//   placeData?: Pick<Place, "id" | "operatingHours">;
// }) {
//   const fetcher = useFetcher();
//   const [form, fields] = useForm<z.infer<typeof schemaOperatingHoursPlace>>({
//     shouldValidate: "onSubmit",
//     // lastSubmission: fetcher.data as SubmissionResult,
//     onValidate({ formData }) {
//       return parseWithZod(formData, { schema: schemaOperatingHoursPlace });
//     },
//     defaultValue: {
//       operatingHours: placeData?.operatingHours,
//     },
//   });

//   // const operatingHoursItems = useFieldList(form.ref, operatingHours);
//   const operatingHoursItems = fields.operatingHours.getFieldList();
//   const hasOperatingHoursItems = operatingHoursItems.length > 0;
//   console.log(operatingHoursItems, FormData, "operatingHours");
//   // console.log({ ...list.insert(operatingHours.name) }, "insert");
//   return (
//     <fetcher.Form {...getFormProps(form)} method="PUT" className="space-y-6">
//       <fieldset className="space-y-2 disabled:opacity-80">
//         <input
//           hidden
//           {...getInputProps(fields.id, { type: "text" })}
//           defaultValue={placeData?.id}
//         />
//         <FormField>
//           <FormLabel id="links">Links</FormLabel>
//           <FormDescription>
//             To link your websites, social media, and projects/products. Limited
//             to 10 items.
//           </FormDescription>

//           <div>
//             {/* <Button
//               variant="outline"
//               {...form.insert(`${fields.operatingHours.name}`)}
//             >
//               <span>Add</span>
//             </Button> */}
//             <Button
//               {...form.insert.getButtonProps({
//                 name: fields.operatingHours.name,
//               })}
//             >
//               Add (Declarative API)
//             </Button>
//             <Button
//               type="submit"
//               name="intent"
//               value="user-change-links"
//               variant="outline"
//             >
//               Save
//             </Button>
//           </div>
//           {!hasOperatingHoursItems && <p>No operating hours yet, add one.</p>}
//           {hasOperatingHoursItems &&
//             operatingHoursItems.map(operatingHoursItem => (
//               <li key={operatingHoursItem.key} className="flex gap-2 py-1">
//                 <OperatingHoursItemFieldset
//                   config={operatingHoursItem.getFieldset()}
//                 />
//                 <p>{operatingHoursItem.name}</p>
//               </li>
//             ))}
//         </FormField>
//       </fieldset>
//     </fetcher.Form>
//   );
// }

// interface OperatingHoursItemFieldsetProps
//   extends z.infer<typeof OperatingHour> {}
// function OperatingHoursItemFieldset({ config }: { config: any }) {
//   return (
//     <fieldset className="flex w-full flex-col gap-1 sm:flex-row sm:gap-2">
//       <div>
//         <Input
//           placeholder="Day"
//           className="w-full sm:w-auto"
//           {...getInputProps(config.day, { type: "text" })}
//         />
//         {config.day.error && (
//           <Alert variant="destructive">{config.day.error}</Alert>
//         )}
//       </div>

//       <div>
//         <Input
//           placeholder="Opening Time"
//           className="w-full sm:w-auto"
//           {...getInputProps(config.openingTime, { type: "text" })}
//         />
//         {config.openingTime.error && (
//           <Alert variant="destructive">{config.openingTime.error}</Alert>
//         )}
//       </div>
//       <div>
//         <Input
//           placeholder="Closing Time"
//           className="w-full sm:w-auto"
//           {...getInputProps(config.closingTime, { type: "text" })}
//         />
//         {config.closingTime.error && (
//           <Alert variant="destructive">{config.closingTime.error}</Alert>
//         )}
//       </div>
//     </fieldset>
//   );
// }

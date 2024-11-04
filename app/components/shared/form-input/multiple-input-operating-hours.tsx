// import { useForm } from "@conform-to/react";
// import { parse } from "@conform-to/zod";
// import { useFetcher } from "@remix-run/react";
// import { z } from "zod";

// import { Button } from "~/components/ui/button";
// import { Input } from "~/components/ui/input";
// import { schemaOperatingHoursPlace } from "~/schemas/places";

// export function MultipleOperatingHours() {
//   const fetcher = useFetcher();
//   const [form, fields] = useForm<z.infer<typeof schemaOperatingHoursPlace>>({
//     shouldValidate: "onSubmit",
//     //   lastSubmission: fetcher.data as SubmissionResult,
//     onValidate({ formData }) {
//       return parse(formData, { schema: schemaOperatingHoursPlace });
//     },
//     defaultValue: {
//       operatingHours: [],
//     },
//   });

//   // const operatingHoursItems = fields.operatingHours.getFieldList();
//   const hasOperatingHoursItems = operatingHoursItems.length > 0;
//   //   const item = operatingHoursItems.map(operatingItem => operatingItem.name);
//   return (
//     // <fetcher.Form method="post" {...getFormProps(form)}>
//     //   <input
//     //     hidden
//     //     {...getInputProps(fields.id, { type: "text" })}
//     //     defaultValue={`${Math.random()}`}
//     //   />{" "}
//     //   <Button
//     //     variant="outline"
//     //     // disabled={!isAllowAddLink}
//     //     onClick={() => {
//     //       //   form.insert();
//     //     }}
//     //   >
//     //     <span>Add</span>
//     //   </Button>
//     //   {!hasOperatingHoursItems && <p>No links yet, add one.</p>}
//     //   {hasOperatingHoursItems &&
//     //     operatingHoursItems.map(operatingHoursItem => (
//     //       <li key={operatingHoursItem.key} className="flex gap-2 py-1">
//     //         <div>
//     //           <Input
//     //             placeholder="https://example.com"
//     //             className="w-full sm:w-auto"
//     //           />
//     //         </div>

//     //         <div>
//     //           <Input placeholder="Example Name" className="w-full sm:w-auto" />
//     //         </div>
//     //       </li>
//     //     ))}
//     // </fetcher.Form>
//     <></>
//   );
// }

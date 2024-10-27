import { json } from "@remix-run/react";

export function loader() {
    const teamMembers = [{ name: "A" }, { name: "B" }];
  
    return json({ teamMembers });
  }
  
  export default function New() {
    return <></>

  }

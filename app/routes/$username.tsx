import { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect, useLoaderData } from "@remix-run/react";
import { createCustomCookie } from "~/lib/access-token";
import { auth } from "~/lib/auth";

export async function loader({ request }: LoaderFunctionArgs) {
    const cookieHeader = request.headers.get("Cookie");
    const createAccessTokenCookie = createCustomCookie("accessToken");
    const accessTokenCookie = createAccessTokenCookie.parse(cookieHeader);
  
    const cookie = {
      accessToken: await accessTokenCookie,
    };
    if (!accessTokenCookie) return redirect("/login");
  
    const user = await auth.checkUser(cookie.accessToken);
  
    console.log(user,'user')
    return json({
      user
    });
  }
  


export default function Profile() {
  const loaderData = useLoaderData<typeof loader>();
    return     (


<div className=" "><main className=" translate-y-1/4 flex flex-col p-20   gap-16 ">
    <section className="flex  gap-4"> 

   <img src={loaderData.user?.avatarUrl} alt={loaderData.user?.name} className="rounded-full" />
    <span>
    <h1 className="font-bold text-2xl">{loaderData.user?.name}</h1>
    <p className="text-slate-500">{loaderData.user?.email}</p>
    </span>
    </section>
</main>
</div>)
}
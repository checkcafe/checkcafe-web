import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

export function loader() {
  const teamMembers = [
    {
      name: "Haidar",
      image:
        "https://ucarecdn.com/904d367c-12ce-4afa-af7d-50cfd376b982/haidar.jpg",
      role: "Project Manager",
      linkedIn: "https://www.linkedin.com/in/mhaidarhanif/",
      github: "https://github.com/mhaidarhanif",
    },
    {
      name: "Zaky",
      image:
        "https://ucarecdn.com/c2e78afc-c0f7-495d-8141-f47cb39ab1a9/zaky.png",
      role: "Tech Lead & Backend Developer",
      linkedIn: "https://www.linkedin.com/in/zckyachmd",
      github: "https://github.com/zckyachmd",
    },
    {
      name: "Aan",
      image:
        "https://ucarecdn.com/0751c3e3-f417-4cc1-8aa5-6596248c5829/aan.png",
      role: "Backend Developer",
      linkedIn: "https://www.linkedin.com/in/muhammad-farhan-569018185",
      github: "https://github.com/aan-cloud",
    },
    {
      name: "Naswa",
      image:
        "https://ucarecdn.com/76c1e196-4da8-4a10-b766-9e7f501804c4/naswa.jpg",
      role: "Frontend Developer",
      linkedIn: "https://www.linkedin.com/in/naswa-wilantama",
      github: "https://github.com/Endabelyu",
    },
    {
      name: "Iqbal",
      image:
        "https://ucarecdn.com/a00145aa-8ca1-429f-a7df-bbecdd6b17e8/iqbal.jpg",
      role: "Frontend Developer",
      linkedIn: "https://www.linkedin.com/in/iqbal-chaidir-8b80a4251/",
      github: "https://github.com/IQchaidir",
    },
    {
      name: "Difa",
      image:
        "https://ucarecdn.com/1e4649ed-bf02-4566-baa4-79dd1e2ead2f/difa.png",
      role: "Frontend Developer & UI/UX Designer",
      linkedIn: "https://www.linkedin.com/in/difasulthon",
      github: "https://github.com/difasulthon",
    },
  ];

  return json({ teamMembers });
}

export default function About() {
  const { teamMembers } = useLoaderData<typeof loader>();

  return (
    <div className="w-full">
      <section className="flex h-44 items-center justify-center bg-amber-50 px-4 sm:px-6">
        <section className="flex flex-wrap gap-1 sm:gap-3">
          <h1 className="text-3xl font-medium text-amber-900 sm:text-4xl lg:text-5xl">
            Want to know
          </h1>
          <h1 className="text-3xl font-medium text-amber-500 sm:text-4xl lg:text-5xl">
            about
          </h1>
          <h1 className="text-3xl font-medium text-amber-900 sm:text-4xl lg:text-5xl">
            us?
          </h1>
        </section>
      </section>

      <section className="mt-6 flex flex-col items-center justify-center px-4 sm:px-8 md:px-16 lg:px-32">
        <section className="flex flex-col items-center justify-center gap-2 text-center sm:gap-3">
          <h1 className="text-3xl font-medium text-amber-900 sm:text-4xl lg:text-5xl">
            Our Team
          </h1>
          <p className="text-lg font-normal text-amber-950 sm:text-xl lg:text-2xl">
            Get to know the passionate professionals behind our products and
            services
          </p>
        </section>

        <div className="w-full/2 mt-8 grid grid-cols-1 justify-items-center gap-x-8 gap-y-4 sm:grid-cols-2 md:grid-cols-3 lg:gap-x-10 lg:gap-y-10">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex flex-col items-center">
              <Avatar className="h-24 w-24 rounded-full border-4 border-amber-900 bg-white object-cover shadow-xl sm:h-28 sm:w-28 md:h-32 md:w-32 lg:h-36 lg:w-36">
                <AvatarImage src={member.image} alt={member.name} />
                <AvatarFallback>
                  {member.name ? member.name.charAt(0).toUpperCase() : "?"}
                </AvatarFallback>
              </Avatar>
              <p className="sm:text-md mt-1 text-center text-sm font-semibold text-amber-950 md:text-lg">
                {member.name}
              </p>
              <p className="text-center text-xs text-gray-600 sm:text-sm">
                {member.role}
              </p>
              <div className="mt-1 flex items-center justify-center gap-1 text-sm">
                <FaLinkedinIn
                  className="h-5 w-5 cursor-pointer hover:opacity-50"
                  color="#0A66C2"
                />
                <span>|</span>
                <FaGithub className="h-5 w-5 cursor-pointer hover:opacity-50" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

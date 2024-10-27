import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

export function loader() {
  const teamMembers = [
    { 
      name: "Zaky",
      image: '/assets/img/zaky.png',
      linkedIn: 'https://www.linkedin.com/in/zckyachmd'
    }, 
    { 
      name: "Aan",
      image: '/assets/img/aan.png',
      linkedIn: 'https://www.linkedin.com/in/muhammad-farhan-569018185'
    }, 
    { 
      name: "Naswa",
      image: '/assets/img/naswa.jpg',
      linkedIn: 'https://www.linkedin.com/in/naswa-wilantama'
    }, 
    { 
      name: "Iqbal",
      image: '/assets/img/iqbal.jpg',
      linkedIn: 'https://www.linkedin.com/in/iqbal-chaidir-8b80a4251/' 
    }, 
    { 
      name: "Difa",
      image: '/assets/img/difa.png',
      linkedIn: 'https://www.linkedin.com/in/difasulthon' 
    }, 
    { 
      name: "Haidar",
      image: '/assets/img/haidar.jpg',
      linkedIn: '' 
    }
  ];

  return json({ teamMembers });
}

export default function About() {
  const { teamMembers } = useLoaderData<typeof loader>();

  return (
    <div className="w-full">
      <section className="flex h-44 justify-center items-center bg-amber-50">
        <section className="flex flex-row gap-3">
          <h1 className="text-5xl font-medium text-amber-900">Want to know </h1>
          <h1 className="text-5xl font-medium text-amber-500"> about</h1>
          <h1 className="text-5xl font-medium text-amber-900"> us?</h1>
        </section>
      </section>
      <section className="flex flex-col px-32 mt-6 items-center justify-center">
        <section className="flex flex-col justify-center items-center gap-3">
          <h1 className="text-5xl font-medium text-amber-900">Our Team</h1>
          <h1 className="text-xl font-normal text-amber-900">Get to know the passionate professionals behind our products and services</h1>
        </section>
        <div className="mt-12 grid grid-cols-3 justify-items-center w-2/4">
          {teamMembers.map(member => (
            <a href={member.linkedIn} target="_blank" rel="noopener noreferrer">
              <div className="fle- flex-col items-center mb-10 hover:opacity-50 hover:cursor-pointer">
                <img src={member.image} alt={member.name} className="h-32 w-32 rounded-full border-4 bg-white border-amber-900 shadow-xl">
                </img>
                <p className="text-lg font-semibold text-amber-900 mt-4 text-center">{member.name}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

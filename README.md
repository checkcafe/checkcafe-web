# ☕CheckCafe Web

**CheckCafe** is your go-to platform for discovering the perfect café to meet
your personal needs.

Check out CheckCafe at [checkcafe.com](https://checkcafe.com)

Whether you're looking for a cozy spot for meetings or a productive environment
for remote work, CheckCafe provides comprehensive information about cafés,
including their amenities and atmosphere. Let us help you find the ideal place
to sip your coffee and get things done!

## Features

- Explore cafés Discover suitable cafés for your needs, including their
  location, price, amenities like Wi-Fi speed, information building, and more.
- Add and review cafés Add your favorite cafés to the platform and share your
  experiences with others.
- Recommendations for Favorite Cafés Receive personalized recommendations
  favorites for cafés based on your location.

## List Pages

List all pages in the CheckCafe Web application.

- `/` - This route is the home page of the application.
- `/about` - This route is will filled with informartion about the team who
  build this application.
- `/register` - This route is used to register a new account.
- `/login` - This route is used to login to an existing account.
- `/places` - This route is used to list all the places in the application.
- `/places/:slug` - This route is used to view a specific place.
- `/dashboard` - This route is used to view the dashboard of the user.
- `/:username` - This route is used to view the profile of the user.
- `/:username/favorites` - This route is used to view the favorites of the user.

## Tech Stack and Dependencies

- Language: TypeScript
- Runtime: Bun
- Framework: Remix (React Router)
- CSS Framework: Tailwind CSS
- Components Library: Shadcn UI
- Data Validation: Zod
- File Upload: Uploadcare

## Installation or Initialize the project

Clone the repository:

```sh
git clone https://github.com/checkcafe/checkcafe-web.git
cd checkcafe-web
```

Setup the environment variables:

```sh
cp .env.example .env
```

Install dependencies:

```sh
bun install
```

Start the development server:

```sh
bun dev
```

Build your app for production:

```sh
bun run build
```

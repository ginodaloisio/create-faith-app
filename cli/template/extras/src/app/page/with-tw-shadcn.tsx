import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DoubleArrowRightIcon,
  LetterCaseCapitalizeIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#160207] to-[#430815] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Create <span className="text-[#e11d48]">faith</span> App
        </h1>
        <h2 className="text-xl font-bold tracking-tight text-white sm:text-3xl">
          inspired by{" "}
          <Link
            href="https://create.t3.gg"
            target="_blank"
            className="decoration-slate-50 hover:border-b-2 hover:border-b-[hsl(280,100%,70%)]"
          >
            <span className="text-[hsl(280,100%,70%)]">T3</span> Stack
          </Link>
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:max-w-2xl sm:grid-cols-2 md:gap-8">
          <Card className="cursor-pointer border-none bg-white/10 text-white hover:bg-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl">First Steps</CardTitle>
              <DoubleArrowRightIcon className="h-6 w-6" />
            </CardHeader>
            <CardContent>
              <CardDescription className="text-md mt-2 font-medium text-white">
                Just the basics - Everything you need to know to set up your
                database and authentication.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="cursor-pointer border-none bg-white/10 text-white hover:bg-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl">Documentation</CardTitle>
              <LetterCaseCapitalizeIcon className="h-6 w-6" />
            </CardHeader>
            <CardContent>
              <CardDescription className="text-md mt-2 font-medium text-white">
                Learn more about faith's preferred stack, the libraries it uses,
                and how to deploy it.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

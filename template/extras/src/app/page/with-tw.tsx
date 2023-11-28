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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            href="https://create.t3.gg/en/usage/first-steps"
            target="_blank"
          >
            <h3 className="text-2xl font-bold">First Steps →</h3>
            <div className="text-lg">
              Just the basics - Everything you need to know to set up your
              database and authentication.
            </div>
          </Link>
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            href="https://create.t3.gg/en/introduction"
            target="_blank"
          >
            <h3 className="text-2xl font-bold">Documentation →</h3>
            <div className="text-lg">
              Learn more about Create T3 App, the libraries it uses, and how to
              deploy it.
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}

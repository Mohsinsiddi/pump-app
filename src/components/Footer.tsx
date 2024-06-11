import WordMark from "@/components/WordMark";

import Link from "next/link";

export default async function Footer() {
  const settings = ["features", "settings"];

  return (
    <footer className="flex flex-col items-center justify-between gap-6 border-t border-slate-600 px-8 py-7 md:flex-row">
      <Link href="/">
        <WordMark />
        <span className="sr-only">Siphon Launchpad App</span>
      </Link>
      <nav aria-label="Footer">
        <ul className="flex gap-6">
          {settings.map((item) => (
            <li key={item}>
              <Link className="inline-flex min-h-11 items-center" href={""}>
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
}

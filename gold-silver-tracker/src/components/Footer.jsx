import { Download } from "lucide-react";

function Footer() {
  return (
    <footer className="mt-10 border-t border-amber-100 pt-6 text-center sm:mt-12">
      <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-stone-600">
        <span>Need to download videos?</span>

        <a
          href="https://downloadytvideo.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-semibold text-amber-700 underline-offset-4 transition hover:text-amber-800 hover:underline"
        >
          <Download size={15} />
          Download here
        </a>
      </p>
    </footer>
  );
}

export default Footer;

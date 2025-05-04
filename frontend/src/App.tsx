import { ArrowRightIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { toast } from "sonner"
import { isValidUrl } from "./lib/helperFunctions";

export default function App() {
  const [originalUrl, setOriginalUrl] = useState<string>(
    "https://www.google.com"
  );
  const [shortenedUrl, setShortenedUrl] = useState<string>(
    "https://www.google.com"
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  function handleClipboard(e: React.MouseEvent<HTMLButtonElement>) {
    setCopied(true);
    e.preventDefault();
    navigator.clipboard.writeText(shortenedUrl);
  }
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if(!e.currentTarget.url.value || !isValidUrl(e.currentTarget.url.value)) {
      toast.error("Please enter a valid URL");
      return
    };
    setFinished(false);
    setOriginalUrl(e.currentTarget.url.value);
    setLoading(true);
  }
  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }, [copied]);
  // simulating traffic
  useEffect(() => {
    const interval = setInterval(() => {
      if (loading) {
        setLoading(false);
        setFinished(true);
        setShortenedUrl(originalUrl)
        toast.success("Success!")
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [loading]);
  return (
    <div className="h-screen w-screen bg-zinc-50 flex flex-col items-center justify-center">
      <div className="lg:w-2/5 px-8 flex flex-col items-center gap-8 transition-all duration-200 ease-in">
        <div className="flex flex-col font-sans w-full">
          <p className="text-6xl">Shorten a loooong URL</p>
          <p className="text-zinc-500 text-6xl">With ease.</p>
          {/* <p className="mt-4 flex flex-row gap-2 items-center">
            Try it out <ArrowDownIcon className="w-4 h-4"></ArrowDownIcon>
          </p> */}
        </div>
        <form action="" onSubmit={handleSubmit} className="w-full">
          <label htmlFor="url">Paste your long link here:</label>
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 md:items-center">
            <input
              id="url"
              name="url"
              type="text"
              className="w-full h-12 px-2  mt-4 border-b border-zinc-300"
              placeholder="Enter a long URL"
            />
            <button
              type="submit"
              className="w-fit h-12 mt-4 flex flex-row gap-2 items-center  px-6 py-4 bg-black text-white"
            >
              {loading ? "Shortening..." : "Shorten"}{" "}
              <ArrowRightIcon className="w-4 h-4"></ArrowRightIcon>
            </button>
          </div>
        </form>
        {finished && (
          <>
            <p>Your shortened URL is ready!</p>
            <div className="bg-zinc-900 p-4 text-white flex flex-col w-full h-fit ">
              <div className="flex flex-row justify-between w-full">
                <a
                  className="break-all underline-offset-4 hover:underline w-fit text-2xl"
                  href={shortenedUrl}
                  target="_blank"
                >
                  {shortenedUrl}
                </a>
                <button
                  className="hidden md:flex flex-row gap-2 items-center bg-white text-black px-4 py-2"
                  onClick={handleClipboard}
                >
                  {copied ? "Copied!" : "Copy"}{" "}
                  <ClipboardIcon className="w-4 h-4"></ClipboardIcon>
                </button>
              </div>
              <p className="pt-4">Original URL:</p>
              <a
                className="break-all underline-offset-4 hover:underline w-fit"
                href={originalUrl}
                target="_blank"
              >
                {originalUrl}
              </a>
              <button
                className="flex md:hidden w-fit mt-4 flex-row gap-2 items-center bg-white text-black px-4 py-2"
                onClick={handleClipboard}
              >
                {copied ? "Copied!" : "Copy"}{" "}
                <ClipboardIcon className="w-4 h-4"></ClipboardIcon>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

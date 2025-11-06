export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="relative flex place-items-center">
        <h1 className="text-5xl font-bold">
          VALORAIPLUS OQCA Playground
        </h1>
      </div>

      <div className="mb-32 mt-16 grid text-center lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        <a
          href="https://research.valorai.plus/oqca"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Research{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Explore the research behind OQCA.
          </p>
        </a>

        <a
          href="https://github.com/valoraiplus/oqca-playground"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Deploy{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Instantly deploy your own OQCA playground.
          </p>
        </a>

        <a
          href="https://valorai.plus"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            VALORAIPLUS{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Learn more about the VALORAIPLUS ecosystem.
          </p>
        </a>

        <div
          className="group rounded-lg border border-transparent px-5 py-4"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Commander DG77.77X-Ξ
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Authority Confirmed
          </p>
        </div>
      </div>
    </main>
  );
}

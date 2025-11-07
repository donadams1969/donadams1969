import ValorDashboard from '@/components/valor-dashboard';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-900 text-white">
      <div className="relative flex place-items-center mb-8">
        <h1 className="text-4xl font-bold">
          VALORAIPLUS OQCA Playground
        </h1>
      </div>

      <ValorDashboard />

      <div className="text-center mt-8 text-gray-400">
        <p>Authority Confirmed: Commander DG77.77X-Ξ</p>
      </div>
    </main>
  );
}

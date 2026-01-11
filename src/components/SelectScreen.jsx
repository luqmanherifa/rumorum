export default function SelectScreen({ onCreateClick, onJoinClick }) {
  return (
    <main className="w-full h-screen flex flex-col justify-center items-center px-4 overflow-hidden">
      <div className="w-full max-w-md flex flex-col h-full justify-center">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-heading tracking-wide text-gray-700">
            Rumorum
          </h1>
          <p className="mt-2 text-gray-500">Buat atau gabung ke room</p>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={onCreateClick}
            className="h-24 rounded-2xl bg-blue-500 text-white text-xl font-bold active:scale-95 transition"
          >
            Buat Room
          </button>
          <button
            onClick={onJoinClick}
            className="h-24 rounded-2xl bg-yellow-500 text-white text-xl font-bold active:scale-95 transition"
          >
            Gabung Room
          </button>
        </div>
      </div>
    </main>
  );
}

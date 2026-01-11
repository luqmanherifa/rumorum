export function JoinRoomScreen({
  roomCode,
  setRoomCode,
  username,
  setUsername,
  error,
  onBack,
  onSubmit,
}) {
  return (
    <main className="h-screen w-full flex justify-center items-center overflow-hidden bg-white">
      <div className="w-full max-w-md h-full flex flex-col px-4 py-10">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="text-blue-500 font-semibold text-sm"
          >
            ← Kembali
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-700">
            Gabung ke Room
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            Masukkan kode room untuk bergabung
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 text-red-600 text-sm px-4 py-3">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-5 flex-1">
          <div>
            <label className="block text-sm font-bold mb-3 text-gray-700">
              Kode Room
            </label>
            <input
              className="w-full h-14 rounded-xl bg-gray-100 px-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              placeholder="gaming123"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-3 text-gray-700">
              Nama Anda
            </label>
            <input
              className="w-full h-14 rounded-xl bg-gray-100 px-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSubmit()}
              placeholder="Nama kamu"
            />
          </div>
        </div>

        <button
          onClick={onSubmit}
          className="mt-6 h-14 rounded-2xl bg-blue-500 text-white text-lg font-extrabold active:scale-95 transition"
        >
          Gabung ke Room
        </button>
      </div>
    </main>
  );
}

import { motion } from "framer-motion";
import { BackIcon, SparklesIcon } from "./icons";

export default function CreateRoomScreen({
  roomName,
  setRoomName,
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
      <div className="w-full max-w-md h-full flex flex-col px-5 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center mb-8"
        >
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Kembali"
          >
            <BackIcon className="w-5 h-5 fill-slate-500" />
          </motion.button>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-xl font-bold text-slate-800 mb-2">
            Buat Room Baru
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Buat ruangmu sendiri.
          </p>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-xl bg-red-50 border-2 border-red-200 text-red-600 text-sm px-4 py-3 font-medium"
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <div className="flex flex-col gap-6 flex-1">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <label className="block text-xs font-bold mb-2.5 text-slate-700 uppercase tracking-wide">
              Nama Room
            </label>
            <input
              className="w-full h-12 rounded-xl border-2 border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-whisper transition-colors"
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Nama room kamu"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <label className="block text-xs font-bold mb-2.5 text-slate-700 uppercase tracking-wide">
              Kode Room
            </label>
            <input
              className="w-full h-12 rounded-xl border-2 border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-whisper transition-colors"
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              placeholder="Kode room kamu"
            />
            <p className="mt-2 text-xs text-slate-500 font-medium">
              Buat kode untuk room ini
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <label className="block text-xs font-bold mb-2.5 text-slate-700 uppercase tracking-wide">
              Nama Anda
            </label>
            <input
              className="w-full h-12 rounded-xl border-2 border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-whisper transition-colors"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSubmit()}
              placeholder="Nama kamu"
            />
          </motion.div>
        </div>

        {/* Submit */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          whileTap={{ scale: 0.98 }}
          onClick={onSubmit}
          className="h-14 rounded-2xl bg-whisper text-sm font-bold uppercase tracking-wide text-white flex items-center justify-center gap-2.5"
        >
          <SparklesIcon className="w-5 h-5 fill-white" />
          Buat Room
        </motion.button>
      </div>
    </main>
  );
}

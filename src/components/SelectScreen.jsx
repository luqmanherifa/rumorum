import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LightningIcon,
  ChatBubbleIcon,
  ClockIcon,
  RumorumLogoIcon,
  InfoIcon,
  SparklesIcon,
  SmileIcon,
  CloseIcon,
} from "./icons";

export default function SelectScreen({ onCreateClick, onJoinClick }) {
  const [showModal, setShowModal] = useState(false);
  const [modalPage, setModalPage] = useState(0);

  const modalContent = [
    {
      title: "Terjadi Saat Mengetik",
      icon: <LightningIcon className="w-14 h-14 fill-rumor" />,
      text: "Rumorum adalah chat realtime. Setiap huruf yang kamu ketik terlihat, membuat percakapan terjadi bersamaan.",
    },
    {
      title: "Satu Balon Pesan",
      icon: <ChatBubbleIcon className="w-14 h-14 fill-whisper" />,
      text: "Di dalam satu room, setiap orang hanya punya satu balon pesan. Saat enter ditekan, pesan sebelumnya tergantikan.",
    },
    {
      title: "Hilang Begitu Saja",
      icon: <ClockIcon className="w-14 h-14 fill-echo" />,
      text: "Obrolan di Rumorum tidak disimpan. Percakapan hanya ada selama room aktif, lalu selesai tanpa riwayat atau jejak.",
    },
  ];

  const handleClose = () => {
    setShowModal(false);
    setTimeout(() => setModalPage(0), 300);
  };

  return (
    <main className="w-full h-screen flex flex-col justify-center items-center px-5 overflow-hidden bg-white">
      <div className="w-full max-w-md flex flex-col h-full justify-center">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12 text-center"
        >
          <div className="mb-6 flex justify-center">
            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <RumorumLogoIcon className="w-16 h-16 fill-rumor" />
            </motion.div>
          </div>

          <h1 className="text-3xl font-heading tracking-wide text-rumor font-extrabold mb-2">
            Rumorum
          </h1>
          <div className="flex items-center justify-center gap-1.5">
            <p className="text-sm text-slate-500 font-medium">
              Ruang cerita yang lewat begitu saja
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="transition-all group"
            >
              <InfoIcon className="w-4 h-4 fill-slate-400 group-hover:fill-rumor transition-colors" />
            </button>
          </div>
        </motion.div>

        {/* Buttons */}
        <div className="flex flex-col gap-3.5">
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            whileTap={{ scale: 0.97 }}
            onClick={onCreateClick}
            className="h-16 rounded-2xl bg-whisper transition-all text-base font-bold uppercase tracking-wide text-white"
          >
            <span className="flex items-center justify-center gap-2.5">
              <SparklesIcon className="w-5 h-5 fill-white" />
              Buat Room
            </span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            whileTap={{ scale: 0.97 }}
            onClick={onJoinClick}
            className="h-16 rounded-2xl bg-echo transition-all text-base font-bold uppercase tracking-wide text-white"
          >
            <span className="flex items-center justify-center gap-2.5">
              <SmileIcon className="w-5 h-5 fill-white" />
              Gabung Room
            </span>
          </motion.button>
        </div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="w-full pb-6 text-center"
      >
        <p className="text-xs text-slate-400 font-medium">
          © 2026{" "}
          <a
            href="https://github.com/luqmanherifa"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline transition-colors"
          >
            Luqman Herifa
          </a>
        </p>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center px-5 z-50"
            onClick={handleClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl w-full max-w-md p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="absolute top-5 right-5 p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <CloseIcon className="w-4 h-4 fill-slate-500" />
              </motion.button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={modalPage}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-center mb-8"
                >
                  <div className="flex justify-center mb-6">
                    {modalContent[modalPage].icon}
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-4">
                    {modalContent[modalPage].title}
                  </h2>
                  <p className="text-slate-600 text-base leading-relaxed px-2">
                    {modalContent[modalPage].text}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="mb-7">
                <div className="flex justify-center gap-2">
                  {modalContent.map((_, index) => (
                    <motion.div
                      key={index}
                      animate={{
                        width: index === modalPage ? 20 : 8,
                        backgroundColor:
                          index === modalPage ? "#475569" : "#cbd5e1",
                      }}
                      transition={{ duration: 0.3 }}
                      className="h-2 rounded-full"
                    ></motion.div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                {modalPage > 0 ? (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setModalPage(modalPage - 1)}
                    className="flex-1 h-12 rounded-xl text-base font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors uppercase flex items-center justify-center"
                  >
                    Kembali
                  </motion.button>
                ) : (
                  <div className="flex-1"></div>
                )}

                {modalPage < modalContent.length - 1 ? (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setModalPage(modalPage + 1)}
                    className="flex-1 h-12 rounded-xl text-base font-bold text-white bg-slate-700 hover:bg-slate-800 transition-colors uppercase flex items-center justify-center"
                  >
                    Lanjut
                  </motion.button>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleClose}
                    className="flex-1 h-12 rounded-xl text-base font-bold text-white bg-slate-700 hover:bg-slate-800 transition-colors uppercase flex items-center justify-center"
                  >
                    Tutup
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

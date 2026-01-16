import { useState } from "react";
import { motion } from "framer-motion";
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
        <div className="mb-12 text-center">
          <div className="mb-6 flex justify-center">
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
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

          <h1 className="text-4xl font-heading tracking-wide text-rumor font-extrabold">
            Rumorum
          </h1>
          <div className="mt-2 flex items-center justify-center gap-1.5">
            <p className="text-sm text-gray-400 font-medium">
              Ruang cerita yang lewat begitu saja
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="transition-all group"
            >
              <InfoIcon className="w-4 h-4 fill-gray-400 group-hover:fill-rumor transition-colors" />
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3.5">
          <button
            onClick={onCreateClick}
            className="group relative h-16 rounded-2xl bg-whisper active:scale-[0.97] transition-all text-base font-bold uppercase tracking-wide text-white overflow-hidden"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-active:opacity-10 transition-opacity"></div>

            <span className="relative flex items-center justify-center gap-2.5">
              <SparklesIcon className="w-5 h-5 fill-white" />
              Buat Room
            </span>
          </button>

          <button
            onClick={onJoinClick}
            className="group relative h-16 rounded-2xl bg-echo active:scale-[0.97] transition-all text-base font-bold uppercase tracking-wide text-white overflow-hidden"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-active:opacity-10 transition-opacity"></div>

            <span className="relative flex items-center justify-center gap-2.5">
              <SmileIcon className="w-5 h-5 fill-white" />
              Gabung Room
            </span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full pb-6 text-center">
        <p className="text-xs text-gray-400">
          © 2026{" "}
          <a
            href="https://github.com/luqmanherifa"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline transition-all"
          >
            Luqman Herifa
          </a>
        </p>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center px-5 z-50"
          onClick={handleClose}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <CloseIcon className="w-4 h-4 fill-gray-400" />
            </button>

            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                {modalContent[modalPage].icon}
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                {modalContent[modalPage].title}
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed px-1">
                {modalContent[modalPage].text}
              </p>
            </div>

            <div className="mb-5">
              <div className="flex justify-center gap-1.5">
                {modalContent.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all ${
                      index === modalPage
                        ? "w-4 bg-gray-600"
                        : "w-1.5 bg-gray-300"
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              {modalPage > 0 ? (
                <button
                  onClick={() => setModalPage(modalPage - 1)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors uppercase"
                >
                  Kembali
                </button>
              ) : (
                <div className="flex-1"></div>
              )}

              {modalPage < modalContent.length - 1 ? (
                <button
                  onClick={() => setModalPage(modalPage + 1)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-bold text-white bg-gray-600 hover:opacity-90 transition-opacity uppercase"
                >
                  Lanjut
                </button>
              ) : (
                <button
                  onClick={handleClose}
                  className="flex-1 py-2.5 rounded-lg text-sm font-bold text-white bg-gray-600 hover:opacity-90 transition-opacity uppercase"
                >
                  Tutup
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

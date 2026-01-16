import { useChatRoom } from "../hooks/useChatRoom";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RumorumLogoIcon } from "./icons";

export default function ChatRoom({ username, roomCode }) {
  const { roomInfo, allMessages, myMessage, updateMyMessage } = useChatRoom(
    username,
    roomCode
  );
  const myBubble = allMessages.find((m) => m.name === username);
  const otherBubbles = allMessages.filter((m) => m.name !== username);
  const chatEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [otherBubbles.length]);

  useEffect(() => {
    setIsTyping(myMessage.length > 0);
  }, [myMessage]);

  const getInitials = (name) => {
    return name?.charAt(0).toUpperCase() || "?";
  };

  const colors = [
    "bg-rumor",
    "bg-whisper",
    "bg-echo",
    "bg-violet-500",
    "bg-pink-500",
    "bg-amber-500",
  ];

  const getColorForUser = (name) => {
    const index = name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  return (
    <main className="h-screen w-full flex justify-center bg-slate-50">
      <div className="w-full max-w-md h-screen flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white border-b-2 border-slate-200"
        >
          <div className="px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <RumorumLogoIcon className="w-8 h-8 fill-rumor" />
                </motion.div>
                <div>
                  <h1 className="text-lg font-bold text-slate-800 leading-tight">
                    {roomInfo?.name || "..."}
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">
                    {otherBubbles.length + 1} orang aktif
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide font-bold">
                    Anda
                  </p>
                  <p className="text-xs font-bold text-slate-800">{username}</p>
                </div>
                <div
                  className={`h-10 w-10 rounded-full ${getColorForUser(
                    username
                  )} flex items-center justify-center text-white font-bold text-base select-none`}
                >
                  {getInitials(username)}
                </div>
              </div>
            </div>

            <div className="bg-slate-100 rounded-lg px-3 py-2 flex items-center justify-between">
              <span className="text-xs text-slate-600 font-medium">
                Kode Room
              </span>
              <span className="text-sm font-bold text-slate-800 tracking-wider">
                {roomCode}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* Your Message Bubble */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="sticky top-0 z-10"
          >
            <div className="bg-white rounded-2xl rounded-tr-sm border-2 border-whisper p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-7 w-7 rounded-full ${getColorForUser(
                      username
                    )} flex items-center justify-center text-white font-bold text-xs select-none`}
                  >
                    {getInitials(username)}
                  </div>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Pesan Anda
                  </span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9, rotate: 180 }}
                  type="button"
                  onClick={() => updateMyMessage("")}
                  disabled={!myMessage}
                  className={`h-7 w-7 rounded-full flex items-center justify-center transition-all ${
                    myMessage
                      ? "bg-whisper text-white hover:bg-whisper/80"
                      : "bg-slate-100 text-slate-300 cursor-not-allowed"
                  }`}
                  title="Reset"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 640"
                    className="h-3.5 w-3.5"
                    fill="currentColor"
                  >
                    <path d="M544.1 256L552 256C565.3 256 576 245.3 576 232L576 88C576 78.3 570.2 69.5 561.2 65.8C552.2 62.1 541.9 64.2 535 71L483.3 122.8C439 86.1 382 64 320 64C191 64 84.3 159.4 66.6 283.5C64.1 301 76.2 317.2 93.7 319.7C111.2 322.2 127.4 310 129.9 292.6C143.2 199.5 223.3 128 320 128C364.4 128 405.2 143 437.7 168.3L391 215C384.1 221.9 382.1 232.2 385.8 241.2C389.5 250.2 398.3 256 408 256L544.1 256zM573.5 356.5C576 339 563.8 322.8 546.4 320.3C529 317.8 512.7 330 510.2 347.4C496.9 440.4 416.8 511.9 320.1 511.9C275.7 511.9 234.9 496.9 202.4 471.6L249 425C255.9 418.1 257.9 407.8 254.2 398.8C250.5 389.8 241.7 384 232 384L88 384C74.7 384 64 394.7 64 408L64 552C64 561.7 69.8 570.5 78.8 574.2C87.8 577.9 98.1 575.8 105 569L156.8 517.2C201 553.9 258 576 320 576C449 576 555.7 480.6 573.4 356.5z" />
                  </svg>
                </motion.button>
              </div>

              <textarea
                value={myMessage}
                onChange={(e) => updateMyMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    updateMyMessage("");
                  }
                }}
                placeholder="Ketik sesuatu..."
                rows={3}
                className="w-full resize-none bg-slate-50 text-slate-800 placeholder:text-slate-400 rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:bg-slate-100 transition-colors border-2 border-transparent focus:border-whisper"
              />

              <div className="mt-2 flex items-center justify-between">
                <p className="text-[10px] text-slate-500 font-medium">
                  Enter untuk hapus pesan
                </p>
                <motion.div
                  animate={{ opacity: isTyping ? 1 : 0 }}
                  className="flex items-center gap-1"
                >
                  <div className="flex gap-0.5">
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                      className="w-1 h-1 rounded-full bg-whisper"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{
                        duration: 0.6,
                        delay: 0.2,
                        repeat: Infinity,
                      }}
                      className="w-1 h-1 rounded-full bg-whisper"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{
                        duration: 0.6,
                        delay: 0.4,
                        repeat: Infinity,
                      }}
                      className="w-1 h-1 rounded-full bg-whisper"
                    />
                  </div>
                  <span className="text-[10px] text-whisper font-bold">
                    Mengetik
                  </span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Others Messages */}
          <AnimatePresence>
            {otherBubbles.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mb-4 flex justify-center"
                >
                  <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 640"
                      className="w-8 h-8 fill-slate-400"
                    >
                      <path d="M224 256c-35.3 0-64-28.7-64-64s28.7-64 64-64s64 28.7 64 64s-28.7 64-64 64zm-96 55.2C54.7 338.3 0 403.1 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7c0-79.2-54.7-144-128-171.1V448c0 17.7-14.3 32-32 32H160c-17.7 0-32-14.3-32-32V311.2zM416 224c-35.3 0-64-28.7-64-64s28.7-64 64-64s64 28.7 64 64s-28.7 64-64 64zm96 32c56.8 0 102.8 43.2 107.2 98.4L624 368v80c0 17.7-14.3 32-32 32H544c-17.7 0-32-14.3-32-32V368l4.8-13.6C521.2 299.2 567.2 256 624 256H512z" />
                    </svg>
                  </div>
                </motion.div>
                <p className="text-base font-bold text-slate-700 mb-2">
                  Menunggu Teman...
                </p>
                <p className="text-sm text-slate-500 font-medium">
                  Bagikan kode room untuk memulai chat
                </p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {otherBubbles.map((msg, index) => (
                  <motion.div
                    key={`${msg.name}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <div
                      className={`h-9 w-9 rounded-full ${getColorForUser(
                        msg.name
                      )} flex items-center justify-center text-white font-bold text-sm select-none flex-shrink-0`}
                    >
                      {getInitials(msg.name)}
                    </div>
                    <div className="flex-1">
                      <div className="bg-white rounded-2xl rounded-tl-sm border-2 border-slate-200 px-4 py-3">
                        <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
                          {msg.name}
                        </p>
                        <AnimatePresence mode="wait">
                          {msg.text ? (
                            <motion.p
                              key={msg.text}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-sm font-medium text-slate-800 leading-relaxed"
                            >
                              {msg.text}
                            </motion.p>
                          ) : (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex gap-1"
                            >
                              <motion.div
                                animate={{
                                  scale: [1, 1.2, 1],
                                  opacity: [0.3, 0.8, 0.3],
                                }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="w-2 h-2 rounded-full bg-slate-400"
                              />
                              <motion.div
                                animate={{
                                  scale: [1, 1.2, 1],
                                  opacity: [0.3, 0.8, 0.3],
                                }}
                                transition={{
                                  duration: 1,
                                  delay: 0.2,
                                  repeat: Infinity,
                                }}
                                className="w-2 h-2 rounded-full bg-slate-400"
                              />
                              <motion.div
                                animate={{
                                  scale: [1, 1.2, 1],
                                  opacity: [0.3, 0.8, 0.3],
                                }}
                                transition={{
                                  duration: 1,
                                  delay: 0.4,
                                  repeat: Infinity,
                                }}
                                className="w-2 h-2 rounded-full bg-slate-400"
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={chatEndRef} />
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

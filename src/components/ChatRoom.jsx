import { useChatRoom } from "../hooks/useChatRoom";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RumorumLogoIcon,
  CopyIcon,
  PeopleIcon,
  CheckIcon,
  ResetIcon,
  UsersIcon,
} from "./icons";

export default function ChatRoom({ username, roomCode }) {
  const { roomInfo, allMessages, myMessage, updateMyMessage } = useChatRoom(
    username,
    roomCode
  );
  const myBubble = allMessages.find((m) => m.name === username);
  const otherBubbles = allMessages.filter((m) => m.name !== username);
  const chatEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [otherBubbles.length]);

  useEffect(() => {
    setIsTyping(myMessage.length > 0);
  }, [myMessage]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

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
                  <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                    <PeopleIcon className="w-3 h-3 fill-slate-500" />
                    <span>{otherBubbles.length + 1} orang</span>
                  </div>
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

            <div className="bg-white border-2 border-slate-200 rounded-xl px-3 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 font-semibold">
                  Kode Room
                </span>
                <span className="text-sm font-bold text-slate-800 tracking-wider">
                  {roomCode}
                </span>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleCopyCode}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                title="Salin kode"
              >
                {copied ? (
                  <CheckIcon className="w-4 h-4 fill-green-600" />
                ) : (
                  <CopyIcon className="w-4 h-4 fill-slate-500" />
                )}
              </motion.button>
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
            <div className="bg-white rounded-2xl rounded-tr-sm border-2 border-whisper p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`h-6 w-6 rounded-full ${getColorForUser(
                      username
                    )} flex items-center justify-center text-white font-bold text-xs select-none`}
                  >
                    {getInitials(username)}
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">
                    Pesan Anda
                  </span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9, rotate: 180 }}
                  type="button"
                  onClick={() => updateMyMessage("")}
                  disabled={!myMessage}
                  className={`h-6 w-6 rounded-full flex items-center justify-center transition-all ${
                    myMessage
                      ? "bg-whisper text-white hover:bg-whisper/80"
                      : "bg-slate-100 text-slate-300 cursor-not-allowed"
                  }`}
                  title="Reset"
                >
                  <ResetIcon className="h-3 w-3" />
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
                rows={2}
                className="w-full resize-none bg-slate-50 text-slate-800 placeholder:text-slate-400 rounded-lg px-2.5 py-2 text-sm font-medium focus:outline-none focus:bg-slate-100 transition-colors border-2 border-transparent focus:border-whisper"
              />

              <div className="mt-1.5 flex items-center justify-between">
                <p className="text-[9px] text-slate-500 font-medium">
                  Enter untuk hapus
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
                  <span className="text-[9px] text-whisper font-bold">
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
                    <UsersIcon className="w-8 h-8 fill-slate-400" />
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
              <div className="space-y-2.5">
                {otherBubbles.map((msg, index) => (
                  <div
                    key={`${msg.name}-${index}`}
                    className="flex items-start gap-2"
                  >
                    <div
                      className={`h-8 w-8 rounded-full ${getColorForUser(
                        msg.name
                      )} flex items-center justify-center text-white font-bold text-xs select-none flex-shrink-0`}
                    >
                      {getInitials(msg.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="bg-white rounded-2xl rounded-tl-sm border-2 border-slate-200 px-3 py-2.5">
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                          {msg.name}
                        </p>
                        {msg.text ? (
                          <p className="text-sm font-medium text-slate-800 leading-relaxed break-words">
                            {msg.text}
                          </p>
                        ) : (
                          <div className="flex gap-1">
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
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
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

import { useEffect, useState } from "react";
import { ref, onValue, set, onDisconnect, get } from "firebase/database";
import { db } from "./lib/firebase";

export default function App() {
  const [step, setStep] = useState("select");
  const [roomCode, setRoomCode] = useState("");
  const [roomName, setRoomName] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleCreateRoom = async () => {
    if (!roomName.trim() || !roomCode.trim() || !username.trim()) {
      setError("Nama room, kode room, dan nama Anda harus diisi!");
      return;
    }

    const code = roomCode.trim();
    const roomRef = ref(db, `rooms/${code}/info`);

    const snapshot = await get(roomRef);
    if (snapshot.exists()) {
      setError("Kode room sudah digunakan! Gunakan kode lain.");
      return;
    }

    const now = new Date();
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Jakarta",
    };
    const createdAt = now.toLocaleString("id-ID", options);

    await set(roomRef, {
      name: roomName.trim(),
      createdAt: createdAt,
    });

    setRoomCode(code);
    setStep("chat");
  };

  const handleJoinRoom = async () => {
    if (!roomCode.trim() || !username.trim()) {
      setError("Kode room dan nama Anda harus diisi!");
      return;
    }

    const code = roomCode.trim();
    const roomRef = ref(db, `rooms/${code}/info`);
    const snapshot = await get(roomRef);

    if (!snapshot.exists()) {
      setError("Room tidak ditemukan! Periksa kode room.");
      return;
    }

    setRoomCode(code);
    setStep("chat");
  };

  if (step === "select") {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-pink-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Chat Room</h1>
          <p className="text-gray-600 mb-6">
            Pilih untuk membuat atau bergabung ke room
          </p>

          <button
            onClick={() => setStep("create")}
            className="w-full px-6 py-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition font-medium text-lg"
          >
            🏗️ Buat Room Baru
          </button>

          <button
            onClick={() => setStep("join")}
            className="w-full px-6 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium text-lg"
          >
            🚪 Gabung ke Room
          </button>
        </div>
      </main>
    );
  }

  if (step === "create") {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-pink-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <button
            onClick={() => {
              setStep("select");
              setError("");
            }}
            className="text-gray-600 hover:text-gray-800 mb-4"
          >
            ← Kembali
          </button>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Buat Room Baru
          </h1>
          <p className="text-gray-600 mb-6">
            Isi detail untuk membuat room chat
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Room
              </label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Misal: Room Gaming"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kode Room
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="gaming123, belajar, dll"
              />
              <p className="text-xs text-gray-500 mt-1">
                Buat kode unik untuk room Anda (bebas)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Anda
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateRoom()}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Nama Anda..."
              />
            </div>

            <button
              onClick={handleCreateRoom}
              className="w-full px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition font-medium"
            >
              Buat Room & Masuk
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (step === "join") {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <button
            onClick={() => {
              setStep("select");
              setError("");
            }}
            className="text-gray-600 hover:text-gray-800 mb-4"
          >
            ← Kembali
          </button>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Gabung ke Room
          </h1>
          <p className="text-gray-600 mb-6">
            Masukkan kode room untuk bergabung
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kode Room
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="gaming123, belajar, dll"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Anda
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleJoinRoom()}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nama Anda..."
              />
            </div>

            <button
              onClick={handleJoinRoom}
              className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
            >
              Gabung ke Room
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (step === "chat") {
    return <ChatRoom username={username} roomCode={roomCode} />;
  }
}

function ChatRoom({ username, roomCode }) {
  const { roomInfo, allMessages, myMessage, updateMyMessage } = useChatRoom(
    username,
    roomCode
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {roomInfo?.name || "Loading..."}
              </h1>
              <p className="text-gray-600">
                Logged in as:{" "}
                <span className="font-semibold text-blue-600">{username}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Kode Room:</p>
              <p className="text-2xl font-mono font-bold text-purple-600">
                {roomCode}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg space-y-3">
          <h2 className="font-semibold text-gray-700">Pesan Anda</h2>
          <textarea
            value={myMessage}
            onChange={(e) => updateMyMessage(e.target.value)}
            className="w-full h-32 p-4 border-2 border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ketik pesan Anda di sini..."
          />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg space-y-4">
          <h2 className="font-semibold text-gray-700 text-lg">
            Semua Pesan ({allMessages.length})
          </h2>

          {allMessages.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Belum ada pesan...</p>
          ) : (
            <div className="space-y-3">
              {allMessages.map((msg) => (
                <div
                  key={msg.name}
                  className={`p-4 rounded-lg ${
                    msg.name === username
                      ? "bg-blue-50 border-2 border-blue-200"
                      : "bg-gray-50 border-2 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        msg.name === username ? "bg-blue-500" : "bg-gray-400"
                      }`}
                    />
                    <span
                      className={`font-semibold ${
                        msg.name === username
                          ? "text-blue-700"
                          : "text-gray-700"
                      }`}
                    >
                      {msg.name}
                      {msg.name === username && " (Anda)"}
                    </span>
                  </div>
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {msg.text || (
                      <span className="text-gray-400 italic">
                        Belum ada pesan
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function useChatRoom(username, roomCode) {
  const [roomInfo, setRoomInfo] = useState(null);
  const [allMessages, setAllMessages] = useState([]);
  const [myMessage, setMyMessage] = useState("");

  const roomInfoRef = ref(db, `rooms/${roomCode}/info`);
  const fieldsRef = ref(db, `rooms/${roomCode}/fields`);
  const myFieldRef = ref(db, `rooms/${roomCode}/fields/${username}`);

  useEffect(() => {
    const unsubscribe = onValue(roomInfoRef, (snapshot) => {
      setRoomInfo(snapshot.val());
    });
    return () => unsubscribe();
  }, [roomCode]);

  useEffect(() => {
    const unsubscribe = onValue(fieldsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messages = Object.keys(data).map((name) => ({
          name,
          text: data[name],
        }));
        setAllMessages(messages);
      } else {
        setAllMessages([]);
      }
    });

    return () => unsubscribe();
  }, [roomCode]);

  useEffect(() => {
    const memberRef = ref(db, `rooms/${roomCode}/members/${username}`);

    const now = new Date();
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Jakarta",
    };
    const joinedAt = now.toLocaleString("id-ID", options);

    set(memberRef, {
      name: username,
      joinedAt: joinedAt,
    });

    set(myFieldRef, "").then(() => {
      onDisconnect(myFieldRef).remove();
    });

    const unsubscribe = onValue(myFieldRef, (snapshot) => {
      const value = snapshot.val();
      setMyMessage(value || "");
    });

    return () => unsubscribe();
  }, [username, roomCode]);

  const updateMyMessage = (value) => {
    setMyMessage(value);
    set(myFieldRef, value);
  };

  return { roomInfo, allMessages, myMessage, updateMyMessage };
}

import { useEffect, useState } from "react";
import { ref, onValue, set, onDisconnect, get } from "firebase/database";
import { db } from "./lib/firebase";

const generateDeviceFingerprint = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.textBaseline = "top";
  ctx.font = "14px Arial";
  ctx.fillText("fingerprint", 2, 2);
  const canvasFingerprint = canvas.toDataURL().slice(-50);

  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset(),
    canvasFingerprint,
    navigator.hardwareConcurrency || "unknown",
    navigator.platform,
  ].join("|");

  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return "device_" + Math.abs(hash).toString(36);
};

const DEVICE_ID = generateDeviceFingerprint();

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
    const roomRef = ref(db, `rooms/${code}/room`);

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
    const roomRef = ref(db, `rooms/${code}/room`);
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
      <main>
        <div className="container">
          <div className="card">
            <h1>Chat Room</h1>
            <p>Pilih untuk membuat atau bergabung ke room</p>

            <button className="btn-primary" onClick={() => setStep("create")}>
              🏗️ Buat Room Baru
            </button>

            <button className="btn-secondary" onClick={() => setStep("join")}>
              🚪 Gabung ke Room
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (step === "create") {
    return (
      <main>
        <div className="container">
          <div className="card">
            <button
              className="btn-back"
              onClick={() => {
                setStep("select");
                setError("");
              }}
            >
              ← Kembali
            </button>

            <h1>Buat Room Baru</h1>
            <p>Isi detail untuk membuat room chat</p>

            {error && <div className="error">{error}</div>}

            <div>
              <label>Nama Room</label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Misal: Room Gaming"
              />

              <label>Kode Room</label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="gaming123, belajar, dll"
              />
              <p className="text-small">
                Buat kode unik untuk room Anda (bebas)
              </p>

              <label>Nama Anda</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateRoom()}
                placeholder="Nama Anda..."
              />

              <button className="btn-primary" onClick={handleCreateRoom}>
                Buat Room & Masuk
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (step === "join") {
    return (
      <main>
        <div className="container">
          <div className="card">
            <button
              className="btn-back"
              onClick={() => {
                setStep("select");
                setError("");
              }}
            >
              ← Kembali
            </button>

            <h1>Gabung ke Room</h1>
            <p>Masukkan kode room untuk bergabung</p>

            {error && <div className="error">{error}</div>}

            <div>
              <label>Kode Room</label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="gaming123, belajar, dll"
              />

              <label>Nama Anda</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleJoinRoom()}
                placeholder="Nama Anda..."
              />

              <button className="btn-primary" onClick={handleJoinRoom}>
                Gabung ke Room
              </button>
            </div>
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
    <main>
      <div className="container">
        <div className="card">
          <div className="flex-between">
            <div>
              <h1>{roomInfo?.name || "Loading..."}</h1>
              <p>
                Logged in as: <span className="username">{username}</span>
              </p>
            </div>
            <div>
              <p className="text-small">Kode Room:</p>
              <p className="room-code">{roomCode}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex-between">
            <h2>Pesan Anda</h2>
            <span className="text-small">Tekan Enter untuk hapus</span>
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
            placeholder="Ketik pesan Anda di sini... (Enter untuk hapus, Shift+Enter untuk baris baru)"
          />
        </div>

        <div className="card">
          <h2>Semua Pesan ({allMessages.length})</h2>

          {allMessages.length === 0 ? (
            <p className="empty-state">Belum ada pesan...</p>
          ) : (
            <div>
              {allMessages.map((msg) => (
                <div
                  key={msg.name}
                  className={`message-box ${
                    msg.name === username ? "own" : ""
                  }`}
                >
                  <div className="message-header">
                    <div
                      className={`dot ${msg.name === username ? "own" : ""}`}
                    />
                    <span className="username">
                      {msg.name}
                      {msg.name === username && " (Anda)"}
                    </span>
                  </div>
                  <p>
                    {msg.text || (
                      <span className="text-small">Belum ada pesan</span>
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

  const roomInfoRef = ref(db, `rooms/${roomCode}/room`);
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
      deviceId: DEVICE_ID,
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

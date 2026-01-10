import { useEffect, useState } from "react";
import { ref, onValue, set, onDisconnect } from "firebase/database";
import { db } from "./lib/firebase";

export default function App() {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    if (username.trim()) {
      setIsLoggedIn(true);
    }
  };

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Chat Room</h1>
          <p className="text-gray-600 mb-6">Masukkan nama untuk bergabung</p>

          <div className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nama Anda..."
              autoFocus
            />
            <button
              onClick={handleLogin}
              className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
            >
              Masuk
            </button>
          </div>
        </div>
      </main>
    );
  }

  return <ChatRoom username={username} />;
}

function ChatRoom({ username }) {
  const { allMessages, myMessage, updateMyMessage } = useChatRoom(username);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800">Chat Room</h1>
          <p className="text-gray-600">
            Logged in as:{" "}
            <span className="font-semibold text-blue-600">{username}</span>
          </p>
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
          <h2 className="font-semibold text-gray-700 text-lg">Semua Pesan</h2>

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

function useChatRoom(username) {
  const [allMessages, setAllMessages] = useState([]);
  const [myMessage, setMyMessage] = useState("");

  const fieldsRef = ref(db, "fields");
  const myFieldRef = ref(db, `fields/${username}`);

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
  }, []);

  useEffect(() => {
    set(myFieldRef, "").then(() => {
      onDisconnect(myFieldRef).remove();
    });

    const unsubscribe = onValue(myFieldRef, (snapshot) => {
      const value = snapshot.val();
      setMyMessage(value || "");
    });

    return () => unsubscribe();
  }, [username]);

  const updateMyMessage = (value) => {
    setMyMessage(value);
    set(myFieldRef, value);
  };

  return { allMessages, myMessage, updateMyMessage };
}

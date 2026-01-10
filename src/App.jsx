import { useEffect, useState } from "react";
import { ref, onValue, set } from "firebase/database";
import { db } from "./lib/firebase";

export default function App() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-xl space-y-6">
        <h1 className="text-xl font-semibold">Realtime Chat Room</h1>

        <RealtimeField label="Field A" path="fields/fieldA" />
        <RealtimeField label="Field B" path="fields/fieldB" />
      </div>
    </main>
  );
}

function RealtimeField({ label, path }) {
  const { text, updateText } = useRealtimeText(path);

  return (
    <div className="space-y-2">
      <label className="font-medium">{label}</label>
      <textarea
        value={text}
        onChange={(e) => updateText(e.target.value)}
        className="w-full h-32 p-3 border rounded resize-none"
        placeholder={`Ketik untuk ${label}`}
      />
    </div>
  );
}

function useRealtimeText(path) {
  const [text, setText] = useState("");
  const textRef = ref(db, path);

  useEffect(() => {
    const unsubscribe = onValue(textRef, (snapshot) => {
      const value = snapshot.val();
      if (value !== null) setText(value);
    });

    return () => unsubscribe();
  }, [path]);

  const updateText = (value) => {
    setText(value);
    set(textRef, value);
  };

  return { text, updateText };
}

import { useEffect, useState } from "react";
import { ref, onValue, set, remove } from "firebase/database";
import { db } from "./lib/firebase";

export default function App() {
  const { fields, addField, removeField } = useDynamicFields();
  const [newFieldName, setNewFieldName] = useState("");

  const handleAddField = () => {
    if (newFieldName.trim()) {
      addField(newFieldName.trim());
      setNewFieldName("");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-xl space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Realtime Chat Room
        </h1>

        <div className="bg-white p-4 rounded-lg shadow space-y-3">
          <h2 className="font-medium text-gray-700">Tambah Field Baru</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddField()}
              className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nama field baru (misal: Field C)"
            />
            <button
              onClick={handleAddField}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Tambah
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {fields.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Belum ada field. Tambahkan field baru di atas.
            </p>
          ) : (
            fields.map((fieldName) => (
              <RealtimeField
                key={fieldName}
                label={fieldName}
                path={`fields/${fieldName}`}
                onRemove={() => removeField(fieldName)}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}

function RealtimeField({ label, path, onRemove }) {
  const { text, updateText } = useRealtimeText(path);

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-2">
      <div className="flex items-center justify-between">
        <label className="font-medium text-gray-700">{label}</label>
        <button
          onClick={onRemove}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Hapus
        </button>
      </div>
      <textarea
        value={text}
        onChange={(e) => updateText(e.target.value)}
        className="w-full h-32 p-3 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={`Ketik untuk ${label}`}
      />
    </div>
  );
}

function useDynamicFields() {
  const [fields, setFields] = useState([]);
  const fieldsRef = ref(db, "fields");

  useEffect(() => {
    console.log("🔵 Mulai listening ke Firebase...");

    const unsubscribe = onValue(
      fieldsRef,
      (snapshot) => {
        const data = snapshot.val();
        console.log("🔥 Data dari Firebase:", data);

        if (data) {
          const fieldNames = Object.keys(data);
          console.log("✅ Fields ditemukan:", fieldNames);
          setFields(fieldNames);
        } else {
          console.log("⚠️ Tidak ada data di Firebase");
          setFields([]);
        }
      },
      (error) => {
        console.error("❌ Error Firebase:", error);
      }
    );

    return () => {
      console.log("🔴 Berhenti listening");
      unsubscribe();
    };
  }, []);

  const addField = (fieldName) => {
    console.log("➕ Menambah field:", fieldName);
    const fieldRef = ref(db, `fields/${fieldName}`);
    set(fieldRef, "");
  };

  const removeField = (fieldName) => {
    console.log("➖ Menghapus field:", fieldName);
    const fieldRef = ref(db, `fields/${fieldName}`);
    remove(fieldRef);
  };

  return { fields, addField, removeField };
}

function useRealtimeText(path) {
  const [text, setText] = useState("");
  const textRef = ref(db, path);

  useEffect(() => {
    const unsubscribe = onValue(textRef, (snapshot) => {
      const value = snapshot.val();
      setText(value || "");
    });

    return () => unsubscribe();
  }, [path]);

  const updateText = (value) => {
    setText(value);
    set(textRef, value);
  };

  return { text, updateText };
}

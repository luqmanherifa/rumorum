import { useChatRoom } from "../hooks/useChatRoom";
export default function ChatRoom({ username, roomCode }) {
  const { roomInfo, allMessages, myMessage, updateMyMessage } = useChatRoom(
    username,
    roomCode
  );
  const myBubble = allMessages.find((m) => m.name === username);
  const otherBubbles = allMessages.filter((m) => m.name !== username);

  return (
    <main className="h-screen w-full flex justify-center bg-white overflow-hidden">
      <div className="w-full max-w-md h-screen flex flex-col relative">
        {/* Fixed Header */}
        <div className="absolute top-0 left-0 right-0 h-20 px-4 flex items-center justify-between border-b border-gray-200 bg-white z-20">
          <div className="flex flex-col leading-tight">
            <h1 className="text-base font-bold text-gray-700">
              {roomInfo?.name || "Loading..."}
            </h1>
            <p className="text-[11px] text-gray-700">
              Kode:{" "}
              <span className="font-medium text-gray-700">{roomCode}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-col text-right leading-tight">
              <p className="text-[11px] text-gray-700">Anda</p>
              <p className="text-xs font-semibold text-gray-700">{username}</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm select-none">
              {username?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Scrollable Chat Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 mt-20 mb-24">
          {myBubble && (
            <div className="sticky top-2 z-10 flex justify-end mb-4">
              <div className="max-w-[80%] bg-blue-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm transition-colors">
                <p className="text-[10px] opacity-80 mb-1">Anda</p>
                {myBubble.text ? (
                  myBubble.text
                ) : (
                  <span className="text-xs opacity-70">(mengetik...)</span>
                )}
              </div>
            </div>
          )}
          <div className="flex flex-col gap-3">
            {otherBubbles.length === 0 ? (
              <p className="text-center text-sm text-gray-500 mt-10">
                Menunggu user lain bergabung…
              </p>
            ) : (
              otherBubbles.map((msg, index) => (
                <div key={index} className="flex justify-start">
                  <div className="max-w-[85%] bg-gray-100 text-gray-700 rounded-2xl rounded-tl-sm px-4 py-3 text-sm transition-colors">
                    <p className="text-[10px] font-bold text-gray-700 mb-1">
                      {msg.name}
                    </p>
                    {msg.text ? (
                      msg.text
                    ) : (
                      <span className="text-xs text-gray-700">(diam)</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Fixed Input */}
        <div className="absolute bottom-0 left-0 right-0 px-3 py-5 border-t border-gray-200 bg-white z-20">
          <div className="flex items-center space-x-2">
            <textarea
              value={myMessage}
              onChange={(e) => updateMyMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  updateMyMessage("");
                }
              }}
              placeholder="Ketik sesuatu…"
              rows={1}
              className="flex-1 resize-none rounded-2xl bg-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
              type="button"
              onClick={() => updateMyMessage("")}
              disabled={!myMessage}
              className={`
        h-10 w-10
        rounded-full
        flex items-center justify-center
        transition
        ${
          myMessage
            ? "bg-blue-100 text-blue-500 hover:bg-blue-200 active:scale-95"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }
      `}
              title="Reset teks"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                className="h-5 w-5"
                fill="currentColor"
              >
                <path d="M544.1 256L552 256C565.3 256 576 245.3 576 232L576 88C576 78.3 570.2 69.5 561.2 65.8C552.2 62.1 541.9 64.2 535 71L483.3 122.8C439 86.1 382 64 320 64C191 64 84.3 159.4 66.6 283.5C64.1 301 76.2 317.2 93.7 319.7C111.2 322.2 127.4 310 129.9 292.6C143.2 199.5 223.3 128 320 128C364.4 128 405.2 143 437.7 168.3L391 215C384.1 221.9 382.1 232.2 385.8 241.2C389.5 250.2 398.3 256 408 256L544.1 256zM573.5 356.5C576 339 563.8 322.8 546.4 320.3C529 317.8 512.7 330 510.2 347.4C496.9 440.4 416.8 511.9 320.1 511.9C275.7 511.9 234.9 496.9 202.4 471.6L249 425C255.9 418.1 257.9 407.8 254.2 398.8C250.5 389.8 241.7 384 232 384L88 384C74.7 384 64 394.7 64 408L64 552C64 561.7 69.8 570.5 78.8 574.2C87.8 577.9 98.1 575.8 105 569L156.8 517.2C201 553.9 258 576 320 576C449 576 555.7 480.6 573.4 356.5z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

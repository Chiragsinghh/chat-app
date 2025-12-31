import { useState, useRef } from "react";
import { Mic, Send, Image, Square } from "lucide-react";
import { useChatStore } from "../store/useChatstore";

const MessageInput = () => {
  const { sendMessage, selectedUser, isSendingMessage } = useChatStore();
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [recording, setRecording] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleSend = async () => {
    if (!text.trim() && !image) return;

    await sendMessage({
      receiverId: selectedUser._id,
      text,
      image,
    });

    setText("");
    setImage(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setImage(reader.result);
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      audioChunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onload = async () => {
        await sendMessage({
          receiverId: selectedUser._id,
          audio: reader.result,
        });
      };
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div className="p-4 border-t border-base-300 bg-base-100">
      {image && (
        <div className="mb-3">
          <img src={image} className="max-w-[150px] rounded-lg" />
        </div>
      )}

      <div className="flex items-center gap-2">
        <label className="btn btn-ghost btn-circle">
          <Image size={20} />
          <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
        </label>

        <input
          type="text"
          className="input input-bordered flex-1"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        {!recording ? (
          <button onClick={startRecording} className="btn btn-ghost btn-circle">
            <Mic size={20} />
          </button>
        ) : (
          <button onClick={stopRecording} className="btn btn-error btn-circle">
            <Square size={20} />
          </button>
        )}

        <button
          onClick={handleSend}
          disabled={isSendingMessage}
          className="btn btn-primary btn-circle"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;

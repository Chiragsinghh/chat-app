import { useState, useRef } from "react";
import { Mic, Send, Image, Square, X } from "lucide-react";
import { useChatStore } from "../store/useChatStore"; 
import toast from "react-hot-toast";

const MessageInput = () => {
  // 1. Changed selectedUser to selectedChat to match the updated store
  const { sendMessage, selectedChat } = useChatStore();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [recording, setRecording] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    await sendMessage({
      text: text.trim(),
      image: imagePreview,
    });

    setText("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
        return toast.error("Please select an image file");
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setImagePreview(reader.result);
  };

  const startRecording = async () => {
    try {
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
            audio: reader.result,
          });
        };
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      toast.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <div className="p-4 bg-white/40 backdrop-blur-md border-t border-white/20">
      {/* Image Preview Area */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img src={imagePreview} className="size-20 object-cover rounded-2xl border-2 border-white shadow-md" alt="Preview" />
            <button
              onClick={() => setImagePreview(null)}
              className="absolute -top-2 -right-2 bg-error text-white rounded-full p-1 shadow-lg"
              type="button"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSend} className="flex items-center gap-3">
        {/* Attachment Button */}
        <div className="flex items-center">
            <input 
                type="file" 
                accept="image/*" 
                hidden 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
            />
            <button
                type="button"
                className={`btn btn-circle btn-ghost ${imagePreview ? "text-[#615EF0]" : "text-zinc-400"}`}
                onClick={() => fileInputRef.current?.click()}
            >
                <Image size={22} />
            </button>
        </div>

        {/* Text Input */}
        <div className="flex-1 relative">
            <input
                type="text"
                className="w-full bg-[#F3F3F9] border-none rounded-[1.5rem] py-3 px-6 text-sm focus:ring-2 focus:ring-[#615EF0]/20 transition-all outline-none"
                placeholder="Type your message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
        </div>

        {/* Voice Recording / Send Button */}
        <div className="flex items-center gap-2">
            {!text.trim() && !imagePreview ? (
                recording ? (
                    <button type="button" onClick={stopRecording} className="btn btn-error btn-circle animate-pulse">
                        <Square size={20} />
                    </button>
                ) : (
                    <button type="button" onClick={startRecording} className="btn btn-ghost btn-circle text-zinc-400">
                        <Mic size={22} />
                    </button>
                )
            ) : (
                <button
                    type="submit"
                    className="btn bg-[#615EF0] hover:bg-[#4e4bc7] text-white btn-circle border-none shadow-lg shadow-indigo-200"
                >
                    <Send size={18} />
                </button>
            )}
        </div>
      </form>
    </div>
  );
};

export default MessageInput;import { useState, useRef } from "react";
import { Mic, Send, Image, Square } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

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

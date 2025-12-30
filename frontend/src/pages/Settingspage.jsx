import { Send } from "lucide-react";

const SettingsPage = () => {
  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4">Settings</h2>

        <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Chat Preview</h3>
          <div className="bg-gray-100 rounded-xl shadow-sm overflow-hidden">
            {/* Chat Header */}
            <div className="px-4 py-3 border-b border-gray-300 bg-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium">
                J
              </div>
              <div>
                <h3 className="font-medium text-sm">John Doe</h3>
                <p className="text-xs text-gray-600">Online</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto">
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-xl p-3 shadow-sm bg-white text-gray-800 rounded-bl-none">
                  Hey! How's it going?
                  <p className="text-[10px] mt-1 text-gray-500">12:00 PM</p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-xl p-3 shadow-sm bg-indigo-500 text-white rounded-br-none">
                  I'm doing great! Just working on some new features.
                  <p className="text-[10px] mt-1 text-indigo-100/70">12:00 PM</p>
                </div>
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-300">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="input input-bordered flex-1 text-sm h-10"
                  placeholder="Type a message..."
                  value="This is a preview"
                  readOnly
                />
                <button className="btn btn-primary h-10 min-h-0">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

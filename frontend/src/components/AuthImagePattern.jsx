import { MessageSquare, Sparkles } from "lucide-react";

const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-10">
      
      {/* Floating Card */}
      <div
        className="
          relative w-full max-w-md rounded-[2.75rem] overflow-hidden
          animate-float-slow
          shadow-[0_40px_80px_-20px_rgba(79,70,229,0.45)]
        "
        style={{ transformStyle: "preserve-3d" }}
      >
        
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600" />

        {/* Ambient glow */}
        <div className="absolute inset-0 rounded-[2.75rem] ring-1 ring-white/30" />

        {/* Light reflection */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/15 via-transparent to-transparent" />

        {/* Floating highlights */}
        <div className="absolute -top-28 -left-28 w-72 h-72 bg-white/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-2xl" />

        {/* Content */}
        <div className="relative z-10 px-10 py-14 text-center text-white">
          
          {/* Icon */}
          <div className="mx-auto mb-6 w-14 h-14 rounded-2xl bg-white/25 backdrop-blur-md flex items-center justify-center shadow-lg">
            <MessageSquare className="w-7 h-7" />
          </div>

          <h2 className="text-2xl font-semibold mb-3">
            {title}
          </h2>

          <p className="text-white/80 text-sm mb-8 leading-relaxed">
            {subtitle}
          </p>

          {/* Feature bullets */}
          <div className="space-y-3 text-sm text-white/90">
            <div className="flex items-center justify-center gap-2">
              <Sparkles size={14} />
              Real-time messaging
            </div>
            <div className="flex items-center justify-center gap-2">
              <Sparkles size={14} />
              Secure conversations
            </div>
            <div className="flex items-center justify-center gap-2">
              <Sparkles size={14} />
              Modern experience
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthImagePattern;



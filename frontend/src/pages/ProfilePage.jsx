import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="min-h-screen pt-20 bg-base-200">
      <div className="max-w-3xl mx-auto px-4 py-10">
        
        {/* Main Card */}
        <div className="bg-base-100 rounded-2xl shadow-xl border border-base-300 p-8 space-y-10">

          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="mt-2 text-base-content/60">
              Manage your personal information
            </p>
          </div>

          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-36 rounded-full object-cover 
                ring-4 ring-primary/20 shadow-lg"
              />

              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-2 right-2 
                  bg-primary text-primary-content
                  p-2.5 rounded-full cursor-pointer
                  shadow-md hover:scale-105
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>

            <p className="text-sm text-base-content/50">
              {isUpdatingProfile
                ? "Uploading photo..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* Info Section */}
          <div className="grid gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-base-content/60">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <div className="px-4 py-3 bg-base-200 rounded-xl border">
                {authUser?.fullName}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-base-content/60">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <div className="px-4 py-3 bg-base-200 rounded-xl border">
                {authUser?.email}
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-base-200 rounded-xl p-6 border">
            <h2 className="text-lg font-semibold mb-4">Account Information</h2>

            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between border-b border-base-300 pb-3">
                <span className="text-base-content/60">Member Since</span>
                <span className="font-medium">
                  {authUser.createdAt?.split("T")[0]}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-base-content/60">Account Status</span>
                <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">
                  Active
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

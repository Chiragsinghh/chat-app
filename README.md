💬 Chatty - Real-Time Chat & Group Application
Chatty is a high-performance, real-time chat application built with the MERN stack. It supports private messaging, group creation with admin controls, profile/group icon management, and an individual user-blocking system.

🚀 Features
Real-Time Messaging: Instant message delivery using Socket.io with "Seen" status and typing indicators.

WhatsApp-Style Groups: * Create groups and add/remove members.

Admin Controls: Only admins can change group names and icons.

Member Management: Admins can remove users or add new ones via search.

Security & Blocking: * Block/Unblock users individually for private chats.

Automatic hiding of message inputs when a block is active.

Media Support: Upload and send images via Cloudinary.

State Management: Powered by Zustand for ultra-fast, boilerplate-free state updates.

Responsive UI: Beautiful, glassmorphic design using Tailwind CSS and DaisyUI.

🛠️ Tech Stack
Frontend:

React.js

Tailwind CSS & DaisyUI

Zustand (State Management)

Lucide React (Icons)

Socket.io-client

Backend:

Node.js & Express

MongoDB & Mongoose (Database)

Socket.io (WebSockets)

Cloudinary (Image Hosting)

JSON Web Tokens (JWT) (Authentication)

🚥 Getting Started
Prerequisites
Node.js installed

MongoDB Atlas account

Cloudinary account

📸 Key UI Previews
Group Settings
The group settings modal allows admins to update the group name and icon while managing the member list in a centered, focused overlay.

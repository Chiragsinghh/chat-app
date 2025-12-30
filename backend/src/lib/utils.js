import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, 
    httpOnly: true,                 
    sameSite: "strict", // Strict is more reliable for local development
    secure: false,      // Must be false for localhost
    path: "/",          // Ensures the cookie is available for all routes
  });
  
  return token; // Optional
};
  


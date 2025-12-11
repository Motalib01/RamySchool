import { useEffect, useState } from "react";

export default function TopBar() {
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  return (
    <header className="flex justify-end items-center bg-white border-b border-gray-200 px-6 h-16 shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-sm">
          <span className="text-white text-sm font-semibold">{email?.charAt(0)?.toUpperCase() || '?'}</span>
        </div>
        <span className="text-sm font-medium text-gray-800">{email}</span>
      </div>
    </header>
  );
}

import { useEffect, useState } from "react";

export default function TopBar() {
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full flex justify-between items-center bg-white border-b shadow-sm py-4 px-10 z-50">
      <h1 className="text-2xl font-semibold text-gray-800">Ramy School</h1>
      <span className="text-lg font-semibold text-gray-700">{username}</span>
    </header>
  );
}

import { useState } from "react";
import { Eye, EyeOff, Factory, User, LockKeyhole } from "lucide-react"; 
import { useRouter } from "next/router";

// --- SIMULASI useAuth DAN LOGIC LOGIN ---
const useAuth = () => {
  const router = useRouter();

  // Fungsi login: simpan user dan arahkan ke dashboard sesuai role
  const login = (userData: { username: string; role: string }) => {
    localStorage.setItem("currentUser", JSON.stringify(userData));

    if (userData.role === "admin") {
      router.push("/admin/dashboard");
    } else if (userData.role === "user") {
      router.push("/user/dashboard");
    }
  };

  return { login };
};
// -------------------------------------------------

export default function LoginPage() {
  const { login } = useAuth(); 
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>(""); 
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (username.trim() === "" || password.trim() === "") {
      setErrorMessage("Username dan Password harus diisi!");
      return;
    }

    let foundUser: { username: string; role: string } | null = null;

    // 1️⃣ Login admin hardcode
    if (username === "admin" && password === "admin") {
      foundUser = { username: "admin", role: "admin" };
    }

    // 2️⃣ Login user biasa dari localStorage
    if (!foundUser) {
      const storedUsers = localStorage.getItem("app_users"); // ✅ gunakan key yg sama
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const match = users.find(
          (u: { username: string; password: string }) =>
            u.username === username && u.password === password
        );

        if (match) {
          foundUser = { username: match.username, role: "user" };
        }
      }
    }

    // 3️⃣ Hasil login
    if (foundUser) {
      login(foundUser);
    } else {
      setErrorMessage("Username atau Password salah!");
    }
  };

  // --- UI ---
  const inputContainerClass = "relative w-full mb-5";
  const inputBaseClass =
    "w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors placeholder-gray-500 text-gray-800 shadow-sm";
  const iconClass =
    "absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white rounded-3xl shadow-2xl w-full max-w-sm border border-gray-200"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <Factory className="w-10 h-10 text-green-700 mb-2" />
          <h1 className="text-3xl font-extrabold text-gray-800">
            Login ke Toolbox
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Silakan masuk untuk melanjutkan
          </p>
        </div>

        {/* Pesan Error */}
        {errorMessage && (
          <div className="p-3 mb-4 text-sm text-red-800 rounded-lg bg-red-100 border border-red-300">
            {errorMessage}
          </div>
        )}

        {/* Username */}
        <div className={inputContainerClass}>
          <User className={iconClass} />
          <input
            type="text"
            placeholder="Masukkan username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={inputBaseClass}
          />
        </div>

        {/* Password */}
        <div className={inputContainerClass}>
          <LockKeyhole className={iconClass} />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${inputBaseClass} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-700 transition-colors p-1 rounded-full"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Lupa Password */}
        <div className="text-right -mt-2 mb-6">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-sm text-green-700 hover:underline"
          >
            Lupa Password?
          </a>
        </div>

        {/* Tombol Login */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-green-500/50"
        >
          Login
        </button>
      </form>
    </div>
  );
}

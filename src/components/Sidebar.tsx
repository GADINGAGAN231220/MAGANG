import Link from 'next/link';
import { LayoutDashboard, Users, ShoppingCart, Settings } from 'lucide-react'; // Gunakan ikon dari lucide-react (terlihat di package.json)

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/users', icon: Users, label: 'Pengguna' },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Pesanan' },
  { href: '/admin/settings', icon: Settings, label: 'Pengaturan' },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col h-screen p-4 sticky top-0">
      <div className="text-2xl font-bold mb-8 text-yellow-400">
        Admin Panel
      </div>
      <nav className="flex-1">
        <ul>
          {navItems.map((item) => (
            <li key={item.href} className="mb-2">
              <Link href={item.href} className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition duration-150">
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto pt-4 border-t border-gray-700">
        {/* Opsional: Tautan Logout atau Info User */}
        <p className="text-sm text-gray-400">© 2024 Admin</p>
      </div>
    </aside>
  );
}
'use client';

import ProtectedRoute from "@/hooks/useProtected";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { useDispatch } from "react-redux";
import { logout } from "@/store/features/authSlice";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/authService";
import Link from "next/link";
import { 
  BookOpen, 
  GraduationCap, 
  User, 
  Settings, 
  LogOut,
  Home,
  Calendar,
  MessageSquare,
  Moon,
  Sun
} from "lucide-react";
import { useTheme } from "next-themes";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
    authService.logout();
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: BookOpen, label: 'Course Library', href: '/courses' },
    { icon: GraduationCap, label: 'My Lessons', href: '/lessons' },
    { icon: Calendar, label: 'Schedule', href: '/schedule' },
    { icon: MessageSquare, label: 'Discussions', href: '/discussions' },
    { icon: User, label: 'Profile', href: '/profile' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-card border-r border-border">
          <div className="flex h-16 items-center justify-center border-b border-border">
            <h1 className="text-xl font-semibold text-foreground">LMS Platform</h1>
          </div>
          
          <nav className="space-y-1 px-3 py-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-0 w-full border-t border-border p-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex w-full items-center px-3 py-2 text-sm font-medium text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors mb-2"
            >
              {theme === 'dark' ? (
                <Sun className="mr-3 h-5 w-5" />
              ) : (
                <Moon className="mr-3 h-5 w-5" />
              )}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-foreground">{user?.name || 'User'}</p>
                <p className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-3 py-2 text-sm font-medium text-muted-foreground rounded-lg hover:bg-accent hover:text-destructive transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="pl-64">
          <div className="min-h-screen p-8">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 
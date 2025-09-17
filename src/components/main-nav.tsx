'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export function MainNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/calendario", label: "Calendário", icon: "📅" },
    { href: "/podio", label: "Pódio", icon: "🏆" },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="text-2xl font-bold text-gray-dark flex items-center gap-2">
              🐱 <span className="text-pink-burnt">Gymcats</span>
            </Link>
            
            <div className="flex items-center gap-4">
              {/* Navigation Links */}
              <div className="flex gap-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        px-4 py-2 rounded-full font-medium transition-all duration-200 flex items-center gap-2
                        ${isActive 
                          ? '' 
                          : 'text-gray-dark hover:bg-pink-pastel hover:text-pink-burnt'
                        }
                      `}
                      style={isActive ? {
                        backgroundColor: '#E75480',
                        color: '#ffffff',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      } : {}}
                    >
                      <span className="text-sm">{item.icon}</span>
                      <span className="hidden lg:inline">{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* User Info and Logout */}
              {session?.user && (
                <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-dark">
                      Olá, {session.user.name}!
                    </p>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="px-3 py-1 text-sm text-gray-medium hover:text-pink-burnt transition-colors rounded-md hover:bg-pink-50"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-50">
        <div className="flex items-center justify-around py-2 px-4 safe-area-pb">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all duration-200 min-w-0 flex-1 mx-1
                  ${isActive 
                    ? '' 
                    : 'text-gray-dark hover:text-pink-burnt hover:bg-pink-50'
                  }
                `}
                style={isActive ? {
                  backgroundColor: '#E75480',
                  color: '#ffffff'
                } : {}}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs font-medium truncate">{item.label}</span>
                {isActive && (
                  <div className="w-4 h-1 bg-white rounded-full mt-1"></div>
                )}
              </Link>
            );
          })}
          
          {/* Mobile User Menu */}
          {session?.user && (
            <div className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all duration-200 min-w-0 flex-1 mx-1">
              <button
                onClick={() => signOut()}
                className="text-xl"
              >
                👋
              </button>
              <span className="text-xs font-medium text-gray-dark truncate">Sair</span>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

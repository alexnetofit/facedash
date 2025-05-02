'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BiBarChart, BiIntegration } from 'react-icons/bi';
import { LuLogOut } from 'react-icons/lu';
import { useAuth } from '@/hooks/useAuth';

export default function Sidebar() {
  const pathname = usePathname();
  const { signOut, loading } = useAuth();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <aside className="h-full w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <Link href="/dashboard/resumo" className="text-xl font-bold">
          FaceDash
        </Link>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link 
              href="/dashboard/resumo" 
              className={`flex items-center p-3 rounded-lg hover:bg-gray-800 transition-colors ${
                isActive('/dashboard/resumo') ? 'bg-gray-800' : ''
              }`}
            >
              <BiBarChart className="mr-3" size={20} />
              <span>Resumo</span>
            </Link>
          </li>
          <li>
            <Link 
              href="/dashboard/integracoes" 
              className={`flex items-center p-3 rounded-lg hover:bg-gray-800 transition-colors ${
                isActive('/dashboard/integracoes') ? 'bg-gray-800' : ''
              }`}
            >
              <BiIntegration className="mr-3" size={20} />
              <span>Integrações</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => signOut()}
          disabled={loading}
          className="flex items-center w-full p-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <LuLogOut className="mr-3" size={20} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
} 
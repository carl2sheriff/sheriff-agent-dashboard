import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  Shield,
  LayoutGrid,
  Bot,
  ChevronDown,
  ChevronRight,
  Bell,
  Settings,
  Menu,
  X,
} from 'lucide-react'

const AGENTS = [
  { id: 'repartition-ca-marge', label: 'Répartition CA/Marge' },
  { id: 'scouting-talent', label: 'Scouting Talent' },
]

function NavItem({ to, icon: Icon, label, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors duration-150 ${
          isActive
            ? 'bg-[#1a1a1a] text-white'
            : 'text-[#a1a1a1] hover:bg-[#161616] hover:text-white'
        }`
      }
    >
      <Icon size={16} strokeWidth={1.5} />
      <span>{label}</span>
    </NavLink>
  )
}

export function Sidebar({ mobileOpen, onClose }) {
  const [agentsExpanded, setAgentsExpanded] = useState(true)
  const location = useLocation()
  const isAgentActive = location.pathname.startsWith('/agents')

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-14 border-b border-[#222222] flex-shrink-0">
        <Shield size={18} strokeWidth={1.5} className="text-white" />
        <span className="text-sm font-semibold text-white tracking-tight">Sheriff Dashboard</span>
        {mobileOpen !== undefined && (
          <button
            onClick={onClose}
            className="ml-auto text-[#6b6b6b] hover:text-white transition-colors md:hidden"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        <NavItem to="/" icon={LayoutGrid} label="Dashboard" end />

        {/* Agents section */}
        <div>
          <button
            onClick={() => setAgentsExpanded((v) => !v)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors duration-150 ${
              isAgentActive && !agentsExpanded
                ? 'bg-[#1a1a1a] text-white'
                : 'text-[#a1a1a1] hover:bg-[#161616] hover:text-white'
            }`}
          >
            <Bot size={16} strokeWidth={1.5} />
            <span className="flex-1 text-left">Agents</span>
            {agentsExpanded ? (
              <ChevronDown size={14} className="text-[#6b6b6b]" />
            ) : (
              <ChevronRight size={14} className="text-[#6b6b6b]" />
            )}
          </button>

          {agentsExpanded && (
            <div className="ml-4 mt-0.5 space-y-0.5 border-l border-[#222222] pl-3">
              {AGENTS.map((agent) => (
                <NavLink
                  key={agent.id}
                  to={`/agents/${agent.id}`}
                  className={({ isActive }) =>
                    `block px-2 py-1.5 rounded-md text-xs transition-colors duration-150 truncate ${
                      isActive
                        ? 'text-white bg-[#1a1a1a]'
                        : 'text-[#6b6b6b] hover:text-[#a1a1a1] hover:bg-[#161616]'
                    }`
                  }
                >
                  {agent.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>

        <NavItem to="/ops" icon={Shield} label="Continuité Ops" />
        <NavItem to="/alerts" icon={Bell} label="Alertes" />
      </nav>

      {/* Footer */}
      <div className="px-2 py-3 border-t border-[#222222] flex-shrink-0">
        <NavItem to="/settings" icon={Settings} label="Paramètres" />
        <div className="mt-3 px-3">
          <p className="text-[10px] text-[#6b6b6b]">Sheriff Projects</p>
          <p className="text-[10px] text-[#6b6b6b]">balanced-abundance</p>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 flex-shrink-0 flex-col bg-[#0a0a0a] border-r border-[#222222] h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <aside className="absolute left-0 top-0 bottom-0 w-56 bg-[#0a0a0a] border-r border-[#222222]">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}

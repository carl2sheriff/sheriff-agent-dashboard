import { useState } from 'react'
import { Sidebar } from './Sidebar'

export function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Pass toggleMenu to children via cloneElement or context — simpler: provide via prop */}
        {typeof children === 'function'
          ? children({ toggleMenu: () => setMobileMenuOpen((v) => !v) })
          : children}
      </div>
    </div>
  )
}

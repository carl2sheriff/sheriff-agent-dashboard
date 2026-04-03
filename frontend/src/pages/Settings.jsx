import { Header } from '../components/layout/Header'

export default function Settings({ toggleMenu }) {
  return (
    <>
      <Header
        title="Paramètres"
        subtitle="Configuration du dashboard"
        onMenuToggle={toggleMenu}
      />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-xl space-y-4">
          <div className="card p-4 space-y-4">
            <h3 className="text-sm font-semibold text-white">Général</h3>
            <div>
              <label className="label block mb-1.5">Intervalle de rafraîchissement (s)</label>
              <input type="number" defaultValue={30} className="input w-48" />
            </div>
            <div>
              <label className="label block mb-1.5">URL du backend</label>
              <input
                type="text"
                defaultValue="http://localhost:3001"
                className="input w-full font-mono text-xs"
              />
            </div>
          </div>

          <div className="card p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white">À propos</h3>
            <div className="text-xs text-[#6b6b6b] space-y-1">
              <p>Sheriff Agent Dashboard v1.0.0</p>
              <p>Sheriff Projects — balanced-abundance</p>
              <p>Project ID: 63830b39-2415-4c9e-ba52-79a6053a8dab</p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

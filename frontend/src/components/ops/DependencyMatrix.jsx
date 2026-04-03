import { Check, Minus } from 'lucide-react'

const SERVICES = ['Slack', 'Google Sheets', 'Google Drive', 'Railway', 'OpenAI']

const DEPENDENCIES = {
  'Agent Répartition CA/Marge': {
    Slack: true,
    'Google Sheets': true,
    'Google Drive': false,
    Railway: true,
    OpenAI: false,
  },
  'Agent Scouting Talent': {
    Slack: true,
    'Google Sheets': false,
    'Google Drive': true,
    Railway: true,
    OpenAI: true,
  },
}

export function DependencyMatrix() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-[#222222]">
            <th className="text-left py-3 px-4 text-[#6b6b6b] font-medium w-52">Agent</th>
            {SERVICES.map((service) => (
              <th key={service} className="text-center py-3 px-3 text-[#6b6b6b] font-medium">
                {service}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1a1a1a]">
          {Object.entries(DEPENDENCIES).map(([agent, deps]) => (
            <tr key={agent} className="hover:bg-[#161616] transition-colors">
              <td className="py-3 px-4 text-[#a1a1a1] font-medium">{agent}</td>
              {SERVICES.map((service) => (
                <td key={service} className="py-3 px-3 text-center">
                  {deps[service] ? (
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/20">
                      <Check size={10} className="text-[#22c55e]" />
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center text-[#333333]">
                      <Minus size={12} />
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

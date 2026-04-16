// Dashboard KPI stat card
export default function StatCard({ label, value, icon, color = 'orange', sublabel }) {
  const colorMap = {
    orange: 'from-orange-600/20 to-orange-800/10 border-orange-700/30 text-orange-400',
    blue:   'from-blue-600/20 to-blue-800/10 border-blue-700/30 text-blue-400',
    green:  'from-green-600/20 to-green-800/10 border-green-700/30 text-green-400',
    purple: 'from-purple-600/20 to-purple-800/10 border-purple-700/30 text-purple-400',
    red:    'from-red-600/20 to-red-800/10 border-red-700/30 text-red-400',
    yellow: 'from-yellow-600/20 to-yellow-800/10 border-yellow-700/30 text-yellow-400',
  };
  const cls = colorMap[color] || colorMap.orange;

  return (
    <div className={`bg-gradient-to-br ${cls} border rounded-2xl p-5 flex items-start gap-4 transition-all duration-300 hover:scale-[1.02]`}>
      {icon && (
        <div className={`w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-xl flex-shrink-0`}>
          {icon}
        </div>
      )}
      <div>
        <p className="text-3xl font-bold text-white">{value}</p>
        <p className="text-sm font-medium text-gray-400 mt-0.5">{label}</p>
        {sublabel && <p className="text-xs text-gray-500 mt-1">{sublabel}</p>}
      </div>
    </div>
  );
}

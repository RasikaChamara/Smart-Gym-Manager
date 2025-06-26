const StatCard = ({ icon, label, value }) => (
  <div className="flex items-center bg-gray-900 rounded-xl p-4 shadow">
    <div className="text-yellow-400 text-2xl mr-4">{icon}</div>
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  </div>
);

export default StatCard;

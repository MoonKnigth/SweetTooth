export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#260f08]">Dashboard Overview</h1>
      <p className="text-[#87635a]">Welcome to the SweetTooth Admin Panel. Select a menu on the left to manage your store.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Sales</h3>
          <p className="text-3xl font-bold text-[#c73b0f] mt-2">$0.00</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Orders Today</h3>
          <p className="text-3xl font-bold text-[#c73b0f] mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Products</h3>
          <p className="text-3xl font-bold text-[#c73b0f] mt-2">--</p>
        </div>
      </div>
    </div>
  );
}

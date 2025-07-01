export default function DirectAccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">IBAM Learning Platform</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a href="/module/1" className="p-6 bg-white rounded-lg shadow hover:shadow-lg">
          <h2 className="text-xl font-semibold">Module 1</h2>
          <p>Starting Your Business</p>
        </a>
        <a href="/module/2" className="p-6 bg-white rounded-lg shadow hover:shadow-lg">
          <h2 className="text-xl font-semibold">Module 2</h2>
          <p>Growing Your Business</p>
        </a>
        <a href="/module/3" className="p-6 bg-white rounded-lg shadow hover:shadow-lg">
          <h2 className="text-xl font-semibold">Module 3</h2>
          <p>Scaling Your Business</p>
        </a>
      </div>
    </div>
  );
}

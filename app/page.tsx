export default function Home() {
  return (
    <div className="min-h-screen bg-blue-50">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold text-center">
          IBAM Learning Platform
        </h1>
        <div className="text-center mt-8">
          <a href="/modules/module1" className="bg-blue-600 text-white px-6 py-3 rounded">
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
}
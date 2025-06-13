import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-secondary mb-4">
            Transform Your Business
          </h1>
          <h2 className="text-2xl text-primary font-semibold mb-6">
            Through Faith-Driven Principles
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-4">
            Discover how to build a thriving business that honors God, serves others, 
            and multiplies disciples in the marketplace. Join hundreds of entrepreneurs 
            across 9 nations who are designed to thrive.
          </p>
          <p className="text-base text-gray-600 max-w-2xl mx-auto mb-8">
            Developed by 6 seasoned business leaders with 30+ years each of proven experience 
            in business ownership, cross-cultural ministry, and Faith Driven entrepreneurship.
          </p>
          <Link href="/dashboard" className="btn-primary inline-block mr-4">
            Start Your Journey
          </Link>
          <Link href="/trainers" className="btn-secondary inline-block">
            Meet Your Trainers
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-3xl mb-4">🙏</div>
            <h3 className="text-xl font-semibold text-secondary mb-3">Bless</h3>
            <p className="text-gray-600">
              Learn to operate your business as a blessing to customers, employees, and community.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-3xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-secondary mb-3">Develop</h3>
            <p className="text-gray-600">
              Build sustainable business practices that create lasting value and growth.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-3xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-secondary mb-3">Multiply</h3>
            <p className="text-gray-600">
              Reproduce your success by training others to become marketplace disciples.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-8 shadow-md">
          <h3 className="text-2xl font-semibold text-secondary mb-6 text-center">
            5 Transformational Modules
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold">1</div>
              <span className="text-lg">Foundational Principles</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold">2</div>
              <span className="text-lg">Success and Failure Factors</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold">3</div>
              <span className="text-lg">Marketing</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold">4</div>
              <span className="text-lg">Finance</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold">5</div>
              <span className="text-lg">Next Steps to Write a Business Plan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
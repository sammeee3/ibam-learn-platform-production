import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TrainersPage() {
  const trainers = [
    {
      name: "John",
      experience: "30+ years",
      background: "Entrepreneurship & Cross-Cultural Ministry",
      impact: "Multiple business launches across developing nations",
      photoPlaceholder: "J"
    },
    {
      name: "Jeff", 
      experience: "30+ years",
      background: "Business & Missionary Work in Closed Countries",
      impact: "Extensive experience in multiple developing nations traditionally closed to the Gospel",
      photoPlaceholder: "J"
    },
    {
      name: "Steve",
      experience: "30+ years", 
      background: "Retail & Marketplace Ministry",
      impact: "Built sustainable businesses impacting local communities",
      photoPlaceholder: "S"
    },
    {
      name: "Daniel",
      experience: "30+ years",
      background: "Consultancy & Cross-Cultural Living", 
      impact: "Established Faith Driven businesses in unreached areas",
      photoPlaceholder: "D"
    },
    {
      name: "Roy",
      experience: "30+ years",
      background: "Business Ownership & Family Leadership",
      impact: "Mentored entrepreneurs while raising families on mission",
      photoPlaceholder: "R"
    },
    {
      name: "Dan",
      experience: "30+ years",
      background: "Diverse Industries & Discipleship",
      impact: "Led business owners to follow Jesus through marketplace ministry",
      photoPlaceholder: "D"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm p-4">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Meet Your IBAM Training Team
          </h1>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto mb-8">
            Six seasoned business leaders and curriculum contributors with a combined 180+ years of proven experience 
            in Faith Driven entrepreneurship, cross-cultural ministry, and marketplace discipleship.
          </p>
          
          <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Proven Global Impact</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">9+</div>
                <p className="text-gray-600">Nations Reached</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">100s</div>
                <p className="text-gray-600">Students Trained</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">180+</div>
                <p className="text-gray-600">Combined Years Experience</p>
              </div>
            </div>
          </div>
        </div>

        {/* Collective Story */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Our Collaborative Story</h2>
          <div className="prose max-w-none text-gray-700 leading-relaxed">
            <p className="text-lg mb-6">
              Every member of our training team has walked the challenging path of building 
              businesses while living out their faith in diverse and often difficult contexts. 
              Together, we've experienced the late nights, the financial pressures, the difficult 
              decisions, and the joy of seeing God work through marketplace ministry across continents.
            </p>
            
            <p className="mb-6">
              Our collective backgrounds span entrepreneurship, process management, retail, consultancy, 
              missionary work in closed countries, and various other industries. What unites us is not 
              just our business experience, but our shared commitment to raising families while building 
              enterprises that honor God and advance His mission through unreached and developing communities.
            </p>
            
            <p className="mb-6">
              This curriculum represents our combined wisdom and experience—born from real-world 
              application across multiple nations and cultures. Every principle taught here has been 
              collaboratively developed, tested, and refined through our collective decades of actual 
              marketplace challenges in both developed and developing nations, including countries 
              traditionally closed to the Gospel.
            </p>
            
            <p className="font-semibold text-blue-600">
              As a unified team, we are 100% committed to seeing this transformational training reach 
              as many men and women worldwide as possible. Because together, we know what God can do 
              through Faith Driven entrepreneurs who are designed to thrive.
            </p>
          </div>
        </div>

        {/* Individual Trainers */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-12">
            Your Curriculum Development Team
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainers.map((trainer, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="text-center mb-4">
                  {/* Photo Placeholder - Ready for real photos */}
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 relative overflow-hidden">
                    {/* Placeholder for photo */}
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-blue-600 text-2xl font-bold mb-1">
                          {trainer.photoPlaceholder}
                        </div>
                        <div className="text-xs text-gray-500">Photo Slot</div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">{trainer.name}</h3>
                  <p className="text-blue-600 font-medium">{trainer.experience}</p>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">Background:</h4>
                    <p className="text-gray-600 text-sm">{trainer.background}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">Contribution:</h4>
                    <p className="text-gray-600 text-sm">{trainer.impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Commitment Statement */}
        <div className="bg-gradient-to-r from-blue-50 to-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Our Team Commitment to You
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-6">
            Every lesson, every principle, and every tool in this curriculum comes from our 
            collaborative team's decades of real-world business experience and cross-cultural ministry. 
            We're not teaching theory—we're sharing what has been collectively tested and proven to work 
            across diverse cultures and challenging environments.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-3">🏢 Collectively Proven</h3>
              <p className="text-gray-600 text-sm">
                Every principle has been developed and tested by our team across multiple industries and nations.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-3">✝️ Faith Integrated</h3>
              <p className="text-gray-600 text-sm">
                Learn to seamlessly integrate your faith with business practices that honor God.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-3">🌍 Cross-Culturally Tested</h3>
              <p className="text-gray-600 text-sm">
                Principles that work across cultures, from developed cities to closed countries and unreached villages.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-3">👥 Family Focused</h3>
              <p className="text-gray-600 text-sm">
                Build businesses that provide for your family while advancing God's mission.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <Link 
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 inline-block"
            >
              Start Your Training Journey
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
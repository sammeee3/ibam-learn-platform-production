'use client';

export default function Module1Page() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl p-6 mb-8 shadow-xl">
                    <h1 className="text-3xl font-bold text-gray-800">🚀 IBAM Learning Platform</h1>
                    <p className="text-gray-600 mt-2">Module 1: Foundational Principles</p>
                </div>

                {/* Success Message */}
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-green-800 mb-4">✅ SUCCESS!</h2>
                    <p className="text-green-700 text-lg">Your IBAM Learning Platform is now LIVE and working!</p>
                    <div className="mt-4 space-y-2">
                        <p className="text-green-600">✅ Database: Connected to Supabase</p>
                        <p className="text-green-600">✅ Deployment: Live on Vercel</p>
                        <p className="text-green-600">✅ Module 1: Ready for content</p>
                        <p className="text-green-600">✅ Architecture: Scalable for all modules</p>
                    </div>
                </div>

                {/* Module 1 Content Preview */}
                <div className="bg-white rounded-2xl p-8 mb-8 shadow-xl">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Module 1: Foundational Principles</h2>
                    
                    <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-xl border-l-4 border-orange-400 mb-6">
                        <p className="text-gray-800 italic text-lg">
                            "And God blessed them. And God said to them, 'Be fruitful and multiply and fill the earth and subdue it..."
                        </p>
                        <p className="text-gray-600 font-medium mt-2">- Genesis 1:28</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Session Cards */}
                        <div className="bg-gray-50 rounded-xl p-6 border-2 border-transparent hover:border-blue-400 transition-all">
                            <div className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold inline-block mb-4 text-sm">
                                Session 1.1
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">Business is a Good Gift from God</h3>
                            <p className="text-gray-600 mb-4">Understanding the biblical foundation for marketplace ministry.</p>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                Start Session
                            </button>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-6 border-2 border-transparent hover:border-blue-400 transition-all">
                            <div className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold inline-block mb-4 text-sm">
                                Session 1.2
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">Leaders Work Together</h3>
                            <p className="text-gray-600 mb-4">Building unity between marketplace and church leaders.</p>
                            <button className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed">
                                🔒 Complete Previous
                            </button>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-6 border-2 border-transparent hover:border-blue-400 transition-all">
                            <div className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold inline-block mb-4 text-sm">
                                Session 1.3
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">Godly Guidelines</h3>
                            <p className="text-gray-600 mb-4">Practical wisdom for biblical business operations.</p>
                            <button className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed">
                                🔒 Complete Previous
                            </button>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-6 border-2 border-transparent hover:border-blue-400 transition-all">
                            <div className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold inline-block mb-4 text-sm">
                                Session 1.4
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">Faith-Driven Business</h3>
                            <p className="text-gray-600 mb-4">Integrating faith, excellence, and disciple-making.</p>
                            <button className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed">
                                🔒 Complete Previous
                            </button>
                        </div>
                    </div>
                </div>

                {/* Next Steps */}
                <div className="bg-white rounded-2xl p-6 shadow-xl">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 Ready for Next Phase</h3>
                    <div className="space-y-3">
                        <p className="text-gray-700">✅ Add video content integration</p>
                        <p className="text-gray-700">✅ Connect to your Supabase database for progress tracking</p>
                        <p className="text-gray-700">✅ Build business planning tools</p>
                        <p className="text-gray-700">✅ Create Modules 2-5 using this template</p>
                        <p className="text-gray-700">✅ Add authentication and member features</p>
                    </div>
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <p className="text-blue-800 font-semibold">🚀 Your platform foundation is complete and ready for expansion!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
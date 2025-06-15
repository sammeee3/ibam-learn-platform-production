'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Sample community data
const discussionTopics = [
  {
    id: 1,
    title: "Integrating Prayer into Daily Business Operations",
    author: "Sarah M.",
    category: "Faith & Work",
    replies: 23,
    lastActive: "2 hours ago",
    excerpt: "How do you practically incorporate prayer and spiritual discernment into your business decisions?",
    pinned: true
  },
  {
    id: 2,
    title: "Finding Christian Suppliers and Partners",
    author: "David L.",
    category: "Networking",
    replies: 15,
    lastActive: "4 hours ago",
    excerpt: "Looking for recommendations on connecting with like-minded business partners who share kingdom values.",
    pinned: false
  },
  {
    id: 3,
    title: "Balancing Profit and Generosity",
    author: "Maria R.",
    category: "Ethics",
    replies: 31,
    lastActive: "6 hours ago",
    excerpt: "Struggling with how much to give away vs. reinvest in growth. How do you find the right balance?",
    pinned: false
  },
  {
    id: 4,
    title: "Employee Discipleship Opportunities",
    author: "Michael K.",
    category: "Leadership",
    replies: 8,
    lastActive: "1 day ago",
    excerpt: "Creative ways to mentor employees and create discipleship opportunities in the workplace.",
    pinned: false
  },
  {
    id: 5,
    title: "Dealing with Difficult Customers Gracefully",
    author: "Jennifer T.",
    category: "Customer Service",
    replies: 19,
    lastActive: "2 days ago",
    excerpt: "How do you maintain Christian character when dealing with challenging customer situations?",
    pinned: false
  }
];

const categories = [
  { name: "All Topics", count: 96, color: "#4ECDC4" },
  { name: "Faith & Work", count: 28, color: "#8b5cf6" },
  { name: "Leadership", count: 22, color: "#10b981" },
  { name: "Ethics", count: 15, color: "#f59e0b" },
  { name: "Networking", count: 12, color: "#ef4444" },
  { name: "Customer Service", count: 19, color: "#06b6d4" }
];

const featuredMembers = [
  {
    name: "Dr. James Wilson",
    role: "Business Mentor",
    location: "Seattle, WA",
    specialty: "Tech Startups",
    avatar: "JW"
  },
  {
    name: "Rachel Chen",
    role: "Ministry Leader",
    location: "Austin, TX", 
    specialty: "Social Enterprise",
    avatar: "RC"
  },
  {
    name: "Carlos Rodriguez",
    role: "Entrepreneur",
    location: "Miami, FL",
    specialty: "Restaurant Industry",
    avatar: "CR"
  }
];

export default function Community() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All Topics");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  const filteredTopics = selectedCategory === "All Topics" 
    ? discussionTopics 
    : discussionTopics.filter(topic => topic.category === selectedCategory);

  return (
    <div className="min-h-screen" style={{backgroundColor: '#f8fafc'}}>
      {/* IBAM Header */}
      <div style={{background: 'linear-gradient(135deg, #4ECDC4 0%, #2C3E50 100%)'}}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img 
                src="/images/branding/ibam-logo-copy.jpg" 
                alt="IBAM Logo"
                className="h-10 w-auto"
                onError={(e) => {
                  e.currentTarget.src = "/images/branding/mini-logo.png";
                }}
              />
              <div>
                <div className="text-white/90 text-sm md:text-base mb-1">
                  IBAM Learning Community
                </div>
                <h1 className="text-white text-xl md:text-3xl font-bold mb-2">
                  Connect & Share
                </h1>
                <div className="flex flex-wrap gap-4 text-sm md:text-base text-white/90">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-400"></span>
                    247 active members
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/70">96 discussions this month</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-all"
              >
                🏠 <span className="hidden sm:inline">Dashboard</span>
              </button>
              
              <button 
                onClick={() => setShowNewPostForm(true)}
                className="bg-[#10b981] hover:bg-[#059669] px-4 py-2 rounded-lg text-white font-semibold transition-all"
              >
                ✏️ <span className="hidden sm:inline">New Discussion</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        
        {/* Community Welcome */}
        <div className="bg-gradient-to-r from-[#4ECDC4]/10 to-[#10b981]/10 rounded-2xl border-2 border-[#4ECDC4]/20 p-6 md:p-8 mb-8">
          <h2 className="font-bold text-[#2C3E50] text-xl md:text-2xl mb-4 flex items-center gap-3">
            <span className="text-4xl md:text-5xl">🤝</span>
            Kingdom Entrepreneurs Community
          </h2>
          <div className="bg-white rounded-xl p-4 md:p-6 border border-[#4ECDC4]/20">
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Connect with fellow entrepreneurs who are integrating faith and business. Share experiences, 
              ask questions, find mentors, and build lasting relationships with people on the same journey.
            </p>
            <div className="flex items-center gap-4">
              <div className="text-3xl">💬</div>
              <div>
                <div className="font-semibold text-[#2C3E50]">Share your story, learn from others</div>
                <div className="text-gray-600">Building God's kingdom through marketplace ministry</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Categories */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] p-6">
              <h3 className="font-bold text-[#2C3E50] text-lg mb-4">Discussion Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedCategory === category.name
                        ? 'bg-[#4ECDC4]/10 border-2 border-[#4ECDC4]'
                        : 'hover:bg-gray-50 border-2 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#2C3E50]">{category.name}</span>
                      <span 
                        className="text-xs font-bold px-2 py-1 rounded-full text-white"
                        style={{backgroundColor: category.color}}
                      >
                        {category.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Members */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] p-6">
              <h3 className="font-bold text-[#2C3E50] text-lg mb-4">Featured Members</h3>
              <div className="space-y-4">
                {featuredMembers.map((member, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{background: 'linear-gradient(135deg, #4ECDC4 0%, #2C3E50 100%)'}}>
                      {member.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[#2C3E50] text-sm">{member.name}</div>
                      <div className="text-xs text-gray-600">{member.role}</div>
                      <div className="text-xs text-gray-500">{member.location}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Guidelines */}
            <div className="bg-gradient-to-r from-[#4ECDC4]/10 to-[#10b981]/10 rounded-xl border border-[#4ECDC4]/20 p-4">
              <h4 className="font-semibold text-[#2C3E50] mb-2">Community Guidelines</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Be respectful and encouraging</li>
                <li>• Share practical insights</li>
                <li>• Pray for one another</li>
                <li>• Build each other up</li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            
            {/* Discussion Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-[#2C3E50] text-xl md:text-2xl flex items-center gap-3">
                <span className="text-4xl md:text-5xl">💬</span>
                {selectedCategory} ({filteredTopics.length})
              </h2>
              
              <button 
                onClick={() => setShowNewPostForm(true)}
                className="lg:hidden bg-[#10b981] hover:bg-[#059669] px-4 py-2 rounded-lg text-white font-semibold transition-all"
              >
                ✏️ New Post
              </button>
            </div>

            {/* New Post Form */}
            {showNewPostForm && (
              <div className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] p-6 md:p-8 mb-6">
                <h3 className="font-bold text-[#2C3E50] text-lg md:text-xl mb-6">Start a New Discussion</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block font-semibold text-[#2C3E50] mb-2">Discussion Title</label>
                    <input
                      type="text"
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent text-lg"
                      placeholder="What would you like to discuss?"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-semibold text-[#2C3E50] mb-2">Your Question or Topic</label>
                    <textarea
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent text-lg"
                      placeholder="Share your thoughts, ask questions, or start a meaningful discussion..."
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        // TODO: Submit post to database
                        setShowNewPostForm(false);
                        setNewPostTitle("");
                        setNewPostContent("");
                      }}
                      className="px-6 py-3 rounded-xl font-semibold text-lg text-white transition-all"
                      style={{background: 'linear-gradient(135deg, #4ECDC4 0%, #2C3E50 100%)'}}
                    >
                      📝 Post Discussion
                    </button>
                    
                    <button 
                      onClick={() => setShowNewPostForm(false)}
                      className="px-6 py-3 rounded-xl font-semibold text-lg text-gray-600 hover:text-[#2C3E50] transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Discussion Topics */}
            <div className="space-y-4">
              {filteredTopics.map((topic) => (
                <div 
                  key={topic.id}
                  className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] p-6 hover:shadow-xl transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {topic.pinned && (
                          <span className="bg-[#f59e0b] text-white text-xs font-bold px-2 py-1 rounded-full">
                            📌 PINNED
                          </span>
                        )}
                        <span 
                          className="text-xs font-bold px-2 py-1 rounded-full text-white"
                          style={{backgroundColor: categories.find(c => c.name === topic.category)?.color || '#6b7280'}}
                        >
                          {topic.category}
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-[#2C3E50] text-lg md:text-xl mb-2 hover:text-[#4ECDC4] transition-colors">
                        {topic.title}
                      </h3>
                      
                      <p className="text-gray-600 text-base leading-relaxed mb-4">
                        {topic.excerpt}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          👤 <strong>{topic.author}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          💬 {topic.replies} replies
                        </span>
                        <span className="flex items-center gap-1">
                          🕒 {topic.lastActive}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-2xl ml-4">💭</div>
                  </div>
                  
                  <button className="w-full bg-[#4ECDC4]/10 hover:bg-[#4ECDC4]/20 text-[#2C3E50] font-semibold py-3 rounded-xl transition-all">
                    Join Discussion →
                  </button>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <button className="bg-white rounded-xl shadow-lg border border-[#e2e8f0] px-8 py-4 font-semibold text-[#2C3E50] hover:shadow-xl transition-all">
                Load More Discussions
              </button>
            </div>
          </div>
        </div>

        {/* Community Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg border border-[#e2e8f0] p-6 text-center">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-2xl font-bold text-[#2C3E50]">247</div>
            <div className="text-gray-600">Active Members</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg border border-[#e2e8f0] p-6 text-center">
            <div className="text-3xl mb-2">💬</div>
            <div className="text-2xl font-bold text-[#2C3E50]">96</div>
            <div className="text-gray-600">Discussions</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg border border-[#e2e8f0] p-6 text-center">
            <div className="text-3xl mb-2">🌍</div>
            <div className="text-2xl font-bold text-[#2C3E50]">23</div>
            <div className="text-gray-600">Countries</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg border border-[#e2e8f0] p-6 text-center">
            <div className="text-3xl mb-2">🤝</div>
            <div className="text-2xl font-bold text-[#2C3E50]">1,847</div>
            <div className="text-gray-600">Connections Made</div>
          </div>
        </div>
      </div>

      {/* IBAM Footer */}
      <footer style={{background: '#2C3E50'}} className="text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex justify-center items-center gap-3 mb-4">
              <img 
                src="/images/branding/mini-logo.png" 
                alt="IBAM Mini Logo"
                className="h-8 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="text-xl md:text-2xl font-bold">International Business as Mission</span>
            </div>
            <p className="text-gray-400 text-lg md:text-xl">
              © 2025 IBAM International Business as Mission. Equipping entrepreneurs to transform communities through faith-driven business.
            </p>
            <p style={{color: '#4ECDC4'}} className="text-base md:text-lg mt-2 font-semibold">
              DESIGNED TO THRIVE
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  FunnelChart, Funnel, LabelList
} from 'recharts';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function SuperAdminDashboard() {
  const [activeUsers, setActiveUsers] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [avgCompletion, setAvgCompletion] = useState(0);
  const [funnelData, setFunnelData] = useState<any[]>([]);
  const [moduleProgress, setModuleProgress] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [userCohorts, setUserCohorts] = useState<any[]>([]);
  const [feedbackSentiment, setFeedbackSentiment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  useEffect(() => {
    loadDashboardData();
    // Refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, [selectedTimeRange]);

  const loadDashboardData = async () => {
    try {
      // Get total users
      const { count: userCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });
      setTotalUsers(userCount || 0);

      // Get active users (last 24 hours)
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data: activeData } = await supabase
        .from('user_activity_log')
        .select('user_id')
        .gte('created_at', yesterday);
      const uniqueActive = new Set(activeData?.map(a => a.user_id) || []);
      setActiveUsers(uniqueActive.size);

      // Get feedback count
      const { count: fbCount } = await supabase
        .from('user_feedback')
        .select('*', { count: 'exact', head: true });
      setFeedbackCount(fbCount || 0);

      // Get average completion
      const { data: completionData } = await supabase
        .from('module_completion')
        .select('completion_percentage');
      const avg = completionData?.reduce((sum, c) => sum + (c.completion_percentage || 0), 0) / (completionData?.length || 1);
      setAvgCompletion(Math.round(avg || 0));

      // Load funnel data
      await loadFunnelData();
      
      // Load module progress
      await loadModuleProgress();
      
      // Load recent activity
      await loadRecentActivity();
      
      // Load user cohorts
      await loadUserCohorts();
      
      // Load feedback sentiment
      await loadFeedbackSentiment();

      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setLoading(false);
    }
  };

  const loadFunnelData = async () => {
    // Simulated funnel data - replace with real queries
    const funnel = [
      { name: 'Sign Up', value: 1000, fill: '#8B5CF6' },
      { name: 'First Login', value: 850, fill: '#7C3AED' },
      { name: 'Module 1 Start', value: 620, fill: '#6D28D9' },
      { name: 'Module 1 Complete', value: 380, fill: '#5B21B6' },
      { name: 'Module 2 Start', value: 290, fill: '#4C1D95' },
      { name: 'Module 3+', value: 180, fill: '#3B0E79' },
      { name: 'Course Complete', value: 95, fill: '#2E0A5C' }
    ];
    setFunnelData(funnel);
  };

  const loadModuleProgress = async () => {
    const { data } = await supabase
      .from('module_completion')
      .select('module_id, completion_percentage')
      .order('module_id');
    
    const grouped = data?.reduce((acc: any, curr) => {
      const module = `Module ${curr.module_id}`;
      if (!acc[module]) {
        acc[module] = { name: module, completed: 0, inProgress: 0, notStarted: 0 };
      }
      if (curr.completion_percentage === 100) acc[module].completed++;
      else if (curr.completion_percentage > 0) acc[module].inProgress++;
      else acc[module].notStarted++;
      return acc;
    }, {});

    setModuleProgress(Object.values(grouped || {}));
  };

  const loadRecentActivity = async () => {
    const { data } = await supabase
      .from('user_activity_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    
    setRecentActivity(data || []);
  };

  const loadUserCohorts = async () => {
    const { data } = await supabase
      .from('user_profiles')
      .select('login_source');
    
    const grouped = data?.reduce((acc: any, curr) => {
      const source = curr.login_source || 'Direct';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {});

    const cohortData = Object.entries(grouped || {}).map(([name, value]) => ({
      name,
      value,
      percentage: Math.round(((value as number) / (data?.length || 1)) * 100)
    }));

    setUserCohorts(cohortData);
  };

  const loadFeedbackSentiment = async () => {
    const { data } = await supabase
      .from('user_feedback')
      .select('type, created_at')
      .order('created_at');
    
    // Group by day
    const grouped = data?.reduce((acc: any, curr) => {
      const date = new Date(curr.created_at).toLocaleDateString();
      if (!acc[date]) acc[date] = { date, bugs: 0, features: 0, ratings: 0 };
      if (curr.type === 'bug') acc[date].bugs++;
      else if (curr.type === 'feature') acc[date].features++;
      else if (curr.type === 'rating') acc[date].ratings++;
      return acc;
    }, {});

    setFeedbackSentiment(Object.values(grouped || {}).slice(-7));
  };

  const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl text-purple-600">Loading Analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              🎯 Super Admin Analytics Dashboard
            </h1>
            <div className="flex gap-2">
              {['24h', '7d', '30d', 'all'].map(range => (
                <button
                  key={range}
                  onClick={() => setSelectedTimeRange(range)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedTimeRange === range 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {range === 'all' ? 'All Time' : `Last ${range}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
                <p className="text-sm text-green-600 mt-2">↑ 12% from last week</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Today</p>
                <p className="text-3xl font-bold text-purple-600">{activeUsers}</p>
                <p className="text-sm text-gray-600 mt-2">{Math.round((activeUsers / totalUsers) * 100)}% of users</p>
              </div>
              <div className="text-4xl">🔥</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Completion</p>
                <p className="text-3xl font-bold text-blue-600">{avgCompletion}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${avgCompletion}%` }}></div>
                </div>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Feedback Items</p>
                <p className="text-3xl font-bold text-orange-600">{feedbackCount}</p>
                <p className="text-sm text-orange-600 mt-2">5 new today</p>
              </div>
              <div className="text-4xl">💬</div>
            </div>
          </div>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">📈 Conversion Funnel</h2>
          <ResponsiveContainer width="100%" height={300}>
            <FunnelChart>
              <Tooltip />
              <Funnel
                dataKey="value"
                data={funnelData}
                isAnimationActive
              >
                <LabelList position="center" fill="#fff" />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-7 gap-2 mt-4">
            {funnelData.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-gray-500">{item.name}</div>
                <div className="font-bold" style={{ color: item.fill }}>{item.value}</div>
                {index > 0 && (
                  <div className="text-xs text-gray-400">
                    {Math.round((item.value / funnelData[index - 1].value) * 100)}% →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Module Progress & User Cohorts */}
      <div className="px-6 pb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">📚 Module Progress</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={moduleProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" stackId="a" fill="#10B981" />
              <Bar dataKey="inProgress" stackId="a" fill="#F59E0B" />
              <Bar dataKey="notStarted" stackId="a" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">👥 User Sources</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={userCohorts}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {userCohorts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Feedback Trends */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">💭 Feedback Trends</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={feedbackSentiment}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="bugs" stroke="#EF4444" name="Bugs" />
              <Line type="monotone" dataKey="features" stroke="#3B82F6" name="Features" />
              <Line type="monotone" dataKey="ratings" stroke="#10B981" name="Ratings" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">⚡ Real-Time Activity Feed</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {activity.activity_type === 'page_view' && '👀'}
                    {activity.activity_type === 'feedback_submitted' && '💬'}
                    {activity.activity_type === 'session_rated' && '⭐'}
                    {activity.activity_type === 'video_play' && '▶️'}
                    {!['page_view', 'feedback_submitted', 'session_rated', 'video_play'].includes(activity.activity_type) && '📌'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {activity.activity_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                    <p className="text-sm text-gray-500">
                      User {activity.user_id.slice(0, 8)}... • {activity.module_id && `Module ${activity.module_id}`}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(activity.created_at).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="px-6 pb-6">
        <div className="bg-purple-100 rounded-xl p-6 border-2 border-purple-300">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-purple-900">Export Analytics Report</h3>
              <p className="text-sm text-purple-700 mt-1">Download comprehensive analytics data for {selectedTimeRange}</p>
            </div>
            <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
              📥 Export to CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { BarChart, Star, MessageSquare, TrendingUp, Users, Download } from 'lucide-react';

interface FeedbackData {
  session_id: string;
  module_id: string;
  content_effectiveness: number;
  learning_format: number;
  recommendation_likelihood: number;
  comments: string;
  created_at: string;
}

interface SessionStats {
  session_id: string;
  module_id: string;
  avg_content: number;
  avg_format: number;
  avg_recommendation: number;
  total_responses: number;
  comments: string[];
}

export default function SessionFeedbackAnalytics() {
  const [feedbackData, setFeedbackData] = useState<FeedbackData[]>([]);
  const [sessionStats, setSessionStats] = useState<SessionStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [dateRange, setDateRange] = useState('7');
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchFeedback();
  }, [dateRange]);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(dateRange));

      const { data, error } = await supabase
        .from('session_feedback')
        .select('*')
        .gte('created_at', daysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      setFeedbackData(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: FeedbackData[]) => {
    const statsMap = new Map<string, SessionStats>();

    data.forEach(feedback => {
      const key = feedback.session_id;
      
      if (!statsMap.has(key)) {
        statsMap.set(key, {
          session_id: feedback.session_id,
          module_id: feedback.module_id,
          avg_content: 0,
          avg_format: 0,
          avg_recommendation: 0,
          total_responses: 0,
          comments: []
        });
      }

      const stats = statsMap.get(key)!;
      stats.total_responses++;
      stats.avg_content += feedback.content_effectiveness || 0;
      stats.avg_format += feedback.learning_format || 0;
      stats.avg_recommendation += feedback.recommendation_likelihood || 0;
      if (feedback.comments && feedback.comments !== 'SKIPPED') {
        stats.comments.push(feedback.comments);
      }
    });

    // Calculate averages
    statsMap.forEach(stats => {
      if (stats.total_responses > 0) {
        stats.avg_content /= stats.total_responses;
        stats.avg_format /= stats.total_responses;
        stats.avg_recommendation /= stats.total_responses;
      }
    });

    setSessionStats(Array.from(statsMap.values()));
  };

  const exportToCSV = () => {
    const csv = [
      ['Session ID', 'Module ID', 'Avg Content', 'Avg Format', 'Avg Recommendation', 'Total Responses', 'Comments'],
      ...sessionStats.map(s => [
        s.session_id,
        s.module_id,
        s.avg_content.toFixed(2),
        s.avg_format.toFixed(2),
        s.avg_recommendation.toFixed(2),
        s.total_responses,
        s.comments.join('; ')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session-feedback-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getEmojiForRating = (rating: number) => {
    if (rating >= 4.5) return '🤩';
    if (rating >= 4) return '😊';
    if (rating >= 3) return '🙂';
    if (rating >= 2) return '😐';
    return '😕';
  };

  const getColorForRating = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Overall stats
  const overallStats = {
    totalResponses: feedbackData.length,
    avgContent: feedbackData.reduce((acc, f) => acc + (f.content_effectiveness || 0), 0) / feedbackData.length || 0,
    avgFormat: feedbackData.reduce((acc, f) => acc + (f.learning_format || 0), 0) / feedbackData.length || 0,
    avgRecommendation: feedbackData.reduce((acc, f) => acc + (f.recommendation_likelihood || 0), 0) / feedbackData.length || 0,
    totalComments: feedbackData.filter(f => f.comments && f.comments !== 'SKIPPED').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 mb-8 text-white shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center">
                <BarChart className="w-10 h-10 mr-3" />
                Session Feedback Analytics
              </h1>
              <p className="text-blue-100">Anonymous student feedback from all sessions</p>
            </div>
            <button
              onClick={exportToCSV}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-all flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Date Range</h3>
            <div className="flex gap-2">
              {['7', '30', '90', '365'].map(days => (
                <button
                  key={days}
                  onClick={() => setDateRange(days)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    dateRange === days
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {days === '365' ? 'All Time' : `Last ${days} Days`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Overall Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Responses</p>
                <p className="text-3xl font-bold text-gray-800">{overallStats.totalResponses}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Content Value</p>
                <p className={`text-3xl font-bold ${getColorForRating(overallStats.avgContent)}`}>
                  {overallStats.avgContent.toFixed(1)} {getEmojiForRating(overallStats.avgContent)}
                </p>
              </div>
              <Star className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Format Rating</p>
                <p className={`text-3xl font-bold ${getColorForRating(overallStats.avgFormat)}`}>
                  {overallStats.avgFormat.toFixed(1)} {getEmojiForRating(overallStats.avgFormat)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Would Recommend</p>
                <p className={`text-3xl font-bold ${getColorForRating(overallStats.avgRecommendation)}`}>
                  {overallStats.avgRecommendation.toFixed(1)} {getEmojiForRating(overallStats.avgRecommendation)}
                </p>
              </div>
              <Star className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-pink-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Comments</p>
                <p className="text-3xl font-bold text-gray-800">{overallStats.totalComments}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-pink-500" />
            </div>
          </div>
        </div>

        {/* Session Details Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4">
            <h3 className="text-xl font-bold text-white">Session-by-Session Breakdown</h3>
          </div>
          
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading feedback data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Format</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Recommend</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Responses</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sessionStats.map((session, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {session.session_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Module {session.module_id}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-lg font-bold ${getColorForRating(session.avg_content)}`}>
                          {session.avg_content.toFixed(1)} {getEmojiForRating(session.avg_content)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-lg font-bold ${getColorForRating(session.avg_format)}`}>
                          {session.avg_format.toFixed(1)} {getEmojiForRating(session.avg_format)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-lg font-bold ${getColorForRating(session.avg_recommendation)}`}>
                          {session.avg_recommendation.toFixed(1)} {getEmojiForRating(session.avg_recommendation)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">
                        {session.total_responses}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {session.comments.length > 0 ? (
                          <button
                            onClick={() => alert(session.comments.join('\n\n'))}
                            className="text-purple-600 hover:text-purple-800 underline"
                          >
                            View ({session.comments.length})
                          </button>
                        ) : (
                          <span className="text-gray-400">None</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IBAM Entrepreneur Session - Business as God's Gift</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.5;
            color: #1a202c;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }

        /* Gamification Header */
        .game-header {
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(10px);
            padding: 1rem;
            position: sticky;
            top: 0;
            z-index: 100;
            border-bottom: 1px solid rgba(0,0,0,0.1);
        }

        .game-stats {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
        }

        .xp-badge {
            background: linear-gradient(45deg, #ff6b6b, #ffa726);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 700;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .streak-counter {
            background: linear-gradient(45deg, #4ecdc4, #44a08d);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 700;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .achievement-badge {
            background: linear-gradient(45deg, #a8edea, #fed6e3);
            color: #2d3748;
            padding: 0.25rem 0.75rem;
            border-radius: 15px;
            font-size: 0.8rem;
            font-weight: 600;
        }

        /* Session Container */
        .session-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 1rem;
        }

        /* Hero Section */
        .session-hero {
            background: white;
            border-radius: 20px;
            padding: 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .session-hero::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #ff6b6b, #ffa726, #4ecdc4);
        }

        .session-title {
            font-size: 2rem;
            font-weight: 800;
            color: #2d3748;
            margin-bottom: 0.5rem;
        }

        .session-subtitle {
            color: #718096;
            font-size: 1.1rem;
            margin-bottom: 2rem;
        }

        /* Mode Selector */
        .mode-selector {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin: 2rem 0;
        }

        .mode-card {
            background: white;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            padding: 1.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
            position: relative;
        }

        .mode-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            border-color: #4299e1;
        }

        .mode-card.active {
            border-color: #4299e1;
            background: linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%);
        }

        .mode-icon {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }

        .mode-time {
            background: #4299e1;
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 600;
            position: absolute;
            top: -8px;
            right: 12px;
        }

        /* Section Cards */
        .section-card {
            background: white;
            border-radius: 16px;
            margin-bottom: 1.5rem;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            transition: all 0.3s ease;
        }

        .section-card.completed {
            border-left: 4px solid #48bb78;
        }

        .section-card.active {
            transform: scale(1.02);
            box-shadow: 0 8px 30px rgba(0,0,0,0.12);
        }

        .section-header {
            padding: 1.5rem;
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .section-info {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .section-emoji {
            font-size: 2rem;
            padding: 0.5rem;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .section-details h3 {
            font-size: 1.3rem;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 0.25rem;
        }

        .section-details p {
            color: #718096;
            font-size: 0.9rem;
        }

        .section-status {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .time-badge {
            background: #4299e1;
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 600;
        }

        .completion-check {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            transition: all 0.3s ease;
        }

        .completion-check.completed {
            background: #48bb78;
            color: white;
        }

        /* Section Content */
        .section-content {
            display: none;
            padding: 0;
        }

        .section-content.active {
            display: block;
            animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .content-area {
            padding: 2rem;
        }

        /* Timer Bar */
        .timer-bar {
            background: #e2e8f0;
            height: 4px;
            width: 100%;
            position: relative;
            overflow: hidden;
        }

        .timer-progress {
            background: linear-gradient(90deg, #4299e1, #48bb78);
            height: 100%;
            width: 0%;
            transition: width 0.5s ease;
        }

        /* Business Language Components */
        .strategic-review {
            background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
            border-radius: 12px;
            padding: 1.5rem;
            margin: 1.5rem 0;
        }

        .leadership-development {
            background: linear-gradient(135deg, #d6f5d6 0%, #9ae6b4 100%);
            border-radius: 12px;
            padding: 1.5rem;
            margin: 1.5rem 0;
        }

        .action-planning {
            background: linear-gradient(135deg, #bee3f8 0%, #90cdf4 100%);
            border-radius: 12px;
            padding: 1.5rem;
            margin: 1.5rem 0;
        }

        /* Quick Input Styles */
        .quick-input {
            background: white;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            padding: 1rem;
            width: 100%;
            font-size: 1rem;
            transition: all 0.3s ease;
        }

        .quick-input:focus {
            outline: none;
            border-color: #4299e1;
            box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
        }

        /* Action Button */
        .action-btn {
            background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 0.75rem 2rem;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin: 1rem auto;
        }

        .action-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(66, 153, 225, 0.4);
        }

        .action-btn:active {
            transform: scale(0.98);
        }

        /* Success Celebration */
        .celebration {
            text-align: center;
            padding: 2rem;
            display: none;
        }

        .celebration.active {
            display: block;
            animation: celebrate 0.6s ease;
        }

        @keyframes celebrate {
            0% { opacity: 0; transform: scale(0.8); }
            50% { transform: scale(1.1); }
            100% { opacity: 1; transform: scale(1); }
        }

        .celebration-emoji {
            font-size: 4rem;
            margin-bottom: 1rem;
            animation: bounce 1s infinite;
        }

        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
        }

        /* Expandable Scripture */
        .scripture-expandable {
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            border: 1px solid #cbd5e0;
            border-radius: 8px;
            margin: 1rem 0;
            overflow: hidden;
        }

        .scripture-trigger {
            padding: 1rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #4299e1;
            font-weight: 600;
        }

        .scripture-content {
            display: none;
            padding: 0 1rem 1rem;
            font-style: italic;
            color: #4a5568;
            border-top: 1px solid #e2e8f0;
            background: white;
        }

        .scripture-content.expanded {
            display: block;
            animation: expandDown 0.3s ease;
        }

        @keyframes expandDown {
            from { opacity: 0; max-height: 0; }
            to { opacity: 1; max-height: 200px; }
        }

        /* Video Section */
        .video-section {
            background: #1a202c;
            border-radius: 12px;
            padding: 2rem;
            text-align: center;
            color: white;
            margin: 1.5rem 0;
        }

        .video-placeholder {
            background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
            border-radius: 8px;
            padding: 3rem 2rem;
            margin: 1rem 0;
        }

        .play-button {
            background: #e53e3e;
            color: white;
            border: none;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            font-size: 1.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-bottom: 1rem;
        }

        .play-button:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 15px rgba(229, 62, 62, 0.4);
        }

        /* Survey Simplified */
        .quick-feedback {
            background: linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%);
            border-radius: 12px;
            padding: 1.5rem;
            margin: 2rem 0;
            text-align: center;
        }

        .feedback-emoji {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin: 1rem 0;
        }

        .emoji-btn {
            font-size: 2rem;
            padding: 0.5rem;
            border: 2px solid transparent;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
            background: white;
        }

        .emoji-btn:hover {
            transform: scale(1.1);
            border-color: #48bb78;
        }

        .emoji-btn.selected {
            border-color: #48bb78;
            background: #c6f6d5;
        }

        /* Mobile Optimizations */
        @media (max-width: 768px) {
            .session-container {
                padding: 0.5rem;
            }

            .session-hero {
                padding: 1.5rem;
                margin-bottom: 1rem;
            }

            .session-title {
                font-size: 1.5rem;
            }

            .mode-selector {
                grid-template-columns: 1fr;
            }

            .game-stats {
                flex-direction: column;
                gap: 0.5rem;
            }

            .section-header {
                padding: 1rem;
            }

            .content-area {
                padding: 1rem;
            }
        }

        /* Loading Animation */
        .loading-spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid #f3f3f3;
            border-top: 2px solid #4299e1;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <!-- Gamification Header -->
    <header class="game-header">
        <div class="game-stats">
            <div class="xp-badge">
                ⚡ 350 XP
            </div>
            <div class="achievement-badge">
                🏆 Action Taker
            </div>
            <div class="streak-counter">
                🔥 7 Day Streak
            </div>
        </div>
    </header>

    <div class="session-container">
        <!-- Hero Section -->
        <div class="session-hero">
            <h1 class="session-title">Business is God's Gift</h1>
            <p class="session-subtitle">Build your faith-driven business with confidence</p>
            
            <!-- Mode Selector -->
            <div class="mode-selector">
                <div class="mode-card active" onclick="selectMode('quick')">
                    <div class="mode-time">5 min</div>
                    <div class="mode-icon">⚡</div>
                    <h3>Quick Win</h3>
                    <p>Key insight + action</p>
                </div>
                <div class="mode-card" onclick="selectMode('standard')">
                    <div class="mode-time">15 min</div>
                    <div class="mode-icon">🎯</div>
                    <h3>Complete</h3>
                    <p>Full learning experience</p>
                </div>
                <div class="mode-card" onclick="selectMode('deep')">
                    <div class="mode-time">30 min</div>
                    <div class="mode-icon">🔍</div>
                    <h3>Deep Dive</h3>
                    <p>Extended with exercises</p>
                </div>
            </div>
        </div>

        <!-- Progress Timer -->
        <div class="timer-bar">
            <div class="timer-progress" id="overallProgress"></div>
        </div>

        <!-- Strategic Review Section -->
        <div class="section-card" id="review-section">
            <div class="section-header" onclick="toggleSection('review')">
                <div class="section-info">
                    <div class="section-emoji">👈</div>
                    <div class="section-details">
                        <h3>Strategic Review</h3>
                        <p>Celebrate wins & learn from challenges</p>
                    </div>
                </div>
                <div class="section-status">
                    <div class="time-badge">3 min</div>
                    <div class="completion-check" id="review-check">○</div>
                </div>
            </div>
            <div class="section-content" id="review-content">
                <div class="timer-bar">
                    <div class="timer-progress" id="reviewProgress"></div>
                </div>
                <div class="content-area">
                    <div class="strategic-review">
                        <h4>🎯 This Week's Vision</h4>
                        <p><strong>"Love God and serve your community through excellent business, while multiplying leaders in your marketplace."</strong></p>
                    </div>

                    <h4>Last Week's Commitment Check:</h4>
                    <div style="display: flex; gap: 1rem; margin: 1rem 0; flex-wrap: wrap;">
                        <button class="action-btn" onclick="handleAccountability('yes')" style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);">
                            ✅ I did it!
                        </button>
                        <button class="action-btn" onclick="handleAccountability('no')" style="background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);">
                            📝 Learned something
                        </button>
                    </div>

                    <div id="accountability-response" style="display: none;">
                        <textarea class="quick-input" placeholder="What happened? How did God work through this experience?" rows="3"></textarea>
                    </div>

                    <button class="action-btn" onclick="completeSection('review')">
                        ✅ Complete Strategic Review
                    </button>
                </div>
            </div>
        </div>

        <!-- Learning Section -->
        <div class="section-card" id="learning-section">
            <div class="section-header" onclick="toggleSection('learning')">
                <div class="section-info">
                    <div class="section-emoji">☝️</div>
                    <div class="section-details">
                        <h3>Business Insights</h3>
                        <p>Core content & biblical foundation</p>
                    </div>
                </div>
                <div class="section-status">
                    <div class="time-badge">8 min</div>
                    <div class="completion-check" id="learning-check">○</div>
                </div>
            </div>
            <div class="section-content" id="learning-content">
                <div class="timer-bar">
                    <div class="timer-progress" id="learningProgress"></div>
                </div>
                <div class="content-area">
                    <!-- Video Section -->
                    <div class="video-section">
                        <h3>📹 Core Training: Business as God's Gift</h3>
                        <div class="video-placeholder">
                            <button class="play-button" onclick="playVideo()">▶</button>
                            <p>15-minute biblical foundation for entrepreneurship</p>
                        </div>
                        <a href="https://biztools33.com/vimeo/trainer/jpbgUHMfeo/en" target="_blank" class="action-btn">
                            🎥 Watch Now
                        </a>
                    </div>

                    <!-- Key Insights -->
                    <div class="leadership-development">
                        <h4>💡 Key Biblical Business Truths:</h4>
                        <ul style="margin: 1rem 0; padding-left: 1.5rem;">
                            <li><strong>Business was part of God's original design</strong> - before the fall</li>
                            <li><strong>Business provides for families</strong> - God's chosen means</li>
                            <li><strong>Business funds ministry</strong> - supporting kingdom work</li>
                            <li><strong>Business multiplies leaders</strong> - platform for influence</li>
                        </ul>
                    </div>

                    <!-- Expandable Scripture -->
                    <div class="scripture-expandable">
                        <div class="scripture-trigger" onclick="toggleScripture()">
                            <span>📖 Genesis 1:26 - God's Original Business Plan</span>
                            <span id="scripture-arrow">▼</span>
                        </div>
                        <div class="scripture-content" id="scripture-text">
                            <p>"Then God said, 'Let us make man in our image, after our likeness. And let them have dominion over the fish of the sea and over the birds of the heavens and over the livestock and over all the earth.'"</p>
                            <p style="margin-top: 0.5rem; font-size: 0.9rem; color: #718096;">English Standard Version (ESV)</p>
                        </div>
                    </div>

                    <!-- Quick Knowledge Check -->
                    <div style="background: white; border-radius: 8px; padding: 1.5rem; border: 2px solid #e2e8f0;">
                        <h4>🤔 Quick Check: What's the biblical foundation for business?</h4>
                        <div style="margin: 1rem 0;">
                            <label style="display: flex; align-items: center; gap: 0.5rem; margin: 0.5rem 0;">
                                <input type="radio" name="question" value="a"> Business was created after the fall
                            </label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; margin: 0.5rem 0;">
                                <input type="radio" name="question" value="b"> Business is part of God's original design
                            </label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; margin: 0.5rem 0;">
                                <input type="radio" name="question" value="c"> Business is only for non-Christians
                            </label>
                        </div>
                    </div>

                    <button class="action-btn" onclick="completeSection('learning')">
                        ✅ Got the Insights
                    </button>
                </div>
            </div>
        </div>

        <!-- Action Planning Section -->
        <div class="section-card" id="action-section">
            <div class="section-header" onclick="toggleSection('action')">
                <div class="section-info">
                    <div class="section-emoji">👉</div>
                    <div class="section-details">
                        <h3>Action Planning</h3>
                        <p>One specific commitment for this week</p>
                    </div>
                </div>
                <div class="section-status">
                    <div class="time-badge">4 min</div>
                    <div class="completion-check" id="action-check">○</div>
                </div>
            </div>
            <div class="section-content" id="action-content">
                <div class="timer-bar">
                    <div class="timer-progress" id="actionProgress"></div>
                </div>
                <div class="content-area">
                    <div class="action-planning">
                        <h4>🎯 This Week's Business Action</h4>
                        <p>Make one specific commitment that demonstrates biblical character in your business:</p>
                        
                        <textarea class="quick-input" 
                            placeholder="Example: 'I will pray for my top 3 customers by name every morning this week, then reach out to check on their business needs.'" 
                            rows="3"
                            id="weeklyCommitment"></textarea>

                        <div style="background: white; border-radius: 8px; padding: 1rem; margin: 1rem 0; border-left: 4px solid #4299e1;">
                            <h5>💡 SMART Goal Tip:</h5>
                            <p>Make it <strong>Specific, Measurable, Achievable, Relevant, Time-bound</strong>. Include WHO, WHAT, WHEN for maximum success.</p>
                        </div>
                    </div>

                    <!-- Business Plan Builder Simplified -->
                    <div style="background: linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%); border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
                        <h4>📋 Business Plan Builder</h4>
                        <p><strong>Session Question:</strong> How will your business reflect God's character to customers?</p>
                        <input type="text" class="quick-input" placeholder="e.g., Through honest pricing, excellent service, and caring for employee families" style="margin-top: 0.5rem;">
                    </div>

                    <button class="action-btn" onclick="completeSection('action')">
                        🚀 Lock in My Commitment
                    </button>
                </div>
            </div>
        </div>

        <!-- Success Celebration -->
        <div class="celebration" id="completion-celebration">
            <div class="celebration-emoji">🎉</div>
            <h2>Session Complete!</h2>
            <p>You've earned <strong>+50 XP</strong> and unlocked the <strong>"Business Builder"</strong> badge!</p>
            
            <!-- Quick Feedback -->
            <div class="quick-feedback">
                <h4>Quick feedback to help us improve:</h4>
                <p>How was this session?</p>
                <div class="feedback-emoji">
                    <div class="emoji-btn" onclick="submitFeedback('great')">😍</div>
                    <div class="emoji-btn" onclick="submitFeedback('good')">😊</div>
                    <div class="emoji-btn" onclick="submitFeedback('okay')">😐</div>
                    <div class="emoji-btn" onclick="submitFeedback('poor')">😕</div>
                </div>
                <div id="feedback-thanks" style="display: none; margin-top: 1rem; color: #48bb78; font-weight: 600;">
                    ✅ Thanks! Your feedback helps us improve.
                </div>
            </div>

            <button class="action-btn" onclick="goToNextSession()">
                ➡️ Next Session
            </button>
        </div>
    </div>

    <script>
        let currentMode = 'quick';
        let completedSections = new Set();
        let sectionTimers = {};

        function selectMode(mode) {
            currentMode = mode;
            const cards = document.querySelectorAll('.mode-card');
            cards.forEach(card => card.classList.remove('active'));
            event.target.closest('.mode-card').classList.add('active');
            
            // Adjust content based on mode
            adjustContentForMode(mode);
        }

        function adjustContentForMode(mode) {
            const deepElements = document.querySelectorAll('.deep-mode-only');
            const quickElements = document.querySelectorAll('.quick-mode-only');
            
            deepElements.forEach(el => el.style.display = mode === 'deep' ? 'block' : 'none');
            quickElements.forEach(el => el.style.display = mode === 'quick' ? 'block' : 'none');
            
            // Adjust time estimates
            const timeBadges = document.querySelectorAll('.time-badge');
            if (mode === 'quick') {
                timeBadges[0].textContent = '1 min';
                timeBadges[1].textContent = '3 min';
                timeBadges[2].textContent = '1 min';
            } else if (mode === 'standard') {
                timeBadges[0].textContent = '3 min';
                timeBadges[1].textContent = '8 min';
                timeBadges[2].textContent = '4 min';
            } else {
                timeBadges[0].textContent = '8 min';
                timeBadges[1].textContent = '15 min';
                timeBadges[2].textContent = '7 min';
            }
        }

        function toggleSection(sectionId) {
            const content = document.getElementById(sectionId + '-content');
            const isActive = content.classList.contains('active');
            
            // Close all sections
            document.querySelectorAll('.section-content').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.section-card').forEach(el => el.classList.remove('active'));
            
            if (!isActive) {
                content.classList.add('active');
                document.getElementById(sectionId + '-section').classList.add('active');
                startSectionTimer(sectionId);
            }
        }

        function startSectionTimer(sectionId) {
            const progressBar = document.getElementById(sectionId + 'Progress');
            const durations = {
                'review': currentMode === 'quick' ? 60 : currentMode === 'standard' ? 180 : 480,
                'learning': currentMode === 'quick' ? 180 : currentMode === 'standard' ? 480 : 900,
                'action': currentMode === 'quick' ? 60 : currentMode === 'standard' ? 240 : 420
            };
            
            const duration = durations[sectionId];
            let elapsed = 0;
            
            const timer = setInterval(() => {
                elapsed += 100;
                const progress = (elapsed / (duration * 1000)) * 100;
                progressBar.style.width = Math.min(progress, 100) + '%';
                
                if (progress >= 100) {
                    clearInterval(timer);
                }
            }, 100);
            
            sectionTimers[sectionId] = timer;
        }

        function completeSection(sectionId) {
            completedSections.add(sectionId);
            
            // Update completion check
            const check = document.getElementById(sectionId + '-check');
            check.classList.add('completed');
            check.textContent = '✓';
            
            // Update section card
            const card = document.getElementById(sectionId + '-section');
            card.classList.add('completed');
            
            // Close section with celebration
            document.getElementById(sectionId + '-content').classList.remove('active');
            card.classList.remove('active');
            
            // Show mini celebration
            showMiniCelebration();
            
            // Update overall progress
            updateOverallProgress();
            
            // Check if all sections completed
            if (completedSections.size === 3) {
                setTimeout(() => {
                    document.getElementById('completion-celebration').classList.add('active');
                    document.querySelector('.session-container').style.paddingBottom = '2rem';
                }, 500);
            }
        }

        function showMiniCelebration() {
            // Create floating celebration
            const celebration = document.createElement('div');
            celebration.innerHTML = '🎉 +10 XP';
            celebration.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(45deg, #ff6b6b, #ffa726);
                color: white;
                padding: 1rem 2rem;
                border-radius: 20px;
                font-weight: 700;
                z-index: 1000;
                animation: popUp 2s ease forwards;
            `;
            
            document.body.appendChild(celebration);
            
            setTimeout(() => {
                document.body.removeChild(celebration);
            }, 2000);
        }

        function updateOverallProgress() {
            const progress = (completedSections.size / 3) * 100;
            document.getElementById('overallProgress').style.width = progress + '%';
        }

        function handleAccountability(response) {
            const responseDiv = document.getElementById('accountability-response');
            responseDiv.style.display = 'block';
            
            if (response === 'yes') {
                responseDiv.innerHTML = `
                    <div style="background: #c6f6d5; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                        <h5>🎉 Awesome! Share your victory:</h5>
                    </div>
                    <textarea class="quick-input" placeholder="What happened? How did God work through your commitment?" rows="3"></textarea>
                `;
            } else {
                responseDiv.innerHTML = `
                    <div style="background: #fed7d7; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                        <h5>📝 No worries! What did you learn?</h5>
                    </div>
                    <textarea class="quick-input" placeholder="What obstacles came up? What will you do differently?" rows="3"></textarea>
                `;
            }
        }

        function toggleScripture() {
            const content = document.getElementById('scripture-text');
            const arrow = document.getElementById('scripture-arrow');
            
            if (content.classList.contains('expanded')) {
                content.classList.remove('expanded');
                arrow.textContent = '▼';
            } else {
                content.classList.add('expanded');
                arrow.textContent = '▲';
            }
        }

        function playVideo() {
            // In real implementation, this would launch video player
            alert('🎥 Video would launch here! Redirecting to training video...');
        }

        function submitFeedback(rating) {
            const buttons = document.querySelectorAll('.emoji-btn');
            buttons.forEach(btn => btn.classList.remove('selected'));
            event.target.classList.add('selected');
            
            // Show thanks message
            setTimeout(() => {
                document.getElementById('feedback-thanks').style.display = 'block';
            }, 500);
        }

        function goToNextSession() {
            alert('🚀 Great work! Next session: "Understanding Your Market" will be unlocked tomorrow.');
        }

        // Auto-save functionality
        document.addEventListener('input', function(e) {
            if (e.target.classList.contains('quick-input')) {
                // Auto-save to localStorage
                localStorage.setItem('ibam-session-data', JSON.stringify({
                    timestamp: new Date().toISOString(),
                    [e.target.id || 'unnamed']: e.target.value
                }));
            }
        });

        // Add CSS animation for celebration
        const style = document.createElement('style');
        style.textContent = `
            @keyframes popUp {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                100% { opacity: 0; transform: translate(-50%, -200%) scale(0.8); }
            }
        `;
        document.head.appendChild(style);

        // Initialize page
        document.addEventListener('DOMContentLoaded', function() {
            selectMode('standard');
        });
    </script>
</body>
</html>
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function loadChildDetail() {
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Error getting user:', userError);
    window.location.href = 'auth.html';
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const childId = urlParams.get('id');

  if (!childId) {
    window.location.href = 'parent-children.html';
    return;
  }

  const loadingMessage = document.getElementById('loadingMessage');
  const childContent = document.getElementById('childContent');

  try {
    const { data: child, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', childId)
      .eq('parent_id', user.id)
      .eq('account_type', 'student')
      .maybeSingle();

    if (error) {
      console.error('Error loading child:', error);
      loadingMessage.innerHTML = '<p class="text-red-600 font-bold">Error loading child details. Please try again.</p>';
      return;
    }

    if (!child) {
      loadingMessage.innerHTML = '<p class="text-red-600 font-bold">Child not found or you do not have permission to view this profile.</p>';
      return;
    }

    loadingMessage.style.display = 'none';
    childContent.style.display = 'block';

    displayChildDetails(child);

  } catch (err) {
    console.error('Unexpected error:', err);
    loadingMessage.innerHTML = '<p class="text-red-600 font-bold">An unexpected error occurred.</p>';
  }
}

function displayChildDetails(child) {
  const childName = document.getElementById('childName');
  const childInfo = document.getElementById('childInfo');
  const childAvatar = document.getElementById('childAvatar');
  const recentActivity = document.getElementById('recentActivity');

  childName.textContent = `${child.first_name || child.username || 'Student'}'s Profile`;

  const infoItems = [];
  if (child.username) infoItems.push(`Username: @${escapeHtml(child.username)}`);
  if (child.age) infoItems.push(`Age: ${child.age} years old`);
  if (child.grade_level) infoItems.push(`Grade: ${escapeHtml(child.grade_level)}`);
  if (child.email) infoItems.push(`Email: ${escapeHtml(child.email)}`);

  const joinDate = new Date(child.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  infoItems.push(`Joined: ${joinDate}`);

  childInfo.textContent = infoItems.join(' • ');

  if (child.avatar_url) {
    childAvatar.innerHTML = `<img src="${child.avatar_url}" alt="${child.first_name}" class="w-32 h-32 rounded-full object-cover mx-auto shadow-lg" />`;
  } else {
    childAvatar.innerHTML = `<div class="text-8xl">${getDefaultEmoji(child.first_name || child.username)}</div>`;
  }

  recentActivity.innerHTML = `
    <div class="card mb-6">
      <h2 class="font-fredoka text-2xl font-black mb-4 text-slate-800">
        <i class="fas fa-chart-line text-green-500"></i> Learning Progress
      </h2>
      <p class="text-slate-600 mb-4">Track ${child.first_name}'s learning journey and achievements.</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-purple-50 rounded-2xl p-4 text-center">
          <div class="text-3xl font-black text-purple-600 font-fredoka">0</div>
          <div class="text-sm font-bold text-slate-600 mt-1">Stories Completed</div>
        </div>
        <div class="bg-green-50 rounded-2xl p-4 text-center">
          <div class="text-3xl font-black text-green-600 font-fredoka">0 hrs</div>
          <div class="text-sm font-bold text-slate-600 mt-1">Learning Time</div>
        </div>
        <div class="bg-yellow-50 rounded-2xl p-4 text-center">
          <div class="text-3xl font-black text-yellow-600 font-fredoka">0</div>
          <div class="text-sm font-bold text-slate-600 mt-1">Badges Earned</div>
        </div>
      </div>
    </div>

    <div class="card mb-6">
      <h2 class="font-fredoka text-2xl font-black mb-4 text-slate-800">
        <i class="fas fa-clock text-blue-500"></i> Recent Activity
      </h2>
      <p class="text-slate-600">No recent activity to display. Activity tracking will appear here once ${child.first_name} starts their learning journey.</p>
    </div>

    <div class="card">
      <h2 class="font-fredoka text-2xl font-black mb-4 text-slate-800">
        <i class="fas fa-trophy text-yellow-500"></i> Achievements
      </h2>
      <p class="text-slate-600">Achievements and badges will be displayed here as ${child.first_name} progresses through their science adventures.</p>
    </div>
  `;
}

function getDefaultEmoji(name) {
  if (!name) return '👤';
  const firstChar = name.charAt(0).toLowerCase();
  const emojiMap = {
    'a': '🌟', 'b': '🎨', 'c': '🚀', 'd': '🦕', 'e': '🌈',
    'f': '🦊', 'g': '🌺', 'h': '🦔', 'i': '🎪', 'j': '🎯',
    'k': '🪁', 'l': '🦁', 'm': '🌙', 'n': '🦉', 'o': '🐙',
    'p': '🐼', 'q': '👑', 'r': '🤖', 's': '⭐', 't': '🐢',
    'u': '🦄', 'v': '🎻', 'w': '🐋', 'x': '❌', 'y': '🪀',
    'z': '⚡'
  };
  return emojiMap[firstChar] || '👤';
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', loadChildDetail);

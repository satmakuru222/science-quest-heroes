import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function loadChildren() {
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Error getting user:', userError);
    window.location.href = 'auth.html';
    return;
  }

  const childrenGrid = document.getElementById('childrenGrid');
  const loadingMessage = document.getElementById('loadingMessage');
  const noChildrenMessage = document.getElementById('noChildrenMessage');

  try {
    const { data: children, error } = await supabase
      .from('user_profiles')
      .select('id, first_name, username, age, grade_level, avatar_url, created_at')
      .eq('parent_id', user.id)
      .eq('account_type', 'student')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading children:', error);
      loadingMessage.innerHTML = '<p class="text-red-600 font-bold">Error loading children. Please try again.</p>';
      return;
    }

    loadingMessage.style.display = 'none';

    if (!children || children.length === 0) {
      noChildrenMessage.style.display = 'block';
      return;
    }

    noChildrenMessage.style.display = 'none';
    childrenGrid.innerHTML = '';

    children.forEach(child => {
      const card = createChildCard(child);
      childrenGrid.appendChild(card);
    });

  } catch (err) {
    console.error('Unexpected error:', err);
    loadingMessage.innerHTML = '<p class="text-red-600 font-bold">An unexpected error occurred.</p>';
  }
}

function createChildCard(child) {
  const card = document.createElement('div');
  card.className = 'card';

  const avatarDisplay = child.avatar_url
    ? `<img src="${child.avatar_url}" alt="${child.first_name}" class="w-24 h-24 rounded-full object-cover mx-auto mb-4" />`
    : `<div class="text-6xl mb-4">${getDefaultEmoji(child.first_name)}</div>`;

  card.innerHTML = `
    ${avatarDisplay}
    <h3 class="font-fredoka text-2xl font-black mb-2 text-slate-800">${escapeHtml(child.first_name || child.username || 'Student')}</h3>
    ${child.username ? `<p class="text-slate-600 mb-2 font-semibold">@${escapeHtml(child.username)}</p>` : ''}
    ${child.age ? `<p class="text-slate-600 mb-2">Age: ${child.age}</p>` : ''}
    ${child.grade_level ? `<p class="text-slate-600 mb-4">Grade ${escapeHtml(child.grade_level)}</p>` : ''}
    <a href="parent-child-detail.html?id=${child.id}" class="block text-center py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold hover:from-purple-600 hover:to-pink-600 transition-all">
      View Details →
    </a>
  `;

  return card;
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

document.addEventListener('DOMContentLoaded', loadChildren);

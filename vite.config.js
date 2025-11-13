import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'images',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        accountSelection: resolve(__dirname, 'account-type-selection.html'),
        auth: resolve(__dirname, 'auth.html'),
        studentSignup: resolve(__dirname, 'student-signup.html'),
        avatarSelection: resolve(__dirname, 'avatar-selection.html'),
        studentDashboard: resolve(__dirname, 'student-dashboard.html'),
        profile: resolve(__dirname, 'profile.html'),
        mrChloroGuide: resolve(__dirname, 'mr-chloro-guide.html'),
        stellaGradeSelector: resolve(__dirname, 'stella-grade-selector.html'),
        stellaPhotosynthesisAdventure: resolve(__dirname, 'stella-photosynthesis-adventure.html'),
        stellaSpaceGuide: resolve(__dirname, 'stella-space-guide.html'),
        childStart: resolve(__dirname, 'child-start.html'),
        childStory: resolve(__dirname, 'child-story.html'),
        childQuiz: resolve(__dirname, 'child-quiz.html'),
        childChat: resolve(__dirname, 'child-chat.html'),
        childAvatars: resolve(__dirname, 'child-avatars.html'),
        childBadges: resolve(__dirname, 'child-badges.html'),
        childGuides: resolve(__dirname, 'child-guides.html'),
        childSettings: resolve(__dirname, 'child-settings.html'),
        childTopics: resolve(__dirname, 'child-topics.html'),
        parentDashboard: resolve(__dirname, 'parent-dashboard.html'),
        parentChildren: resolve(__dirname, 'parent-children.html'),
        parentChildrenJS: resolve(__dirname, 'parent-children.js'),
        parentChildDetail: resolve(__dirname, 'parent-child-detail.html'),
        parentChildDetailJS: resolve(__dirname, 'parent-child-detail.js'),
        parentStories: resolve(__dirname, 'parent-stories.html'),
        parentProgress: resolve(__dirname, 'parent-progress.html'),
        parentReports: resolve(__dirname, 'parent-reports.html'),
        parentSettings: resolve(__dirname, 'parent-settings.html'),
        teacherDashboard: resolve(__dirname, 'teacher-dashboard.html'),
        teacherClasses: resolve(__dirname, 'teacher-classes.html'),
        teacherAssignments: resolve(__dirname, 'teacher-assignments.html'),
        teacherLibrary: resolve(__dirname, 'teacher-library.html'),
        teacherReports: resolve(__dirname, 'teacher-reports.html'),
        teacherSettings: resolve(__dirname, 'teacher-settings.html')
      }
    }
  },
  server: {
    port: 3000,
    open: true,
    cors: true
  },
  preview: {
    port: 3000,
    open: true
  }
});

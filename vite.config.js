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
        parentDashboard: resolve(__dirname, 'parent-dashboard.html'),
        teacherDashboard: resolve(__dirname, 'teacher-dashboard.html'),
        profile: resolve(__dirname, 'profile.html'),
        mrChloroGuide: resolve(__dirname, 'mr-chloro-guide.html'),
        stellaGradeSelector: resolve(__dirname, 'stella-grade-selector.html'),
        stellaPhotosynthesisAdventure: resolve(__dirname, 'stella-photosynthesis-adventure.html'),
        stellaSpaceGuide: resolve(__dirname, 'stella-space-guide.html')
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

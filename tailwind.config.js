// tailwind.config.js

module.exports = {
  content: [
    './*.html',         // All HTML files in root
    './*.js',           // All JS files in root (e.g., router.js, dashboard.js)
    './src/*.js'        // JS files in src directory, if any
  ],
  theme: {
    extend: {}
  },
  plugins: []
};

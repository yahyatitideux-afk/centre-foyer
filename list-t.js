const fs = require('fs');

const files = [
  'components/AboutView.tsx',
  'components/AdminPanel.tsx',
  'components/ChatbotWidget.tsx',
  'components/ContactView.tsx',
  'components/Footer.tsx',
  'components/GalleryView.tsx',
  'components/HomeView.tsx',
  'components/MissionsView.tsx',
  'components/Navbar.tsx',
  'components/PublicationsView.tsx'
];

const strings = new Set();
for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const content = fs.readFileSync(file, 'utf8');
  // Match t("...")
  const regex = /t\("(?:[^"\\]|\\.)*"\)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
      // Extract the inner string
      const str = match[0].substring(3, match[0].length - 2);
      if (str.length > 0) strings.add(str);
  }
}
console.log([...strings].join("\n---\n"));

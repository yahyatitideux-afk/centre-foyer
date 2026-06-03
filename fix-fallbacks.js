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

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  // Replace `general.someKey || "Some string"` with `general.someKey || t("Some string")`
  content = content.replace(/(general\.[a-zA-Z0-9_]+)\s*\|\|\s*("(?:[^"\\]|\\.)*")/g, (match, p1, p2) => {
    return `${p1} || t(${p2})`;
  });

  // add t to useSiteState destruct
  if (content.includes('t(')) {
    const match = content.match(/const\s*{\s*([^}]+)\s*}\s*=\s*useSiteState\(\)/);
    if (match && !match[1].includes('t') && !match[1].includes('t,')) {
      content = content.replace(/const\s*{\s*([^}]+)\s*}\s*=\s*useSiteState\(\)/, 'const { $1, t } = useSiteState()');
    }
  }

  fs.writeFileSync(file, content, 'utf8');
}
console.log("Replaced general fallbacks.");

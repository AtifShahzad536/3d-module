const fs = require('fs');

const files = [
  'src/components/builder/LandingPage.jsx',
  'src/components/builder/RightPanel.jsx',
  'src/components/builder/LeftPanel.jsx',
  'src/components/builder/Builder.jsx',
  'src/components/builder/Navbar.jsx'
];

files.forEach(p => {
  if (fs.existsSync(p)) {
    let code = fs.readFileSync(p, 'utf8');
    
    // Replace gray with slate for Tailwind classes
    code = code.replace(/([a-z:]*-?)gray-([0-9]+)/g, '$1slate-$2');
    
    // Replace blue with indigo for Tailwind classes
    code = code.replace(/([a-z:]*-?)blue-([0-9]+)/g, '$1indigo-$2');

    fs.writeFileSync(p, code);
    console.log(`Updated ${p}`);
  }
});

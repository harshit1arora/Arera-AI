const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

const pages = [
  { name: 'KycEngine', title: 'KYC Engine' },
  { name: 'CreditScoring', title: 'Credit Scoring' },
  { name: 'RulesEngine', title: 'Rules Engine' },
  { name: 'ApiDocs', title: 'API Docs' },
  { name: 'About', title: 'About Arera' },
  { name: 'Careers', title: 'Careers' },
  { name: 'Blog', title: 'Blog' },
  { name: 'Contact', title: 'Contact Us' },
  { name: 'PrivacyPolicy', title: 'Privacy Policy' },
  { name: 'TermsOfService', title: 'Terms of Service' },
  { name: 'Security', title: 'Security' },
];

pages.forEach(page => {
  const fileContent = `import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ${page.name} = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
          ${page.title}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          This is a placeholder page for ${page.title}. We are currently building this section and it will be available soon.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default ${page.name};
`;

  fs.writeFileSync(path.join(pagesDir, `${page.name}.tsx`), fileContent);
});

console.log('Pages created successfully.');

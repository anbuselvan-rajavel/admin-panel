import "./globals.css";
import Layout from "./components/Layout";
import 'primereact/resources/themes/lara-light-blue/theme.css';  // theme
import 'primereact/resources/primereact.min.css';               // core css
import 'primeicons/primeicons.css';                            // icons
   


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Layout>
        {children}
        </Layout>       
      </body>
    </html>
  );
}

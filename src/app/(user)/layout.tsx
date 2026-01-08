import Header from "@/components/header/Header";
import Footer from "@/components/Footer";
import Layout from "@/components/layout/Layout";

// Metadata is managed in the root layout to ensure Korean-first branding.


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout>
      <Header />
      {children}
      <Footer />
    </Layout>
  );
}

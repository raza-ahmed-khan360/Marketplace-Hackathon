import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { AuthProvider } from "./AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={`antialiased ${inter.className}`}>
          <ClientLayout>
            {children}
          </ClientLayout>
        </body>
      </html>
    </AuthProvider>
  );
}

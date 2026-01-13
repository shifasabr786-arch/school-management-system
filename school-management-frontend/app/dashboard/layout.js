// app/layout.js (server)
import "./globals.css";
import ClientWrapper from "@/components/ClientWrapper";

export const metadata = {
  title: "School Management System",
  description: "MCA Project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Client-only initialization lives inside ClientWrapper (client component) */}
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}

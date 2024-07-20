import "~/styles/globals.css";
import { TrpcProvider } from "~/trpc/trpc-provider";
import { Toaster } from "sonner";

export const metadata = {
  title: "Ecommerce App - Moonshot Assignment",
  description:
    "A Simple Ecommerce Auth and Category Flow - Moonshot Hiring Assignment",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-Inter">
        <TrpcProvider>
         {children}
        </TrpcProvider>
        <Toaster richColors position="top-center" closeButton />
      </body>
    </html>
  );
}

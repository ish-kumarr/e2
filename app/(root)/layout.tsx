import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex h-screen flex-col">
            <Header />
            <main className="flex-1 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white">{children}</main>
            <Footer />
        </div>

    );
}

import "@/app/globals.css";
import BannerBar from "@/components/layout/BannerBar";
import Header from "@/components/layout/Header";
import PopularPosts from "@/components/sidebar/PopularPosts";
import RecommendedKeywords from "@/components/sidebar/RecommendedKeywords";
import AuthSessionProvider from "@/components/providers/SessionProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col">
        <AuthSessionProvider>
          <Header />

          <BannerBar />

          {/* Main */}
          <main className="mx-auto flex w-full max-w-6xl flex-1">
            {/* Left Sidebar */}
            <aside
              className="
              hidden
              w-1/4
              md:block
              py-6
            "
            >
              {/* 세로 구분선 */}
              <div className="flex h-full px-6 flex-col border-r py-6">
                <div className="space-y-8">
                  <PopularPosts />
                  <RecommendedKeywords />
                </div>

                {/* Footer */}
                <footer className="mt-auto text-center text-xs text-muted-foreground">
                  © 2026 | Horok Tech | All rights reserved.
                </footer>
              </div>
            </aside>

            {/* Main Content */}
            <section
              className="
              w-full
              px-4 py-6
              md:w-2/3
              md:px-6
            "
            >
              {children}
            </section>
          </main>
        </AuthSessionProvider>
      </body>
    </html>
  );
}

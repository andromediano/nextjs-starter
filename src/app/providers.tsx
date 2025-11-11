/**
 * 여러 개의 Provider를 사용할 때 가장 직관적이고 깔끔한 방법은 모든 Provider를 하나의 합성 컴포넌트로 묶는 것이다.
 * Provider의 중첩 순서는 의존성에 따라 달라질 수 있다.
 * 예를 들어, next-auth의 SessionProvider가 TRPCProvider에서 세션 데이터를 필요로 한다면 SessionProvider가 더 바깥쪽에 있어야 한다.
 * SessionProvider > TRPCReactProvider > NextIntlClientProvider > ThemeProvider
 *  - 세션 데이터는 다른 프로바이더나 컴포넌트에서 자주 참조될 가능성이 높아. 따라서 가장 상위에 배치
 *  - tRPC는 API 호출 시 세션 토큰을 사용할 수 있고, 클라이언트 설정이 로케일에 의존하지 않으니까 중간에 위치
 *  - 다국어 처리는 주로 UI 렌더링 단계에서 필요하고, 세션이나 API 호출에 직접 의존하지 않는 경우가 많아
 *  - ThemeProvider UI 테마 (가장 안쪽, 다른 provider에 영향 최소)
 */
//import { NextIntlClientProvider } from "next-intl";
//import { SessionProvider } from "@repo/auth";
import { ThemeProvider } from "@/components/theme-provider";
import { TRPCProvider } from "@/trpc/client";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TRPCProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </TRPCProvider>
    /*
    <SessionProvider>
      <TRPCProvider>
        <NextIntlClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </TRPCProvider>
    </SessionProvider>
    */
  );
}

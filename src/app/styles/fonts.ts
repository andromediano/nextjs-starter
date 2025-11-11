// https://fonts.google.com/variablefonts
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";

export const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  // Thin(100), ExtraLight(200), Light(300), Regular(400), Medium(500), SemiBold(600), Bold(700), ExtraBold(800), Black(900)
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--noto-sans-kr", // tailwindcss에서 사용할 수 있도록 CSS 변수 방식 설정
  display: "swap",
});

export const notoSerifKr = Noto_Serif_KR({
  subsets: ["latin"],
  // ExtraLight(200), Light(300), Regular(400), Medium(500), SemiBold(600), Bold(700), Black(900)
  weight: ["200", "300", "400", "500", "600", "700", "900"],
  variable: "--noto-serif-kr", // tailwindcss에서 사용할 수 있도록 CSS 변수 방식 설정
  display: "swap",
});

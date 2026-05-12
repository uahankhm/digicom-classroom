import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Film,
  LayoutGrid,
  LockKeyhole,
  LogOut,
  Mail,
  Menu,
  PlayCircle,
  Smartphone,
  Sparkles,
  UserPlus,
  X,
} from "lucide-react";
import { firebaseConfig } from "./firebase-config.js";

const contactConfig = {
  email: "digicomssam@gmail.com",
  subject: "디지콤샘 디지털 교실 문의",
  body: "안녕하세요. 디지콤샘 디지털 교실 문의드립니다.",
};

const navItems = [
  { label: "소개", href: "#about" },
  { label: "프로그램 개발", href: "#programs" },
  { label: "블로그", href: "#blog" },
  { label: "강의영상", href: "#videos" },
];

const moreMenuItems = [
  { label: "강의자료", href: "#learning" },
  { label: "문의하기", href: "#contact" },
  { label: "회원 자료실", href: "#member-videos" },
];

const lessonSteps = ["사진 정리", "이야기 작성", "나레이션 만들기", "영상 완성"];

const vibeCodingItems = [
  {
    title: "플립카드섹션",
    description: "앞면과 뒷면이 회전하며 전환되는 카드형 섹션을 만들고 연습할 수 있는 프로그램입니다.",
    href: "#",
  },
  {
    title: "AI 논문 리스트",
    description: "AI 관련 논문, 요약, 참고 링크를 목록으로 정리하고 찾아볼 수 있는 프로그램입니다.",
    href: "#",
  },
];

const programExtraMenuItems = [
  { title: "전체 프로그램 보기", href: "#programs" },
  { title: "프로그램 제안하기", href: "#contact" },
];

const learningMaterials = [
  {
    title: "스마트폰 초급반",
    icon: Smartphone,
    description: "수업 자료, 실습 링크, 참고 영상을 모아둔 공간입니다.",
    href: "#",
  },
  {
    title: "AI 활용반",
    icon: Sparkles,
    description: "수업 자료, 실습 링크, 참고 영상을 모아둔 공간입니다.",
    href: "#",
  },
  {
    title: "유튜브·쇼츠반",
    icon: Film,
    description: "수업 자료, 실습 링크, 참고 영상을 모아둔 공간입니다.",
    href: "#",
  },
  {
    title: "키오스크 실습반",
    icon: LayoutGrid,
    description: "수업 자료, 실습 링크, 참고 영상을 모아둔 공간입니다.",
    href: "#",
  },
];

const blogCategories = [
  {
    label: "스마트폰활용",
    description: "스마트폰 기본 기능, 사진, 앱, QR, 생활 활용 글",
    href: "https://blog.naver.com/PostList.naver?blogId=uahankhm&from=postList&categoryNo=16",
    className: "bg-[#45D8E1] text-white",
  },
  {
    label: "컴퓨터활용",
    description: "문서, 파일 정리, 인터넷, 컴퓨터 기초 활용 글",
    href: "https://blog.naver.com/PostList.naver?blogId=uahankhm&from=postList&categoryNo=17",
    className: "bg-[#20B7F2] text-white",
  },
  {
    label: "AI활용",
    description: "ChatGPT, 이미지, 영상, 수업 자료 제작에 관한 글",
    href: "https://blog.naver.com/PostList.naver?blogId=uahankhm&from=postList&categoryNo=18",
    className: "bg-[#DA91E8] text-white",
  },
  {
    label: "SNS마케팅",
    description: "블로그, 인스타그램, 유튜브, 온라인 홍보 활용 글",
    href: "https://blog.naver.com/PostList.naver?blogId=uahankhm&from=postList&categoryNo=19",
    className: "bg-[#FFE16A] text-[#315083]",
  },
  {
    label: "기타",
    description: "수업 공지, 교육 기록, 디지털 생활 이야기",
    href: "https://blog.naver.com/PostList.naver?blogId=uahankhm&from=postList&categoryNo=20",
    className: "bg-[#E5E7EB] text-[#D99A28]",
  },
];

const memberVideos = [
  {
    title: "AI 영상 자서전 복습 영상",
    description: "사진 정리부터 영상 완성까지 수업 흐름을 다시 볼 수 있습니다.",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    title: "스마트폰 기초 실습",
    description: "문자, 사진, QR 사용법을 천천히 복습하는 영상입니다.",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
];

const isFirebaseConfigured =
  Boolean(firebaseConfig.apiKey) && !firebaseConfig.apiKey.includes("YOUR_");

function createContactHref({ email, subject, body }) {
  if (!email) {
    return "";
  }

  const params = new URLSearchParams({
    to: email,
    su: subject,
    body,
  });

  return `https://mail.google.com/mail/?view=cm&fs=1&${params.toString()}`;
}

function openContactPopup(contactHref) {
  const width = 720;
  const height = 680;
  const left = window.screenX + Math.max(0, (window.outerWidth - width) / 2);
  const top = window.screenY + Math.max(0, (window.outerHeight - height) / 2);
  const popup = window.open(
    contactHref,
    "digicom-contact",
    `popup=yes,width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`,
  );

  popup?.focus();
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [firebase, setFirebase] = useState(null);
  const [authState, setAuthState] = useState({
    user: null,
    approved: false,
    loading: isFirebaseConfigured,
  });

  useEffect(() => {
    let ignore = false;

    if (!isFirebaseConfigured) {
      return undefined;
    }

    loadFirebase(firebaseConfig).then((loadedFirebase) => {
      if (!ignore) {
        setFirebase(loadedFirebase);
      }
    });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!firebase) {
      return undefined;
    }

    return firebase.onAuthStateChanged(firebase.auth, async (user) => {
      if (!user) {
        setAuthState({ user: null, approved: false, loading: false });
        return;
      }

      const snapshot = await firebase.getDoc(firebase.doc(firebase.db, "members", user.uid));
      setAuthState({
        user,
        approved: Boolean(snapshot.exists() && snapshot.data().approved),
        loading: false,
      });
    });
  }, [firebase]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-site text-ink">
      <Header
        authState={authState}
        firebase={firebase}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      <main className="flex-1 overflow-y-auto">
        <Hero />
        <AboutSection />
        <ProgramsSection />
        <LearningSection />
        <VideosSection firebase={firebase} authState={authState} />
        <BlogSection />
      </main>
      <Footer />
    </div>
  );
}

function Header({ authState, firebase, isMenuOpen, setIsMenuOpen }) {
  const isLoggedIn = Boolean(authState.user);
  const displayEmail = authState.user?.email ?? "";
  const contactEmail = contactConfig.email.trim();
  const contactHref = createContactHref({ ...contactConfig, email: contactEmail });
  const canContact = Boolean(contactEmail);
  const [isBlogMenuOpen, setIsBlogMenuOpen] = useState(false);
  const [isProgramMenuOpen, setIsProgramMenuOpen] = useState(false);

  useEffect(() => {
    if (!isBlogMenuOpen && !isProgramMenuOpen) {
      return undefined;
    }

    function closeDropdowns(event) {
      if (!event.target.closest("[data-header-dropdown]")) {
        setIsBlogMenuOpen(false);
        setIsProgramMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeDropdowns);
    return () => document.removeEventListener("pointerdown", closeDropdowns);
  }, [isBlogMenuOpen, isProgramMenuOpen]);

  function handleMobileContactClick() {
    if (!canContact) {
      return;
    }

    openContactPopup(contactHref);
    setIsMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-white shadow-[0_1px_8px_rgba(15,23,42,0.04)]">
      <div className="flex h-[104px] w-full items-center justify-between gap-5 px-4 sm:px-6 lg:px-7 xl:px-10">
        <a href="#top" className="flex min-w-0 items-center gap-4" aria-label="디지콤샘 디지털 교실 홈">
          <span className="flex size-[58px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#D9E7E3] bg-gradient-to-br from-[#EAF7F4] via-white to-[#FFE8D1] text-brand shadow-sm">
            <Sparkles aria-hidden="true" size={28} />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[25px] font-black leading-none tracking-normal text-[#111827]">
              디지콤샘 디지털 교실
            </span>
          </span>
        </a>

        <nav
          className="ml-auto hidden items-center gap-9 text-[22px] font-black leading-none text-[#374151] xl:gap-12 lg:flex"
          aria-label="주요 메뉴"
        >
          {navItems.map((item) =>
            item.label === "프로그램 개발" ? (
              <div className="relative" key={item.href} data-header-dropdown>
                <button
                  className="inline-flex items-center gap-1.5 transition hover:text-brand"
                  type="button"
                  onClick={() => {
                    setIsProgramMenuOpen((value) => !value);
                    setIsBlogMenuOpen(false);
                    document.querySelector("#programs")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  aria-expanded={isProgramMenuOpen}
                >
                  {item.label}
                  <ChevronDown
                    className={`mt-0.5 transition ${isProgramMenuOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                    size={20}
                  />
                </button>
                {isProgramMenuOpen && (
                  <div className="absolute left-0 top-full z-20 mt-5 w-[390px] rounded-[1.5rem] border border-cardLine bg-white p-4 shadow-soft">
                    <div className="absolute -top-6 left-0 h-6 w-full" />
                    {vibeCodingItems.map((program) => (
                      <a
                        key={program.title}
                        className="mb-2 block rounded-2xl px-4 py-4 text-lg font-black text-body hover:bg-brandSoft hover:text-brand"
                        href={program.href}
                        onClick={() => setIsProgramMenuOpen(false)}
                      >
                        {program.title}
                      </a>
                    ))}
                    <div className="mt-3 border-t border-cardLine pt-3">
                      {programExtraMenuItems.map((program) => (
                        <a
                          key={program.title}
                          className="block rounded-2xl px-4 py-3 text-base font-extrabold text-muted hover:bg-site hover:text-brand"
                          href={program.href}
                          onClick={() => setIsProgramMenuOpen(false)}
                        >
                          {program.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : item.label === "블로그" ? (
              <div className="relative" key={item.href} data-header-dropdown>
                <button
                  className="inline-flex items-center gap-1.5 transition hover:text-brand"
                  type="button"
                  onClick={() => {
                    setIsBlogMenuOpen((value) => !value);
                    setIsProgramMenuOpen(false);
                    document.querySelector("#blog")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  aria-expanded={isBlogMenuOpen}
                >
                  {item.label}
                  <ChevronDown
                    className={`mt-0.5 transition ${isBlogMenuOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                    size={20}
                  />
                </button>
                {isBlogMenuOpen && (
                  <div className="absolute right-0 top-full z-20 mt-5 w-[320px] rounded-[1.5rem] border border-cardLine bg-white p-4 shadow-soft">
                    <div className="absolute -top-6 left-0 h-6 w-full" />
                    {blogCategories.map((category) => (
                      <a
                        key={category.href}
                        className="mb-2 block rounded-2xl px-4 py-4 text-lg font-black text-body hover:bg-brandSoft hover:text-brand"
                        href={category.href}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setIsBlogMenuOpen(false)}
                      >
                        {category.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <a key={item.href} className="transition hover:text-brand" href={item.href}>
                {item.label}
              </a>
            ),
          )}
          <div className="group relative">
            <button
              className="inline-flex items-center gap-1.5 text-[22px] font-black leading-none transition hover:text-brand"
              type="button"
            >
              더보기
              <ChevronDown className="mt-0.5 transition group-hover:rotate-180" aria-hidden="true" size={20} />
            </button>
            <div className="invisible absolute right-0 top-full z-20 w-44 translate-y-4 rounded-2xl border border-cardLine bg-white p-2 opacity-0 shadow-soft transition group-hover:visible group-hover:translate-y-3 group-hover:opacity-100">
              {moreMenuItems.map((item) => (
                <a
                  key={item.href}
                  className="block rounded-xl px-4 py-3 text-base font-extrabold text-body hover:bg-brandSoft hover:text-brand"
                  href={item.href}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </nav>

        <div className="ml-4 hidden items-center gap-2.5 border-l border-[#D8DEE6] pl-4 lg:flex">
          {isLoggedIn ? (
            <button
              className="inline-flex h-[58px] max-w-[250px] items-center justify-center gap-3 rounded-full border border-[#E0E5EC] bg-white py-1.5 pl-2 pr-4 text-[16px] font-black text-[#111827] shadow-sm transition hover:-translate-y-0.5 hover:border-brand/40"
              type="button"
              onClick={() => firebase?.signOut(firebase.auth)}
              title="클릭하면 로그아웃됩니다"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#111827] text-[18px] font-black text-white">
                {displayEmail.slice(0, 1).toUpperCase()}
              </span>
              <span className="truncate">{displayEmail}</span>
              <LogOut aria-hidden="true" size={18} />
            </button>
          ) : (
            <a
              className="inline-flex h-[58px] items-center justify-center gap-3 rounded-full border border-[#E0E5EC] bg-white py-1.5 pl-2 pr-5 text-[17px] font-black text-[#111827] shadow-sm transition hover:-translate-y-0.5 hover:border-brand/40"
              href="#member-videos"
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-[#111827] text-white">
                <LockKeyhole aria-hidden="true" size={20} />
              </span>
              로그인
            </a>
          )}
        </div>

        <button
          className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl border border-cardLine bg-white text-brand lg:hidden"
          type="button"
          onClick={() => setIsMenuOpen((value) => !value)}
          aria-label="메뉴 열기"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      {isMenuOpen && (
        <nav className="max-h-[calc(100vh-104px)] overflow-y-auto border-t border-cardLine bg-white px-5 py-4 shadow-soft lg:hidden" aria-label="모바일 메뉴">
          <div className="grid gap-2 text-lg font-black text-body">
            <div className="mb-2 grid grid-cols-2 gap-2">
              {isLoggedIn ? (
                <button
                  className="inline-flex min-h-14 min-w-0 items-center justify-center gap-2 rounded-2xl bg-brand px-4 text-base font-extrabold text-white shadow-soft"
                  type="button"
                  onClick={() => {
                    firebase?.signOut(firebase.auth);
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut aria-hidden="true" className="shrink-0" size={19} />
                  <span className="truncate">{displayEmail}</span>
                </button>
              ) : (
                <a
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-brand px-4 text-base font-extrabold text-white shadow-soft"
                  href="#member-videos"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LockKeyhole aria-hidden="true" size={19} />
                  로그인
                </a>
              )}
              {canContact ? (
                <button
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-softLine bg-white px-4 text-base font-extrabold text-brand shadow-sm"
                  type="button"
                  onClick={handleMobileContactClick}
                >
                  <Mail aria-hidden="true" size={19} />
                  문의하기
                </button>
              ) : (
                <button
                  className="inline-flex min-h-14 cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-brandSoft px-4 text-base font-extrabold text-brand/60"
                  type="button"
                  disabled
                >
                  <Mail aria-hidden="true" size={19} />
                  문의 준비 중
                </button>
              )}
            </div>
            {[...navItems, ...moreMenuItems].filter((item) => item.href !== "#contact").map((item) => (
              <a
                key={item.href}
                className="rounded-2xl px-4 py-3 hover:bg-brandSoft hover:text-brand"
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="section-shell grid min-h-[calc(100vh-104px)] items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
      <div>
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-softLine bg-white px-5 py-3 text-base font-extrabold text-brand shadow-sm">
          <Smartphone aria-hidden="true" size={21} />
          시니어도 쉽게 배우는 디지털 수업
        </div>
        <h1 className="max-w-3xl text-5xl font-black leading-[1.08] tracking-normal text-ink sm:text-6xl lg:text-7xl">
          AI와 스마트폰을
          <span className="block">쉽고 따뜻하게</span>
          <span className="block text-brand">배우는 공간</span>
        </h1>
        <p className="body-copy mt-7 max-w-2xl">
          디지콤샘의 수업 자료, 실습 영상, 블로그 글, 그리고 AI와 함께 만든 프로그램을 한곳에서
          만나는 교육 플랫폼입니다.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <a className="primary-button" href="#programs">
            <LayoutGrid aria-hidden="true" size={22} />
            프로그램 개발 보기
          </a>
          <a className="secondary-button" href="#videos">
            <PlayCircle aria-hidden="true" size={22} />
            강의영상 보기
          </a>
        </div>
      </div>

      <div className="space-y-5">
        <article className="soft-card overflow-hidden">
          <div className="bg-brandSoft px-7 py-6">
            <p className="text-base font-extrabold text-brand">오늘의 추천 수업</p>
            <h2 className="mt-3 text-3xl font-black leading-tight tracking-normal text-ink">
              AI 영상 자서전 만들기
            </h2>
          </div>
          <div className="grid gap-4 p-7">
            {lessonSteps.map((step, index) => (
              <div key={step} className="flex items-center gap-4 rounded-2xl border border-cardLine bg-site p-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-lg font-black text-white">
                  {index + 1}
                </span>
                <span className="text-xl font-extrabold text-ink">{step}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="soft-card flex flex-col gap-4 bg-orangePoint p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-black text-ink">수업 자료 바로가기</p>
            <p className="mt-2 text-base font-bold text-body">초급 · 중급 · 유튜브 · AI</p>
          </div>
          <a className="secondary-button min-h-12 px-5 text-base" href="#learning">
            자료 보기
            <ArrowRight aria-hidden="true" size={18} />
          </a>
        </article>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="border-y border-cardLine bg-white">
      <div className="section-shell grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="section-label">ABOUT</p>
          <h2 className="section-title">디지콤샘은 어떤 수업을 하나요?</h2>
        </div>
        <p className="body-copy">
          스마트폰을 처음 배우는 분부터 AI로 나만의 결과물을 만들고 싶은 분까지, 생활 속에서
          바로 쓸 수 있는 디지털 활용법을 쉽고 다정하게 안내합니다. 버튼 하나, 메뉴 하나도
          놓치지 않도록 천천히 함께합니다.
        </p>
      </div>
    </section>
  );
}

function ProgramsSection() {
  return (
    <section id="programs" className="section-shell">
      <p className="section-label">PROGRAM DEVELOPMENT</p>
      <h2 className="section-title">프로그램 개발</h2>
      <p className="body-copy mt-5 max-w-3xl">
        Vibe Coding으로 만들고 확장해갈 프로그램을 정리합니다. 우선 플립카드섹션과 AI 논문 리스트부터
        시작합니다.
      </p>

      <div className="mt-9 rounded-[1.75rem] border border-cardLine bg-white p-5 shadow-soft sm:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-label">PROGRAM LIST</p>
            <h3 className="mt-2 text-3xl font-black tracking-normal text-ink">개발 프로그램 목록</h3>
          </div>
          <a className="secondary-button min-h-12 px-5 text-base" href="#contact">
            프로그램 제안하기
          </a>
        </div>

        <div className="mt-6 grid gap-3">
          {vibeCodingItems.map((item, index) => (
            <a
              key={item.title}
              className="group grid gap-4 rounded-2xl border border-cardLine bg-site p-5 transition hover:-translate-y-0.5 hover:border-brand/40 hover:bg-brandSoft sm:grid-cols-[56px_1fr_auto] sm:items-center"
              href={item.href}
            >
              <span className="flex size-14 items-center justify-center rounded-2xl bg-brand text-xl font-black text-white">
                {index + 1}
              </span>
              <span>
                <span className="block text-xl font-black tracking-normal text-ink">{item.title}</span>
                <span className="mt-1 block text-base leading-7 text-body">{item.description}</span>
              </span>
              <span className="inline-flex items-center gap-2 text-base font-black text-brand">
                보기
                <ArrowRight className="transition group-hover:translate-x-1" aria-hidden="true" size={18} />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function LearningSection() {
  return (
    <section id="learning" className="bg-brandSoft">
      <div className="section-shell">
        <p className="section-label">LEARNING</p>
        <h2 className="section-title">수업별 강의자료</h2>
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {learningMaterials.map((material) => {
            const Icon = material.icon;
            return (
              <article key={material.title} className="soft-card p-6">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-brand text-white">
                  <Icon aria-hidden="true" size={27} />
                </span>
                <h3 className="mt-6 text-2xl font-black leading-tight tracking-normal text-ink">{material.title}</h3>
                <p className="mt-4 text-lg leading-8 text-body">{material.description}</p>
                <a className="primary-button mt-6 w-full text-base" href={material.href}>
                  자료 보기
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function VideosSection({ firebase, authState }) {
  return (
    <section id="videos" className="section-shell">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="section-label">LECTURE VIDEOS</p>
          <h2 className="section-title">강의영상 모음</h2>
          <p className="body-copy mt-5">
            복습이 필요한 분들을 위해 실습 영상과 설명 영상을 주제별로 정리합니다. 로그인과 승인
            상태에 따라 볼 수 있는 영상이 달라집니다.
          </p>
          <a className="primary-button mt-8" href="#member-videos">
            <PlayCircle aria-hidden="true" size={22} />
            강의영상 보기
          </a>
        </div>
        <MemberArchive firebase={firebase} authState={authState} />
      </div>
    </section>
  );
}

function MemberArchive({ firebase, authState }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState(
    isFirebaseConfigured
      ? "승인된 회원은 로그인 후 강의영상을 볼 수 있습니다."
      : "src/firebase-config.js에 Firebase 설정값을 넣으면 로그인 기능이 활성화됩니다.",
  );

  async function handleLogin(event) {
    event.preventDefault();
    if (!firebase) return;

    try {
      setMessage("로그인 중입니다.");
      await firebase.signInWithEmailAndPassword(firebase.auth, form.email, form.password);
    } catch (error) {
      setMessage(getFriendlyError(error));
    }
  }

  async function handleSignup() {
    if (!firebase) return;

    try {
      setMessage("회원가입 중입니다.");
      const credential = await firebase.createUserWithEmailAndPassword(firebase.auth, form.email, form.password);
      await firebase.setDoc(firebase.doc(firebase.db, "members", credential.user.uid), {
        email: credential.user.email,
        approved: false,
        createdAt: firebase.serverTimestamp(),
        role: "member",
      });
      setMessage("가입되었습니다. 관리자가 승인하면 강의영상 자료실이 열립니다.");
    } catch (error) {
      setMessage(getFriendlyError(error));
    }
  }

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  return (
    <div id="member-videos" className="soft-card p-6 sm:p-7">
      {authState.user && authState.approved ? (
        <div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="section-label">MEMBERS ONLY</p>
              <h3 className="mt-2 text-2xl font-black tracking-normal text-ink">회원 전용 강의영상</h3>
              <p className="mt-2 text-base font-bold text-muted">{authState.user.email}</p>
            </div>
            <button className="secondary-button min-h-12 px-5 text-base" type="button" onClick={() => firebase.signOut(firebase.auth)}>
              <LogOut aria-hidden="true" size={19} />
              로그아웃
            </button>
          </div>
          <div className="mt-6 grid gap-5">
            {memberVideos.map((video) => (
              <article key={video.title} className="overflow-hidden rounded-2xl border border-cardLine bg-site">
                <iframe
                  className="aspect-video w-full bg-ink"
                  src={video.embedUrl}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
                <div className="p-5">
                  <h4 className="text-xl font-black tracking-normal text-ink">{video.title}</h4>
                  <p className="mt-2 text-base leading-7 text-body">{video.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : authState.user ? (
        <div className="grid gap-5">
          <LockKeyhole className="text-brand" aria-hidden="true" size={42} />
          <h3 className="text-2xl font-black tracking-normal text-ink">승인 대기 중입니다</h3>
          <p className="body-copy">가입은 완료되었습니다. 관리자가 승인하면 강의영상 자료실이 열립니다.</p>
          <button className="secondary-button w-fit text-base" type="button" onClick={() => firebase.signOut(firebase.auth)}>
            <LogOut aria-hidden="true" size={19} />
            로그아웃
          </button>
        </div>
      ) : (
        <form className="grid gap-5" onSubmit={handleLogin}>
          <div>
            <p className="section-label">MEMBERS ONLY</p>
            <h3 className="mt-2 text-2xl font-black tracking-normal text-ink">로그인 또는 회원가입</h3>
            <p className="mt-3 text-lg leading-8 text-body">회원가입 후 관리자가 승인하면 강의영상을 볼 수 있습니다.</p>
          </div>
          <label className="grid gap-2 text-base font-extrabold text-body">
            이메일
            <input
              className="min-h-14 rounded-2xl border border-cardLine bg-white px-4 text-lg text-ink outline-none focus:border-brand focus:ring-4 focus:ring-brand/15"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
              disabled={!isFirebaseConfigured}
            />
          </label>
          <label className="grid gap-2 text-base font-extrabold text-body">
            비밀번호
            <input
              className="min-h-14 rounded-2xl border border-cardLine bg-white px-4 text-lg text-ink outline-none focus:border-brand focus:ring-4 focus:ring-brand/15"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              minLength={6}
              required
              disabled={!isFirebaseConfigured}
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <button className="primary-button" type="submit" disabled={!isFirebaseConfigured}>
              <LockKeyhole aria-hidden="true" size={20} />
              로그인
            </button>
            <button className="secondary-button" type="button" onClick={handleSignup} disabled={!isFirebaseConfigured}>
              <UserPlus aria-hidden="true" size={20} />
              회원가입
            </button>
          </div>
          <p className="min-h-8 text-base font-bold leading-7 text-muted">{authState.loading ? "회원 상태를 확인하고 있습니다." : message}</p>
        </form>
      )}
    </div>
  );
}

function BlogSection() {
  return (
    <section id="blog" className="border-y border-cardLine bg-white">
      <div className="section-shell">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.62fr] lg:items-end">
          <div>
            <p className="section-label">BLOG</p>
            <h2 className="section-title">블로그 글 함께 보기</h2>
            <p className="body-copy mt-5">
              네이버 블로그 글은 5개 주제 버튼으로 보여주고, 각 버튼은 해당 카테고리 글 목록으로 바로
              연결합니다. 방문자는 홈페이지에서 필요한 주제를 고르고 자세한 글은 블로그에서 읽게 됩니다.
            </p>
          </div>
          <a
            className="secondary-button w-fit lg:justify-self-end"
            href="https://blog.naver.com/uahankhm"
            target="_blank"
            rel="noreferrer"
          >
            <BookOpen aria-hidden="true" size={22} />
            블로그 보기
          </a>
        </div>

        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {blogCategories.map((category) => (
            <a
              key={category.href}
              className={`${category.className} flex min-h-20 items-center justify-center rounded-full px-5 text-center text-2xl font-black shadow-soft transition hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-brand/20`}
              href={category.href}
              target="_blank"
              rel="noreferrer"
            >
              {category.label}
            </a>
          ))}
        </div>

        <p className="mt-6 text-base font-bold leading-7 text-muted">
          원하는 주제 버튼을 누르면 네이버 블로그의 해당 글 목록으로 이동합니다.
        </p>
      </div>
    </section>
  );
}

function Footer() {
  const contactEmail = contactConfig.email.trim();
  const contactHref = createContactHref({ ...contactConfig, email: contactEmail });
  const canContact = Boolean(contactEmail);

  function handleContactClick() {
    if (!canContact) {
      return;
    }

    openContactPopup(contactHref);
  }

  return (
    <footer id="contact" className="hidden shrink-0 border-t border-cardLine bg-site px-4 py-2 sm:block sm:px-6 lg:px-10">
      <div className="soft-card mx-auto flex max-w-6xl items-center gap-3 bg-brand px-4 py-3 text-white sm:px-5">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-1">
          <h2 className="shrink-0 text-xl font-black tracking-normal sm:text-[26px]">디지콤샘 디지털 교실</h2>
          <p className="truncate text-sm font-bold text-white/80 sm:text-base">AI · 스마트폰 · 유튜브 · 시니어 디지털 교육</p>
          {canContact && (
            <p className="truncate text-sm font-bold text-white/75 sm:text-base">
              문의 메일: {contactEmail}
            </p>
          )}
          {!canContact && (
            <p className="truncate text-sm font-bold text-white/70 sm:text-base">
              문의 이메일 주소가 준비되면 버튼이 활성화됩니다.
            </p>
          )}
        </div>
        {canContact ? (
          <button
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-base font-extrabold text-brand transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-white/30 sm:text-lg"
            type="button"
            aria-label={`${contactEmail}로 문의 메일 보내기`}
            onClick={handleContactClick}
          >
            <Mail aria-hidden="true" size={22} />
            문의하기
          </button>
        ) : (
          <button
            className="inline-flex min-h-12 shrink-0 cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-white/65 px-5 text-base font-extrabold text-brand/60 sm:text-lg"
            type="button"
            disabled
            title="문의 이메일 주소가 아직 설정되지 않았습니다."
          >
            <Mail aria-hidden="true" size={22} />
            문의 준비 중
          </button>
        )}
      </div>
      <p className="sr-only">
        GitHub Pages와 Firebase로 운영할 수 있는 정적 교육 플랫폼입니다.
      </p>
    </footer>
  );
}

function getFriendlyError(error) {
  const messages = {
    "auth/email-already-in-use": "이미 가입된 이메일입니다.",
    "auth/invalid-email": "이메일 형식을 확인해주세요.",
    "auth/invalid-credential": "이메일 또는 비밀번호가 맞지 않습니다.",
    "auth/weak-password": "비밀번호는 6자 이상이어야 합니다.",
  };

  return messages[error.code] ?? `오류가 발생했습니다: ${error.message}`;
}

async function loadFirebase(config) {
  const [{ getApp, getApps, initializeApp }, authModule, firestoreModule] = await Promise.all([
    import("firebase/app"),
    import("firebase/auth"),
    import("firebase/firestore"),
  ]);

  const app = getApps().length > 0 ? getApp() : initializeApp(config);

  return {
    auth: authModule.getAuth(app),
    db: firestoreModule.getFirestore(app),
    createUserWithEmailAndPassword: authModule.createUserWithEmailAndPassword,
    doc: firestoreModule.doc,
    getDoc: firestoreModule.getDoc,
    onAuthStateChanged: authModule.onAuthStateChanged,
    serverTimestamp: firestoreModule.serverTimestamp,
    setDoc: firestoreModule.setDoc,
    signInWithEmailAndPassword: authModule.signInWithEmailAndPassword,
    signOut: authModule.signOut,
  };
}

export default App;

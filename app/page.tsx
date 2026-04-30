import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Fraunces, Sora } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const backgroundIssues = [
  {
    title: "Kesenjangan keselamatan lansia",
    description:
      "Data BPS 2024 mencatat 12% penduduk (30 juta jiwa) lansia. Tanpa pemantauan aktif, lansia yang tinggal sendiri berisiko terlambat tertolong.",
  },
  {
    title: "Respons darurat lambat",
    description:
      "Waktu respons bantuan medis profesional di area padat bisa lebih dari 15 menit, padahal bantuan tetangga dalam kurang dari 5 menit sangat krusial.",
  },
  {
    title: "Birokrasi tidak transparan",
    description:
      "Laporan warga sering berhenti di tengah jalan tanpa status jelas, menurunkan kepercayaan dan partisipasi warga.",
  },
  {
    title: "Data keputusan subjektif",
    description:
      "Kecamatan dan pemda kerap mengambil keputusan tanpa data riil yang terakumulasi secara sistematis dari RT dan RW.",
  },
];

const ideaHighlights = [
  "Platform PWA terintegrasi dari RT hingga pemda",
  "Integrated Streamlining untuk alur birokrasi",
  "Interaksi sosial berubah menjadi data terstruktur",
  "Data-driven governance untuk keputusan objektif",
];

const governanceFlow = ["RT", "RW", "Kelurahan", "Kecamatan", "Pemda"];

const goalItems = [
  {
    title: "Tujuan",
    description:
      "Mempercepat alur birokrasi dan menciptakan jaringan pengaman sosial berbasis komunitas.",
  },
  {
    title: "Manfaat",
    description:
      "Warga merasa lebih aman dan terlibat. Pemerintah memiliki data akurat untuk alokasi anggaran yang efektif.",
  },
  {
    title: "Solusi utama",
    description:
      "Smart Routing untuk laporan warga dan Emergency Button untuk bantuan darurat antar tetangga.",
  },
];

const uniqueFeatures = [
  {
    title: "Interactive Threads dan Polling",
    description:
      "Diskusi terorganisir per topik agar informasi penting tidak tenggelam.",
  },
  {
    title: "Emergency Radius Alert",
    description:
      "Notifikasi darurat ke warga dalam radius terdekat untuk respons cepat.",
  },
  {
    title: "Smart Routing dan Tracking",
    description:
      "Status laporan transparan: Pending, Approved, Success di setiap level.",
  },
  {
    title: "Decision Support System (DSS)",
    description:
      "Rekomendasi urgensi berbasis akumulasi data laporan di satu titik.",
  },
  {
    title: "Feedback Accountability",
    description:
      "Penundaan atau penolakan wajib disertai alasan resmi yang terbuka bagi warga.",
  },
];

const impactMetrics = [
  {
    value: "70%",
    label: "Pengurangan waktu tunggu darurat lewat mobilisasi tetangga terdekat.",
  },
  {
    value: "Hitungan hari",
    label: "Disposisi laporan yang sebelumnya berminggu-minggu.",
  },
  {
    value: "Transparan",
    label: "Warga melihat posisi laporan secara real time tanpa blank spot.",
  },
  {
    value: "Valid",
    label: "Pemda mengalokasikan anggaran berdasarkan data sebaran masalah.",
  },
];

export default async function Home() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("jagawarga_auth");

  if (authCookie?.value) {
    try {
      const user = JSON.parse(decodeURIComponent(authCookie.value));
      const dashboardMap: Record<string, string> = {
        citizen: "/citizen/dashboard",
        rt: "/rt/dashboard",
        rw: "/rw/dashboard",
        pemda: "/pemda/dashboard",
      };
      const path = dashboardMap[user.role];
      if (path) redirect(path);
    } catch {
      // fall through to landing page
    }
  }

  return (
    <main
      className={`${sora.className} min-h-screen bg-[var(--blue-light)] text-[var(--blue-dark)]`}
    >
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-32 left-10">
          <div className="float-orb h-72 w-72 rounded-full bg-[var(--green-light)] blur-3xl opacity-80" />
        </div>
        <div className="pointer-events-none absolute right-12 top-20">
          <div className="float-orb h-64 w-64 rounded-full bg-[var(--blue-primary)] blur-3xl opacity-20" />
        </div>
        <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-16 pt-10">
          <header className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--blue-primary)] text-sm font-semibold text-white">
                JW
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--blue-primary)]">
                  JagaWarga
                </p>
                <p className="text-xs text-[var(--neutral-text)]">
                  PWA gotong royong digital
                </p>
              </div>
            </div>
            <nav className="hidden items-center gap-6 text-sm font-medium text-[var(--blue-dark)] md:flex">
              <a href="#latar" className="transition hover:text-[var(--blue-primary)]">
                Latar belakang
              </a>
              <a href="#ide" className="transition hover:text-[var(--blue-primary)]">
                Ide
              </a>
              <a href="#fitur" className="transition hover:text-[var(--blue-primary)]">
                Fitur
              </a>
              <a href="#impact" className="transition hover:text-[var(--blue-primary)]">
                Dampak
              </a>
            </nav>
            <div className="hidden items-center gap-3 sm:flex">
              <Link
                href="/auth/login"
                className="rounded-full border border-[var(--blue-border)] bg-white/70 px-4 py-2 text-sm font-semibold text-[var(--blue-primary)] shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
              >
                Masuk
              </Link>
              <Link
                href="/auth/register"
                className="rounded-full bg-[var(--green-action)] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[rgba(29,158,117,0.35)] transition hover:-translate-y-0.5"
              >
                Daftar warga
              </Link>
            </div>
          </header>

          <section className="grid items-center gap-12 lg:grid-cols-[1.05fr,0.95fr]">
            <div className="flex flex-col gap-8">
              <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--blue-primary)]">
                <span className="rounded-full border border-[var(--blue-border)] bg-white/70 px-3 py-1">
                  Integrated Streamlining
                </span>
                <span className="rounded-full border border-[var(--green-action)] bg-white/70 px-3 py-1">
                  Emergency button
                </span>
                <span className="rounded-full border border-[var(--neutral-border)] bg-white/70 px-3 py-1">
                  Data-driven governance
                </span>
              </div>
              <div className="space-y-5">
                <h1
                  className={`${fraunces.className} fade-up text-4xl font-semibold leading-tight text-[var(--blue-dark)] sm:text-5xl lg:text-6xl`}
                >
                  JagaWarga, ekosistem digital yang sigap menjaga setiap
                  lingkungan.
                </h1>
                <p className="fade-up fade-up-delay-1 max-w-xl text-base text-[var(--neutral-text)] sm:text-lg">
                  Platform PWA yang menghubungkan warga, RT, RW, hingga pemda
                  secara real time. Chat berizin, event, dan laporan terstruktur
                  membantu keputusan yang cepat dan transparan.
                </p>
              </div>
              <div className="fade-up fade-up-delay-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/auth/register"
                  className="rounded-full bg-[var(--blue-primary)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[rgba(24,95,165,0.3)] transition hover:-translate-y-0.5"
                >
                  Mulai sekarang
                </Link>
                <a
                  href="#latar"
                  className="rounded-full border border-[var(--blue-border)] bg-white/70 px-6 py-3 text-sm font-semibold text-[var(--blue-primary)] transition hover:-translate-y-0.5 hover:bg-white"
                >
                  Lihat latar belakang
                </a>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-[var(--blue-border)] bg-white/70 p-4 shadow-sm">
                  <p className="text-sm font-semibold text-[var(--blue-primary)]">
                    30 juta lansia
                  </p>
                  <p className="mt-2 text-xs text-[var(--neutral-text)]">
                    12% penduduk Indonesia menurut BPS 2024.
                  </p>
                </div>
                <div className="rounded-2xl border border-[var(--blue-border)] bg-white/70 p-4 shadow-sm">
                  <p className="text-sm font-semibold text-[var(--blue-primary)]">
                    &lt; 5 menit
                  </p>
                  <p className="mt-2 text-xs text-[var(--neutral-text)]">
                    Target first responder dari tetangga terdekat.
                  </p>
                </div>
                <div className="rounded-2xl border border-[var(--blue-border)] bg-white/70 p-4 shadow-sm">
                  <p className="text-sm font-semibold text-[var(--blue-primary)]">
                    Status real time
                  </p>
                  <p className="mt-2 text-xs text-[var(--neutral-text)]">
                    Laporan warga tercatat sampai pempus.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 top-16 hidden h-56 w-56 rounded-full border border-dashed border-[var(--blue-border)] opacity-40 lg:block" />
              <div className="rounded-[2rem] border border-[var(--blue-border)] bg-white/80 p-6 shadow-2xl shadow-[rgba(24,95,165,0.15)] backdrop-blur">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--blue-primary)]">
                      Dashboard terintegrasi
                    </p>
                    <p className="text-lg font-semibold text-[var(--blue-dark)]">
                      Ringkasan wilayah RT 05
                    </p>
                  </div>
                  <span className="rounded-full bg-[var(--green-light)] px-3 py-1 text-xs font-semibold text-[var(--green-dark)]">
                    128 warga online
                  </span>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-[var(--blue-border)] bg-[var(--blue-light)] p-4">
                    <p className="text-sm font-semibold text-[var(--blue-dark)]">
                      Emergency radius alert
                    </p>
                    <p className="mt-2 text-xs text-[var(--neutral-text)]">
                      6 warga terdekat merespons dalam 3 menit.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[var(--neutral-border)] bg-[var(--neutral-bg)] p-4">
                    <p className="text-sm font-semibold text-[var(--blue-dark)]">
                      Smart routing laporan
                    </p>
                    <p className="mt-2 text-xs text-[var(--neutral-text)]">
                      Laporan jalan rusak sudah di tingkat RW.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[var(--green-action)] bg-[var(--green-light)] p-4">
                    <p className="text-sm font-semibold text-[var(--green-dark)]">
                      Feedback accountability
                    </p>
                    <p className="mt-2 text-xs text-[var(--green-dark)]">
                      Alasan penundaan tercatat dan bisa diakses warga.
                    </p>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
                  <div className="rounded-xl border border-[var(--blue-border)] bg-white/80 p-3 text-center">
                    <p className="font-semibold text-[var(--blue-primary)]">19</p>
                    <p className="text-[var(--neutral-text)]">Diskusi</p>
                  </div>
                  <div className="rounded-xl border border-[var(--blue-border)] bg-white/80 p-3 text-center">
                    <p className="font-semibold text-[var(--blue-primary)]">6</p>
                    <p className="text-[var(--neutral-text)]">Event</p>
                  </div>
                  <div className="rounded-xl border border-[var(--blue-border)] bg-white/80 p-3 text-center">
                    <p className="font-semibold text-[var(--blue-primary)]">4</p>
                    <p className="text-[var(--neutral-text)]">Laporan</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <section id="latar" className="bg-white/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--blue-primary)]">
              Latar belakang
            </p>
            <h2
              className={`${fraunces.className} text-3xl font-semibold text-[var(--blue-dark)] sm:text-4xl`}
            >
              Tantangan RT dan RW yang perlu diselesaikan segera.
            </h2>
            <p className="max-w-2xl text-sm text-[var(--neutral-text)] sm:text-base">
              Transformasi digital dibutuhkan untuk menjawab kesenjangan
              keselamatan, respons darurat, dan transparansi birokrasi di level
              lingkungan.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {backgroundIssues.map((issue) => (
              <div
                key={issue.title}
                className="rounded-3xl border border-[var(--blue-border)] bg-[var(--blue-light)] p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-[var(--blue-dark)]">
                  {issue.title}
                </h3>
                <p className="mt-3 text-sm text-[var(--neutral-text)]">
                  {issue.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="ide" className="bg-[var(--neutral-bg)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16">
          <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="flex flex-col gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--blue-primary)]">
                Pemaparan ide
              </p>
              <h2
                className={`${fraunces.className} text-3xl font-semibold text-[var(--blue-dark)] sm:text-4xl`}
              >
                JagaWarga sebagai ekosistem digital berbasis PWA.
              </h2>
              <p className="text-sm text-[var(--neutral-text)] sm:text-base">
                Platform ini mengintegrasikan komunikasi, keamanan sosial, dan
                tata kelola administrasi dari RT hingga pemerintah daerah secara
                real time. Interaksi warga tidak berhenti di chat, tetapi
                berubah menjadi data terstruktur yang dapat ditindaklanjuti.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {ideaHighlights.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[var(--blue-border)] bg-white/70 px-4 py-2 text-xs font-semibold text-[var(--blue-primary)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-[var(--blue-border)] bg-white/70 p-6 shadow-sm">
              <p className="text-sm font-semibold text-[var(--blue-dark)]">
                Integrated Streamlining
              </p>
              <p className="mt-2 text-sm text-[var(--neutral-text)]">
                Setiap level birokrasi memiliki akses dashboard yang terhubung
                dan update otomatis.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {governanceFlow.map((step, index) => (
                  <span
                    key={step}
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--blue-light)] px-3 py-1 text-xs font-semibold text-[var(--blue-dark)]"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--blue-primary)] text-[10px] text-white">
                      {index + 1}
                    </span>
                    {step}
                  </span>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-[var(--green-action)] bg-[var(--green-light)] p-4">
                <p className="text-sm font-semibold text-[var(--green-dark)]">
                  Data-driven governance
                </p>
                <p className="mt-2 text-xs text-[var(--green-dark)]">
                  Pemerintah mendapat peta sebaran masalah dari laporan warga
                  yang tervalidasi berjenjang.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="tujuan" className="bg-[var(--blue-light)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--blue-primary)]">
              Tujuan dan solusi
            </p>
            <h2
              className={`${fraunces.className} text-3xl font-semibold text-[var(--blue-dark)] sm:text-4xl`}
            >
              Jaringan pengaman sosial yang cepat dan terukur.
            </h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {goalItems.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-[var(--blue-border)] bg-white/70 p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-[var(--blue-dark)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm text-[var(--neutral-text)]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
          <div
            id="bantuan"
            className="rounded-3xl border border-[var(--green-action)] bg-[var(--green-light)] p-6 shadow-sm"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--green-dark)]">
                  Emergency Button
                </p>
                <p className="mt-3 text-lg font-semibold text-[var(--green-dark)]">
                  Bantuan darurat dengan radius terdekat.
                </p>
                <p className="mt-2 text-sm text-[var(--green-dark)]">
                  Sistem memprioritaskan tetangga sekitar sebagai first responder
                  sebelum bantuan medis tiba.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-[var(--green-dark)]">
                  Ringan
                </span>
                <span className="rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-[var(--green-dark)]">
                  Mendesak
                </span>
                <span className="rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-[var(--green-dark)]">
                  Darurat
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="fitur" className="bg-white/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--blue-primary)]">
              Fitur dan keunikan
            </p>
            <h2
              className={`${fraunces.className} text-3xl font-semibold text-[var(--blue-dark)] sm:text-4xl`}
            >
              Sistem komunikasi yang berubah menjadi data aksi.
            </h2>
            <p className="max-w-2xl text-sm text-[var(--neutral-text)] sm:text-base">
              JagaWarga menggabungkan fitur interaktif dengan pelacakan laporan
              untuk memastikan setiap isu warga berujung pada tindakan nyata.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {uniqueFeatures.map((feature) => (
              <div
                key={feature.title}
                className="rounded-3xl border border-[var(--blue-border)] bg-[var(--blue-light)] p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-[var(--blue-dark)]">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm text-[var(--neutral-text)]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
          <div className="rounded-3xl border border-[var(--blue-border)] bg-white/70 p-6 shadow-sm">
            <p className="text-sm font-semibold text-[var(--blue-dark)]">
              Status laporan transparan
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="rounded-full bg-[var(--yellow-light)] px-3 py-1 text-xs font-semibold text-[var(--yellow-dark)]">
                Pending
              </span>
              <span className="rounded-full bg-[var(--green-light)] px-3 py-1 text-xs font-semibold text-[var(--green-dark)]">
                Approved
              </span>
              <span className="rounded-full bg-[var(--blue-light)] px-3 py-1 text-xs font-semibold text-[var(--blue-dark)]">
                Success
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="impact" className="bg-[var(--neutral-bg)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--blue-primary)]">
              Impact projection
            </p>
            <h2
              className={`${fraunces.className} text-3xl font-semibold text-[var(--blue-dark)] sm:text-4xl`}
            >
              Dampak yang terukur untuk warga dan pemerintah.
            </h2>
            <p className="max-w-2xl text-sm text-[var(--neutral-text)] sm:text-base">
              Efisiensi, transparansi, dan validitas kebijakan meningkat karena
              data warga terakumulasi secara sistematis.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {impactMetrics.map((metric) => (
              <div
                key={metric.value}
                className="rounded-3xl border border-[var(--blue-border)] bg-white/70 p-6 shadow-sm"
              >
                <p className="text-2xl font-semibold text-[var(--blue-primary)]">
                  {metric.value}
                </p>
                <p className="mt-3 text-sm text-[var(--neutral-text)]">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--blue-light)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16">
          <div className="rounded-3xl border border-[var(--blue-border)] bg-white/80 p-8 shadow-lg shadow-[rgba(24,95,165,0.12)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--blue-primary)]">
                  Siap diuji coba
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-[var(--blue-dark)]">
                  Mulai dari RT, meluas sampai pemda.
                </h3>
                <p className="mt-2 text-sm text-[var(--neutral-text)]">
                  Ajak warga mencoba JagaWarga dan rasakan perbedaannya.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/auth/register"
                  className="rounded-full bg-[var(--green-action)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[rgba(29,158,117,0.3)]"
                >
                  Daftar sekarang
                </Link>
                <Link
                  href="/auth/login"
                  className="rounded-full border border-[var(--blue-border)] bg-white/70 px-6 py-3 text-sm font-semibold text-[var(--blue-primary)]"
                >
                  Masuk
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[var(--neutral-bg)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-[var(--neutral-text)] sm:flex-row sm:items-center sm:justify-between">
          <p>JagaWarga - platform gotong royong digital.</p>
          <div className="flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--blue-primary)]">
            <span>Chat</span>
            <span>Emergency</span>
            <span>Routing</span>
            <span>Transparansi</span>
          </div>
        </div>
      </footer>

      <a
        href="#bantuan"
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-3 rounded-full bg-[var(--green-action)] px-5 py-3 text-sm font-semibold text-white shadow-2xl shadow-[rgba(29,158,117,0.35)] transition hover:-translate-y-0.5"
        aria-label="Buka bantuan cepat"
      >
        <span className="flex h-2 w-2 rounded-full bg-white" />
        Bantuan cepat
      </a>
    </main>
  );
}

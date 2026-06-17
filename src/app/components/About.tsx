import { useRef } from "react";
import { Cake, Ruler, Users, MapPin, Quote, Sparkles, Hash, Trophy, GraduationCap, Music, HelpCircle } from "lucide-react";
import { useReveal, useTilt } from "../lib/hooks";
import { SplitText } from "../lib/SplitText";
import { IMAGES } from "../lib/images";

const facts = [
  { icon: <Cake className="w-4 h-4" />, label: "Birthday", value: "January 13, 2009" },
  { icon: <Ruler className="w-4 h-4" />, label: "Height", value: "162 cm" },
  { icon: <Users className="w-4 h-4" />, label: "Team", value: "Team Passion" },
  { icon: <MapPin className="w-4 h-4" />, label: "Hometown", value: "Bandung, West Java" },
];

const triviaItems = [
  {
    icon: <Trophy className="w-5 h-5" />,
    title: "Jago Tenis Meja",
    description: "Selain aktif menari, Ribka mahir bermain ping pong dan pernah aktif mengikuti ekstrakurikuler tenis meja semasa sekolah."
  },
  {
    icon: <GraduationCap className="w-5 h-5" />,
    title: "Prestasi Matematika",
    description: "Ribka berprestasi cemerlang di bidang akademis, terbukti ia pernah mewakili sekolahnya dalam Olimpiade Matematika hingga mencapai babak semifinal."
  },
  {
    icon: <Music className="w-5 h-5" />,
    title: "Pelopor Dua Setlist Teater",
    description: "Ia merupakan member JKT48 generasi ke-12 pertama yang dipercaya membawakan 2 setlist teater reguler sekaligus, yaitu 'Renai Kinshi Jourei' dan 'Te wo Tsunaginagara'."
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: "Misteri 652 Helaian Poni",
    description: "Di salah satu sesi live streaming IDN Live yang ikonik, ia menghibur fans dengan iseng menghitung jumlah poninya satu per satu hingga mencapai total 652 helai."
  },
  {
    icon: <HelpCircle className="w-5 h-5" />,
    title: "Pecinta Madrid & Kuliner Bandung",
    description: "Ia merupakan pendukung setia klub sepak bola Real Madrid C.F. dan sangat menyukai hidangan khas kampung halamannya, Ayam Madu Bandung."
  },
  {
    icon: <Hash className="w-5 h-5" />,
    title: "Tagar Fanbase Khusus",
    description: "Memiliki tagar unik untuk berinteraksi dengan fans: #BudiMonday (setiap hari Senin), #CallRib (untuk Video Call), dan #Ribply (balasan PM)."
  }
];

export function About() {
  const sectionRef = useReveal<HTMLElement>({ selector: ".about-reveal", stagger: 0.12 });
  const tiltRef = useTilt<HTMLDivElement>(8);
  const factsRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="about-profile"
      ref={sectionRef}
      className="py-24 bg-white dark:bg-[#0f0f0f] transition-colors"
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
        {/* Image */}
        <div className="about-reveal flex justify-center md:justify-start">
          <div ref={tiltRef} className="relative">
            <div className="absolute -top-5 -left-5 w-28 h-28 rounded-full border-2 border-[#E21F26]/30" />
            <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-3xl bg-[#E21F26]/10" />
            <div className="relative z-10 w-[20rem] h-[26rem] rounded-3xl overflow-hidden shadow-2xl shadow-black/30 border border-black/5 dark:border-white/10">
              <img
                src={IMAGES.profile}
                alt="Ribka Budiman"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 z-20 bg-[#E21F26] text-white rounded-2xl px-5 py-2.5 shadow-lg shadow-[#E21F26]/30 whitespace-nowrap">
              <span className="font-extrabold text-sm tracking-wide">Generasi 12 · JKT48</span>
            </div>
          </div>
        </div>

        {/* Text */}
        <div>
          <div className="about-reveal flex items-center gap-2 mb-3">
            <div className="w-8 h-0.5 bg-[#E21F26]" />
            <span className="text-[#E21F26] text-xs font-bold uppercase tracking-widest">
              Get to know
            </span>
          </div>

          <SplitText
            as="h2"
            text="Meet Ribka"
            by="char"
            className="block text-[#1a1a1a] dark:text-white leading-tight"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.02em" }}
          />

          <p className="about-reveal text-gray-500 dark:text-white/60 mt-4 leading-relaxed max-w-lg">
            Ribka Budiman (dikenal sebagai Ribka atau Ribi) adalah member generasi ke-12 JKT48 yang bergabung sejak November 2023. Memiliki hobi menari dan menonton film, Ribka dipromosikan menjadi member reguler pada Januari 2026 dan kini menjadi bagian dari Team Passion. Ia dikenal sebagai sosok yang cerdas dan berbakat, terbukti dari prestasinya sebagai semifinalis Olimpiade Matematika sekolah.
          </p>

          {/* Quote */}
          <div className="about-reveal mt-6 flex gap-3 bg-[#f8f8fa] dark:bg-white/5 rounded-2xl p-5 border border-black/5 dark:border-white/10 max-w-lg">
            <Quote className="w-6 h-6 text-[#E21F26] shrink-0" />
            <p className="text-[#1a1a1a] dark:text-white/90 italic text-sm leading-relaxed">
              "Mirror mirror on the wall, who's the sweetest in here? It's me, Ribka!" — Ribka
            </p>
          </div>

          {/* Facts grid */}
          <div ref={factsRef} className="grid grid-cols-2 gap-3 mt-6 max-w-lg">
            {facts.map((f) => (
              <div
                key={f.label}
                className="about-reveal flex items-center gap-3 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-3.5 hover:border-[#E21F26]/40 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-[#E21F26]/10 text-[#E21F26] flex items-center justify-center shrink-0">
                  {f.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-gray-400 dark:text-white/40 text-xs font-medium uppercase tracking-wide">
                    {f.label}
                  </p>
                  <p className="text-[#1a1a1a] dark:text-white font-bold text-sm truncate">
                    {f.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trivia Section */}
      <div className="max-w-7xl mx-auto px-6 mt-16 border-t border-black/5 dark:border-white/10 pt-12">
        <h3 className="about-reveal text-xl font-extrabold text-[#1a1a1a] dark:text-white mb-8 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#E21F26]" />
          Trivia & Fun Facts
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {triviaItems.map((t, idx) => (
            <div
              key={idx}
              className="about-reveal bg-[#f8f8fa] dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-5 hover:border-[#E21F26]/40 hover:shadow-lg transition-all duration-300 flex gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-[#E21F26]/10 text-[#E21F26] flex items-center justify-center shrink-0">
                {t.icon}
              </div>
              <div>
                <h4 className="text-[#1a1a1a] dark:text-white font-bold text-sm">
                  {t.title}
                </h4>
                <p className="text-gray-500 dark:text-white/60 text-xs mt-1.5 leading-relaxed">
                  {t.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

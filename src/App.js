import React, { useState, useEffect } from "react";
import {
  Instagram,
  Dumbbell,
  Utensils,
  MapPin,
  ChevronDown,
  Check,
  ExternalLink,
  Menu,
  X,
  Mail,
  TrendingUp,
  Euro,
  Zap,
} from "lucide-react";

// Component voor de Macro Calculator
const MacroCalculator = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState(""); // Nieuw: Lengte in cm
  const [age, setAge] = useState(""); // Nieuw: Leeftijd
  const [gender, setGender] = useState("male"); // Nieuw: Geslacht
  const [goal, setGoal] = useState("maintain");
  const [activity, setActivity] = useState(1.55); // Gemiddeld actief
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const calculateMacros = () => {
    const W = parseFloat(weight);
    const H = parseFloat(height);
    const A = parseInt(age);

    if (!W || !H || !A || W <= 0 || H <= 0 || A <= 0) {
      setError("Vul geldige waarden in voor gewicht, lengte en leeftijd.");
      setResults(null);
      return;
    }
    setError("");

    // 1. Schat BMR (Basale Metabolisme) met de Mifflin-St Jeor formule
    let BMR;
    if (gender === "male") {
      // Mannen: (10 * W) + (6.25 * H) - (5 * A) + 5
      BMR = 10 * W + 6.25 * H - 5 * A + 5;
    } else {
      // Vrouwen: (10 * W) + (6.25 * H) - (5 * A) - 161
      BMR = 10 * W + 6.25 * H - 5 * A - 161;
    }

    // 2. Bereken TDEE (Totale Dagelijkse Energieverbruik) = BMR * Activiteitsfactor
    let TDEE = BMR * activity;

    // 3. Pas aan voor doel
    let calorieTarget = TDEE;
    if (goal === "lose") {
      calorieTarget -= 500; // Calorieën aftrekken
    } else if (goal === "gain") {
      calorieTarget += 300; // Calorieën toevoegen
    }

    calorieTarget = Math.round(calorieTarget);

    // 4. Verdeel Macro's
    // Eiwit: 2.2 gram per kg lichaamsgewicht (hoog voor powerlifters)
    const proteinGrams = Math.round(W * 2.2);
    const proteinCals = proteinGrams * 4;

    // Vetten: 25% van de totale calorieën (een gezonde ondergrens)
    const fatCals = Math.round(calorieTarget * 0.25);
    const fatGrams = Math.round(fatCals / 9);

    // Koolhydraten: Resterende calorieën
    const remainingCals = calorieTarget - proteinCals - fatCals;
    const carbGrams = Math.round(remainingCals / 4);

    setResults({
      calories: calorieTarget,
      protein: proteinGrams,
      fat: fatGrams,
      carbs: carbGrams,
    });
  };

  const goalOptions = {
    lose: "Snijden (Deficit)",
    maintain: "Onderhouden (Onderhoud)",
    gain: "Aankomen (Surplus)",
  };

  return (
    <div className="bg-zinc-950 p-6 md:p-8 rounded-sm border border-zinc-800">
      <h3 className="text-2xl font-bold uppercase mb-4 text-orange-500 flex items-center gap-2">
        <Utensils size={24} /> Macro Calculator
      </h3>
      <p className="text-zinc-400 mb-6">
        Schat je TDEE en verdeel je macro's op basis van je doelen. Gebruikt de
        Mifflin-St Jeor formule.
      </p>

      {error && (
        <div className="bg-red-900/30 text-red-400 p-3 rounded-sm mb-4 flex items-center gap-2">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Geslacht */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Geslacht
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-sm focus:border-orange-500 focus:ring-orange-500 transition-colors"
          >
            <option value="male">Man</option>
            <option value="female">Vrouw</option>
          </select>
        </div>
        {/* Gewicht */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Gewicht (kg)
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-sm focus:border-orange-500 focus:ring-orange-500 transition-colors"
            placeholder="Bijv. 95"
          />
        </div>
        {/* Lengte */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Lengte (cm)
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-sm focus:border-orange-500 focus:ring-orange-500 transition-colors"
            placeholder="Bijv. 180"
          />
        </div>
        {/* Leeftijd */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Leeftijd
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-sm focus:border-orange-500 focus:ring-orange-500 transition-colors"
            placeholder="Bijv. 30"
          />
        </div>
      </div>

      {/* Doel en Activiteit */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Doelstelling
          </label>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-sm focus:border-orange-500 focus:ring-orange-500 transition-colors"
          >
            {Object.entries(goalOptions).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Activiteitsniveau (Vuistregel)
          </label>
          <select
            value={activity}
            onChange={(e) => setActivity(parseFloat(e.target.value))}
            className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-sm focus:border-orange-500 focus:ring-orange-500 transition-colors"
          >
            <option value={1.375}>Licht (kantoorwerk, weinig training)</option>
            <option value={1.55}>Gemiddeld (3-5x trainen, actief werk)</option>
            <option value={1.725}>Hoog (6-7x trainen, fysiek werk)</option>
          </select>
        </div>
      </div>

      <button
        onClick={calculateMacros}
        disabled={!weight || !height || !age}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 uppercase tracking-wide rounded-sm transition-colors disabled:bg-zinc-700 disabled:cursor-not-allowed"
      >
        Bereken Macro's
      </button>

      {results && (
        <div className="mt-8 pt-6 border-t border-zinc-700">
          <h4 className="text-xl font-bold uppercase text-white mb-4">
            Resultaat ({goalOptions[goal]})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-zinc-900 p-4 rounded-sm border-l-4 border-orange-500">
              <p className="text-3xl font-black text-white">
                {results.calories}
              </p>
              <p className="text-sm text-zinc-400 uppercase">Calorieën</p>
            </div>
            <div className="bg-zinc-900 p-4 rounded-sm border-l-4 border-red-500">
              <p className="text-3xl font-black text-white">
                {results.protein}g
              </p>
              <p className="text-sm text-zinc-400 uppercase">Eiwit</p>
            </div>
            <div className="bg-zinc-900 p-4 rounded-sm border-l-4 border-green-500">
              <p className="text-3xl font-black text-white">{results.fat}g</p>
              <p className="text-sm text-zinc-400 uppercase">Vetten</p>
            </div>
            <div className="bg-zinc-900 p-4 rounded-sm border-l-4 border-blue-500">
              <p className="text-3xl font-black text-white">{results.carbs}g</p>
              <p className="text-sm text-zinc-400 uppercase">Koolhydraten</p>
            </div>
          </div>
          <p className="text-zinc-500 text-xs mt-4">
            * Dit is een schatting. Voor precisie, start Full Coaching.
          </p>
        </div>
      )}
    </div>
  );
};

// Component voor de RPE Calculator
const RpeCalculator = () => {
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [rpe, setRpe] = useState("");
  const [result1RM, setResult1RM] = useState(null);
  const [error, setError] = useState("");

  const calculate1RM = () => {
    const W = parseFloat(weight);
    const R = parseInt(reps);
    const E = parseFloat(rpe); // RPE kan decimalen bevatten (8.5)

    if (!W || !R || !E || W <= 0 || R <= 0 || E < 6 || E > 10) {
      setError(
        "Vul geldige waarden in (gewicht > 0, herhalingen > 0, RPE tussen 6 en 10)."
      );
      setResult1RM(null);
      return;
    }
    setError("");

    // Gebruik de Epley formule voor geschatte 1RM: 1RM = Gewicht * (1 + Reps/30)
    const estimated1RM = W * (1 + R / 30);

    // Relatieve intensiteit (RPE-tabel) - dit is een schatting op basis van Reps In Reserve (RiR)
    // Vereenvoudigde relatie: 10 - RPE = RiR.
    const riR = Math.round(10 - E);

    setResult1RM({
      estimated1RM: estimated1RM.toFixed(1),
      riR: riR,
      // Dit is het gewicht dat je zou kunnen tillen als je tot RPE 10 zou gaan
      rpe10Equivalent: (W / (1 - R * 0.0333)).toFixed(1), // Gebaseerd op Brzycki/Epley variant
    });
  };

  return (
    <div className="bg-zinc-950 p-6 md:p-8 rounded-sm border border-zinc-800">
      <h3 className="text-2xl font-bold uppercase mb-4 text-orange-500 flex items-center gap-2">
        <Dumbbell size={24} /> RPE / 1RM Schatting
      </h3>
      <p className="text-zinc-400 mb-6">
        Bereken je geschatte 1-Rep Max op basis van je laatste set, RPE en
        herhalingen.
      </p>

      {error && (
        <div className="bg-red-900/30 text-red-400 p-3 rounded-sm mb-4 flex items-center gap-2">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Opgetild Gewicht (kg)
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-sm focus:border-orange-500 transition-colors"
            placeholder="Bijv. 180"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Herhalingen (Reps)
          </label>
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-sm focus:border-orange-500 transition-colors"
            placeholder="Bijv. 5"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            RPE (6.0 - 10.0)
          </label>
          <input
            type="number"
            min="6"
            max="10"
            step="0.5"
            value={rpe}
            onChange={(e) => setRpe(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-sm focus:border-orange-500 transition-colors"
            placeholder="Bijv. 8.5"
          />
        </div>
      </div>

      <button
        onClick={calculate1RM}
        disabled={!weight || !reps || !rpe}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 uppercase tracking-wide rounded-sm transition-colors disabled:bg-zinc-700 disabled:cursor-not-allowed"
      >
        Schat 1RM
      </button>

      {result1RM && (
        <div className="mt-8 pt-6 border-t border-zinc-700">
          <h4 className="text-xl font-bold uppercase text-white mb-4">
            Analyse
          </h4>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-zinc-900 p-4 rounded-sm border-l-4 border-orange-500">
              <p className="text-3xl font-black text-white">
                {result1RM.estimated1RM} kg
              </p>
              <p className="text-sm text-zinc-400 uppercase">Geschatte 1RM</p>
            </div>
            <div className="bg-zinc-900 p-4 rounded-sm border-l-4 border-red-600">
              <p className="text-3xl font-black text-white">{result1RM.riR}</p>
              <p className="text-sm text-zinc-400 uppercase">
                Reps In Reserve (RiR)
              </p>
            </div>
          </div>
          <p className="text-zinc-500 text-xs mt-4">
            * De 1RM schatting is gebaseerd op de Epley-formule.
          </p>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll for navbar transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="bg-zinc-950 text-white min-h-screen font-sans selection:bg-orange-600 selection:text-white">
      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="text-2xl font-black tracking-tighter uppercase italic">
            Striktly <span className="text-orange-500">Powerhouse</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 font-bold text-sm tracking-wide uppercase items-center">
            <button
              onClick={() => scrollToSection("about")}
              className="hover:text-orange-500 transition-colors"
            >
              Over Mij
            </button>
            <button
              onClick={() => scrollToSection("method")}
              className="hover:text-orange-500 transition-colors"
            >
              Methode
            </button>
            <button
              onClick={() => scrollToSection("tools")}
              className="hover:text-orange-500 transition-colors"
            >
              Hulpmiddelen
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="hover:text-orange-500 transition-colors"
            >
              Tarieven
            </button>
            <button
              onClick={() => scrollToSection("target-audience")}
              className="hover:text-orange-500 transition-colors"
            >
              Voor Wie?
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-sm transition-colors skew-x-[-10deg]"
            >
              <span className="skew-x-[10deg] block">Start Nu</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-zinc-900 border-b border-zinc-800 py-4 px-6 flex flex-col space-y-4 shadow-xl">
            <button
              onClick={() => scrollToSection("about")}
              className="text-left font-bold uppercase hover:text-orange-500"
            >
              Over Mij
            </button>
            <button
              onClick={() => scrollToSection("method")}
              className="text-left font-bold uppercase hover:text-orange-500"
            >
              Methode
            </button>
            <button
              onClick={() => scrollToSection("tools")}
              className="text-left font-bold uppercase hover:text-orange-500"
            >
              Hulpmiddelen
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-left font-bold uppercase hover:text-orange-500"
            >
              Tarieven
            </button>
            <button
              onClick={() => scrollToSection("target-audience")}
              className="text-left font-bold uppercase hover:text-orange-500"
            >
              Voor Wie?
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-left font-bold uppercase text-orange-500"
            >
              Start Nu
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=1920&auto=format&fit=crop"
            alt="Gym Background"
            className="w-full h-full object-cover opacity-40 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <p className="text-orange-500 font-bold tracking-[0.2em] uppercase mb-4 animate-fade-in-up">
            Bram Strik Coaching
          </p>
          <h1
            className="text-5xl md:text-7xl lg:text-9xl font-black uppercase italic leading-none mb-6 tracking-tighter animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            Geen Poespas.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
              Alleen Resultaat.
            </span>
          </h1>
          <p
            className="text-zinc-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            Powerlifting coaching gebaseerd op topsport mentaliteit,
            biomechanica en jarenlange ervaring. Vanuit Alicante, voor atleten
            wereldwijd.
          </p>
          <div
            className="flex flex-col md:flex-row gap-4 justify-center items-center animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <button
              onClick={() => scrollToSection("contact")}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-10 rounded-sm uppercase tracking-wide transition-all hover:scale-105 skew-x-[-10deg]"
            >
              <span className="skew-x-[10deg] block">Word Sterker</span>
            </button>
            <a
              href="https://www.instagram.com/striktly_powerhouse/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors border border-zinc-700 px-6 py-4 rounded-sm hover:border-zinc-500 skew-x-[-10deg]"
            >
              <span className="skew-x-[10deg] flex items-center gap-2">
                <Instagram size={20} /> Volg op Instagram
              </span>
            </a>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-zinc-500">
          <ChevronDown size={32} />
        </div>
      </header>

      {/* Results Ticker */}
      <div className="bg-orange-600 py-3 overflow-hidden whitespace-nowrap relative z-20">
        <div className="inline-block animate-marquee text-black font-black uppercase italic tracking-wider text-sm md:text-base">
          <span className="mx-4">NK Kwalificaties</span> •{" "}
          <span className="mx-4">PR's Verbroken</span> •{" "}
          <span className="mx-4">Blessurevrij Trainen</span> •{" "}
          <span className="mx-4">Wedstrijd Coaching</span> •{" "}
          <span className="mx-4">Internationale Expertise</span> •{" "}
          <span className="mx-4">NK Kwalificaties</span> •{" "}
          <span className="mx-4">PR's Verbroken</span> •{" "}
          <span className="mx-4">Blessurevrij Trainen</span>
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="py-20 bg-zinc-950 relative">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-orange-500 z-0"></div>
              <img
                src="https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=1200&auto=format&fit=crop"
                alt="Bram Strik Training"
                className="w-full h-auto grayscale contrast-125 rounded-sm relative z-10 shadow-2xl shadow-orange-900/20"
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-4 border-r-4 border-orange-500 z-0"></div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-orange-500 font-bold uppercase tracking-widest mb-2">
                <MapPin size={18} />
                <span>Alicante, Spanje</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black uppercase italic mb-6">
                De Coach
              </h2>
              <p className="text-zinc-400 text-lg mb-6 leading-relaxed">
                Mijn naam is{" "}
                <span className="text-white font-bold">Bram Strik</span>. Ik ben
                een powerlift coach die weet wat het vraagt om op het hoogste
                niveau te presteren.
              </p>
              <p className="text-zinc-400 text-lg mb-6 leading-relaxed">
                Mijn achtergrond ligt in het Judo, waar ik jarenlang op hoog
                niveau heb gestreden. Die discipline, mentale hardheid en kennis
                van lichaamsmechanica vormen de basis van mijn coaching. Ik
                geloof niet in zweverig gedoe. Ik geloof in hard werken, slim
                programmeren en consistentie.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <div className="bg-zinc-900 px-4 py-3 border-l-2 border-orange-500">
                  <span className="block text-2xl font-bold text-white">
                    10+
                  </span>
                  <span className="text-xs text-zinc-500 uppercase">
                    Jaar Ervaring
                  </span>
                </div>
                <div className="bg-zinc-900 px-4 py-3 border-l-2 border-orange-500">
                  <span className="block text-2xl font-bold text-white">
                    Judo
                  </span>
                  <span className="text-xs text-zinc-500 uppercase">
                    Achtergrond
                  </span>
                </div>
                <div className="bg-zinc-900 px-4 py-3 border-l-2 border-orange-500">
                  <span className="block text-2xl font-bold text-white">
                    Intl.
                  </span>
                  <span className="text-xs text-zinc-500 uppercase">
                    Coaching
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section
        id="method"
        className="py-20 bg-zinc-900/50 border-y border-zinc-900"
      >
        <div className="container mx-auto px-6 text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black uppercase italic mb-4">
            Mijn Methode
          </h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
        </div>

        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-zinc-950 p-8 border border-zinc-800 hover:border-orange-500/50 transition-colors group">
            <div className="w-14 h-14 bg-zinc-900 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-600 transition-colors text-orange-500 group-hover:text-white">
              <Dumbbell size={28} />
            </div>
            <h3 className="text-xl font-bold uppercase mb-4 text-white">
              Biomechanica & Kracht
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              Mijn schema's zijn gebaseerd op bewezen biomechanische principes.
              Geen random oefeningen, maar een doordacht plan dat focust op
              efficiëntie. Sterker worden begint bij slim bewegen.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-zinc-950 p-8 border border-zinc-800 hover:border-orange-500/50 transition-colors group">
            <div className="w-14 h-14 bg-zinc-900 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-600 transition-colors text-orange-500 group-hover:text-white">
              <Utensils size={28} />
            </div>
            <h3 className="text-xl font-bold uppercase mb-4 text-white">
              Prestatie Voeding
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              Voeding is brandstof. Ik focus op darmgezondheid en
              opneembaarheid. Wat je niet verteert, kun je niet gebruiken om te
              herstellen. Ik pas dit specifiek aan op jouw allergieën of
              intoleranties.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-zinc-950 p-8 border border-zinc-800 hover:border-orange-500/50 transition-colors group">
            <div className="w-14 h-14 bg-zinc-900 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-600 transition-colors text-orange-500 group-hover:text-white">
              <Check size={28} />
            </div>
            <h3 className="text-xl font-bold uppercase mb-4 text-white">
              Directe Aanpak
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              Ik ben direct. Als je techniek niet goed is, zeg ik het. Als je
              wint, vieren we het. Ik coach atleten die willen groeien, niet
              mensen die excuses zoeken. Geen poespas.
            </p>
          </div>
        </div>
      </section>

      {/* Tools Section (Updated) */}
      <section id="tools" className="py-20 bg-zinc-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black uppercase italic mb-4 flex items-center justify-center gap-4">
              <Zap size={40} className="text-orange-500" /> Hulpmiddelen &
              Analyse
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Gebruik deze tools voor snelle analyse van je training en voeding.
              Dit is hoe we de data vertalen naar progressie.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <MacroCalculator />
            <RpeCalculator />
          </div>

          {/* De QuickQandA (Gemini LLM) sectie is hier verwijderd */}
        </div>
      </section>

      {/* Target Audience Section */}
      <section id="target-audience" className="py-20 bg-zinc-900/50">
        <div className="container mx-auto px-6">
          <div className="bg-zinc-900 p-8 md:p-12 border border-zinc-800 rounded-sm">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-black uppercase italic mb-6">
                  Voor wie is dit?
                </h2>
                <p className="text-zinc-400 text-lg mb-6">
                  Mijn coaching is niet voor iedereen. Ik zoek toewijding. Of je
                  nu net begint of al jaren traint, je instelling bepaalt je
                  succes.
                </p>
                <ul className="space-y-4">
                  {[
                    "Je wilt serieus sterker worden (Powerlifting/SBD)",
                    "Je bent bereid feedback te ontvangen en toe te passen",
                    "Je zoekt een schema dat rekening houdt met jouw lichaam",
                    "Je begrijpt dat resultaat tijd en inzet kost",
                  ].map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 text-white font-bold"
                    >
                      <TrendingUp
                        size={20}
                        className="text-orange-500 min-w-[20px]"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t md:border-t-0 md:border-l border-zinc-800 pt-8 md:pt-0 md:pl-12 flex flex-col justify-center">
                <h3 className="text-2xl font-bold uppercase text-white mb-4">
                  Wie ik{" "}
                  <span className="text-red-600 line-through decoration-2">
                    niet
                  </span>{" "}
                  zoek:
                </h3>
                <ul className="space-y-3 text-zinc-400">
                  <li className="flex items-center gap-3">
                    <X size={18} className="text-red-600 min-w-[18px]" /> Mensen
                    die smoesjes verzinnen
                  </li>
                  <li className="flex items-center gap-3">
                    <X size={18} className="text-red-600 min-w-[18px]" />{" "}
                    Atleten die niet willen communiceren
                  </li>
                  <li className="flex items-center gap-3">
                    <X size={18} className="text-red-600 min-w-[18px]" /> "Quick
                    fix" zoekers
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nutrition Spotlight */}
      <section id="nutrition" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=1920&auto=format&fit=crop"
            alt="Healthy Food"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-zinc-950/80"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-black uppercase italic mb-6">
              Voeding & <br />
              <span className="text-orange-500">Darmgezondheid</span>
            </h2>
            <p className="text-zinc-300 text-lg mb-6">
              Veel coaches geven je macro's en laten je zwemmen. Ik kijk verder.
              Mijn voedingsstrategie is ontworpen om je spijsvertering te
              optimaliseren.
            </p>
            <ul className="space-y-4">
              {[
                "Focus op licht verteerbare voeding",
                "Rijk aan micronutriënten voor herstel",
                "Compleet aangepast op intoleranties (Gluten, Lactose, etc.)",
                "Simpel, effectief en vol te houden",
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 text-zinc-200"
                >
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="md:w-1/2 bg-zinc-900 p-8 rounded-sm border-l-4 border-orange-500 shadow-lg">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-orange-500">"</span>
              Geen one-size-fits-all.
              <span className="text-orange-500">"</span>
            </h3>
            <p className="text-zinc-400 italic">
              "Ik heb vaak atleten met allergieën. Als jij niet tegen lactose
              kan, of gluten, of bepaalde groenten, bouwen we daar omheen. Het
              doel blijft: maximaal resultaat zonder darmklachten. Een
              opgeblazen atleet kan niet optimaal presteren."
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-orange-500">
                BS
              </div>
              <div className="text-sm font-bold text-white uppercase">
                Bram Strik
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-20 bg-zinc-900 border-t border-zinc-800"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black uppercase italic mb-4">
              Tarieven & Opbouw
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Ik werk met duidelijke pakketten. Je betaalt voor expertise, niet
              voor uurtje-factuurtje. Kwaliteit staat voorop.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Package 1 */}
            <div className="bg-zinc-950 p-8 border border-zinc-800 flex flex-col relative">
              <h3 className="text-2xl font-bold uppercase text-white mb-2">
                Programmering
              </h3>
              <p className="text-zinc-500 text-sm mb-6 uppercase tracking-wider">
                De Basis
              </p>
              <div className="text-3xl font-black text-orange-500 mb-6">
                € Op aanvraag
                <span className="text-sm text-zinc-500 font-normal">
                  {" "}
                  / maand
                </span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex gap-3 text-zinc-300 text-sm">
                  <Check size={16} className="text-orange-500 min-w-[16px]" />{" "}
                  Op maat gemaakt schema
                </li>
                <li className="flex gap-3 text-zinc-300 text-sm">
                  <Check size={16} className="text-orange-500 min-w-[16px]" />{" "}
                  Maandelijkse aanpassingen
                </li>
                <li className="flex gap-3 text-zinc-300 text-sm">
                  <Check size={16} className="text-orange-500 min-w-[16px]" />{" "}
                  Focus op techniek
                </li>
              </ul>
              <button
                onClick={() => scrollToSection("contact")}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-3 uppercase text-sm tracking-wide transition-colors border border-zinc-700"
              >
                Meer Info
              </button>
            </div>

            {/* Package 2 (Highlighted) */}
            <div className="bg-zinc-900 p-8 border-2 border-orange-600 flex flex-col relative transform md:-translate-y-4 shadow-2xl shadow-orange-900/20">
              <div className="absolute top-0 right-0 bg-orange-600 text-white text-xs font-bold px-3 py-1 uppercase tracking-wide">
                Meest Gekozen
              </div>
              <h3 className="text-2xl font-bold uppercase text-white mb-2">
                Full Coaching
              </h3>
              <p className="text-zinc-400 text-sm mb-6 uppercase tracking-wider">
                Het complete pakket
              </p>
              <div className="text-3xl font-black text-orange-500 mb-6">
                € Op aanvraag
                <span className="text-sm text-zinc-500 font-normal">
                  {" "}
                  / maand
                </span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex gap-3 text-white text-sm font-bold">
                  <Check size={16} className="text-orange-500 min-w-[16px]" />{" "}
                  Wekelijkse Check-ins
                </li>
                <li className="flex gap-3 text-white text-sm font-bold">
                  <Check size={16} className="text-orange-500 min-w-[16px]" />{" "}
                  Techniek Video Analyse (Onbeperkt)
                </li>
                <li className="flex gap-3 text-white text-sm font-bold">
                  <Check size={16} className="text-orange-500 min-w-[16px]" />{" "}
                  Voedingsbegeleiding op maat
                </li>
                <li className="flex gap-3 text-white text-sm font-bold">
                  <Check size={16} className="text-orange-500 min-w-[16px]" />{" "}
                  Wedstrijdvoorbereiding (Peaking)
                </li>
              </ul>
              <button
                onClick={() => scrollToSection("contact")}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 uppercase text-sm tracking-wide transition-colors"
              >
                Start Coaching
              </button>
            </div>

            {/* Package 3 */}
            <div className="bg-zinc-950 p-8 border border-zinc-800 flex flex-col relative">
              <h3 className="text-2xl font-bold uppercase text-white mb-2">
                Consult / Los
              </h3>
              <p className="text-zinc-500 text-sm mb-6 uppercase tracking-wider">
                Eenmalig
              </p>
              <div className="text-3xl font-black text-orange-500 mb-6">
                € Op aanvraag
                <span className="text-sm text-zinc-500 font-normal">
                  {" "}
                  / sessie
                </span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex gap-3 text-zinc-300 text-sm">
                  <Check size={16} className="text-orange-500 min-w-[16px]" />{" "}
                  Eenmalige techniek check
                </li>
                <li className="flex gap-3 text-zinc-300 text-sm">
                  <Check size={16} className="text-orange-500 min-w-[16px]" />{" "}
                  Deep-dive in programmering
                </li>
                <li className="flex gap-3 text-zinc-300 text-sm">
                  <Check size={16} className="text-orange-500 min-w-[16px]" />{" "}
                  Sparren over aanpak
                </li>
              </ul>
              <button
                onClick={() => scrollToSection("contact")}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-3 uppercase text-sm tracking-wide transition-colors border border-zinc-700"
              >
                Neem Contact Op
              </button>
            </div>
          </div>

          <div className="mt-12 text-center max-w-3xl mx-auto">
            <div className="bg-zinc-950 p-6 border border-zinc-800 inline-block text-left">
              <h4 className="text-orange-500 font-bold uppercase mb-2 flex items-center gap-2">
                <Euro size={18} /> Transparantie in kosten
              </h4>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Mijn tarieven zijn gebaseerd op de intensiteit van de
                begeleiding. Je betaalt maandelijks via automatische incasso of
                factuur. Geen verborgen kosten, wel opzegtermijnen die we vooraf
                helder afspreken. Ik investeer tijd in jou, ik verwacht dat jij
                investeert in je proces.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 bg-orange-600 relative">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic text-white mb-8">
            Klaar om te breken met het gemiddelde?
          </h2>
          <p className="text-orange-100 text-xl max-w-2xl mx-auto mb-10">
            Of je nu jong bent of oud, beginner of gevorderd. Als je de inzet
            toont, lever ik de kennis.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-6">
            <a
              href="https://powerlifting.nl/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-zinc-950 text-white hover:bg-zinc-900 font-bold py-4 px-12 rounded-sm uppercase tracking-wide transition-all shadow-xl skew-x-[-10deg] flex items-center justify-center gap-2"
            >
              <span className="skew-x-[10deg] flex items-center gap-2">
                Bezoek Powerlifting.nl <ExternalLink size={18} />
              </span>
            </a>

            <a
              href="mailto:info@powerlifting.nl"
              className="bg-white text-orange-600 hover:bg-zinc-100 font-bold py-4 px-12 rounded-sm uppercase tracking-wide transition-all shadow-xl skew-x-[-10deg] flex items-center justify-center gap-2"
            >
              <span className="skew-x-[10deg] flex items-center gap-2">
                Stuur een Email <Mail size={18} />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 py-12 border-t border-zinc-900">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h4 className="text-2xl font-black uppercase italic text-white">
              Striktly <span className="text-orange-500">Powerhouse</span>
            </h4>
            <p className="text-zinc-500 text-sm mt-2">
              © {new Date().getFullYear()} Bram Strik. All rights reserved.
            </p>
          </div>

          <div className="flex gap-6">
            <a
              href="https://www.instagram.com/striktly_powerhouse/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-orange-500 transition-colors"
            >
              <Instagram size={24} />
            </a>
            <a
              href="https://powerlifting.nl/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-orange-500 transition-colors"
            >
              <ExternalLink size={24} />
            </a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default App;

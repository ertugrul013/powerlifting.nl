# README — Striktly Powerhouse React App

## Overzicht

Single-file React app met Tailwind-styling. Bevat:

- Home pagina met secties: Hero, About, Methode, Target Audience, Atleten Highlights, Voeding, Pricing, Contact, Footer.
- Tools pagina met 3 tools: RPE Calculator, Macro Calculator, Plate Loader.
- Plate Loader heeft visuele bar/plate weergave en toggle voor competitie clips.

App gebruikt geen externe router; wisselt pagina via interne state en scroll-anchors.

## Tech stack

- React (function components, hooks)
- TailwindCSS classes
- lucide-react icon set

## Bestanden / structuur

Huidige implementatie staat in één bestand:

- `App` (root)
  - `HomePage`
  - `ToolsPage`
  - Tools:
    - `RpeCalculator`
    - `MacroCalculator`
    - `PlateLoader`
      - `PlateResultBlock`
      - `PlateVisualizer`
  - Helpers:
    - `calculatePlatesPerSide`
    - `plateColorClass`
    - constants: `BAR_WEIGHT`, `COLLAR_WEIGHT_TOTAL`, `COMPETITION_PLATES`

Als je dit splitst:

```
src/
  App.tsx
  pages/
    HomePage.tsx
    ToolsPage.tsx
  tools/
    RpeCalculator.tsx
    MacroCalculator.tsx
    PlateLoader.tsx
  tools/plate/
    PlateVisualizer.tsx
    PlateResultBlock.tsx
    plateMath.ts
```

## Pagina-navigatie

Navbar gebruikt scroll naar secties op Home en een state-switch naar Tools.

- `scrollToSection(id)` zoekt element met `document.getElementById(id)` en `scrollIntoView`.
- `currentPage` (state in App) bepaalt of HomePage of ToolsPage zichtbaar is.
- Tools tab in navbar zet `currentPage = "tools"`.

Sectie-ids op Home:

- `about`
- `method`
- `target-audience`
- `athletes`
- `nutrition`
- `pricing`
- `contact`

## ToolsPage gedrag

Tools tab laat een interne tool-switch zien:

- `activeTool` state (`"rpe" | "macro" | "plate"`)
- Buttons wisselen state, geen route change.
- Alleen de actieve tool wordt gerenderd.

### RPE Calculator

- Input: gewicht, reps, RPE.
- Validatie:
  - gewicht > 0
  - reps > 0
  - RPE tussen 6 en 10
- Output:
  - geschatte 1RM (Epley)
  - RiR (10 − RPE)
  - RPE10 equivalent zolang noemer positief is

### Macro Calculator

- Input: geslacht, gewicht, lengte, leeftijd, activiteitsniveau, doel.
- BMR via Mifflin-St Jeor.
- TDEE = BMR × activity.
- Doel:
  - lose: −500 kcal
  - maintain: 0
  - gain: +300 kcal
- Macro verdeling:
  - eiwit: 2.2 g/kg
  - vet: 25% kcal
  - carbs: rest (nooit negatief)

### Plate Loader

- Input: totaal gewicht in stappen van 0.5 kg.
- Toggle `includeClips`:
  - aan: bar+clips = 25 kg
  - uit: bar = 20 kg
- Berekening:
  - platesWeight = totalWeight − barSystemWeight
  - sideWeight = platesWeight / 2
  - greedy verdeling over `COMPETITION_PLATES`
- Output:
  - tekstuele lijst platen per kant
  - visuele bar met platen links/rechts

## Atleten Highlights

Sectie op Home bedoeld als eigen pagina-achtige blok zonder Instagram links. In de huidige app staat nog een placeholder met links.

### Data-model

Gebruik een array met `media`:

```ts
type AthleteHighlight = {
  athlete: string;
  title: string;
  date?: string;
  summary: string;
  media: string[];
  stats?: { label: string; value: string }[];
};
```

### Media toevoegen

1. Voeg `media` veld toe per highlight item.
2. Render cover-image in card:

```tsx
<div className="aspect-square bg-zinc-950">
  {post.media?.length ? (
    <img
      src={post.media[0]}
      alt={post.title}
      className="w-full h-full object-cover"
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center text-zinc-500">
      <Instagram size={40} />
    </div>
  )}
</div>
```

3. Bestandslocatie:

- Lokaal: plaats bestanden in `public/highlights/` en verwijs via `"/highlights/naam.jpg"`.
- Extern: gebruik directe `.jpg/.png/.webp` urls.

### Meerdere foto’s tonen (optioneel)

```tsx
{
  post.media?.length > 1 && (
    <div className="grid grid-cols-3 gap-2 mt-3">
      {post.media.slice(0, 3).map((src, j) => (
        <img key={j} src={src} alt="" className="h-20 w-full object-cover" />
      ))}
    </div>
  );
}
```

## Styles / theming

- Hoofdkleuren: `zinc-950` achtergrond, `orange-500/600` accenten.
- Tekst: wit hoofd, `zinc-400/500` secundair.
- Cards: `bg-zinc-900` met `border-zinc-800`, hover naar orange border.
- Geen inline CSS behalve keyframes in App.

## Bekende issues in huidige canvas-versie

- Duplicaat secties:
  - Er staat een extra `section id="nutrition"` die per ongeluk opnieuw Atleten Highlights bevat.
  - Fix: verwijder die duplicaat highlight-sectie en houd één nutrition-sectie over met uniek id.
- Atleten Highlights linkt nog naar Instagram.
  - Fix: vervang `<a href=...>` door lokale cards zonder links en gebruik het data-model hier boven.

## Runnen

Standaard React/Vite setup:

```
npm install
npm run dev
```

Build:

```
npm run build
npm run preview
```

## Aanpassen / uitbreiden

- Nieuwe tool: voeg component toe, update `ToolsPage` buttons en `activeTool` mapping.
- Nieuwe sectie op home: voeg `<section id="...">` toe en nieuwe navbar button die `scrollToSection` gebruikt.
- Nieuwe platen: update `COMPETITION_PLATES` array en `plateColorClass`.

## Validatie / randgevallen

- Alle calculators blokkeren output op invalid input.
- Plate loader accepteert alleen 0.5 kg stappen en minimaal bargewicht.

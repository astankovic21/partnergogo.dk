# Partner Marketplace (arbejdsnavn)

En B2B marketplace, der matcher **advertisers** (virksomheder med produkt + penge)
med **publishers** (mennesker/virksomheder med audience + trafik) for
performance-/affiliate-marketing. Dette er **ikke** en klon af Adtraction, Awin
eller Partner-Ads — konceptet er en matchmaking-platform mellem to sider af
markedet, med fokus på discovery, matching, forhandling og deals.

Dette er en **fungerende MVP/demo**: hele frontenden virker og er fyldt med
realistisk demo-data, men der er endnu ingen rigtig database, login eller
tracking. Det er bevidst — se afsnittet "Hvad mangler før production" nedenfor.

Navnet "Partner Marketplace" er midlertidigt og let at ændre (se
"Sådan skifter du navn" nedenfor).

---

## 1. Hurtigt overblik

- **Stack:** Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Data:** 100% mock-data i `src/lib/mock/` (ingen database endnu)
- **Auth:** Ikke aktiveret endnu — en "demo-switcher" i menuen lader dig se
  siden som forskellige publishers/advertisers
- **Deployment:** Klar til Vercel med ét klik, ingen server-opsætning nødvendig
- **Design:** Minimalistisk B2B SaaS-look (indigo/slate + teal), responsivt på
  mobil, tablet og desktop

## 2. Sådan kører du projektet lokalt (valgfrit)

Du behøver ikke køre noget lokalt for at se projektet — men hvis du (eller en
udvikler) vil:

```bash
npm install
npm run dev
```

Åbn derefter http://localhost:3000

## 3. Deployment til Vercel (super simpelt)

1. Opret en gratis konto på vercel.com (kan logge ind med GitHub)
2. Læg dette projekt i et GitHub-repository (eller upload det direkte i
   Vercel via "Import" → drag & drop af projektmappen)
3. På Vercel: "Add New Project" → vælg dit repo → Vercel opdager automatisk
   at det er et Next.js-projekt → klik "Deploy"
4. Efter ca. 1-2 minutter får du et live link (f.eks.
   `partner-marketplace.vercel.app`), som du kan dele med publishers og
   advertisers for at validere konceptet
5. Der skal **ikke** udfyldes nogen environment variables for at MVP'en
   virker — den kører rent på mock-data

Hver gang koden opdateres og pushes til GitHub, redeployer Vercel automatisk.

## 4. Sådan navigerer du rundt i demoen

Der er endnu ikke rigtig login. I stedet er der en lille "Demo: viewing as…"
vælger i menuen øverst, hvor du kan skifte mellem at se platformen som en
bestemt publisher eller advertiser. Sådan udforsker du hele platformen:

- **Forsiden (`/`):** Landing page med hero, forklaring af konceptet og
  eksempler på publishers/campaigns
- **`/signup`:** Vælg rolle (Advertiser/Publisher) → onboarding-formular →
  lander på dashboard
- **`/marketplace/publishers`:** Advertisers browser publishers (med filtre)
- **`/marketplace/campaigns`:** Publishers browser campaigns (med filtre)
- **`/advertiser/dashboard`** og **`/publisher/dashboard`:** De to
  hovedddashboards med stats, matches, anbefalinger osv.
- **`/distribution`:** "I need distribution"-opslag fra advertisers, hvor
  publishers kan sende forslag
- **`/traffic`:** "Available traffic"-opslag fra publishers, hvor advertisers
  kan sende tilbud
- **`/publisher/offers`** og **`/advertiser/offers`:** Private offers
  (accept/counter/decline)
- **`/deals/[id]`:** Forhandlings-/chat-interface med status
  (Negotiating → Accepted → Active → Completed)
- **`/admin`:** Simpelt admin-panel (link i bunden af siden/footeren) til at
  godkende brugere, publishers, advertisers, campaigns og se alle deals

## 5. Projektstruktur

```
src/
  app/                     → Alle sider (Next.js App Router)
    page.tsx               → Forside
    login/, signup/        → Auth-flow
    onboarding/             → Profil-oprettelse (publisher/advertiser)
    marketplace/            → De to marketplaces (publishers/campaigns)
    publishers/[id]/        → Offentlig publisher-profil
    campaigns/[id]/          → Campaign-detaljer
    advertiser/…             → Advertiser dashboard, campaigns, distribution, offers
    publisher/…               → Publisher dashboard, traffic, offers, performance
    distribution/, traffic/    → "I need distribution" / "Available traffic"
    deals/[id]/                → Forhandling/chat
    admin/                      → Admin-panel
  components/               → Genbrugelige UI-komponenter (cards, modaler, forms)
  context/                  → Demo "logget ind som"-state
  lib/
    mock/                   → Al demo-data (publishers, advertisers, campaigns, …)
    matching.ts             → Match-score-beregning (se afsnit 8)
    dashboard-stats.ts       → Beregnede dashboard-tal
  types/index.ts             → Alle datamodeller (bruges også som skabelon til
                                den fremtidige database)
```

## 5a. SEO — hvad er sat op

- Unikke titler og beskrivelser på alle offentlige sider (forside, marketplaces, hver enkelt publisher-profil, campaign, distribution-opslag og traffic-listing)
- `robots.txt` og `sitemap.xml` genereres automatisk (`src/app/robots.ts` og `src/app/sitemap.ts`) — sitemap'en holder sig selv opdateret ud fra mock-dataen, og vil automatisk inkludere rigtige entries, når rigtig data kommer på
- Login, signup, onboarding, dashboards, admin-panelet og forhandlingstråde er sat til `noindex` — de skal ikke dukke op i Google, da de enten er tomme formularer eller privat indhold
- Delebillede (Open Graph) genereres automatisk, så linket ser pænt ud, når det deles på LinkedIn/Slack/osv.
- Favicon tilpasset platformens farver

**Opdateret:** `siteUrl` i `src/app/layout.tsx`, `src/app/robots.ts` og `src/app/sitemap.ts` peger nu på det rigtige domæne (`https://partnergogo.dk`), så titler, delebilleder, `robots.txt` og `sitemap.xml` er korrekte fra dag ét, når domænet er koblet på i Vercel.

## 5b. Alle tal er nu synlige med det samme

Både publisher- og campaign-kortene i de to marketplaces viser nu alle nøgletal direkte på kortet, uden at man skal klikke ind på en detaljeside:

- **Campaign-kort** (det publishers ser): kommissionsmodel/beløb, cookie-varighed, gennemsnitlig EPC, konverteringsrate og godkendelsesrate
- **Publisher-kort** (det advertisers ser): månedlig trafik, gennemsnitlig EPC, konverteringsrate, annulleringsrate og antal gennemførte partnerskaber
- Kampagner, der endnu ikke er startet ("draft"), viser ærligt "no performance data yet" i stedet for tal på 0 — det er vigtigt, så ingen bliver vildledt af falske nuller
- Detaljesiderne for både campaigns og publishers viser de samme tal i et større format

## 6. Environment variables

Se `.env.example`. Der kræves **ingen** variable for at køre MVP'en/demoen —
hele demo-oplevelsen (mock-data, "Demo: viewing as…") kører uden dem. De tre
variable slår i stedet den rigtige Supabase-backend til (se afsnit 9a):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Alle tre findes i Supabase-projektets dashboard under **Settings → API**:
- `NEXT_PUBLIC_SUPABASE_URL` = feltet "Project URL"
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = "anon" / "public" nøglen under "Project API keys"
- `SUPABASE_SERVICE_ROLE_KEY` = "service_role" nøglen under "Project API keys" —
  denne omgår Row Level Security, så den må **aldrig** committes eller eksponeres i browseren (den har bevidst ikke `NEXT_PUBLIC_`-prefix)

## 7. Hvad bruger mock data (dvs. er IKKE rigtigt endnu)

Alt indhold på platformen kommer fra `src/lib/mock/*` og nulstilles, hver
gang siden genindlæses:

- Alle publishers, advertisers, campaigns, distribution requests, traffic
  listings, private offers, deals og forhandlinger er fiktive
- Alle klik/konverteringer/transaktioner (tracking) er eksempeltal
- Handlinger som "Apply", "Send Offer", "Accept/Counter/Decline", "Opret
  campaign" osv. virker visuelt i browseren, men gemmes ikke — de forsvinder
  ved genindlæsning, fordi der ikke er en database endnu
- Login/signup opretter ikke en rigtig konto endnu

## 8. Matching-systemet (simpel regelbaseret model, klar til at blive skiftet ud)

`src/lib/matching.ts` indeholder en simpel funktion, der beregner en
match-score (0-100%) mellem en campaign og en publisher ud fra:

- GEO-match (30%)
- Vertical-match (25%)
- Trafikkilde-match (20%)
- Foretrukken kommissionsmodel-match (15%)
- Audience-størrelse (10%)

Det er bevidst simpelt og velkommenteret, så det senere nemt kan erstattes
med en rigtig anbefalings-/AI-model uden at ændre resten af koden.

## 9. Databasestruktur (klar til Supabase)

`src/types/index.ts` definerer alle datamodeller, som er designet til direkte
at kunne blive til Postgres-tabeller i Supabase:

`users`, `publisher_profiles`, `advertiser_profiles`, `campaigns`,
`campaign_applications`, `distribution_requests`, `proposals`,
`traffic_listings`, `traffic_offers`, `private_offers`, `negotiations`,
`deals`, `clicks`, `conversions`, `transactions`.

### Sådan sætter du Supabase op (næste fase, IKKE nødvendigt for MVP-demo)

1. Opret gratis projekt på supabase.com
2. Under "SQL editor": opret tabeller ud fra typerne i `src/types/index.ts`
   (felt-for-felt — de er skrevet, så det er en direkte oversættelse)
3. Kopiér "Project URL" og "anon public key" fra Supabase-projektets
   indstillinger ind i `.env.local` (baseret på `.env.example`)
4. Aktivér "Supabase Auth" (email/password er nok til start) og erstat de
   simulerede login/signup-formularer med rigtige Supabase Auth-kald
5. Erstat funktionerne i `src/lib/mock/*` én ad gangen med rigtige
   database-forespørgsler (arkitekturen er bevidst bygget, så UI-komponenterne
   ikke behøver at ændres — kun data-laget)

## 9a. Hvad er nu rigtigt vs. stadig mock (efter Supabase-integrationen)

Der er nu et rigtigt, virkende backend-lag oven på demoen (Supabase Auth +
Postgres, se `supabase/schema.sql`). Det er lagt til **additivt** — den
eksisterende mock-demo (inkl. "Demo: viewing as…"-vælgeren i menuen) er
100% uændret og virker præcis som før, også helt uden Supabase konfigureret.
For at undgå forvirring om hvad der er "for real", her er den ærlige liste:

**Rigtigt (skriver til/læser fra din Supabase-database):**
- `/signup` og `/login` — opretter en rigtig konto via Supabase Auth
  (`supabase.auth.signUp` / `signInWithPassword`). En `profiles`-række
  oprettes automatisk af databasen (trigger'en `handle_new_user()`).
- `/onboarding/publisher` og `/onboarding/advertiser` — opretter en rigtig
  række i hhv. `publisher_profiles` / `advertiser_profiles`, tilknyttet den
  indloggede bruger.
- **`/advertiser/campaigns/live`** — nyt, rigtigt "Mine campaigns"-område for
  indloggede advertisers: lister rigtige `campaigns`-rækker for din
  advertiser-konto, og "New campaign"-formularen opretter en rigtig række.
  Kræver login (sender dig til `/login` hvis du ikke er logget ind).
- **`/publisher/campaigns/live`** — nyt, rigtigt "Browse & apply"-område for
  indloggede publishers: lister alle rigtige campaigns, og "Apply"-knappen
  opretter en rigtig række i `campaign_applications`. Kræver login. Når en
  publisher er godkendt (`approved`) på en campaign, viser siden også deres
  personlige tracking-link og de bannere, advertiseren har uploadet til den
  campaign — se afsnit 9b.
- **`/advertiser/campaigns/live`** har nu også en "Banners"-sektion pr.
  campaign, hvor advertiseren kan uploade grafik (til Supabase Storage) —
  se afsnit 9b.
- **`/go/[campaignId]/[publisherId]`** — den rigtige tracking-link-motor
  (redirect + klik-logning). **`/api/postback`** — den rigtige
  konverterings-/postback-endpoint. Begge er offentlige, ikke-autentificerede
  endpoints — se afsnit 9b for hvordan de virker.
- Navbaren viser nu også "Your account: you@email.com" + en rigtig
  "Log out"-knap, når der er en rigtig Supabase-session — men kun det, som en
  lille, tydeligt adskilt boks ved siden af (aldrig i stedet for) den
  eksisterende demo-switcher, så de to systemer ikke kan forveksles.

**Stadig mock/demo (uændret, til pitching/demoer):**
- Alt hvad man ser som udgangspunkt: `/advertiser/dashboard`,
  `/publisher/dashboard`, de to marketplaces (`/marketplace/publishers`,
  `/marketplace/campaigns`), den oprindelige `/advertiser/campaigns` og
  `/advertiser/campaigns/new`, `/distribution`, `/traffic`,
  `/publisher/offers`, `/advertiser/offers`, `/deals/[id]`, `/admin`, osv.
- Forsiden og hele "Demo: viewing as…"-flowet i menuen.
- **Transaktioner/udbetalinger** (`transactions`-tabellen) — klik og
  konverteringer er nu rigtige (se afsnit 9b), men selve udbetalingsflowet
  til publishers er stadig ikke bygget.
- Bemærk: den oprindelige mock-side `/campaigns/[id]` kender kun de
  hardkodede demo-campaign-id'er. Hvis `/go/...`-linket for en rigtig
  campaign ikke kan indløses (fx campaign sat på pause), sendes brugeren dit
  videre med en `?notice=`-parameter, men da siden er en del af den
  uændrede mock-demo, viser den i praksis Next.js' almindelige "not found"
  for et rigtigt campaign-id, den ikke kender. En rigtig, offentlig
  campaign-side hører til blandt de næste features (se afsnit 11).

**Uden Supabase-variable sat (som i dette sandbox):** de rigtige sider viser
en tydelig "Backend not configured yet"-besked i stedet for at crashe — resten
af sitet er upåvirket. `/go/...` og `/api/postback` sender i så fald bare
brugeren/kaldet videre uden at logge noget (se afsnit 9b).

## 9b. Sådan virker tracking-links og bannere

Dette er den del, der gør platformen til et rigtigt affiliate-system og ikke
bare en matchmaking-side: hver godkendt publisher får automatisk sit eget,
unikke link til hver campaign, og hvert klik og salg gennem det link bliver
registreret i databasen.

**Tracking-linket — publisheren skal ikke selv bygge noget**

Så snart en advertiser har godkendt en publishers ansøgning til en campaign
(`campaign_applications.status = 'approved'`), viser
`/publisher/campaigns/live` automatisk en boks "Your tracking link" med et
link i formatet:

```
https://partnergogo.dk/go/<campaignId>/<publisherId>
```

(`partnergogo.dk` er platformens rigtige domæne — linket bruger det automatisk,
enten via `NEXT_PUBLIC_SITE_URL` eller det domæne, siden faktisk køres på, så
der ikke skal rettes noget manuelt, når domænet er koblet på i Vercel.)

Publisheren klikker bare "Copy link" og sætter linket ind, hvor de nu
promoverer campaignen (nyhedsbrev, blogindlæg, Instagram-bio, osv.). Når en
besøgende klikker på det, sker der tre ting, helt automatisk:

1. Platformen tjekker, at campaignen findes og er aktiv.
2. Der oprettes en unik klik-id og en række i `clicks`-tabellen (hvilken
   campaign, hvilken publisher, hvornår, og land hvis muligt).
3. Den besøgende sendes videre (redirectes) til advertiserens egen
   landingsside — klik-id'et er hægtet på som `?pmid=...` i URL'en, så
   advertiserens landingsside/analytics kan se det, hvis de vil, men det er
   ikke et krav.

Hvis linket af en eller anden grund ikke kan indløses (campaignen er sat på
pause, findes ikke længere, eller landingssiden er ugyldig), sender vi ikke
bare en blank fejlside — den besøgende sendes videre til vores egen
campaign-side i stedet, med en lille besked om hvorfor.

**Postback-URL'en — det ene manuelle skridt hos advertiseren**

Et klik viser kun, at nogen har set annoncen. For at vide, om det faktisk
blev til et salg, skal advertiseren fortælle platformen, når det sker — det
kaldes en "postback", og det er præcis den samme mekanisme, man kender fra
Adtraction, Partner-Ads eller Awin. Det er det ene manuelle integrations-
skridt, en advertiser selv skal sætte op:

På deres kvitterings-/tak-for-din-ordre-side (eller via deres eget
annonce-tracking-/analytics-værktøj, hvis det understøtter "custom
postbacks"), skal de kalde:

```
https://partnergogo.dk/api/postback?click_id=<klik-id fra ?pmid=>&amount=<beløb i DKK>
```

- `click_id` er påkrævet — det er det samme id, der kom med som `?pmid=` på
  klik-tidspunktet, og som advertiseren derfor skal have gemt (fx i en
  skjult formularfelt eller cookie) frem til kvitteringssiden.
- `amount` er valgfrit, hvis campaignens kommission er et fast DKK-beløb
  (fx "450 DKK") — så udregner platformen selv kommissionen. Er
  kommissionen procentbaseret (fx "8%"), skal advertiseren selv sende
  `amount` (den udbetalte kommission i DKK), fordi platformen ikke kender
  ordreværdien.

Kaldet virker enten som et simpelt "tracking pixel" (et 1×1 gennemsigtigt
billede — sæt det ind som en usynlig `<img>`-tag på kvitteringssiden, det
mest almindelige) eller returnerer JSON, hvis kaldet sker med
`Accept: application/json` eller `?format=json` — begge integrationsformer
understøttes. Kaldet fejler aldrig synligt på advertiserens side, selv ved
en fejl eller et ukendt `click_id` — det logges bare server-side.

**Bannere — upload én gang, publishers indsætter én kode**

På `/advertiser/campaigns/live` kan advertiseren under hver campaign
uploade banner-grafik (billede + navn + bredde/højde) — det gemmes i
Supabase Storage, og en række oprettes i `campaign_creatives`.

Godkendte publishers ser de samme bannere under campaignen på
`/publisher/campaigns/live`, med en "Copy embed code"-knap. Koden, de får,
er det klassiske affiliate-banner-mønster — et billede pakket ind i et link
— og linket ER publisherens eget tracking-link fra ovenfor, så det virker
med det samme, uden yderligere opsætning:

```html
<a href="https://partnergogo.dk/go/<campaignId>/<publisherId>" target="_blank" rel="noopener sponsored">
  <img src="<banner-URL>" width="<bredde>" height="<højde>" alt="<brand>" />
</a>
```

Publisheren skal bare indsætte den kode på deres side/CMS — ingen
kodning, intet at konfigurere.

## 10. Hvad mangler før production

- **Rigtig autentificering** (Supabase Auth) — i dag er "login" kun visuelt
- **Rigtig database** — alt data nulstilles ved genindlæsning i dag
- **Rigtigt tracking-system** (klik, konverteringer, cookies, postback-URLs) —
  databasestrukturen er klar, men selve tracking-motoren er ikke bygget
- **Betalinger/udbetalinger** til publishers (fx via bank/Stripe) er slet
  ikke i scope endnu
- **E-mail-notifikationer** (nye tilbud, godkendte ansøgninger osv.)
- **Rigtig fil-upload** til logoer/billeder
- **Rate limiting, validering og sikkerhed** generelt, når der kobles en
  rigtig database og rigtige brugere på
- **GDPR/juridisk** gennemgang før du har rigtige brugerdata (dette er ikke
  juridisk rådgivning — tal med en jurist, når I går i produktion)

## 11. Anbefalede næste features (i prioriteret rækkefølge)

1. Supabase database + rigtig auth (gør demoen til en rigtig platform)
2. Rigtigt klik-/konverterings-tracking med unikke tracking-links pr. publisher/campaign
3. E-mail-notifikationer ved nye offers, ansøgninger og beskeder i forhandlinger
4. Fil-upload til logoer og profilbilleder
5. Bedre matching (fx vægtet score baseret på faktisk performance-historik i stedet for kun regler)
6. Betalings-/udbetalingsflow til publishers
7. Rigtige rettigheder/roller i admin-panelet (i dag er alle handlinger kun visuelle)

## 12. Sådan skifter du navn på platformen

"Partner Marketplace" bruges kun tre steder, som er nemme at finde/erstatte:
- `src/components/Navbar.tsx` (logo-tekst)
- `src/app/layout.tsx` (side-titel/metadata)
- `src/app/page.tsx` og `src/components/Footer.tsx` (enkelte omtaler)

En simpel find & replace af teksten "Partner Marketplace" i `src/` er nok.

---

*Denne README er skrevet, så du kan forstå og deploye projektet uden at være
teknisk. Har du spørgsmål til et specifikt trin, så spørg endelig.*

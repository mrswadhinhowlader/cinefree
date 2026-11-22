/* English copy for each service (used when the site language is English) */
const EN_SERVICES = {
  tubi: {
    availability: "US, UK, Canada, Australia",
    tagline: "The biggest free library of studio movies and TV shows.",
    review:
      "Free usually means compromise, but Tubi changes that: 40,000+ titles, a solid HD player and ads that stay reasonable — and no account needed to start watching. Because it carries real studio catalogues, it's the place where you'll recognise the most titles.",
    pros: ["No account needed", "Reliable HD player", "Large library, refreshed often"],
    cons: ["Not officially available in South Asia", "New releases arrive late"],
    bestFor: "The best all-rounder if you're outside South Asia or travelling",
  },
  pluto: {
    availability: "US, UK and several European countries",
    tagline: "Channel-surfing like classic TV, completely free.",
    review:
      "Pluto TV is mostly live TV: 300+ themed channels running movies, shows, news, sport and cartoons. As a Paramount property it carries Star Trek, MTV and Nickelodeon content. The on-demand library is smaller, so it suits flipping channels more than hunting one specific title.",
    pros: ["No sign-up", "Feels like real TV", "Big-brand content"],
    cons: ["Smaller on-demand library", "Only a handful of countries"],
    bestFor: "When you just want to channel-surf",
  },
  plex: {
    availability: "200+ countries, free account required",
    tagline: "Home for your own media library — plus free movies and live channels.",
    review:
      "Plex is really an app for organising files you already own, but its free section has grown big. The catalogue changes by country, yet many regions get a decent mix of movies and live channels. It has the cleanest interface and the best TV and mobile apps in this list.",
    pros: ["Works in most countries", "Excellent apps and interface", "Also organises your own files"],
    cons: ["Account required", "Library differs a lot by country"],
    bestFor: "One app for every device",
  },
  "youtube-free": {
    availability: "Almost every country, works without an account",
    tagline: "Where everyone already is — an official free-movies shelf plus studio channels.",
    review:
      "The easiest option: YouTube's Free movies section carries full-length studio films with ads, and many studios upload older or local films to their own channels. Quality reaches 1080p and the app is on every device — but ads are the heaviest here.",
    pros: ["Works in Bangladesh, India and everywhere", "App on every device", "Best search and subtitles"],
    cons: ["Heavy ads", "Fewer TV series"],
    bestFor: "A zero-friction start, wherever you are",
  },
  "internet-archive": {
    availability: "Worldwide, no account needed",
    tagline: "A huge public-domain film archive — essentially ad-free.",
    review:
      "Classic Hollywood, landmark world cinema, silent-era films: anything whose copyright has expired is legally free here, and you can download it too. Picture quality isn't always HD, but there are almost no ads and the dated interface still works.",
    pros: ["Practically no ads", "Downloadable", "Classics and rarities"],
    cons: ["No new or popular titles", "Mixed quality, dated design"],
    bestFor: "Classics and hard-to-find films",
  },
  jiohotstar: {
    availability: "India only — the free slice sits mainly in the mobile app",
    tagline: "Home of cricket and Disney-Marvel — the free part is just a taste.",
    review:
      "In February 2025 JioCinema merged with Disney+ Hotstar into JioHotstar. The full library is now paid (from ₹79/month), but the mobile app keeps an ad-supported free slice: yesterday's episodes, some shows and a few live matches. On the web only clips, highlights and trailers are free.",
    pros: ["Some live cricket for free", "A free slice in the app", "A taste of India's biggest library"],
    cons: ["Most content needs a plan", "Almost nothing free on the web"],
    bestFor: "Occasional cricket or TV catch-up in India",
  },
  viki: {
    availability: "India, Bangladesh and 200+ countries (free + Viki Pass)",
    tagline: "Korean, Chinese, Japanese and Thai drama — subtitled, free with ads.",
    review:
      "The best legal free option for Asian drama, and it works in both Bangladesh and India. The free tier streams a large part of the library in SD with ads, and community subtitles cover dozens of languages. New hits sit behind Viki Pass first, then open up.",
    pros: ["Available in India and Bangladesh", "Huge Asian drama library", "Great subtitles"],
    cons: ["SD quality on the free tier", "New shows are paid first"],
    bestFor: "K-drama and Asian series fans",
  },
  "bangla-tv-live": {
    availability: "Worldwide — on each channel's official YouTube page",
    tagline: "Official live streams of Bangladeshi channels — straight in the browser.",
    review:
      "Somoy TV, Jamuna, Channel i, RTV: the big Bangladeshi channels stream live around the clock on their own official YouTube pages. Follow the channels and you can watch from anywhere, including from abroad. Fully legal, free, ad-supported, and no app required.",
    pros: ["Official, legal streams", "Watch from abroad", "No app or account needed"],
    cons: ["Ads included", "You follow each channel separately"],
    bestFor: "Live Bangladeshi TV, especially from abroad",
  },
  "muse-asia": {
    availability: "Much of Asia, varies by licence",
    tagline: "Official anime on YouTube, free and subtitled.",
    review:
      "Muse Asia's YouTube channel uploads season anime officially and free, with subtitles and full licensing. Many titles are visible in Bangladesh and India, though some videos are region-locked by licence. Subscribe and you'll catch each new season as it lands.",
    pros: ["Fully legal and free", "New seasons regularly", "Subtitled"],
    cons: ["Some videos region-locked", "The whole library is never online at once"],
    bestFor: "Free anime with a clear conscience",
  },
  sonyliv: {
    availability: "India — limited free section",
    tagline: "Indian TV shows and some films, free with ads.",
    review:
      "SonyLIV has a free section, but most popular shows and all sport sit behind a subscription. Free means older TV episodes, a few films and trailers. Ads are frequent and the interface keeps pushing subscriptions, so treat it as a bonus rather than a main source.",
    pros: ["Some popular Sony TV shows free", "Easy to access in India"],
    cons: ["Small free section", "Heavy subscription prompts"],
    bestFor: "Older Sony TV shows",
  },
  "airtel-xstream": {
    availability: "India — with an Airtel connection or plan",
    tagline: "Live TV and movies free if you already have Airtel.",
    review:
      "Many Airtel plans bundle Xstream Play, so live channels and some films cost nothing extra. There are ads, and what you get depends on your plan. Without an Airtel connection it's far less useful.",
    pros: ["Free with Airtel plans", "Live TV channels"],
    cons: ["Limited without Airtel", "Content varies by plan"],
    bestFor: "Airtel users in India",
  },
  jiotv: {
    availability: "India — with a Jio SIM",
    tagline: "Hundreds of live TV channels free with a Jio SIM.",
    review:
      "The simplest live TV for Jio subscribers: Indian and international channels, news, sport and films with no separate subscription. The app only works on the Jio network, so it won't help on other operators, and the channel list changes regularly.",
    pros: ["Many live channels", "Free for Jio users"],
    cons: ["Jio network only", "India only"],
    bestFor: "Live TV in India on Jio",
  },
  "mx-player": {
    availability: "India and South Asia — mainly the Android app (web is being retired)",
    tagline: "A big desi catalogue of free films, web series and music videos.",
    review:
      "Amazon MX Player (formerly miniTV) is now fully free with no paywall: Hindi, Tamil and Telugu films, web series and music videos. There are ads, but the player is the real strength — it holds up even on weak connections. In 2026 its catalogue is being folded into Prime Video, so the Android app is the most reliable home.",
    pros: ["Holds up on weak networks", "Strong language-based catalogue", "Free web series"],
    cons: ["South Asia only", "Frequent ads"],
    bestFor: "Desi films on low data",
  },
  toffee: {
    availability: "Bangladesh only (Grameenphone)",
    tagline: "Bangladesh's easiest free live TV and movie app.",
    review:
      "The simplest way to watch Bangladeshi channels live: sport, news, dramas and some films, free — and on some operators without using data. Foreign content is thin, but for local channels it is the most dependable option.",
    pros: ["Live Bangladeshi channels", "Light, simple app", "Data-free on some plans"],
    cons: ["Bangladesh only", "Limited foreign content"],
    bestFor: "Bangladeshi live TV inside the country",
  },
  bongo: {
    availability: "Bangladesh and the diaspora (free + premium)",
    tagline: "The tidiest app for Bangla drama, films and originals.",
    review:
      "The best-organised platform for Bangla drama and films. A good amount is free, the rest sits behind a subscription, and ads are light with a clean player. It also works well from abroad if you want Bengali content.",
    pros: ["Bangla originals", "Clean interface, few ads", "Works from abroad"],
    cons: ["Best content needs a subscription", "Smaller than global libraries"],
    bestFor: "Bangla drama and films",
  },
  bioscope: {
    availability: "Bangladesh (free + premium)",
    tagline: "Another Bangladeshi option for local films and web series.",
    review:
      "New Bangladeshi films and web series often land here first. The free side has older films and some series, while new releases are usually paid. The library is smaller than Toffee or Bongo, but worth watching for new local titles.",
    pros: ["New Bangladeshi films", "Local web series"],
    cons: ["Small library", "New titles are paid"],
    bestFor: "New Bangladeshi releases",
  },
  "zee5-free": {
    availability: "India — limited free section",
    tagline: "A big Hindi TV and film catalogue, with ads.",
    review:
      "ZEE5's free section has plenty of older Hindi films, TV serials and some regional content. New or popular shows need a subscription, and ads are dense. Still useful for older TV episodes.",
    pros: ["Big TV serial library", "Regional language content"],
    cons: ["Small free section", "Many ads"],
    bestFor: "Older Hindi TV serials",
  },
  "roku-channel": {
    availability: "US, UK, Canada",
    tagline: "Watchable in a browser, no Roku box needed — and nicely curated.",
    review:
      "The name suggests you need a Roku device, but it works in a web browser with a free account. Curation is good: popular older series and films surface easily. The library is smaller than Tubi's, but ads are lighter and the interface cleaner.",
    pros: ["Works on the web", "Good curation", "Lighter ads"],
    cons: ["Only a few countries", "Account required"],
    bestFor: "Viewers in the US or UK",
  },
  kanopy: {
    availability: "With a library card or university login",
    tagline: "Arthouse films and documentaries free through your library — no ads.",
    review:
      "If you have a public library card or university login this is a gem: Criterion titles, world cinema and documentaries, all ad-free and in HD. You get a set number of tickets each month, so you choose deliberately.",
    pros: ["Ad-free HD", "Criterion and world cinema", "Genuinely free"],
    cons: ["Library card required", "Limited titles per month"],
    bestFor: "Serious film lovers",
  },
  hoopla: {
    availability: "A participating library card is required",
    tagline: "Films, series and comics free with a library card — all in one app.",
    review:
      "Like Kanopy it runs on a library card, but here you also get major studio films and TV series. No ads, good apps, and a handful of borrows each month. If you also want comics or audiobooks, it's the more versatile pick.",
    pros: ["Ad-free", "Major studio films too", "Comics and audiobooks included"],
    cons: ["Library card required", "Monthly limit"],
    bestFor: "Library card holders who want variety",
  },
  "crunchyroll-free": {
    availability: "Free tier in many countries, though it is shrinking",
    tagline: "The biggest anime library — a limited free slice with ads.",
    review:
      "Anime means Crunchyroll. The free tier carries many older series with ads, while new simulcasts are often a week late or paid only. Apps and subtitles are the best around, but free access is shrinking by region — check before you commit.",
    pros: ["Largest anime library", "Great subtitles and apps"],
    cons: ["Free access shrinking", "Ads and delays on new episodes"],
    bestFor: "Anyone starting with anime",
  },
  retrocrush: {
    availability: "US and some European countries",
    tagline: "Classic 80s and 90s anime, completely free.",
    review:
      "If you love old-school mecha, robot and romance anime, this is a small but charming corner: entirely free, ad-supported and lovingly curated. There is almost no new content.",
    pros: ["Rare classic anime", "Completely free"],
    cons: ["Limited regions", "No new titles"],
    bestFor: "Fans of vintage anime",
  },
  arte: {
    availability: "Europe (French, German and English subtitles)",
    tagline: "Europe's public broadcaster — documentaries and world cinema.",
    review:
      "Nowhere else offers this much great documentary and European film for free. ARTE is a public service with no ads, and plenty of titles carry English subtitles. Best for international and arthouse film, not Bollywood or Hollywood entertainment.",
    pros: ["Completely ad-free", "Top-tier documentaries", "Multi-language subtitles"],
    cons: ["Limited outside Europe", "Less entertainment content"],
    bestFor: "Documentaries and European cinema",
  },
  "cbc-gem": {
    availability: "Canada only (free, account required)",
    tagline: "Canada's public broadcaster — good series and news, free.",
    review:
      "A solid option in Canada: Canadian series, some British and international shows, live news and comedy. The free tier is ad-supported and needs an account. The library isn't huge, but quality is high.",
    pros: ["Well-curated series", "Free live news"],
    cons: ["Canada only", "Small library"],
    bestFor: "Viewers in Canada",
  },
  "sbs-on-demand": {
    availability: "Australia only (free account)",
    tagline: "Australia's public service — world cinema and documentaries, free.",
    review:
      "SBS's library surprises people: international films, Korean and Japanese series, documentaries — all free with light ads. It won't work outside Australia, but inside it's one of the best free options.",
    pros: ["International and Asian series", "Light ads"],
    cons: ["Australia only", "The app can be slow"],
    bestFor: "Foreign films in Australia",
  },
  "rakuten-tv-free": {
    availability: "Many European countries",
    tagline: "Free films and channels built into many smart TVs.",
    review:
      "Often pre-installed on smart TVs, so there's nothing to set up. The free section offers fairly recent films and live channels alongside rentals and purchases. Quality is good, though the library varies a lot by country.",
    pros: ["Easy on smart TVs", "Good streaming quality"],
    cons: ["Library differs by country", "Small free section"],
    bestFor: "Smart TV viewing in Europe",
  },
  popcornflix: {
    availability: "US (web and apps)",
    tagline: "An easy home for low-budget action, horror and indie films.",
    review:
      "No major studio titles, but there's a catalogue of low-budget action, horror and independent film. The interface is dated and ads are heavy — still handy when you just want something on.",
    pros: ["No account needed", "Indie and horror titles"],
    cons: ["No big films", "Heavy ads, old design"],
    bestFor: "Casual indie and horror",
  },
  itvx: {
    availability: "UK (free tier with ads)",
    tagline: "ITV's free streaming home — big UK shows plus films.",
    review:
      "ITVX runs a genuinely useful free tier: ITV dramas, soaps, quizzes, plus a decent film shelf and live channels. Ads are frequent and some premium titles sit behind ITVX Premium, but for British TV it is the obvious first stop.",
    pros: ["Large UK TV catalogue", "Live channels included", "Free with ads"],
    cons: ["UK only", "Some titles need Premium"],
    bestFor: "British TV and films",
  },
  channel4: {
    availability: "UK (free, account required)",
    tagline: "Channel 4's free player — sharp comedy, docs and drama.",
    review:
      "Channel 4's streaming service is free with ads and unusually good at documentaries, comedy and drama. Everything needs a free account, and a handful of titles are time-limited, but the quality is high.",
    pros: ["Strong documentaries and comedy", "Box sets stay free", "Ad-supported, no fee"],
    cons: ["UK only", "Some series expire quickly"],
    bestFor: "Documentaries and sharp British comedy",
  },
  "bbc-iplayer": {
    availability: "UK (free, TV licence required for live TV)",
    tagline: "The BBC's iPlayer — no ads, huge archive, live channels.",
    review:
      "iPlayer is the cleanest public-service player anywhere: no ads, BBC drama, comedy, documentaries, kids' shows and an archive going back decades. It works only in the UK, and watching live channels legally needs a TV licence.",
    pros: ["Completely ad-free", "Excellent drama and documentaries", "Deep archive"],
    cons: ["UK only", "Live TV needs a licence"],
    bestFor: "British public-service TV",
  },
  my5: {
    availability: "UK (free, account required)",
    tagline: "Channel 5's player — soaps, docs and classic series.",
    review:
      "My5 is smaller than ITVX or iPlayer, but it carries Channel 5 drama, documentaries, soaps and a surprising shelf of classic series. Free with ads, and an account is needed.",
    pros: ["Classic series and soaps", "Free with ads"],
    cons: ["UK only", "Smaller catalogue"],
    bestFor: "Channel 5 shows and older series",
  },
  pbs: {
    availability: "US (free) with PBS Kids worldwide via the web",
    tagline: "PBS documentaries and kids' shows — free and ad-light.",
    review:
      "PBS's own app and site carry documentaries, Masterpiece drama and PBS Kids, free and with very light ads. It is the safest pick when children are watching, and the documentary shelf is top class.",
    pros: ["Best kids' content", "Top-tier documentaries", "Very light ads"],
    cons: ["Full library is US-focused", "Needs an email sign-up"],
    bestFor: "Families and documentary lovers",
  },
  "the-cw": {
    availability: "US (free, no subscription)",
    tagline: "The CW app — current-season US drama, free with ads.",
    review:
      "The CW streams its current-season episodes free with ads, no subscription needed. Expect a smaller library than paid services and ads every few minutes, but for its own shows it is convenient and free.",
    pros: ["Current-season episodes free", "No subscription"],
    cons: ["US only", "Heavy ads, limited catalogue"],
    bestFor: "CW drama fans in the US",
  },
  asiancrush: {
    availability: "US, Canada (free with ads)",
    tagline: "Asian films, drama and anime in one free catalogue.",
    review:
      "AsianCrush gathers Korean, Japanese and Chinese films plus drama and anime, free with ads. The interface is dated and the library rotates, but it is one of the few legal free places for Asian cinema outside Viki.",
    pros: ["Asian films and drama free", "Some anime included"],
    cons: ["Rotating catalogue", "US and Canada only"],
    bestFor: "Asian cinema outside Viki",
  },
  vix: {
    availability: "US and Latin America (free)",
    tagline: "Spanish-language films and series, free with ads.",
    review:
      "ViX is the biggest free Spanish-language service: telenovelas, films, comedy and live channels, all ad-supported. If you watch in Spanish it is hard to beat, and much of the catalogue needs no account.",
    pros: ["Huge Spanish-language catalogue", "Free with ads", "Live channels"],
    cons: ["US and Latin America only", "Little English content"],
    bestFor: "Spanish-speaking viewers",
  },
  ard: {
    availability: "Germany (free, no ads)",
    tagline: "Germany's public broadcaster — documentaries, drama, no ads.",
    review:
      "ARD Mediathek is free, ad-free and quietly excellent: documentaries, German drama, culture and news, with some titles subtitled. Most content is German-language and geo-restricted to Germany.",
    pros: ["No ads at all", "Strong documentaries", "Free public service"],
    cons: ["Germany only", "Mostly German-language"],
    bestFor: "German-language public TV",
  },
  "france-tv": {
    availability: "France (free, no ads)",
    tagline: "France Télévisions — free films, drama and documentaries.",
    review:
      "France.tv offers public-service drama, documentaries, cinema and kids' shows free and without ads. It is French-language and geo-restricted, but the quality is consistently high.",
    pros: ["Ad-free", "Good cinema and documentary shelf", "Free"],
    cons: ["France only", "French-language mainly"],
    bestFor: "French-language viewing",
  },
  rtve: {
    availability: "Spain (free)",
    tagline: "Spain's public broadcaster — films, series and culture, free.",
    review:
      "RTVE Play carries Spanish films, series, documentaries and an archive of classics, free with light ads. Region-locked to Spain and mostly in Spanish, but generous with full films.",
    pros: ["Full Spanish films free", "Good archive", "Light ads"],
    cons: ["Spain only", "Spanish-language only"],
    bestFor: "Spanish cinema",
  },
  viu: {
    availability: "Southeast Asia and the Middle East (free tier)",
    tagline: "Korean and Asian drama with a real free tier.",
    review:
      "Viu is a solid free option across Southeast Asia and the Middle East: Korean and Asian drama, variety shows and some films with ads, plus a paid tier for early episodes. Subtitles cover many regional languages.",
    pros: ["Korean drama free tier", "Many subtitle languages", "Works on phones smoothly"],
    cons: ["Not available in South Asia", "New episodes go to paid first"],
    bestFor: "K-drama in Southeast Asia",
  },
  "ani-one": {
    availability: "South and Southeast Asia (varies by licence)",
    tagline: "Official anime on YouTube for South Asia, free.",
    review:
      "Ani-One Asia uploads licensed anime to YouTube for South and Southeast Asia, free and subtitled, with seasons added as they air. Region locks vary by title, so some videos may not open in your country.",
    pros: ["Licensed and free", "Seasonal anime added", "Subtitled"],
    cons: ["Some titles region-locked", "Not every series is available"],
    bestFor: "Anime in South Asia without paying",
  },
  "eros-now": {
    availability: "India (free tier with ads)",
    tagline: "Bollywood classics and music, free with ads.",
    review:
      "Eros Now's free tier leans on older Bollywood films, music videos and some originals, all ad-supported. The newer hits need a subscription, and the app is heavier than MX Player, but the classic film shelf is real.",
    pros: ["Large classic Bollywood shelf", "Music videos included"],
    cons: ["New releases are paid", "App feels heavy"],
    bestFor: "Older Bollywood films",
  },
  shemaroome: {
    availability: "India (free section with ads)",
    tagline: "Hindi, Gujarati and Marathi films, comedy and devotionals.",
    review:
      "ShemarooMe's free section is strong on regional-language films, comedy, theatre and devotional content, with ads. It is not a place for new blockbusters, but the regional catalogue is genuinely broad.",
    pros: ["Regional language films", "Comedy and theatre", "Free section"],
    cons: ["India only", "Most premium titles are paid"],
    bestFor: "Regional Indian cinema",
  },
  doordarshan: {
    availability: "India and worldwide via official YouTube channels",
    tagline: "Doordarshan's official channels — live TV and old classics.",
    review:
      "Prasar Bharati's official YouTube channels stream Doordarshan and DD News live and keep an archive of classic serials and films. Free, legal and reachable from anywhere, though the archive is scattered across several channels.",
    pros: ["Live DD channels free", "Classic serials archive", "Works worldwide"],
    cons: ["Split across many channels", "Video quality varies"],
    bestFor: "Indian public TV and old classics",
  },
  "vudu-free": {
    availability: "US (free account)",
    tagline: "A buy/rent store with a surprisingly decent free section.",
    review:
      "Formerly Vudu, this service sells and rents films but also has a Free tab with ad-supported studio titles that are fairly recent. The free line-up rotates, so check back now and then.",
    pros: ["Fairly recent studio films", "Good HD quality"],
    cons: ["US only", "Rotating library"],
    bestFor: "Recent-ish films free in the US",
  },
};

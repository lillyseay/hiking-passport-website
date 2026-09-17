// Everything the site says, in one place. Copy is the app's own: the App Store listing
// (AppStore/AppStoreMetadata.md in the iOS repo) and the Hiking Passport page on
// lillyseay.com.

export const site = {
  name: "Hiking Passport",
  url: "https://hikingpassportapp.com",
  tagline: "Train for your goal hikes",
  description:
    "Add the hikes you're chasing and get a training plan built from what you already do. Stamp every summit. Everything stays on your iPhone, with no account and no cloud.",
  status: "Coming soon to the App Store",
  email: "team@lillyseay.co",
  maker: { name: "Lilly Seay", url: "https://lillyseay.com" },
  support: "/support/",
  privacy: "/privacy/",
  instagram: "https://www.instagram.com/lillyseay/",
  tiktok: "https://www.tiktok.com/@lillyseay",
};

// The passport drawn in the hero. Real Pacific Northwest summits, one still a goal.
export const heroPassport = {
  hikes: [
    {
      id: "south-sister",
      name: "South Sister",
      elevation: 10358,
      gain: 4900,
      completed: "AUG 16",
    },
    {
      id: "st-helens",
      name: "Mount St. Helens",
      elevation: 8363,
      gain: 4500,
      completed: null,
    },
    {
      id: "mount-si",
      name: "Mount Si",
      elevation: 4167,
      gain: 3150,
      completed: "JUN 7",
    },
  ],
  milestones: [
    { id: "m1", label: "4 mi · 900 ft", achieved: true },
    { id: "m2", label: "1,800 ft", achieved: true },
    { id: "m3", label: "6 mi", achieved: false, detected: true },
    { id: "m4", label: "2,800 ft", achieved: false },
    { id: "m5", label: "8 mi · 3,400 ft", achieved: false },
    { id: "m6", label: "10 mi · 3,600 ft", achieved: false },
  ],
  progressToNext: 0.5,
};

export const steps = [
  {
    kind: "Add your hikes",
    title: "Start from the hikes you're actually chasing",
    body: "Type in the trail, the distance, the climb, and how many days it takes. On a device with Apple Intelligence, it can fill the stats in for you.",
  },
  {
    kind: "Get a plan",
    title: "A plan built from how you already train",
    body: "Hiking Passport uses your Apple Health data to build a training plan from the workouts you already do. It has modifications for disability and access needs, low energy, low time, parenting, and more, so everyone can hit their goal hikes.",
  },
  {
    kind: "Train",
    title: "A ladder between here and the summit",
    body: "Six milestone signs climb the trail, finishing with two dress rehearsals near eighty percent of the goal. Each milestone says how to do it in plain words: on a trail, a treadmill, a stair machine, or in the small things you already do.",
  },
  {
    kind: "Stamp it",
    title: "Proof you can see from across the room",
    body: "Log the summit with a date, a rating, a mood, and a photo. The stamp lands on the peak, the camp moves up the meadow behind you, and the boot prints on the trail reach a little further.",
  },
];

export const shots = [
  {
    image: "/shots/01-goal-hikes.jpg",
    blurb:
      "Every hike you're chasing becomes a mountain on your passport, with milestone signs up the trail.",
    alt: "Track your goal hikes. The passport scene: a goal hike on the summit, milestone signs along a trail, a tent and a buddy where the boot prints end.",
  },
  {
    image: "/shots/02-stamp-the-summit.jpg",
    blurb:
      "Log the date, a rating, how it felt, and a photo, and a stamp lands on the peak.",
    alt: "Stamp the summit. Logging South Sister with a date, a five star rating, a mood, and a photo set as the passport stamp.",
  },
  {
    image: "/shots/03-train-your-faves.jpg",
    blurb:
      "Pick how you like to move, from real hikes to the stair machine, and your plan is built around it.",
    alt: "Train doing your faves. Picking how you can train: real hikes, walks and runs, treadmill, stair machine, low impact, strength, and everyday habits.",
  },
  {
    image: "/shots/04-training-for-everyone.jpg",
    blurb:
      "Tell it what to work around, like young kids, no car, or sore knees, and the plan bends to fit.",
    alt: "Training for everyone. The list of things the plan can work around, across family, transportation, and body and health.",
  },
  {
    image: "/shots/05-hike-with-a-buddy.jpg",
    blurb:
      "Choose one of six animal buddies who cheers you on and never scolds.",
    alt: "Hike with a buddy. Choosing a hiking buddy, with Aerie the bald eagle at a ninety six percent match and her story underneath.",
  },
  {
    image: "/shots/06-hiking-insights.jpg",
    blurb:
      "See your total climb, trail miles, and longest hike, written in your buddy's voice.",
    alt: "Hiking insights. The stats tab, with total climb, trail miles, biggest climb, and longest hike, written in your buddy's voice.",
  },
  {
    image: "/shots/07-passport-themes.jpg",
    blurb:
      "Dress your passport in a park theme that carries over to your widgets and watch.",
    alt: "Passport themes. Picking a theme, with the whole scene recoloured and a row of park themes underneath.",
  },
  {
    image: "/shots/08-training-widgets.jpg",
    blurb:
      "Keep your season, next milestone, and today's pick right on your Home Screen.",
    alt: "Training widgets. Home Screen widgets showing the season, milestones done, and the insights your buddy pulled out.",
  },
];

export const plan = {
  ways: [
    "Real hikes",
    "Walks & runs",
    "Treadmill",
    "Stair machine",
    "Low impact",
    "Strength",
    "Everyday habits",
  ],
  tiers: [
    {
      name: "Matches it",
      body: "The milestone exactly, the way it's written.",
    },
    { name: "Your session", body: "Sized to how long you usually get." },
    { name: "Modified", body: "Bent around what you told it to work around." },
    { name: "Low energy", body: "For the days that ask for less." },
    { name: "Short on time", body: "For the days that give you less." },
  ],
  body: [
    "Setup asks how you can train, how many days a week, and how long a session is. Then it asks what to work around, and offers fifty-five things to tap: knees, lungs, a mobility aid, young kids, no car, shift work, a tight month, a body that is changing.",
    "None of it is a barrier to the goal. It changes what the plan suggests, never whether the mountain is yours to climb.",
  ],
};

export const buddies = [
  {
    name: "Aerie",
    species: "Bald eagle",
    note: "Disabled, fierce & kind",
    art: "/buddies/buddy-eagle.svg",
    tint: "#21614f",
    quote: "The trail isn't the problem, and neither are you.",
  },
  {
    name: "Berry",
    species: "Black bear",
    note: "Plus-size & joyful",
    art: "/buddies/buddy-berry.png",
    tint: "#9e5733",
    quote: "The view is the same size for everyone.",
  },
  {
    name: "Acorn",
    species: "Chipmunk",
    note: "Trains between naps",
    art: "/buddies/buddy-acorn.png",
    tint: "#946638",
    quote: "The stroller counts as a weighted sled, if you ask me.",
  },
  {
    name: "Juniper",
    species: "Box turtle",
    note: "Queer, trans & outside",
    art: "/buddies/buddy-turtle.png",
    tint: "#6b853d",
    quote: "You belong on every trail you walk.",
  },
  {
    name: "Otis",
    species: "Barred owl",
    note: "Neurodivergent & clear",
    art: "/buddies/buddy-owl.svg",
    tint: "#665747",
    quote: "Starting is the hard part. Shoes by the door helps.",
  },
  {
    name: "Biscuit",
    species: "Barn cat",
    note: "Funny, warm & on your side",
    art: "/buddies/buddy-cat.png",
    tint: "#c78f38",
    quote: "The mountain isn't going anywhere, and neither am I.",
  },
];

export const points = [
  {
    icon: "tent",
    title: "No account, no cloud",
    body: "Nothing to sign up for. Your passport, your hikes, and your photos are stored on your iPhone and work with no signal at all.",
  },
  {
    icon: "heart",
    title: "Apple Health is read only",
    body: "The app reads five things and writes nothing back. Decline any of them and the plan simply works without it.",
  },
  {
    icon: "watch",
    title: "On your wrist and Home Screen",
    body: "The Apple Watch app draws a miniature passport and lets you cross a milestone off or stamp a summit. Four widgets carry the plan, today's pick, and your stats.",
  },
  {
    icon: "eye",
    title: "Built to be legible",
    body: "The whole scene is described for VoiceOver, signs thin out instead of colliding as text grows, and the opening animation skips itself when Reduce Motion is on.",
  },
];

export const watchShots = [
  {
    image: "/watch/1-plan.jpg",
    cap: "The plan",
    alt: "The plan on the watch: fourteen miles and 5,100 feet of gain, two of six milestones done, and the next one is to climb 2,300 feet.",
  },
  {
    image: "/watch/2-todays-pick.jpg",
    cap: "Today's pick",
    alt: "Today's pick from Aerie: climb 2,300 feet, with a list of other things that also count.",
  },
  {
    image: "/watch/3-ways-to-do-it.jpg",
    cap: "Ways to do it",
    alt: "Ways to do it: fifty eight minutes on a stair machine, eighty eight minutes on a treadmill at a ten percent incline, or 230 flights of stairs over the week.",
  },
  {
    image: "/watch/4-passport.jpg",
    cap: "Your passport",
    alt: "The passport drawn on the watch, with the mountain, the trail, milestone signs, and the buddy.",
  },
  {
    image: "/watch/5-insights.jpg",
    cap: "Insights",
    alt: "Aerie took a look: total climb of 78,833 feet, described as the height of Everest twice.",
  },
];

export const pricing = {
  free: [
    "The passport, the scene, the six milestone signs, and your progress up the trail",
    "One goal hike per passport",
    "Summit stamps with a date, rating, mood, notes, and a photo",
    "All six hiking buddies and the Meadow theme",
    "Hikes, miles, and climb on the Stats tab",
  ],
  pro: [
    "The training plan behind the signs, built from your hikes and your Apple Health history",
    "Your buddy's pick for today, sized to how you've actually been training",
    "Stats insights in your buddy's voice",
    "Every hike on your list in one passport",
    "Six more park themes for the passport, widgets, and watch",
  ],
  prices: [
    {
      plan: "Yearly",
      price: "$39.99",
      per: "a year",
      note: "7-day free trial",
    },
    {
      plan: "Monthly",
      price: "$4.99",
      per: "a month",
      note: "Cancel any time",
    },
  ],
  requirements:
    "iPhone on iOS 26 or later. The watch app needs watchOS 26. Apple Intelligence features need a device that supports it; without one, you enter trail stats by hand and the plan is unchanged.",
};

// The ridgeline above the footer, built like the one on lillyseay.com: the front
// range's summits are the season's hikes. x is across the page (0 to 100) and
// height how tall the peak stands (0 to 100).
export const ridgeSummits = [
  { year: "Summited Jun 7", label: "Mount Si · 4,167 ft", x: 16, height: 42 },
  {
    year: "Summited Aug 16",
    label: "South Sister · 10,358 ft",
    x: 50,
    height: 92,
  },
  { year: "Goal", label: "Mount St. Helens · 8,363 ft", x: 83, height: 76 },
];

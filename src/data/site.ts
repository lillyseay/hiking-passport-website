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
  support: "https://lillyseay.com/hiking-passport/support/",
  privacy: "https://lillyseay.com/hiking-passport/privacy/",
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
    body: "Type in the trail, the distance, the climb, and how many days it takes. With Apple Intelligence it can fill the stats in for you, and it tells you how confident it is so you know when to check a guidebook.",
  },
  {
    kind: "Bring in Health",
    title: "The plan starts from the week you already have",
    body: "With your permission the app reads your steps, distance, flights climbed, active energy, and workouts from Apple Health. Nothing is written back. Skip it and everything still works, logged by hand.",
  },
  {
    kind: "Train",
    title: "A ladder between here and the summit",
    body: "Six milestone signs climb the trail, finishing with two dress rehearsals near eighty percent of the goal. Each rung says how to do it in plain words: on a trail, a treadmill, a stair machine, or in the small things you already do.",
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
    alt: "Track your goal hikes. The passport scene: a goal hike on the summit, milestone signs along a trail, a tent and a buddy where the boot prints end.",
  },
  {
    image: "/shots/02-stamp-the-summit.jpg",
    alt: "Stamp the summit. Logging South Sister with a date, a five star rating, a mood, and a photo set as the passport stamp.",
  },
  {
    image: "/shots/03-train-your-faves.jpg",
    alt: "Train doing your faves. Picking how you can train: real hikes, walks and runs, treadmill, stair machine, low impact, strength, and everyday habits.",
  },
  {
    image: "/shots/04-training-for-everyone.jpg",
    alt: "Training for everyone. The list of things the plan can work around, across family, transportation, and body and health.",
  },
  {
    image: "/shots/05-hike-with-a-buddy.jpg",
    alt: "Hike with a buddy. Choosing a hiking buddy, with Aerie the bald eagle at a ninety six percent match and her story underneath.",
  },
  {
    image: "/shots/06-hiking-insights.jpg",
    alt: "Hiking insights. The stats tab, with total climb, trail miles, biggest climb, and longest hike, written in your buddy's voice.",
  },
  {
    image: "/shots/07-passport-themes.jpg",
    alt: "Passport themes. Picking a theme, with the whole scene recoloured and a row of park themes underneath.",
  },
  {
    image: "/shots/08-training-widgets.jpg",
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

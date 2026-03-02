export const coursesData = [
  {
    id: "strat-101",
    title: "Global Strategy & Leadership",
    price: 499,
    duration: "12 hrs",
    lessons: 24,
    progress: 100, // Added for testing the certificate UI
    category: "Strategy",
    description: "Master international markets and high-performance team building.",
    videoPreview: "https://sample-videos.com/video123.mp4",
    img: "bg-blue-600/10",
    views: 1240,
    exam: { questions: [{}, {}, {}] } // Mock exam object
  },
  {
    id: "fin-202",
    title: "International Finance Mastery",
    price: 599,
    duration: "18 hrs",
    lessons: 32,
    progress: 45, // Example of in-progress
    category: "Finance",
    description: "Advanced capital management for the modern global professional.",
    videoPreview: "https://sample-videos.com/video456.mp4",
    img: "bg-emerald-600/10",
    views: 2100,
    exam: null
  },
  {
    id: "ux-303",
    title: "UI/UX for Fintech Platforms",
    price: 399,
    duration: "10 hrs",
    lessons: 18,
    progress: 0, // Not started
    category: "Design",
    description: "Designing secure, high-trust financial interfaces.",
    videoPreview: "https://sample-videos.com/video789.mp4",
    img: "bg-purple-600/10",
    views: 980,
    exam: null
  }
];
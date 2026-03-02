export const coursesData = [
  {
    id: "strat-101",
    title: "Global Strategy & Leadership",
    price: 499,
    duration: "12 hrs",
    category: "Strategy",
    description: "Master international markets and high-performance team building.",
    intro: "Lead with authority in the global diaspora marketplace.",
    image: null,
    img: "bg-blue-600/10",
    students: 1240,
    status: "Published",
    lessons: [
      { 
        id: 1, 
        title: "Industry Overview & Fundamentals", 
        duration: "15:20", 
        summary: "An deep dive into market entry strategies and foundational diaspora economics.",
        videoUrl: "https://sample-videos.com/video123.mp4",
        resources: [{ name: "Market_Analysis_2026.pdf", size: "12MB" }]
      },
      { 
        id: 2, 
        title: "Strategic Resource Allocation", 
        duration: "22:45", 
        summary: "Learn how to distribute capital and talent effectively across borders.",
        videoUrl: "https://sample-videos.com/video456.mp4",
        resources: [{ name: "Resource_Sheet.xlsx", size: "4MB" }]
      }
    ],
    exam: { questions: [{}, {}, {}] } 
  },
  {
    id: "fin-202",
    title: "International Finance Mastery",
    price: 599,
    duration: "18 hrs",
    category: "Finance",
    description: "Advanced capital management for the modern global professional.",
    intro: "Unlock the secrets of international capital flows.",
    img: "bg-emerald-600/10",
    students: 2100,
    status: "Published",
    lessons: [],
    exam: null
  }
];
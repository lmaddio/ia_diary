/**
 * Centralized text content management
 * All application text is defined here for easy maintenance
 */

export const content = {
  // Meta & SEO
  meta: {
    title: "MoodTrack - Your Personal Wellness Diary",
    description:
      "Track your mood, sleep, work hours, and daily activities. Get AI-powered insights to understand your patterns and improve your well-being.",
    keywords:
      "mood tracker, wellness diary, mental health, sleep tracking, work-life balance, AI insights",
    siteName: "MoodTrack",
    ogImage: "/og-image.jpg",
  },

  // Navigation
  nav: {
    brand: "MoodTrack",
    home: "Home",
    features: "Features",
    pricing: "Pricing",
    about: "About",
    login: "Log In",
    register: "Get Started",
    dashboard: "Dashboard",
    diary: "Daily Log",
    logout: "Log Out",
  },

  // Landing Page
  landing: {
    hero: {
      title: "Understand Your Life Patterns",
      subtitle: "Track Your Daily Journey",
      description:
        "Log your mood, sleep, work, activities, and thoughts. Let AI help you discover patterns and insights to improve your well-being.",
      cta: {
        primary: "Start Tracking Free",
        secondary: "Learn More",
      },
    },
    features: {
      title: "Everything You Need to Track Your Wellness",
      subtitle: "Comprehensive tracking tools designed for your daily life",
      items: [
        {
          title: "Mood Tracking",
          description:
            "Log how you feel throughout the day with our intuitive mood tracker. Capture the nuances of your emotional state.",
          icon: "heart",
        },
        {
          title: "Sleep & Work Balance",
          description:
            "Track your sleep hours and work time to find the perfect balance for optimal productivity and rest.",
          icon: "clock",
        },
        {
          title: "Activity Logging",
          description:
            "Record your outdoor time, hobbies, and free time activities to understand how they affect your mood.",
          icon: "activity",
        },
        {
          title: "Nutrition Diary",
          description:
            "Keep track of what you eat and discover connections between your diet and how you feel.",
          icon: "utensils",
        },
        {
          title: "AI-Powered Insights",
          description:
            "Our AI analyzes your data to find patterns and provide personalized recommendations.",
          icon: "brain",
        },
        {
          title: "Free Expression",
          description:
            "Write freely about your day in a private space. Sometimes you just need to express yourself.",
          icon: "pen",
        },
      ],
    },
    howItWorks: {
      title: "How It Works",
      subtitle: "Simple steps to better self-understanding",
      steps: [
        {
          number: "01",
          title: "Log Daily",
          description:
            "Spend just 5 minutes each day logging your mood, activities, and thoughts.",
        },
        {
          number: "02",
          title: "Track Patterns",
          description:
            "View your data visualized in beautiful charts and graphs on your dashboard.",
        },
        {
          number: "03",
          title: "Get Insights",
          description:
            "Ask our AI to analyze your patterns and receive personalized insights.",
        },
      ],
    },
    testimonials: {
      title: "What Our Users Say",
      items: [
        {
          quote:
            "MoodTrack helped me realize that my afternoon slumps were directly related to skipping lunch. Simple insight, huge impact!",
          author: "Sarah M.",
          role: "Product Designer",
        },
        {
          quote:
            "I finally understand why some weeks feel better than others. The sleep vs work balance feature is a game changer.",
          author: "James K.",
          role: "Software Engineer",
        },
        {
          quote:
            "The AI insights are incredibly accurate. It noticed patterns I never would have seen on my own.",
          author: "Emily R.",
          role: "Teacher",
        },
      ],
    },
    cta: {
      title: "Ready to Understand Yourself Better?",
      description: "Join thousands of users who are taking control of their well-being.",
      button: "Start Your Journey",
    },
    footer: {
      tagline: "Your personal wellness companion",
      copyright: "© 2024 MoodTrack. All rights reserved.",
      links: {
        product: ["Features", "Pricing", "About"],
        support: ["Help Center", "Contact", "Privacy"],
        legal: ["Terms of Service", "Privacy Policy", "Cookie Policy"],
      },
    },
  },

  // Auth Pages
  auth: {
    login: {
      title: "Welcome Back",
      subtitle: "Log in to continue your wellness journey",
      emailLabel: "Email Address",
      emailPlaceholder: "you@example.com",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter your password",
      rememberMe: "Remember me",
      forgotPassword: "Forgot password?",
      submitButton: "Log In",
      noAccount: "Don't have an account?",
      signUpLink: "Sign up",
      orContinueWith: "Or continue with",
    },
    register: {
      title: "Create Your Account",
      subtitle: "Start tracking your wellness journey today",
      nameLabel: "Full Name",
      namePlaceholder: "John Doe",
      emailLabel: "Email Address",
      emailPlaceholder: "you@example.com",
      passwordLabel: "Password",
      passwordPlaceholder: "Create a strong password",
      confirmPasswordLabel: "Confirm Password",
      confirmPasswordPlaceholder: "Confirm your password",
      termsAgree: "I agree to the",
      termsLink: "Terms of Service",
      andText: "and",
      privacyLink: "Privacy Policy",
      submitButton: "Create Account",
      hasAccount: "Already have an account?",
      signInLink: "Log in",
    },
  },

  // Dashboard
  dashboard: {
    title: "Dashboard",
    greeting: "Welcome back",
    overview: "Your Wellness Overview",
    lastWeek: "Last 7 Days",
    lastMonth: "Last 30 Days",
    allTime: "All Time",
    metrics: {
      avgMood: "Average Mood",
      avgSleep: "Avg. Sleep",
      avgWork: "Avg. Work",
      avgOutdoor: "Avg. Outdoor Time",
      totalEntries: "Total Entries",
      streak: "Current Streak",
    },
    charts: {
      moodTrend: "Mood Trend",
      timeDistribution: "Time Distribution",
      activityImpact: "Activity Impact on Mood",
      sleepVsMood: "Sleep vs Mood Correlation",
    },
    analysis: {
      title: "AI Analysis",
      description: "Get personalized insights from your data",
      button: "Analyze My Patterns",
      loading: "Analyzing your data...",
      noData: "Log more entries to get AI insights",
    },
    quickStats: {
      title: "Quick Stats",
      bestMoodDay: "Best Mood Day",
      mostProductive: "Most Productive",
      mostRested: "Most Rested",
    },
    recentEntries: {
      title: "Recent Entries",
      viewAll: "View All",
      noEntries: "No entries yet. Start logging your day!",
    },
  },

  // Diary/Chat Page
  diary: {
    title: "Daily Log",
    subtitle: "How was your day?",
    form: {
      mood: {
        label: "How are you feeling?",
        options: ["😢 Very Low", "😕 Low", "😐 Neutral", "🙂 Good", "😄 Great"],
      },
      sleep: {
        label: "Hours of Sleep",
        placeholder: "e.g., 7",
      },
      work: {
        label: "Hours of Work",
        placeholder: "e.g., 8",
      },
      outdoor: {
        label: "Time Spent Outside (hours)",
        placeholder: "e.g., 2",
      },
      meals: {
        label: "What did you eat today?",
        placeholder:
          "Describe your meals... (e.g., Breakfast: oatmeal with berries, Lunch: salad with chicken...)",
      },
      activities: {
        label: "Free Time Activities",
        placeholder: "What did you do in your free time? (e.g., reading, gaming, exercise...)",
      },
      notes: {
        label: "Free Expression",
        placeholder:
          "Write anything you want to express... How do you really feel? What's on your mind?",
      },
      submit: "Save Entry",
      saving: "Saving...",
      saved: "Entry Saved!",
      errors: {
        dateRequired: "Please select a date",
        dateFuture: "Date cannot be in the future",
        sleepRange: "Sleep hours must be between 0 and 24",
        workRange: "Work hours must be between 0 and 24",
        outdoorRange: "Outdoor hours must be between 0 and 24",
        totalHours: "Total hours (sleep + work + outdoor) cannot exceed 24 hours",
        invalidNumber: "Please enter a valid number",
      },
    },
    chat: {
      title: "Chat with AI",
      placeholder: "Ask me about your patterns, get advice, or just talk...",
      send: "Send",
      clear: "Clear",
      typing: "AI is thinking...",
      welcome:
        "Hi! I'm your wellness assistant. Ask me anything about your tracked data, patterns, or just chat about how you're feeling.",
      suggestions: [
        "How has my mood been this week?",
        "What affects my sleep quality?",
        "Give me tips to improve my work-life balance",
        "Analyze my recent patterns",
      ],
    },
    history: {
      title: "Entry History",
      edit: "Edit",
      delete: "Delete",
      confirmDelete: "Are you sure you want to delete this entry?",
    },
  },

  // Common
  common: {
    loading: "Loading...",
    error: "Something went wrong",
    retry: "Try Again",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    back: "Back",
    next: "Next",
    submit: "Submit",
    search: "Search",
    noResults: "No results found",
    today: "Today",
    yesterday: "Yesterday",
    hours: "hours",
    days: "days",
  },

  // Mood Labels
  moods: {
    1: { label: "Very Low", emoji: "😢", color: "red" },
    2: { label: "Low", emoji: "😕", color: "orange" },
    3: { label: "Neutral", emoji: "😐", color: "yellow" },
    4: { label: "Good", emoji: "🙂", color: "lime" },
    5: { label: "Great", emoji: "😄", color: "green" },
  },
} as const;

export type Content = typeof content;

export interface Lesson {
  title: string;
  duration: string;
  description: string;
}

export interface Module {
  number: number;
  title: string;
  duration: string;
  color: string;
  description: string;
  lessons: Lesson[];
}

export interface CourseData {
  id: string;
  title: string;
  shortTitle: string;
  modules: Module[];
  bonusModule?: {
    title: string;
    description: string;
    lessons: Lesson[];
  };
  resources: Resource[];
}

export interface Resource {
  name: string;
  description: string;
  type: 'spreadsheet' | 'template' | 'checklist' | 'pdf' | 'guide';
  moduleNumber?: number;
}

export const beginnerCourse: CourseData = {
  id: 'beginner-course',
  title: 'Beginners: From Book to Buy-to-Let',
  shortTitle: 'Beginners',
  modules: [
    {
      number: 1,
      title: 'Getting Started the Right Way',
      duration: '35 min',
      color: 'indigo',
      description: 'Lay the groundwork for a successful property investment journey. Set clear goals, understand the landscape, and build the right team around you from day one.',
      lessons: [
        { title: 'Why buy-to-let — and why now', duration: '12 min', description: 'Understand the fundamentals of buy-to-let investing and why it remains one of the most reliable wealth-building strategies in the UK.' },
        { title: 'Setting your investment goals and timeline', duration: '11 min', description: "Define what success looks like for you — whether it's replacing your income, building long-term equity, or creating a retirement fund." },
        { title: 'Building your power team (broker, solicitor, accountant)', duration: '12 min', description: 'Learn who you need in your corner, how to find them, and what to look for in a great mortgage broker, property solicitor, and accountant.' },
      ],
    },
    {
      number: 2,
      title: 'Understanding the Numbers',
      duration: '40 min',
      color: 'purple',
      description: 'Master the financial fundamentals that separate profitable deals from money pits. Learn to analyse any property in minutes with confidence.',
      lessons: [
        { title: 'The key metrics: yield, ROI, and cashflow', duration: '14 min', description: "Understand the three numbers every investor must know — and how to calculate them quickly for any property you're considering." },
        { title: 'Running the numbers on a real deal (walkthrough)', duration: '14 min', description: 'Follow along as we analyse a real property listing step by step, using the included Deal Analyser spreadsheet.' },
        { title: 'Stress-testing your deal against rate rises', duration: '12 min', description: 'Learn how to pressure-test your numbers against interest rate increases, void periods, and unexpected costs so you never get caught out.' },
      ],
    },
    {
      number: 3,
      title: 'Finding the Right Property',
      duration: '38 min',
      color: 'emerald',
      description: 'Discover where to look, what to look for, and how to spot opportunity where others see risk. From online portals to off-market gems.',
      lessons: [
        { title: 'Choosing the right area and tenant type', duration: '13 min', description: 'Learn how to research areas, assess tenant demand, and match locations to your investment strategy and budget.' },
        { title: 'Where to search: portals, agents, and off-market', duration: '12 min', description: 'Go beyond Rightmove. Discover how to build relationships with agents, find off-market deals, and use auction sites effectively.' },
        { title: 'Viewing properties: what to look for and red flags', duration: '13 min', description: 'Use the included Viewing Checklist to inspect properties like a pro. Know exactly what to look for — and what should make you walk away.' },
      ],
    },
    {
      number: 4,
      title: 'Financing Your Investment',
      duration: '36 min',
      color: 'amber',
      description: 'Navigate the world of buy-to-let mortgages with clarity. Understand what lenders want, how much you really need, and how to get the best deal.',
      lessons: [
        { title: 'Buy-to-let mortgages explained', duration: '13 min', description: 'A clear, jargon-free guide to how buy-to-let mortgages work, including interest-only vs repayment, fixed vs variable, and stress tests.' },
        { title: 'How much deposit do you really need?', duration: '11 min', description: 'Understand the real numbers behind deposits, stamp duty, legal fees, and refurbishment costs — so there are no surprises.' },
        { title: 'Working with a mortgage broker', duration: '12 min', description: 'Learn why a good broker is worth their weight in gold, how to choose one, and what information to have ready before your first call.' },
      ],
    },
    {
      number: 5,
      title: 'Making Offers and Closing Deals',
      duration: '38 min',
      color: 'rose',
      description: 'Learn to negotiate with confidence, navigate the legal process, and get from offer accepted to keys in hand without the stress.',
      lessons: [
        { title: 'How to make a strong offer (and negotiate)', duration: '13 min', description: 'Understand the psychology of negotiation, how to justify your offer, and when to push harder or walk away.' },
        { title: 'The conveyancing process step by step', duration: '13 min', description: 'Demystify the legal process from offer acceptance to exchange. Know what your solicitor is doing and what you need to provide.' },
        { title: 'Exchange, completion, and getting the keys', duration: '12 min', description: 'Understand the final stages of the purchase — exchange of contracts, completion day, and what happens immediately after.' },
      ],
    },
    {
      number: 6,
      title: 'Becoming a Landlord',
      duration: '36 min',
      color: 'cyan',
      description: 'Set yourself up as a professional, compliant landlord from day one. Find great tenants, understand your obligations, and manage for long-term profit.',
      lessons: [
        { title: 'Finding and vetting quality tenants', duration: '12 min', description: "Learn how to market your property, conduct viewings, run reference checks, and select tenants who'll look after your investment." },
        { title: 'Legal obligations every landlord must know', duration: '12 min', description: 'From gas safety certificates to deposit protection — understand the legal requirements so you stay compliant and protected.' },
        { title: 'Managing your property for long-term profit', duration: '12 min', description: 'Self-manage vs letting agent, handling maintenance, rent reviews, and building a system that runs smoothly month after month.' },
      ],
    },
  ],
  bonusModule: {
    title: 'Bonus — Deal Walkthrough(s) + Q&A',
    description: 'See the entire process in action with real deal walkthroughs, learn from common mistakes, and get answers to the most frequently asked questions.',
    lessons: [
      { title: 'Live deal walkthrough: from search to completion', duration: '18 min', description: 'Follow a real deal from the initial property search through analysis, offer, negotiation, and all the way to completion day.' },
      { title: 'Common mistakes and how to avoid them', duration: '12 min', description: 'Learn from the most common errors new investors make — and the simple steps to avoid each one.' },
      { title: 'Live Q&A recordings', duration: '25 min', description: 'Curated recordings from live Q&A sessions covering the questions students ask most often.' },
    ],
  },
  resources: [
    { name: 'Deal Analyser Spreadsheet', description: 'Plug in any property and instantly see yield, ROI, cashflow, and stress-test results.', type: 'spreadsheet', moduleNumber: 2 },
    { name: 'Viewing Checklist', description: 'A printable checklist to take with you on every property viewing.', type: 'checklist', moduleNumber: 3 },
    { name: 'Mortgage Comparison Template', description: 'Compare mortgage offers side by side with all the key figures.', type: 'template', moduleNumber: 4 },
    { name: 'Offer Letter Template', description: 'A professional offer letter template you can customise for any property.', type: 'template', moduleNumber: 5 },
    { name: 'Tenant Referencing Checklist', description: 'Everything you need to check before accepting a tenant.', type: 'checklist', moduleNumber: 6 },
    { name: 'Landlord Compliance Checklist', description: 'All the legal requirements and certificates you need as a landlord.', type: 'checklist', moduleNumber: 6 },
    { name: 'Investment Goals Worksheet', description: 'A guided worksheet to define your property investment goals and timeline.', type: 'pdf', moduleNumber: 1 },
    { name: 'Monthly Cashflow Tracker', description: 'Track your rental income, expenses, and net cashflow month by month.', type: 'spreadsheet' },
  ],
};

export const masterclassCourse: CourseData = {
  id: 'masterclass',
  title: 'Property Investor Masterclass',
  shortTitle: 'Masterclass',
  modules: [
    {
      number: 1,
      title: 'The Investor Mindset',
      duration: '45 min',
      color: 'amber',
      description: 'Develop the psychology and discipline that separates successful property investors from everyone else.',
      lessons: [
        { title: 'Why most investors fail — and how to avoid it', duration: '15 min', description: 'Understand the common psychological traps that derail property investors.' },
        { title: 'Building your investment thesis', duration: '15 min', description: 'Create a clear, written investment strategy that guides every decision.' },
        { title: 'Risk management and emotional discipline', duration: '15 min', description: 'Learn to separate emotion from analysis and manage downside risk.' },
      ],
    },
    {
      number: 2,
      title: 'Market Analysis & Research',
      duration: '50 min',
      color: 'emerald',
      description: 'Master the art of reading property markets and identifying emerging opportunities.',
      lessons: [
        { title: 'Reading the property market cycle', duration: '18 min', description: 'Understand the four phases of the property cycle.' },
        { title: 'Area analysis: demographics, infrastructure & demand', duration: '16 min', description: 'Use data-driven research to identify high-growth areas.' },
        { title: 'Comparable analysis and valuation techniques', duration: '16 min', description: 'Learn professional valuation methods.' },
      ],
    },
    {
      number: 3,
      title: 'Advanced Deal Analysis',
      duration: '55 min',
      color: 'indigo',
      description: 'Master sophisticated financial modelling and the metrics professional investors use.',
      lessons: [
        { title: 'Advanced metrics: ROCE, IRR, and equity multiple', duration: '18 min', description: 'Learn the advanced financial metrics that institutional investors use.' },
        { title: 'Building a comprehensive deal model', duration: '20 min', description: 'Create a full financial model for any property deal.' },
        { title: 'Sensitivity analysis and worst-case planning', duration: '17 min', description: 'Stress-test every deal against multiple scenarios.' },
      ],
    },
    {
      number: 4,
      title: 'Financing Strategies',
      duration: '50 min',
      color: 'purple',
      description: 'Understand the full spectrum of financing options available to property investors.',
      lessons: [
        { title: 'Portfolio lending and commercial finance', duration: '17 min', description: 'Understand how portfolio and commercial lending works.' },
        { title: 'Limited company structures and tax planning', duration: '18 min', description: 'Explore the pros and cons of buying through a limited company.' },
        { title: 'Refinancing, recycling capital, and the BRRRR method', duration: '15 min', description: 'Master the strategy of buying, refurbishing, refinancing.' },
      ],
    },
    {
      number: 5,
      title: 'Portfolio Strategy & Scaling',
      duration: '48 min',
      color: 'rose',
      description: 'Plan and execute a portfolio strategy that compounds over time.',
      lessons: [
        { title: 'Building a portfolio plan: 1, 5, and 10-year roadmap', duration: '16 min', description: 'Create a realistic, phased plan for growing your portfolio.' },
        { title: 'Diversification: geography, property type, and tenant mix', duration: '16 min', description: 'Reduce risk by diversifying across locations and types.' },
        { title: 'When to sell, remortgage, or hold', duration: '16 min', description: 'Make strategic decisions about your existing portfolio.' },
      ],
    },
    {
      number: 6,
      title: 'Refurbishment & Value-Add',
      duration: '45 min',
      color: 'cyan',
      description: 'Learn to add value through smart refurbishment.',
      lessons: [
        { title: 'Identifying value-add opportunities', duration: '15 min', description: 'Spot properties where strategic improvements can significantly increase value.' },
        { title: 'Budgeting, project management, and contractor relations', duration: '15 min', description: 'Manage refurbishment projects professionally.' },
        { title: 'High-ROI improvements vs vanity projects', duration: '15 min', description: 'Focus your budget on improvements that deliver the highest return.' },
      ],
    },
    {
      number: 7,
      title: 'Tax, Legal & Compliance',
      duration: '50 min',
      color: 'amber',
      description: 'Navigate the complex world of property tax, legal structures, and regulatory compliance.',
      lessons: [
        { title: 'Income tax, CGT, and stamp duty for investors', duration: '18 min', description: 'Understand the full tax landscape for property investors.' },
        { title: 'Legal structures: personal vs company ownership', duration: '16 min', description: 'Compare ownership structures.' },
        { title: 'Regulatory compliance and landlord obligations', duration: '16 min', description: 'Stay compliant with evolving regulations.' },
      ],
    },
    {
      number: 8,
      title: 'Building Long-Term Wealth',
      duration: '45 min',
      color: 'emerald',
      description: 'Tie everything together into a sustainable, long-term wealth-building system.',
      lessons: [
        { title: 'Creating passive income through systemisation', duration: '15 min', description: 'Build systems that allow your portfolio to run with minimal involvement.' },
        { title: 'Estate planning and wealth transfer', duration: '15 min', description: 'Plan for the long term — inheritance tax, trusts, and wealth transfer.' },
        { title: 'Your personalised action plan', duration: '15 min', description: 'Bring everything together into a personalised, actionable plan.' },
      ],
    },
  ],
  resources: [
    { name: 'Advanced Deal Model Spreadsheet', description: 'Full financial model with IRR, ROCE, and equity multiple calculations.', type: 'spreadsheet', moduleNumber: 3 },
    { name: 'Market Cycle Analysis Framework', description: 'A framework for identifying where we are in the property cycle.', type: 'pdf', moduleNumber: 2 },
    { name: 'Area Research Template', description: 'A structured template for researching and comparing investment areas.', type: 'template', moduleNumber: 2 },
    { name: 'Portfolio Planning Roadmap', description: 'Map out your 1, 5, and 10-year portfolio growth plan.', type: 'template', moduleNumber: 5 },
    { name: 'Refurbishment Budget Planner', description: 'Plan and track refurbishment costs with built-in contingency.', type: 'spreadsheet', moduleNumber: 6 },
    { name: 'Tax Planning Checklist', description: 'Key tax considerations and allowable expenses for property investors.', type: 'checklist', moduleNumber: 7 },
    { name: 'BRRRR Strategy Calculator', description: 'Model the full BRRRR cycle including refinance and capital recycling.', type: 'spreadsheet', moduleNumber: 4 },
    { name: 'Wealth Building Action Plan', description: 'Your personalised action plan template to complete after the course.', type: 'guide', moduleNumber: 8 },
  ],
};

/** Virtual course for Starter Pack - shows admin-uploaded resources (videos, PDFs, etc.) */
export const starterPackCourse: CourseData = {
  id: 'starter-pack',
  title: 'Starter Pack Resources',
  shortTitle: 'Starter Pack',
  modules: [],
  resources: [],
};

export const allCourses: CourseData[] = [beginnerCourse, masterclassCourse, starterPackCourse];

export const getCourseById = (id: string): CourseData | undefined => {
  return allCourses.find(c => c.id === id);
};

export const getTotalLessons = (course: CourseData): number => {
  let total = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  if (course.bonusModule) {
    total += course.bonusModule.lessons.length;
  }
  return total;
};

export const getTotalDuration = (course: CourseData): number => {
  let total = course.modules.reduce((acc, m) => acc + parseInt(m.duration), 0);
  if (course.bonusModule) {
    total += course.bonusModule.lessons.reduce((acc, l) => acc + parseInt(l.duration), 0);
  }
  return total;
};

export const colorMap: Record<string, { bg: string; border: string; text: string; badge: string; dot: string; lessonIcon: string; gradient: string }> = {
  indigo: { bg: 'bg-indigo-500/5', border: 'border-indigo-500/20', text: 'text-indigo-400', badge: 'bg-indigo-500/10', dot: 'bg-indigo-400', lessonIcon: 'text-indigo-400', gradient: 'from-indigo-500 to-indigo-600' },
  purple: { bg: 'bg-purple-500/5', border: 'border-purple-500/20', text: 'text-purple-400', badge: 'bg-purple-500/10', dot: 'bg-purple-400', lessonIcon: 'text-purple-400', gradient: 'from-purple-500 to-purple-600' },
  emerald: { bg: 'bg-emerald-500/5', border: 'border-emerald-500/20', text: 'text-emerald-400', badge: 'bg-emerald-500/10', dot: 'bg-emerald-400', lessonIcon: 'text-emerald-400', gradient: 'from-emerald-500 to-emerald-600' },
  amber: { bg: 'bg-amber-500/5', border: 'border-amber-500/20', text: 'text-amber-400', badge: 'bg-amber-500/10', dot: 'bg-amber-400', lessonIcon: 'text-amber-400', gradient: 'from-amber-500 to-amber-600' },
  rose: { bg: 'bg-rose-500/5', border: 'border-rose-500/20', text: 'text-rose-400', badge: 'bg-rose-500/10', dot: 'bg-rose-400', lessonIcon: 'text-rose-400', gradient: 'from-rose-500 to-rose-600' },
  cyan: { bg: 'bg-cyan-500/5', border: 'border-cyan-500/20', text: 'text-cyan-400', badge: 'bg-cyan-500/10', dot: 'bg-cyan-400', lessonIcon: 'text-cyan-400', gradient: 'from-cyan-500 to-cyan-600' },
};

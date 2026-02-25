// Unified Funnel Templates for Both Courses
// Each course has its own funnel email sequence and metadata

import { 
  MASTERCLASS_FUNNEL_EMAILS, 
  PURPOSE_COLORS, 
  PURPOSE_LABELS,
  type FunnelEmailDefinition 
} from './masterclassFunnelEmails';

export { PURPOSE_COLORS, PURPOSE_LABELS };
export type { FunnelEmailDefinition };

export interface CourseFunnelTemplate {
  courseId: string;
  courseName: string;
  coursePrice: string;
  courseFullPrice: string;
  courseDiscount: string;
  funnelName: string;
  funnelDescription: string;
  funnelTrigger: string;
  funnelFilter: string;
  color: string;        // gradient color for UI
  icon: string;          // SVG path for icon
  tier: 'primary' | 'upsell';  // funnel tier
  chainFromCourseId?: string;   // if upsell, which course funnel feeds into this
  pipelineStages: { label: string; sublabel: string; color: string; icon: string }[];
  emails: FunnelEmailDefinition[];
}


// ═══════════════════════════════════════════════════════════
// TEMPLATE 1: BEGINNER COURSE — "From Book to Buy-to-Let"
// ═══════════════════════════════════════════════════════════

const BEGINNER_FUNNEL_EMAILS: FunnelEmailDefinition[] = [
  {
    step_number: 1,
    subject: "Welcome – Here's Your Property Investor Starter Pack",
    delay_days: 0,
    delay_hours: 0,
    step_purpose: 'deliver',
    cta_url: '/start',
    cta_label: 'Download the Starter Pack',
    sender_name: 'Chris Ifonlaja',
    sender_email: 'noreply@buildwealththroughproperty.com',
    summary: 'Deliver the Starter Pack resources and set expectations for the email sequence',
    html_body: `<h2 style="color:#1e293b;font-size:22px;margin-bottom:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Welcome – Here's Your Starter Pack</h2>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Hi {first_name},</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Thank you for downloading the Property Investor Starter Pack – and thank you for reading <strong style="color:#1e293b;">Build Wealth Through Property</strong>.</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">As promised, here are your resources:</p>

<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin:20px 0;">
  <p style="color:#166534;font-size:15px;line-height:2;margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <strong>Inside your Starter Pack:</strong><br/>
    &#8226; Free Chapter — from Build Wealth Through Property<br/>
    &#8226; Practical Checklist — 7 Questions to Ask Before Buying Your First Property<br/>
    &#8226; Deal Analyser Spreadsheet<br/>
    &#8226; Property Viewing Checklist<br/>
    &#8226; Mortgage Readiness Guide<br/>
    &#8226; First-Time Investor Checklist
  </p>
</div>

<p style="margin:24px 0;text-align:center;"><a href="{{cta_url}}" style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#d97706);color:#1e293b;font-weight:bold;padding:16px 32px;border-radius:12px;text-decoration:none;font-size:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Download the Starter Pack</a></p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Over the next few days, I'll send short, simple emails to help you take the next steps on your property journey.</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">No hype. Just practical guidance.</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">To your success,</p>
<p style="color:#1e293b;font-size:15px;font-weight:600;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Chris Ifonlaja</p>`,
  },
  {
    step_number: 2,
    subject: 'Why I Wrote Build Wealth Through Property',
    delay_days: 2,
    delay_hours: 0,
    step_purpose: 'educate',
    cta_url: '',
    cta_label: '',
    sender_name: 'Chris Ifonlaja',
    sender_email: 'noreply@buildwealththroughproperty.com',
    summary: 'Build personal connection and establish credibility through the author\'s story',
    html_body: `<h2 style="color:#1e293b;font-size:22px;margin-bottom:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Why I Wrote This Book</h2>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Hi {first_name},</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">I didn't write this book to push hype or shortcuts.</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">I wrote it because I realised property can build long-term financial security for ordinary people — <strong style="color:#1e293b;">if they understand the principles behind it</strong>.</p>

<div style="background:#eff6ff;border-left:4px solid #3b82f6;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0;">
  <p style="color:#1e40af;font-size:15px;line-height:1.7;margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">My goal is simple: help you make smarter, safer property decisions — based on real principles, not hype.</p>
</div>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">In my next email, I'll share the 3 numbers that every property investor must know before making any deal.</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Speak soon,</p>
<p style="color:#1e293b;font-size:15px;font-weight:600;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Chris</p>`,
  },
  {
    step_number: 3,
    subject: 'The 3 Numbers Every Property Investor Must Know',
    delay_days: 2,
    delay_hours: 0,
    step_purpose: 'educate',
    cta_url: '/calculator',
    cta_label: 'Try the Free Calculator',
    sender_name: 'Chris Ifonlaja',
    sender_email: 'noreply@buildwealththroughproperty.com',
    summary: 'Deliver high-value educational content and introduce the Deal Analyser tool',
    html_body: `<h2 style="color:#1e293b;font-size:22px;margin-bottom:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">The 3 Numbers That Matter Most</h2>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Hi {first_name},</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">When analysing any property deal, three numbers matter most:</p>

<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px;margin:20px 0;">
  <p style="color:#1e293b;font-size:15px;line-height:2;margin:0;">
    <strong>1. Purchase Price</strong> — What you're actually paying<br/>
    <strong>2. Monthly Rent</strong> — The realistic rental income<br/>
    <strong>3. Total Costs</strong> — Mortgage, insurance, maintenance, management, voids
  </p>
</div>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">If those don't make sense together, the deal doesn't make sense. That's why I included the <strong style="color:#1e293b;">Deal Analyser Spreadsheet</strong> in your Starter Pack.</p>

<p style="margin:24px 0;text-align:center;"><a href="{{cta_url}}" style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#d97706);color:#1e293b;font-weight:bold;padding:14px 28px;border-radius:12px;text-decoration:none;font-size:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Try the Free Calculator</a></p>

<p style="color:#1e293b;font-size:15px;font-weight:600;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Chris</p>`,
  },
  {
    step_number: 4,
    subject: 'How to Use the Deal Analyser (Step by Step)',
    delay_days: 2,
    delay_hours: 0,
    step_purpose: 'engage',
    cta_url: '/calculator',
    cta_label: 'Open the Calculator',
    sender_name: 'Chris Ifonlaja',
    sender_email: 'noreply@buildwealththroughproperty.com',
    summary: 'Walk through the Deal Analyser tool step-by-step to drive engagement',
    html_body: `<h2 style="color:#1e293b;font-size:22px;margin-bottom:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">How to Use the Deal Analyser</h2>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Hi {first_name},</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Here's how I use the Deal Analyser every time I look at a property:</p>

<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px;margin:20px 0;">
  <p style="color:#1e293b;font-size:15px;line-height:2;margin:0;">
    <strong>Step 1:</strong> Enter the purchase price<br/>
    <strong>Step 2:</strong> Enter expected rent<br/>
    <strong>Step 3:</strong> Add basic costs<br/>
    <strong>Step 4:</strong> Check net monthly cashflow
  </p>
</div>

<div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0;">
  <p style="color:#92400e;font-size:15px;line-height:1.7;margin:0;"><strong>The golden rule:</strong> Logic first — emotion last. Never fall in love with a property before the numbers make sense.</p>
</div>

<p style="margin:24px 0;text-align:center;"><a href="{{cta_url}}" style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#d97706);color:#1e293b;font-weight:bold;padding:14px 28px;border-radius:12px;text-decoration:none;font-size:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Open the Calculator</a></p>

<p style="color:#1e293b;font-size:15px;font-weight:600;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Chris</p>`,
  },
  {
    step_number: 5,
    subject: '5 Mistakes First-Time Property Investors Make',
    delay_days: 2,
    delay_hours: 0,
    step_purpose: 'educate',
    cta_url: '',
    cta_label: '',
    sender_name: 'Chris Ifonlaja',
    sender_email: 'noreply@buildwealththroughproperty.com',
    summary: 'Address common fears and mistakes to build trust and position the course as the solution',
    html_body: `<h2 style="color:#1e293b;font-size:22px;margin-bottom:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">5 Mistakes That Sink New Investors</h2>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Hi {first_name},</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">I've seen hundreds of new investors make the same errors. Here are the top five:</p>

<div style="background:#fef2f2;border-left:4px solid #ef4444;padding:16px 20px;border-radius:0 8px 8px 0;margin:12px 0;">
  <p style="color:#991b1b;font-size:15px;margin:0;"><strong>1. Buying based on emotion, not numbers</strong></p>
</div>
<div style="background:#fef2f2;border-left:4px solid #ef4444;padding:16px 20px;border-radius:0 8px 8px 0;margin:12px 0;">
  <p style="color:#991b1b;font-size:15px;margin:0;"><strong>2. Chasing yield without understanding risk</strong></p>
</div>
<div style="background:#fef2f2;border-left:4px solid #ef4444;padding:16px 20px;border-radius:0 8px 8px 0;margin:12px 0;">
  <p style="color:#991b1b;font-size:15px;margin:0;"><strong>3. Overleveraging in a rising market</strong></p>
</div>
<div style="background:#fef2f2;border-left:4px solid #ef4444;padding:16px 20px;border-radius:0 8px 8px 0;margin:12px 0;">
  <p style="color:#991b1b;font-size:15px;margin:0;"><strong>4. Ignoring hidden costs</strong></p>
</div>
<div style="background:#fef2f2;border-left:4px solid #ef4444;padding:16px 20px;border-radius:0 8px 8px 0;margin:12px 0;">
  <p style="color:#991b1b;font-size:15px;margin:0;"><strong>5. Treating property like a get-rich-quick scheme</strong></p>
</div>

<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin:24px 0;">
  <p style="color:#166534;font-size:15px;line-height:1.7;margin:0;"><strong>The good news?</strong> Every one of these mistakes is avoidable with the right knowledge. That's exactly what the step-by-step course is designed to help with.</p>
</div>

<p style="color:#1e293b;font-size:15px;font-weight:600;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Chris</p>`,
  },
  {
    step_number: 6,
    subject: 'How One Reader Bought Their First Buy-to-Let in 90 Days',
    delay_days: 2,
    delay_hours: 0,
    step_purpose: 'social-proof',
    cta_url: '',
    cta_label: '',
    sender_name: 'Chris Ifonlaja',
    sender_email: 'noreply@buildwealththroughproperty.com',
    summary: 'Social proof through a beginner success story to build belief',
    html_body: `<h2 style="color:#1e293b;font-size:22px;margin-bottom:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">From Zero to First Buy-to-Let in 90 Days</h2>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Hi {first_name},</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">I want to share a real story from someone who was exactly where you are now.</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">James had read the book, downloaded the Starter Pack, and used the calculator — but he still felt stuck. He didn't know the practical steps to actually get from "interested" to "keys in hand".</p>

<div style="background:#f0fdf4;border:1px solid #bbf7d0;padding:24px;border-radius:12px;margin:20px 0;">
  <p style="color:#166534;font-size:15px;line-height:1.8;margin:0;">
    <strong>Month 1:</strong> Completed the course, built his power team (broker, solicitor, accountant)<br/><br/>
    <strong>Month 2:</strong> Found and analysed 15 properties, made 3 offers<br/><br/>
    <strong>Month 3:</strong> Completed on a 2-bed terrace in Leeds — £850/month rent, £320 net cashflow
  </p>
</div>

<div style="background:#f8fafc;border:1px solid #e2e8f0;padding:20px;border-radius:12px;margin:20px 0;">
  <p style="color:#475569;font-size:15px;line-height:1.7;font-style:italic;margin:0 0 8px;">"The course gave me the step-by-step confidence I needed. I knew exactly what to do at each stage."</p>
  <p style="color:#1e293b;font-size:14px;font-weight:600;margin:0;">— James, Leeds</p>
</div>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">The key? He followed a structured, step-by-step process. No guesswork.</p>

<p style="color:#1e293b;font-size:15px;font-weight:600;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Chris</p>`,
  },
  {
    step_number: 7,
    subject: 'What Readers Are Saying About the Book',
    delay_days: 2,
    delay_hours: 0,
    step_purpose: 'social-proof',
    cta_url: '',
    cta_label: '',
    sender_name: 'Chris Ifonlaja',
    sender_email: 'noreply@buildwealththroughproperty.com',
    summary: 'Stack social proof with multiple testimonials before the course pitch',
    html_body: `<h2 style="color:#1e293b;font-size:22px;margin-bottom:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Don't Just Take My Word For It</h2>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Hi {first_name},</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Here's what other readers are saying:</p>

<div style="background:#f8fafc;border:1px solid #e2e8f0;padding:20px;border-radius:12px;margin:16px 0;">
  <p style="color:#475569;font-size:15px;line-height:1.7;font-style:italic;margin:0 0 8px;">"This book completely shifted my mindset. It helped me see property not just as a transaction, but as a long-term wealth strategy."</p>
  <p style="color:#1e293b;font-size:14px;font-weight:600;margin:0;">— Yomi</p>
</div>

<div style="background:#f8fafc;border:1px solid #e2e8f0;padding:20px;border-radius:12px;margin:16px 0;">
  <p style="color:#475569;font-size:15px;line-height:1.7;font-style:italic;margin:0 0 8px;">"The quiet confidence that comes from genuinely understanding what you're doing and why."</p>
  <p style="color:#1e293b;font-size:14px;font-weight:600;margin:0;">— Ekele</p>
</div>

<div style="background:#f8fafc;border:1px solid #e2e8f0;padding:20px;border-radius:12px;margin:16px 0;">
  <p style="color:#475569;font-size:15px;line-height:1.7;font-style:italic;margin:0 0 8px;">"I was overwhelmed by all the property information out there. This book cut through the noise and gave me a clear, structured plan."</p>
  <p style="color:#1e293b;font-size:14px;font-weight:600;margin:0;">— David, London</p>
</div>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">If you've been enjoying these emails and finding the Starter Pack useful, I have something exciting to share with you in my next email.</p>

<p style="color:#1e293b;font-size:15px;font-weight:600;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Chris</p>`,
  },
  {
    step_number: 8,
    subject: 'Your Step-by-Step Path to Your First Buy-to-Let (Course Launch)',
    delay_days: 3,
    delay_hours: 0,
    step_purpose: 'course-intro',
    cta_url: '/course',
    cta_label: 'View the Full Course',
    sender_name: 'Chris Ifonlaja',
    sender_email: 'noreply@buildwealththroughproperty.com',
    summary: 'Introduce the beginner course with full details and launch pricing',
    html_body: `<h2 style="color:#1e293b;font-size:22px;margin-bottom:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Ready to Take the Next Step?</h2>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Hi {first_name},</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">You've got the book. You've got the tools. Now it's time to put it all into action.</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">I've created <strong style="color:#1e293b;">From Book to Buy-to-Let</strong> — a step-by-step online course that takes you from understanding property to actually owning your first buy-to-let.</p>

<div style="background:linear-gradient(135deg,#1e293b,#334155);padding:28px;border-radius:16px;margin:24px 0;">
  <p style="color:#fbbf24;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;">What's Inside</p>
  <p style="color:#ffffff;font-size:20px;font-weight:bold;margin:0 0 16px;">From Book to Buy-to-Let</p>
  <p style="color:#cbd5e1;font-size:14px;line-height:2;margin:0;">
    &#10003; 6 structured modules + bonus content<br/>
    &#10003; Step-by-step from goals to keys in hand<br/>
    &#10003; Deal Analyser & viewing checklists<br/>
    &#10003; Mortgage comparison templates<br/>
    &#10003; Tenant referencing & landlord compliance guides<br/>
    &#10003; Live deal walkthrough recordings
  </p>
</div>

<div style="background:linear-gradient(135deg,#059669,#047857);padding:24px;border-radius:16px;margin:24px 0;text-align:center;">
  <p style="color:#a7f3d0;font-size:14px;margin:0 0 4px;">Launch Price</p>
  <p style="color:#ffffff;font-size:14px;margin:0 0 8px;"><span style="text-decoration:line-through;opacity:0.6;">£147</span></p>
  <p style="color:#ffffff;font-size:36px;font-weight:bold;margin:0 0 8px;">£97</p>
  <p style="display:inline-block;background:#fbbf24;color:#1e293b;padding:4px 12px;border-radius:6px;font-size:12px;font-weight:bold;margin:0;">SAVE £50 — LAUNCH PRICE</p>
</div>

<p style="margin:24px 0;text-align:center;"><a href="{{cta_url}}" style="display:inline-block;background:linear-gradient(135deg,#059669,#047857);color:#ffffff;font-weight:bold;padding:18px 36px;border-radius:12px;text-decoration:none;font-size:18px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">View the Full Course</a></p>

<p style="color:#475569;font-size:14px;line-height:1.8;text-align:center;">30-day money-back guarantee. No questions asked.</p>

<p style="color:#1e293b;font-size:15px;font-weight:600;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Chris</p>`,
  },
  {
    step_number: 9,
    subject: 'Inside the Course: Full Module Breakdown',
    delay_days: 2,
    delay_hours: 0,
    step_purpose: 'course-details',
    cta_url: '/course',
    cta_label: 'Enrol Now — Launch Price',
    sender_name: 'Chris Ifonlaja',
    sender_email: 'noreply@buildwealththroughproperty.com',
    summary: 'Detailed module breakdown to show the depth and value of the course',
    html_body: `<h2 style="color:#1e293b;font-size:22px;margin-bottom:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Here's Exactly What You'll Learn</h2>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Hi {first_name},</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Here's the full breakdown of <strong style="color:#1e293b;">From Book to Buy-to-Let</strong>:</p>

<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px;margin:20px 0;">
  <p style="color:#1e293b;font-size:15px;line-height:2.2;margin:0;">
    <strong style="color:#6366f1;">Module 1:</strong> Getting Started the Right Way<br/>
    <strong style="color:#a855f7;">Module 2:</strong> Understanding the Numbers<br/>
    <strong style="color:#10b981;">Module 3:</strong> Finding the Right Property<br/>
    <strong style="color:#f59e0b;">Module 4:</strong> Financing Your Investment<br/>
    <strong style="color:#f43f5e;">Module 5:</strong> Making Offers and Closing Deals<br/>
    <strong style="color:#06b6d4;">Module 6:</strong> Becoming a Landlord<br/>
    <strong style="color:#8b5cf6;">Bonus:</strong> Live Deal Walkthrough + Q&A
  </p>
</div>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Each module includes practical templates, checklists, and real examples you can use immediately.</p>

<p style="margin:24px 0;text-align:center;"><a href="{{cta_url}}" style="display:inline-block;background:linear-gradient(135deg,#059669,#047857);color:#ffffff;font-weight:bold;padding:18px 36px;border-radius:12px;text-decoration:none;font-size:18px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Enrol Now — Launch Price £97</a></p>

<p style="color:#1e293b;font-size:15px;font-weight:600;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Chris</p>`,
  },
  {
    step_number: 10,
    subject: 'Last Chance: Launch Price Ending Soon',
    delay_days: 4,
    delay_hours: 0,
    step_purpose: 'hard-close',
    cta_url: '/course',
    cta_label: 'Enrol Now — Save £50',
    sender_name: 'Chris Ifonlaja',
    sender_email: 'noreply@buildwealththroughproperty.com',
    summary: 'Final urgency-driven close with the beginner course at £97 launch price',
    html_body: `<h2 style="color:#1e293b;font-size:22px;margin-bottom:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">This Is Your Moment</h2>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Hi {first_name},</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Over the past 3 weeks, you've learned the fundamentals. Now it's time to take action.</p>

<div style="background:#fef2f2;border:1px solid #fecaca;padding:24px;border-radius:12px;margin:24px 0;text-align:center;">
  <p style="color:#dc2626;font-size:18px;font-weight:bold;margin:0 0 8px;">The launch price ends soon.</p>
  <p style="color:#991b1b;font-size:14px;margin:0;">After that, the course returns to full price (£147).</p>
</div>

<div style="background:linear-gradient(135deg,#1e293b,#334155);padding:28px;border-radius:16px;margin:24px 0;">
  <p style="color:#fbbf24;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;">Everything You Get</p>
  <p style="color:#e2e8f0;font-size:14px;line-height:2;margin:0 0 16px;">
    &#10003; 6 modules + bonus content<br/>
    &#10003; Step-by-step from goals to keys in hand<br/>
    &#10003; All templates, checklists, and spreadsheets<br/>
    &#10003; Live deal walkthrough recordings<br/>
    &#10003; Lifetime access to all materials
  </p>
  <div style="text-align:center;padding-top:16px;border-top:1px solid #475569;">
    <p style="color:#94a3b8;font-size:14px;margin:0 0 4px;"><span style="text-decoration:line-through;">£147</span></p>
    <p style="color:#ffffff;font-size:40px;font-weight:bold;margin:0 0 8px;">£97</p>
    <p style="display:inline-block;background:#fbbf24;color:#1e293b;padding:4px 12px;border-radius:6px;font-size:12px;font-weight:bold;">LAUNCH PRICE — SAVE £50</p>
  </div>
</div>

<p style="margin:28px 0;text-align:center;"><a href="{{cta_url}}" style="display:inline-block;background:linear-gradient(135deg,#dc2626,#b91c1c);color:#ffffff;font-weight:bold;padding:20px 40px;border-radius:12px;text-decoration:none;font-size:20px;box-shadow:0 4px 14px rgba(220,38,38,0.4);">Enrol Now — Save £50</a></p>

<p style="color:#475569;font-size:14px;line-height:1.8;text-align:center;">30-day money-back guarantee. No questions asked.</p>

<div style="border-top:1px solid #e2e8f0;margin-top:32px;padding-top:20px;">
  <p style="color:#475569;font-size:15px;line-height:1.8;">Whatever you decide, thank you for being part of this community. If you're serious about buying your first property — this is the most structured way to start.</p>
  <p style="color:#1e293b;font-size:15px;font-weight:600;">Chris Ifonlaja</p>
</div>`,
  },
];


// ═══════════════════════════════════════════════════════════
// TEMPLATE 3: UPSELL — BTL Alumni → Masterclass (£247 Alumni Price)
// ═══════════════════════════════════════════════════════════

const UPSELL_FUNNEL_EMAILS: FunnelEmailDefinition[] = [
  {
    step_number: 1,
    subject: 'Congratulations — You Completed From Book to Buy-to-Let!',
    delay_days: 0,
    delay_hours: 0,
    step_purpose: 'congratulate',
    cta_url: '',
    cta_label: '',
    sender_name: 'Chris Ifonlaja',
    sender_email: 'noreply@buildwealththroughproperty.com',
    summary: 'Celebrate course completion, acknowledge their progress, and set up the next stage',
    html_body: `<h2 style="color:#1e293b;font-size:22px;margin-bottom:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">You Did It. Well Done.</h2>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Hi {first_name},</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">I wanted to personally congratulate you on completing <strong style="color:#1e293b;">From Book to Buy-to-Let</strong>.</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Most people never take the first step. You've taken several. That puts you ahead of 95% of aspiring property investors.</p>

<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:24px;margin:20px 0;">
  <p style="color:#166534;font-size:15px;line-height:1.8;margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <strong>What you've achieved:</strong><br/>
    &#10003; Understood the 7 reasons property builds wealth<br/>
    &#10003; Mastered the Deal Analyser and key numbers<br/>
    &#10003; Learned to find, finance, and close your first BTL<br/>
    &#10003; Built a foundation for long-term wealth
  </p>
</div>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Over the next couple of weeks, I'll share some advanced strategies and real case studies from investors who started exactly where you are now — and scaled to multi-property portfolios.</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">No pressure. Just the next level — when you're ready.</p>

<p style="color:#1e293b;font-size:15px;font-weight:600;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Chris</p>`,
  },
  {
    step_number: 2,
    subject: 'From 1 Property to 5: The Portfolio Scaling Strategy',
    delay_days: 3,
    delay_hours: 0,
    step_purpose: 'advanced-educate',
    cta_url: '',
    cta_label: '',
    sender_name: 'Chris Ifonlaja',
    sender_email: 'noreply@buildwealththroughproperty.com',
    summary: 'Teach advanced portfolio scaling — BRRRR, refinancing, equity recycling',
    html_body: `<h2 style="color:#1e293b;font-size:22px;margin-bottom:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">The Strategy That Turns 1 Property Into 5</h2>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Hi {first_name},</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Now that you understand the fundamentals, let me show you what separates single-property owners from portfolio builders.</p>

<div style="background:#eff6ff;border-left:4px solid #3b82f6;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0;">
  <p style="color:#1e40af;font-size:16px;font-weight:600;line-height:1.7;margin:0;">The key isn't more money. It's understanding how to recycle equity.</p>
</div>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Here are the three advanced strategies that experienced investors use:</p>

<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px;margin:20px 0;">
  <div style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid #e2e8f0;">
    <p style="color:#6366f1;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">Strategy 1: BRRRR</p>
    <p style="color:#1e293b;font-size:15px;font-weight:600;margin:0;">Buy, Refurbish, Rent, Refinance, Repeat</p>
    <p style="color:#64748b;font-size:14px;margin:4px 0 0;">Buy below market value, add value through refurbishment, refinance to pull your deposit back out, then repeat with the same capital.</p>
  </div>
  <div style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid #e2e8f0;">
    <p style="color:#a855f7;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">Strategy 2: Equity Release</p>
    <p style="color:#1e293b;font-size:15px;font-weight:600;margin:0;">Leverage Appreciation for New Deposits</p>
    <p style="color:#64748b;font-size:14px;margin:4px 0 0;">As your properties appreciate, remortgage to release equity and use it as deposits for new acquisitions.</p>
  </div>
  <div>
    <p style="color:#10b981;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">Strategy 3: Ltd Company Structure</p>
    <p style="color:#1e293b;font-size:15px;font-weight:600;margin:0;">Tax-Efficient Portfolio Growth</p>
    <p style="color:#64748b;font-size:14px;margin:4px 0 0;">At scale, a limited company structure can offer significant tax advantages — especially with the Section 24 mortgage interest changes.</p>
  </div>
</div>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">These aren't beginner concepts. They're the strategies that separate casual investors from serious portfolio builders.</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">In my next email, I'll share a real case study of someone who used these exact strategies.</p>

<p style="color:#1e293b;font-size:15px;font-weight:600;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Chris</p>`,
  },
  {
    step_number: 3,
    subject: 'Case Study: From 1 BTL to a £1.2M Portfolio in 3 Years',
    delay_days: 3,
    delay_hours: 0,
    step_purpose: 'case-study',
    cta_url: '',
    cta_label: '',
    sender_name: 'Chris Ifonlaja',
    sender_email: 'noreply@buildwealththroughproperty.com',
    summary: 'Real portfolio growth case study from a BTL course graduate who scaled up',
    html_body: `<h2 style="color:#1e293b;font-size:22px;margin-bottom:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">How Marcus Built a £1.2M Portfolio</h2>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Hi {first_name},</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Marcus completed the beginner course two years ago — just like you. He bought his first BTL within 90 days. But he didn't stop there.</p>

<div style="background:linear-gradient(135deg,#1e293b,#334155);padding:28px;border-radius:16px;margin:24px 0;">
  <p style="color:#fbbf24;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;margin:0 0 16px;">Marcus's Journey</p>
  <div style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid #475569;">
    <p style="color:#94a3b8;font-size:12px;font-weight:bold;text-transform:uppercase;margin:0 0 4px;">Year 1</p>
    <p style="color:#ffffff;font-size:15px;line-height:1.7;margin:0;">Bought first BTL in Birmingham for £115K. Used BRRRR strategy — refurbished for £12K, revalued at £155K. Pulled original deposit back out.</p>
  </div>
  <div style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid #475569;">
    <p style="color:#94a3b8;font-size:12px;font-weight:bold;text-transform:uppercase;margin:0 0 4px;">Year 2</p>
    <p style="color:#ffffff;font-size:15px;line-height:1.7;margin:0;">Used recycled equity to buy properties #2 and #3. Moved to a limited company structure. Portfolio value: £420K. Net monthly cashflow: £1,200.</p>
  </div>
  <div>
    <p style="color:#94a3b8;font-size:12px;font-weight:bold;text-transform:uppercase;margin:0 0 4px;">Year 3</p>
    <p style="color:#ffffff;font-size:15px;line-height:1.7;margin:0;">Converted one property to an HMO (6 rooms). Bought property #4. Portfolio value: £1.2M. Net monthly cashflow: £3,800. All while keeping his day job.</p>
  </div>
</div>

<div style="background:#f8fafc;border:1px solid #e2e8f0;padding:20px;border-radius:12px;margin:20px 0;">
  <p style="color:#475569;font-size:15px;line-height:1.7;font-style:italic;margin:0 0 8px;">"The beginner course got me started. The Masterclass showed me how to scale. The BRRRR module alone paid for the course ten times over."</p>
  <p style="color:#1e293b;font-size:14px;font-weight:600;margin:0;">— Marcus, Birmingham</p>
</div>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">The difference between Marcus and most investors? He invested in learning the advanced strategies before trying to scale.</p>

<p style="color:#1e293b;font-size:15px;font-weight:600;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Chris</p>`,
  },
  {
    step_number: 4,
    subject: 'HMOs, Commercial Conversions & Advanced Structures',
    delay_days: 3,
    delay_hours: 0,
    step_purpose: 'advanced-educate',
    cta_url: '',
    cta_label: '',
    sender_name: 'Chris Ifonlaja',
    sender_email: 'noreply@buildwealththroughproperty.com',
    summary: 'Introduce advanced property strategies — HMOs, conversions, limited companies',
    html_body: `<h2 style="color:#1e293b;font-size:22px;margin-bottom:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Beyond Single BTLs: Advanced Strategies</h2>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Hi {first_name},</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Single buy-to-lets are a great foundation. But the real wealth acceleration happens when you understand these advanced strategies:</p>

<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px;margin:20px 0;">
  <div style="margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid #e2e8f0;">
    <p style="color:#8b5cf6;font-size:14px;font-weight:bold;margin:0 0 6px;">Houses in Multiple Occupation (HMOs)</p>
    <p style="color:#475569;font-size:14px;line-height:1.7;margin:0;">A single property rented room-by-room can generate 2-3x the cashflow of a standard BTL. A 5-bed HMO in Manchester might generate £2,500/month vs £850 as a single let.</p>
  </div>
  <div style="margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid #e2e8f0;">
    <p style="color:#06b6d4;font-size:14px;font-weight:bold;margin:0 0 6px;">Commercial-to-Residential Conversions</p>
    <p style="color:#475569;font-size:14px;line-height:1.7;margin:0;">Converting offices or shops to flats under Permitted Development Rights. Often no planning permission needed. Massive value uplift potential.</p>
  </div>
  <div style="margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid #e2e8f0;">
    <p style="color:#f59e0b;font-size:14px;font-weight:bold;margin:0 0 6px;">Limited Company Structures</p>
    <p style="color:#475569;font-size:14px;line-height:1.7;margin:0;">Corporation tax at 25% vs up to 45% personal tax. Full mortgage interest relief. Better for scaling beyond 3-4 properties.</p>
  </div>
  <div>
    <p style="color:#10b981;font-size:14px;font-weight:bold;margin:0 0 6px;">Serviced Accommodation</p>
    <p style="color:#475569;font-size:14px;line-height:1.7;margin:0;">Short-term lets through Airbnb or Booking.com. Higher returns but more management. Can work brilliantly in the right locations.</p>
  </div>
</div>

<div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0;">
  <p style="color:#92400e;font-size:15px;line-height:1.7;margin:0;"><strong>Important:</strong> These strategies require deeper knowledge and more careful execution. Getting them wrong can be costly. Getting them right can be transformational.</p>
</div>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">In my next email, I'll share another case study — this time from someone who converted a single BTL into an HMO and tripled their cashflow.</p>

<p style="color:#1e293b;font-size:15px;font-weight:600;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Chris</p>`,
  },
  {
    step_number: 5,
    subject: 'Case Study: How Priya Tripled Her Cashflow With One Conversion',
    delay_days: 3,
    delay_hours: 0,
    step_purpose: 'case-study',
    cta_url: '',
    cta_label: '',
    sender_name: 'Chris Ifonlaja',
    sender_email: 'noreply@buildwealththroughproperty.com',
    summary: 'Second case study — HMO conversion success from a BTL course alumni',
    html_body: `<h2 style="color:#1e293b;font-size:22px;margin-bottom:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">From £650/Month to £2,100/Month — Same Property</h2>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Hi {first_name},</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Priya completed the beginner course 18 months ago. She bought a 4-bed house in Nottingham as a standard BTL, renting it for £650/month.</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">After learning about HMO strategies in the Masterclass, she made one decision that changed everything:</p>

<div style="background:linear-gradient(135deg,#1e293b,#334155);padding:28px;border-radius:16px;margin:24px 0;">
  <p style="color:#fbbf24;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;margin:0 0 16px;">The Conversion</p>
  <div style="display:flex;gap:16px;margin-bottom:16px;">
    <div style="flex:1;background:#334155;border-radius:12px;padding:16px;text-align:center;">
      <p style="color:#94a3b8;font-size:11px;text-transform:uppercase;margin:0 0 4px;">Before (Single Let)</p>
      <p style="color:#ffffff;font-size:28px;font-weight:bold;margin:0;">£650</p>
      <p style="color:#94a3b8;font-size:12px;margin:0;">per month</p>
    </div>
    <div style="flex:1;background:#065f46;border-radius:12px;padding:16px;text-align:center;">
      <p style="color:#a7f3d0;font-size:11px;text-transform:uppercase;margin:0 0 4px;">After (5-Room HMO)</p>
      <p style="color:#ffffff;font-size:28px;font-weight:bold;margin:0;">£2,100</p>
      <p style="color:#a7f3d0;font-size:12px;margin:0;">per month</p>
    </div>
  </div>
  <p style="color:#cbd5e1;font-size:14px;line-height:1.7;margin:0;">Conversion cost: £18K. Added an en-suite to the master, converted the dining room to a 5th bedroom. Net cashflow went from £180/month to £1,350/month after all costs.</p>
</div>

<div style="background:#f8fafc;border:1px solid #e2e8f0;padding:20px;border-radius:12px;margin:20px 0;">
  <p style="color:#475569;font-size:15px;line-height:1.7;font-style:italic;margin:0 0 8px;">"I would never have attempted the HMO conversion without the Masterclass. The compliance module alone saved me from making a £15K licensing mistake."</p>
  <p style="color:#1e293b;font-size:14px;font-weight:600;margin:0;">— Priya, Nottingham</p>
</div>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">This is what advanced knowledge looks like in practice. Same property. Same location. Completely different returns.</p>

<p style="color:#1e293b;font-size:15px;font-weight:600;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Chris</p>`,
  },
  {
    step_number: 6,
    subject: 'Your Exclusive Alumni Invitation: Property Investor Masterclass (Save £50)',
    delay_days: 3,
    delay_hours: 0,
    step_purpose: 'alumni-offer',
    cta_url: '/masterclass',
    cta_label: 'View the Masterclass — Alumni Price',
    sender_name: 'Chris Ifonlaja',
    sender_email: 'noreply@buildwealththroughproperty.com',
    summary: 'Introduce the Masterclass with exclusive alumni discount — £247 instead of £297',
    html_body: `<h2 style="color:#1e293b;font-size:22px;margin-bottom:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">You've Earned This: Your Alumni Invitation</h2>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Hi {first_name},</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Over the past two weeks, I've shared advanced strategies and real case studies of investors who scaled from their first BTL to multi-property portfolios.</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">If you're serious about scaling beyond your first property, I'd like to offer you something exclusive.</p>

<div style="background:linear-gradient(135deg,#1e293b,#334155);padding:28px;border-radius:16px;margin:24px 0;">
  <p style="color:#fbbf24;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;">What's Inside</p>
  <p style="color:#ffffff;font-size:20px;font-weight:bold;margin:0 0 16px;">Property Investor Masterclass</p>
  <p style="color:#cbd5e1;font-size:14px;line-height:2;margin:0;">
    &#10003; 12 in-depth video modules (8+ hours)<br/>
    &#10003; BRRRR strategy deep-dive with live examples<br/>
    &#10003; HMO conversion blueprint + compliance guide<br/>
    &#10003; Limited company setup & tax planning<br/>
    &#10003; Portfolio scaling from 1 to 10+ properties<br/>
    &#10003; Deal analysis at scale — multi-property modelling<br/>
    &#10003; Private investor community access<br/>
    &#10003; Monthly Q&A calls with Chris
  </p>
</div>

<div style="background:linear-gradient(135deg,#7c3aed,#a855f7);padding:24px;border-radius:16px;margin:24px 0;text-align:center;">
  <p style="color:#e9d5ff;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;margin:0 0 4px;">BTL Alumni Exclusive</p>
  <p style="color:#ffffff;font-size:14px;margin:0 0 4px;"><span style="text-decoration:line-through;opacity:0.6;">£297</span></p>
  <p style="color:#ffffff;font-size:40px;font-weight:bold;margin:0 0 8px;">£247</p>
  <p style="display:inline-block;background:#fbbf24;color:#1e293b;padding:6px 16px;border-radius:8px;font-size:13px;font-weight:bold;margin:0;">SAVE £50 — ALUMNI DISCOUNT</p>
  <p style="color:#e9d5ff;font-size:12px;margin:8px 0 0;">This price is not available to the general public.</p>
</div>

<p style="margin:24px 0;text-align:center;"><a href="{{cta_url}}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#ffffff;font-weight:bold;padding:18px 36px;border-radius:12px;text-decoration:none;font-size:18px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">View the Masterclass — Alumni Price</a></p>

<p style="color:#475569;font-size:14px;line-height:1.8;text-align:center;">30-day money-back guarantee. No questions asked.</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">You've already proven you're serious about property investing. This is the natural next step.</p>

<p style="color:#1e293b;font-size:15px;font-weight:600;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Chris</p>`,
  },
  {
    step_number: 7,
    subject: 'Final Reminder: Your Alumni Discount Expires Soon',
    delay_days: 4,
    delay_hours: 0,
    step_purpose: 'alumni-close',
    cta_url: '/masterclass',
    cta_label: 'Enrol Now — Save £50 (Alumni Only)',
    sender_name: 'Chris Ifonlaja',
    sender_email: 'noreply@buildwealththroughproperty.com',
    summary: 'Final close with urgency — alumni discount expiring, full course breakdown',
    html_body: `<h2 style="color:#1e293b;font-size:22px;margin-bottom:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Last Chance: Your Alumni Price Expires Soon</h2>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Hi {first_name},</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">This is my final email about the Property Investor Masterclass alumni offer.</p>

<div style="background:#fef2f2;border:1px solid #fecaca;padding:24px;border-radius:12px;margin:24px 0;text-align:center;">
  <p style="color:#dc2626;font-size:18px;font-weight:bold;margin:0 0 8px;">Your £247 alumni price expires soon.</p>
  <p style="color:#991b1b;font-size:14px;margin:0;">After that, the Masterclass is only available at £297 (reader price) or £397 (full price).</p>
</div>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Let me be direct about what's at stake:</p>

<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin:20px 0;">
  <p style="color:#1e293b;font-size:15px;line-height:2;margin:0;">
    <strong>Without advanced knowledge:</strong><br/>
    &#8226; You stay at 1-2 properties, growing slowly<br/>
    &#8226; You miss BRRRR opportunities that recycle your capital<br/>
    &#8226; You overpay tax without a limited company structure<br/>
    &#8226; You leave HMO cashflow on the table<br/><br/>
    <strong>With the Masterclass:</strong><br/>
    &#10003; Scale to 5-10+ properties using proven strategies<br/>
    &#10003; Recycle deposits through BRRRR and refinancing<br/>
    &#10003; Set up tax-efficient structures from the start<br/>
    &#10003; Convert single lets to HMOs for 2-3x cashflow<br/>
    &#10003; Join a community of serious investors
  </p>
</div>

<div style="background:linear-gradient(135deg,#1e293b,#334155);padding:28px;border-radius:16px;margin:24px 0;text-align:center;">
  <p style="color:#e9d5ff;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;">BTL Alumni Exclusive — Final Offer</p>
  <p style="color:#94a3b8;font-size:14px;margin:0 0 4px;"><span style="text-decoration:line-through;">£297</span></p>
  <p style="color:#ffffff;font-size:44px;font-weight:bold;margin:0 0 8px;">£247</p>
  <p style="display:inline-block;background:#fbbf24;color:#1e293b;padding:6px 16px;border-radius:8px;font-size:13px;font-weight:bold;">ALUMNI ONLY — SAVE £50</p>
</div>

<p style="margin:28px 0;text-align:center;"><a href="{{cta_url}}" style="display:inline-block;background:linear-gradient(135deg,#dc2626,#b91c1c);color:#ffffff;font-weight:bold;padding:20px 40px;border-radius:12px;text-decoration:none;font-size:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;box-shadow:0 4px 14px rgba(220,38,38,0.4);">Enrol Now — Save £50 (Alumni Only)</a></p>

<p style="color:#475569;font-size:14px;line-height:1.8;text-align:center;">30-day money-back guarantee. No questions asked.</p>

<div style="border-top:1px solid #e2e8f0;margin-top:32px;padding-top:20px;">
  <p style="color:#475569;font-size:15px;line-height:1.8;">Whatever you decide, I'm proud of what you've achieved with the beginner course. You're already ahead of most people.</p>
  <p style="color:#475569;font-size:15px;line-height:1.8;">But if you're ready to go from first property to a real portfolio — this is the most structured, proven way to do it.</p>
  <p style="color:#1e293b;font-size:15px;font-weight:600;">Chris Ifonlaja</p>
</div>`,
  },
];


// ═══════════════════════════════════════════════════════════
// COURSE FUNNEL TEMPLATES ARRAY
// ═══════════════════════════════════════════════════════════

export const COURSE_FUNNEL_TEMPLATES: CourseFunnelTemplate[] = [
  {
    courseId: 'beginner-course',
    courseName: 'From Book to Buy-to-Let',
    coursePrice: '£97',
    courseFullPrice: '£147',
    courseDiscount: '£50',
    funnelName: 'Book Reader → From Book to Buy-to-Let',
    funnelDescription: '10-email automated sequence: Starter Pack delivery → Education → Social proof → Course conversion at £97 (launch price, rising to £147)',
    funnelTrigger: 'signup',
    funnelFilter: 'all_active',
    color: 'from-emerald-400 to-emerald-600',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    tier: 'primary',
    pipelineStages: [
      { label: 'Starter Pack', sublabel: 'Lead Capture', color: 'from-emerald-400 to-emerald-600', icon: 'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
      { label: 'Email Nurture', sublabel: '10 Emails / 21 Days', color: 'from-blue-400 to-blue-600', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
      { label: 'Build Trust', sublabel: 'Case Studies + Tools', color: 'from-amber-400 to-amber-600', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
      { label: 'BTL Course', sublabel: '£97 Course Sale', color: 'from-emerald-400 to-emerald-600', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    ],
    emails: BEGINNER_FUNNEL_EMAILS,
  },
  {
    courseId: 'masterclass',
    courseName: 'Property Investor Masterclass',
    coursePrice: '£297',
    courseFullPrice: '£397',
    courseDiscount: '£100',
    funnelName: 'Book Reader → Property Investor Masterclass',
    funnelDescription: '10-email automated sequence: Starter Pack delivery → Education → Social proof → Masterclass conversion at £297 (reader price, rising to £397)',
    funnelTrigger: 'signup',
    funnelFilter: 'all_active',
    color: 'from-purple-400 to-purple-600',
    icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
    tier: 'primary',
    pipelineStages: [
      { label: 'Starter Pack', sublabel: 'Lead Capture', color: 'from-emerald-400 to-emerald-600', icon: 'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
      { label: 'Email Nurture', sublabel: '10 Emails / 22 Days', color: 'from-blue-400 to-blue-600', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
      { label: 'Build Trust', sublabel: 'Case Studies + Tools', color: 'from-amber-400 to-amber-600', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
      { label: 'Masterclass', sublabel: '£297 Course Sale', color: 'from-purple-400 to-purple-600', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
    ],
    emails: MASTERCLASS_FUNNEL_EMAILS,
  },
  {
    courseId: 'masterclass-upsell',
    courseName: 'Masterclass Alumni Upsell',
    coursePrice: '£247',
    courseFullPrice: '£297',
    courseDiscount: '£50',
    funnelName: 'BTL Alumni → Masterclass Upsell',
    funnelDescription: '7-email upsell sequence: Congratulate BTL completion → Advanced strategies → Portfolio case studies → Masterclass at £247 alumni price (saves £50 vs reader price)',
    funnelTrigger: 'funnel_completed',
    funnelFilter: 'all_active',
    color: 'from-fuchsia-400 to-fuchsia-600',
    icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    tier: 'upsell',
    chainFromCourseId: 'beginner-course',
    pipelineStages: [
      { label: 'BTL Complete', sublabel: 'Auto-Enrolled', color: 'from-teal-400 to-teal-600', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
      { label: 'Advanced Ed', sublabel: 'Scaling + HMOs', color: 'from-cyan-400 to-cyan-600', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
      { label: 'Case Studies', sublabel: 'Portfolio Growth', color: 'from-violet-400 to-violet-600', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
      { label: 'Masterclass', sublabel: '£247 Alumni Price', color: 'from-fuchsia-400 to-fuchsia-600', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    ],
    emails: UPSELL_FUNNEL_EMAILS,
  },
];

// Helper to get template by course ID
export const getFunnelTemplateByCourseId = (courseId: string): CourseFunnelTemplate | undefined => {
  return COURSE_FUNNEL_TEMPLATES.find(t => t.courseId === courseId);
};

// Get primary templates only (for initial funnel creation)
export const getPrimaryFunnelTemplates = () => {
  return COURSE_FUNNEL_TEMPLATES.filter(t => t.tier === 'primary');
};

// Get upsell templates only
export const getUpsellFunnelTemplates = () => {
  return COURSE_FUNNEL_TEMPLATES.filter(t => t.tier === 'upsell');
};

// Get all email templates from all courses (for step editor)
export const getAllFunnelEmailTemplates = () => {
  return COURSE_FUNNEL_TEMPLATES.flatMap(template => 
    template.emails.map(email => ({
      ...email,
      courseId: template.courseId,
      courseName: template.courseName,
    }))
  );
};

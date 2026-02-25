// Book Reader → From Book to Buy-to-Let Course: Complete 10-email automated funnel sequence
// Journey: Reader downloads Starter Pack → receives 10 emails over 22 days → buys course at £97 (launch) / £147 (full price)


export interface FunnelEmailDefinition {
  step_number: number;
  subject: string;
  delay_days: number;
  delay_hours: number;
  step_purpose: string;
  cta_url: string;
  cta_label: string;
  sender_name: string;
  sender_email: string;
  html_body: string;
  summary: string;
}

export const FUNNEL_NAME = 'Book Reader → From Book to Buy-to-Let';
export const FUNNEL_DESCRIPTION = '10-email automated sequence: Starter Pack delivery → Education → Social proof → Course conversion at £97 (launch price, rising to £147)';

export const FUNNEL_TRIGGER = 'signup';
export const FUNNEL_FILTER = 'all_active';

export const MASTERCLASS_FUNNEL_EMAILS: FunnelEmailDefinition[] = [
  // ═══════════════════════════════════════════════════════════
  // EMAIL 1: Welcome + Starter Pack Delivery (Day 0)
  // ═══════════════════════════════════════════════════════════
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

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Hi {{First Name}},</p>

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

  // ═══════════════════════════════════════════════════════════
  // EMAIL 2: Why I Wrote the Book (Day 2)
  // ═══════════════════════════════════════════════════════════
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

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Hi {{First Name}},</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">I didn't write this book to push hype or shortcuts.</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">I wrote it because I realised property can build long-term financial security for ordinary people — <strong style="color:#1e293b;">if they understand the principles behind it</strong>.</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Too many people get into property investing based on social media hype, unrealistic promises, or pressure from "gurus" selling expensive courses with no substance.</p>

<div style="background:#eff6ff;border-left:4px solid #3b82f6;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0;">
  <p style="color:#1e40af;font-size:15px;line-height:1.7;margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">My goal is simple: help you make smarter, safer property decisions — based on real principles, not hype.</p>
</div>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">The 7 reasons I outline in the book aren't theories. They're the fundamental forces that have made property the most reliable wealth-building vehicle for generations.</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">In my next email, I'll share the 3 numbers that every property investor must know before making any deal.</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Speak soon,</p>
<p style="color:#1e293b;font-size:15px;font-weight:600;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Chris</p>`,
  },

  // ═══════════════════════════════════════════════════════════
  // EMAIL 3: The 3 Numbers Every Investor Must Know (Day 4)
  // ═══════════════════════════════════════════════════════════
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

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Hi {{First Name}},</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">When analysing any property deal, three numbers matter most:</p>

<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px;margin:20px 0;">
  <table cellpadding="0" cellspacing="0" style="width:100%;">
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;">
        <span style="display:inline-block;width:32px;height:32px;background:linear-gradient(135deg,#f59e0b,#d97706);border-radius:8px;text-align:center;line-height:32px;color:#1e293b;font-weight:bold;font-size:14px;margin-right:12px;">1</span>
        <strong style="color:#1e293b;font-size:16px;">Purchase Price</strong>
        <p style="color:#64748b;font-size:14px;margin:4px 0 0 44px;">What you're actually paying for the property</p>
      </td>
    </tr>
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;">
        <span style="display:inline-block;width:32px;height:32px;background:linear-gradient(135deg,#f59e0b,#d97706);border-radius:8px;text-align:center;line-height:32px;color:#1e293b;font-weight:bold;font-size:14px;margin-right:12px;">2</span>
        <strong style="color:#1e293b;font-size:16px;">Monthly Rent</strong>
        <p style="color:#64748b;font-size:14px;margin:4px 0 0 44px;">The realistic rental income you can expect</p>
      </td>
    </tr>
    <tr>
      <td style="padding:12px 0;">
        <span style="display:inline-block;width:32px;height:32px;background:linear-gradient(135deg,#f59e0b,#d97706);border-radius:8px;text-align:center;line-height:32px;color:#1e293b;font-weight:bold;font-size:14px;margin-right:12px;">3</span>
        <strong style="color:#1e293b;font-size:16px;">Total Costs</strong>
        <p style="color:#64748b;font-size:14px;margin:4px 0 0 44px;">Mortgage, insurance, maintenance, management, voids</p>
      </td>
    </tr>
  </table>
</div>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">If those don't make sense together, the deal doesn't make sense. It's that simple.</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">That's why I included the <strong style="color:#1e293b;">Deal Analyser Spreadsheet</strong> in your Starter Pack. Use it before you get emotional about any property.</p>

<p style="margin:24px 0;text-align:center;"><a href="{{cta_url}}" style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#d97706);color:#1e293b;font-weight:bold;padding:14px 28px;border-radius:12px;text-decoration:none;font-size:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Try the Free Calculator</a></p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Chris</p>`,
  },

  // ═══════════════════════════════════════════════════════════
  // EMAIL 4: How to Use the Deal Analyser (Day 6)
  // ═══════════════════════════════════════════════════════════
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

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Hi {{First Name}},</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Here's how I use the Deal Analyser every time I look at a property:</p>

<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px;margin:20px 0;">
  <div style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid #e2e8f0;">
    <p style="color:#f59e0b;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">Step 1</p>
    <p style="color:#1e293b;font-size:15px;font-weight:600;margin:0;">Enter the purchase price</p>
    <p style="color:#64748b;font-size:14px;margin:4px 0 0;">Use the asking price or your intended offer amount</p>
  </div>
  <div style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid #e2e8f0;">
    <p style="color:#f59e0b;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">Step 2</p>
    <p style="color:#1e293b;font-size:15px;font-weight:600;margin:0;">Enter expected rent</p>
    <p style="color:#64748b;font-size:14px;margin:4px 0 0;">Check Rightmove or OpenRent for comparable rents in the area</p>
  </div>
  <div style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid #e2e8f0;">
    <p style="color:#f59e0b;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">Step 3</p>
    <p style="color:#1e293b;font-size:15px;font-weight:600;margin:0;">Add basic costs</p>
    <p style="color:#64748b;font-size:14px;margin:4px 0 0;">Mortgage payment, insurance, maintenance allowance, management fees</p>
  </div>
  <div>
    <p style="color:#f59e0b;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">Step 4</p>
    <p style="color:#1e293b;font-size:15px;font-weight:600;margin:0;">Check net monthly cashflow</p>
    <p style="color:#64748b;font-size:14px;margin:4px 0 0;">This is your real profit — the number that matters</p>
  </div>
</div>

<div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0;">
  <p style="color:#92400e;font-size:15px;line-height:1.7;margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;"><strong>The golden rule:</strong> Logic first — emotion last. Never fall in love with a property before the numbers make sense.</p>
</div>

<p style="margin:24px 0;text-align:center;"><a href="{{cta_url}}" style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#d97706);color:#1e293b;font-weight:bold;padding:14px 28px;border-radius:12px;text-decoration:none;font-size:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Open the Calculator</a></p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Try it with a property you've been looking at. You might be surprised by the results.</p>

<p style="color:#1e293b;font-size:15px;font-weight:600;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Chris</p>`,
  },

  // ═══════════════════════════════════════════════════════════
  // EMAIL 5: 5 Mistakes First-Time Investors Make (Day 8)
  // ═══════════════════════════════════════════════════════════
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

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Hi {{First Name}},</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">I've seen hundreds of new investors make the same errors. Here are the top five — and how to avoid each one:</p>

<div style="background:#fef2f2;border-left:4px solid #ef4444;padding:16px 20px;border-radius:0 8px 8px 0;margin:16px 0;">
  <p style="color:#991b1b;font-size:15px;margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;"><strong>Mistake #1: Buying based on emotion, not numbers.</strong><br/>You fall in love with a property before running the figures. The Deal Analyser exists to prevent this.</p>
</div>

<div style="background:#fef2f2;border-left:4px solid #ef4444;padding:16px 20px;border-radius:0 8px 8px 0;margin:16px 0;">
  <p style="color:#991b1b;font-size:15px;margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;"><strong>Mistake #2: Chasing yield without understanding risk.</strong><br/>A 12% yield means nothing if the area has 40% void rates or problem tenants.</p>
</div>

<div style="background:#fef2f2;border-left:4px solid #ef4444;padding:16px 20px;border-radius:0 8px 8px 0;margin:16px 0;">
  <p style="color:#991b1b;font-size:15px;margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;"><strong>Mistake #3: Overleveraging in a rising market.</strong><br/>When interest rates change, your "great deal" becomes a monthly cash drain.</p>
</div>

<div style="background:#fef2f2;border-left:4px solid #ef4444;padding:16px 20px;border-radius:0 8px 8px 0;margin:16px 0;">
  <p style="color:#991b1b;font-size:15px;margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;"><strong>Mistake #4: Ignoring hidden costs.</strong><br/>Stamp duty, legal fees, refurbishment, void periods — they add up fast if you don't plan for them.</p>
</div>

<div style="background:#fef2f2;border-left:4px solid #ef4444;padding:16px 20px;border-radius:0 8px 8px 0;margin:16px 0;">
  <p style="color:#991b1b;font-size:15px;margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;"><strong>Mistake #5: Treating property like a get-rich-quick scheme.</strong><br/>The real wealth comes from patience and compounding over decades, not flipping for quick profits.</p>
</div>

<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin:24px 0;">
  <p style="color:#166534;font-size:15px;line-height:1.7;margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;"><strong>The good news?</strong> Every one of these mistakes is avoidable with the right knowledge and preparation. That's exactly what the book — and the tools in your Starter Pack — are designed to help with.</p>
</div>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">In my next email, I'll share a real case study of how one reader went from zero to a profitable portfolio.</p>

<p style="color:#1e293b;font-size:15px;font-weight:600;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Chris</p>`,
  },

  // ═══════════════════════════════════════════════════════════
  // EMAIL 6: Case Study – Real Investor Success (Day 10)
  // ═══════════════════════════════════════════════════════════
  {
    step_number: 6,
    subject: 'How One Reader Built a £500K Portfolio Starting With £25K',
    delay_days: 2,
    delay_hours: 0,
    step_purpose: 'social-proof',
    cta_url: '',
    cta_label: '',
    sender_name: 'Chris Ifonlaja',
    sender_email: 'noreply@buildwealththroughproperty.com',
    summary: 'Social proof through a real reader case study to build belief and desire',
    html_body: `<h2 style="color:#1e293b;font-size:22px;margin-bottom:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Real Story: From £25K to a £500K Portfolio</h2>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Hi {{First Name}},</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">I want to share a real story from someone who was exactly where you are now.</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Sarah downloaded the Starter Pack two years ago. She was a busy professional with £25K in savings and zero property investment experience. Here's what happened:</p>

<div style="background:#f0fdf4;border:1px solid #bbf7d0;padding:24px;border-radius:12px;margin:20px 0;">
  <div style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid #bbf7d0;">
    <p style="color:#15803d;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">Year 1</p>
    <p style="color:#166534;font-size:15px;line-height:1.7;margin:0;">Bought her first BTL in Manchester for £120K using a 25% deposit from savings. Used the Deal Analyser to validate the numbers before making an offer.</p>
  </div>
  <div style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid #bbf7d0;">
    <p style="color:#15803d;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">Year 2</p>
    <p style="color:#166534;font-size:15px;line-height:1.7;margin:0;">Refinanced after the property appreciated, pulled equity, and bought properties #2 and #3 using the BRRRR strategy from the book.</p>
  </div>
  <div>
    <p style="color:#15803d;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">Today</p>
    <p style="color:#166534;font-size:15px;line-height:1.7;margin:0;">Portfolio valued at £500K, generating £2,400/month net rental income. All while keeping her full-time job.</p>
  </div>
</div>

<div style="background:#f8fafc;border:1px solid #e2e8f0;padding:20px;border-radius:12px;margin:20px 0;">
  <p style="color:#475569;font-size:15px;line-height:1.7;font-style:italic;margin:0 0 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">"The book gave me the framework. The tools gave me the confidence. Everything else followed from there."</p>
  <p style="color:#1e293b;font-size:14px;font-weight:600;margin:0;">— Sarah, Manchester</p>
</div>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">The key? She didn't rush. She learned the fundamentals first, then acted with confidence and discipline.</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">That's the approach I teach — and it works.</p>

<p style="color:#1e293b;font-size:15px;font-weight:600;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Chris</p>`,
  },

  // ═══════════════════════════════════════════════════════════
  // EMAIL 7: Engagement – Try the Calculator (Day 12)
  // ═══════════════════════════════════════════════════════════
  {
    step_number: 7,
    subject: 'Run the Numbers on Your First Property Deal (Free Tool)',
    delay_days: 2,
    delay_hours: 0,
    step_purpose: 'engage',
    cta_url: '/calculator',
    cta_label: 'Open the Free Calculator',
    sender_name: 'Chris Ifonlaja',
    sender_email: 'noreply@buildwealththroughproperty.com',
    summary: 'Drive engagement with the calculator tool to increase investment in the journey',
    html_body: `<h2 style="color:#1e293b;font-size:22px;margin-bottom:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Your Turn: Model a Real Deal</h2>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Hi {{First Name}},</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Theory is great. But nothing beats running real numbers on a real property.</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">I built a free Property Investment Calculator that lets you:</p>

<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin:20px 0;">
  <p style="color:#1e293b;font-size:15px;line-height:2.2;margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    &#10003; Calculate mortgage payments and rental yield<br/>
    &#10003; See monthly cash flow projections<br/>
    &#10003; Model 25-year wealth growth with visual charts<br/>
    &#10003; Compare different deposit and interest rate scenarios<br/>
    &#10003; Understand the true cost of ownership
  </p>
</div>

<p style="margin:24px 0;text-align:center;"><a href="{{cta_url}}" style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#d97706);color:#1e293b;font-weight:bold;padding:16px 32px;border-radius:12px;text-decoration:none;font-size:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Open the Free Calculator</a></p>

<div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0;">
  <p style="color:#92400e;font-size:15px;line-height:1.7;margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;"><strong>Quick exercise:</strong> Find a property on Rightmove right now. Enter the asking price and estimated rent into the calculator. See what the numbers tell you. This is how real investors make decisions.</p>
</div>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Try it today — you might be surprised by the results.</p>

<p style="color:#1e293b;font-size:15px;font-weight:600;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Chris</p>`,
  },

  // ═══════════════════════════════════════════════════════════
  // EMAIL 8: Testimonials + Social Proof (Day 14)
  // ═══════════════════════════════════════════════════════════
  {
    step_number: 8,
    subject: 'What Readers Are Saying About Build Wealth Through Property',
    delay_days: 2,
    delay_hours: 0,
    step_purpose: 'social-proof',
    cta_url: '',
    cta_label: '',
    sender_name: 'Chris Ifonlaja',
    sender_email: 'noreply@buildwealththroughproperty.com',
    summary: 'Stack social proof with multiple testimonials to build trust before the course pitch',
    html_body: `<h2 style="color:#1e293b;font-size:22px;margin-bottom:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Don't Just Take My Word For It</h2>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Hi {{First Name}},</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">I wanted to share some feedback from other readers who started exactly where you are now:</p>

<div style="background:#f8fafc;border:1px solid #e2e8f0;padding:20px;border-radius:12px;margin:16px 0;">
  <p style="color:#475569;font-size:15px;line-height:1.7;font-style:italic;margin:0 0 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">"This book completely shifted my mindset. It helped me see property not just as a transaction, but as a long-term wealth strategy. I've already started analysing deals using the tools Chris provides."</p>
  <p style="color:#1e293b;font-size:14px;font-weight:600;margin:0;">— Yomi</p>
</div>

<div style="background:#f8fafc;border:1px solid #e2e8f0;padding:20px;border-radius:12px;margin:16px 0;">
  <p style="color:#475569;font-size:15px;line-height:1.7;font-style:italic;margin:0 0 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">"The quiet confidence that comes from genuinely understanding what you're doing and why. I recommend both the book and the seminar to anyone serious about property."</p>
  <p style="color:#1e293b;font-size:14px;font-weight:600;margin:0;">— Ekele</p>
</div>

<div style="background:#f8fafc;border:1px solid #e2e8f0;padding:20px;border-radius:12px;margin:16px 0;">
  <p style="color:#475569;font-size:15px;line-height:1.7;font-style:italic;margin:0 0 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">"I was overwhelmed by all the property information out there. This book cut through the noise and gave me a clear, structured plan. The Starter Pack tools made it even more practical."</p>
  <p style="color:#1e293b;font-size:14px;font-weight:600;margin:0;">— David, London</p>
</div>

<div style="background:#f8fafc;border:1px solid #e2e8f0;padding:20px;border-radius:12px;margin:16px 0;">
  <p style="color:#475569;font-size:15px;line-height:1.7;font-style:italic;margin:0 0 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">"What I love about Chris's approach is the emphasis on discipline and patience. No get-rich-quick promises — just solid, proven principles that actually work."</p>
  <p style="color:#1e293b;font-size:14px;font-weight:600;margin:0;">— Amara, Birmingham</p>
</div>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">If you've been enjoying these emails and finding the Starter Pack useful, I have something exciting to share with you in my next email.</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Stay tuned.</p>

<p style="color:#1e293b;font-size:15px;font-weight:600;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Chris</p>`,
  },

  // ═══════════════════════════════════════════════════════════
  // EMAIL 9: Course Introduction + Reader Offer (Day 18)
  // ═══════════════════════════════════════════════════════════
  {
    step_number: 9,
    subject: 'Going Deeper: The Property Investor Masterclass (Save £100)',
    delay_days: 4,
    delay_hours: 0,
    step_purpose: 'course-intro',
    cta_url: '/course',
    cta_label: 'View the Full Masterclass',
    sender_name: 'Chris Ifonlaja',
    sender_email: 'noreply@buildwealththroughproperty.com',
    summary: 'Introduce the Masterclass course with full details and the £100 reader discount',
    html_body: `<h2 style="color:#1e293b;font-size:22px;margin-bottom:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Ready to Go Beyond the Book?</h2>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Hi {{First Name}},</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Over the past two weeks, you've learned the fundamentals of property wealth building. You've got the tools, the frameworks, and the knowledge.</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">But here's the truth:</p>

<div style="background:#eff6ff;border-left:4px solid #3b82f6;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0;">
  <p style="color:#1e40af;font-size:16px;font-weight:600;line-height:1.7;margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Knowledge without implementation is just entertainment.</p>
</div>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">That's why I created the <strong style="color:#1e293b;">Property Investor Masterclass</strong> — a comprehensive digital course that takes you from understanding to action.</p>

<div style="background:linear-gradient(135deg,#1e293b,#334155);padding:28px;border-radius:16px;margin:24px 0;">
  <p style="color:#fbbf24;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;">What's Inside</p>
  <p style="color:#ffffff;font-size:20px;font-weight:bold;margin:0 0 16px;">Property Investor Masterclass</p>
  <p style="color:#cbd5e1;font-size:14px;line-height:2;margin:0;">
    &#10003; 12 in-depth video modules (8+ hours of content)<br/>
    &#10003; Deal analysis spreadsheets and templates<br/>
    &#10003; Live market analysis walkthroughs<br/>
    &#10003; Step-by-step implementation guides<br/>
    &#10003; Private community access<br/>
    &#10003; Monthly Q&A calls with me
  </p>
</div>

<div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:24px;border-radius:16px;margin:24px 0;text-align:center;">
  <p style="color:#c7d2fe;font-size:14px;margin:0 0 4px;">Special Reader Price</p>
  <p style="color:#ffffff;font-size:14px;margin:0 0 8px;"><span style="text-decoration:line-through;opacity:0.6;">£397</span></p>
  <p style="color:#ffffff;font-size:36px;font-weight:bold;margin:0 0 8px;">£297</p>
  <p style="display:inline-block;background:#fbbf24;color:#1e293b;padding:4px 12px;border-radius:6px;font-size:12px;font-weight:bold;margin:0;">SAVE £100 — READER EXCLUSIVE</p>
</div>

<p style="margin:24px 0;text-align:center;"><a href="{{cta_url}}" style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#ffffff;font-weight:bold;padding:18px 36px;border-radius:12px;text-decoration:none;font-size:18px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">View the Full Masterclass</a></p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">I'll share the complete module breakdown and more details in my next email. But if you're ready to take the next step:</p>

<p style="color:#475569;font-size:14px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;text-align:center;">30-day money-back guarantee. No questions asked.</p>

<p style="color:#1e293b;font-size:15px;font-weight:600;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Chris</p>`,
  },

  // ═══════════════════════════════════════════════════════════
  // EMAIL 10: Final Close – Last Chance (Day 22)
  // ═══════════════════════════════════════════════════════════
  {
    step_number: 10,
    subject: 'Last Chance: Your Property Investment Journey Starts Now',
    delay_days: 4,
    delay_hours: 0,
    step_purpose: 'hard-close',
    cta_url: '/course',
    cta_label: 'Enrol Now — Save £100',
    sender_name: 'Chris Ifonlaja',
    sender_email: 'noreply@buildwealththroughproperty.com',
    summary: 'Final urgency-driven close with full course breakdown and £297 offer',
    html_body: `<h2 style="color:#1e293b;font-size:22px;margin-bottom:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">This Is Your Moment</h2>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Hi {{First Name}},</p>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Over the past 3 weeks, you've learned:</p>

<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin:16px 0;">
  <p style="color:#1e293b;font-size:15px;line-height:2;margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    &#10003; Why property builds wealth differently (7 reasons)<br/>
    &#10003; The 3 numbers that matter in every deal<br/>
    &#10003; How to use the Deal Analyser step by step<br/>
    &#10003; The 5 mistakes that sink new investors<br/>
    &#10003; Real case studies of successful investors<br/>
    &#10003; How to run the numbers on any property
  </p>
</div>

<p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">But here's what separates those who build wealth from those who just read about it: <strong style="color:#1e293b;">action</strong>.</p>

<div style="background:#fef2f2;border:1px solid #fecaca;padding:24px;border-radius:12px;margin:24px 0;text-align:center;">
  <p style="color:#dc2626;font-size:18px;font-weight:bold;margin:0 0 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Your reader discount expires soon.</p>
  <p style="color:#991b1b;font-size:14px;margin:0;">After that, the Masterclass returns to full price (£397).</p>
</div>

<div style="background:linear-gradient(135deg,#1e293b,#334155);padding:28px;border-radius:16px;margin:24px 0;">
  <p style="color:#fbbf24;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;">Everything You Get</p>
  <p style="color:#e2e8f0;font-size:14px;line-height:2;margin:0 0 16px;">
    &#10003; 12 video modules covering Foundation → Numbers → Execution → Scale<br/>
    &#10003; 8+ hours of structured, practical content<br/>
    &#10003; Deal analysis templates and spreadsheets<br/>
    &#10003; Live market analysis walkthroughs<br/>
    &#10003; Step-by-step implementation guides<br/>
    &#10003; Private investor community access<br/>
    &#10003; Monthly live Q&A calls with Chris<br/>
    &#10003; Lifetime access to all materials and updates
  </p>
  <div style="text-align:center;padding-top:16px;border-top:1px solid #475569;">
    <p style="color:#94a3b8;font-size:14px;margin:0 0 4px;"><span style="text-decoration:line-through;">£397</span></p>
    <p style="color:#ffffff;font-size:40px;font-weight:bold;margin:0 0 8px;">£297</p>
    <p style="display:inline-block;background:#fbbf24;color:#1e293b;padding:4px 12px;border-radius:6px;font-size:12px;font-weight:bold;">READER EXCLUSIVE — SAVE £100</p>
  </div>
</div>

<p style="margin:28px 0;text-align:center;"><a href="{{cta_url}}" style="display:inline-block;background:linear-gradient(135deg,#dc2626,#b91c1c);color:#ffffff;font-weight:bold;padding:20px 40px;border-radius:12px;text-decoration:none;font-size:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;box-shadow:0 4px 14px rgba(220,38,38,0.4);">Enrol Now — Save £100</a></p>

<p style="color:#475569;font-size:14px;line-height:1.8;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">30-day money-back guarantee. No questions asked.</p>

<div style="border-top:1px solid #e2e8f0;margin-top:32px;padding-top:20px;">
  <p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Whatever you decide, thank you for being part of this community. The Starter Pack, the calculator, and these emails will always be here for you.</p>

  <p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">But if you're serious about building wealth through property — this is the most structured, practical way to start.</p>

  <p style="color:#475569;font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">To your wealth,</p>
  <p style="color:#1e293b;font-size:15px;font-weight:600;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Chris Ifonlaja</p>
</div>`,
  },
];

// Purpose colors for pipeline visualization
export const PURPOSE_COLORS: Record<string, string> = {
  'deliver': 'from-emerald-500 to-emerald-600',
  'educate': 'from-blue-500 to-blue-600',
  'social-proof': 'from-purple-500 to-purple-600',
  'engage': 'from-amber-500 to-amber-600',
  'soft-sell': 'from-orange-500 to-orange-600',
  'course-intro': 'from-indigo-500 to-indigo-600',
  'course-details': 'from-rose-500 to-rose-600',
  'hard-close': 'from-red-500 to-red-600',
  // Upsell funnel purposes
  'congratulate': 'from-teal-500 to-teal-600',
  'advanced-educate': 'from-cyan-500 to-cyan-600',
  'case-study': 'from-violet-500 to-violet-600',
  'alumni-offer': 'from-fuchsia-500 to-fuchsia-600',
  'alumni-close': 'from-rose-600 to-red-600',
};

export const PURPOSE_LABELS: Record<string, string> = {
  'deliver': 'Deliver',
  'educate': 'Educate',
  'social-proof': 'Proof',
  'engage': 'Engage',
  'soft-sell': 'Soft Sell',
  'course-intro': 'Introduce',
  'course-details': 'Offer',
  'hard-close': 'Close',
  // Upsell funnel purposes
  'congratulate': 'Celebrate',
  'advanced-educate': 'Advanced',
  'case-study': 'Case Study',
  'alumni-offer': 'Alumni Offer',
  'alumni-close': 'Alumni Close',
};

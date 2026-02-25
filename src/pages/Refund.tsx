import React from 'react';
import LegalPageLayout from '@/components/LegalPageLayout';

const CONTACT_EMAIL = 'support@buildwealththroughproperty.com';
const WEBSITE_URL = 'https://buildwealththroughproperty.com';

const Refund: React.FC = () => {
  return (
    <LegalPageLayout title="Refund Policy" lastUpdated="21 February 2026">
      <p>
        At <strong>Build Wealth Through Property</strong>, we want you to be completely satisfied with your purchase. This Refund Policy explains the terms and conditions for refunds on our paid courses, digital products, books, and services. Please read this policy carefully before making a purchase.
      </p>
      <p>
        This policy is in addition to your statutory rights under UK consumer law, including the <strong>Consumer Rights Act 2015</strong> and the <strong>Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013</strong>.
      </p>

      <h2>1. Overview</h2>
      <p>
        We offer different refund terms depending on the type of product or service purchased. The table below provides a summary:
      </p>
      <table>
        <thead>
          <tr>
            <th>Product / Service</th>
            <th>Refund Period</th>
            <th>Conditions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Online Courses (e.g. From Book to Buy-to-Let, Masterclass)</td>
            <td>14 days from purchase</td>
            <td>Less than 25% of course content accessed</td>
          </tr>
          <tr>
            <td>Physical Book (bought directly from us)</td>
            <td>14 days from receipt</td>
            <td>Return in original condition, unused and undamaged</td>
          </tr>
          <tr>
            <td>Physical Book (third-party retailer)</td>
            <td>See retailer policy</td>
            <td>Purchased via Amazon or other retailers</td>
          </tr>
          <tr>
            <td>Digital Book (eBook/Kindle)</td>
            <td>See retailer policy</td>
            <td>Purchased via third-party retailers (e.g. Amazon)</td>
          </tr>
          <tr>
            <td>Free Starter Pack</td>
            <td>N/A</td>
            <td>Free — no refund applicable</td>
          </tr>
          <tr>
            <td>Investment Calculator</td>
            <td>N/A</td>
            <td>Free tool — no refund applicable</td>
          </tr>
        </tbody>
      </table>

      <h2>2. Online Courses — 14-Day Money-Back Guarantee</h2>
      <p>
        We offer a <strong>14-day money-back guarantee</strong> on all paid online courses, starting from the date of purchase. This gives you time to review the course content and decide whether it is right for you.
      </p>

      <h3>2.1 Eligibility for a Course Refund</h3>
      <p>To be eligible for a full refund on an online course, the following conditions must be met:</p>
      <ul>
        <li>Your refund request must be submitted <strong>within 14 days</strong> of the original purchase date.</li>
        <li>You must have accessed <strong>less than 25%</strong> of the total course content (measured by modules or lessons completed).</li>
        <li>You must not have downloaded or retained any premium course materials (e.g. templates, spreadsheets, or bonus resources) beyond those included in the free Starter Pack.</li>
      </ul>

      <h3>2.2 How to Request a Course Refund</h3>
      <p>To request a refund, please email us at:</p>
      <ul>
        <li><strong>Email:</strong> <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></li>
      </ul>
      <p>Please include the following information in your refund request:</p>
      <ul>
        <li>Your full name</li>
        <li>The email address associated with your account</li>
        <li>The name of the course purchased</li>
        <li>Your order or transaction reference number</li>
        <li>The date of purchase</li>
        <li>The reason for your refund request (optional, but helps us improve)</li>
      </ul>

      <h3>2.3 Refund Processing</h3>
      <ul>
        <li>We will review your refund request and respond within <strong>5 working days</strong>.</li>
        <li>If approved, your refund will be processed to the original payment method within <strong>10 working days</strong>.</li>
        <li>Upon refund, your access to the course will be revoked immediately.</li>
        <li>Any course progress, notes, or saved data associated with the refunded course will be deleted.</li>
      </ul>

      <h3>2.4 When a Course Refund May Be Declined</h3>
      <p>We reserve the right to decline a refund request if:</p>
      <ul>
        <li>The request is made <strong>after 14 days</strong> from the date of purchase.</li>
        <li>You have accessed <strong>25% or more</strong> of the course content.</li>
        <li>There is evidence of abuse, such as downloading all course materials and then requesting a refund.</li>
        <li>You have previously received a refund for the same course.</li>
      </ul>

      <h2>3. Books and Physical Products</h2>
      <h3>3.1 Books Bought Directly From Us</h3>
      <p>
        If you purchased a physical copy of "Build Wealth Through Property: 7 Reasons Why" directly from us — for example via our website (<a href={WEBSITE_URL} target="_blank" rel="noopener noreferrer">buildwealththroughproperty.com</a>), at an event, or through another direct channel — you may request a refund within <strong>14 days of receipt</strong>. The book must be returned in its original condition, unused and undamaged. Please contact us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> to arrange the return and refund.
      </p>
      <h3>3.2 Books Bought From Third-Party Retailers</h3>
      <p>
        Our book is also sold through third-party retailers such as Amazon. Refunds and returns for purchases made from these retailers are subject to the policies of the retailer from which you bought the book. Please refer to that retailer&apos;s refund and returns policy.
      </p>

      <h2>4. Free Products and Resources</h2>
      <p>
        Free resources — including the Property Investor Starter Pack, the Investment Calculator, and free book chapters — are provided at no cost and are therefore not eligible for refunds. If you wish to stop receiving communications related to free resources, you can unsubscribe at any time using the link in our emails.
      </p>

      <h2>5. Your Statutory Rights</h2>
      <p>
        This Refund Policy does not affect your statutory rights as a consumer under UK law. Under the <strong>Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013</strong>, you have a statutory right to cancel an online purchase within 14 days of the date of purchase (the "cooling-off period").
      </p>
      <p>
        <strong>Important note on digital content:</strong> Under these regulations, if you access or begin downloading digital content (such as an online course) within the 14-day cooling-off period, you may lose your statutory right to cancel — provided that you were informed of this before purchase and gave your explicit consent. By purchasing and immediately accessing a course, you acknowledge and agree to this.
      </p>
      <p>
        Notwithstanding the above, we still offer our 14-day money-back guarantee (subject to the conditions in Section 2) as a goodwill measure that goes beyond your minimum statutory rights.
      </p>

      <h2>6. Chargebacks and Disputes</h2>
      <p>
        If you have a concern about a charge, we encourage you to contact us directly at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> before initiating a chargeback or dispute with your bank or payment provider. We are committed to resolving issues fairly and promptly.
      </p>
      <p>
        Initiating a chargeback without first contacting us may result in the suspension of your account and access to all Services while the dispute is under review.
      </p>

      <h2>7. Promotional Offers and Discounts</h2>
      <p>
        If you purchased a course at a discounted or promotional price, any refund will be for the amount actually paid — not the full retail price. Promotional codes and discounts are non-transferable and cannot be reinstated after a refund.
      </p>

      <h2>8. Course Bundles</h2>
      <p>
        If you purchased a bundle of courses, the refund terms apply to the bundle as a whole. Partial refunds for individual courses within a bundle are not available. To receive a refund on a bundle, the conditions in Section 2 must be met for all courses in the bundle.
      </p>

      <h2>9. Technical Issues</h2>
      <p>
        If you experience technical issues that prevent you from accessing course content, please contact us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> before requesting a refund. We will make every reasonable effort to resolve technical problems promptly. If we are unable to resolve the issue within a reasonable timeframe, you will be entitled to a full refund regardless of the conditions in Section 2.
      </p>

      <h2>10. Changes to This Policy</h2>
      <p>
        We may update this Refund Policy from time to time. Any changes will be posted on this page with an updated "Last updated" date. Changes will not apply retroactively to purchases made before the update. The policy in effect at the time of your purchase will apply to that transaction.
      </p>

      <h2>11. Contact Us</h2>
      <p>
        If you have any questions about this Refund Policy or need to request a refund, please contact us:
      </p>
      <ul>
        <li><strong>Email:</strong> <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></li>
        <li><strong>Website:</strong> <a href={WEBSITE_URL} target="_blank" rel="noopener noreferrer">{WEBSITE_URL}</a></li>
      </ul>
      <p>
        We aim to respond to all refund enquiries within 5 working days.
      </p>
    </LegalPageLayout>
  );
};

export default Refund;

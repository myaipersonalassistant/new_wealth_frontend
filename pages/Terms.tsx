import React from 'react';
import { Link } from 'react-router-dom';
import LegalPageLayout from '@/components/LegalPageLayout';

const CONTACT_EMAIL = 'support@buildwealththroughproperty.com';
const WEBSITE_URL = 'https://buildwealththroughproperty.com';

const Terms: React.FC = () => {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="21 February 2026">
      <p>
        These Terms of Service ("Terms") govern your access to and use of the <strong>Build Wealth Through Property</strong> website, online courses, digital products, tools, and related services (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms. If you do not agree, please do not use our Services.
      </p>
      <p>
        Build Wealth Through Property is a UK-based property education business. These Terms are governed by the laws of <strong>England and Wales</strong>.
      </p>

      <h2>1. About Us</h2>
      <p>
        Build Wealth Through Property provides property investment education through books, online courses, digital tools, and downloadable resources. Our Services are designed to educate and inform — they do not constitute financial, legal, tax, or investment advice. See Section 10 for our full disclaimer.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        To use our Services, you must be at least 18 years of age and have the legal capacity to enter into a binding agreement. By using our Services, you represent and warrant that you meet these requirements.
      </p>

      <h2>3. Account Registration</h2>
      <ul>
        <li>You may need to create an account to access certain features, such as courses and the learning dashboard.</li>
        <li>You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.</li>
        <li>You agree to provide accurate, current, and complete information during registration and to update it as necessary.</li>
        <li>We reserve the right to suspend or terminate accounts that violate these Terms or that we reasonably believe to be fraudulent.</li>
      </ul>

      <h2>4. Services and Products</h2>

      <h3>4.1 Online Courses</h3>
      <p>
        Our online courses (including the "From Book to Buy-to-Let" beginner course and the "Property Investor Masterclass") provide structured educational content on property investment. Course access is subject to the following terms:
      </p>
      <ul>
        <li>Course access is granted upon successful payment or enrolment.</li>
        <li>Access duration depends on the specific course purchased. Details are provided on the course sales page at the time of purchase.</li>
        <li>We reserve the right to update, modify, or retire course content at any time to ensure accuracy and relevance.</li>
        <li>Course content is provided for educational purposes only and does not guarantee any specific financial outcome.</li>
      </ul>

      <h3>4.2 Free Resources</h3>
      <p>
        We offer free resources such as the Property Investor Starter Pack, investment calculator, and free book chapters. These are provided "as is" for educational purposes. Access to free resources may require providing your name and email address.
      </p>

      <h3>4.3 Books and Publications</h3>
      <p>
        "Build Wealth Through Property: 7 Reasons Why" and any other publications by Build Wealth Through Property may be purchased directly from us (via our website) or through third-party retailers (e.g. Amazon). Purchases made directly from us are subject to these Terms and our Refund Policy. Purchases from third-party retailers are subject to the terms and policies of the respective retailer.
      </p>

      <h2>5. Pricing and Payment</h2>
      <ul>
        <li>All prices are displayed in British Pounds Sterling (GBP) and include VAT where applicable.</li>
        <li>We reserve the right to change prices at any time. Price changes will not affect orders already confirmed.</li>
        <li>Payment is processed securely through our third-party payment providers. We do not store your full payment card details.</li>
        <li>You agree to pay all fees and charges associated with your purchases.</li>
      </ul>

      <h2>6. Refunds and Cancellations</h2>
      <p>
        Our refund policy is set out in our separate <Link to="/refund">Refund Policy</Link> page. By purchasing our Services, you agree to the terms of our Refund Policy.
      </p>
      <p>
        In summary, we offer a <strong>14-day money-back guarantee</strong> on our paid courses, subject to the conditions outlined in our Refund Policy. Your statutory rights under the <strong>Consumer Rights Act 2015</strong> and the <strong>Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013</strong> are not affected.
      </p>

      <h2>7. Intellectual Property</h2>
      <ul>
        <li>All content on our website and within our courses — including text, graphics, logos, images, videos, audio, spreadsheets, templates, and software — is the intellectual property of Build Wealth Through Property or its licensors and is protected by UK and international copyright, trademark, and other intellectual property laws.</li>
        <li>You are granted a limited, non-exclusive, non-transferable, revocable licence to access and use the content for your personal, non-commercial educational purposes only.</li>
        <li>You may not reproduce, distribute, modify, create derivative works from, publicly display, publicly perform, republish, download, store, or transmit any of our content without our prior written consent.</li>
        <li>You may not share, resell, or redistribute course access, login credentials, or course materials to any third party.</li>
        <li>Downloaded resources (e.g. the Starter Pack spreadsheets and checklists) are for your personal use only and may not be redistributed or sold.</li>
      </ul>

      <h2>8. Acceptable Use</h2>
      <p>When using our Services, you agree not to:</p>
      <ul>
        <li>Use the Services for any unlawful purpose or in violation of any applicable law or regulation.</li>
        <li>Share your account credentials with others or allow multiple people to use a single account.</li>
        <li>Copy, record, download, or redistribute course content (including video, audio, or written materials) without authorisation.</li>
        <li>Attempt to gain unauthorised access to any part of our Services, other users' accounts, or our systems.</li>
        <li>Use automated tools (bots, scrapers, etc.) to access or interact with our Services.</li>
        <li>Post or transmit any harmful, threatening, abusive, defamatory, or otherwise objectionable content.</li>
        <li>Interfere with or disrupt the integrity or performance of our Services.</li>
        <li>Impersonate any person or entity, or falsely state or misrepresent your affiliation with any person or entity.</li>
      </ul>

      <h2>9. User-Generated Content</h2>
      <p>
        If you submit any content through our Services (such as course notes, comments, or feedback), you grant Build Wealth Through Property a non-exclusive, worldwide, royalty-free licence to use, reproduce, and display such content in connection with our Services. You retain ownership of your content but are responsible for ensuring it does not infringe any third-party rights.
      </p>

      <h2>10. Disclaimer — Not Financial Advice</h2>
      <p>
        <strong>This is important. Please read carefully.</strong>
      </p>
      <p>
        Build Wealth Through Property provides property investment <strong>education</strong>. Our books, courses, tools, and content are for <strong>informational and educational purposes only</strong>. They do not constitute and should not be construed as:
      </p>
      <ul>
        <li>Financial advice</li>
        <li>Investment advice</li>
        <li>Tax advice</li>
        <li>Legal advice</li>
        <li>Mortgage or lending advice</li>
      </ul>
      <p>
        All property investments carry risk, including the risk of losing money. Property values can go down as well as up. Rental income is not guaranteed. Past performance is not indicative of future results.
      </p>
      <p>
        Before making any investment decisions, you should seek independent professional advice from a qualified financial adviser, solicitor, accountant, or mortgage broker who is authorised and regulated by the <strong>Financial Conduct Authority (FCA)</strong>.
      </p>
      <p>
        Build Wealth Through Property is <strong>not</strong> authorised or regulated by the FCA and does not provide regulated financial advice.
      </p>

      <h2>11. Limitation of Liability</h2>
      <p>To the fullest extent permitted by law:</p>
      <ul>
        <li>Build Wealth Through Property shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our Services.</li>
        <li>We shall not be liable for any financial losses, lost profits, or investment losses resulting from decisions you make based on our educational content.</li>
        <li>Our total liability to you for any claim arising from or related to our Services shall not exceed the amount you paid to us in the 12 months preceding the claim.</li>
        <li>Nothing in these Terms excludes or limits our liability for death or personal injury caused by our negligence, fraud or fraudulent misrepresentation, or any other liability that cannot be excluded or limited by English law.</li>
      </ul>

      <h2>12. Indemnification</h2>
      <p>
        You agree to indemnify, defend, and hold harmless Build Wealth Through Property, its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses (including reasonable legal fees) arising out of or in any way connected with your access to or use of the Services, your violation of these Terms, or your violation of any third-party rights.
      </p>

      <h2>13. Third-Party Links and Services</h2>
      <p>
        Our Services may contain links to third-party websites, products, or services (e.g. Amazon, social media platforms, payment processors). We are not responsible for the content, accuracy, or practices of any third-party sites. Your use of third-party services is at your own risk and subject to their respective terms and policies.
      </p>

      <h2>14. Availability and Modifications</h2>
      <ul>
        <li>We strive to keep our Services available at all times but do not guarantee uninterrupted access. We may need to perform maintenance, updates, or experience technical issues.</li>
        <li>We reserve the right to modify, suspend, or discontinue any part of our Services at any time, with or without notice.</li>
        <li>We reserve the right to update these Terms at any time. Material changes will be communicated via our website or email. Continued use of our Services after changes constitutes acceptance of the updated Terms.</li>
      </ul>

      <h2>15. Termination</h2>
      <p>
        We may terminate or suspend your access to our Services immediately, without prior notice or liability, if you breach these Terms or for any other reason at our sole discretion. Upon termination, your right to use the Services will cease immediately. Sections that by their nature should survive termination (including intellectual property, disclaimers, limitation of liability, and indemnification) shall survive.
      </p>

      <h2>16. Governing Law and Disputes</h2>
      <p>
        These Terms are governed by and construed in accordance with the laws of <strong>England and Wales</strong>. Any disputes arising from or relating to these Terms or our Services shall be subject to the exclusive jurisdiction of the courts of England and Wales.
      </p>
      <p>
        If you are a consumer, you may also be entitled to use the European Commission's Online Dispute Resolution platform or alternative dispute resolution procedures.
      </p>

      <h2>17. Severability</h2>
      <p>
        If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that the remaining provisions remain in full force and effect.
      </p>

      <h2>18. Entire Agreement</h2>
      <p>
        These Terms, together with our <Link to="/privacy">Privacy Policy</Link> and <Link to="/refund">Refund Policy</Link>, constitute the entire agreement between you and Build Wealth Through Property regarding your use of our Services and supersede all prior agreements and understandings.
      </p>

      <h2>19. Contact Us</h2>
      <p>
        If you have any questions about these Terms of Service, please contact us:
      </p>
      <ul>
        <li><strong>Email:</strong> <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></li>
        <li><strong>Website:</strong> <a href={WEBSITE_URL} target="_blank" rel="noopener noreferrer">{WEBSITE_URL}</a></li>
      </ul>
    </LegalPageLayout>
  );
};

export default Terms;

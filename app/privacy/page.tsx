import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Shield, Mail, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Weather Wizard Roofing",
  description:
    "Privacy Policy for Weather Wizard Roofing & Guttering. Learn how we collect, use, and protect your personal information.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "January 2025";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/weather-wizard-logo-no-bg.png"
                alt="Weather Wizard Logo"
                width={48}
                height={48}
                className="w-12 h-12"
              />
              <span className="font-display text-xl text-copper">Weather Wizard</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 text-white/70 hover:text-copper transition-colors text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-copper/10 rounded-xl">
              <Shield className="h-6 w-6 text-copper" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
              <p className="text-slate-500 text-sm">Last updated: {lastUpdated}</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">1. Introduction</h2>
              <p className="text-slate-600 leading-relaxed">
                Weather Wizard Roofing &amp; Guttering (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is
                committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose,
                and safeguard your information when you visit our website or use our services.
              </p>
              <p className="text-slate-600 leading-relaxed mt-3">
                We comply with the UK General Data Protection Regulation (UK GDPR), the Data Protection Act 2018,
                and the Privacy and Electronic Communications Regulations (PECR).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">2. Data Controller</h2>
              <p className="text-slate-600 leading-relaxed">
                Weather Wizard Roofing &amp; Guttering is the data controller responsible for your personal data.
              </p>
              <div className="bg-slate-50 rounded-lg p-4 mt-3">
                <p className="text-slate-700 text-sm">
                  <strong>Contact Details:</strong>
                  <br />
                  Email: privacy@weatherwizard.co.uk
                  <br />
                  Phone: 0800 316 2922
                  <br />
                  Address: Kent, United Kingdom
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">3. Information We Collect</h2>
              <p className="text-slate-600 leading-relaxed mb-3">
                We may collect the following types of information:
              </p>
              <h3 className="text-lg font-medium text-slate-800 mt-4 mb-2">
                3.1 Information You Provide
              </h3>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Name and contact details (email, phone number, address)</li>
                <li>Property details relevant to our roofing services</li>
                <li>Communications you send to us</li>
              </ul>

              <h3 className="text-lg font-medium text-slate-800 mt-4 mb-2">
                3.2 Information Collected Automatically
              </h3>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Device information (browser type, operating system)</li>
                <li>IP address and approximate location</li>
                <li>Pages visited and time spent on our website</li>
                <li>Referral source (how you found us)</li>
              </ul>

              <h3 className="text-lg font-medium text-slate-800 mt-4 mb-2">
                3.3 Cookies and Tracking Technologies
              </h3>
              <p className="text-slate-600 leading-relaxed">
                We use cookies and similar technologies to enhance your experience and for advertising purposes.
                Please see our{" "}
                <Link href="/cookies" className="text-copper hover:underline">
                  Cookie Policy
                </Link>{" "}
                for detailed information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">4. How We Use Your Information</h2>
              <p className="text-slate-600 leading-relaxed mb-3">
                We use your information for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>To provide and improve our roofing services</li>
                <li>To respond to your enquiries and provide quotes</li>
                <li>To send service-related communications</li>
                <li>To comply with legal obligations</li>
                <li>
                  For marketing and advertising (with your consent), including measuring the effectiveness of
                  our advertising campaigns
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">5. Legal Basis for Processing</h2>
              <p className="text-slate-600 leading-relaxed mb-3">
                Under UK GDPR, we process your data based on the following legal grounds:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>
                  <strong>Consent:</strong> For marketing communications and non-essential cookies (including
                  advertising cookies)
                </li>
                <li>
                  <strong>Contract:</strong> To fulfil our contractual obligations when you request our services
                </li>
                <li>
                  <strong>Legitimate Interests:</strong> To improve our services and website functionality
                </li>
                <li>
                  <strong>Legal Obligation:</strong> To comply with applicable laws and regulations
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                6. Advertising and Microsoft Bing Ads
              </h2>
              <p className="text-slate-600 leading-relaxed mb-3">
                With your consent, we use Microsoft Bing Ads (Universal Event Tracking) to:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Measure the effectiveness of our advertising campaigns</li>
                <li>Understand how users interact with our website after clicking our ads</li>
                <li>Show you relevant advertisements on Microsoft&apos;s advertising network</li>
              </ul>

              <h3 className="text-lg font-medium text-slate-800 mt-4 mb-2">Enhanced Conversions</h3>
              <p className="text-slate-600 leading-relaxed">
                We may use enhanced conversion tracking, which involves collecting hashed (privacy-protected)
                contact information (such as email or phone number) when you complete certain actions on our
                website. This data is securely hashed before being sent to Microsoft and is used solely to improve
                conversion measurement accuracy. This processing only occurs with your consent.
              </p>

              <h3 className="text-lg font-medium text-slate-800 mt-4 mb-2">Microsoft&apos;s Data Processing</h3>
              <p className="text-slate-600 leading-relaxed">
                Microsoft processes this data in accordance with their{" "}
                <a
                  href="https://privacy.microsoft.com/en-gb/privacystatement"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-copper hover:underline"
                >
                  Privacy Statement
                </a>
                . Microsoft is certified under the EU-US Data Privacy Framework.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">7. Data Sharing</h2>
              <p className="text-slate-600 leading-relaxed mb-3">
                We may share your information with:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>
                  <strong>Service providers:</strong> Companies that help us operate our business (e.g., web
                  hosting, analytics)
                </li>
                <li>
                  <strong>Advertising partners:</strong> Microsoft Advertising (with your consent)
                </li>
                <li>
                  <strong>Legal authorities:</strong> When required by law or to protect our rights
                </li>
              </ul>
              <p className="text-slate-600 leading-relaxed mt-3">
                We do not sell your personal information to third parties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">8. International Data Transfers</h2>
              <p className="text-slate-600 leading-relaxed">
                Some of our service providers (including Microsoft) may transfer data outside the UK. Where this
                occurs, we ensure appropriate safeguards are in place, such as EU Commission adequacy decisions,
                Standard Contractual Clauses, or certification under recognised frameworks like the EU-US Data
                Privacy Framework.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">9. Data Retention</h2>
              <p className="text-slate-600 leading-relaxed">
                We retain your personal data only for as long as necessary to fulfil the purposes for which it
                was collected, or as required by law. Specifically:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2 mt-3">
                <li>Customer records: 7 years after the last transaction (for legal/tax purposes)</li>
                <li>Marketing data: Until you withdraw consent</li>
                <li>Website analytics: 26 months</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">10. Your Rights</h2>
              <p className="text-slate-600 leading-relaxed mb-3">
                Under UK data protection law, you have the following rights:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>
                  <strong>Right of Access:</strong> Request a copy of your personal data
                </li>
                <li>
                  <strong>Right to Rectification:</strong> Request correction of inaccurate data
                </li>
                <li>
                  <strong>Right to Erasure:</strong> Request deletion of your data (in certain circumstances)
                </li>
                <li>
                  <strong>Right to Restrict Processing:</strong> Request limitation of processing
                </li>
                <li>
                  <strong>Right to Data Portability:</strong> Receive your data in a portable format
                </li>
                <li>
                  <strong>Right to Object:</strong> Object to processing based on legitimate interests
                </li>
                <li>
                  <strong>Right to Withdraw Consent:</strong> Withdraw consent at any time (this does not affect
                  the lawfulness of processing before withdrawal)
                </li>
              </ul>
              <p className="text-slate-600 leading-relaxed mt-3">
                To exercise any of these rights, please contact us at privacy@weatherwizard.co.uk.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">11. Managing Your Cookie Preferences</h2>
              <p className="text-slate-600 leading-relaxed">
                You can manage your cookie preferences at any time by clicking the &quot;Cookie Settings&quot;
                link in our website footer. You can also configure your browser to block or delete cookies,
                though this may affect website functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">12. Security</h2>
              <p className="text-slate-600 leading-relaxed">
                We implement appropriate technical and organisational measures to protect your personal data
                against unauthorised access, alteration, disclosure, or destruction. However, no method of
                transmission over the Internet is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">13. Children&apos;s Privacy</h2>
              <p className="text-slate-600 leading-relaxed">
                Our services are not directed to individuals under 18. We do not knowingly collect personal
                information from children. If you believe we have collected data from a child, please contact us
                immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">14. Changes to This Policy</h2>
              <p className="text-slate-600 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of significant changes by
                posting the new policy on this page and updating the &quot;Last updated&quot; date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">15. Complaints</h2>
              <p className="text-slate-600 leading-relaxed">
                If you have concerns about how we handle your data, please contact us first. You also have the
                right to lodge a complaint with the Information Commissioner&apos;s Office (ICO):
              </p>
              <div className="bg-slate-50 rounded-lg p-4 mt-3">
                <p className="text-slate-700 text-sm">
                  <strong>Information Commissioner&apos;s Office</strong>
                  <br />
                  Website:{" "}
                  <a
                    href="https://ico.org.uk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-copper hover:underline"
                  >
                    ico.org.uk
                  </a>
                  <br />
                  Phone: 0303 123 1113
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">16. Contact Us</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="mailto:privacy@weatherwizard.co.uk"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Mail className="h-5 w-5 text-copper" />
                  <span className="text-slate-700">privacy@weatherwizard.co.uk</span>
                </a>
                <a
                  href="tel:08003162922"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Phone className="h-5 w-5 text-copper" />
                  <span className="text-slate-700">0800 316 2922</span>
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-slate-900 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} Weather Wizard Roofing &amp; Guttering. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

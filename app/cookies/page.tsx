import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Cookie } from "lucide-react";

export const metadata: Metadata = {
  title: "Cookie Policy | Weather Wizard Roofing",
  description:
    "Cookie Policy for Weather Wizard Roofing & Guttering. Learn about the cookies we use and how to manage your preferences.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function CookiePolicyPage() {
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
              <Cookie className="h-6 w-6 text-copper" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Cookie Policy</h1>
              <p className="text-slate-500 text-sm">Last updated: {lastUpdated}</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">1. What Are Cookies?</h2>
              <p className="text-slate-600 leading-relaxed">
                Cookies are small text files that are stored on your device (computer, tablet, or mobile) when
                you visit a website. They are widely used to make websites work efficiently and provide
                information to website owners.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">2. How We Use Cookies</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Weather Wizard Roofing &amp; Guttering uses cookies to:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Ensure our website functions properly</li>
                <li>Remember your cookie consent preferences</li>
                <li>Understand how visitors use our website (with your consent)</li>
                <li>Measure the effectiveness of our advertising (with your consent)</li>
                <li>Show you relevant advertisements (with your consent)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">3. Types of Cookies We Use</h2>

              {/* Essential Cookies */}
              <div className="bg-slate-50 rounded-xl p-6 mb-4">
                <h3 className="text-lg font-medium text-slate-900 mb-2 flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  Essential Cookies
                </h3>
                <p className="text-slate-600 text-sm mb-3">
                  These cookies are necessary for the website to function and cannot be switched off.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 text-slate-700 font-medium">Cookie Name</th>
                        <th className="text-left py-2 text-slate-700 font-medium">Purpose</th>
                        <th className="text-left py-2 text-slate-700 font-medium">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-600">
                      <tr className="border-b border-slate-100">
                        <td className="py-2 font-mono text-xs">ww_cookie_consent</td>
                        <td className="py-2">Stores your cookie consent preferences</td>
                        <td className="py-2">1 year</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="bg-slate-50 rounded-xl p-6 mb-4">
                <h3 className="text-lg font-medium text-slate-900 mb-2 flex items-center gap-2">
                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                  Analytics Cookies (Require Consent)
                </h3>
                <p className="text-slate-600 text-sm mb-3">
                  These cookies help us understand how visitors interact with our website by collecting
                  anonymous information.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 text-slate-700 font-medium">Cookie Name</th>
                        <th className="text-left py-2 text-slate-700 font-medium">Provider</th>
                        <th className="text-left py-2 text-slate-700 font-medium">Purpose</th>
                        <th className="text-left py-2 text-slate-700 font-medium">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-600">
                      <tr className="border-b border-slate-100">
                        <td className="py-2 font-mono text-xs">wc_*</td>
                        <td className="py-2">WhatConverts</td>
                        <td className="py-2">Call tracking and conversion analytics</td>
                        <td className="py-2">Session/1 year</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="bg-slate-50 rounded-xl p-6 mb-4">
                <h3 className="text-lg font-medium text-slate-900 mb-2 flex items-center gap-2">
                  <span className="w-3 h-3 bg-copper rounded-full"></span>
                  Marketing Cookies (Require Consent)
                </h3>
                <p className="text-slate-600 text-sm mb-3">
                  These cookies are used for advertising purposes and to measure the effectiveness of our
                  advertising campaigns.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 text-slate-700 font-medium">Cookie Name</th>
                        <th className="text-left py-2 text-slate-700 font-medium">Provider</th>
                        <th className="text-left py-2 text-slate-700 font-medium">Purpose</th>
                        <th className="text-left py-2 text-slate-700 font-medium">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-600">
                      <tr className="border-b border-slate-100">
                        <td className="py-2 font-mono text-xs">_uetvid</td>
                        <td className="py-2">Microsoft Bing</td>
                        <td className="py-2">User identification across sessions</td>
                        <td className="py-2">16 days</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-2 font-mono text-xs">_uetsid</td>
                        <td className="py-2">Microsoft Bing</td>
                        <td className="py-2">Session identification</td>
                        <td className="py-2">Session</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-2 font-mono text-xs">MUID</td>
                        <td className="py-2">Microsoft</td>
                        <td className="py-2">Microsoft user identifier</td>
                        <td className="py-2">1 year</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">4. Microsoft Bing Ads &amp; UET</h2>
              <p className="text-slate-600 leading-relaxed mb-3">
                With your consent, we use Microsoft Universal Event Tracking (UET) for advertising purposes.
                This technology:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Tracks conversions from our Microsoft Bing advertising campaigns</li>
                <li>Helps us understand which ads lead to enquiries or bookings</li>
                <li>Enables remarketing (showing you ads based on your visit to our site)</li>
                <li>Uses Microsoft Consent Mode to respect your cookie preferences</li>
              </ul>
              <p className="text-slate-600 leading-relaxed mt-3">
                When you decline marketing cookies, UET does not collect any data. Learn more about Microsoft&apos;s
                data practices in their{" "}
                <a
                  href="https://privacy.microsoft.com/en-gb/privacystatement"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-copper hover:underline"
                >
                  Privacy Statement
                </a>
                .
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">5. Enhanced Conversions</h2>
              <p className="text-slate-600 leading-relaxed">
                We may use &quot;enhanced conversions&quot; which involves collecting hashed (encrypted)
                contact information when you submit an enquiry. This helps improve conversion measurement
                accuracy while protecting your privacy. The data is:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2 mt-3">
                <li>Hashed (converted to an unreadable format) before transmission</li>
                <li>Only collected with your consent</li>
                <li>Used solely for conversion measurement</li>
                <li>Not used to identify you personally</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">6. Managing Your Cookie Preferences</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                You can manage your cookie preferences at any time:
              </p>

              <h3 className="text-lg font-medium text-slate-800 mt-4 mb-2">On Our Website</h3>
              <p className="text-slate-600 leading-relaxed">
                Click the &quot;Cookie Settings&quot; link in our website footer to open the cookie consent
                banner and adjust your preferences.
              </p>

              <h3 className="text-lg font-medium text-slate-800 mt-4 mb-2">In Your Browser</h3>
              <p className="text-slate-600 leading-relaxed mb-3">
                Most web browsers allow you to control cookies through their settings. You can:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>View what cookies are stored on your device</li>
                <li>Delete individual cookies or all cookies</li>
                <li>Block cookies from specific websites</li>
                <li>Block all third-party cookies</li>
              </ul>
              <p className="text-slate-600 leading-relaxed mt-3">
                Please note that blocking cookies may affect website functionality.
              </p>

              <h3 className="text-lg font-medium text-slate-800 mt-4 mb-2">Browser-Specific Instructions</h3>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>
                  <a
                    href="https://support.google.com/chrome/answer/95647"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-copper hover:underline"
                  >
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-copper hover:underline"
                  >
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-copper hover:underline"
                  >
                    Safari
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-copper hover:underline"
                  >
                    Microsoft Edge
                  </a>
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">7. Third-Party Cookies</h2>
              <p className="text-slate-600 leading-relaxed">
                Some cookies are placed by third-party services that appear on our pages. We do not control
                these cookies. The third parties include:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2 mt-3">
                <li>
                  <strong>Microsoft:</strong> For Bing Ads conversion tracking and remarketing
                </li>
                <li>
                  <strong>WhatConverts:</strong> For call tracking and lead attribution
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">8. Changes to This Policy</h2>
              <p className="text-slate-600 leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in technology, legislation,
                or our data practices. We will update the &quot;Last updated&quot; date at the top of this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">9. More Information</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                For more information about how we handle your personal data, please read our{" "}
                <Link href="/privacy" className="text-copper hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
              <p className="text-slate-600 leading-relaxed">
                If you have any questions about our use of cookies, please contact us at{" "}
                <a href="mailto:privacy@weatherwizard.co.uk" className="text-copper hover:underline">
                  privacy@weatherwizard.co.uk
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">10. Useful Resources</h2>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>
                  <a
                    href="https://ico.org.uk/for-the-public/online/cookies/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-copper hover:underline"
                  >
                    ICO Guide to Cookies
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.aboutcookies.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-copper hover:underline"
                  >
                    AboutCookies.org
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youronlinechoices.eu/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-copper hover:underline"
                  >
                    Your Online Choices (Opt-out of Behavioural Advertising)
                  </a>
                </li>
              </ul>
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

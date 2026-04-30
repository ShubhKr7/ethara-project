"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BlurText } from "@/components/blur-text";
import { FadingVideo } from "@/components/fading-video";

export default function LandingPage() {
  return (
    <div className="bg-black min-h-screen text-white overflow-hidden relative">
      {/* Section 1 - Hero */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">
        <FadingVideo
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4"
          className="absolute left-1/2 top-0 -translate-x-1/2 object-cover object-top z-0"
          style={{ width: "120%", height: "120%" }}
        />

        {/* Navbar */}
        <nav className="fixed top-4 left-0 right-0 px-8 lg:px-16 z-50 flex items-center justify-between pointer-events-none">
          <div className="w-12 h-12 liquid-glass rounded-full flex items-center justify-center pointer-events-auto">
            <span className="font-heading italic text-2xl lowercase mt-1">e</span>
          </div>

          <div className="hidden lg:flex items-center gap-1 liquid-glass rounded-full px-1.5 py-1.5 pointer-events-auto">
            {[
              { name: "Dashboard", href: "/login" },
              { name: "Features", href: "#features" },
              { name: "Integrations", href: "#integrations" },
              { name: "Pricing", href: "#pricing" },
              { name: "Support", href: "#support" }
            ].map((item) => (
              <Link key={item.name} href={item.href} className="px-3 py-2 text-sm font-medium text-white/90 font-body hover:bg-white/10 rounded-full transition-colors">
                {item.name}
              </Link>
            ))}
            <Link href="/signup" className="flex items-center gap-1 bg-white text-black px-4 py-2 rounded-full text-sm font-medium ml-2 whitespace-nowrap hover:bg-white/90 transition-colors">
              Try for free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
            </Link>
          </div>

          <div className="w-12 h-12 invisible" />
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center pt-24 px-4 text-center">
          <motion.div
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ delay: 0.4, ease: "easeOut" }}
            className="liquid-glass rounded-full flex items-center p-1 pr-4 mb-6"
          >
            <span className="bg-white text-black px-3 py-1 text-xs font-semibold rounded-full mr-3">v1.0</span>
            <span className="text-sm text-white/90 font-body">Ethara is now live for all teams</span>
          </motion.div>

          <BlurText 
            text="The Ultimate Team Task Manager" 
            className="text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-white leading-[0.8] max-w-4xl tracking-[-4px]"
          />

          <motion.p
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ delay: 0.8, ease: "easeOut" }}
            className="mt-6 text-sm md:text-base text-white/90 max-w-2xl font-body font-light leading-tight"
          >
            Ethara helps modern teams organize projects, track deadlines, and collaborate seamlessly in real-time. Stop losing track of work and start delivering faster.
          </motion.p>

          <motion.div
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ delay: 1.1, ease: "easeOut" }}
            className="flex items-center gap-6 mt-8"
          >
            <Link href="/signup" className="liquid-glass-strong rounded-full px-6 py-3 text-sm font-medium text-white flex items-center gap-2 hover:scale-105 transition-transform">
              Start Managing Tasks
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
            </Link>
            <Link href="/login" className="flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white transition-colors">
              View Dashboard
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>
            </Link>
          </motion.div>

          <motion.div
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ delay: 1.3, ease: "easeOut" }}
            className="flex items-stretch gap-4 mt-12"
          >
            <div className="liquid-glass p-5 w-[220px] rounded-[1.25rem] text-left">
              <svg className="w-7 h-7 text-white mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              <div className="text-4xl font-heading italic tracking-[-1px] leading-none">10h+</div>
              <div className="text-xs text-white/80 font-body font-light mt-2">Saved per week per user</div>
            </div>
            <div className="liquid-glass p-5 w-[220px] rounded-[1.25rem] text-left">
              <svg className="w-7 h-7 text-white mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" /></svg>
              <div className="text-4xl font-heading italic tracking-[-1px] leading-none">1M+</div>
              <div className="text-xs text-white/80 font-body font-light mt-2">Projects organized</div>
            </div>
          </motion.div>
        </div>

        {/* Partners */}
        <motion.div
          initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{ delay: 1.4, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center gap-4 pb-8 mt-auto"
        >
          <div className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white/90">
            Trusted by fast-growing teams everywhere
          </div>
          <div className="flex items-center gap-12 md:gap-16 font-heading italic text-2xl md:text-3xl tracking-tight text-white/80">
            <span>TechFlow</span>
            <span>DevSync</span>
            <span>AgileCorp</span>
            <span>TaskMaster</span>
            <span>ProSync</span>
          </div>
        </motion.div>
      </section>

      {/* Section 2 - Capabilities */}
      <section id="features" className="relative min-h-screen flex flex-col">
        <FadingVideo
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_094631_d30ab262-45ee-4b7d-99f3-5d5848c8ef13.mp4"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        <div className="relative z-10 px-8 md:px-16 lg:px-20 pt-24 pb-10 flex flex-col min-h-screen">
          <div className="mb-auto">
            <div className="text-sm font-body text-white/80 mb-6 uppercase tracking-wider">// Core Features</div>
            <h2 className="font-heading italic text-white text-6xl md:text-7xl lg:text-[6rem] leading-[0.9] tracking-[-3px]">
              Everything you need<br />to ship faster.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {/* Card 1 */}
            <div className="liquid-glass rounded-[1.25rem] p-6 min-h-[360px] flex flex-col group hover:-translate-y-1 transition-transform duration-500">
              <div className="flex items-start justify-between gap-4">
                <div className="w-11 h-11 liquid-glass rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21H5Zm1-4h12l-3.75-5-3 4L9 13l-3 4Z"/></svg>
                </div>
                <div className="flex flex-wrap justify-end gap-1.5 max-w-[70%]">
                  <span className="liquid-glass rounded-full px-3 py-1 text-[11px] text-white/90 font-body whitespace-nowrap">Real-time</span>
                  <span className="liquid-glass rounded-full px-3 py-1 text-[11px] text-white/90 font-body whitespace-nowrap">Kanban Boards</span>
                  <span className="liquid-glass rounded-full px-3 py-1 text-[11px] text-white/90 font-body whitespace-nowrap">Instant Sync</span>
                </div>
              </div>
              <div className="flex-1" />
              <div className="mt-6">
                <h3 className="font-heading italic text-white text-3xl md:text-4xl tracking-[-1px] leading-none mb-3">Real-time Sync</h3>
                <p className="text-sm text-white/90 font-body font-light leading-snug max-w-[32ch]">
                  See updates instantly across your entire team without ever refreshing the page. Task statuses and assignments update live.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="liquid-glass rounded-[1.25rem] p-6 min-h-[360px] flex flex-col group hover:-translate-y-1 transition-transform duration-500 delay-100">
              <div className="flex items-start justify-between gap-4">
                <div className="w-11 h-11 liquid-glass rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6.47 5.76 10H20v8H4V6.47M22 4h-4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.89-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4Z"/></svg>
                </div>
                <div className="flex flex-wrap justify-end gap-1.5 max-w-[70%]">
                  <span className="liquid-glass rounded-full px-3 py-1 text-[11px] text-white/90 font-body whitespace-nowrap">Admin Roles</span>
                  <span className="liquid-glass rounded-full px-3 py-1 text-[11px] text-white/90 font-body whitespace-nowrap">Secure Access</span>
                  <span className="liquid-glass rounded-full px-3 py-1 text-[11px] text-white/90 font-body whitespace-nowrap">Team Invite</span>
                </div>
              </div>
              <div className="flex-1" />
              <div className="mt-6">
                <h3 className="font-heading italic text-white text-3xl md:text-4xl tracking-[-1px] leading-none mb-3">Role-based Access</h3>
                <p className="text-sm text-white/90 font-body font-light leading-snug max-w-[32ch]">
                  Securely manage Admins and Members with fine-grained permissions. Control who can edit projects, assign tasks, or invite new users.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="liquid-glass rounded-[1.25rem] p-6 min-h-[360px] flex flex-col group hover:-translate-y-1 transition-transform duration-500 delay-200">
              <div className="flex items-start justify-between gap-4">
                <div className="w-11 h-11 liquid-glass rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1Zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7Z"/></svg>
                </div>
                <div className="flex flex-wrap justify-end gap-1.5 max-w-[70%]">
                  <span className="liquid-glass rounded-full px-3 py-1 text-[11px] text-white/90 font-body whitespace-nowrap">Data Export</span>
                  <span className="liquid-glass rounded-full px-3 py-1 text-[11px] text-white/90 font-body whitespace-nowrap">Progress Tracking</span>
                  <span className="liquid-glass rounded-full px-3 py-1 text-[11px] text-white/90 font-body whitespace-nowrap">Visual Reports</span>
                </div>
              </div>
              <div className="flex-1" />
              <div className="mt-6">
                <h3 className="font-heading italic text-white text-3xl md:text-4xl tracking-[-1px] leading-none mb-3">Analytics Dashboard</h3>
                <p className="text-sm text-white/90 font-body font-light leading-snug max-w-[32ch]">
                  Get deep insights into team performance. Instantly identify bottlenecks, track overdue tasks, and monitor overall project completion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 - Integrations */}
      <section id="integrations" className="relative min-h-[50vh] flex flex-col items-center justify-center bg-black/50 border-t border-white/10 px-4">
        <h2 className="font-heading italic text-white text-4xl md:text-5xl mb-4">Integrations</h2>
        <p className="text-white/70 font-body max-w-lg text-center">Seamlessly connect with the tools your team already uses. Coming in Q4 2026.</p>
      </section>

      {/* Section 4 - Pricing */}
      <section id="pricing" className="relative min-h-[50vh] flex flex-col items-center justify-center bg-black border-t border-white/10 px-4">
        <h2 className="font-heading italic text-white text-4xl md:text-5xl mb-4">Transparent Pricing</h2>
        <p className="text-white/70 font-body max-w-lg text-center">One simple plan. Everything you need to scale your team's productivity.</p>
        <Link href="/signup" className="mt-8 liquid-glass-strong rounded-full px-6 py-3 text-sm font-medium text-white hover:scale-105 transition-transform">
          Start your 14-day free trial
        </Link>
      </section>

      {/* Section 5 - Support */}
      <section id="support" className="relative min-h-[50vh] flex flex-col items-center justify-center bg-black/50 border-t border-white/10 px-4 pb-24">
        <h2 className="font-heading italic text-white text-4xl md:text-5xl mb-4">24/7 Support</h2>
        <p className="text-white/70 font-body max-w-lg text-center">Our team is always online to help you with your workflow.</p>
      </section>
    </div>
  );
}

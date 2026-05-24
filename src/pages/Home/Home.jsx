import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../../components/PageTransition/PageTransition';
import Hero from '../../components/Hero/Hero';
import Section from '../../components/Section/Section';
import Card from '../../components/Card/Card';
import {
  overviewContent,
  structureContent,
  solarSystemContent,
  celestialBodiesContent,
  explorationContent,
  faqContent,
} from '../../data/content';
import styles from './Home.module.css';

function OverviewSection() {
  return (
    <Section id="overview" title={overviewContent.title} intro={overviewContent.intro}>
      <div className={styles.statsGrid}>
        {overviewContent.stats.map((stat) => (
          <div key={stat.label} className={`${styles.statCard} reveal`}>
            <span className={styles.statIcon}>{stat.icon}</span>
            <span className={styles.statValue}>{stat.value}</span>
            <span className={styles.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>
      <p className={`${styles.overviewDesc} reveal`}>{overviewContent.description}</p>
    </Section>
  );
}

function StructureSection() {
  return (
    <Section id="structure" title={structureContent.title} intro={structureContent.intro}>
      <div className={styles.structureGrid}>
        {structureContent.parts.map((part) => (
          <Card
            key={part.title}
            title={part.title}
            description={part.description}
            accentColor={part.color}
            className={styles.structureCard}
          />
        ))}
      </div>
    </Section>
  );
}

function SolarSystemSection() {
  return (
    <Section id="solar-system" title={solarSystemContent.title} intro={solarSystemContent.intro}>
      <div className={styles.solarLayout}>
        <div>
          <div className={styles.solarInfo}>
            {solarSystemContent.details.map((d) => (
              <div key={d.label} className={`${styles.solarStat} reveal`}>
                <div className={styles.solarStatLabel}>{d.label}</div>
                <div className={styles.solarStatValue}>{d.value}</div>
              </div>
            ))}
          </div>
          <div className={`${styles.solarNote} reveal`}>{solarSystemContent.note}</div>
        </div>
        <div className={`${styles.solarDiagram} reveal`}>
          <svg className={styles.solarSvg} viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="200" cy="200" rx="180" ry="50" fill="none" stroke="rgba(139,92,246,0.3)" strokeWidth="1" strokeDasharray="4 4" transform="rotate(-20, 200, 200)" />
            <ellipse cx="200" cy="200" rx="160" ry="42" fill="none" stroke="rgba(139,92,246,0.2)" strokeWidth="1" transform="rotate(-20, 200, 200)" />
            <circle cx="200" cy="200" r="18" fill="rgba(245,158,11,0.2)" stroke="rgba(245,158,11,0.5)" strokeWidth="1.5" />
            <circle cx="200" cy="200" r="6" fill="#f59e0b" />
            <text x="200" y="235" textAnchor="middle" fill="#999" fontSize="11">银心</text>
            <circle cx="330" cy="155" r="5" fill="#3b82f6" stroke="#60a5fa" strokeWidth="2" />
            <line x1="330" y1="150" x2="330" y2="125" stroke="rgba(59,130,246,0.4)" strokeWidth="1" />
            <text x="330" y="118" textAnchor="middle" fill="#60a5fa" fontSize="11" fontWeight="600">太阳系</text>
            <text x="265" y="185" textAnchor="middle" fill="#666" fontSize="9">~2.6 万光年</text>
            <line x1="215" y1="195" x2="325" y2="158" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
    </Section>
  );
}

function CelestialBodiesSection() {
  return (
    <Section id="celestial-bodies" title={celestialBodiesContent.title} intro={celestialBodiesContent.intro}>
      <div className={styles.celestialGrid}>
        {celestialBodiesContent.items.map((item) => (
          <Card
            key={item.title}
            icon={item.icon}
            title={item.title}
            description={item.description}
            accentColor={item.color}
          />
        ))}
      </div>
    </Section>
  );
}

function ExplorationSection() {
  return (
    <Section id="exploration" title={explorationContent.title} intro={explorationContent.intro}>
      <div className={styles.timeline}>
        {explorationContent.milestones.map((m, i) => (
          <div key={m.year} className={`${styles.timelineItem} reveal`}>
            <div className={styles.timelineDot} style={{ animationDelay: `${i * 0.1}s` }} />
            <div className={styles.timelineYear}>{m.year}</div>
            <h3 className={styles.timelineTitle}>{m.title}</h3>
            <p className={styles.timelineDesc}>{m.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <Section id="faq" title={faqContent.title}>
      <div className={styles.faqList}>
        {faqContent.items.map((item, i) => (
          <div
            key={i}
            className={`${styles.faqItem} ${openIndex === i ? styles.open : ''} reveal`}
          >
            <button
              className={styles.faqQuestion}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              aria-expanded={openIndex === i}
            >
              {item.q}
              <span className={styles.faqArrow}>&#9660;</span>
            </button>
            <div className={styles.faqAnswer}>
              <p className={styles.faqAnswerInner}>{item.a}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function CtaSection() {
  return (
    <Section id="explore-more" title="探索更多星系">
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.8, fontSize: '1.05rem' }}>
          银河系只是宇宙中无数星系中的一个。前往星系列表，了解更多关于仙女座星系、三角座星系、大小麦哲伦云等本星系群成员的知识。
        </p>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link
            to="/galaxies"
            className={styles.ctaBtn}
          >
            浏览宇宙星系馆 &rarr;
          </Link>
        </motion.div>
      </div>
    </Section>
  );
}

export default function Home() {
  return (
    <PageTransition>
      <main>
        <Hero />
        <OverviewSection />
        <StructureSection />
        <SolarSystemSection />
        <CelestialBodiesSection />
        <ExplorationSection />
        <FaqSection />
        <CtaSection />
      </main>
    </PageTransition>
  );
}

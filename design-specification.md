# 🏥 Premium Care — Design Specification

> A comprehensive design blueprint for a premium, sleek health & care website.
> Built from the structural DNA of [DailyCare Support](https://dailycaresupport.com/) and the visual/motion language of [WellBase](https://wellbase.framer.website/), enhanced with cutting-edge UI patterns from [Amicro](https://amicro.vercel.app/buttons), [Recent.design](https://recent.design/), [Orbs](https://orbs.jakubantalik.com/), [BeautifulUI](https://www.beautifului.dev/), and [Generative Loaders](https://generativeloaders.com/).

---

## Table of Contents

1. [Brand Identity](#1-brand-identity)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Layout & Grid](#4-layout--grid)
5. [Site Structure & Pages](#5-site-structure--pages)
6. [Navigation](#6-navigation)
7. [Hero Section](#7-hero-section)
8. [Section-by-Section Design](#8-section-by-section-design)
9. [Component Library](#9-component-library)
10. [Forms](#10-forms)
11. [Animations & Micro-interactions](#11-animations--micro-interactions)
12. [Image & Media Strategy](#12-image--media-strategy)
13. [Footer](#13-footer)
14. [Responsive Design](#14-responsive-design)
15. [Accessibility](#15-accessibility)
16. [Tech Stack Recommendation](#16-tech-stack-recommendation)

---

## 1. Brand Identity

### Name
**Premium Care** — A premium health and disability support service provider.

### Tagline
*"We Are Here Because of You"* (adapted from DailyCare's positioning)

### Brand Personality
| Trait | Expression |
|-------|-----------|
| **Trustworthy** | Clean layouts, professional photography, muted palette |
| **Warm** | Rounded corners, soft shadows, human-centered imagery |
| **Modern** | Geometric sans-serif fonts, micro-animations, glass morphism |
| **Premium** | Generous whitespace, subtle gradients, refined detail work |

### Logo Direction
- Clean wordmark using **Geist** (semi-bold, 700 weight)
- "Premium" in the primary navy/teal color, "Care" in a lighter accent
- Optional: A minimal abstract mark — a stylized shield or leaf motif combining health + protection
- Keep it minimal, no more than 2 colors

---

## 2. Color System

### Primary Palette
Derived from WellBase's health-tech palette merged with DailyCare's warm professional tone.

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#1D4561` | Headings, primary nav, CTAs |
| `--color-primary-light` | `#3279AB` | Links, active states, hover accents |
| `--color-primary-dark` | `#0F2A3D` | Footer backgrounds, overlays |
| `--color-accent` | `#2EC4B6` | CTA buttons, success states, highlights |
| `--color-accent-warm` | `#FF6B6B` | Urgent notices, badges, appointment CTAs |

### Neutral Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bg` | `#FFFFFF` | Main background |
| `--color-bg-soft` | `#F1F3F5` | Section alternating backgrounds, cards |
| `--color-bg-muted` | `#F8F9FA` | Input fields, subtle containers |
| `--color-text` | `#1A1A2E` | Body text |
| `--color-text-secondary` | `#4C555F` | Descriptions, captions |
| `--color-text-muted` | `#7C8C9C` | Placeholders, timestamps |
| `--color-border` | `#E2E8F0` | Card borders, dividers |
| `--color-border-subtle` | `#6E83921F` | Transparent borders for glass effects |

### Gradient Overlays
```css
/* Hero gradient — inspired by WellBase */
--gradient-hero: linear-gradient(135deg, #1D4561 0%, #2EC4B6 50%, #F1F3F5 100%);

/* Card shimmer — subtle premium feel */
--gradient-card: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(241,243,245,0.6) 100%);

/* CTA glow */
--gradient-cta: linear-gradient(135deg, #2EC4B6 0%, #1D4561 100%);
```

### Dark Mode (Optional)
| Token | Value |
|-------|-------|
| `--dark-bg` | `#0F0F0F` |
| `--dark-surface` | `#1A1A2E` |
| `--dark-text` | `#F1F3F5` |
| `--dark-border` | `#2D3748` |

---

## 3. Typography

### Font Stack
Drawing from WellBase (Geist + Inter) and BeautifulUI's refined type system:

```css
/* Primary — headings & UI */
--font-primary: 'Geist', 'Geist Fallback', system-ui, sans-serif;

/* Secondary — body & long-form */
--font-secondary: 'Inter', 'Inter Placeholder', system-ui, sans-serif;

/* Mono — stats, numbers, badges */
--font-mono: 'Geist Mono', 'Geist Mono Fallback', monospace;
```

### Type Scale

| Element | Font | Size | Weight | Line Height | Letter Spacing | Color |
|---------|------|------|--------|-------------|----------------|-------|
| **H1 — Hero** | Geist | 64px / 4rem | 700 | 1.1 | -0.03em | `--color-primary` |
| **H2 — Section** | Geist | 48px / 3rem | 600 | 1.15 | -0.02em | `--color-primary` |
| **H3 — Card Title** | Geist | 28px / 1.75rem | 600 | 1.25 | -0.01em | `--color-text` |
| **H4 — Subsection** | Geist | 21px / 1.3125rem | 600 | 1.3 | -0.02em | `--color-text` |
| **Body Large** | Inter | 18px / 1.125rem | 400 | 1.7 | 0 | `--color-text` |
| **Body** | Inter | 16px / 1rem | 400 | 1.6 | 0 | `--color-text` |
| **Body Small** | Inter | 14px / 0.875rem | 400 | 1.5 | 0 | `--color-text-secondary` |
| **Caption** | Inter | 13px / 0.8125rem | 500 | 1.4 | 0.01em | `--color-text-muted` |
| **Label** | Geist | 12px / 0.75rem | 600 | 1.3 | 0.05em | `--color-text-muted` |
| **Stat Number** | Geist Mono | 48px / 3rem | 700 | 1 | -0.02em | `--color-accent` |
| **Nav Link** | Geist | 15px / 0.9375rem | 500 | 1 | 0 | `--color-text` |
| **Button** | Geist | 15px / 0.9375rem | 600 | 1 | 0 | White / Primary |

### Mobile Adjustments
| Element | Desktop | Mobile |
|---------|---------|--------|
| H1 | 64px | 36px |
| H2 | 48px | 28px |
| H3 | 28px | 22px |
| Body | 16px | 15px |

---

## 4. Layout & Grid

### Container
```css
--container-max: 1200px;     /* WellBase uses 1130–1200px */
--container-padding: 24px;   /* 40px on tablet, 20px on mobile */
```

### Grid System
- **12-column** grid for main layouts
- **Gap**: `24px` desktop, `16px` mobile
- **Section spacing**: `120px` between major sections (desktop), `80px` mobile

### Breakpoints
Derived from WellBase's Framer breakpoints:

| Breakpoint | Width | Label |
|-----------|-------|-------|
| `xs` | 0–480px | Mobile |
| `sm` | 481–809px | Mobile Large |
| `md` | 810–1199px | Tablet |
| `lg` | 1200px+ | Desktop |

### Spacing Scale (rem)
```
4px  → 0.25rem
8px  → 0.5rem
12px → 0.75rem
16px → 1rem
20px → 1.25rem
24px → 1.5rem
32px → 2rem
40px → 2.5rem
48px → 3rem
64px → 4rem
80px → 5rem
120px → 7.5rem
```

---

## 5. Site Structure & Pages

Based directly on DailyCare Support's navigation structure, adapted for Premium Care:

### Pages (8 total)

| # | Page | Route | Purpose |
|---|------|-------|---------|
| 1 | **Home** | `/` | Hero, services overview, values, testimonials, blog preview, CTA |
| 2 | **About Us** | `/about` | Company story, mission/vision, team, core values |
| 3 | **Our Services** | `/services` | Full service catalog with detailed descriptions |
| 4 | **NDIS Information** | `/ndis` | NDIS eligibility, plan management, FAQs |
| 5 | **Careers** | `/careers` | Open positions, culture, application form |
| 6 | **Blog** | `/blog` | Articles, resources, health tips (grid layout) |
| 7 | **Contact** | `/contact` | Contact form, map, office details, appointment booking |
| 8 | **Referral** | `/referral` | Referral submission form for healthcare providers |

### Additional Routes
- `/blog/:slug` — Individual blog post
- `/services/:slug` — Individual service detail
- `/privacy-policy` — Legal
- `/terms-of-service` — Legal
- `/portal` — Member/client login portal (links out or modal)

---

## 6. Navigation

### Desktop Header (Fixed/Sticky)
Adapted from WellBase's clean horizontal nav merged with DailyCare's structure:

```
┌──────────────────────────────────────────────────────┐
│  [Logo]          Nav Links              [CTA Button] │
│  Premium Care    Home | About | Services | NDIS |    │
│                  Careers | Blog | Contact            │
│                                     [Book a Call →]  │
└──────────────────────────────────────────────────────┘
```

**Specs:**
- **Height**: 72px (desktop), 56px (mobile)
- **Background**: `rgba(255, 255, 255, 0.85)` with `backdrop-filter: blur(12px)`
- **Border bottom**: `1px solid var(--color-border-subtle)`
- **Logo**: Left-aligned, 146px × 26px (similar to WellBase)
- **Nav links**: Centered, Geist 15px/500, `gap: 32px`
  - Hover: color transition to `--color-primary-light`, 200ms ease
  - Active: `--color-primary` with a small dot indicator below (inspired by Recent.design's sidebar active dot)
- **CTA**: Right-aligned pill button "Book a Call" / "Get Started"
- **Sticky behavior**: Shrinks to 64px on scroll, subtle shadow appears

### Mobile Header
- Hamburger icon (right side) → Off-canvas drawer slides from right
- Drawer: Full-height, white bg, nav links stacked vertically
- Close icon: X mark top-right
- CTA button at bottom of drawer

### Mobile Navigation Drawer
```
┌─────────────────────────┐
│              [X Close]  │
│                         │
│  Home                   │
│  About Us               │
│  Our Services           │
│  NDIS Information       │
│  Careers                │
│  Blog                   │
│  Contact                │
│                         │
│  ─────────────────────  │
│  📞 1300-XXX-XXX        │
│  📧 hello@premiumcare…  │
│                         │
│  [Book a Consultation]  │
└─────────────────────────┘
```

---

## 7. Hero Section

Inspired heavily by WellBase's hero with DailyCare's healthcare messaging.

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│     [Tag Badge: "Premium Health Services"]                       │
│                                                                  │
│     Empowering Lives                                             │
│     Through Exceptional Care                                     │
│                                                                  │
│     We provide personalized disability support and               │
│     healthcare services that transform lives and                 │
│     build stronger communities.                                  │
│                                                                  │
│     [Get Started →]    [Learn More]                              │
│                                                                  │
│     ┌──────────────────────────────────────────────┐             │
│     │                                              │             │
│     │         Hero Image / Video                   │             │
│     │     (Happy clients + caregivers,             │             │
│     │      warm, diverse, professional)            │             │
│     │                                              │             │
│     │                                              │             │
│     └──────────────────────────────────────────────┘             │
│                                                                  │
│     ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│     │  500+   │  │   98%   │  │   24/7   │  │  15yrs  │         │
│     │ Clients │  │ Satis.  │  │ Support  │  │  Exp.   │         │
│     └─────────┘  └─────────┘  └─────────┘  └─────────┘         │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Tag Badge (top of hero)
- Small pill: `px-3 py-1`, `border-radius: 9999px`
- Background: `--color-bg-soft` with subtle border
- Text: Caption size, `--color-text-muted`
- Optional: Small green dot pulse indicator before text

### Hero Headline
- **H1**: "Empowering Lives Through Exceptional Care"
- Font: Geist, 64px, weight 700, `letter-spacing: -0.03em`
- Max-width: `720px`, centered
- Color: `--color-primary-dark`

### Sub-headline
- Inter, 18px, weight 400, `line-height: 1.7`
- Color: `--color-text-secondary`
- Max-width: `580px`, centered

### CTA Buttons (Amicro-inspired)
- **Primary**: Solid pill, `--gradient-cta`, white text, `h-[48px] px-8 rounded-full`
  - Hover: scale(1.02), subtle glow shadow
  - Active: scale(0.97) (from Amicro's spring press)
  - Arrow icon slides right on hover → `transform: translateX(4px)`
- **Secondary**: Ghost pill, transparent bg, `border: 1.5px solid --color-border`, primary text
  - Hover: bg fills with `--color-bg-soft`

### Hero Image
- **Source**: Lift images from WellBase — healthcare/medical professionals, technology interfaces, people
- **Style**: Large rounded rectangle `border-radius: 20px`
- Shadow: `0 24px 80px rgba(0,0,0,0.08)`
- Optional: Subtle floating UI cards overlaid on the image (like WellBase's dashboard mockups)

### Stats Bar
- Horizontal row below hero image
- 4 stats in a grid, each with:
  - **Number**: Geist Mono, 48px, `--color-accent`, tabular-nums
  - **Label**: Inter, 14px, `--color-text-muted`
  - Separator: thin vertical line between stats (on desktop)
  - Animation: Numbers count up on scroll-into-view

---

## 8. Section-by-Section Design

### 8.1 Core Values Section
*(from DailyCare: Integrity, Compassion, Excellence, Collaboration)*

```
┌─────────────────────────────────────────────────┐
│  [Section Tag: "What We Stand For"]             │
│                                                 │
│  Our Core Values                                │
│                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │   🛡️     │ │   ❤️     │ │   ⭐     │        │
│  │Integrity │ │Compassion│ │Excellence│        │
│  │  desc..  │ │  desc..  │ │  desc..  │        │
│  └──────────┘ └──────────┘ └──────────┘        │
│            ┌──────────┐                         │
│            │   🤝     │                         │
│            │Collabor. │                         │
│            │  desc..  │                         │
│            └──────────┘                         │
└─────────────────────────────────────────────────┘
```

- **Cards**: `bg-white`, `border-radius: 16px`, `shadow: 0 1px 3px rgba(0,0,0,0.06)`
- **Icon**: 48px custom line icon or Lucide icon, colored `--color-accent`
- **Hover**: Card lifts `translateY(-4px)`, shadow deepens
- **Animation**: Staggered `fadeInUp`, 80ms delay between cards (from BeautifulUI's stagger pattern)

### 8.2 Our Services Section

```
┌────────────────────────────────────────────────────┐
│  [Tag: "What We Offer"]                            │
│                                                    │
│  Our Services                                      │
│                                                    │
│  ┌─────────────────────────┐ ┌──────────────────┐  │
│  │ [Image]                 │ │ Service 2        │  │
│  │ Disability Support      │ │ [Image]          │  │
│  │ Description text...     │ │ Personal Care    │  │
│  │ [Learn More →]          │ │ Description...   │  │
│  └─────────────────────────┘ │ [Learn More →]   │  │
│                              └──────────────────┘  │
│  ┌──────────────────┐ ┌────────────────────────┐   │
│  │ Service 3        │ │ Service 4              │   │
│  │ Community Access  │ │ Respite Care           │   │
│  └──────────────────┘ └────────────────────────┘   │
│                                                    │
│  [View All Services →]                             │
└────────────────────────────────────────────────────┘
```

**Services (from DailyCare):**
1. Disability Support Services
2. Personal Care & Assistance
3. Community Access & Participation
4. Respite Care
5. Supported Independent Living (SIL)
6. Support Coordination
7. Allied Health Services
8. Transport Assistance

**Card Style:**
- Bento-grid layout (mixed 2×2 and 1×2 ratios)
- Image fills top 60% of card, content below
- `border-radius: 20px`, `overflow: hidden`
- Hover: Image scales 1.03, arrow icon slides right
- Background: white cards on `--color-bg-soft` section

### 8.3 Tabbed Content Section
*(from DailyCare's tab widget)*

- **Tab bar**: Horizontal pills with segmented-control style (from BeautifulUI/Generative Loaders)
- Active tab: filled bg `--color-primary`, white text
- Inactive: transparent, `--color-text-muted`
- Content animates with a subtle `fadeIn` + `translateY(8px)` transition
- Tabs: "Our Mission" | "Our Vision" | "Our Approach"

### 8.4 Testimonials Section

```
┌──────────────────────────────────────────────────┐
│  [Tag: "Client Stories"]                         │
│                                                  │
│  What Our Clients Say                            │
│                                                  │
│  ┌─────────────────────────────────────────────┐ │
│  │  "Premium Care changed our family's life.   │ │
│  │   The support workers are incredible..."    │ │
│  │                                             │ │
│  │   [Avatar] Sarah M. — Parent & Carer        │ │
│  │   ⭐⭐⭐⭐⭐                                  │ │
│  └─────────────────────────────────────────────┘ │
│                                                  │
│       ← ● ○ ○ ○ →                               │
│                                                  │
└──────────────────────────────────────────────────┘
```

- **Carousel**: Swiper-style (DailyCare uses Swiper), auto-play 5s
- **Quote card**: Max-width 700px, centered, large quote text (20px italic)
- **Avatar**: 48px round, with name + role beside it
- **Stars**: Gold/amber accent color
- **Controls**: Minimal arrows + dot pagination

### 8.5 Blog Preview Section

```
┌──────────────────────────────────────────────────┐
│  [Tag: "Latest Insights"]                        │
│                                                  │
│  From Our Blog                                   │
│                                                  │
│  ┌────────┐  ┌────────┐  ┌────────┐             │
│  │ [Img]  │  │ [Img]  │  │ [Img]  │             │
│  │ Title  │  │ Title  │  │ Title  │             │
│  │ Date   │  │ Date   │  │ Date   │             │
│  │ Excerpt│  │ Excerpt│  │ Excerpt│             │
│  │ Read → │  │ Read → │  │ Read → │             │
│  └────────┘  └────────┘  └────────┘             │
│                                                  │
│  [View All Posts →]                              │
└──────────────────────────────────────────────────┘
```

- 3-column grid on desktop, scrollable on mobile
- Card: image top, title, meta date, excerpt, "Read More" link
- Hover: entire card lifts, image zooms slightly

### 8.6 Newsletter / Email Signup
*(from DailyCare's Mailchimp integration)*

```
┌──────────────────────────────────────────────────┐
│                                                  │
│   Stay Updated with Premium Care                 │
│   Get health tips and community updates          │
│                                                  │
│   ┌──────────────────────┐ ┌───────────────┐     │
│   │ Enter your email     │ │  Subscribe →  │     │
│   └──────────────────────┘ └───────────────┘     │
│                                                  │
└──────────────────────────────────────────────────┘
```

- Full-width section with `--color-primary-dark` background
- White text, centered
- Input: `h-[52px]`, rounded-full, white bg
- Button: `--color-accent` pill, inline with input

---

## 9. Component Library

### 9.1 Buttons

Inspired by **Amicro** micro-transitions and WellBase's clean pill buttons:

| Variant | Style | Animation |
|---------|-------|-----------|
| **Primary** | Filled pill, gradient bg, white text | `active:scale(0.97)`, glow shadow on hover |
| **Secondary** | Outlined pill, transparent bg, border | Fill bg on hover with subtle transition |
| **Ghost** | No border, no bg, primary text | Underline slides in from left on hover |
| **Icon** | Circle, 40px, subtle bg | Rotate or bounce icon on hover |
| **CTA Large** | Wide pill, gradient, arrow icon | Arrow translates right on hover, spring ease |

```css
/* Button base — inspired by Amicro */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: var(--font-primary);
  font-weight: 600;
  font-size: 15px;
  border-radius: 9999px;
  transition: all 200ms cubic-bezier(0.23, 1, 0.32, 1);
  cursor: pointer;
  user-select: none;
}

.btn:active {
  transform: scale(0.97);
}

.btn-primary {
  background: var(--gradient-cta);
  color: white;
  padding: 12px 28px;
  box-shadow: 0 2px 8px rgba(46, 196, 182, 0.25);
}

.btn-primary:hover {
  box-shadow: 0 4px 20px rgba(46, 196, 182, 0.4);
  transform: translateY(-1px);
}
```

### 9.2 Cards

| Type | Usage | Style |
|------|-------|-------|
| **Service Card** | Services grid | Image + text, 20px radius, lift on hover |
| **Value Card** | Core values | Icon + heading + desc, centered, 16px radius |
| **Testimonial Card** | Carousel | Large quote, avatar row, centered text |
| **Blog Card** | Blog grid | Vertical image+content, metadata row |
| **Stat Card** | Stats section | Number + label, transparent bg |
| **Feature Card** | Feature highlight | Icon left + text right, border-bottom divider |

### 9.3 Tags / Badges

- **Section Tag**: Small pill above section heading
  - `h-[28px] px-3 rounded-full text-[13px]`
  - Background: `--color-bg-soft`, border: `1px solid --color-border`
  - Optional green dot prefix (pulse animation)
- **Status Badge**: "NDIS Registered", "Available 24/7"
  - Colored variant with tinted background

### 9.4 Loaders & Thinking States
*(from Generative Loaders + Orbs + BeautifulUI)*

- **Page transitions**: Skeleton shimmer loaders (Generative Loaders' skeleton variant)
- **Form submissions**: Thinking orb animation (from Orbs — dotted thought-orb)
- **Content loading**: Pixel-grid loader with shimmer text (BeautifulUI's "Churning" loader)
- **Image loading**: Progressive blur-to-sharp reveal

```css
/* Shimmer text effect — from BeautifulUI */
@keyframes shimmer-text {
  0% { background-position: 100% 50%; }
  100% { background-position: -100% 50%; }
}

.shimmer-text {
  background-image: linear-gradient(
    90deg,
    var(--color-text-muted) 35%,
    var(--color-text) 50%,
    var(--color-text-muted) 65%
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer-text 1.4s linear infinite;
}
```

---

## 10. Forms

### 10.1 Appointment Booking Form
*(Primary form from DailyCare — present on homepage + contact page)*

**Fields:**
| Field | Type | Required |
|-------|------|----------|
| Full Name | Text input | ✅ |
| Email Address | Email input | ✅ |
| Phone Number | Tel input | ✅ |
| Service Needed | Select dropdown | ✅ |
| Preferred Date | Date picker | ✅ |
| Preferred Time | Time picker (HH:MM + AM/PM) | ✅ |
| Message | Textarea | ❌ |
| **Submit** | Button: "Schedule an Appointment" | — |

### 10.2 Contact Form
**Fields:** Name, Email, Phone, Subject, Message, Submit

### 10.3 Referral Form
**Fields:** Referrer Name, Referrer Organization, Referrer Email, Referrer Phone, Client Name, Client Phone, Services Required (multi-select), NDIS Number, Additional Notes, Submit

### 10.4 Newsletter Signup
**Fields:** Email only + Subscribe button (inline)

### Form Styling

```css
/* Input base */
.form-input {
  width: 100%;
  height: 52px;
  padding: 0 20px;
  font-family: var(--font-secondary);
  font-size: 15px;
  color: var(--color-text);
  background: var(--color-bg-muted);
  border: 1.5px solid var(--color-border);
  border-radius: 14px;
  outline: none;
  transition: border-color 200ms ease, box-shadow 200ms ease;
}

.form-input:focus {
  border-color: var(--color-primary-light);
  box-shadow: 0 0 0 3px rgba(50, 121, 171, 0.12);
}

.form-input::placeholder {
  color: var(--color-text-muted);
}

/* Textarea */
.form-textarea {
  height: 140px;
  padding: 16px 20px;
  resize: vertical;
  border-radius: 16px;
}

/* Select */
.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,...chevron-down...");
  background-position: right 16px center;
  background-repeat: no-repeat;
}
```

**Validation states:**
- Error: Red border `#FF6B6B`, red text below input
- Success: Green border `#2EC4B6`, check icon
- Loading: Subtle pulse border animation

**Submit animation:**
- On click → button text fades to thinking orb (Orbs-inspired)
- On success → orb morphs to checkmark, text says "Submitted!"
- On error → shake animation, orb turns red

---

## 11. Animations & Micro-interactions

### 11.1 Scroll Animations (Framer Motion / GSAP)

| Element | Animation | Trigger | Duration | Easing |
|---------|-----------|---------|----------|--------|
| Section headings | `fadeInUp` | Scroll into view | 600ms | `cubic-bezier(0.23, 1, 0.32, 1)` |
| Cards (staggered) | `fadeInUp` | Scroll into view | 450ms + 80ms stagger | Same cubic-bezier |
| Stats numbers | Count-up | Scroll into view | 2000ms | `ease-out` |
| Images | Scale 0.95→1 + opacity 0→1 | Scroll into view | 800ms | Same cubic-bezier |
| Testimonial carousel | Slide left/right | Auto + manual | 500ms | `ease-in-out` |

### 11.2 Hover Interactions (Amicro-inspired)

| Element | Hover Effect |
|---------|-------------|
| **Buttons** | `scale(1.02)`, shadow deepens, arrow icon translates |
| **Cards** | `translateY(-4px)`, shadow expands, image zooms 1.03 |
| **Nav links** | Color transitions, underline slides in from left |
| **Social icons** | `scale(1.1)`, color fills in |
| **Images** | Subtle zoom 1.02 with `overflow: hidden` container |
| **Footer links** | Color change + slight translateX(2px) |

### 11.3 Page Transitions

- **Route change**: Content fades out (`opacity: 0, translateY: 8px`) → new content fades in
- **Duration**: 300ms out, 400ms in
- **Progress indicator**: Thin accent-colored progress bar at very top of viewport

### 11.4 Loading States (Generative Loaders + BeautifulUI)

| State | Implementation |
|-------|---------------|
| **Page load** | Skeleton shimmer (Generative Loaders' skeleton variant) |
| **Image load** | Progressive blur → sharp with fade |
| **Form submit** | Thinking orb (Orbs) → success/error state |
| **Data fetch** | Pixel-grid shimmer (BeautifulUI) |
| **Content stream** | Typewriter text reveal (Generative Loaders) |

### 11.5 Special Animations

**Orb Background (from Orbs)**:
- Subtle animated gradient orb in the hero background
- Uses canvas or CSS for performance
- Slow-moving, blurred, low-opacity teal/blue gradient spheres
- Auto dark/light theme awareness

**Stagger cascade (from BeautifulUI)**:
```css
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Apply staggered: 60ms offset per item */
.stagger-item:nth-child(1) { animation-delay: 0ms; }
.stagger-item:nth-child(2) { animation-delay: 60ms; }
.stagger-item:nth-child(3) { animation-delay: 120ms; }
.stagger-item:nth-child(4) { animation-delay: 180ms; }
```

---

## 12. Image & Media Strategy

### Image Sources
- **Hero & section images**: Lift from [WellBase](https://wellbase.framer.website/) — they use modern healthcare/science imagery with clean compositions
  - Key images to reference from WellBase's Framer CDN:
    - Healthcare professionals with tech interfaces
    - Clean medical/lab environments
    - People in wellness/health contexts
    - Abstract health-tech dashboard screenshots
- **Supplementary**: Use high-quality stock from Unsplash/Pexels for:
  - Diverse families & caregivers
  - People with disabilities receiving care
  - Community activities
  - Healthcare workers

### Image Treatment
| Type | Radius | Shadow | Aspect Ratio |
|------|--------|--------|-------------|
| Hero image | 20px | `0 24px 80px rgba(0,0,0,0.08)` | 16:9 |
| Service card image | 20px (top only) | None (card has shadow) | 4:3 |
| Blog thumbnail | 16px | None | 3:2 |
| Team photo | 50% (circle) | `0 4px 12px rgba(0,0,0,0.1)` | 1:1 |
| Testimonial avatar | 50% (circle) | None | 1:1 |

### Video
- Hero section can optionally use a short (15s) background video
- Auto-play, muted, looped
- Overlaid with semi-transparent gradient
- Fallback to static image on mobile for performance

### Favicon & Social
- Favicon: 32×32 simplified logo mark
- OG image: 1200×630 branded card with tagline
- Apple touch icon: 180×180

---

## 13. Footer

Based on DailyCare's comprehensive footer, elevated with WellBase's clean aesthetic:

```
┌────────────────────────────────────────────────────────────┐
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Logo +   │  │ Quick    │  │ Our      │  │ Contact  │  │
│  │ About    │  │ Links    │  │ Services │  │ Info     │  │
│  │ brief    │  │          │  │          │  │          │  │
│  │          │  │ Home     │  │ Disab.   │  │ Phone    │  │
│  │ Social   │  │ About    │  │ Personal │  │ Email    │  │
│  │ Icons    │  │ Services │  │ Commun.  │  │ Address  │  │
│  │ f t in y │  │ NDIS     │  │ Respite  │  │ Hours    │  │
│  │          │  │ Blog     │  │ SIL      │  │          │  │
│  │          │  │ Contact  │  │ Allied   │  │          │  │
│  │          │  │ Careers  │  │          │  │          │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                            │
│  ─────────────────────────────────────────────────────     │
│                                                            │
│  ┌──────────────────────────────────────────────────┐      │
│  │ Newsletter: [Email input] [Subscribe]            │      │
│  └──────────────────────────────────────────────────┘      │
│                                                            │
│  ─────────────────────────────────────────────────────     │
│                                                            │
│  © 2026 Premium Care. All rights reserved.                 │
│  Privacy Policy  |  Terms of Service  |  NDIS Provider     │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Style:**
- Background: `--color-primary-dark` (`#0F2A3D`)
- Text: `#FFFFFF` at 85% opacity
- Link hover: `--color-accent` (`#2EC4B6`)
- Social icons: 24px, row, `gap: 12px`, ghost style → fill on hover
- Dividers: `1px solid rgba(255,255,255,0.1)`
- Grid: 4 columns on desktop, 2 on tablet, stacked on mobile
- Bottom bar: Small text, centered

---

## 14. Responsive Design

### Mobile-First Approach

| Component | Desktop (1200px+) | Tablet (810–1199px) | Mobile (< 810px) |
|-----------|-------------------|---------------------|-------------------|
| Nav | Horizontal links | Horizontal (condensed) | Hamburger drawer |
| Hero | Text left + image right OR centered | Centered, stacked | Centered, stacked, smaller |
| Services grid | 2×2 bento | 2 columns | 1 column cards |
| Values grid | 4 columns | 2 columns | 1 column |
| Blog preview | 3 columns | 2 columns | Horizontal scroll |
| Footer | 4 columns | 2×2 grid | 1 column stacked |
| Stats bar | 4 inline | 2×2 grid | 2×2 grid |
| Form fields | 2 per row | 2 per row | 1 per row (stacked) |
| Section padding | 120px | 80px | 60px |

### Touch Interactions
- Carousels: Swipe-enabled
- Buttons: Minimum tap target 44×44px
- Bottom sheet modals instead of popups on mobile

---

## 15. Accessibility

### WCAG 2.1 AA Compliance

| Requirement | Implementation |
|-------------|---------------|
| **Color contrast** | All text meets 4.5:1 ratio minimum |
| **Focus indicators** | Visible `outline: 2px solid --color-primary-light` with `outline-offset: 2px` |
| **Alt text** | All images have descriptive alt attributes |
| **Keyboard nav** | Full keyboard navigation, skip-to-content link |
| **ARIA labels** | Proper `aria-label`, `aria-live`, `role` on interactive elements |
| **Motion** | Respect `prefers-reduced-motion` — disable all animations |
| **Font sizing** | All rem-based, respects browser zoom |
| **Form labels** | Every input has associated `<label>` |
| **Error messages** | Connected via `aria-describedby` |
| **Screen reader** | Semantic HTML5, proper heading hierarchy |

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 16. Tech Stack Recommendation

| Layer | Technology | Reason |
|-------|-----------|--------|
| **Framework** | Next.js 15 (App Router) | SSR, SEO, performance, file-based routing |
| **Styling** | Tailwind CSS v4 + CSS variables | Utility-first, design tokens, fast iteration |
| **Animations** | Framer Motion v11 | Declarative, scroll-triggered, page transitions |
| **UI Components** | shadcn/ui + Radix Primitives | Accessible, unstyled, composable |
| **Forms** | React Hook Form + Zod | Validation, performance, TypeScript |
| **CMS** | Sanity / Contentful | Blog content, team bios, service descriptions |
| **Email** | Resend + React Email | Newsletter, form confirmations |
| **Analytics** | Vercel Analytics / Plausible | Privacy-friendly, performance insights |
| **Hosting** | Vercel | Edge functions, image optimization, CI/CD |
| **Images** | next/image + Cloudinary | Optimization, responsive, format conversion |

---

## Reference Links Summary

| Resource | What to use from it |
|----------|-------------------|
| [DailyCare Support](https://dailycaresupport.com/) | Site structure, pages, navigation tabs, forms, footer layout, service categories, testimonials |
| [WellBase](https://wellbase.framer.website/) | Visual design language, hero flows, animations, color palette, image assets, typography (Geist + Inter), layout system |
| [Amicro](https://amicro.vercel.app/buttons) | Button micro-transitions, hover effects, spring press animations, interaction patterns |
| [Recent.design](https://recent.design/) | Modern minimal navigation patterns, sidebar active indicators, card layouts, clean aesthetic |
| [Orbs](https://orbs.jakubantalik.com/) | Thinking/loading orb animations, AI-style loading states, dark/light awareness |
| [BeautifulUI](https://www.beautifului.dev/) | Staggered fade-up animations, shimmer text, task rows, refined component patterns, `cubic-bezier(0.23, 1, 0.32, 1)` easing |
| [Generative Loaders](https://generativeloaders.com/) | Skeleton loaders, typewriter text, decode text effect, page loading states |

---

> [!TIP]
> **Next Step**: Use this spec to generate individual page mockups, starting with the homepage. Each section can be built as a standalone component and composed together.

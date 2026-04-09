export interface ServiceFeature {
  title: string;
  description: string;
}

export interface ServiceStep {
  step: number;
  title: string;
  description: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceContent {
  slug: string;
  name: string;
  heroHeadline: string;
  heroSubheadline: string;
  areaHeroHeadline: string; // contains {area} placeholder
  areaHeroSubheadline: string; // contains {area} placeholder
  description: string;
  features: ServiceFeature[];
  process: ServiceStep[];
  faqs: ServiceFAQ[];
  meta: {
    title: string;
    description: string;
    keywords: string[];
  };
  areaMeta: {
    title: string; // contains {area} placeholder
    description: string; // contains {area} placeholder
  };
  image: string; // path to hero image
}

export const services: Record<string, ServiceContent> = {
  guttering: {
    slug: 'guttering',
    name: 'Guttering',
    heroHeadline: 'Guttering Sorted Properly.',
    heroSubheadline:
      'Blocked, leaking, or falling away from the wall — I fix gutters across Kent. Most jobs done same day. No call-out fee, fixed price upfront.',
    areaHeroHeadline: 'Guttering Repairs in {area}',
    areaHeroSubheadline:
      'Leaking or blocked gutters in {area}? I\'ll inspect, fix, or replace — and give you a firm price before touching anything.',
    description: `Gutters are the part of the house everyone ignores until they cause a serious problem. By the time you notice a damp patch on an inside wall, or the render starting to blow, the water has usually been getting in for months. That's the thing about gutter problems — they're quiet until they're expensive.

I've been fixing gutters across Kent for 25 years. In that time I've cleared out everything you can imagine — moss, leaves, tennis balls, bird nests, the lot. More importantly, I've seen what happens when gutters are left too long: saturated wall ties, rotting fascias, cracked render, rising damp. Keeping your guttering in decent shape isn't fussiness. It's cheap insurance against a much bigger bill.

When I come out, I start with a proper inspection. Not just a quick glance from the ground — I'll get up there, clear any blockages, and check every joint, bracket, and downpipe. I photograph what I find so you can see exactly what the problem is. A lot of the time it's a simple blockage or a failed joint seal that takes twenty minutes to sort. I'll tell you honestly if that's the case. I won't invent extra work.

For repairs, I carry standard UPVC fittings in white, black, and brown — the three colours that cover most Kent properties. If you've got cast iron guttering on an older house, I can work with that too. Cast iron looks great when it's maintained, and it's worth repainting and sealing rather than ripping out where possible. For aluminium systems, same story — I'll repair before I replace.

When replacement is the right answer, I'll match what you've got or advise on upgrading. Round, square, half-round — I'll explain the differences and fit whichever suits the property. All new installations are fitted with the correct fall, proper gutter clips at the right spacing, and sealed joints that won't fail in the first frost.

Downpipes get checked as part of every job. A perfectly clear gutter is pointless if the downpipe is blocked solid three feet down. I rodding from the bottom up and jet-clear if needed.

You get a fixed price before I start. If I find something unexpected once I'm up there — a rotten fascia board behind the gutter bracket, for example — I'll come down and tell you before I do anything about it. No surprises on the invoice.`,
    features: [
      {
        title: 'Full inspection included',
        description:
          'I check every joint, bracket, and downpipe — not just the obvious blockage. You get photos of anything worth knowing about.',
      },
      {
        title: 'UPVC, cast iron, aluminium',
        description:
          'I work with all gutter materials. Cast iron repaired and painted, UPVC matched and replaced, aluminium sealed and secured.',
      },
      {
        title: 'Downpipes cleared too',
        description:
          'A clear gutter means nothing if the downpipe is blocked. Every job includes a downpipe check as standard.',
      },
      {
        title: 'Fixed price, no surprises',
        description:
          'You\'ll know the full cost before I start. If I find extra problems up there, I tell you first — I don\'t just crack on and add it to the bill.',
      },
      {
        title: 'Same-day repairs possible',
        description:
          'Most gutter repairs and clears can be done on the day I visit. I carry standard fittings so there\'s no waiting for parts.',
      },
      {
        title: 'Fascia condition check',
        description:
          'While I\'m up there I\'ll check the fascia boards behind the gutters. Rot found early is far cheaper to deal with than rot found late.',
      },
    ],
    process: [
      {
        step: 1,
        title: 'Call me directly',
        description:
          'You speak to me, not a call centre. Tell me what you\'ve noticed — a drip, a damp patch, gutters pulling away — and I\'ll give you an honest idea of what\'s likely involved.',
      },
      {
        step: 2,
        title: 'I inspect and photograph',
        description:
          'I\'ll come out, get up to the gutters, clear any debris, and check the whole run. I photograph the problem so you can see exactly what I\'m dealing with.',
      },
      {
        step: 3,
        title: 'Fixed quote before I start',
        description:
          'You get a firm price. Simple repairs are quoted on the spot. If replacement sections are needed, I\'ll tell you what and why before ordering anything.',
      },
      {
        step: 4,
        title: 'Job done, site left clean',
        description:
          'I do the work, clear the debris, and leave your property tidy. Most gutter jobs are finished within a couple of hours.',
      },
    ],
    faqs: [
      {
        question: 'How often should gutters be cleaned?',
        answer:
          'Twice a year is the sensible answer — once in late autumn after the leaves have fallen, once in spring to clear winter debris. If you\'ve got overhanging trees, you might need it more often. Once a year is better than never. Leaving gutters blocked for years is how walls get damp.',
      },
      {
        question: 'My gutters are leaking at the joints. Can you repair them or do they need replacing?',
        answer:
          'Usually repairable. Gutter joints fail when the sealant dries out — it\'s a normal maintenance job. I clean the joint, dry it out, and reseal with a proper gutter sealant. If the plastic itself has cracked or warped badly, that section gets replaced. I\'ll tell you which it is when I\'m up there.',
      },
      {
        question: 'Can you match my existing guttering style and colour?',
        answer:
          'Most of the time, yes. I carry standard UPVC in white, black, and brown, and I stock the most common profiles — round, square, and half-round. For unusual or older systems, I\'ll identify the profile and source matching parts. Cast iron I can repaint to match. If something\'s genuinely obsolete, I\'ll explain your options.',
      },
      {
        question: 'There\'s a damp patch on my interior wall near the guttering. Is that definitely the gutters?',
        answer:
          'Often, yes — but not always. A blocked or leaking gutter is a common cause of damp patches on upper floors and near corners. But it could also be a flashing issue, a cracked render, or a pointing problem. I\'ll check the guttering while I\'m there and tell you honestly whether that\'s the source. If it\'s coming from somewhere else, I\'ll tell you that too.',
      },
      {
        question: 'Do you repair cast iron gutters or just UPVC?',
        answer:
          'Both. Cast iron gutters on Victorian and Edwardian properties are worth keeping if they\'re in reasonable condition — they look far better than UPVC on older houses. I can clean, repaint, and reseal cast iron. If a section is beyond saving, I can replace it with cast iron profile UPVC that looks similar, or source reclaimed cast iron if the look matters to you.',
      },
      {
        question: 'Is there a call-out fee?',
        answer:
          'No. There\'s no charge to come out and inspect. You get a quote, and if you want to go ahead, the inspection visit comes off nothing — it\'s just part of the job. If you decide not to proceed, that\'s fine too.',
      },
    ],
    meta: {
      title: 'Guttering Repairs Kent | Weather Wizard Roofing',
      description:
        'Guttering repairs, cleaning, and replacement across Kent. Fixed prices, same-day repairs, no call-out fee. 25 years\' experience. Call 0800 316 2922.',
      keywords: [
        'guttering repairs Kent',
        'gutter cleaning Kent',
        'blocked gutters Kent',
        'gutter replacement Kent',
        'guttering Maidstone',
        'gutter repairs Dartford',
        'downpipe repairs Kent',
        'cast iron guttering Kent',
        'UPVC guttering Kent',
        'leaking gutters Kent',
        'gutter brackets Kent',
        'fascia and guttering Kent',
        'guttering company Kent',
        'gutter installation Kent',
        'gutter repair near me Kent',
      ],
    },
    areaMeta: {
      title: 'Guttering Repairs {area} | Weather Wizard',
      description:
        'Guttering repairs, cleaning, and replacement in {area}. Fixed prices, no call-out fee. Local Kent roofer with 25 years\' experience. Call 0800 316 2922.',
    },
    image: '/images/guttering.webp',
  },

  'bird-proofing': {
    slug: 'bird-proofing',
    name: 'Bird & Pigeon Proofing',
    heroHeadline: 'Pigeon Problems Solved.',
    heroSubheadline:
      'Spikes, netting, mesh, and solar panel guards — I fit humane deterrents that actually work. Covering all of Kent. Fixed price, guaranteed results.',
    areaHeroHeadline: 'Bird & Pigeon Proofing in {area}',
    areaHeroSubheadline:
      'Pigeons nesting on your roof or under your solar panels in {area}? I\'ll sort it properly with the right deterrents for your property.',
    description: `Pigeons have got smarter about Kent rooftops. The last few years have seen a real jump in calls about birds nesting under solar panels — and it's not hard to see why. A south-facing roof with panels on it is the ideal spot: warm, sheltered, practically a five-star hotel as far as a pigeon is concerned. Once they're in, they're hard to shift. They come back to the same spots year after year, they make a mess, and the droppings are corrosive enough to damage panel warranties and block drainage channels.

I fit bird proofing across Kent — for domestic properties, commercial roofs, and increasingly for solar panel installations. The deterrents I use are all humane. No poisons, no traps. Just physical barriers that make your roof an unattractive proposition.

For solar panel bird proofing, the standard solution is a stainless steel mesh system clipped directly to the frame of the panels. It's virtually invisible from the ground, it doesn't affect panel performance, and it seals the gap around the perimeter so birds physically cannot get underneath. I use UV-stabilised clips and powder-coated mesh that won't corrode — a lot of the cheap systems you'll find online rust out within a couple of years. Mine come with a guarantee.

Before fitting anything, I clear out whatever's already under or around the panels. Nesting material, debris, droppings — all of it. It needs to come out before the barrier goes on, or you're sealing a problem in rather than solving it.

For ridge lines, ledges, and parapet walls, I fit stainless steel spike systems. These aren't as brutal as they look — they don't harm the birds, they just make landing uncomfortable. Correctly installed at the right density for the species causing the problem, they're very effective. Pigeons quickly learn to look elsewhere.

For larger areas — flat roofs, commercial facades, loading bays — I use tensioned wire systems or netting depending on what's practical for the structure. Netting is particularly good for keeping birds out of enclosed spaces like under eaves or in roof voids.

Everything I fit is designed to blend with the property and last. I don't do cheap fixes that need redoing every couple of years.`,
    features: [
      {
        title: 'Solar panel mesh systems',
        description:
          'Stainless steel mesh clipped to panel frames seals the gap pigeons nest in. UV-stabilised, rust-resistant, invisible from the ground.',
      },
      {
        title: 'Spike installation',
        description:
          'Stainless steel spikes for ridge lines, ledges, and parapet walls. Humane, durable, and matched to the bird species causing the problem.',
      },
      {
        title: 'Netting for large areas',
        description:
          'Tensioned netting for flat roofs, eaves, and commercial spaces. Keeps birds out without damaging the structure.',
      },
      {
        title: 'Full clearance first',
        description:
          'I remove all existing nesting material and debris before fitting anything. You can\'t seal over a problem — it needs clearing out.',
      },
      {
        title: 'Humane deterrents only',
        description:
          'No poisons, no traps. All systems are humane and compliant with the Wildlife and Countryside Act. Birds are deterred, not harmed.',
      },
      {
        title: 'Guaranteed installation',
        description:
          'All deterrent systems come with a written guarantee. If birds get back in through a gap I\'ve fitted, I\'ll come back and sort it.',
      },
    ],
    process: [
      {
        step: 1,
        title: 'Call me and describe the problem',
        description:
          'Tell me what you\'re dealing with — solar panels, ridge tiles, eaves, or something else. I\'ll give you a straightforward idea of what\'s involved and likely cost.',
      },
      {
        step: 2,
        title: 'I inspect the roof and assess',
        description:
          'I\'ll get up and see what\'s there — how far the birds have got, what existing damage has been done, and which deterrent system is right for the situation.',
      },
      {
        step: 3,
        title: 'Fixed quote, right products',
        description:
          'You get a price before I start. I\'ll specify exactly what I\'m fitting and why. No upselling to systems you don\'t need.',
      },
      {
        step: 4,
        title: 'Cleared, fitted, guaranteed',
        description:
          'I clear out existing nesting material, fit the deterrents properly, and leave you with a written guarantee on the installation.',
      },
    ],
    faqs: [
      {
        question: 'Do I need bird proofing under my solar panels?',
        answer:
          'If you\'ve had solar panels fitted in Kent, the honest answer is: probably yes, eventually. Pigeons are heavily drawn to the warm, sheltered gap under panels. Once one pair discovers it, others follow. The droppings cause real damage — they\'re acidic enough to affect panel coatings and block the drainage channels around frames. Fitting mesh when panels go on is much cheaper than clearing a nest and repairing damage later.',
      },
      {
        question: 'Will the mesh affect my solar panel performance?',
        answer:
          'No. The mesh clips to the panel frame, not the panels themselves, and sits below and around the edge. It doesn\'t shade the cells, doesn\'t affect airflow over the panels, and doesn\'t touch the glass. Most solar installers actually recommend it but don\'t supply it as part of the installation.',
      },
      {
        question: 'Are pigeons protected? Can I legally deter them?',
        answer:
          'Feral pigeons are not protected under the Wildlife and Countryside Act 1981 — unlike many other bird species. You can legally deter them with physical barriers, spikes, and netting. What you cannot do is harm them, destroy active nests, or disturb nesting birds during the breeding season. I only fit deterrents that exclude birds humanely. Nothing I use harms them.',
      },
      {
        question: 'I\'ve already got birds nesting. What happens if you just fit mesh over them?',
        answer:
          'That\'s exactly what you should not do — and I won\'t. Sealing birds in causes a welfare problem and makes things worse. Before any mesh or netting goes on, I clear out the nesting material and confirm the space is empty. Only then does the barrier go on. If there\'s an active nest with eggs or chicks during breeding season, you may need to wait until the nest is vacated before exclusion work can proceed — I\'ll advise you on timing.',
      },
      {
        question: 'Can you proof a commercial building or flat roof?',
        answer:
          'Yes. I work on commercial properties as well as domestic. Flat roofs with parapet walls are a common job — pigeons love a sheltered flat roof. I\'ll assess the scale of the problem and specify the right system, whether that\'s netting, wire deterrents, spikes, or a combination. For large commercial jobs I\'ll visit and survey before quoting.',
      },
      {
        question: 'How long does the work last?',
        answer:
          'Properly installed systems should last 10 to 15 years. The stainless steel mesh I use on solar panels is UV-stabilised and powder-coated — it doesn\'t corrode and the clips don\'t fail in frost. Stainless spike systems on ridge lines will outlast most roofs if fitted correctly. I don\'t use the cheap plastic alternatives that become brittle after a couple of winters.',
      },
    ],
    meta: {
      title: 'Bird & Pigeon Proofing Kent | Weather Wizard Roofing',
      description:
        'Pigeon proofing, solar panel bird mesh, spikes, and netting across Kent. Humane deterrents, guaranteed installation. Call 0800 316 2922.',
      keywords: [
        'bird proofing Kent',
        'pigeon proofing Kent',
        'solar panel bird proofing Kent',
        'pigeon mesh solar panels Kent',
        'bird deterrents Kent',
        'bird spikes Kent',
        'pigeon netting Kent',
        'solar panel pigeon guard Kent',
        'bird proofing Maidstone',
        'pigeon control Kent',
        'bird exclusion Kent',
        'solar panel bird mesh',
        'pigeon proofing roof Kent',
        'bird nesting solar panels Kent',
        'humane pigeon deterrents Kent',
      ],
    },
    areaMeta: {
      title: 'Bird & Pigeon Proofing {area} | Weather Wizard',
      description:
        'Pigeon proofing and solar panel bird mesh in {area}. Humane deterrents, guaranteed installation. Local Kent roofer. Call 0800 316 2922.',
    },
    image: '/images/hero-roofer.webp',
  },

  'exterior-painting': {
    slug: 'exterior-painting',
    name: 'Exterior Painting',
    heroHeadline: 'Exterior Painting Done Right.',
    heroSubheadline:
      'Fascias, soffits, bargeboards, doors, rendering — proper prep, quality paint, working safely at height. Covering all of Kent.',
    areaHeroHeadline: 'Exterior Painting in {area}',
    areaHeroSubheadline:
      'Exterior painting in {area} — fascias, soffits, rendered walls, and more. Properly prepped, properly painted. Fixed price before I start.',
    description: `Most exterior paint jobs fail early because of poor preparation. The painter skips the sanding, skips the primer, slaps paint over flaking old coats — and six months later you're back to square one. After 25 years working at height on Kent properties, I've seen the results of rushed exterior painting more times than I can count. It's why I won't do it that way.

Exterior painting on a house is more than cosmetic. Your fascias, soffits, and bargeboards are the first line of defence for your roof structure. When the paint fails, moisture gets into the timber. Once timber starts to rot, a paint job turns into a fascia replacement job. Keeping the exterior woodwork in good condition is genuinely cheaper than leaving it, and that starts with decent preparation.

When I take on an exterior painting job, the prep work gets as much time as the painting itself. That means washing down surfaces to remove dirt, mould, and algae — Kent's damp climate encourages all three. It means sanding back to a sound surface, filling any cracks, splits, or gaps with the right exterior filler, and priming bare or porous surfaces before topcoats go on. Wood primer on timber. Stabilising primer on chalky or blown render. Masonry paint on brickwork that's been sealed. I don't cut corners on this because the prep is what makes the paint last.

For fascias and soffits, I use quality exterior gloss or satin on timber — not cheap trade pots. On UPVC fascias that have yellowed or gone grey, a specialist UPVC paint makes a big difference to the look of the house and avoids the cost of full replacement. It won't look as good as new forever, but on painted UPVC you're buying years rather than a permanent fix.

Bargeboards, window sills, and door frames get the same treatment. Two coats minimum on any painted surface. On doors, I pay attention to the edges — that's where moisture gets in and where paint fails first.

For rendered walls, the approach depends on condition. Sound render in good condition just needs a thorough clean, prime where needed, and two coats of quality masonry paint. Blown or cracked render needs to be cut out and repointed before any paint goes near it — I can handle both, or work alongside a plasterer if the render needs major attention.

I work safely at height using scaffolding towers, access equipment, and ladders — properly set up, not just leaned against a drainpipe. If your job needs scaffold, I'll factor that into the quote.`,
    features: [
      {
        title: 'Proper preparation first',
        description:
          'Washing, sanding, filling, and priming before any topcoat. Preparation is what makes exterior paint last — I won\'t skip it.',
      },
      {
        title: 'Fascias, soffits, bargeboards',
        description:
          'Exterior woodwork painted or refreshed to protect against rot. UPVC painted with specialist coatings where replacement isn\'t needed.',
      },
      {
        title: 'Rendered walls and masonry',
        description:
          'Masonry paint applied over properly prepared render. Blown or cracked sections cut out and repaired before painting.',
      },
      {
        title: 'Doors, frames, and sills',
        description:
          'Front and back doors, window frames, and sills — all properly prepped and painted. Edges done properly, not just the face.',
      },
      {
        title: 'Safe working at height',
        description:
          'Scaffold towers and proper access equipment. Not just a ladder leaned against a drainpipe. Your property and neighbours treated with respect.',
      },
      {
        title: 'Quality exterior paint',
        description:
          'I use proper exterior grades — not cheap trade paint. The right product for the surface: gloss on wood, masonry paint on render, UPVC paint on plastic.',
      },
    ],
    process: [
      {
        step: 1,
        title: 'Call me and describe the job',
        description:
          'Tell me what needs painting — fascias, render, the lot. I\'ll give you a ballpark idea on the call and arrange a visit to quote properly.',
      },
      {
        step: 2,
        title: 'Survey and fixed quote',
        description:
          'I\'ll look at the surfaces, assess the preparation needed, and give you a firm written price. I\'ll tell you honestly if there\'s any underlying damage that should be fixed first.',
      },
      {
        step: 3,
        title: 'Prep done properly',
        description:
          'Washing, sanding, filling, priming. The prep takes as long as it takes — this is what the quality of the finished job depends on.',
      },
      {
        step: 4,
        title: 'Painted and finished',
        description:
          'Two coats on every surface, edges done, site left clean. You get a result that protects the property and looks good for years.',
      },
    ],
    faqs: [
      {
        question: 'How long will exterior paint last?',
        answer:
          'On properly prepared timber with quality exterior paint, you should get 5 to 8 years before it needs attention again. On render with quality masonry paint, similar. The big variable is preparation — paint applied over failing old coats or onto bare unsealed timber will start peeling within a year or two. Do it right once and it lasts.',
      },
      {
        question: 'Should I paint my UPVC fascias or just replace them?',
        answer:
          'Depends on condition. If they\'re sound but just yellowed or grubby, specialist UPVC paint is a decent option — it freshens the look at a fraction of replacement cost. If they\'re warped, cracked, or the boards behind are rotten, painting over that just delays the problem. I\'ll tell you honestly which category yours fall into when I look at them.',
      },
      {
        question: 'My render is cracked in places. Can you paint over it?',
        answer:
          'Not without sorting the cracks first. Painting over cracked or blown render traps moisture behind the paint film — it will bubble and peel, usually within a season. The right approach is to cut out anything that\'s loose or blown, fill or re-render those sections, let it cure properly, then paint. It takes longer, but it actually works.',
      },
      {
        question: 'What colour options do I have for masonry paint?',
        answer:
          'Virtually any colour — quality masonry paints come in a wide range, and most can be tinted to match. White and magnolia are by far the most popular in Kent, but soft greys, creams, and warmer tones are increasingly common. I\'d recommend going a shade or two lighter than you think you want — masonry paint tends to dry slightly darker than it looks in the tin.',
      },
      {
        question: 'Do you paint in all weathers?',
        answer:
          'No, and anyone who says otherwise is cutting corners. Exterior paint needs dry conditions and temperatures above around 5°C to bond and cure properly. Painting on a damp day, or when frost is forecast overnight, guarantees poor adhesion. I schedule exterior painting jobs around the weather — which in Kent means being flexible, but it\'s how you get a result that lasts.',
      },
      {
        question: 'Can you paint at height, or do I need scaffolding separately?',
        answer:
          'I work safely at height using scaffold towers and proper access equipment. For most two-storey properties, I can reach fascias, soffits, and upper-floor windows without a full scaffold. For larger properties or gable ends, I\'ll specify if proper scaffold is needed and factor it into the quote. I won\'t work unsafely to keep the price down.',
      },
    ],
    meta: {
      title: 'Exterior Painting Kent | Weather Wizard Roofing',
      description:
        'Exterior house painting across Kent. Fascias, soffits, render, doors. Proper prep, quality paint, fixed price. 25 years\' experience. Call 0800 316 2922.',
      keywords: [
        'exterior painting Kent',
        'exterior house painting Kent',
        'fascia painting Kent',
        'soffit painting Kent',
        'bargeboard painting Kent',
        'masonry painting Kent',
        'rendered wall painting Kent',
        'exterior painting Maidstone',
        'UPVC painting Kent',
        'exterior wood painting Kent',
        'house painting Kent',
        'exterior decorator Kent',
        'render painting Kent',
        'exterior painting Dartford',
        'window sill painting Kent',
      ],
    },
    areaMeta: {
      title: 'Exterior Painting {area} | Weather Wizard Roofing',
      description:
        'Exterior painting in {area} — fascias, soffits, render, and more. Proper prep, quality finishes, fixed price. Local Kent tradesman. Call 0800 316 2922.',
    },
    image: '/images/fascias-soffits.webp',
  },
};

export function getService(slug: string): ServiceContent | undefined {
  return services[slug];
}

export function getServiceForArea(
  slug: string,
  areaName: string
): ServiceContent & {
  resolvedHeroHeadline: string;
  resolvedHeroSubheadline: string;
  resolvedMeta: { title: string; description: string };
} {
  const service = services[slug];
  if (!service) throw new Error(`Unknown service: ${slug}`);
  return {
    ...service,
    resolvedHeroHeadline: service.areaHeroHeadline.replace('{area}', areaName),
    resolvedHeroSubheadline: service.areaHeroSubheadline.replace('{area}', areaName),
    resolvedMeta: {
      title: service.areaMeta.title.replace('{area}', areaName),
      description: service.areaMeta.description.replace('{area}', areaName),
    },
  };
}

export function getAllServiceSlugs(): string[] {
  return Object.keys(services);
}

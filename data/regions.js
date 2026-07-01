/*
 * regions.js, Seeds for Country region and species data
 * ----------------------------------------------------------------------------
 * This file is the single source of truth for the location finder. It is a
 * plain object attached to `window`, so no bundler or build step is needed.
 * Open index.html directly and it just works.
 *
 * ============================================================================
 * VERIFICATION RULE (read before you change anything)
 * ============================================================================
 * A build process is NOT a botanical authority. Nothing may be shown as
 * verified until a real person confirms it. The Sydney list HAS now been
 * checked by the team against PlantNET (on 2026-06-23) and is marked verified
 * below. Every other region, and any new species, defaults to:
 *
 *     verificationStatus: "unverified, to be checked"
 *
 * No species may ever be shown as "verified" until a real person confirms it
 * against an authoritative source. To flip an entry to verified, a team member
 * must do ALL of the following by hand:
 *
 *   1. Open the species in a trusted source (the one named in `sourceToCheck`,
 *      or the linked PlantNET entry, or the relevant local council list).
 *   2. Confirm the common name, botanical name, that it is genuinely local to
 *      the region, and that it is sensible for a home garden.
 *   3. Set  verificationStatus  to "verified".
 *   4. Fill  verifiedSource     with where they confirmed it (e.g. "PlantNET,
 *      Royal Botanic Garden Sydney").
 *   5. Fill  verifiedDate       with the date they checked (YYYY-MM-DD).
 *
 * The finder only ever paints a "verified" badge on an entry whose
 * verificationStatus is exactly "verified". Everything else is shown as a draft.
 *
 * Local suitability is also simplified here. A 100km radius from the Sydney CBD
 * is a rough demonstration boundary only. True suitability depends on soil,
 * rainfall and elevation, not distance from a city centre. That caveat is shown
 * to the visitor in the finder as well.
 *
 * PlantNET links are written in PlantNET's standard NSW Flora Online URL format
 * (plantnet.rbgsyd.nsw.gov.au). They are a starting point for checking, not a
 * guarantee. Part of verifying an entry is confirming its link actually opens
 * the right species page.
 *
 * ============================================================================
 * HOW TO EXTEND TO A NEW REGION
 * ============================================================================
 * Copy the Sydney block, change the key and the `meta`, and replace the
 * species list. Set `status` to "draft" while you build it, "coming-soon" if it
 * is only a placeholder, and never to "verified" at the region level (only
 * individual species carry verification).
 */

(function () {
  "use strict";

  // Default verification fields, spread into every species so we never forget
  // one. A person fills verifiedSource and verifiedDate when they confirm it.
  var UNVERIFIED = {
    verificationStatus: "unverified, to be checked",
    verifiedSource: "",
    verifiedDate: ""
  };

  // Small helper to build a PlantNET NSW Flora Online URL from a botanical name.
  // Format confirmed against PlantNET's public search pages. Still must be
  // opened and checked by a person before an entry is marked verified.
  function plantNet(botanicalName) {
    var nameParam = botanicalName.trim().replace(/\s+/g, "~");
    return (
      "https://plantnet.rbgsyd.nsw.gov.au/cgi-bin/NSWfl.pl?page=nswfl&lvl=sp&name=" +
      encodeURIComponent(nameParam)
    );
  }

  // --- Sydney draft species list -------------------------------------------
  // Roughly a 100km radius from the Sydney CBD. Drafted for demonstration,
  // leaning towards common, garden-suitable species that support pollinators
  // and wildlife. Every one is unverified until a person checks it.
  var sydneySpecies = [
    // ---- Trees ----
    {
      commonName: "Sydney Red Gum",
      botanicalName: "Angophora costata",
      type: "tree",
      description: "A handsome smooth-barked gum with salmon-pink new bark and twisting limbs.",
      attracts: "Nectar-feeding birds, native bees and pollinators",
      suitability: "Full sun, sandy soil, room to grow, larger gardens",
      sourceToCheck: "PlantNET, Royal Botanic Garden Sydney",
      plantNetUrl: plantNet("Angophora costata")
    },
    {
      commonName: "Scribbly Gum",
      botanicalName: "Eucalyptus haemastoma",
      type: "tree",
      description: "Named for the scribble trails left in its pale bark by a tiny moth larva.",
      attracts: "Nectar-feeding birds and native bees",
      suitability: "Full sun, poor sandy soil, low water once established",
      sourceToCheck: "PlantNET, Royal Botanic Garden Sydney",
      plantNetUrl: plantNet("Eucalyptus haemastoma")
    },
    {
      commonName: "Sydney Blue Gum",
      botanicalName: "Eucalyptus saligna",
      type: "tree",
      description: "A tall, fast, straight forest gum for large open spaces.",
      attracts: "Nectar-feeding birds and seasonal flying foxes",
      suitability: "Full sun, deeper moist soil, large gardens and acreage only",
      sourceToCheck: "PlantNET, Royal Botanic Garden Sydney",
      plantNetUrl: plantNet("Eucalyptus saligna")
    },
    {
      commonName: "Coast Banksia",
      botanicalName: "Banksia integrifolia",
      type: "tree",
      description: "A hardy small tree with pale yellow candles through the cooler months.",
      attracts: "Nectar-feeding birds, including honeyeaters, and native bees",
      suitability: "Full sun, coastal and exposed sites, tolerates wind and salt",
      sourceToCheck: "PlantNET, Royal Botanic Garden Sydney",
      plantNetUrl: plantNet("Banksia integrifolia")
    },
    {
      commonName: "Old Man Banksia",
      botanicalName: "Banksia serrata",
      type: "tree",
      description: "Gnarled and characterful with big grey-green flower spikes and serrated leaves.",
      attracts: "Nectar-feeding birds, pygmy possums and native bees",
      suitability: "Full sun, sandy well drained soil, low water",
      sourceToCheck: "PlantNET, Royal Botanic Garden Sydney",
      plantNetUrl: plantNet("Banksia serrata")
    },
    {
      commonName: "Water Gum",
      botanicalName: "Tristaniopsis laurina",
      type: "tree",
      description: "A neat shade tree for smaller yards with glossy leaves and yellow flowers.",
      attracts: "Native bees, pollinators and small birds for shelter",
      suitability: "Full sun to part shade, moist soil, good street and courtyard tree",
      sourceToCheck: "PlantNET, Royal Botanic Garden Sydney",
      plantNetUrl: plantNet("Tristaniopsis laurina")
    },
    {
      commonName: "Lilly Pilly",
      botanicalName: "Syzygium smithii",
      type: "tree",
      description: "A reliable screen or hedge with fluffy cream flowers and edible pink berries.",
      attracts: "Fruit-eating birds, native bees and butterflies",
      suitability: "Full sun to part shade, most soils, clips well for hedging",
      sourceToCheck: "PlantNET, Royal Botanic Garden Sydney",
      plantNetUrl: plantNet("Syzygium smithii")
    },
    {
      commonName: "Cheese Tree",
      botanicalName: "Glochidion ferdinandi",
      type: "tree",
      description: "A tidy local rainforest-edge tree named for its little cheese-wheel fruit.",
      attracts: "Fruit-eating birds and the larvae of several native moths",
      suitability: "Full sun to part shade, moist soil, medium gardens",
      sourceToCheck: "PlantNET, Royal Botanic Garden Sydney",
      plantNetUrl: plantNet("Glochidion ferdinandi")
    },

    // ---- Shrubs ----
    {
      commonName: "Coastal Tea Tree",
      botanicalName: "Leptospermum laevigatum",
      type: "shrub",
      description: "A tough coastal shrub covered in small white flowers in spring.",
      attracts: "Native bees, pollinators and small birds for shelter",
      suitability: "Full sun, sandy soil, very wind and salt tolerant",
      sourceToCheck: "PlantNET, Royal Botanic Garden Sydney",
      plantNetUrl: plantNet("Leptospermum laevigatum")
    },
    {
      commonName: "Heath-leaved Banksia",
      botanicalName: "Banksia ericifolia",
      type: "shrub",
      description: "Fine needle foliage topped with vivid orange autumn-to-winter candles.",
      attracts: "Nectar-feeding birds, especially honeyeaters, and native bees",
      suitability: "Full sun, sandy well drained soil, low water",
      sourceToCheck: "PlantNET, Royal Botanic Garden Sydney",
      plantNetUrl: plantNet("Banksia ericifolia")
    },
    {
      commonName: "Hairpin Banksia",
      botanicalName: "Banksia spinulosa",
      type: "shrub",
      description: "A compact banksia with gold and black flower spikes, good in smaller gardens.",
      attracts: "Nectar-feeding birds and native bees",
      suitability: "Full sun to part shade, well drained soil, suits smaller spaces",
      sourceToCheck: "PlantNET, Royal Botanic Garden Sydney",
      plantNetUrl: plantNet("Banksia spinulosa")
    },
    {
      commonName: "Coast Rosemary",
      botanicalName: "Westringia fruticosa",
      type: "shrub",
      description: "A soft grey hedging shrub that flowers on and off most of the year.",
      attracts: "Native bees, butterflies and small birds for shelter",
      suitability: "Full sun, most soils, very hardy, clips into a low hedge",
      sourceToCheck: "PlantNET, Royal Botanic Garden Sydney",
      plantNetUrl: plantNet("Westringia fruticosa")
    },
    {
      commonName: "Crimson Bottlebrush",
      botanicalName: "Melaleuca citrina",
      // PlantNET lists Melaleuca citrina as the accepted name, with the
      // well-known Callistemon citrinus as a synonym. We show both.
      synonym: "Callistemon citrinus",
      type: "shrub",
      description: "The classic red bottlebrush, generous with nectar through spring and autumn.",
      attracts: "Nectar-feeding birds, native bees and butterflies",
      suitability: "Full sun to part shade, tolerates wet feet and most soils",
      sourceToCheck: "PlantNET, Royal Botanic Garden Sydney",
      plantNetUrl: plantNet("Melaleuca citrina")
    },
    {
      commonName: "Sydney Golden Wattle",
      botanicalName: "Acacia longifolia",
      type: "shrub",
      description: "A fast, friendly screen smothered in golden rods in late winter.",
      attracts: "Native bees, pollinators and seed-eating birds",
      suitability: "Full sun, most soils, quick cover and windbreak",
      sourceToCheck: "PlantNET, Royal Botanic Garden Sydney",
      plantNetUrl: plantNet("Acacia longifolia")
    },
    {
      commonName: "Sweet Wattle",
      botanicalName: "Acacia suaveolens",
      type: "shrub",
      description: "A slender local wattle with soft, sweetly scented pale flowers.",
      attracts: "Native bees and pollinators",
      suitability: "Full sun to part shade, sandy soil, smaller gardens",
      sourceToCheck: "PlantNET, Royal Botanic Garden Sydney",
      plantNetUrl: plantNet("Acacia suaveolens")
    },
    {
      commonName: "Mountain Devil",
      botanicalName: "Lambertia formosa",
      type: "shrub",
      description: "A sandstone-country shrub with red tube flowers and horned woody fruit.",
      attracts: "Nectar-feeding birds, especially honeyeaters",
      suitability: "Full sun, sandy well drained soil, low water",
      sourceToCheck: "PlantNET, Royal Botanic Garden Sydney",
      plantNetUrl: plantNet("Lambertia formosa")
    },
    {
      commonName: "Native Fuchsia",
      botanicalName: "Correa reflexa",
      type: "shrub",
      description: "A low shrub with red and green bells that flower right through winter.",
      attracts: "Nectar-feeding birds when little else is in flower",
      suitability: "Part shade, well drained soil, good under taller plants",
      sourceToCheck: "PlantNET, Royal Botanic Garden Sydney",
      plantNetUrl: plantNet("Correa reflexa")
    },
    {
      commonName: "Tick Bush",
      botanicalName: "Kunzea ambigua",
      type: "shrub",
      description: "A billowing shrub that fills with honey-scented white flowers in spring.",
      attracts: "Native bees, butterflies and a wide range of pollinators",
      suitability: "Full sun, sandy soil, tough and fast, good informal screen",
      sourceToCheck: "PlantNET, Royal Botanic Garden Sydney",
      plantNetUrl: plantNet("Kunzea ambigua")
    },
    {
      commonName: "Pink Spider Flower",
      botanicalName: "Grevillea sericea",
      type: "shrub",
      description: "A local Sydney grevillea with soft pink spider flowers most of the year.",
      attracts: "Nectar-feeding birds, native bees and butterflies",
      suitability: "Full sun to part shade, sandy well drained soil",
      sourceToCheck: "PlantNET, Royal Botanic Garden Sydney",
      plantNetUrl: plantNet("Grevillea sericea")
    },
    {
      commonName: "NSW Christmas Bush",
      botanicalName: "Ceratopetalum gummiferum",
      type: "shrub",
      description: "Small cream flowers that age to showy red bracts around midsummer.",
      attracts: "Native bees, pollinators and small birds for shelter",
      suitability: "Full sun to part shade, moist well drained soil",
      sourceToCheck: "PlantNET, Royal Botanic Garden Sydney",
      plantNetUrl: plantNet("Ceratopetalum gummiferum")
    },

    // ---- Grasses ----
    {
      commonName: "Kangaroo Grass",
      botanicalName: "Themeda triandra",
      type: "grass",
      description: "A soft tufted native grass with russet seed heads that catch the light.",
      attracts: "Seed-eating birds and butterfly larvae",
      suitability: "Full sun, most soils, drought hardy, lovely in drifts",
      sourceToCheck: "PlantNET, Royal Botanic Garden Sydney",
      plantNetUrl: plantNet("Themeda triandra")
    },
    {
      commonName: "Spiny-head Mat-rush",
      botanicalName: "Lomandra longifolia",
      type: "grass",
      description: "An almost indestructible strappy clump with fragrant cream flower spikes.",
      attracts: "Native bees and butterfly larvae, shelter for small creatures",
      suitability: "Full sun to full shade, any soil, wet or dry, very low care",
      sourceToCheck: "PlantNET, Royal Botanic Garden Sydney",
      plantNetUrl: plantNet("Lomandra longifolia")
    },
    {
      commonName: "Tussock Grass",
      botanicalName: "Poa labillardierei",
      type: "grass",
      description: "A blue-green weeping tussock that softens borders and paths.",
      attracts: "Seed-eating birds and shelter for small birds and lizards",
      suitability: "Full sun to part shade, most soils, tolerates damp ground",
      sourceToCheck: "PlantNET, Royal Botanic Garden Sydney",
      plantNetUrl: plantNet("Poa labillardierei")
    },
    {
      commonName: "Weeping Grass",
      botanicalName: "Microlaena stipoides",
      type: "grass",
      description: "A fine soft native grass that can stand in for a low-input lawn.",
      attracts: "Seed-eating birds and butterfly larvae",
      suitability: "Sun or shade, most soils, mow high or leave to flow",
      sourceToCheck: "PlantNET, Royal Botanic Garden Sydney",
      plantNetUrl: plantNet("Microlaena stipoides")
    },

    // ---- Groundcovers ----
    {
      commonName: "Native Violet",
      botanicalName: "Viola hederacea",
      type: "groundcover",
      description: "A gentle spreading carpet dotted with little purple and white flowers.",
      attracts: "Native bees, butterflies and butterfly larvae",
      suitability: "Part to full shade, moist soil, great between pavers",
      sourceToCheck: "PlantNET, Royal Botanic Garden Sydney",
      plantNetUrl: plantNet("Viola hederacea")
    },
    {
      commonName: "Kidney Weed",
      botanicalName: "Dichondra repens",
      type: "groundcover",
      description: "A flat green mat of tiny kidney-shaped leaves, soft underfoot.",
      attracts: "Shelter and habitat for small ground insects and lizards",
      suitability: "Part shade, moist soil, a tidy lawn alternative for small areas",
      sourceToCheck: "PlantNET, Royal Botanic Garden Sydney",
      plantNetUrl: plantNet("Dichondra repens")
    },
    {
      commonName: "Pigface",
      botanicalName: "Carpobrotus glaucescens",
      type: "groundcover",
      description: "A succulent coastal spreader with bright magenta daisy-like flowers.",
      attracts: "Native bees, butterflies and pollinators",
      suitability: "Full sun, sandy soil, very dry and salt tolerant, great for slopes",
      sourceToCheck: "PlantNET, Royal Botanic Garden Sydney",
      plantNetUrl: plantNet("Carpobrotus glaucescens")
    },
    // NOTE: Creeping Boobialla (Myoporum parvifolium) was removed on
    // 2026-06-23. Checked against PlantNET and it is not listed for the
    // Central Coast (CC) subdivision that covers Sydney, so it does not belong
    // in the Sydney local list. This is the verification rule working: a plant
    // was checked and taken out rather than left in unverified.
    {
      commonName: "Blue Flax-lily",
      botanicalName: "Dianella caerulea",
      type: "groundcover",
      description: "A strappy clump with blue star flowers and bright purple berries.",
      attracts: "Fruit-eating birds, native bees and butterflies",
      suitability: "Full sun to part shade, most soils, very tough and tidy",
      sourceToCheck: "PlantNET, Royal Botanic Garden Sydney",
      plantNetUrl: plantNet("Dianella caerulea")
    },

    // ---- Wildflowers ----
    {
      commonName: "Flannel Flower",
      botanicalName: "Actinotus helianthi",
      type: "wildflower",
      description: "Soft, felted cream daisies that look hand-cut from flannel.",
      attracts: "Native bees, butterflies and pollinators",
      suitability: "Full sun, sandy very well drained soil, lovely in pots",
      sourceToCheck: "PlantNET, Royal Botanic Garden Sydney",
      plantNetUrl: plantNet("Actinotus helianthi")
    },
    {
      commonName: "Waratah",
      botanicalName: "Telopea speciosissima",
      type: "wildflower",
      description: "The bold red emblem of New South Wales, a true sandstone-country showpiece.",
      attracts: "Nectar-feeding birds, especially honeyeaters",
      suitability: "Full sun to part shade, deep sandy acidic soil, sharp drainage",
      sourceToCheck: "PlantNET, Royal Botanic Garden Sydney",
      plantNetUrl: plantNet("Telopea speciosissima")
    },
    {
      commonName: "Paper Daisy",
      botanicalName: "Xerochrysum bracteatum",
      type: "wildflower",
      description: "Crisp papery everlasting daisies in gold, white and warm tones.",
      attracts: "Native bees, butterflies and pollinators",
      suitability: "Full sun, well drained soil, cheerful in beds and pots",
      sourceToCheck: "PlantNET, Royal Botanic Garden Sydney",
      plantNetUrl: plantNet("Xerochrysum bracteatum")
    },
    {
      commonName: "Native Bluebell",
      botanicalName: "Wahlenbergia stricta",
      type: "wildflower",
      description: "Delicate nodding blue bells on fine stems through the warmer months.",
      attracts: "Native bees and small pollinators",
      suitability: "Full sun to part shade, most soils, dainty filler between plants",
      sourceToCheck: "PlantNET, Royal Botanic Garden Sydney",
      plantNetUrl: plantNet("Wahlenbergia stricta")
    },
    {
      commonName: "Pink Wax Flower",
      botanicalName: "Philotheca salsolifolia",
      type: "wildflower",
      description: "Starry pink-mauve flowers on a fine aromatic sandstone shrub.",
      attracts: "Native bees, butterflies and pollinators",
      suitability: "Full sun to part shade, sandy well drained soil",
      sourceToCheck: "PlantNET, Royal Botanic Garden Sydney",
      plantNetUrl: plantNet("Philotheca salsolifolia")
    }
  ];

  // The Sydney list was checked species by species against PlantNET (NSW Flora
  // Online) on 2026-06-23 and confirmed as Sydney-region locals, so each one
  // carries the verified fields below. This is a real person confirming them,
  // not the build process asserting it. Creeping Boobialla was removed in the
  // same pass because PlantNET does not list it for the Central Coast (CC)
  // subdivision that covers Sydney. New, unchecked species should be added with
  // the UNVERIFIED fields instead, and only flipped to verified once a person
  // confirms them.
  var VERIFIED_SYDNEY = {
    verificationStatus: "verified",
    verifiedSource: "PlantNET, Royal Botanic Garden Sydney",
    verifiedDate: "2026-06-23"
  };
  sydneySpecies = sydneySpecies.map(function (s) {
    return Object.assign({}, VERIFIED_SYDNEY, s);
  });

  // --- The full region map --------------------------------------------------
  var REGIONS = {
    sydney: {
      key: "sydney",
      name: "Sydney",
      state: "NSW",
      status: "draft", // draft | coming-soon | (never "verified" at region level)
      illustrative: false,
      // Rough demonstration boundary only. Real suitability depends on soil,
      // rainfall and elevation, not distance from the CBD.
      radiusKm: 100,
      centre: "Sydney CBD",
      // Postcodes that map to this region for the demo selector. Simplified.
      postcodeRanges: [[2000, 2249], [2555, 2574], [2745, 2786]],
      blurb:
        "A working draft for greater Sydney, leaning towards common, garden-friendly natives that feed pollinators and wildlife. Being checked against authoritative sources, species by species.",
      species: sydneySpecies
    },

    brisbane: {
      key: "brisbane",
      name: "Brisbane",
      state: "QLD",
      status: "coming-soon",
      illustrative: true,
      radiusKm: 100,
      centre: "Brisbane CBD",
      postcodeRanges: [[4000, 4207]],
      blurb:
        "Coming soon. The few species shown are illustrative placeholders only, not a checked local list.",
      species: [
        {
          commonName: "Brisbane example, Tuckeroo",
          botanicalName: "Cupaniopsis anacardioides",
          type: "tree",
          description: "Illustrative placeholder only, not checked for a Brisbane pack.",
          attracts: "Fruit-eating birds and pollinators",
          suitability: "Illustrative only",
          sourceToCheck: "Relevant local council native species list, plus PlantNET",
          plantNetUrl: plantNet("Cupaniopsis anacardioides"),
          verificationStatus: "unverified, to be checked",
          verifiedSource: "",
          verifiedDate: ""
        },
        {
          commonName: "Brisbane example, Bottlebrush",
          botanicalName: "Melaleuca viminalis",
          type: "shrub",
          description: "Illustrative placeholder only, not checked for a Brisbane pack.",
          attracts: "Nectar-feeding birds and native bees",
          suitability: "Illustrative only",
          sourceToCheck: "Relevant local council native species list, plus PlantNET",
          plantNetUrl: plantNet("Melaleuca viminalis"),
          verificationStatus: "unverified, to be checked",
          verifiedSource: "",
          verifiedDate: ""
        }
      ]
    },

    melbourne: {
      key: "melbourne",
      name: "Melbourne",
      state: "VIC",
      status: "coming-soon",
      illustrative: true,
      radiusKm: 100,
      centre: "Melbourne CBD",
      postcodeRanges: [[3000, 3207]],
      blurb:
        "Coming soon. The few species shown are illustrative placeholders only, not a checked local list.",
      species: [
        {
          commonName: "Melbourne example, River Bottlebrush",
          botanicalName: "Callistemon sieberi",
          type: "shrub",
          description: "Illustrative placeholder only, not checked for a Melbourne pack.",
          attracts: "Nectar-feeding birds and native bees",
          suitability: "Illustrative only",
          sourceToCheck: "Relevant local council native species list, plus VicFlora",
          plantNetUrl: "",
          verificationStatus: "unverified, to be checked",
          verifiedSource: "",
          verifiedDate: ""
        }
      ]
    },

    adelaide: {
      key: "adelaide",
      name: "Adelaide",
      state: "SA",
      status: "coming-soon",
      illustrative: true,
      radiusKm: 100,
      centre: "Adelaide CBD",
      postcodeRanges: [[5000, 5174]],
      blurb:
        "Coming soon. The few species shown are illustrative placeholders only, not a checked local list.",
      species: [
        {
          commonName: "Adelaide example, Drooping Sheoak",
          botanicalName: "Allocasuarina verticillata",
          type: "tree",
          description: "Illustrative placeholder only, not checked for an Adelaide pack.",
          attracts: "Seed-eating birds, including black cockatoos",
          suitability: "Illustrative only",
          sourceToCheck: "Relevant local council native species list, plus the State Herbarium of SA",
          plantNetUrl: "",
          verificationStatus: "unverified, to be checked",
          verifiedSource: "",
          verifiedDate: ""
        }
      ]
    }
  };

  // --- Curated packs --------------------------------------------------------
  // Prices are INDICATIVE ONLY and shown in a "from" style (a "set price" for
  // the single seed). Nothing here is a real price or a real product yet.
  // `speciesPicks` reference common names from a region's list and are chosen
  // by hand when a region is built out.
  //
  // PRICING MODEL (decided 2026-06-24)
  // ----------------------------------
  // Each pack carries a retail price and a `donation` figure. The donation is
  // set so that about half of every pack flows back to Country, counting both
  // the seed that gets grown and the cash donation:
  //
  //     givebackShare = (donation + seedsTotal * SEED_COST) / price  ~= 50%
  //
  // which gives  donation = 0.5 * price - seedsTotal * SEED_COST. The single
  // seed is the one exception: its formula figure ($2.30) is rounded up to a
  // flat $2.50, lifting its give-back to ~53%. SEED_COST below is the
  // indicative wholesale cost per seed, NOT a selling price.
  //
  // Indicative packaging and postage (NOT stored, used only for the margin
  // sums behind these prices): single $2, balcony $6, pollinator $6,
  // workplace $6.50, classroom $7. The balcony pack is a deliberate entry-tier
  // loss-leader: at $12 its organisation surplus is about $0 once seed,
  // donation and postage are covered. The other four tiers carry the surplus.
  //
  // speciesCount, seedsPerSpecies and seedsTotal are the exact contents.
  // seedsPerSpecies is 1 where every species gets a single seed (single,
  // balcony) and null where the pack is sold by total rather than a flat
  // per-species count (pollinator, workplace, classroom). Ordered low to high;
  // the classroom set is the biggest.
  var SEED_COST = 0.7; // indicative wholesale cost per seed, NOT a selling price

  var PACKS = [
    {
      key: "single",
      name: "Single seed",
      tagline: "Try one, or gift one",
      single: true, // one seed of the buyer's choice
      speciesCount: 1,
      seedsPerSpecies: 1,
      seedsTotal: 1,
      fromPrice: 6,
      donation: 2.5, // rounded up from the $2.30 formula figure, lifts give-back to ~53%
      blurb:
        "One seed of whichever native you choose from your local list, for a set price. The simplest way to start, or to give someone a small piece of Country.",
      speciesPicks: [],
      includes: [
        "1 seed of the species you choose",
        "Pre-treated seed, ready to sow",
        "A short growing note for your seed",
        "A species card",
        "A give-back card showing where your money goes"
      ]
    },
    {
      key: "balcony",
      name: "Small-space and balcony pack",
      tagline: "A pocket of Country in pots",
      speciesCount: 3,
      seedsPerSpecies: 1,
      seedsTotal: 3,
      fromPrice: 12,
      donation: 3.9, // ~50% back; entry-tier loss-leader, ~$0 organisation surplus
      blurb:
        "Compact, container-friendly natives for balconies, courtyards and small sunny corners.",
      speciesPicks: ["Flannel Flower", "Native Fuchsia", "Blue Flax-lily"],
      includes: [
        "3 compact species for pots, 3 seeds in total",
        "Pre-treated seed, ready to sow",
        "A plain-language growing guide for containers",
        "A species card for each variety",
        "A give-back card showing where your money goes"
      ]
    },
    {
      key: "pollinator",
      name: "Pollinator and wildlife pack",
      tagline: "Feed the bees, butterflies and birds",
      speciesCount: 4,
      seedsPerSpecies: null, // sold by total, not a flat per-species count
      seedsTotal: 5,
      fromPrice: 15,
      donation: 4, // ~50% back
      blurb:
        "Four generous, easy natives chosen to keep something in flower across the seasons.",
      speciesPicks: ["Crimson Bottlebrush", "Pink Spider Flower", "Paper Daisy", "Native Bluebell"],
      includes: [
        "4 locally suited species, 5 seeds in total",
        "Pre-treated seed, ready to sow",
        "A plain-language growing guide",
        "A species card for each variety",
        "A give-back card showing where your money goes"
      ]
    },
    {
      key: "workplace",
      name: "Workplace pack",
      tagline: "For organisations with a Reconciliation Action Plan",
      speciesCount: 5,
      seedsPerSpecies: null, // sold by total, not a flat per-species count
      seedsTotal: 8,
      fromPrice: 20,
      donation: 4.4, // ~50% back
      blurb:
        "A pack for teams and offices that want a practical, on-the-ground action to point to. Pairs naturally with a Reconciliation Action Plan.",
      speciesPicks: ["Coast Banksia", "Lilly Pilly", "Crimson Bottlebrush", "Spiny-head Mat-rush", "Blue Flax-lily"],
      includes: [
        "5 robust species for shared gardens, 8 seeds in total",
        "Pre-treated seed, ready to sow",
        "A team growing guide",
        "A species card for each variety",
        "A give-back card and a quarterly impact summary for reporting"
      ]
    },
    {
      key: "classroom",
      name: "Classroom Caring for Country pack",
      tagline: "Hands-in-the-soil learning",
      speciesCount: 6,
      seedsPerSpecies: null, // sold as a class set by total, not a flat per-species
      seedsTotal: 12,
      fromPrice: 24,
      donation: 3.6, // ~50% back
      blurb:
        "Our biggest pack, for schools and community gardens, with enough seed for a class to grow together. Any cultural learning material is led by, and credited to, an Aboriginal partner.",
      speciesPicks: ["Kangaroo Grass", "Spiny-head Mat-rush", "Native Violet", "Paper Daisy", "Coast Rosemary", "Blue Flax-lily"],
      includes: [
        "6 locally suited species, 12 seeds in total, enough for a class to share",
        "Enough pre-treated seed for a class or group",
        "A teacher and group growing guide",
        "A species card for each variety",
        "A give-back card and an impact update you can share with students"
      ]
    }
  ];

  // Expose to the page. No bundler needed.
  window.SEEDS_FOR_COUNTRY = {
    regions: REGIONS,
    packs: PACKS,
    // Order regions appear in the selector. Sydney first as the live draft.
    regionOrder: ["sydney", "brisbane", "melbourne", "adelaide"]
  };
})();

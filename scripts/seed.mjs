/**
 * CulinaryPro — Sanity Seed Script
 *
 * Usage:
 *   node scripts/seed.mjs
 *
 * Requirements:
 *   - Set SANITY_API_TOKEN in .env.local with a token that has "Editor" or "Administrator" rights.
 *   - You can create a token at: https://sanity.io/manage → your project → API → Tokens
 */

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// ─── Load .env.local ────────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env.local');

let envVars = {};
try {
  const envFile = readFileSync(envPath, 'utf-8');
  envVars = Object.fromEntries(
    envFile
      .split('\n')
      .filter((line) => line.includes('=') && !line.startsWith('#'))
      .map((line) => {
        const [key, ...rest] = line.split('=');
        return [key.trim(), rest.join('=').trim()];
      })
  );
} catch {
  console.error('Could not read .env.local. Make sure it exists.');
  process.exit(1);
}

const projectId =
  envVars['NEXT_PUBLIC_SANITY_PROJECT_ID'] || envVars['SANITY_PROJECT_ID'] || 'gam0vu4t';
const dataset =
  envVars['NEXT_PUBLIC_SANITY_DATASET'] || envVars['SANITY_DATASET'] || 'production';
const token = envVars['SANITY_API_TOKEN'];

if (!token || token === 'your_sanity_api_token_here') {
  console.error(
    '\nSANITY_API_TOKEN is not set or is still the placeholder value.\n\n' +
      '   1. Go to: https://sanity.io/manage\n' +
      '   2. Select your project\n' +
      '   3. Go to API -> Tokens\n' +
      '   4. Create a token with "Editor" permissions\n' +
      '   5. Add it to .env.local as: SANITY_API_TOKEN=your_token_here\n'
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
});

console.log('\nCulinaryPro Seed Script');
console.log('   Project: ' + projectId + ' / Dataset: ' + dataset + '\n');

// ─── Helper ──────────────────────────────────────────────────────────────────
async function exists(type) {
  const count = await client.fetch('count(*[_type == "' + type + '"])');
  return count > 0;
}

async function createIfMissing(type, documents) {
  const alreadyExists = await exists(type);
  if (alreadyExists) {
    console.log('  SKIP "' + type + '" -- already has data, skipping.');
    return [];
  }
  const created = [];
  for (const doc of documents) {
    const result = await client.create(doc);
    created.push(result);
  }
  console.log('  OK "' + type + '" -- created ' + created.length + ' document(s).');
  return created;
}

// ─── 1. Restaurant Settings ───────────────────────────────────────────────────
async function seedRestaurantSettings() {
  await createIfMissing('restaurantSettings', [
    {
      _type: 'restaurantSettings',
      name: 'CulinaryPro',
      address: '14 Gourmet Boulevard, Midtown, New York, NY 10018',
      phone: '+1 (212) 555-0174',
      email: 'reservations@culinarypro.com',
      openingHours: 'Mon-Thu: 12pm-10pm | Fri-Sat: 11am-11pm | Sun: 11am-9pm',
      footerText:
        'Elevating the dining experience since 2018. Crafted with passion, served with precision.',
      socialMediaLinks: [
        { platform: 'Instagram', url: 'https://instagram.com/culinarypro' },
        { platform: 'Facebook', url: 'https://facebook.com/culinarypro' },
        { platform: 'Twitter', url: 'https://twitter.com/culinarypro' },
      ],
    },
  ]);
}

// ─── 2. Hero Section ─────────────────────────────────────────────────────────
async function seedHero() {
  await createIfMissing('heroSection', [
    {
      _type: 'heroSection',
      heading: 'Exquisite Flavors, Unforgettable Moments.',
      subheading:
        'Experience the perfect harmony of culinary artistry and warm hospitality. Every dish is a story — let us tell yours.',
      ctaText: 'Order Now',
      ctaLink: '/menu',
    },
  ]);
}

// ─── 3. Categories ───────────────────────────────────────────────────────────
async function seedCategories() {
  const alreadyExists = await exists('category');
  if (alreadyExists) {
    console.log('  SKIP "category" -- already has data, skipping.');
    return;
  }

  const categories = [
    { _type: 'category', name: 'Pizza', slug: { _type: 'slug', current: 'pizza' } },
    { _type: 'category', name: 'Burgers', slug: { _type: 'slug', current: 'burgers' } },
    { _type: 'category', name: 'Pasta', slug: { _type: 'slug', current: 'pasta' } },
    { _type: 'category', name: 'Salads', slug: { _type: 'slug', current: 'salads' } },
    { _type: 'category', name: 'Desserts', slug: { _type: 'slug', current: 'desserts' } },
    { _type: 'category', name: 'Drinks', slug: { _type: 'slug', current: 'drinks' } },
  ];

  const created = [];
  for (const cat of categories) {
    const result = await client.create(cat);
    created.push(result);
  }
  console.log('  OK "category" -- created ' + created.length + ' document(s).');
  return created;
}

// ─── 4. Dishes ────────────────────────────────────────────────────────────────
async function seedDishes() {
  const alreadyExists = await exists('dish');
  if (alreadyExists) {
    console.log('  SKIP "dish" -- already has data, skipping.');
    return;
  }

  const cats = await client.fetch('*[_type == "category"]{ _id, "slug": slug.current }');
  const catMap = Object.fromEntries(cats.map((c) => [c.slug, c._id]));
  const ref = (slug) => ({ _type: 'reference', _ref: catMap[slug] });

  const dishes = [
    // PIZZA
    {
      _type: 'dish', name: 'Margherita Classica',
      slug: { _type: 'slug', current: 'margherita-classica' }, category: ref('pizza'),
      shortDescription: 'A timeless Neapolitan pizza with San Marzano tomatoes and fresh mozzarella.',
      description: 'Our Margherita Classica honours the original 1889 recipe. Hand-stretched 00-flour dough, crushed San Marzano tomatoes, Fior di Latte mozzarella, and a drizzle of extra-virgin olive oil — finished with fresh basil straight from our herb garden.',
      price: 16.95, featured: true, available: true,
      ingredients: ['00-flour dough', 'San Marzano tomatoes', 'Fior di Latte mozzarella', 'fresh basil', 'extra-virgin olive oil', 'sea salt'],
      preparationTime: 18, calories: 720, rating: 4.9,
    },
    {
      _type: 'dish', name: 'Truffle & Mushroom Pizza',
      slug: { _type: 'slug', current: 'truffle-mushroom-pizza' }, category: ref('pizza'),
      shortDescription: 'Black truffle cream, wild mushrooms, and aged Parmesan on a crispy thin base.',
      description: 'An indulgent pizza featuring a silky black truffle cream base topped with a medley of wild porcini, shiitake, and cremini mushrooms. Finished with shaved aged Parmesan and a drizzle of truffle oil.',
      price: 24.50, featured: false, available: true,
      ingredients: ['thin-crust dough', 'black truffle cream', 'porcini mushrooms', 'shiitake mushrooms', 'cremini mushrooms', 'aged Parmesan', 'truffle oil', 'thyme'],
      preparationTime: 20, calories: 850, rating: 4.8,
    },
    {
      _type: 'dish', name: 'Diavola Piccante',
      slug: { _type: 'slug', current: 'diavola-piccante' }, category: ref('pizza'),
      shortDescription: 'Spicy Calabrian salami, chilli, and smoked mozzarella for the heat lovers.',
      description: 'Named after the devil himself, this bold pizza layers spicy Calabrian nduja, sliced Ventricina salami, pickled jalapenos, and smoked mozzarella over a rich San Marzano base. Drizzled with chilli-infused honey for a sweet-heat finish.',
      price: 19.95, featured: false, available: true,
      ingredients: ['pizza dough', 'San Marzano tomatoes', 'smoked mozzarella', 'Calabrian nduja', 'Ventricina salami', 'jalapenos', 'chilli honey', 'oregano'],
      preparationTime: 20, calories: 930, rating: 4.7,
    },
    {
      _type: 'dish', name: 'Quattro Formaggi',
      slug: { _type: 'slug', current: 'quattro-formaggi' }, category: ref('pizza'),
      shortDescription: 'Four-cheese luxury with mozzarella, gorgonzola, fontina, and Parmesan.',
      description: 'A cheese lover\'s dream. Our Quattro Formaggi combines creamy Fior di Latte, tangy gorgonzola dolce, nutty fontina, and sharp Parmigiano-Reggiano on a white base lightly seasoned with garlic.',
      price: 21.00, featured: false, available: true,
      ingredients: ['pizza dough', 'Fior di Latte', 'gorgonzola dolce', 'fontina', 'Parmigiano-Reggiano', 'garlic', 'black pepper', 'olive oil'],
      preparationTime: 18, calories: 980, rating: 4.6,
    },
    // BURGERS
    {
      _type: 'dish', name: 'The Classic Smash',
      slug: { _type: 'slug', current: 'the-classic-smash' }, category: ref('burgers'),
      shortDescription: 'Double smash patties, American cheese, pickles, and house sauce on a brioche bun.',
      description: 'Two hand-smashed 120g Angus beef patties pressed onto a screaming hot griddle for maximum crust. Stacked with two slices of melted American cheese, crunchy dill pickles, and our secret CulinaryPro sauce.',
      price: 17.50, featured: true, available: true,
      ingredients: ['Angus beef patties', 'brioche bun', 'American cheese', 'dill pickles', 'white onion', 'iceberg lettuce', 'CulinaryPro sauce', 'mustard'],
      preparationTime: 12, calories: 780, rating: 4.9,
    },
    {
      _type: 'dish', name: 'Mushroom Swiss Burger',
      slug: { _type: 'slug', current: 'mushroom-swiss-burger' }, category: ref('burgers'),
      shortDescription: 'Sauteed cremini mushrooms, Swiss cheese, and garlic aioli on a toasted bun.',
      description: 'A hearty 200g beef patty crowned with buttery sauteed cremini mushrooms, melted Swiss cheese, and a generous spread of roasted garlic aioli. Served on a sesame-seeded brioche bun with sun-dried tomato and baby rocket.',
      price: 19.00, featured: false, available: true,
      ingredients: ['beef patty', 'sesame brioche bun', 'Swiss cheese', 'cremini mushrooms', 'garlic aioli', 'sun-dried tomatoes', 'baby rocket'],
      preparationTime: 14, calories: 820, rating: 4.7,
    },
    {
      _type: 'dish', name: 'Crispy Chicken Burger',
      slug: { _type: 'slug', current: 'crispy-chicken-burger' }, category: ref('burgers'),
      shortDescription: 'Buttermilk-fried chicken thigh, slaw, pickles, and sriracha mayo.',
      description: 'A thick, juicy chicken thigh soaked in buttermilk, dredged in seasoned flour, and fried to golden perfection. Served on a potato bun with house slaw, house-made pickles, and a punchy sriracha mayo.',
      price: 16.00, featured: false, available: true,
      ingredients: ['chicken thigh', 'buttermilk', 'seasoned flour', 'potato bun', 'house slaw', 'bread-and-butter pickles', 'sriracha mayo'],
      preparationTime: 16, calories: 740, rating: 4.8,
    },
    {
      _type: 'dish', name: 'Wagyu Black Burger',
      slug: { _type: 'slug', current: 'wagyu-black-burger' }, category: ref('burgers'),
      shortDescription: 'Premium Wagyu patty, truffle aioli, caramelised onions, and bone-black bun.',
      description: 'Our premium burger experience. A 180g Australian Wagyu beef patty grilled to medium-rare. Served on a striking activated-charcoal brioche bun with black truffle aioli, caramelised sweet onions, aged cheddar, and crispy shallots.',
      price: 28.00, featured: true, available: true,
      ingredients: ['Wagyu beef patty', 'activated charcoal brioche bun', 'truffle aioli', 'caramelised onions', 'aged cheddar', 'crispy shallots', 'Dijon mustard'],
      preparationTime: 18, calories: 920, rating: 4.9,
    },
    // PASTA
    {
      _type: 'dish', name: 'Cacio e Pepe',
      slug: { _type: 'slug', current: 'cacio-e-pepe' }, category: ref('pasta'),
      shortDescription: 'Roman classic with Pecorino Romano, Parmigiano-Reggiano, and cracked black pepper.',
      description: 'One of Rome\'s most revered pasta dishes reduced to just three ingredients. Thick-cut tonnarelli pasta tossed in an emulsified sauce of Pecorino Romano, Parmigiano-Reggiano, and an extravagant amount of freshly cracked Tellicherry black pepper.',
      price: 18.50, featured: true, available: true,
      ingredients: ['tonnarelli pasta', 'Pecorino Romano', 'Parmigiano-Reggiano', 'Tellicherry black pepper', 'pasta water'],
      preparationTime: 15, calories: 680, rating: 4.9,
    },
    {
      _type: 'dish', name: 'Tagliatelle al Ragu',
      slug: { _type: 'slug', current: 'tagliatelle-al-ragu' }, category: ref('pasta'),
      shortDescription: 'Slow-braised Bolognese ragu with hand-rolled egg tagliatelle.',
      description: 'A six-hour slow-cooked ragu of prime beef, veal, and pork shoulder with white wine, whole milk, and a soffritto base. Tossed with hand-rolled fresh egg tagliatelle and finished with aged Parmigiano-Reggiano.',
      price: 22.00, featured: false, available: true,
      ingredients: ['fresh egg tagliatelle', 'beef', 'veal', 'pork shoulder', 'white wine', 'whole milk', 'soffritto', 'Parmigiano-Reggiano'],
      preparationTime: 20, calories: 760, rating: 4.8,
    },
    {
      _type: 'dish', name: 'Pappardelle ai Funghi Porcini',
      slug: { _type: 'slug', current: 'pappardelle-funghi-porcini' }, category: ref('pasta'),
      shortDescription: 'Wide ribbon pasta with creamy porcini sauce, garlic, and fresh thyme.',
      description: 'Wide pappardelle ribbons tossed in a luxurious sauce of rehydrated dried porcini mushrooms, sauteed shallots, garlic, Marsala wine, and double cream. Finished with shaved black truffle and fresh thyme.',
      price: 23.50, featured: false, available: true,
      ingredients: ['pappardelle pasta', 'porcini mushrooms', 'shallots', 'garlic', 'Marsala wine', 'double cream', 'black truffle', 'thyme', 'Parmesan'],
      preparationTime: 18, calories: 720, rating: 4.7,
    },
    {
      _type: 'dish', name: 'Linguine alle Vongole',
      slug: { _type: 'slug', current: 'linguine-alle-vongole' }, category: ref('pasta'),
      shortDescription: 'Briny Manila clams, white wine, garlic, chilli, and parsley over al dente linguine.',
      description: 'A coastal Italian classic. Fresh Manila clams steamed in white wine, garlic, and extra-virgin olive oil, tossed through al dente linguine with a kiss of dried chilli and an abundance of fresh flat-leaf parsley.',
      price: 24.00, featured: false, available: true,
      ingredients: ['linguine', 'Manila clams', 'white wine', 'garlic', 'dried chilli', 'flat-leaf parsley', 'extra-virgin olive oil'],
      preparationTime: 16, calories: 580, rating: 4.8,
    },
    // SALADS
    {
      _type: 'dish', name: 'Caesar Royale',
      slug: { _type: 'slug', current: 'caesar-royale' }, category: ref('salads'),
      shortDescription: 'Romaine hearts, house Caesar dressing, Parmesan crisp, and sourdough croutons.',
      description: 'Our elevated take on the timeless Caesar. Crisp inner romaine hearts dressed in a house-made Caesar dressing, topped with a cloud-thin Parmesan wafer, hand-torn sourdough croutons, shaved Parmesan, and a soft-boiled egg.',
      price: 14.50, featured: false, available: true,
      ingredients: ['romaine hearts', 'Caesar dressing', 'anchoiade', 'Parmesan wafer', 'sourdough croutons', 'quail egg', 'shaved Parmesan', 'cracked black pepper'],
      preparationTime: 10, calories: 420, rating: 4.7,
    },
    {
      _type: 'dish', name: 'Burrata & Heirloom Tomato',
      slug: { _type: 'slug', current: 'burrata-heirloom-tomato' }, category: ref('salads'),
      shortDescription: 'Creamy burrata, heirloom tomatoes, basil oil, and fleur de sel.',
      description: 'A celebration of summer. Ripe heirloom tomatoes in a spectrum of colours arranged around a pillowy ball of Pugliese burrata, drizzled with cold-pressed basil oil, aged balsamic reduction, and finished with fleur de sel and micro basil.',
      price: 16.00, featured: true, available: true,
      ingredients: ['burrata', 'heirloom tomatoes', 'basil oil', 'aged balsamic', 'fleur de sel', 'micro basil', 'extra-virgin olive oil'],
      preparationTime: 8, calories: 380, rating: 4.9,
    },
    {
      _type: 'dish', name: 'Quinoa Power Bowl',
      slug: { _type: 'slug', current: 'quinoa-power-bowl' }, category: ref('salads'),
      shortDescription: 'Tri-colour quinoa, roasted sweet potato, kale, avocado, and lemon tahini.',
      description: 'A nourishing bowl packed with plant-based goodness. Tri-colour quinoa base layered with roasted sweet potato, massaged kale, sliced avocado, cherry tomatoes, cucumber ribbons, pumpkin seeds, and drizzled with a bright lemon-tahini dressing.',
      price: 15.50, featured: false, available: true,
      ingredients: ['tri-colour quinoa', 'sweet potato', 'kale', 'avocado', 'cherry tomatoes', 'cucumber', 'pumpkin seeds', 'lemon tahini dressing'],
      preparationTime: 12, calories: 490, rating: 4.6,
    },
    {
      _type: 'dish', name: 'Greek Village Salad',
      slug: { _type: 'slug', current: 'greek-village-salad' }, category: ref('salads'),
      shortDescription: 'Ripe tomatoes, cucumber, Kalamata olives, and barrel-aged feta.',
      description: 'A traditional Horiatiki salad made with sun-ripened tomatoes, chunky cucumber, thinly sliced red onion, Kalamata olives, and a generous slab of barrel-aged Greek feta dressed simply with extra-virgin olive oil and dried oregano.',
      price: 13.00, featured: false, available: true,
      ingredients: ['tomatoes', 'cucumber', 'red onion', 'Kalamata olives', 'barrel-aged feta', 'green pepper', 'dried oregano', 'extra-virgin olive oil'],
      preparationTime: 8, calories: 310, rating: 4.6,
    },
    // DESSERTS
    {
      _type: 'dish', name: 'Tiramisu Classico',
      slug: { _type: 'slug', current: 'tiramisu-classico' }, category: ref('desserts'),
      shortDescription: 'Traditional tiramisu with Savoiardi, espresso, Marsala, and mascarpone.',
      description: 'Made fresh each morning. Savoiardi ladyfingers soaked in double-shot espresso and aged Marsala wine, layered with a cloud of whipped mascarpone and egg yolk cream, dusted with premium Dutch-process cocoa.',
      price: 10.00, featured: true, available: true,
      ingredients: ['Savoiardi ladyfingers', 'espresso', 'Marsala wine', 'mascarpone', 'free-range eggs', 'caster sugar', 'Dutch cocoa'],
      preparationTime: 5, calories: 480, rating: 4.9,
    },
    {
      _type: 'dish', name: 'Warm Chocolate Fondant',
      slug: { _type: 'slug', current: 'warm-chocolate-fondant' }, category: ref('desserts'),
      shortDescription: 'Molten Valrhona chocolate lava cake with vanilla bean ice cream.',
      description: 'A perfectly timed 72% Valrhona dark chocolate fondant, crisp on the outside and molten at the heart. Served warm alongside a quenelle of hand-churned vanilla bean ice cream and a dusting of icing sugar.',
      price: 12.50, featured: false, available: true,
      ingredients: ['Valrhona 72% dark chocolate', 'unsalted butter', 'free-range eggs', 'caster sugar', 'plain flour', 'vanilla bean ice cream'],
      preparationTime: 14, calories: 560, rating: 4.9,
    },
    {
      _type: 'dish', name: 'Lemon Posset & Berry Compote',
      slug: { _type: 'slug', current: 'lemon-posset-berry-compote' }, category: ref('desserts'),
      shortDescription: 'Silky set lemon cream with warm seasonal berry compote and shortbread.',
      description: 'An elegant British classic. Silky lemon posset made with double cream and Amalfi lemon juice, served chilled in a coupe glass alongside a warm seasonal berry compote and a crisp hand-rolled shortbread biscuit.',
      price: 9.50, featured: false, available: true,
      ingredients: ['double cream', 'Amalfi lemon', 'caster sugar', 'seasonal berries', 'shortbread'],
      preparationTime: 5, calories: 420, rating: 4.7,
    },
    {
      _type: 'dish', name: 'Affogato al Caffe',
      slug: { _type: 'slug', current: 'affogato-al-caffe' }, category: ref('desserts'),
      shortDescription: 'Fior di latte gelato drowned in a double shot of hot espresso.',
      description: 'The simplest Italian pleasure. A generous scoop of house-made fior di latte gelato placed in a chilled glass and drowned at your table with a freshly pulled double ristretto. Optionally paired with a shot of Amaretto.',
      price: 8.00, featured: false, available: true,
      ingredients: ['fior di latte gelato', 'double ristretto espresso', 'Amaretto (optional)'],
      preparationTime: 3, calories: 280, rating: 4.8,
    },
    // DRINKS
    {
      _type: 'dish', name: 'Aperol Spritz',
      slug: { _type: 'slug', current: 'aperol-spritz' }, category: ref('drinks'),
      shortDescription: 'Aperol, Prosecco, splash of soda, and a slice of orange.',
      description: 'Italy\'s favourite aperitivo. A vibrant blend of Aperol, chilled Prosecco DOC, a splash of sparkling soda, and plenty of ice — garnished with a fresh orange half-wheel and a sprig of rosemary.',
      price: 12.00, featured: false, available: true,
      ingredients: ['Aperol', 'Prosecco DOC', 'sparkling soda', 'orange', 'rosemary', 'ice'],
      preparationTime: 3, calories: 150, rating: 4.8,
    },
    {
      _type: 'dish', name: 'Negroni',
      slug: { _type: 'slug', current: 'negroni' }, category: ref('drinks'),
      shortDescription: 'Equal parts gin, Campari, and sweet vermouth — stirred, not shaken.',
      description: 'A bartender\'s benchmark. Our Negroni uses a carefully selected London Dry gin, Campari, and Carpano Antica Formula sweet vermouth. Stirred for exactly 30 seconds over ice, strained into a chilled rocks glass, and garnished with a flamed orange peel.',
      price: 14.00, featured: false, available: true,
      ingredients: ['London Dry gin', 'Campari', 'Carpano Antica Formula vermouth', 'orange peel', 'ice'],
      preparationTime: 3, calories: 195, rating: 4.9,
    },
    {
      _type: 'dish', name: 'Watermelon Basil Lemonade',
      slug: { _type: 'slug', current: 'watermelon-basil-lemonade' }, category: ref('drinks'),
      shortDescription: 'Fresh-pressed watermelon, basil syrup, and house-made lemonade.',
      description: 'A refreshing non-alcoholic option. Cold-pressed watermelon juice shaken with house-made basil simple syrup and freshly squeezed lemon juice, served tall over crushed ice with a watermelon wedge garnish.',
      price: 7.50, featured: false, available: true,
      ingredients: ['fresh watermelon', 'basil simple syrup', 'fresh lemon juice', 'sparkling water', 'crushed ice'],
      preparationTime: 4, calories: 120, rating: 4.7,
    },
    {
      _type: 'dish', name: 'Cold Brew Tonic',
      slug: { _type: 'slug', current: 'cold-brew-tonic' }, category: ref('drinks'),
      shortDescription: '18-hour cold brew coffee over tonic water with a lemon twist.',
      description: 'Our signature non-alcoholic aperitivo. Smooth 18-hour cold-brew coffee made with single-origin Ethiopian Yirgacheffe beans, gently poured over premium tonic water and ice for an effervescent, bittersweet experience. Finished with a lemon twist.',
      price: 6.50, featured: false, available: true,
      ingredients: ['Ethiopian Yirgacheffe cold brew', 'premium tonic water', 'lemon twist', 'ice'],
      preparationTime: 2, calories: 30, rating: 4.6,
    },
  ];

  const created = [];
  for (const dish of dishes) {
    const result = await client.create(dish);
    created.push(result);
  }
  console.log('  OK "dish" -- created ' + created.length + ' document(s).');
}

// ─── 5. Why Choose Us ─────────────────────────────────────────────────────────
async function seedWhyChooseUs() {
  await createIfMissing('whyChooseUs', [
    {
      _type: 'whyChooseUs', title: 'Farm-to-Table Freshness',
      description: 'Every ingredient is sourced directly from trusted local farms and artisan producers. We refuse to compromise on quality — if it is not fresh, it is not on your plate.',
      icon: 'leaf', displayOrder: 1,
    },
    {
      _type: 'whyChooseUs', title: 'Michelin-Trained Chefs',
      description: 'Our kitchen is led by chefs trained in Europe\'s finest establishments. Every dish is crafted with classical technique, modern creativity, and an obsessive attention to detail.',
      icon: 'chef', displayOrder: 2,
    },
    {
      _type: 'whyChooseUs', title: 'Lightning-Fast Delivery',
      description: 'We have engineered our kitchen workflow and delivery network so your food arrives hot, fresh, and beautifully presented — in 30 minutes or your next order is on us.',
      icon: 'truck', displayOrder: 3,
    },
    {
      _type: 'whyChooseUs', title: 'Seamless Digital Experience',
      description: 'From browsing our menu to tracking your delivery in real time, we have built a digital experience as polished as the food itself. Because great hospitality extends beyond the table.',
      icon: 'star', displayOrder: 4,
    },
  ]);
}

// ─── 6. Testimonials ─────────────────────────────────────────────────────────
async function seedTestimonials() {
  await createIfMissing('testimonial', [
    {
      _type: 'testimonial', customerName: 'Alexandra Mercer',
      customerRole: 'Food Critic, The Gourmet Post',
      review: 'CulinaryPro has redefined what I expect from a modern restaurant. The Cacio e Pepe is genuinely one of the finest I have had outside of Rome. The attention to detail here is extraordinary.',
      rating: 5, displayOrder: 1,
    },
    {
      _type: 'testimonial', customerName: 'James Thornton',
      customerRole: 'Regular Guest',
      review: 'I have been coming here every Friday for six months. The Wagyu Burger alone is worth crossing the city for. The service is impeccable and the atmosphere is exactly right — sophisticated but relaxed.',
      rating: 5, displayOrder: 2,
    },
    {
      _type: 'testimonial', customerName: 'Priya Sharma',
      customerRole: 'Event Planner',
      review: 'We hosted a corporate dinner for 30 guests and CulinaryPro exceeded every expectation. The food was stunning, the coordination was flawless, and our clients were genuinely impressed.',
      rating: 5, displayOrder: 3,
    },
    {
      _type: 'testimonial', customerName: 'Marcus Delaunay',
      customerRole: 'Chef & Restaurateur',
      review: 'As a professional chef, I am a tough critic. But the Truffle & Mushroom Pizza and that tiramisu made fresh each morning genuinely moved me. Excellent sourcing, excellent technique.',
      rating: 5, displayOrder: 4,
    },
    {
      _type: 'testimonial', customerName: 'Olivia Chen',
      customerRole: 'Tech Executive',
      review: 'The online ordering experience is the best I have used. It is fast, the menu is clear, and the food arrived in perfect condition every single time. The Caesar Royale is my weekly ritual now.',
      rating: 4, displayOrder: 5,
    },
    {
      _type: 'testimonial', customerName: 'Daniel Okafor',
      customerRole: 'Verified Customer',
      review: 'Incredible food at prices that still feel fair for the quality. The Burrata & Heirloom Tomato was a religious experience and the Chocolate Fondant made my date very impressed. 10 out of 10.',
      rating: 5, displayOrder: 6,
    },
  ]);
}

// ─── 7. Contact ───────────────────────────────────────────────────────────────
async function seedContact() {
  await createIfMissing('contact', [
    {
      _type: 'contact',
      address: '14 Gourmet Boulevard, Midtown, New York, NY 10018, United States',
      phone: '+1 (212) 555-0174',
      email: 'reservations@culinarypro.com',
      googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215209132935!2d-73.9878584!3d40.7484405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9aeb1c6b5%3A0x35b1cfbc89a6097f!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus',
      socialMediaLinks: [
        { platform: 'Instagram', url: 'https://instagram.com/culinarypro' },
        { platform: 'Facebook', url: 'https://facebook.com/culinarypro' },
        { platform: 'Twitter', url: 'https://twitter.com/culinarypro' },
      ],
    },
  ]);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('Seeding documents...\n');
  await seedRestaurantSettings();
  await seedHero();
  await seedCategories();
  await seedDishes();
  await seedWhyChooseUs();
  await seedTestimonials();
  await seedContact();
  console.log('\nSeed complete! Open Sanity Studio at http://localhost:3000/studio to view your content.\n');
}

main().catch((err) => {
  console.error('\nSeed failed:', err.message);
  process.exit(1);
});

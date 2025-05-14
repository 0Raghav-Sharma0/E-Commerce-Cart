const Product = require('../models/product');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');

// Updated product data with different content
const productSeeds = [
  // === TVs ===
  {
    name: 'Sony Bravia XR 65" OLED',
    description: 'Cinematic OLED TV with Cognitive Processor XR for stunning visuals.',
    price: 199990,
    category: 'electronics',
    image: 'https://imgs.search.brave.com/MrDktUbAFyN99TSTwIbLq6YFaHNxkeaj9jWAQBY_tik/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pNS53/YWxtYXJ0aW1hZ2Vz/LmNvbS9zZW8vU29u/eS02NS1jbGFzcy1C/UkFWSUEtNy1NaW5p/LUxFRC1RTEVELTRL/LUhEUi1TbWFydC1H/b29nbGUtVFYtSzY1/WFI3MC0yMDI0LU1v/ZGVsXzcyNmQwZDRi/LWEwMjktNDhjNC04/ODNhLTljZDEwY2Uy/Y2EwNS5kOGVkM2Ri/ZTQxNjlkMGU4ODQ2/YTRmNDAzZjRhZTAy/ZC5qcGVnP29kbkhl/aWdodD01ODAmb2Ru/V2lkdGg9NTgwJm9k/bkJnPUZGRkZGRg',
    brand: 'Sony',
    stock: 10,
  },
  {
    name: 'LG QNED 86 75" 4K Smart TV',
    description: 'Next-gen LED display with Quantum Dot and NanoCell technology.',
    price: 179990,
    category: 'electronics',
    image: 'https://lgonlinestores.com/wp-content/uploads/2024/01/75QNED86SQA-D-1-v001.webp',
    brand: 'LG',
    stock: 8,
  },
  {
    name: 'Samsung Neo QLED 8K 65"',
    description: 'Immersive 8K experience with Quantum Matrix Technology.',
    price: 329999,
    category: 'electronics',
    image: 'https://sammyguru.com/wp-content/uploads/2025/04/Samsung-Neo-QLED-8K-TV-900F.jpg',
    brand: 'Samsung',
    stock: 6,
  },

  // === Mobile Phones ===
  {
    name: 'iPhone 14 Pro',
    description: 'Apple’s powerful device with Dynamic Island and A16 Bionic chip.',
    price: 129900,
    category: 'electronics',
    image: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-14-pro-max-1.jpg',
    brand: 'Apple',
    stock: 30,
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Samsung’s top-tier phone with integrated S Pen and quad camera.',
    price: 134999,
    category: 'electronics',
    image: 'https://m.media-amazon.com/images/I/71WcjsOVOmL._AC_SX679_.jpg',
    brand: 'Samsung',
    stock: 20,
  },
  {
    name: 'Google Pixel 8 Pro',
    description: 'Google’s flagship phone with Tensor G3 chip and advanced AI features.',
    price: 106999,
    category: 'electronics',
    image: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8-pro-1.jpg',
    brand: 'Google',
    stock: 25,
  },
  {
    name: 'OnePlus 12 5G',
    description: 'Flagship killer with Snapdragon 8 Gen 3 and 100W fast charging.',
    price: 64999,
    category: 'electronics',
    image: 'https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-12-1.jpg',
    brand: 'OnePlus',
    stock: 40,
  },
  {
    name: 'Motorola Edge 50 Pro',
    description: 'Stunning pOLED display with 125W TurboPower™ charging.',
    price: 31999,
    category: 'electronics',
    image: 'https://fdn2.gsmarena.com/vv/pics/motorola/motorola-edge-50-5g-1.jpg',
    brand: 'Motorola',
    stock: 50,
  },
  {
    name: 'Realme GT 6T',
    description: 'Upcoming performance smartphone with sleek design.',
    price: 29999,
    category: 'electronics',
    image: 'https://hamariweb.com/images/MobilePhones/realme-gt-6t.jpg',
    brand: 'Realme',
    stock: 35,
  },

  // === Headsets ===
  {
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise-canceling headphones.',
    price: 29990,
    category: 'electronics',
    image: 'https://imgs.search.brave.com/PNYxtDSdxJ7cfBcPM6bI3MyEaqda5aOcX4l4UI6Sh9M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zMS5r/dWFudG9rdXN0YS5w/dC9pbWdfdXBsb2Fk/L3Byb2R1dG9zX2lt/YWdlbXNvbS81ODk0/MTVfM19zb255LXdo/LTEwMDB4bTUtYmx1/ZXRvb3RoLW5vaXNl/LWNhbmNlbGxpbmct/Ymx1ZS5qcGc',
    brand: 'Sony',
    stock: 60,
  },
  {
    name: 'Apple AirPods Max',
    description: 'Over-ear headphones with high-fidelity audio and spatial sound.',
    price: 59900,
    category: 'electronics',
    image: 'https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/airpods-max-hero-select-202011_FMT_WHH?wid=607&hei=556&fmt=jpeg&qlt=90&.v=1633623988000',
    brand: 'Apple',
    stock: 40,
  },
  {
    name: 'Bose QuietComfort 45',
    description: 'Comfortable wireless headphones with adaptive noise canceling.',
    price: 32990,
    category: 'electronics',
    image: 'https://imgs.search.brave.com/wbyWc7q3OkEGDu5_7Cjx6OwAl9DWqOfs00l7CIuDHIY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMtbmEuc3NsLWlt/YWdlcy1hbWF6b24u/Y29tL2ltYWdlcy9J/LzUxSEhBQk1Qb1ZM/LmpwZw',
    brand: 'Bose',
    stock: 50,
  },
  {
    name: 'JBL Tune 770NC',
    description: 'Over-ear headphones with Pure Bass and Active Noise Canceling.',
    price: 6999,
    category: 'electronics',
    image: 'https://imgs.search.brave.com/D7GBe5FNrx38OGPhi-SEwOReav3RWNJpZW8v4AsxnXg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/ZXJpa3NvbmNvbnN1/bWVyLmNvbS9pbWFn/ZXMvcHJvZHVjdHMv/NzU3Ny8zMTMzLzYw/MHg2MDAvSkJMVDc3/ME5DQkxLQU0uanBn',
    brand: 'JBL',
    stock: 70,
  },

  // === Cameras ===
  {
    name: 'Canon EOS R6 Mark II',
    description: 'High-performance mirrorless camera with 24MP full-frame sensor.',
    price: 214999,
    category: 'electronics',
    image: 'https://imgs.search.brave.com/c5Y1pbblLPDtWEtP-WzU2umPFBv5YOADHxFVFR9mby0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS50aGUtZGlnaXRh/bC1waWN0dXJlLmNv/bS9JbWFnZXMvT3Ro/ZXIvQ2Fub24tRU9T/LVI2LU1hcmstSUkv/Q2Fub24tRU9TLVI2/LU1hcmstSUktd2l0/aC1SRi0yNC0xMDVt/bS1MZW5zLndlYnA',
    brand: 'Canon',
    stock: 10,
  },
  {
    name: 'Sony Alpha A7 IV',
    description: 'Full-frame camera with real-time Eye AF and 4K recording.',
    price: 229990,
    category: 'electronics',
    image: 'https://imgs.search.brave.com/iFoEBChd7FGXG_GwxMfXPLj0RqjsP0B-1K4qre49mEw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/a2Vucm9ja3dlbGwu/Y29tL3NvbnkvYTkv/ODEwXzA3NDktY2Fu/b24tNTBtbS1mMS5q/cGc',
    brand: 'Sony',
    stock: 8,
  },
  {
    name: 'Nikon Z6 II',
    description: 'Versatile mirrorless camera with dual processors.',
    price: 189999,
    category: 'electronics',
    image: 'https://imgs.search.brave.com/72UyyHcnJZE-UgXh30evyywk_Cmnx7O1T9c45H19EF8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aW1hZ2luZy1yZXNv/dXJjZS5jb20vUFJP/RFMvb2x5bXB1cy1l/LW01LWlpaS9aWUZS/T05ULU1ELkpQRz80/NA',
    brand: 'Nikon',
    stock: 6,
  },

  // === Laptops ===
  {
    name: 'Apple MacBook Air M2',
    description: 'Lightweight laptop with Apple Silicon and Retina display.',
    price: 114900,
    category: 'computers',
    image: 'https://imgs.search.brave.com/FXovCIVPPA-vOyfDZMnlDNpPE2XFvU3uvtTg7auZnvg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS53aXJlZC5jb20v/cGhvdG9zLzY3ZDA3/ODQ4MDVmZDIwMjM0/ZmFjMjFmOC9tYXN0/ZXIvd18xNjAwLGNf/bGltaXQvTWFjQm9v/ay1BaXItTTQtMTUt/SW5jaC0yMDI1LShz/aWRlLWhhbGYtb3Bl/bi1zZW1pLWZvbGRl/ZCktUmV2aWV3ZXIt/UGhvdG8tU09VUkNF/LUx1a2UtTGFyc2Vu/LmpwZw',
    brand: 'Apple',
    stock: 20,
  },
  {
    name: 'Dell XPS 13 Plus',
    description: 'Premium ultrabook with InfinityEdge display and Intel Evo.',
    price: 139990,
    category: 'computers',
    image: 'https://imgs.search.brave.com/8TpFxUxmCHrBWsK0Kav9tXuOM3Ndr6uIb2xCCrCqgfk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLmRl/bGwuY29tL2lzL2lt/YWdlL0RlbGxDb250/ZW50L2NvbnRlbnQv/ZGFtL3NzMi9wcm9k/dWN0LWltYWdlcy9k/ZWxsLWNsaWVudC1w/cm9kdWN0cy9ub3Rl/Ym9va3MveHBzLW5v/dGVib29rcy94cHMt/MTMtOTMyMC9tZWRp/YS1nYWxsZXJ5L3hz/OTMyMG50LXhuYi1z/aG90LTUtMi1zbC5w/c2Q_Zm10PXBuZy1h/bHBoYSZwc2Nhbj1h/dXRvJnNjbD0xJmhl/aT00MDImd2lkPTQ5/OCZxbHQ9MTAwLDEm/cmVzTW9kZT1zaGFy/cDImc2l6ZT00OTgs/NDAyJmNocnNzPWZ1/bGw',
    brand: 'Dell',
    stock: 15,
  },
  {
    name: 'ASUS ROG Zephyrus G14',
    description: 'Compact gaming laptop with Ryzen 9 and RTX 4060.',
    price: 149990,
    category: 'computers',
    image: 'https://imgs.search.brave.com/VyxEreGOXSeHEiRpysNWBkech7GlVASPmsQjdCU96Dg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBj/bWFnLmNvbS9pbWFn/ZXJ5L3Jldmlld3Mv/MDZuNm5kQUptdVV2/S1lMR3YxbmpjbjAt/MS5maXRfc2NhbGUu/c2l6ZV80MDB4MjI1/LnYxNzEwNTQwNjgx/LmpwZw',
    brand: 'ASUS',
    stock: 10,
  },
  // === AirPods ===
{
  name: 'Apple AirPods Pro (2nd Gen)',
  description: 'Active Noise Cancellation with Adaptive Transparency and MagSafe charging case.',
  price: 24900,
  category: 'electronics',
  image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=400&hei=400&fmt=jpeg&qlt=95&.v=1660803972361',
  brand: 'Apple',
  stock: 60,
},
{
  name: 'Apple AirPods (3rd Gen)',
  description: 'Personalized Spatial Audio with dynamic head tracking.',
  price: 19900,
  category: 'electronics',
  image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MME73?wid=400&hei=400&fmt=jpeg&qlt=95&.v=1632861338000',
  brand: 'Apple',
  stock: 70,
},
{
  name: 'Apple AirPods Max',
  description: 'Over-ear headphones with dynamic driver and Active Noise Cancellation.',
  price: 59900,
  category: 'electronics',
  image: 'https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/airpods-max-hero-select-202011_FMT_WHH?wid=607&hei=556&fmt=jpeg&qlt=90&.v=1633623988000',
  brand: 'Apple',
  stock: 40,
},
{
  name: 'Apple AirPods (2nd Gen)',
  description: 'Wireless Bluetooth earphones with H1 chip and “Hey Siri” support.',
  price: 12900,
  category: 'electronics',
  image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MV7N2?wid=400&hei=400&fmt=jpeg&qlt=95&.v=1551489688005',
  brand: 'Apple',
  stock: 90,
},
{
  name: 'Apple AirPods Pro with USB-C',
  description: 'The latest AirPods Pro with USB-C and IP54-rated dust resistance.',
  price: 24900,
  category: 'electronics',
  image: 'https://imgs.search.brave.com/nOy5pu_MNYOQ1uZXtJhiXXwBE9EazvAheO3vqHRjXvY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMxLnBvY2tldGxp/bnRpbWFnZXMuY29t/L3dvcmRwcmVzcy93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMy8x/MS9hcHBsZS1haXJw/b2RzLXByby0ybmQt/Z2VuLXNxdWFyZS5q/cGc',
  brand: 'Apple',
  stock: 55,
},

];


const seedDB = async () => {
  await Product.deleteMany({});
  await Product.insertMany(productSeeds);
  console.log('Products data seeded successfully!');
};

if (process.argv[2] == 'dev') {
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
  mongoose.connect(process.env.MONGO_URI, {}).then(async () => {
    await seedDB();
    process.exit();
  });
}

module.exports = seedDB;

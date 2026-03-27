import { db, categoriesTable, productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const categories = [
  { name: "Scrubs & Uniforms", slug: "scrubs", description: "Professional medical scrubs and uniforms for doctors and nurses", productCount: 0, iconName: "Shirt" },
  { name: "Aprons & Coats", slug: "aprons", description: "Lab coats, aprons and protective wear for medical professionals", productCount: 0, iconName: "Shield" },
  { name: "Books & Study Material", slug: "books", description: "Medical textbooks, NEET-PG guides, and study resources", productCount: 0, iconName: "BookOpen" },
  { name: "Stethoscopes", slug: "stethoscopes", description: "High-quality stethoscopes from leading brands", productCount: 0, iconName: "Stethoscope" },
  { name: "Surgical Instruments", slug: "surgical", description: "Precision surgical instruments and tools", productCount: 0, iconName: "Scissors" },
  { name: "Medical Equipment", slug: "equipment", description: "BP machines, oximeters, thermometers and diagnostic devices", productCount: 0, iconName: "Activity" },
];

const products = [
  // Scrubs
  { name: "Premium Stretch Scrub Top - Navy Blue", description: "Ultra-comfortable 4-way stretch scrub top with antimicrobial fabric. Perfect for long hospital shifts. Available in multiple colors. Machine washable.", price: "1299", originalPrice: "1799", category: "Scrubs & Uniforms", categorySlug: "scrubs", brand: "MedWear Pro", imageUrl: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&q=80", rating: "4.5", reviewCount: 234, inStock: true, tags: ["scrubs", "medical uniform", "antimicrobial"], featured: true },
  { name: "Professional Scrub Set - Ceil Blue", description: "Complete scrub set including top and pants. Moisture-wicking fabric keeps you comfortable during procedures. Multiple pockets for medical tools.", price: "2199", originalPrice: "2999", category: "Scrubs & Uniforms", categorySlug: "scrubs", brand: "DoctorFit", imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80", rating: "4.7", reviewCount: 189, inStock: true, tags: ["scrubs", "set", "comfortable"], featured: false },
  { name: "Women's Fitted Scrub Pants - Charcoal", description: "Tailored fit scrub pants for women doctors. Features cargo pockets, drawstring waist, and soft cotton-polyester blend for all-day comfort.", price: "999", originalPrice: "1299", category: "Scrubs & Uniforms", categorySlug: "scrubs", brand: "MedWear Pro", imageUrl: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&q=80", rating: "4.3", reviewCount: 156, inStock: true, tags: ["scrub pants", "women", "comfortable"], featured: false },

  // Aprons
  { name: "White Lab Coat - Full Length", description: "Classic white lab coat in 100% cotton. Full length with 3 spacious pockets. Name badge slot included. Available in S to 3XL.", price: "1499", originalPrice: "1999", category: "Aprons & Coats", categorySlug: "aprons", brand: "LabCraft", imageUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=80", rating: "4.6", reviewCount: 312, inStock: true, tags: ["lab coat", "white coat", "doctor"], featured: true },
  { name: "Short Lab Coat for Medical Students", description: "Half-length white coat ideal for MBBS students and interns. Lightweight cotton-polyester blend. Easy-care fabric. Embroidery-ready.", price: "799", originalPrice: "999", category: "Aprons & Coats", categorySlug: "aprons", brand: "MedStudent", imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80", rating: "4.4", reviewCount: 445, inStock: true, tags: ["lab coat", "student", "MBBS"], featured: false },
  { name: "Surgical Gown - Sterile Pack", description: "Disposable sterile surgical gown for OT use. Made from SMS non-woven fabric. Level 2 barrier protection. Pack of 10.", price: "1199", category: "Aprons & Coats", categorySlug: "aprons", brand: "SterileGuard", imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80", rating: "4.2", reviewCount: 89, inStock: true, tags: ["surgical gown", "sterile", "OT"], featured: false },

  // Books
  { name: "Harrison's Principles of Internal Medicine - 21st Ed", description: "The most trusted medical textbook for internal medicine. Updated with latest guidelines, clinical pearls, and case studies. Essential for residents and clinicians.", price: "8999", originalPrice: "11999", category: "Books & Study Material", categorySlug: "books", brand: "McGraw-Hill", imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80", rating: "4.9", reviewCount: 567, inStock: true, tags: ["medicine", "harrison", "textbook", "internal medicine"], featured: true },
  { name: "NEET-PG Grand Test Series 2025 - Complete Pack", description: "Comprehensive NEET-PG preparation pack with 30 full-length mock tests, subject-wise Q-banks, and detailed explanations. Latest pattern.", price: "3499", originalPrice: "4999", category: "Books & Study Material", categorySlug: "books", brand: "DAMS", imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80", rating: "4.7", reviewCount: 823, inStock: true, tags: ["NEET-PG", "mock test", "preparation"], featured: true },
  { name: "Gray's Anatomy - 42nd Edition", description: "The definitive anatomy reference for medical students and professionals. Comprehensive coverage with stunning illustrations and clinical correlations.", price: "7499", originalPrice: "9999", category: "Books & Study Material", categorySlug: "books", brand: "Elsevier", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80", rating: "4.8", reviewCount: 342, inStock: true, tags: ["anatomy", "gray's anatomy", "textbook"], featured: false },

  // Stethoscopes
  { name: "3M Littmann Classic III Stethoscope", description: "India's most popular stethoscope for medical students and doctors. Excellent acoustic performance for both respiratory and cardiovascular assessments. Durable tubing.", price: "9999", originalPrice: "12999", category: "Stethoscopes", categorySlug: "stethoscopes", brand: "3M Littmann", imageUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&q=80", rating: "4.9", reviewCount: 1203, inStock: true, tags: ["stethoscope", "3M", "Littmann", "classic"], featured: true },
  { name: "3M Littmann Cardiology IV", description: "Professional-grade stethoscope for cardiologists and physicians. Superior acoustic sensitivity for detecting difficult heart and breath sounds. Pediatric and adult diaphragm.", price: "22999", originalPrice: "27999", category: "Stethoscopes", categorySlug: "stethoscopes", brand: "3M Littmann", imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80", rating: "5.0", reviewCount: 456, inStock: true, tags: ["stethoscope", "cardiology", "professional"], featured: false },
  { name: "MDF Acoustica Stethoscope for Students", description: "High-quality stethoscope ideal for MBBS students and interns. Affordable with excellent sound quality. Comes with extra ear tips and case. Lifetime warranty.", price: "2999", originalPrice: "3999", category: "Stethoscopes", categorySlug: "stethoscopes", brand: "MDF Instruments", imageUrl: "https://images.unsplash.com/photo-1590959651373-a3db0f38a961?w=400&q=80", rating: "4.4", reviewCount: 789, inStock: true, tags: ["stethoscope", "student", "affordable"], featured: false },

  // Surgical
  { name: "Basic Surgical Instrument Set - 12 Pieces", description: "Complete set for minor surgical procedures. Includes scissors, forceps, retractors, needle holders, and clamps. German stainless steel, autoclavable.", price: "4999", originalPrice: "6999", category: "Surgical Instruments", categorySlug: "surgical", brand: "SurgiMed", imageUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&q=80", rating: "4.6", reviewCount: 234, inStock: true, tags: ["surgical instruments", "set", "stainless steel"], featured: true },
  { name: "Kocher's Forceps - Straight", description: "High-quality Kocher's forceps for tissue grasping during surgery. Made from 316L surgical-grade stainless steel. Autoclavable. Length: 18cm.", price: "699", originalPrice: "899", category: "Surgical Instruments", categorySlug: "surgical", brand: "IndoSurgicals", imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80", rating: "4.3", reviewCount: 167, inStock: true, tags: ["forceps", "surgical", "stainless steel"], featured: false },
  { name: "Disposable Scalpel Blades - Box of 100", description: "Sterile, single-use carbon steel scalpel blades. Individually packaged. Available in sizes 10, 11, 15, 20, 22. Comes in a convenient storage box.", price: "1299", category: "Surgical Instruments", categorySlug: "surgical", brand: "SterileEdge", imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80", rating: "4.5", reviewCount: 312, inStock: true, tags: ["scalpel", "blade", "disposable"], featured: false },

  // Equipment
  { name: "OMRON HEM-7156 BP Monitor - Upper Arm", description: "Clinically validated automatic blood pressure monitor. Irregular heartbeat detection, 60-reading memory, easy cuff wrap guide. Trusted by Indian doctors and patients.", price: "3499", originalPrice: "4499", category: "Medical Equipment", categorySlug: "equipment", brand: "OMRON", imageUrl: "https://images.unsplash.com/photo-1559841644-08984562005b?w=400&q=80", rating: "4.7", reviewCount: 1456, inStock: true, tags: ["BP machine", "blood pressure monitor", "OMRON"], featured: true },
  { name: "Pulse Oximeter - Fingertip SpO2 Monitor", description: "Accurate fingertip pulse oximeter for oxygen saturation and pulse rate monitoring. Large LED display, fast reading, auto shutoff. Essential for every clinic.", price: "999", originalPrice: "1499", category: "Medical Equipment", categorySlug: "equipment", brand: "Dr. Trust", imageUrl: "https://images.unsplash.com/photo-1584931423298-c576fda54bd2?w=400&q=80", rating: "4.5", reviewCount: 2341, inStock: true, tags: ["oximeter", "SpO2", "pulse rate"], featured: true },
  { name: "Digital Thermometer - Non-Contact Infrared", description: "Contactless forehead thermometer for quick and hygienic temperature measurement. 1-second reading, fever alarm, 32-memory storage. Ideal for clinic use.", price: "1299", originalPrice: "1799", category: "Medical Equipment", categorySlug: "equipment", brand: "Carent", imageUrl: "https://images.unsplash.com/photo-1583911613052-fac6af762f5a?w=400&q=80", rating: "4.4", reviewCount: 892, inStock: true, tags: ["thermometer", "infrared", "contactless"], featured: false },
  { name: "Glucometer - Blood Sugar Testing Kit", description: "Complete blood glucose monitoring kit. Includes 25 test strips, 25 lancets, lancing device, and case. No coding required. Results in 5 seconds.", price: "1799", originalPrice: "2499", category: "Medical Equipment", categorySlug: "equipment", brand: "Accu-Chek", imageUrl: "https://images.unsplash.com/photo-1559839914-17aae19cec71?w=400&q=80", rating: "4.6", reviewCount: 1123, inStock: true, tags: ["glucometer", "diabetes", "blood sugar"], featured: false },
];

async function seed() {
  console.log("Seeding database...");

  await db.delete(categoriesTable);
  await db.delete(productsTable);

  await db.insert(categoriesTable).values(categories);
  console.log(`Inserted ${categories.length} categories`);

  for (const product of products) {
    await db.insert(productsTable).values({
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice ?? null,
      category: product.category,
      categorySlug: product.categorySlug,
      brand: product.brand,
      imageUrl: product.imageUrl,
      rating: product.rating,
      reviewCount: product.reviewCount,
      inStock: product.inStock,
      tags: product.tags,
      featured: product.featured,
    });
  }
  console.log(`Inserted ${products.length} products`);

  // Update category product counts
  for (const cat of categories) {
    const count = products.filter(p => p.categorySlug === cat.slug).length;
    await db.update(categoriesTable)
      .set({ productCount: count })
      .where(eq(categoriesTable.slug, cat.slug));
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch(console.error);

/**
 * seedCurriculumBooks.ts
 * Seeds books organized by Indian medical curriculum (MBBS→MD→MS→MCh→DM→DNB)
 * Run: pnpm --filter @workspace/api-server exec tsx src/lib/seedCurriculumBooks.ts
 */
import { db, productsTable, categoriesTable } from "@workspace/db";
import { ilike, eq, sql } from "drizzle-orm";

const IMG = [
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80",
  "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80",
  "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80",
  "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
];
const img = (i: number) => IMG[i % IMG.length];

interface SeedBook {
  name: string;
  desc: string;
  price: string;
  orig: string;
  cat: string;
  slug: string;
  brand: string;
  rating: string;
  reviews: number;
  tags: string[];
  featured: boolean;
}

const BOOKS: SeedBook[] = [
  // ── Forensic Medicine ──────────────────────────────────────────────
  { name: "Krishan Vij Textbook of Forensic Medicine & Toxicology 6th Ed", desc: "The most popular forensic medicine textbook for Indian MBBS students. Covers all aspects of forensic medicine, medical jurisprudence, and clinical toxicology with case studies and medico-legal aspects.", price: "1299", orig: "1699", cat: "Books & Study Material", slug: "books", brand: "Reed Elsevier India", rating: "4.8", reviews: 2345, tags: ["Krishan Vij","forensic","toxicology","MBBS","India"], featured: true },
  { name: "Parikh's Textbook of Medical Jurisprudence 7th Ed", desc: "A classic reference on medical jurisprudence, forensic medicine, and clinical toxicology. Widely used by Indian medical students for over 50 years.", price: "1199", orig: "1599", cat: "Books & Study Material", slug: "books", brand: "CBS Publishers", rating: "4.7", reviews: 1876, tags: ["Parikh","forensic","jurisprudence","India"], featured: false },
  { name: "Simpson's Forensic Medicine 14th Ed", desc: "An authoritative international forensic medicine textbook covering crime scene investigation, cause of death, sexual offences, and toxicology.", price: "3999", orig: "5499", cat: "Books & Study Material", slug: "books", brand: "CRC Press", rating: "4.6", reviews: 543, tags: ["Simpson","forensic medicine","international"], featured: false },
  { name: "Modi's Medical Jurisprudence & Toxicology 25th Ed", desc: "A comprehensive Indian reference for medical jurisprudence and toxicology. Includes medico-legal sections specific to Indian Penal Code and clinical poisoning.", price: "1499", orig: "1999", cat: "Books & Study Material", slug: "books", brand: "LexisNexis", rating: "4.7", reviews: 1234, tags: ["Modi","forensic","toxicology","India"], featured: false },
  { name: "Mukherjee Forensic Medicine & Toxicology 4th Ed", desc: "A simplified forensic medicine guide for MBBS students covering medico-legal examination, autopsy techniques, and clinical toxicology.", price: "999", orig: "1299", cat: "Books & Study Material", slug: "books", brand: "New Central Book Agency", rating: "4.5", reviews: 876, tags: ["Mukherjee","forensic medicine","India"], featured: false },

  // ── Community Medicine / PSM ──────────────────────────────────────
  { name: "Park's Textbook of Preventive & Social Medicine 26th Ed", desc: "The most widely used community medicine textbook in India. Covers epidemiology, biostatistics, health policy, nutrition, communicable diseases, and national health programmes.", price: "1299", orig: "1699", cat: "Books & Study Material", slug: "books", brand: "M/s Banarsidas Bhanot", rating: "4.9", reviews: 5678, tags: ["Park's","PSM","community medicine","MBBS","India"], featured: true },
  { name: "KJ Ananthakrishnan's Community Medicine 3rd Ed", desc: "A concise community medicine textbook for Indian students covering preventive medicine, primary health care, and national programmes with practical exercises.", price: "999", orig: "1299", cat: "Books & Study Material", slug: "books", brand: "CBS Publishers", rating: "4.7", reviews: 2109, tags: ["Ananthakrishnan","community medicine","India"], featured: false },
  { name: "Mahajan & Gupta Textbook of Preventive & Social Medicine 5th Ed", desc: "A systematic textbook of preventive medicine and public health covering epidemiology, biostatistics, environment, occupational health and health management.", price: "1099", orig: "1399", cat: "Books & Study Material", slug: "books", brand: "Jaypee Brothers", rating: "4.7", reviews: 1876, tags: ["Mahajan Gupta","PSM","community medicine"], featured: false },
  { name: "Maxcy-Rosenau-Last Public Health & Preventive Medicine 15th Ed", desc: "The authoritative North American public health textbook covering epidemiology, biostatistics, environmental health, chronic disease prevention, and healthcare systems.", price: "7999", orig: "10999", cat: "Books & Study Material", slug: "books", brand: "McGraw-Hill", rating: "4.7", reviews: 432, tags: ["Maxcy Rosenau","public health","epidemiology"], featured: false },
  { name: "Epidemiology by Leon Gordis 6th Ed", desc: "A classic epidemiology text for medical students and public health practitioners. Clear writing with excellent examples of study design, bias, confounding and causality.", price: "3999", orig: "5499", cat: "Books & Study Material", slug: "books", brand: "Elsevier", rating: "4.8", reviews: 765, tags: ["Gordis","epidemiology","biostatistics"], featured: false },
  { name: "DK Taneja Community Medicine 6th Ed", desc: "A comprehensive community medicine textbook for Indian medical students. Covers preventive medicine, epidemiology, national health programmes, and health administration.", price: "999", orig: "1299", cat: "Books & Study Material", slug: "books", brand: "Jaypee", rating: "4.6", reviews: 1234, tags: ["Taneja","community medicine","India"], featured: false },

  // ── MCh Neurosurgery ─────────────────────────────────────────────
  { name: "Youmans & Winn Neurological Surgery 7th Ed", desc: "The definitive neurosurgery reference — a comprehensive multi-volume set covering all aspects of neurosurgical disease, technique, and perioperative management.", price: "19999", orig: "27999", cat: "Neurology", slug: "neurology", brand: "Elsevier", rating: "4.9", reviews: 543, tags: ["Youmans","neurosurgery","textbook","MCh"], featured: true },
  { name: "Greenberg Handbook of Neurosurgery 9th Ed", desc: "The essential companion for neurosurgeons in training and practice. Concise, authoritative guidance on all neurosurgical conditions and operative techniques.", price: "5999", orig: "7999", cat: "Neurology", slug: "neurology", brand: "Thieme", rating: "4.9", reviews: 876, tags: ["Greenberg","neurosurgery","handbook"], featured: true },
  { name: "Rengachary Principles of Neurosurgery 3rd Ed", desc: "A thorough textbook of neurosurgical principles covering neuroanatomy, neurodiagnosis, neuroanaesthesia, and all major operative neurosurgical techniques.", price: "9999", orig: "13999", cat: "Neurology", slug: "neurology", brand: "Elsevier", rating: "4.7", reviews: 298, tags: ["Rengachary","neurosurgery","principles"], featured: false },

  // ── MCh Cardiothoracic ───────────────────────────────────────────
  { name: "Kirklin/Barratt-Boyes Cardiac Surgery 4th Ed", desc: "The gold standard cardiac surgery textbook. Covers congenital heart disease, valvular surgery, coronary artery surgery, cardiac transplantation, and more.", price: "14999", orig: "19999", cat: "Cardiac Care", slug: "cardiac-care", brand: "Elsevier", rating: "4.9", reviews: 234, tags: ["Kirklin","cardiac surgery","cardiothoracic","MCh"], featured: true },
  { name: "Sabiston & Spencer Surgery of the Chest 8th Ed", desc: "The authoritative reference for thoracic surgery covering lung cancer, oesophageal surgery, tracheal surgery, and thoracic trauma.", price: "12999", orig: "17999", cat: "Surgical", slug: "surgical", brand: "Elsevier", rating: "4.8", reviews: 198, tags: ["Sabiston Spencer","thoracic surgery","chest"], featured: false },
  { name: "Cohn Cardiac Surgery in the Adult 5th Ed", desc: "A comprehensive single-volume cardiac surgery textbook covering CABG, valve surgery, aortic surgery, electrophysiology procedures and mechanical circulatory support.", price: "9999", orig: "13499", cat: "Cardiac Care", slug: "cardiac-care", brand: "McGraw-Hill", rating: "4.8", reviews: 167, tags: ["Cohn","cardiac surgery","adult"], featured: false },

  // ── MCh Plastic Surgery ──────────────────────────────────────────
  { name: "Grabb and Smith's Plastic Surgery 7th Ed", desc: "The most widely used plastic surgery textbook, covering reconstructive and aesthetic surgery of the head, neck, trunk, extremities, and hand.", price: "9999", orig: "13999", cat: "Surgical", slug: "surgical", brand: "Wolters Kluwer", rating: "4.8", reviews: 254, tags: ["Grabb Smith","plastic surgery","textbook","MCh"], featured: true },
  { name: "Mathes & Nahai Flap Reconstruction 2nd Ed", desc: "The definitive reference on muscle and musculocutaneous flaps in reconstructive surgery. Comprehensive atlas with detailed surgical technique illustrations.", price: "14999", orig: "19999", cat: "Surgical", slug: "surgical", brand: "Elsevier", rating: "4.8", reviews: 176, tags: ["Mathes Nahai","flap","plastic surgery","reconstruction"], featured: false },
  { name: "Principles of Plastic Surgery McCarthy 2nd Ed", desc: "A comprehensive plastic surgery reference covering general principles, reconstructive surgery, aesthetic surgery, craniofacial surgery and hand surgery.", price: "12999", orig: "17999", cat: "Surgical", slug: "surgical", brand: "Saunders", rating: "4.7", reviews: 143, tags: ["McCarthy","plastic surgery","principles"], featured: false },

  // ── MCh Urology ─────────────────────────────────────────────────
  { name: "Campbell-Walsh-Wein Urology 12th Ed", desc: "The definitive urology textbook — a comprehensive multi-volume reference covering all aspects of urological disease, surgical technique and perioperative care.", price: "19999", orig: "26999", cat: "Urology", slug: "urology", brand: "Elsevier", rating: "4.9", reviews: 543, tags: ["Campbell Walsh","urology","MCh","textbook"], featured: true },
  { name: "Hinman's Atlas of Urologic Surgery 4th Ed", desc: "The atlas of urological surgical techniques, with detailed step-by-step illustrations of all major urological operations.", price: "9999", orig: "13999", cat: "Urology", slug: "urology", brand: "Elsevier", rating: "4.8", reviews: 321, tags: ["Hinman","urologic surgery","atlas"], featured: false },
  { name: "Smith & Tanagho General Urology 18th Ed", desc: "A classic comprehensive urology textbook for residents and practising urologists covering anatomy, investigations, pathology and surgical treatment.", price: "5999", orig: "7999", cat: "Urology", slug: "urology", brand: "McGraw-Hill", rating: "4.7", reviews: 432, tags: ["Smith Tanagho","urology","general"], featured: false },

  // ── MCh Paediatric Surgery ─────────────────────────────────────
  { name: "Ashcraft's Pediatric Surgery 6th Ed", desc: "The most comprehensive paediatric surgery textbook, covering all paediatric surgical conditions from neonatal surgery to adolescent oncology.", price: "9999", orig: "13999", cat: "Paediatric", slug: "paediatric", brand: "Elsevier", rating: "4.9", reviews: 298, tags: ["Ashcraft","pediatric surgery","MCh","textbook"], featured: true },
  { name: "O'Neill's Pediatric Surgery 6th Ed", desc: "A definitive multi-volume reference in paediatric surgery covering all operative techniques and perioperative management for the paediatric surgeon.", price: "12999", orig: "17999", cat: "Paediatric", slug: "paediatric", brand: "Elsevier", rating: "4.9", reviews: 187, tags: ["O'Neill","pediatric surgery"], featured: false },
  { name: "Spitz & Coran Operative Pediatric Surgery 7th Ed", desc: "An atlas of operative techniques in paediatric surgery. Step-by-step illustrations of all major paediatric surgical procedures.", price: "9999", orig: "13999", cat: "Paediatric", slug: "paediatric", brand: "Taylor & Francis", rating: "4.8", reviews: 211, tags: ["Spitz Coran","pediatric surgery","operative"], featured: false },

  // ── DM Haematology ──────────────────────────────────────────────
  { name: "Williams Hematology 10th Ed", desc: "The most comprehensive haematology textbook, covering disorders of blood cells, coagulation, and lymphoid tissues with pathophysiology, diagnosis and treatment.", price: "9999", orig: "13499", cat: "Books & Study Material", slug: "books", brand: "McGraw-Hill", rating: "4.9", reviews: 432, tags: ["Williams","hematology","DM","textbook"], featured: true },
  { name: "Hoffbrand & Steensma Essential Haematology 8th Ed", desc: "The bestselling haematology textbook for medical students and trainees. Clear, systematic coverage of all blood disorders with excellent diagrams.", price: "4999", orig: "6499", cat: "Books & Study Material", slug: "books", brand: "Wiley-Blackwell", rating: "4.8", reviews: 765, tags: ["Hoffbrand","haematology","MBBS","postgraduate"], featured: false },
  { name: "Lee's Synopsis of Haematology 3rd Ed", desc: "A concise haematology synopsis for postgraduates and specialists covering clinical haematology, blood transfusion, and haematological malignancies.", price: "3999", orig: "5299", cat: "Books & Study Material", slug: "books", brand: "Oxford University Press", rating: "4.7", reviews: 321, tags: ["Lee's","haematology","synopsis"], featured: false },
  { name: "Wintrobe's Clinical Hematology 14th Ed", desc: "A comprehensive two-volume clinical haematology textbook covering diseases of blood and blood-forming organs with detailed haematological investigations.", price: "9999", orig: "13499", cat: "Books & Study Material", slug: "books", brand: "Wolters Kluwer", rating: "4.8", reviews: 298, tags: ["Wintrobe","hematology","clinical"], featured: false },

  // ── DM Rheumatology ─────────────────────────────────────────────
  { name: "Firestein Budd Kelley's Textbook of Rheumatology 11th Ed", desc: "The definitive rheumatology textbook, covering pathophysiology, clinical features, diagnosis and management of all rheumatic diseases.", price: "9999", orig: "13999", cat: "Books & Study Material", slug: "books", brand: "Elsevier", rating: "4.9", reviews: 298, tags: ["Firestein Kelley","rheumatology","DM","textbook"], featured: true },
  { name: "Hochberg's Rheumatology 8th Ed", desc: "A comprehensive two-volume rheumatology reference covering basic science, diagnostic approaches, and clinical management of rheumatic diseases.", price: "8999", orig: "11999", cat: "Books & Study Material", slug: "books", brand: "Elsevier", rating: "4.8", reviews: 234, tags: ["Hochberg","rheumatology"], featured: false },
  { name: "Oxford Textbook of Rheumatology 5th Ed", author: "Watts, Conaghan, Doherty", desc: "A comprehensive rheumatology reference covering basic science, inflammatory arthritis, connective tissue diseases and other rheumatic conditions.", price: "6999", orig: "9499", cat: "Books & Study Material", slug: "books", brand: "Oxford University Press", rating: "4.7", reviews: 187, tags: ["Oxford","rheumatology"], featured: false } as any,

  // ── DM Nephrology extra ─────────────────────────────────────────
  { name: "Brenner & Rector's The Kidney 11th Ed", desc: "The most authoritative nephrology textbook covering renal physiology, glomerulonephritis, nephrotic syndrome, AKI, CKD, dialysis, and transplantation.", price: "12999", orig: "17999", cat: "Books & Study Material", slug: "books", brand: "Elsevier", rating: "4.9", reviews: 432, tags: ["Brenner Rector","kidney","nephrology","DM","textbook"], featured: true },
  { name: "Schrier's Diseases of Kidney & Urinary Tract 9th Ed", desc: "A comprehensive nephrology textbook covering all kidney diseases, electrolyte disorders, and urinary tract pathology with evidence-based management.", price: "9999", orig: "13499", cat: "Books & Study Material", slug: "books", brand: "Wolters Kluwer", rating: "4.8", reviews: 287, tags: ["Schrier","kidney disease","nephrology"], featured: false },

  // ── DM Endocrinology extra ─────────────────────────────────────
  { name: "Jameson & DeGroot Endocrinology: Adult & Pediatric 7th Ed", desc: "The most comprehensive endocrinology reference, covering all aspects of endocrine disease in adults and children including rare disorders.", price: "12999", orig: "17999", cat: "Endocrinology", slug: "endocrinology", brand: "Elsevier", rating: "4.9", reviews: 198, tags: ["Jameson DeGroot","endocrinology","DM","textbook"], featured: true },

  // ── Haematology extra ─────────────────────────────────────────
  { name: "Dacie & Lewis Practical Haematology 12th Ed", desc: "The standard laboratory haematology manual covering all practical techniques for analysis of blood disorders, coagulation and bone marrow.", price: "5999", orig: "7999", cat: "Books & Study Material", slug: "books", brand: "Elsevier", rating: "4.8", reviews: 345, tags: ["Dacie Lewis","haematology","practical","laboratory"], featured: false },

  // ── MCh Surgical Oncology ────────────────────────────────────
  { name: "Bland & Copeland The Breast 5th Ed", desc: "The definitive surgical reference for breast diseases covering anatomy, diagnosis, and comprehensive surgical management of benign and malignant breast conditions.", price: "9999", orig: "13499", cat: "Oncology", slug: "oncology", brand: "Elsevier", rating: "4.8", reviews: 187, tags: ["Bland Copeland","breast surgery","oncology","MCh"], featured: false },
  { name: "AJCC Cancer Staging Manual 9th Ed", desc: "The authoritative cancer staging manual used worldwide for classifying cancer extent. Essential for oncologists, surgeons, and pathologists in tumour board discussions.", price: "4999", orig: "6499", cat: "Oncology", slug: "oncology", brand: "Springer", rating: "4.9", reviews: 765, tags: ["AJCC","cancer staging","oncology"], featured: true },
  { name: "Holland-Frei Cancer Medicine 9th Ed", desc: "A comprehensive oncology reference covering cancer biology, clinical oncology, haematological malignancies and supportive care.", price: "9999", orig: "13499", cat: "Oncology", slug: "oncology", brand: "Wiley-Blackwell", rating: "4.8", reviews: 287, tags: ["Holland Frei","cancer medicine","oncology"], featured: false },

  // ── Maingot & Mastery ─────────────────────────────────────────
  { name: "Maingot's Abdominal Operations 12th Ed", desc: "A classic text on abdominal surgery covering all operative approaches to gastrointestinal, hepato-biliary, and splenic diseases.", price: "8999", orig: "11999", cat: "Surgical", slug: "surgical", brand: "McGraw-Hill", rating: "4.8", reviews: 298, tags: ["Maingot","abdominal surgery","textbook","MS"], featured: false },
  { name: "Mastery of Surgery 7th Ed", desc: "Comprehensive surgical atlas and text covering all aspects of general surgery — expert guidance on operative technique, complications, and clinical decision-making.", price: "9999", orig: "13499", cat: "Surgical", slug: "surgical", brand: "Wolters Kluwer", rating: "4.8", reviews: 214, tags: ["Mastery","surgery","operative","MS"], featured: false },
  { name: "Zinner's Maingot's Abdominal Operations 12th Ed", desc: "The essential abdominal surgery reference for postgraduate trainees and practicing surgeons covering all major GI operations with step-by-step illustrations.", price: "8999", orig: "11999", cat: "Surgical", slug: "surgical", brand: "McGraw-Hill", rating: "4.8", reviews: 198, tags: ["Zinner","abdominal operations","surgery"], featured: false },

  // ── DNB / CET Prep ────────────────────────────────────────────
  { name: "DNB Theory Question Bank Medicine 5th Ed", desc: "Comprehensive theory question bank for DNB CET preparation covering all medicine questions asked from 2005 to 2023 with detailed model answers.", price: "1999", orig: "2499", cat: "Books & Study Material", slug: "books", brand: "Paras Medical Publisher", rating: "4.7", reviews: 1234, tags: ["DNB","question bank","medicine","CET"], featured: true },
  { name: "DNB Theory Question Bank Surgery 4th Ed", desc: "Theory question bank for DNB CET with previous year surgery questions, model answers, and latest exam pattern analysis.", price: "1999", orig: "2499", cat: "Books & Study Material", slug: "books", brand: "Paras Medical Publisher", rating: "4.6", reviews: 987, tags: ["DNB","question bank","surgery","CET"], featured: false },
  { name: "Review for DNB CET Examination by Somen Das", desc: "A comprehensive review guide for DNB CET covering all major subjects with high-yield points, important questions and exam strategy.", price: "2499", orig: "3199", cat: "Books & Study Material", slug: "books", brand: "Paras Medical Publisher", rating: "4.7", reviews: 876, tags: ["DNB","CET","review","Somen Das"], featured: false },
  { name: "Across DNB Entrance MCQ Guide 3rd Ed", desc: "Across MCQ guide for DNB CET entrance examination with subject-wise MCQs, previous year questions, and detailed explanations.", price: "1799", orig: "2299", cat: "Books & Study Material", slug: "books", brand: "Jaypee Brothers", rating: "4.6", reviews: 765, tags: ["Across DNB","MCQ","entrance"], featured: false },

  // ── Additional NEET-PG ────────────────────────────────────────
  { name: "NEET-PG Previous Year Questions 2023-2018 5th Ed", desc: "Previous 5 years NEET-PG solved question papers with detailed explanations, topic-wise segregation, and high-yield points for each subject.", price: "1999", orig: "2499", cat: "Books & Study Material", slug: "books", brand: "Jaypee Brothers", rating: "4.8", reviews: 2345, tags: ["NEET-PG","previous year","MCQ","PG entrance"], featured: true },
  { name: "Marrow QBank NEET-PG Notes (Complete Set) 2024 Ed", desc: "The most popular NEET-PG notes series with high-yield points, rapid revision tables and image-based questions for all 19 subjects.", price: "3999", orig: "5499", cat: "Books & Study Material", slug: "books", brand: "Marrow", rating: "4.9", reviews: 3456, tags: ["Marrow","NEET-PG","notes","QBank"], featured: true },

  // ── API Textbook of Medicine ──────────────────────────────────
  { name: "API Textbook of Medicine 11th Ed", desc: "The authoritative Indian medicine textbook published by the Association of Physicians of India covering all aspects of clinical medicine relevant to Indian practice.", price: "5999", orig: "7999", cat: "Books & Study Material", slug: "books", brand: "Jaypee Brothers", rating: "4.8", reviews: 1876, tags: ["API","medicine","India","textbook"], featured: true },

  // ── Talley & O'Connor ─────────────────────────────────────────
  { name: "Talley & O'Connor Clinical Examination 8th Ed", desc: "The most popular clinical examination textbook in the Asia-Pacific region. Systems-based approach with clinical photos, examination techniques, and clinical correlations.", price: "4999", orig: "6699", cat: "Books & Study Material", slug: "books", brand: "Elsevier", rating: "4.8", reviews: 1345, tags: ["Talley O'Connor","clinical examination","MBBS"], featured: false },

  // ── Additional Radiology ──────────────────────────────────────
  { name: "Dahnert's Radiology Review Manual 8th Ed", desc: "The comprehensive radiology review manual covering all modalities and systems. Over 15,000 differential diagnoses organized systematically for radiology boards.", price: "5999", orig: "7999", cat: "Radiology", slug: "radiology", brand: "Wolters Kluwer", rating: "4.8", reviews: 567, tags: ["Dahnert","radiology review","manual"], featured: false },
  { name: "Diagnostic Ultrasound by Rumack Wilson 5th Ed", desc: "The definitive ultrasound textbook covering abdominal, obstetric, gynaecologic, and vascular ultrasound with comprehensive guidance on technique and interpretation.", price: "8999", orig: "11999", cat: "Radiology", slug: "radiology", brand: "Elsevier", rating: "4.8", reviews: 432, tags: ["Rumack","ultrasound","radiology"], featured: false },
  { name: "MRI in Clinical Practice 3rd Ed", desc: "Practical guide to MRI covering physics, technique, and clinical interpretation across all body systems. Ideal for radiology trainees and radiologists.", price: "5999", orig: "7999", cat: "Radiology", slug: "radiology", brand: "Springer", rating: "4.7", reviews: 298, tags: ["MRI","radiology","clinical practice"], featured: false },
  { name: "CT Teaching Manual 4th Ed", desc: "A systematic guide to CT interpretation covering normal anatomy, technique and pathological findings across all organ systems.", price: "4999", orig: "6499", cat: "Radiology", slug: "radiology", brand: "Thieme", rating: "4.7", reviews: 345, tags: ["CT","teaching manual","radiology"], featured: false },

  // ── Additional Anaesthesia ────────────────────────────────────
  { name: "Nunn's Applied Respiratory Physiology 8th Ed", desc: "The definitive respiratory physiology text for anaesthetists and intensivists. Covers ventilatory mechanics, gas exchange, and respiratory physiology in disease.", price: "6999", orig: "9299", cat: "Anaesthesia", slug: "anaesthesia", brand: "Elsevier", rating: "4.8", reviews: 298, tags: ["Nunn","respiratory physiology","anaesthesia","MD"], featured: false },
  { name: "Yao & Artusio's Anesthesiology 9th Ed", desc: "A case-based anesthesiology review covering the spectrum of anaesthetic challenges across subspecialties with management strategies and pathophysiology.", price: "5999", orig: "7999", cat: "Anaesthesia", slug: "anaesthesia", brand: "Wolters Kluwer", rating: "4.7", reviews: 234, tags: ["Yao Artusio","anaesthesia","case-based"], featured: false },

  // ── Additional Cardiology (DM) ─────────────────────────────
  { name: "ESC Textbook of Cardiovascular Medicine 3rd Ed", desc: "The comprehensive European cardiology textbook covering all aspects of cardiovascular medicine with evidence-based management guidelines.", price: "8999", orig: "11999", cat: "Cardiac Care", slug: "cardiac-care", brand: "Oxford University Press", rating: "4.8", reviews: 298, tags: ["ESC","cardiovascular medicine","cardiology"], featured: false },
  { name: "Clinical Cardiac Pacing Defibrillation & Resynchronization 4th Ed", desc: "The definitive reference for cardiac electrophysiology and device therapy covering all aspects of pacing, ICD and CRT in clinical practice.", price: "7999", orig: "10499", cat: "Cardiac Care", slug: "cardiac-care", brand: "Elsevier", rating: "4.8", reviews: 198, tags: ["Ellenbogen","pacing","defibrillation","cardiac devices"], featured: false },

  // ── Additional Orthopaedics (MS) ──────────────────────────
  { name: "AO Manual of Fracture Management 2nd Ed", desc: "The comprehensive AO Foundation guide to fracture management covering classification, fixation principles, implant choice, and rehabilitation.", price: "7999", orig: "10499", cat: "Orthopaedic", slug: "orthopaedic", brand: "Thieme", rating: "4.9", reviews: 432, tags: ["AO Manual","fracture","orthopaedics","MS"], featured: true },
  { name: "Rockwood & Green's Fractures in Adults 9th Ed", desc: "The most comprehensive fracture surgery reference covering all adult skeletal injuries with expert guidance on surgical technique and management.", price: "9999", orig: "13999", cat: "Orthopaedic", slug: "orthopaedic", brand: "Wolters Kluwer", rating: "4.9", reviews: 365, tags: ["Rockwood Green","fractures","orthopaedics"], featured: false },

  // ── Additional Psychiatry (MD) ────────────────────────────
  { name: "Kaplan & Sadock's Comprehensive Textbook of Psychiatry 11th Ed", desc: "The most comprehensive psychiatry textbook covering biological psychiatry, clinical syndromes, treatments, special populations, and psychiatric ethics.", price: "14999", orig: "19999", cat: "Psychiatry", slug: "psychiatry", brand: "Wolters Kluwer", rating: "4.9", reviews: 432, tags: ["Kaplan Sadock","comprehensive psychiatry","MD"], featured: true },

  // ── Additional ENT (MS) ───────────────────────────────────
  { name: "Flint Cummings Essential Otolaryngology 12th Ed", desc: "A concise single-volume otolaryngology reference for residents and practitioners covering otology, rhinology, head and neck surgery.", price: "6999", orig: "9499", cat: "ENT", slug: "ent", brand: "McGraw-Hill", rating: "4.7", reviews: 298, tags: ["Flint","essential otolaryngology","ENT","MS"], featured: false },

  // ── Comprehensive Gynecology (MS) ─────────────────────────
  { name: "Comprehensive Gynecology 8th Ed", desc: "A single-volume comprehensive gynaecology textbook for postgraduates covering reproductive medicine, gynaecological oncology, urogynaecology, and menstrual disorders.", price: "7499", orig: "9999", cat: "Gynaecology", slug: "gynaecology", brand: "Elsevier", rating: "4.8", reviews: 298, tags: ["Comprehensive Gynecology","MS","gynaecology"], featured: false },

  // ── Ferri's Clinical Advisor ──────────────────────────────
  { name: "Ferri's Clinical Advisor 2025", desc: "The rapid-reference clinical guide covering 1000+ medical conditions with instant access to diagnosis, treatment algorithms, drug dosages and ICD-10 codes.", price: "5999", orig: "7999", cat: "Books & Study Material", slug: "books", brand: "Elsevier", rating: "4.8", reviews: 876, tags: ["Ferri","clinical advisor","medicine","quick reference"], featured: false },

  // ── Oxford Textbook of Medicine ────────────────────────────
  { name: "Oxford Textbook of Medicine 6th Ed (3-Vol)", author: "Warrell, Cox, Firth", desc: "The most authoritative English-language medicine textbook covering all aspects of clinical medicine across three volumes with evidence-based guidance.", price: "19999", orig: "24999", cat: "Books & Study Material", slug: "books", brand: "Oxford University Press", rating: "4.9", reviews: 432, tags: ["Oxford Textbook","medicine","MD"], featured: false } as any,

  // ── Musculoskeletal extra ──────────────────────────────────
  { name: "Watson-Jones Fractures & Joint Injuries 8th Ed", desc: "A classic fracture management textbook covering all aspects of skeletal trauma diagnosis, conservative management, and operative fixation.", price: "8999", orig: "11999", cat: "Orthopaedic", slug: "orthopaedic", brand: "Elsevier", rating: "4.8", reviews: 298, tags: ["Watson-Jones","fractures","joint injuries","orthopaedics"], featured: false },
];

async function exists(name: string): Promise<boolean> {
  const res = await db.select().from(productsTable)
    .where(ilike(productsTable.name, `%${name.slice(0, 30)}%`))
    .limit(1);
  return res.length > 0;
}

async function run() {
  console.log("Seeding curriculum books…");
  let added = 0, skipped = 0;

  for (let i = 0; i < BOOKS.length; i++) {
    const b = BOOKS[i];
    if (await exists(b.name)) { skipped++; continue; }
    await db.insert(productsTable).values({
      name: b.name,
      description: b.desc,
      price: b.price,
      originalPrice: b.orig,
      category: b.cat,
      categorySlug: b.slug,
      brand: b.brand,
      imageUrl: img(i),
      rating: b.rating,
      reviewCount: b.reviews,
      inStock: true,
      featured: b.featured,
      tags: b.tags,
    } as any);
    console.log(`  + ${b.name.slice(0, 60)}`);
    added++;
  }

  // Update category counts
  const cats = await db.select({ slug: categoriesTable.slug }).from(categoriesTable);
  for (const cat of cats) {
    const res = await db.select({ cnt: sql<number>`count(*)` }).from(productsTable).where(eq(productsTable.categorySlug, cat.slug));
    const cnt = Number(res[0]?.cnt ?? 0);
    if (cnt > 0) await db.update(categoriesTable).set({ productCount: cnt } as any).where(eq(categoriesTable.slug, cat.slug));
  }

  console.log(`\nDone — Added: ${added} | Skipped (already exist): ${skipped}`);
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });

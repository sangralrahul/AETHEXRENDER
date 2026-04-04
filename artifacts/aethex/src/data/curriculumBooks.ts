// Comprehensive Indian Medical Curriculum Book Catalog
// Organized by: Degree → Year → Subject → Books

export interface CurrBook {
  name: string;
  author: string;
  publisher: string;
  price: number;    // INR
  mrp: number;      // INR
  edition: string;
  featured?: boolean;
  forExam?: string[]; // e.g. ["NEET-PG","USMLE"]
  matchTags: string[]; // used to find product in DB by name match
}

export interface SubjectGroup {
  id: string;
  name: string;
  color: string;
  books: CurrBook[];
}

export interface CurriculumYear {
  id: string;
  label: string;
  subjects: SubjectGroup[];
}

export interface Degree {
  id: string;
  label: string;
  shortLabel: string;
  color: string;
  isPG?: boolean; // true for MD/MS/MCh/DM → years = specialties, subjects = Year 1/2/3
  years: CurriculumYear[];
}

export const CURRICULUM: Degree[] = [
  // ────────────────────────────── MBBS ──────────────────────────────
  {
    id: "mbbs",
    label: "MBBS",
    shortLabel: "MBBS",
    color: "#007AFF",
    years: [
      {
        id: "mbbs-y1",
        label: "Year 1",
        subjects: [
          {
            id: "anatomy",
            name: "Anatomy",
            color: "#FF6B35",
            books: [
              { name: "BD Chaurasia Human Anatomy Vol 1-3 (Indian Ed)", author: "BD Chaurasia", publisher: "CBS Publishers", price: 1899, mrp: 2499, edition: "9th Ed", featured: true, matchTags: ["BD Chaurasia","anatomy"] },
              { name: "Gray's Anatomy 42nd Edition", author: "Susan Standring", publisher: "Elsevier", price: 7499, mrp: 9999, edition: "42nd Ed", featured: true, matchTags: ["Gray's Anatomy","anatomy"] },
              { name: "Snell's Clinical Anatomy by Regions 10th Ed", author: "Richard Snell", publisher: "Wolters Kluwer", price: 5499, mrp: 7499, edition: "10th Ed", matchTags: ["Snell","anatomy"] },
              { name: "Last's Anatomy 9th Edition", author: "Chummy Sinnatamby", publisher: "Elsevier", price: 3999, mrp: 5499, edition: "9th Ed", matchTags: ["Last's anatomy"] },
              { name: "Netter's Atlas of Human Anatomy 8th Ed", author: "Frank H. Netter", publisher: "Elsevier", price: 6999, mrp: 9499, edition: "8th Ed", featured: true, matchTags: ["Netter","anatomy atlas"] },
              { name: "Moore's Clinically Oriented Anatomy 8th Ed", author: "KL Moore, AF Dalley", publisher: "Wolters Kluwer", price: 5999, mrp: 7999, edition: "8th Ed", matchTags: ["Moore","anatomy"] },
              { name: "Inderbir Singh's Human Embryology 11th Ed", author: "Inderbir Singh", publisher: "CBS Publishers", price: 799, mrp: 1099, edition: "11th Ed", matchTags: ["embryology","Inderbir Singh"] },
              { name: "Langman's Medical Embryology 15th Ed", author: "TW Sadler", publisher: "Wolters Kluwer", price: 3499, mrp: 4999, edition: "15th Ed", matchTags: ["Langman","embryology"] },
              { name: "Vishram Singh Textbook of Anatomy Upper Limb & Thorax", author: "Vishram Singh", publisher: "Elsevier", price: 999, mrp: 1299, edition: "3rd Ed", matchTags: ["Vishram Singh","anatomy"] },
              { name: "Datta's Essentials of Human Anatomy 5th Ed", author: "AK Datta", publisher: "Current Books International", price: 699, mrp: 899, edition: "5th Ed", matchTags: ["Datta","anatomy","India"] },
            ],
          },
          {
            id: "physiology",
            name: "Physiology",
            color: "#34C759",
            books: [
              { name: "Guyton & Hall Medical Physiology 14th Ed", author: "John E Hall", publisher: "Elsevier", price: 4999, mrp: 6499, edition: "14th Ed", featured: true, matchTags: ["Guyton Hall","physiology"] },
              { name: "AK Jain Textbook of Physiology 8th Ed (2-Vol)", author: "AK Jain", publisher: "Avichal Publishing", price: 1299, mrp: 1599, edition: "8th Ed", featured: true, matchTags: ["AK Jain","physiology"] },
              { name: "Ganong's Review of Medical Physiology 26th Ed", author: "Kim Barrett, Scott Barman", publisher: "McGraw-Hill", price: 4299, mrp: 5799, edition: "26th Ed", matchTags: ["Ganong","physiology"] },
              { name: "Linda Costanzo Physiology 7th Ed", author: "Linda Costanzo", publisher: "Elsevier", price: 3499, mrp: 4799, edition: "7th Ed", matchTags: ["Costanzo","physiology"] },
              { name: "BRS Physiology 8th Ed (Board Review Series)", author: "Linda Costanzo", publisher: "Wolters Kluwer", price: 2999, mrp: 3999, edition: "8th Ed", forExam: ["USMLE","NEET-PG"], matchTags: ["BRS physiology","board review"] },
              { name: "Sembulingam Essentials of Medical Physiology 8th Ed", author: "K Sembulingam", publisher: "Jaypee Brothers", price: 1299, mrp: 1699, edition: "8th Ed", matchTags: ["Sembulingam","physiology"] },
              { name: "Vander's Human Physiology 15th Ed", author: "Eric Widmaier", publisher: "McGraw-Hill", price: 4999, mrp: 6499, edition: "15th Ed", matchTags: ["Vander","physiology"] },
              { name: "Satyanarayana Physiology Review for NEET-PG", author: "UB Satyanarayana", publisher: "Elsevier India", price: 899, mrp: 1199, edition: "5th Ed", forExam: ["NEET-PG"], matchTags: ["physiology","NEET-PG"] },
            ],
          },
          {
            id: "biochemistry",
            name: "Biochemistry",
            color: "#5856D6",
            books: [
              { name: "Harper's Illustrated Biochemistry 32nd Ed", author: "Victor Rodwell et al.", publisher: "McGraw-Hill", price: 5499, mrp: 7299, edition: "32nd Ed", featured: true, matchTags: ["Harper's","biochemistry"] },
              { name: "DM Vasudevan Textbook of Biochemistry 9th Ed", author: "DM Vasudevan", publisher: "Jaypee Brothers", price: 999, mrp: 1299, edition: "9th Ed", featured: true, matchTags: ["Vasudevan","biochemistry"] },
              { name: "Lippincott's Illustrated Reviews: Biochemistry 8th Ed", author: "Lieberman & Peet", publisher: "Wolters Kluwer", price: 3999, mrp: 5499, edition: "8th Ed", forExam: ["USMLE"], matchTags: ["Lippincott","biochemistry"] },
              { name: "Satyanarayan Biochemistry 5th Ed", author: "U Satyanarayana", publisher: "Books and Allied", price: 899, mrp: 1199, edition: "5th Ed", matchTags: ["Satyanarayan","biochemistry"] },
              { name: "Murray's Biochemistry 30th Ed", author: "Robert Murray et al.", publisher: "McGraw-Hill", price: 3999, mrp: 5299, edition: "30th Ed", matchTags: ["Murray","biochemistry"] },
              { name: "Devlin's Textbook of Biochemistry 8th Ed", author: "TM Devlin", publisher: "Wiley", price: 5999, mrp: 7999, edition: "8th Ed", matchTags: ["Devlin","biochemistry"] },
              { name: "MN Chatterjea Textbook of Medical Biochemistry 9th Ed", author: "MN Chatterjea", publisher: "Jaypee Brothers", price: 799, mrp: 999, edition: "9th Ed", matchTags: ["Chatterjea","biochemistry","India"] },
            ],
          },
        ],
      },
      {
        id: "mbbs-y2",
        label: "Year 2",
        subjects: [
          {
            id: "pathology",
            name: "Pathology",
            color: "#FF3B30",
            books: [
              { name: "Robbins & Cotran Pathologic Basis of Disease 10th Ed", author: "Kumar, Abbas, Aster", publisher: "Elsevier", price: 7499, mrp: 9999, edition: "10th Ed", featured: true, matchTags: ["Robbins","pathology"] },
              { name: "Robbins Basic Pathology 10th Ed", author: "Kumar, Abbas, Aster", publisher: "Elsevier", price: 4499, mrp: 5999, edition: "10th Ed", featured: true, matchTags: ["Robbins Basic","pathology"] },
              { name: "Harsh Mohan Textbook of Pathology 8th Ed", author: "Harsh Mohan", publisher: "Jaypee Brothers", price: 1099, mrp: 1499, edition: "8th Ed", featured: true, matchTags: ["Harsh Mohan","pathology"] },
              { name: "Goljan Rapid Review Pathology 5th Ed", author: "Edward Goljan", publisher: "Elsevier", price: 3499, mrp: 4799, edition: "5th Ed", forExam: ["USMLE"], matchTags: ["Goljan","pathology"] },
              { name: "Muir's Textbook of Pathology 15th Ed", author: "Leong & Leong", publisher: "CRC Press", price: 5499, mrp: 7499, edition: "15th Ed", matchTags: ["Muir","pathology"] },
              { name: "Bancroft's Theory & Practice of Histological Techniques 8th Ed", author: "Suvarna, Layton & Bancroft", publisher: "Elsevier", price: 7999, mrp: 10999, edition: "8th Ed", matchTags: ["Bancroft","histology","pathology"] },
              { name: "Sternberg's Diagnostic Surgical Pathology 7th Ed", author: "Mills et al.", publisher: "Wolters Kluwer", price: 12999, mrp: 17999, edition: "7th Ed", matchTags: ["Sternberg","pathology"] },
              { name: "BRS Pathology 6th Ed (Board Review Series)", author: "Schneider et al.", publisher: "Wolters Kluwer", price: 2499, mrp: 3499, edition: "6th Ed", forExam: ["USMLE"], matchTags: ["BRS pathology"] },
            ],
          },
          {
            id: "pharmacology",
            name: "Pharmacology",
            color: "#FF9500",
            books: [
              { name: "KD Tripathi Essentials of Medical Pharmacology 9th Ed", author: "KD Tripathi", publisher: "Jaypee Brothers", price: 999, mrp: 1299, edition: "9th Ed", featured: true, matchTags: ["Tripathi","pharmacology"] },
              { name: "Goodman & Gilman's Pharmacological Basis of Therapeutics 14th Ed", author: "Brunton, Knollmann", publisher: "McGraw-Hill", price: 9499, mrp: 12999, edition: "14th Ed", matchTags: ["Goodman Gilman","pharmacology"] },
              { name: "Lippincott's Illustrated Reviews: Pharmacology 8th Ed", author: "Karen Whalen", publisher: "Wolters Kluwer", price: 3499, mrp: 4799, edition: "8th Ed", forExam: ["USMLE"], matchTags: ["Lippincott","pharmacology"] },
              { name: "Katzung Basic & Clinical Pharmacology 16th Ed", author: "Bertram Katzung", publisher: "McGraw-Hill", price: 5999, mrp: 7999, edition: "16th Ed", matchTags: ["Katzung","pharmacology"] },
              { name: "Satoskar Pharmacology & Pharmacotherapeutics 25th Ed", author: "Satoskar, Bhandarkar", publisher: "Popular Prakashan", price: 1199, mrp: 1599, edition: "25th Ed", matchTags: ["Satoskar","pharmacology"] },
              { name: "Rang & Dale's Pharmacology 9th Ed", author: "Rang, Ritter, Flower", publisher: "Elsevier", price: 4999, mrp: 6499, edition: "9th Ed", matchTags: ["Rang Dale","pharmacology"] },
              { name: "BRS Pharmacology 7th Ed (Board Review Series)", author: "Gary Rosenfeld", publisher: "Wolters Kluwer", price: 2299, mrp: 2999, edition: "7th Ed", forExam: ["USMLE"], matchTags: ["BRS pharmacology"] },
              { name: "Stahl's Essential Psychopharmacology 5th Ed", author: "Stephen M Stahl", publisher: "Cambridge University Press", price: 4999, mrp: 6999, edition: "5th Ed", matchTags: ["Stahl","psychopharmacology"] },
            ],
          },
          {
            id: "microbiology",
            name: "Microbiology",
            color: "#00C2A8",
            books: [
              { name: "Ananthanarayan & Paniker's Textbook of Microbiology 10th Ed", author: "R Ananthanarayan", publisher: "Universities Press", price: 1099, mrp: 1499, edition: "10th Ed", featured: true, matchTags: ["Ananthanarayan","microbiology"] },
              { name: "Jawetz Medical Microbiology 28th Ed", author: "Carroll, Morse, Mietzner", publisher: "McGraw-Hill", price: 4499, mrp: 5999, edition: "28th Ed", matchTags: ["Jawetz","microbiology"] },
              { name: "Murray's Medical Microbiology 9th Ed", author: "Patrick Murray et al.", publisher: "Elsevier", price: 4999, mrp: 6499, edition: "9th Ed", matchTags: ["Murray","microbiology"] },
              { name: "Greenwood Medical Microbiology 19th Ed", author: "Greenwood, Slack, Barer", publisher: "Elsevier", price: 4499, mrp: 5999, edition: "19th Ed", matchTags: ["Greenwood","microbiology"] },
              { name: "Mackie & McCartney Practical Medical Microbiology 14th Ed", author: "Collee, Fraser, Marmion", publisher: "Churchill Livingstone", price: 7999, mrp: 10999, edition: "14th Ed", matchTags: ["Mackie McCartney","microbiology"] },
              { name: "Mandell Douglas & Bennett's Infectious Diseases 9th Ed", author: "Bennett, Dolin, Blaser", publisher: "Elsevier", price: 14999, mrp: 19999, edition: "9th Ed", matchTags: ["Mandell","infectious diseases"] },
              { name: "Topley & Wilson's Microbiology & Microbial Infections", author: "Borriello, Murray, Funke", publisher: "Hodder Arnold", price: 19999, mrp: 24999, edition: "11th Ed", matchTags: ["Topley Wilson","microbiology"] },
            ],
          },
          {
            id: "forensic",
            name: "Forensic Medicine",
            color: "#636366",
            books: [
              { name: "Krishan Vij Textbook of Forensic Medicine & Toxicology 6th Ed", author: "Krishan Vij", publisher: "Reed Elsevier India", price: 1299, mrp: 1699, edition: "6th Ed", featured: true, matchTags: ["Krishan Vij","forensic"] },
              { name: "Parikh's Textbook of Medical Jurisprudence 7th Ed", author: "CK Parikh", publisher: "CBS Publishers", price: 1199, mrp: 1599, edition: "7th Ed", matchTags: ["Parikh","forensic","jurisprudence"] },
              { name: "Simpson's Forensic Medicine 14th Ed", author: "Jason Payne-James, Peter Jones", publisher: "CRC Press", price: 3999, mrp: 5499, edition: "14th Ed", matchTags: ["Simpson","forensic medicine"] },
              { name: "Modi's Medical Jurisprudence & Toxicology 25th Ed", author: "BV Subrahmanyam", publisher: "LexisNexis", price: 1499, mrp: 1999, edition: "25th Ed", matchTags: ["Modi","forensic","toxicology"] },
              { name: "Mukherjee Forensic Medicine & Toxicology 4th Ed", author: "NNS Mukherjee", publisher: "New Central Book Agency", price: 999, mrp: 1299, edition: "4th Ed", matchTags: ["Mukherjee","forensic"] },
              { name: "DC Mitra Principles of Forensic Medicine 4th Ed", author: "DC Mitra", publisher: "New Central", price: 899, mrp: 1199, edition: "4th Ed", matchTags: ["DC Mitra","forensic"] },
              { name: "Forensic Medicine for NEET-PG by Nagabhushana Rao", author: "Nagabhushana Rao", publisher: "Jaypee Brothers", price: 799, mrp: 999, edition: "3rd Ed", forExam: ["NEET-PG"], matchTags: ["forensic","NEET-PG"] },
            ],
          },
        ],
      },
      {
        id: "mbbs-y3",
        label: "Pre-Final (3rd Year)",
        subjects: [
          {
            id: "ent",
            name: "ENT",
            color: "#AF52DE",
            books: [
              { name: "Dhingra's Diseases of Ear Nose & Throat 7th Ed", author: "PL Dhingra", publisher: "Elsevier", price: 1099, mrp: 1399, edition: "7th Ed", featured: true, matchTags: ["Dhingra","ENT"] },
              { name: "Scott-Brown's Otorhinolaryngology 8th Ed", author: "Watkinson & Clarke", publisher: "Taylor & Francis", price: 12999, mrp: 17999, edition: "8th Ed", matchTags: ["Scott-Brown","ENT","otolaryngology"] },
              { name: "Hazarika's Textbook of ENT & Head Neck Surgery 3rd Ed", author: "Prabodh Hazarika", publisher: "CBS Publishers", price: 1299, mrp: 1699, edition: "3rd Ed", matchTags: ["Hazarika","ENT"] },
              { name: "Cummings Otolaryngology Head & Neck Surgery 7th Ed", author: "Flint, Haughey, Lund", publisher: "Elsevier", price: 15999, mrp: 21999, edition: "7th Ed", matchTags: ["Cummings","otolaryngology"] },
              { name: "Ballenger's Otorhinolaryngology 18th Ed", author: "James Snow Jr", publisher: "PMPH USA", price: 9999, mrp: 13999, edition: "18th Ed", matchTags: ["Ballenger","ENT"] },
              { name: "Logan Turner Diseases of Nose Throat & Ear 11th Ed", author: "ADB Logan Turner", publisher: "CRC Press", price: 3999, mrp: 5499, edition: "11th Ed", matchTags: ["Logan Turner","ENT"] },
            ],
          },
          {
            id: "ophthalmology",
            name: "Ophthalmology",
            color: "#32ADE6",
            books: [
              { name: "Parsons' Diseases of the Eye 23rd Ed", author: "Ramanjit Sihota", publisher: "Elsevier", price: 1199, mrp: 1599, edition: "23rd Ed", featured: true, matchTags: ["Parsons","ophthalmology"] },
              { name: "Kanski's Clinical Ophthalmology 9th Ed", author: "Brad Bowling", publisher: "Elsevier", price: 6499, mrp: 8999, edition: "9th Ed", featured: true, matchTags: ["Kanski","ophthalmology"] },
              { name: "Renu Jogi's Clinical Ophthalmology 3rd Ed", author: "Renu Jogi", publisher: "Jaypee Brothers", price: 1199, mrp: 1599, edition: "3rd Ed", matchTags: ["Renu Jogi","ophthalmology"] },
              { name: "Yanoff & Duker Ophthalmology 5th Ed", author: "Myron Yanoff & Jay Duker", publisher: "Elsevier", price: 8999, mrp: 11999, edition: "5th Ed", matchTags: ["Yanoff","ophthalmology"] },
              { name: "Duke-Elder's System of Ophthalmology Vol 1-15", author: "Sir Stewart Duke-Elder", publisher: "Henry Kimpton", price: 9999, mrp: 12999, edition: "15 Vol Set", matchTags: ["Duke-Elder","ophthalmology"] },
              { name: "American Academy of Ophthalmology BCSC Complete Set", author: "AAO", publisher: "AAO Publications", price: 19999, mrp: 27999, edition: "2024 Ed", matchTags: ["AAO","BCSC","ophthalmology"] },
            ],
          },
          {
            id: "community-medicine",
            name: "Community Medicine (PSM)",
            color: "#34C759",
            books: [
              { name: "Park's Textbook of Preventive & Social Medicine 26th Ed", author: "K Park", publisher: "M/s Banarsidas Bhanot", price: 1299, mrp: 1699, edition: "26th Ed", featured: true, matchTags: ["Park's","PSM","community medicine"] },
              { name: "KJ Ananthakrishnan's Community Medicine 3rd Ed", author: "KJ Ananthakrishnan", publisher: "CBS Publishers", price: 999, mrp: 1299, edition: "3rd Ed", matchTags: ["Ananthakrishnan","community medicine"] },
              { name: "Mahajan & Gupta's Textbook of PSM 5th Ed", author: "VK Mahajan", publisher: "Jaypee Brothers", price: 1099, mrp: 1399, edition: "5th Ed", matchTags: ["Mahajan Gupta","PSM"] },
              { name: "Maxcy-Rosenau-Last Public Health & Preventive Medicine 15th Ed", author: "Robert Wallace", publisher: "McGraw-Hill", price: 7999, mrp: 10999, edition: "15th Ed", matchTags: ["Maxcy Rosenau","public health"] },
              { name: "Epidemiology by Leon Gordis 6th Ed", author: "Leon Gordis", publisher: "Elsevier", price: 3999, mrp: 5499, edition: "6th Ed", matchTags: ["Gordis","epidemiology"] },
              { name: "DK Taneja Community Medicine 6th Ed", author: "DK Taneja", publisher: "Jaypee", price: 999, mrp: 1299, edition: "6th Ed", matchTags: ["Taneja","community medicine"] },
            ],
          },
          {
            id: "dermatology",
            name: "Dermatology",
            color: "#BF5AF2",
            books: [
              { name: "IADVL Textbook of Dermatology 4th Ed", author: "RG Valia", publisher: "Bhalani Publishing", price: 8999, mrp: 12999, edition: "4th Ed", featured: true, matchTags: ["IADVL","dermatology"] },
              { name: "Rook's Textbook of Dermatology (4-Vol Set) 9th Ed", author: "Griffiths, Barker, Bleiker", publisher: "Wiley-Blackwell", price: 24999, mrp: 34999, edition: "9th Ed", matchTags: ["Rook's","dermatology"] },
              { name: "Fitzpatrick's Dermatology in General Medicine 9th Ed", author: "Kang, Amagai, Bruckner", publisher: "McGraw-Hill", price: 14999, mrp: 19999, edition: "9th Ed", matchTags: ["Fitzpatrick","dermatology"] },
              { name: "Iyer & Tahiliani Skin Disease 3rd Ed", author: "S Iyer, G Tahiliani", publisher: "CBS Publishers", price: 1099, mrp: 1399, edition: "3rd Ed", matchTags: ["Iyer","dermatology","India"] },
              { name: "Bologna Schaffer & Cerroni Dermatology 5th Ed", author: "Brownell, Bordeaux, Bhutani", publisher: "Elsevier", price: 12999, mrp: 17999, edition: "5th Ed", matchTags: ["Bologna","dermatology"] },
            ],
          },
        ],
      },
      {
        id: "mbbs-final",
        label: "Final Year",
        subjects: [
          {
            id: "medicine-final",
            name: "General Medicine",
            color: "#007AFF",
            books: [
              { name: "Harrison's Principles of Internal Medicine 21st Ed (2-Vol Set)", author: "Loscalzo, Fauci, Kasper", publisher: "McGraw-Hill", price: 8999, mrp: 12999, edition: "21st Ed", featured: true, matchTags: ["Harrison","Internal Medicine"] },
              { name: "Davidson's Principles & Practice of Medicine 24th Ed", author: "Stuart Ralston et al.", publisher: "Elsevier", price: 2999, mrp: 3999, edition: "24th Ed", featured: true, matchTags: ["Davidson","Medicine"] },
              { name: "Kumar & Clark's Clinical Medicine 10th Ed", author: "Parveen Kumar, Michael Clark", publisher: "Elsevier", price: 3999, mrp: 5499, edition: "10th Ed", matchTags: ["Kumar Clark","Medicine"] },
              { name: "Hutchison's Clinical Methods 24th Ed", author: "Suvarna Suvarna", publisher: "Elsevier", price: 1499, mrp: 1999, edition: "24th Ed", matchTags: ["Hutchison","clinical methods"] },
              { name: "Cecil Essentials of Medicine 10th Ed", author: "Andreoli, Benjamin, Griggs", publisher: "Elsevier", price: 4499, mrp: 5999, edition: "10th Ed", matchTags: ["Cecil","medicine"] },
              { name: "Oxford Handbook of Clinical Medicine 10th Ed", author: "Murray Longmore", publisher: "Oxford University Press", price: 1999, mrp: 2699, edition: "10th Ed", featured: true, matchTags: ["Oxford handbook","clinical"] },
              { name: "API Textbook of Medicine 11th Ed", author: "Siddharth Shah", publisher: "Jaypee Brothers", price: 5999, mrp: 7999, edition: "11th Ed", matchTags: ["API","medicine","India"] },
              { name: "Conn's Current Therapy 2024", author: "Kellerman & Rakel", publisher: "Elsevier", price: 5999, mrp: 7999, edition: "2024 Ed", matchTags: ["Conn","current therapy"] },
            ],
          },
          {
            id: "surgery-final",
            name: "General Surgery",
            color: "#FF6B35",
            books: [
              { name: "Bailey & Love's Short Practice of Surgery 27th Ed", author: "Williams, O'Connell, McCaskie", publisher: "Taylor & Francis", price: 5499, mrp: 7499, edition: "27th Ed", featured: true, matchTags: ["Bailey Love","surgery"] },
              { name: "SRB's Manual of Surgery 5th Ed", author: "Sriram Bhat M", publisher: "Jaypee Brothers", price: 1799, mrp: 2399, edition: "5th Ed", featured: true, matchTags: ["SRB","surgery"] },
              { name: "Sabiston Textbook of Surgery 21st Ed", author: "Townsend, Beauchamp, Evers", publisher: "Elsevier", price: 9999, mrp: 13999, edition: "21st Ed", matchTags: ["Sabiston","surgery"] },
              { name: "Schwartz's Principles of Surgery 11th Ed", author: "Brunicardi, Andersen, Billiar", publisher: "McGraw-Hill", price: 8999, mrp: 11999, edition: "11th Ed", matchTags: ["Schwartz","surgery"] },
              { name: "Hamilton Bailey's Physical Signs 19th Ed", author: "John Lumley", publisher: "CRC Press", price: 3999, mrp: 5499, edition: "19th Ed", matchTags: ["Hamilton Bailey","physical signs"] },
              { name: "Das's Clinical Methods in Surgery 2nd Ed", author: "Somen Das", publisher: "Dr Somen Das", price: 1099, mrp: 1399, edition: "2nd Ed", matchTags: ["Das","surgery","India"] },
              { name: "Current Surgical Diagnosis & Treatment 15th Ed", author: "Doherty, Meng, Schnipper", publisher: "McGraw-Hill", price: 5999, mrp: 7999, edition: "15th Ed", matchTags: ["current surgical","diagnosis"] },
            ],
          },
          {
            id: "obgyn",
            name: "Obstetrics & Gynaecology",
            color: "#FF2D92",
            books: [
              { name: "DC Dutta's Textbook of Obstetrics 10th Ed", author: "Hiralal Konar", publisher: "Jaypee Brothers", price: 1299, mrp: 1699, edition: "10th Ed", featured: true, matchTags: ["DC Dutta","obstetrics"] },
              { name: "DC Dutta's Textbook of Gynaecology 8th Ed", author: "Hiralal Konar", publisher: "Jaypee Brothers", price: 1199, mrp: 1499, edition: "8th Ed", featured: true, matchTags: ["DC Dutta","gynaecology"] },
              { name: "Williams Obstetrics 26th Ed", author: "Cunningham, Leveno, Dashe", publisher: "McGraw-Hill", price: 8999, mrp: 11999, edition: "26th Ed", matchTags: ["Williams","obstetrics"] },
              { name: "Novak's Gynecology 16th Ed", author: "Berek & Novak", publisher: "Wolters Kluwer", price: 7999, mrp: 10999, edition: "16th Ed", matchTags: ["Novak","gynecology"] },
              { name: "Te Linde's Operative Gynecology 12th Ed", author: "Rock, Howard, Joanes", publisher: "Wolters Kluwer", price: 9999, mrp: 13999, edition: "12th Ed", matchTags: ["Te Linde","operative gynecology"] },
              { name: "Sheila Balakrishnan's Midwifery & Obstetrics 2nd Ed", author: "Sheila Balakrishnan", publisher: "CBS Publishers", price: 999, mrp: 1299, edition: "2nd Ed", matchTags: ["Sheila Balakrishnan","midwifery"] },
              { name: "Shaw's Textbook of Gynaecology 17th Ed", author: "VG Padubidri", publisher: "Elsevier India", price: 1499, mrp: 1899, edition: "17th Ed", matchTags: ["Shaw","gynaecology","India"] },
            ],
          },
          {
            id: "paediatrics",
            name: "Paediatrics",
            color: "#FF9500",
            books: [
              { name: "OP Ghai Essential Pediatrics 9th Ed", author: "VK Paul, A Bagga", publisher: "CBS Publishers", price: 1599, mrp: 2099, edition: "9th Ed", featured: true, matchTags: ["OP Ghai","pediatrics","India"] },
              { name: "Nelson's Textbook of Pediatrics 21st Ed", author: "Kliegman, Geme, Blum", publisher: "Elsevier", price: 12999, mrp: 17999, edition: "21st Ed", featured: true, matchTags: ["Nelson","pediatrics"] },
              { name: "IAP Textbook of Pediatrics 7th Ed", author: "AK Datta", publisher: "Jaypee Brothers", price: 3999, mrp: 5299, edition: "7th Ed", matchTags: ["IAP","pediatrics","India"] },
              { name: "Forfar & Arneil's Textbook of Pediatrics 7th Ed", author: "Campbell, McIntosh", publisher: "Churchill Livingstone", price: 6999, mrp: 9499, edition: "7th Ed", matchTags: ["Forfar Arneil","pediatrics"] },
              { name: "Zitelli Davis' Atlas of Pediatric Physical Diagnosis 8th Ed", author: "Basil Zitelli", publisher: "Elsevier", price: 7999, mrp: 10999, edition: "8th Ed", matchTags: ["Zitelli Davis","pediatrics atlas"] },
              { name: "Rudolph's Pediatrics 24th Ed", author: "Bristow et al.", publisher: "McGraw-Hill", price: 8999, mrp: 11999, edition: "24th Ed", matchTags: ["Rudolph","pediatrics"] },
            ],
          },
          {
            id: "ortho",
            name: "Orthopaedics",
            color: "#8E7355",
            books: [
              { name: "Maheshwari's Textbook of Orthopaedics 6th Ed", author: "J Maheshwari", publisher: "Jaypee Brothers", price: 1299, mrp: 1699, edition: "6th Ed", featured: true, matchTags: ["Maheshwari","orthopaedics"] },
              { name: "Apley & Solomon's Orthopaedics & Fractures 10th Ed", author: "Louis Solomon", publisher: "Taylor & Francis", price: 4999, mrp: 6999, edition: "10th Ed", matchTags: ["Apley Solomon","orthopaedics"] },
              { name: "Campbell's Operative Orthopaedics 14th Ed", author: "Azar, Beaty, Canale", publisher: "Elsevier", price: 14999, mrp: 19999, edition: "14th Ed", matchTags: ["Campbell","operative orthopaedics"] },
              { name: "Watson-Jones Fractures & Joint Injuries 8th Ed", author: "Bucholz, Heckman, Court-Brown", publisher: "Elsevier", price: 8999, mrp: 11999, edition: "8th Ed", matchTags: ["Watson-Jones","fractures"] },
              { name: "Rockwood & Green's Fractures in Adults 9th Ed", author: "Heckman, Tornetta, McKee", publisher: "Wolters Kluwer", price: 9999, mrp: 13999, edition: "9th Ed", matchTags: ["Rockwood Green","fractures"] },
            ],
          },
          {
            id: "psychiatry-final",
            name: "Psychiatry",
            color: "#5856D6",
            books: [
              { name: "Ahuja's Textbook of Postgraduate Psychiatry 3rd Ed", author: "Niraj Ahuja", publisher: "Jaypee Brothers", price: 1999, mrp: 2699, edition: "3rd Ed", featured: true, matchTags: ["Ahuja","psychiatry","India"] },
              { name: "Kaplan & Sadock's Synopsis of Psychiatry 12th Ed", author: "Benjamin Sadock", publisher: "Wolters Kluwer", price: 5999, mrp: 7999, edition: "12th Ed", matchTags: ["Kaplan Sadock","psychiatry"] },
              { name: "New Oxford Textbook of Psychiatry 3rd Ed", author: "Gelder, Andreasen, Lopez-Ibor", publisher: "Oxford University Press", price: 14999, mrp: 19999, edition: "3rd Ed", matchTags: ["Oxford","psychiatry"] },
              { name: "Shorter Oxford Textbook of Psychiatry 7th Ed", author: "Semple & Smyth", publisher: "Oxford University Press", price: 4999, mrp: 6699, edition: "7th Ed", matchTags: ["Shorter Oxford","psychiatry"] },
              { name: "DSM-5-TR Diagnostic & Statistical Manual 2022 Ed", author: "American Psychiatric Association", publisher: "APA Publishing", price: 3999, mrp: 5499, edition: "2022 Ed", matchTags: ["DSM-5","psychiatry"] },
            ],
          },
          {
            id: "radiology-final",
            name: "Radiology",
            color: "#636366",
            books: [
              { name: "Grainger & Allison's Diagnostic Radiology 6th Ed", author: "Gillard, Waldman, Donoghue", publisher: "Elsevier", price: 14999, mrp: 19999, edition: "6th Ed", featured: true, matchTags: ["Grainger Allison","radiology"] },
              { name: "Clinical Radiology The Essentials 5th Ed", author: "Richard Daffner & Milan Hartman", publisher: "Wolters Kluwer", price: 3999, mrp: 5499, edition: "5th Ed", matchTags: ["Daffner","radiology"] },
              { name: "Merrill's Atlas of Radiographic Positions 14th Ed", author: "Long, Rollins, Smith", publisher: "Elsevier", price: 6999, mrp: 9499, edition: "14th Ed", matchTags: ["Merrill's","radiology","radiographic"] },
              { name: "Sutton's Textbook of Radiology & Imaging 7th Ed", author: "David Sutton", publisher: "Churchill Livingstone", price: 7999, mrp: 10999, edition: "7th Ed", matchTags: ["Sutton","radiology"] },
              { name: "Chapman & Nakielny Guide to Radiological Procedures 7th Ed", author: "Stephen Chapman", publisher: "Elsevier", price: 3999, mrp: 5499, edition: "7th Ed", matchTags: ["Chapman","radiology","procedures"] },
              { name: "Squire's Fundamentals of Radiology 6th Ed", author: "Novelline", publisher: "Harvard University Press", price: 4999, mrp: 6499, edition: "6th Ed", matchTags: ["Squire","radiology"] },
            ],
          },
          {
            id: "anaesthesia-final",
            name: "Anaesthesia",
            color: "#8E8E93",
            books: [
              { name: "Morgan & Mikhail's Clinical Anesthesiology 6th Ed", author: "Butterworth, Mackey, Wasnick", publisher: "McGraw-Hill", price: 5499, mrp: 7299, edition: "6th Ed", featured: true, matchTags: ["Morgan Mikhail","anaesthesia"] },
              { name: "Miller's Anaesthesia 9th Ed (2-Vol)", author: "Michael Gropper", publisher: "Elsevier", price: 12999, mrp: 17999, edition: "9th Ed", matchTags: ["Miller","anaesthesia"] },
              { name: "Yentis Hirsch & Smith Anaesthesia & Intensive Care A-Z 5th Ed", author: "Yentis, Hirsch, Ip", publisher: "Elsevier", price: 2999, mrp: 3999, edition: "5th Ed", matchTags: ["Yentis","anaesthesia"] },
              { name: "Stoelting's Pharmacology & Physiology in Anaesthetic Practice 5th Ed", author: "Stoelting, Hillier", publisher: "Wolters Kluwer", price: 6999, mrp: 9299, edition: "5th Ed", matchTags: ["Stoelting","anaesthesia","pharmacology"] },
              { name: "Barash Clinical Anesthesia 9th Ed", author: "Barash, Cullen, Stoelting", publisher: "Wolters Kluwer", price: 7999, mrp: 10499, edition: "9th Ed", matchTags: ["Barash","anaesthesia"] },
            ],
          },
        ],
      },
    ],
  },

  // ──────────────────────────────── MD ─────────────────────────────────
  {
    id: "md",
    label: "MD",
    shortLabel: "MD",
    color: "#5856D6",
    isPG: true,
    years: [

      // ─────────────── MD Medicine ───────────────
      {
        id: "md-medicine",
        label: "MD Medicine",
        subjects: [
          {
            id: "md-med-y1", name: "Year 1", color: "#007AFF",
            books: [
              { name: "API Textbook of Medicine 11th Ed", author: "Siddharth Shah", publisher: "Jaypee Brothers", price: 5999, mrp: 7999, edition: "11th Ed", featured: true, matchTags: ["API","medicine","India"] },
              { name: "Talley & O'Connor Clinical Examination 8th Ed", author: "Nicholas Talley", publisher: "Elsevier", price: 4999, mrp: 6699, edition: "8th Ed", matchTags: ["Talley O'Connor","clinical examination"] },
              { name: "Davidson's Principles & Practice of Medicine 24th Ed", author: "Penman, Walker, Ralston", publisher: "Elsevier", price: 4999, mrp: 6999, edition: "24th Ed", matchTags: ["Davidson","medicine"] },
              { name: "Hutchison's Clinical Methods 25th Ed", author: "Glynn & Drake", publisher: "Elsevier", price: 3499, mrp: 4799, edition: "25th Ed", matchTags: ["Hutchison","clinical methods"] },
              { name: "ICMR Guidelines for Biomedical Research 2017", author: "ICMR", publisher: "ICMR Publications", price: 499, mrp: 699, edition: "2017 Ed", matchTags: ["ICMR","biomedical research","ethics"] },
            ],
          },
          {
            id: "md-med-y2", name: "Year 2", color: "#007AFF",
            books: [
              { name: "Harrison's Principles of Internal Medicine 21st Ed (2-Vol Set)", author: "Loscalzo, Fauci, Kasper", publisher: "McGraw-Hill", price: 8999, mrp: 12999, edition: "21st Ed", featured: true, matchTags: ["Harrison","Internal Medicine"] },
              { name: "Oxford Textbook of Medicine 6th Ed", author: "Firth, Conlon, Cox", publisher: "Oxford University Press", price: 9999, mrp: 13999, edition: "6th Ed", matchTags: ["Oxford textbook","medicine"] },
              { name: "Ferri's Clinical Advisor 2025", author: "Fred Ferri", publisher: "Elsevier", price: 7499, mrp: 9999, edition: "2025 Ed", matchTags: ["Ferri","clinical advisor"] },
              { name: "Cecil Essentials of Medicine 10th Ed", author: "Ivor Benjamin", publisher: "Elsevier", price: 6499, mrp: 8499, edition: "10th Ed", matchTags: ["Cecil essentials","medicine"] },
            ],
          },
          {
            id: "md-med-y3", name: "Year 3", color: "#007AFF",
            books: [
              { name: "Current Medical Diagnosis & Treatment 2025", author: "Maxine Papadakis", publisher: "McGraw-Hill", price: 6499, mrp: 8499, edition: "2025 Ed", featured: true, matchTags: ["CMDT","current medical","diagnosis treatment"] },
              { name: "Kumar & Clark's Clinical Medicine 10th Ed", author: "Adam Feather", publisher: "Elsevier", price: 4999, mrp: 6699, edition: "10th Ed", matchTags: ["Kumar Clark","clinical medicine"] },
              { name: "PG Entrance Revision in Medicine 4th Ed", author: "Ajay Mathur", publisher: "Jaypee Brothers", price: 2999, mrp: 3999, edition: "4th Ed", matchTags: ["PG entrance","medicine","revision"] },
              { name: "Washington Manual of Medical Therapeutics 37th Ed", author: "Brent Foster et al.", publisher: "Wolters Kluwer", price: 3999, mrp: 5299, edition: "37th Ed", matchTags: ["Washington Manual","therapeutics"] },
            ],
          },
        ],
      },

      // ─────────────── MD Pathology ───────────────
      {
        id: "md-pathology",
        label: "MD Pathology",
        subjects: [
          {
            id: "md-path-y1", name: "Year 1", color: "#FF3B30",
            books: [
              { name: "Harsh Mohan Textbook of Pathology 8th Ed", author: "Harsh Mohan", publisher: "Jaypee Brothers", price: 2999, mrp: 3999, edition: "8th Ed", featured: true, matchTags: ["Harsh Mohan","pathology","India"] },
              { name: "Robbins Basic Pathology 11th Ed", author: "Kumar, Abbas, Aster", publisher: "Elsevier", price: 5999, mrp: 7999, edition: "11th Ed", matchTags: ["Robbins Basic","pathology"] },
              { name: "Underwood's Pathology 7th Ed", author: "Cross & Underwood", publisher: "Elsevier", price: 3999, mrp: 5499, edition: "7th Ed", matchTags: ["Underwood","pathology"] },
              { name: "Lippincott Illustrated Reviews: Pathology 3rd Ed", author: "Rubin & Strayer", publisher: "Wolters Kluwer", price: 4499, mrp: 5999, edition: "3rd Ed", matchTags: ["Lippincott","pathology"] },
            ],
          },
          {
            id: "md-path-y2", name: "Year 2", color: "#FF3B30",
            books: [
              { name: "Robbins & Cotran Pathologic Basis of Disease 10th Ed", author: "Kumar, Abbas, Aster", publisher: "Elsevier", price: 7999, mrp: 10999, edition: "10th Ed", featured: true, matchTags: ["Robbins Cotran","pathology"] },
              { name: "Sternberg's Diagnostic Surgical Pathology 6th Ed", author: "Sternberg, Goldblum, Hong", publisher: "Wolters Kluwer", price: 9999, mrp: 13999, edition: "6th Ed", matchTags: ["Sternberg","surgical pathology"] },
              { name: "Bancroft's Theory & Practice of Histological Techniques 8th Ed", author: "Suvarna, Layton, Bancroft", publisher: "Elsevier", price: 6999, mrp: 9499, edition: "8th Ed", matchTags: ["Bancroft","histology"] },
              { name: "Damjanov Pathology for the Board Examinations 4th Ed", author: "Ivan Damjanov", publisher: "JP Medical", price: 3999, mrp: 5299, edition: "4th Ed", matchTags: ["Damjanov","pathology boards"] },
            ],
          },
          {
            id: "md-path-y3", name: "Year 3", color: "#FF3B30",
            books: [
              { name: "Rosai & Ackerman's Surgical Pathology 11th Ed", author: "Juan Rosai", publisher: "Elsevier", price: 12999, mrp: 17999, edition: "11th Ed", featured: true, matchTags: ["Rosai Ackerman","surgical pathology"] },
              { name: "WHO Classification of Tumours 5th Ed Series", author: "WHO", publisher: "IARC Press", price: 8999, mrp: 11999, edition: "5th Ed", matchTags: ["WHO classification","tumours"] },
              { name: "Molecular Pathology in Clinical Practice 3rd Ed", author: "Kamel & Bhargava", publisher: "Springer", price: 8999, mrp: 11999, edition: "3rd Ed", matchTags: ["molecular pathology","clinical practice"] },
            ],
          },
        ],
      },

      // ─────────────── MD Pharmacology ───────────────
      {
        id: "md-pharmacology",
        label: "MD Pharmacology",
        subjects: [
          {
            id: "md-pharm-y1", name: "Year 1", color: "#FF9500",
            books: [
              { name: "KD Tripathi Essentials of Medical Pharmacology 8th Ed", author: "KD Tripathi", publisher: "Jaypee Brothers", price: 1799, mrp: 2499, edition: "8th Ed", featured: true, matchTags: ["KD Tripathi","pharmacology","India"] },
              { name: "Katzung Basic & Clinical Pharmacology 16th Ed", author: "Bertram Katzung", publisher: "McGraw-Hill", price: 5999, mrp: 7999, edition: "16th Ed", matchTags: ["Katzung","pharmacology"] },
              { name: "Lippincott Illustrated Reviews: Pharmacology 8th Ed", author: "Karen Whalen", publisher: "Wolters Kluwer", price: 3999, mrp: 5299, edition: "8th Ed", matchTags: ["Lippincott","pharmacology"] },
              { name: "Research Methodology in Health Sciences 3rd Ed", author: "Suresh K Sharma", publisher: "Jaypee Brothers", price: 1299, mrp: 1799, edition: "3rd Ed", matchTags: ["research methodology","pharmacology"] },
            ],
          },
          {
            id: "md-pharm-y2", name: "Year 2", color: "#FF9500",
            books: [
              { name: "Goodman & Gilman's Pharmacological Basis of Therapeutics 14th Ed", author: "Brunton, Knollmann, Hilal-Dandan", publisher: "McGraw-Hill", price: 8999, mrp: 11999, edition: "14th Ed", featured: true, matchTags: ["Goodman Gilman","pharmacology"] },
              { name: "Stahl's Essential Psychopharmacology 5th Ed", author: "Stephen Stahl", publisher: "Cambridge University Press", price: 5999, mrp: 7999, edition: "5th Ed", matchTags: ["Stahl","psychopharmacology"] },
              { name: "Rang & Dale's Pharmacology 10th Ed", author: "Rang, Ritter, Flower, Henderson", publisher: "Elsevier", price: 4999, mrp: 6499, edition: "10th Ed", matchTags: ["Rang Dale","pharmacology"] },
              { name: "Basic & Clinical Pharmacology Exam Review (Katzung & Trevor)", author: "Katzung & Trevor", publisher: "McGraw-Hill", price: 3499, mrp: 4799, edition: "9th Ed", matchTags: ["Katzung Trevor","pharmacology review"] },
            ],
          },
          {
            id: "md-pharm-y3", name: "Year 3", color: "#FF9500",
            books: [
              { name: "Applied Biopharmaceutics & Pharmacokinetics 7th Ed", author: "Leon Shargel & Andrew Yu", publisher: "McGraw-Hill", price: 5499, mrp: 7299, edition: "7th Ed", featured: true, matchTags: ["pharmacokinetics","biopharmaceutics"] },
              { name: "Drug Information: A Guide for Pharmacists 7th Ed", author: "Malone, Malone, Park", publisher: "McGraw-Hill", price: 4499, mrp: 5999, edition: "7th Ed", matchTags: ["drug information","pharmacists"] },
              { name: "Clinical Pharmacology Made Ridiculously Simple 5th Ed", author: "James Olson", publisher: "MedMaster", price: 1999, mrp: 2699, edition: "5th Ed", matchTags: ["clinical pharmacology","ridiculously simple"] },
            ],
          },
        ],
      },

      // ─────────────── MD Microbiology ───────────────
      {
        id: "md-microbiology",
        label: "MD Microbiology",
        subjects: [
          {
            id: "md-micro-y1", name: "Year 1", color: "#00C2A8",
            books: [
              { name: "Ananthanarayan & Paniker Textbook of Microbiology 11th Ed", author: "CK Jayaram Paniker", publisher: "Universities Press", price: 1299, mrp: 1799, edition: "11th Ed", featured: true, matchTags: ["Ananthanarayan","microbiology","India"] },
              { name: "Murray's Manual of Clinical Microbiology 13th Ed", author: "Carroll, Pfaller, Landry", publisher: "ASM Press", price: 9999, mrp: 13499, edition: "13th Ed", matchTags: ["Murray","clinical microbiology"] },
              { name: "Jawetz Melnick & Adelberg's Medical Microbiology 28th Ed", author: "Carroll, Butel, Morse", publisher: "McGraw-Hill", price: 4999, mrp: 6699, edition: "28th Ed", matchTags: ["Jawetz","microbiology"] },
              { name: "Medical Microbiology: An Introduction to Infectious Diseases 7th Ed", author: "Ryan & Ray", publisher: "McGraw-Hill", price: 4499, mrp: 5999, edition: "7th Ed", matchTags: ["Ryan Ray","microbiology infectious diseases"] },
            ],
          },
          {
            id: "md-micro-y2", name: "Year 2", color: "#00C2A8",
            books: [
              { name: "Mandell Douglas & Bennett's Principles of Infectious Diseases 9th Ed", author: "Bennett, Dolin, Blaser", publisher: "Elsevier", price: 12999, mrp: 17999, edition: "9th Ed", featured: true, matchTags: ["Mandell Douglas","infectious diseases"] },
              { name: "Topley & Wilson's Microbiology & Microbial Infections 10th Ed", author: "Collier, Balows, Sussman", publisher: "Hodder Arnold", price: 9999, mrp: 13499, edition: "10th Ed", matchTags: ["Topley Wilson","microbiology"] },
              { name: "Harrison's Infectious Diseases 3rd Ed", author: "Kasper & Fauci", publisher: "McGraw-Hill", price: 5999, mrp: 7999, edition: "3rd Ed", matchTags: ["Harrison","infectious diseases"] },
            ],
          },
          {
            id: "md-micro-y3", name: "Year 3", color: "#00C2A8",
            books: [
              { name: "Clinical Microbiology Made Ridiculously Simple 8th Ed", author: "Mark Gladwin", publisher: "MedMaster", price: 1999, mrp: 2699, edition: "8th Ed", featured: true, matchTags: ["clinical microbiology","ridiculously simple"] },
              { name: "Bailey & Scott's Diagnostic Microbiology 14th Ed", author: "Sandora & Weinstein", publisher: "Elsevier", price: 7999, mrp: 10999, edition: "14th Ed", matchTags: ["Bailey Scott","diagnostic microbiology"] },
              { name: "Sherris Medical Microbiology 7th Ed", author: "Ryan, Carroll, Morse", publisher: "McGraw-Hill", price: 4999, mrp: 6699, edition: "7th Ed", matchTags: ["Sherris","medical microbiology"] },
            ],
          },
        ],
      },

      // ─────────────── MD Radiodiagnosis ───────────────
      {
        id: "md-radiodiagnosis",
        label: "MD Radiodiagnosis",
        subjects: [
          {
            id: "md-radio-y1", name: "Year 1", color: "#636366",
            books: [
              { name: "Sutton's Textbook of Radiology & Imaging 7th Ed", author: "David Sutton", publisher: "Churchill Livingstone", price: 7999, mrp: 10999, edition: "7th Ed", featured: true, matchTags: ["Sutton","radiology"] },
              { name: "CT Teaching Manual 4th Ed", author: "Matthias Hofer", publisher: "Thieme", price: 4999, mrp: 6499, edition: "4th Ed", matchTags: ["CT","teaching manual","radiology"] },
              { name: "Essentials of Radiology 3rd Ed", author: "Fred Mettler", publisher: "Elsevier", price: 4999, mrp: 6499, edition: "3rd Ed", matchTags: ["Mettler","radiology","essentials"] },
              { name: "Fundamentals of Diagnostic Radiology 5th Ed", author: "Brant & Helms", publisher: "Wolters Kluwer", price: 6999, mrp: 9499, edition: "5th Ed", matchTags: ["Brant Helms","diagnostic radiology"] },
            ],
          },
          {
            id: "md-radio-y2", name: "Year 2", color: "#636366",
            books: [
              { name: "Grainger & Allison's Diagnostic Radiology 6th Ed", author: "Adam, Dixon, Gillard", publisher: "Churchill Livingstone", price: 12999, mrp: 17999, edition: "6th Ed", featured: true, matchTags: ["Grainger Allison","diagnostic radiology"] },
              { name: "Diagnostic Ultrasound 5th Ed", author: "Rumack, Levine, Charboneau", publisher: "Elsevier", price: 9999, mrp: 13999, edition: "5th Ed", matchTags: ["Rumack","ultrasound","diagnostic"] },
              { name: "Weir & Abrahams' Imaging Atlas of Human Anatomy 5th Ed", author: "Abrahams, Spratt, Loukas", publisher: "Elsevier", price: 4999, mrp: 6699, edition: "5th Ed", matchTags: ["Weir Abrahams","anatomy imaging atlas"] },
            ],
          },
          {
            id: "md-radio-y3", name: "Year 3", color: "#636366",
            books: [
              { name: "Dahnert's Radiology Review Manual 8th Ed", author: "Wolfgang Dahnert", publisher: "Wolters Kluwer", price: 6499, mrp: 8499, edition: "8th Ed", featured: true, matchTags: ["Dahnert","radiology review"] },
              { name: "MRI in Clinical Practice 2nd Ed", author: "Borley, Reznek, Husband", publisher: "Springer", price: 6999, mrp: 9499, edition: "2nd Ed", matchTags: ["MRI","clinical practice"] },
              { name: "Nuclear Medicine: The Requisites 5th Ed", author: "Ziessman, O'Malley, Thrall", publisher: "Elsevier", price: 5499, mrp: 7499, edition: "5th Ed", matchTags: ["nuclear medicine","requisites"] },
              { name: "Practical Interventional Radiology 2nd Ed", author: "Kessel & Robertson", publisher: "Springer", price: 5999, mrp: 7999, edition: "2nd Ed", matchTags: ["interventional radiology"] },
            ],
          },
        ],
      },

      // ─────────────── MD Anaesthesiology ───────────────
      {
        id: "md-anaesthesia",
        label: "MD Anaesthesiology",
        subjects: [
          {
            id: "md-anaes-y1", name: "Year 1", color: "#8E8E93",
            books: [
              { name: "Morgan & Mikhail's Clinical Anesthesiology 6th Ed", author: "Butterworth, Mackey, Wasnick", publisher: "McGraw-Hill", price: 5499, mrp: 7299, edition: "6th Ed", featured: true, matchTags: ["Morgan Mikhail","anaesthesia"] },
              { name: "Nunn's Applied Respiratory Physiology 8th Ed", author: "Andrew Lumb", publisher: "Elsevier", price: 6999, mrp: 9299, edition: "8th Ed", matchTags: ["Nunn","respiratory physiology","anaesthesia"] },
              { name: "Stoelting's Pharmacology & Physiology in Anesthetic Practice 5th Ed", author: "Flood, Rathmell, Shafer", publisher: "Wolters Kluwer", price: 6999, mrp: 9299, edition: "5th Ed", matchTags: ["Stoelting","anaesthesia pharmacology"] },
              { name: "Principles & Practice of Anesthesiology 3rd Ed", author: "Longnecker, Mackey, Newman", publisher: "Elsevier", price: 7999, mrp: 10999, edition: "3rd Ed", matchTags: ["principles anaesthesiology"] },
            ],
          },
          {
            id: "md-anaes-y2", name: "Year 2", color: "#8E8E93",
            books: [
              { name: "Barash Clinical Anesthesia 8th Ed", author: "Barash, Cullen, Stoelting", publisher: "Wolters Kluwer", price: 9999, mrp: 13999, edition: "8th Ed", featured: true, matchTags: ["Barash","clinical anesthesia"] },
              { name: "Yao & Artusio's Anesthesiology 8th Ed", author: "Fun-Sun Yao", publisher: "Wolters Kluwer", price: 6999, mrp: 9499, edition: "8th Ed", matchTags: ["Yao Artusio","anesthesiology"] },
              { name: "Pardo & Miller's Basics of Anesthesia 8th Ed", author: "Pardo & Miller", publisher: "Elsevier", price: 4999, mrp: 6699, edition: "8th Ed", matchTags: ["Pardo Miller","basics anesthesia"] },
              { name: "Obstetric Anesthesia 6th Ed", author: "Chesnut, Wong, Tsen", publisher: "Elsevier", price: 7999, mrp: 10999, edition: "6th Ed", matchTags: ["obstetric anesthesia"] },
            ],
          },
          {
            id: "md-anaes-y3", name: "Year 3", color: "#8E8E93",
            books: [
              { name: "Miller's Anesthesia 9th Ed (2-Vol Set)", author: "Miller et al.", publisher: "Elsevier", price: 14999, mrp: 19999, edition: "9th Ed", featured: true, matchTags: ["Miller","anesthesia"] },
              { name: "Principles of Critical Care 4th Ed", author: "Hall, Schmidt, Kress", publisher: "McGraw-Hill", price: 7499, mrp: 9999, edition: "4th Ed", matchTags: ["critical care","principles"] },
              { name: "ACLS Provider Manual 2022", author: "American Heart Association", publisher: "AHA", price: 1999, mrp: 2699, edition: "2022 Ed", matchTags: ["ACLS","advanced cardiac life support"] },
              { name: "Regional Anesthesia & Acute Pain Management 2nd Ed", author: "Rathmell & Neal", publisher: "Wolters Kluwer", price: 5999, mrp: 7999, edition: "2nd Ed", matchTags: ["regional anesthesia","pain management"] },
            ],
          },
        ],
      },

      // ─────────────── MD Psychiatry ───────────────
      {
        id: "md-psychiatry",
        label: "MD Psychiatry",
        subjects: [
          {
            id: "md-psych-y1", name: "Year 1", color: "#5856D6",
            books: [
              { name: "DSM-5-TR Diagnostic & Statistical Manual 2022 Ed", author: "American Psychiatric Association", publisher: "APA Publishing", price: 3999, mrp: 5499, edition: "2022 Ed", featured: true, matchTags: ["DSM-5","psychiatry"] },
              { name: "Synopsis of Psychiatry (Kaplan & Sadock) 12th Ed", author: "Sadock, Sadock, Ruiz", publisher: "Wolters Kluwer", price: 6999, mrp: 9499, edition: "12th Ed", matchTags: ["Kaplan Sadock","synopsis psychiatry"] },
              { name: "Textbook of Psychiatry 3rd Ed (Ahuja)", author: "NK Ahuja", publisher: "CBS Publishers", price: 1299, mrp: 1799, edition: "3rd Ed", matchTags: ["Ahuja","psychiatry","India"] },
              { name: "ICD-11 Classification of Mental & Behavioural Disorders", author: "World Health Organization", publisher: "WHO", price: 1499, mrp: 1999, edition: "2022 Ed", matchTags: ["ICD-11","mental disorders","WHO"] },
            ],
          },
          {
            id: "md-psych-y2", name: "Year 2", color: "#5856D6",
            books: [
              { name: "Kaplan & Sadock's Comprehensive Textbook of Psychiatry 11th Ed", author: "Sadock, Sadock, Ruiz", publisher: "Wolters Kluwer", price: 13999, mrp: 18999, edition: "11th Ed", featured: true, matchTags: ["Kaplan Sadock","comprehensive psychiatry"] },
              { name: "New Oxford Textbook of Psychiatry 3rd Ed", author: "Geddes, Andreasen, Goodwin", publisher: "Oxford University Press", price: 9999, mrp: 13999, edition: "3rd Ed", matchTags: ["Oxford","psychiatry"] },
              { name: "Stahl's Essential Psychopharmacology 5th Ed", author: "Stephen Stahl", publisher: "Cambridge University Press", price: 5999, mrp: 7999, edition: "5th Ed", matchTags: ["Stahl","psychopharmacology"] },
              { name: "Clinical Neuropsychology 5th Ed", author: "Heilman & Valenstein", publisher: "Oxford University Press", price: 6999, mrp: 9499, edition: "5th Ed", matchTags: ["neuropsychology","clinical"] },
            ],
          },
          {
            id: "md-psych-y3", name: "Year 3", color: "#5856D6",
            books: [
              { name: "Rutter's Child & Adolescent Psychiatry 6th Ed", author: "Rutter, Bishop, Pine", publisher: "Wiley-Blackwell", price: 9999, mrp: 13999, edition: "6th Ed", featured: true, matchTags: ["Rutter","child psychiatry"] },
              { name: "Cognitive Behavioral Therapy: Basics & Beyond 3rd Ed", author: "Judith Beck", publisher: "Guilford Press", price: 3999, mrp: 5299, edition: "3rd Ed", matchTags: ["CBT","cognitive behavioral therapy"] },
              { name: "Psychiatry in Old Age 4th Ed", author: "Jacoby, Oppenheimer, Dening", publisher: "Oxford University Press", price: 6999, mrp: 9499, edition: "4th Ed", matchTags: ["old age psychiatry","geriatric"] },
            ],
          },
        ],
      },

      // ─────────────── MD Dermatology ───────────────
      {
        id: "md-dermatology",
        label: "MD Dermatology",
        subjects: [
          {
            id: "md-derm-y1", name: "Year 1", color: "#FF6B35",
            books: [
              { name: "IADVL Textbook of Dermatology 4th Ed", author: "Valia & Valia", publisher: "Bhalani Publishing", price: 4999, mrp: 6499, edition: "4th Ed", featured: true, matchTags: ["IADVL","dermatology","India"] },
              { name: "Inamadar's Textbook of Dermatology 3rd Ed", author: "Arun Inamadar", publisher: "Jaypee Brothers", price: 2999, mrp: 3999, edition: "3rd Ed", matchTags: ["Inamadar","dermatology","India"] },
              { name: "Andrews' Diseases of the Skin 13th Ed", author: "Elston, Ferringer, Ko", publisher: "Elsevier", price: 6999, mrp: 9499, edition: "13th Ed", matchTags: ["Andrews","skin diseases"] },
              { name: "Clinical Dermatology 7th Ed", author: "Thomas Habif", publisher: "Elsevier", price: 5999, mrp: 7999, edition: "7th Ed", matchTags: ["Habif","clinical dermatology"] },
            ],
          },
          {
            id: "md-derm-y2", name: "Year 2", color: "#FF6B35",
            books: [
              { name: "Fitzpatrick's Dermatology 9th Ed (2-Vol Set)", author: "Kang, Amagai, Bruckner", publisher: "McGraw-Hill", price: 14999, mrp: 19999, edition: "9th Ed", featured: true, matchTags: ["Fitzpatrick","dermatology"] },
              { name: "Bologna Schaffer & Cerroni Dermatology 4th Ed", author: "Bologna, Schaffer, Cerroni", publisher: "Elsevier", price: 12999, mrp: 17999, edition: "4th Ed", matchTags: ["Bologna","dermatology"] },
              { name: "Contact & Occupational Dermatology 4th Ed", author: "Rietschel & Fowler", publisher: "People's Medical Publishing House", price: 6999, mrp: 9499, edition: "4th Ed", matchTags: ["contact dermatology","occupational"] },
            ],
          },
          {
            id: "md-derm-y3", name: "Year 3", color: "#FF6B35",
            books: [
              { name: "Rook's Textbook of Dermatology 9th Ed (4-Vol Set)", author: "Griffiths, Barker, Bleiker", publisher: "Wiley-Blackwell", price: 19999, mrp: 27999, edition: "9th Ed", featured: true, matchTags: ["Rook","textbook dermatology"] },
              { name: "Dermatologic Surgery 4th Ed", author: "Roenigk & Roenigk", publisher: "Informa Healthcare", price: 7999, mrp: 10999, edition: "4th Ed", matchTags: ["dermatologic surgery"] },
              { name: "Photodermatology 1st Ed", author: "Lim & Hawk", publisher: "Informa Healthcare", price: 5999, mrp: 7999, edition: "1st Ed", matchTags: ["photodermatology","photobiology"] },
              { name: "Hair & Scalp Disorders 2nd Ed", author: "Blume-Peytavi, Tosti, Whiting", publisher: "Informa Healthcare", price: 5499, mrp: 7499, edition: "2nd Ed", matchTags: ["hair disorders","scalp"] },
            ],
          },
        ],
      },

      // ─────────────── MD Emergency Medicine ───────────────
      {
        id: "md-emergency",
        label: "MD Emergency Medicine",
        subjects: [
          {
            id: "md-em-y1", name: "Year 1", color: "#FF2D55",
            books: [
              { name: "Roberts & Hedges' Clinical Procedures in Emergency Medicine 7th Ed", author: "Roberts, Custalow, Thomsen", publisher: "Elsevier", price: 8999, mrp: 11999, edition: "7th Ed", featured: true, matchTags: ["Roberts Hedges","emergency procedures"] },
              { name: "Emergency Medicine Manual 8th Ed", author: "Cline, Ma, Cydulka", publisher: "McGraw-Hill", price: 4499, mrp: 5999, edition: "8th Ed", matchTags: ["emergency medicine","manual"] },
              { name: "Atlas of Emergency Medicine 4th Ed", author: "Knoop, Stack, Storrow", publisher: "McGraw-Hill", price: 5999, mrp: 7999, edition: "4th Ed", matchTags: ["atlas","emergency medicine"] },
              { name: "Critical Care Medicine 5th Ed", author: "Parrillo & Dellinger", publisher: "Elsevier", price: 8999, mrp: 11999, edition: "5th Ed", matchTags: ["critical care","ICU"] },
            ],
          },
          {
            id: "md-em-y2", name: "Year 2", color: "#FF2D55",
            books: [
              { name: "Tintinalli's Emergency Medicine 9th Ed", author: "Tintinalli, Ma, Yealy", publisher: "McGraw-Hill", price: 9999, mrp: 13999, edition: "9th Ed", featured: true, matchTags: ["Tintinalli","emergency medicine"] },
              { name: "Rosen's Emergency Medicine 9th Ed (2-Vol Set)", author: "Walls, Hockberger, Gausche-Hill", publisher: "Elsevier", price: 12999, mrp: 17999, edition: "9th Ed", matchTags: ["Rosen","emergency medicine"] },
              { name: "ATLS Advanced Trauma Life Support 10th Ed", author: "American College of Surgeons", publisher: "ACS", price: 2499, mrp: 3499, edition: "10th Ed", matchTags: ["ATLS","trauma","emergency"] },
            ],
          },
          {
            id: "md-em-y3", name: "Year 3", color: "#FF2D55",
            books: [
              { name: "Emergency Ultrasound 3rd Ed", author: "Ma & Mateer", publisher: "McGraw-Hill", price: 5499, mrp: 7499, edition: "3rd Ed", featured: true, matchTags: ["emergency ultrasound","POCUS"] },
              { name: "Toxicological Emergencies 9th Ed", author: "Goldfrank et al.", publisher: "McGraw-Hill", price: 7999, mrp: 10999, edition: "9th Ed", matchTags: ["toxicology","poisoning","emergency"] },
              { name: "Wilderness Medicine 7th Ed", author: "Auerbach", publisher: "Elsevier", price: 7999, mrp: 10999, edition: "7th Ed", matchTags: ["wilderness medicine"] },
            ],
          },
        ],
      },

    ],  // end MD years
  },

  // ──────────────────────────────── MS ─────────────────────────────────
  {
    id: "ms",
    label: "MS",
    shortLabel: "MS",
    color: "#FF6B35",
    isPG: true,
    years: [

      // ─────────────── MS General Surgery ───────────────
      {
        id: "ms-general-surgery",
        label: "MS General Surgery",
        subjects: [
          {
            id: "ms-gen-y1", name: "Year 1", color: "#FF6B35",
            books: [
              { name: "Bailey & Love's Short Practice of Surgery 27th Ed", author: "Williams, O'Connell, McCaskie", publisher: "Taylor & Francis", price: 5499, mrp: 7499, edition: "27th Ed", featured: true, matchTags: ["Bailey Love","surgery"] },
              { name: "SRB's Manual of Surgery 6th Ed", author: "Sriram Bhat", publisher: "Jaypee Brothers", price: 2999, mrp: 3999, edition: "6th Ed", matchTags: ["SRB","surgery manual","India"] },
              { name: "Das Manual of Surgery 4th Ed", author: "Somen Das", publisher: "GK Brothers", price: 2499, mrp: 3299, edition: "4th Ed", matchTags: ["Das","surgery","India"] },
              { name: "Clinical Surgery in General 4th Ed", author: "Kirk, Ribbans, Taylor", publisher: "Churchill Livingstone", price: 3999, mrp: 5299, edition: "4th Ed", matchTags: ["clinical surgery","general"] },
            ],
          },
          {
            id: "ms-gen-y2", name: "Year 2", color: "#FF6B35",
            books: [
              { name: "Sabiston Textbook of Surgery 21st Ed", author: "Townsend, Beauchamp, Evers", publisher: "Elsevier", price: 9999, mrp: 13999, edition: "21st Ed", featured: true, matchTags: ["Sabiston","surgery"] },
              { name: "Schwartz's Principles of Surgery 11th Ed", author: "Brunicardi et al.", publisher: "McGraw-Hill", price: 9999, mrp: 13999, edition: "11th Ed", matchTags: ["Schwartz","surgery principles"] },
              { name: "Maingot's Abdominal Operations 13th Ed", author: "Zinner & Ashley", publisher: "McGraw-Hill", price: 7999, mrp: 10999, edition: "13th Ed", matchTags: ["Maingot","abdominal surgery"] },
              { name: "Surgical Oncology (Oxford Specialist Handbooks) 2nd Ed", author: "Neil Mortensen", publisher: "Oxford University Press", price: 4499, mrp: 5999, edition: "2nd Ed", matchTags: ["surgical oncology","Oxford"] },
            ],
          },
          {
            id: "ms-gen-y3", name: "Year 3", color: "#FF6B35",
            books: [
              { name: "Mastery of Surgery 7th Ed", author: "Baker, Fischer, Jones", publisher: "Wolters Kluwer", price: 9999, mrp: 13999, edition: "7th Ed", featured: true, matchTags: ["Mastery","surgery"] },
              { name: "Hepatobiliary & Pancreatic Surgery 5th Ed", author: "Garden, Parks, Wigmore", publisher: "Elsevier", price: 8999, mrp: 11999, edition: "5th Ed", matchTags: ["hepatobiliary","pancreatic surgery"] },
              { name: "Vascular & Endovascular Surgery 6th Ed", author: "Moore & Ahn", publisher: "Elsevier", price: 7999, mrp: 10999, edition: "6th Ed", matchTags: ["vascular surgery","endovascular"] },
              { name: "Colorectal Surgery 5th Ed", author: "Nicholls & Dozois", publisher: "Elsevier", price: 7499, mrp: 9999, edition: "5th Ed", matchTags: ["colorectal","surgery"] },
            ],
          },
        ],
      },

      // ─────────────── MS Orthopaedics ───────────────
      {
        id: "ms-orthopaedics",
        label: "MS Orthopaedics",
        subjects: [
          {
            id: "ms-ortho-y1", name: "Year 1", color: "#007AFF",
            books: [
              { name: "Apley & Solomon's System of Orthopaedics & Trauma 10th Ed", author: "Anand Apley & Louis Solomon", publisher: "Taylor & Francis", price: 5499, mrp: 7499, edition: "10th Ed", featured: true, matchTags: ["Apley Solomon","orthopaedics"] },
              { name: "Maheshwari's Essential Orthopaedics 5th Ed", author: "J Maheshwari", publisher: "Mehta Publishers", price: 1499, mrp: 1999, edition: "5th Ed", matchTags: ["Maheshwari","orthopaedics","India"] },
              { name: "Clinical Examination of the Musculoskeletal System 3rd Ed", author: "Ombregt", publisher: "Churchill Livingstone", price: 4999, mrp: 6699, edition: "3rd Ed", matchTags: ["musculoskeletal examination","orthopaedics"] },
              { name: "Anatomy for Surgeons Vol 3 — Back & Limbs", author: "Henry Hollinshead", publisher: "Harper & Row", price: 3999, mrp: 5299, edition: "3rd Ed", matchTags: ["anatomy surgeons","limbs","orthopaedics"] },
            ],
          },
          {
            id: "ms-ortho-y2", name: "Year 2", color: "#007AFF",
            books: [
              { name: "Watson-Jones Fractures & Joint Injuries 8th Ed", author: "Bucholz, Court-Brown, Heckman", publisher: "Churchill Livingstone", price: 7999, mrp: 10999, edition: "8th Ed", featured: true, matchTags: ["Watson Jones","fractures","orthopaedics"] },
              { name: "Rockwood & Green's Fractures in Adults 9th Ed", author: "Court-Brown, Heckman, McQueen", publisher: "Wolters Kluwer", price: 12999, mrp: 17999, edition: "9th Ed", matchTags: ["Rockwood Green","fractures adults"] },
              { name: "AO Manual of Fracture Management 2nd Ed", author: "Rüedi, Buckley, Moran", publisher: "Thieme", price: 9999, mrp: 13999, edition: "2nd Ed", matchTags: ["AO manual","fracture management"] },
              { name: "Tachdjian's Pediatric Orthopaedics 5th Ed", author: "Herring", publisher: "Elsevier", price: 9999, mrp: 13999, edition: "5th Ed", matchTags: ["Tachdjian","pediatric orthopaedics"] },
            ],
          },
          {
            id: "ms-ortho-y3", name: "Year 3", color: "#007AFF",
            books: [
              { name: "Campbell's Operative Orthopaedics 14th Ed (4-Vol Set)", author: "Azar, Beaty, Canale", publisher: "Elsevier", price: 19999, mrp: 27999, edition: "14th Ed", featured: true, matchTags: ["Campbell","operative orthopaedics"] },
              { name: "Spine Surgery 3rd Ed (Frymoyer)", author: "Herkowitz, Garfin, Eismont", publisher: "Elsevier", price: 9999, mrp: 13999, edition: "3rd Ed", matchTags: ["spine surgery","orthopaedics"] },
              { name: "Revision Total Knee Arthroplasty 1st Ed", author: "Bono & Scott", publisher: "Springer", price: 7999, mrp: 10999, edition: "1st Ed", matchTags: ["knee arthroplasty","revision","orthopaedics"] },
              { name: "Orthopaedic Sports Medicine 4th Ed", author: "DeLee, Drez, Miller", publisher: "Elsevier", price: 9999, mrp: 13999, edition: "4th Ed", matchTags: ["sports medicine","orthopaedics"] },
            ],
          },
        ],
      },

      // ─────────────── MS ENT ───────────────
      {
        id: "ms-ent",
        label: "MS ENT",
        subjects: [
          {
            id: "ms-ent-y1", name: "Year 1", color: "#00C2A8",
            books: [
              { name: "Dhingra's Diseases of Ear Nose & Throat 8th Ed", author: "PL Dhingra & Shruti Dhingra", publisher: "Elsevier", price: 2499, mrp: 3299, edition: "8th Ed", featured: true, matchTags: ["Dhingra","ENT","India"] },
              { name: "Flint Cummings Otolaryngology — Essential Clinical Companion 2nd Ed", author: "Flint et al.", publisher: "Elsevier", price: 4999, mrp: 6699, edition: "2nd Ed", matchTags: ["Cummings","ENT essential"] },
              { name: "Logan Turner's Diseases of the Nose Throat & Ear 11th Ed", author: "Maran, O'Neill, Stevenson", publisher: "CRC Press", price: 3999, mrp: 5299, edition: "11th Ed", matchTags: ["Logan Turner","ENT"] },
              { name: "Snow & Wackym Ballenger's Otorhinolaryngology 18th Ed", author: "Ballenger & Snow", publisher: "People's Medical Publishing", price: 7999, mrp: 10999, edition: "18th Ed", matchTags: ["Ballenger","otorhinolaryngology"] },
            ],
          },
          {
            id: "ms-ent-y2", name: "Year 2", color: "#00C2A8",
            books: [
              { name: "Cummings Otolaryngology 7th Ed (3-Vol Set)", author: "Flint, Francis, Haughey", publisher: "Elsevier", price: 14999, mrp: 19999, edition: "7th Ed", featured: true, matchTags: ["Cummings","otolaryngology"] },
              { name: "Scott-Brown's Otorhinolaryngology Head & Neck Surgery 8th Ed", author: "Gleeson et al.", publisher: "CRC Press", price: 12999, mrp: 17999, edition: "8th Ed", matchTags: ["Scott-Brown","otorhinolaryngology"] },
              { name: "Textbook of Otolaryngology & Head & Neck Surgery (Narula)", author: "AK Narula", publisher: "CBS Publishers", price: 3999, mrp: 5299, edition: "2nd Ed", matchTags: ["Narula","ENT India","head neck"] },
            ],
          },
          {
            id: "ms-ent-y3", name: "Year 3", color: "#00C2A8",
            books: [
              { name: "Endoscopic Sinus Surgery 3rd Ed", author: "Stammberger & Hawke", publisher: "Thieme", price: 6999, mrp: 9499, edition: "3rd Ed", featured: true, matchTags: ["endoscopic sinus surgery","FESS"] },
              { name: "Head & Neck Surgery Oncology 5th Ed", author: "Shah, Patel, Singh", publisher: "Mosby", price: 9999, mrp: 13999, edition: "5th Ed", matchTags: ["head neck surgery","oncology"] },
              { name: "Otosclerosis & Stapes Surgery 1st Ed", author: "Fisch & May", publisher: "Thieme", price: 5999, mrp: 7999, edition: "1st Ed", matchTags: ["otosclerosis","stapes surgery"] },
              { name: "Rhinology 4th Ed", author: "Stammberger, Kennedy, Bolger", publisher: "Thieme", price: 7499, mrp: 9999, edition: "4th Ed", matchTags: ["rhinology","nasal surgery"] },
            ],
          },
        ],
      },

      // ─────────────── MS Ophthalmology ───────────────
      {
        id: "ms-ophthalmology",
        label: "MS Ophthalmology",
        subjects: [
          {
            id: "ms-ophthal-y1", name: "Year 1", color: "#5856D6",
            books: [
              { name: "AK Khurana Comprehensive Ophthalmology 7th Ed", author: "AK Khurana", publisher: "New Age International", price: 1299, mrp: 1799, edition: "7th Ed", featured: true, matchTags: ["Khurana","ophthalmology","India"] },
              { name: "Clinical Ophthalmology: A Systematic Approach 8th Ed", author: "Kanski & Bowling", publisher: "Elsevier", price: 5999, mrp: 7999, edition: "8th Ed", matchTags: ["Kanski","clinical ophthalmology"] },
              { name: "Parson's Diseases of the Eye 23rd Ed", author: "Ramanjit Sihota & Radhika Tandon", publisher: "Elsevier", price: 1999, mrp: 2699, edition: "23rd Ed", matchTags: ["Parson's","eye diseases","India"] },
              { name: "Emery & Rimoin Principles & Practice of Medical Genetics 6th Ed", author: "Rimoin, Pyeritz, Korf", publisher: "Academic Press", price: 7999, mrp: 10999, edition: "6th Ed", matchTags: ["medical genetics","ophthalmology"] },
            ],
          },
          {
            id: "ms-ophthal-y2", name: "Year 2", color: "#5856D6",
            books: [
              { name: "Kanski's Clinical Ophthalmology 9th Ed", author: "Brad Bowling", publisher: "Elsevier", price: 6499, mrp: 8999, edition: "9th Ed", featured: true, matchTags: ["Kanski","ophthalmology"] },
              { name: "Yanoff & Duker Ophthalmology 5th Ed", author: "Yanoff & Duker", publisher: "Elsevier", price: 9999, mrp: 13999, edition: "5th Ed", matchTags: ["Yanoff Duker","ophthalmology"] },
              { name: "Ryan's Retina 6th Ed (3-Vol Set)", author: "Sadda, Hinton, Schachat", publisher: "Elsevier", price: 14999, mrp: 19999, edition: "6th Ed", matchTags: ["Ryan's Retina","vitreoretinal"] },
              { name: "Duke-Elder System of Ophthalmology (Selected Vol)", author: "Stewart Duke-Elder", publisher: "Henry Kimpton", price: 4999, mrp: 6699, edition: "Classic", matchTags: ["Duke-Elder","ophthalmology"] },
            ],
          },
          {
            id: "ms-ophthal-y3", name: "Year 3", color: "#5856D6",
            books: [
              { name: "American Academy of Ophthalmology BCSC Series 2023–24", author: "AAO", publisher: "AAO", price: 9999, mrp: 13999, edition: "2023-24 Ed", featured: true, matchTags: ["AAO BCSC","ophthalmology"] },
              { name: "Wills Eye Manual 8th Ed", author: "Duker, Bhavsar, Golberg", publisher: "Wolters Kluwer", price: 3999, mrp: 5299, edition: "8th Ed", matchTags: ["Wills Eye","manual"] },
              { name: "Glaucoma 3rd Ed", author: "Ritch, Shields, Krupin", publisher: "Mosby", price: 9999, mrp: 13999, edition: "3rd Ed", matchTags: ["glaucoma","ophthalmology"] },
              { name: "Cornea 4th Ed", author: "Krachmer, Mannis, Holland", publisher: "Elsevier", price: 9999, mrp: 13999, edition: "4th Ed", matchTags: ["cornea","ophthalmology"] },
            ],
          },
        ],
      },

      // ─────────────── MS Obstetrics & Gynaecology ───────────────
      {
        id: "ms-obstetrics",
        label: "MS Obstetrics & Gynaecology",
        subjects: [
          {
            id: "ms-obsgyn-y1", name: "Year 1", color: "#FF2D55",
            books: [
              { name: "DC Dutta's Textbook of Obstetrics 9th Ed", author: "Hiralal Konar", publisher: "Jaypee Brothers", price: 1799, mrp: 2499, edition: "9th Ed", featured: true, matchTags: ["DC Dutta","obstetrics","India"] },
              { name: "Shaw's Textbook of Gynaecology 17th Ed", author: "VG Padubidri", publisher: "Elsevier", price: 1499, mrp: 1999, edition: "17th Ed", matchTags: ["Shaw","gynaecology","India"] },
              { name: "Mahajan & Rangnekar's Obstetrics & Gynaecology 5th Ed", author: "BN Purandare", publisher: "Vora Medical Publications", price: 1999, mrp: 2699, edition: "5th Ed", matchTags: ["Mahajan Rangnekar","obstetrics India"] },
              { name: "FOGSI Textbook of Labour Room Emergency Management", author: "FOGSI", publisher: "Jaypee Brothers", price: 1499, mrp: 1999, edition: "1st Ed", matchTags: ["FOGSI","labour room","emergency"] },
            ],
          },
          {
            id: "ms-obsgyn-y2", name: "Year 2", color: "#FF2D55",
            books: [
              { name: "Williams Obstetrics 26th Ed", author: "Cunningham, Leveno, Dashe", publisher: "McGraw-Hill", price: 8999, mrp: 11999, edition: "26th Ed", featured: true, matchTags: ["Williams","obstetrics"] },
              { name: "Novak's Gynecology 16th Ed", author: "Berek & Novak", publisher: "Wolters Kluwer", price: 7999, mrp: 10999, edition: "16th Ed", matchTags: ["Novak","gynecology","Berek"] },
              { name: "Comprehensive Gynecology 8th Ed", author: "Lobo, Gershenson, Lentz", publisher: "Elsevier", price: 7999, mrp: 10999, edition: "8th Ed", matchTags: ["comprehensive gynecology"] },
              { name: "Maternal Fetal Medicine 8th Ed", author: "Creasy, Resnik, Iams", publisher: "Elsevier", price: 8999, mrp: 11999, edition: "8th Ed", matchTags: ["maternal fetal medicine","MFM"] },
            ],
          },
          {
            id: "ms-obsgyn-y3", name: "Year 3", color: "#FF2D55",
            books: [
              { name: "Te Linde's Operative Gynaecology 12th Ed", author: "Rock, Jones, Howard", publisher: "Wolters Kluwer", price: 9999, mrp: 13999, edition: "12th Ed", featured: true, matchTags: ["Te Linde","operative gynaecology"] },
              { name: "Gynecologic Oncology 7th Ed", author: "Berek & Hacker", publisher: "Wolters Kluwer", price: 7999, mrp: 10999, edition: "7th Ed", matchTags: ["gynecologic oncology"] },
              { name: "Infertility in Practice 4th Ed", author: "Balen & Bhide", publisher: "CRC Press", price: 5999, mrp: 7999, edition: "4th Ed", matchTags: ["infertility","ART","reproductive"] },
            ],
          },
        ],
      },

    ],  // end MS years
  },

  // ──────────────────────────────── MCh ────────────────────────────────
  {
    id: "mch",
    label: "MCh",
    shortLabel: "MCh",
    color: "#FF3B30",
    isPG: true,
    years: [

      // ─────────────── MCh Neurosurgery ───────────────
      {
        id: "mch-neurosurgery",
        label: "MCh Neurosurgery",
        subjects: [
          {
            id: "mch-neuro-y1", name: "Year 1", color: "#007AFF",
            books: [
              { name: "Rengachary & Ellenbogen Principles of Neurosurgery 3rd Ed", author: "Rengachary & Ellenbogen", publisher: "Elsevier", price: 7999, mrp: 10999, edition: "3rd Ed", featured: true, matchTags: ["Rengachary","neurosurgery"] },
              { name: "Greenberg Handbook of Neurosurgery 9th Ed", author: "Mark Greenberg", publisher: "Thieme", price: 6499, mrp: 8499, edition: "9th Ed", matchTags: ["Greenberg","neurosurgery handbook"] },
              { name: "Netter's Neuroscience 3rd Ed", author: "David Felten", publisher: "Elsevier", price: 4999, mrp: 6699, edition: "3rd Ed", matchTags: ["Netter","neuroscience"] },
              { name: "Neuroanatomy: An Atlas of Structures 9th Ed", author: "Haines & Mihailoff", publisher: "Wolters Kluwer", price: 4499, mrp: 5999, edition: "9th Ed", matchTags: ["neuroanatomy","atlas"] },
            ],
          },
          {
            id: "mch-neuro-y2", name: "Year 2", color: "#007AFF",
            books: [
              { name: "Youmans & Winn Neurological Surgery 7th Ed (4-Vol Set)", author: "Richard Winn", publisher: "Elsevier", price: 22999, mrp: 29999, edition: "7th Ed", featured: true, matchTags: ["Youmans Winn","neurological surgery"] },
              { name: "Operative Neurosurgery 2nd Ed", author: "Cohen, Bhate, Ratliff", publisher: "Thieme", price: 9999, mrp: 13999, edition: "2nd Ed", matchTags: ["operative neurosurgery"] },
              { name: "Spine Surgery (Frymoyer) 3rd Ed", author: "Herkowitz, Garfin, Eismont", publisher: "Elsevier", price: 9999, mrp: 13999, edition: "3rd Ed", matchTags: ["spine surgery","neurosurgery"] },
            ],
          },
          {
            id: "mch-neuro-y3", name: "Year 3", color: "#007AFF",
            books: [
              { name: "Stereotactic & Functional Neurosurgery 5th Ed", author: "Lozano & Gildenberg", publisher: "McGraw-Hill", price: 8999, mrp: 11999, edition: "5th Ed", featured: true, matchTags: ["stereotactic","functional neurosurgery"] },
              { name: "Endovascular Neurosurgery 1st Ed", author: "Jafar, Russell, Woo", publisher: "Thieme", price: 7999, mrp: 10999, edition: "1st Ed", matchTags: ["endovascular neurosurgery"] },
              { name: "Neuro-ICU: Clinical Practice Guide 1st Ed", author: "Badjatia & Mainali", publisher: "Springer", price: 5999, mrp: 7999, edition: "1st Ed", matchTags: ["neuro ICU","neurocritical care"] },
            ],
          },
        ],
      },

      // ─────────────── MCh Cardiothoracic Surgery ───────────────
      {
        id: "mch-cardiothoracic",
        label: "MCh Cardiothoracic Surgery",
        subjects: [
          {
            id: "mch-ctv-y1", name: "Year 1", color: "#FF3B30",
            books: [
              { name: "Sabiston & Spencer Surgery of the Chest 9th Ed", author: "Sellke, del Nido, Swanson", publisher: "Elsevier", price: 9999, mrp: 13999, edition: "9th Ed", featured: true, matchTags: ["Sabiston Spencer","chest surgery","cardiothoracic"] },
              { name: "Cohn's Cardiac Surgery in the Adult 5th Ed", author: "Lawrence Cohn", publisher: "McGraw-Hill", price: 9999, mrp: 13999, edition: "5th Ed", matchTags: ["Cohn","cardiac surgery"] },
              { name: "Thoracic Surgery Clinics (Subscription)", author: "Various", publisher: "Elsevier", price: 3999, mrp: 5299, edition: "Annual", matchTags: ["thoracic surgery","clinics"] },
            ],
          },
          {
            id: "mch-ctv-y2", name: "Year 2", color: "#FF3B30",
            books: [
              { name: "Kirklin/Barratt-Boyes Cardiac Surgery 4th Ed", author: "Kirklin & Blackstone", publisher: "Elsevier", price: 14999, mrp: 19999, edition: "4th Ed", featured: true, matchTags: ["Kirklin","cardiac surgery"] },
              { name: "Atlas of Cardiac Surgery 1st Ed", author: "Sellke & del Nido", publisher: "Cambridge University Press", price: 7999, mrp: 10999, edition: "1st Ed", matchTags: ["atlas cardiac surgery"] },
              { name: "Congenital Heart Disease in Adults 4th Ed", author: "Warnes", publisher: "Elsevier", price: 6999, mrp: 9499, edition: "4th Ed", matchTags: ["congenital heart","adults","cardiology"] },
            ],
          },
          {
            id: "mch-ctv-y3", name: "Year 3", color: "#FF3B30",
            books: [
              { name: "Mechanical Circulatory Support 2nd Ed", author: "Goldstein & Oz", publisher: "Informa Healthcare", price: 6999, mrp: 9499, edition: "2nd Ed", featured: true, matchTags: ["mechanical circulatory support","LVAD"] },
              { name: "Transcatheter Aortic Valve Implantation 2nd Ed", author: "Grube & Laborde", publisher: "Krause & Pachernegg", price: 6999, mrp: 9499, edition: "2nd Ed", matchTags: ["TAVI","transcatheter aortic valve"] },
              { name: "Cardiac Transplantation 2nd Ed", author: "Baumgartner et al.", publisher: "Blackwell", price: 5999, mrp: 7999, edition: "2nd Ed", matchTags: ["cardiac transplantation"] },
            ],
          },
        ],
      },

      // ─────────────── MCh Plastic Surgery ───────────────
      {
        id: "mch-plastic",
        label: "MCh Plastic Surgery",
        subjects: [
          {
            id: "mch-plas-y1", name: "Year 1", color: "#FF9500",
            books: [
              { name: "McCarthy's Plastic Surgery 2nd Ed (8-Vol Set)", author: "Rodríguez, Losee, Neligan", publisher: "Elsevier", price: 22999, mrp: 29999, edition: "2nd Ed", featured: true, matchTags: ["McCarthy","plastic surgery"] },
              { name: "Neligan Plastic Surgery 4th Ed (6-Vol Set)", author: "Peter Neligan", publisher: "Elsevier", price: 22999, mrp: 29999, edition: "4th Ed", matchTags: ["Neligan","plastic surgery"] },
              { name: "Burn Surgery: Reconstruction & Rehabilitation", author: "Spires & Jeng", publisher: "Elsevier", price: 6999, mrp: 9499, edition: "1st Ed", matchTags: ["burn surgery","rehabilitation"] },
            ],
          },
          {
            id: "mch-plas-y2", name: "Year 2", color: "#FF9500",
            books: [
              { name: "Grabb & Smith's Plastic Surgery 8th Ed", author: "Thorne, Chung, Gosain", publisher: "Wolters Kluwer", price: 9999, mrp: 13999, edition: "8th Ed", featured: true, matchTags: ["Grabb Smith","plastic surgery"] },
              { name: "Mathes & Nahai Reconstructive Surgery 2nd Ed (3-Vol)", author: "Mathes & Nahai", publisher: "Elsevier", price: 14999, mrp: 19999, edition: "2nd Ed", matchTags: ["Mathes Nahai","reconstructive surgery"] },
              { name: "Microsurgery: Free Flap Reconstruction 1st Ed", author: "Wei & Mardini", publisher: "Elsevier", price: 7999, mrp: 10999, edition: "1st Ed", matchTags: ["microsurgery","free flap"] },
            ],
          },
          {
            id: "mch-plas-y3", name: "Year 3", color: "#FF9500",
            books: [
              { name: "Craniofacial Surgery 2nd Ed", author: "Wolfe, Berkowitz, Kawamoto", publisher: "Elsevier", price: 9999, mrp: 13999, edition: "2nd Ed", featured: true, matchTags: ["craniofacial surgery"] },
              { name: "Principles & Techniques in Aesthetic Surgery 2nd Ed", author: "Rohrich, Kenkel, Adams", publisher: "Thieme", price: 8999, mrp: 11999, edition: "2nd Ed", matchTags: ["aesthetic surgery","principles"] },
              { name: "Hand Surgery 3rd Ed", author: "Green, Hotchkiss, Pederson", publisher: "Elsevier", price: 9999, mrp: 13999, edition: "3rd Ed", matchTags: ["hand surgery","plastic"] },
            ],
          },
        ],
      },

      // ─────────────── MCh Urology ───────────────
      {
        id: "mch-urology",
        label: "MCh Urology",
        subjects: [
          {
            id: "mch-uro-y1", name: "Year 1", color: "#00C2A8",
            books: [
              { name: "Smith & Tanagho's General Urology 19th Ed", author: "McAninch & Lue", publisher: "McGraw-Hill", price: 5499, mrp: 7299, edition: "19th Ed", featured: true, matchTags: ["Smith Tanagho","urology"] },
              { name: "EAU Guidelines 2024 (Urology)", author: "European Association of Urology", publisher: "EAU", price: 1999, mrp: 2699, edition: "2024 Ed", matchTags: ["EAU guidelines","urology"] },
              { name: "Anatomy for Urological Surgeons 2nd Ed", author: "Mouriquand & Gorduza", publisher: "Springer", price: 4999, mrp: 6699, edition: "2nd Ed", matchTags: ["anatomy","urology","urological surgeons"] },
              { name: "Urological Anatomy Atlas 1st Ed", author: "Hinman & Stempen", publisher: "WB Saunders", price: 3999, mrp: 5299, edition: "1st Ed", matchTags: ["urology","anatomy atlas"] },
            ],
          },
          {
            id: "mch-uro-y2", name: "Year 2", color: "#00C2A8",
            books: [
              { name: "Campbell-Walsh-Wein Urology 12th Ed (4-Vol Set)", author: "Partin, Dmochowski, Kavoussi", publisher: "Elsevier", price: 19999, mrp: 27999, edition: "12th Ed", featured: true, matchTags: ["Campbell Walsh","urology"] },
              { name: "Hinman's Atlas of Urological Surgery 4th Ed", author: "Hinman, Smith, Glassberg", publisher: "Elsevier", price: 9999, mrp: 13999, edition: "4th Ed", matchTags: ["Hinman atlas","urological surgery"] },
              { name: "Laparoscopic & Robot-Assisted Urology 2nd Ed", author: "Stolzenburg et al.", publisher: "Springer", price: 7999, mrp: 10999, edition: "2nd Ed", matchTags: ["laparoscopic","robotic urology"] },
            ],
          },
          {
            id: "mch-uro-y3", name: "Year 3", color: "#00C2A8",
            books: [
              { name: "Robotic Urologic Surgery 3rd Ed", author: "Patel et al.", publisher: "Springer", price: 7999, mrp: 10999, edition: "3rd Ed", featured: true, matchTags: ["robotic urology","Da Vinci"] },
              { name: "Urodynamics Made Easy 4th Ed", author: "Abrams", publisher: "Churchill Livingstone", price: 3999, mrp: 5299, edition: "4th Ed", matchTags: ["urodynamics","urology"] },
              { name: "Reconstructive Urology 1st Ed", author: "Haab & Zimmern", publisher: "Springer", price: 5999, mrp: 7999, edition: "1st Ed", matchTags: ["reconstructive urology","repair"] },
            ],
          },
        ],
      },

      // ─────────────── MCh Paediatric Surgery ───────────────
      {
        id: "mch-paediatric-surgery",
        label: "MCh Paediatric Surgery",
        subjects: [
          {
            id: "mch-ped-y1", name: "Year 1", color: "#34C759",
            books: [
              { name: "O'Neill's Principles of Pediatric Surgery 3rd Ed", author: "Grosfeld, O'Neill, Fonkalsrud", publisher: "Mosby", price: 9999, mrp: 13999, edition: "3rd Ed", featured: true, matchTags: ["O'Neill","pediatric surgery"] },
              { name: "Pediatric Surgical Pathology 3rd Ed", author: "Stocker & Dehner", publisher: "Wolters Kluwer", price: 6999, mrp: 9499, edition: "3rd Ed", matchTags: ["pediatric surgical pathology"] },
              { name: "Basic Sciences for Paediatric Surgery 1st Ed", author: "Spitz & Coran", publisher: "Springer", price: 5999, mrp: 7999, edition: "1st Ed", matchTags: ["basic sciences","paediatric surgery"] },
            ],
          },
          {
            id: "mch-ped-y2", name: "Year 2", color: "#34C759",
            books: [
              { name: "Ashcraft's Pediatric Surgery 7th Ed", author: "Holcomb, Murphy, Ostlie", publisher: "Elsevier", price: 9999, mrp: 13999, edition: "7th Ed", featured: true, matchTags: ["Ashcraft","pediatric surgery"] },
              { name: "Spitz & Coran Operative Pediatric Surgery 7th Ed", author: "Coran, Caldamone, Adzick", publisher: "CRC Press", price: 9999, mrp: 13999, edition: "7th Ed", matchTags: ["Spitz Coran","operative pediatric surgery"] },
              { name: "Pediatric Urology 4th Ed", author: "Gearhart, Rink, Mouriquand", publisher: "Elsevier", price: 7999, mrp: 10999, edition: "4th Ed", matchTags: ["pediatric urology","children"] },
            ],
          },
          {
            id: "mch-ped-y3", name: "Year 3", color: "#34C759",
            books: [
              { name: "Operative Pediatric Surgery 7th Ed (Irwin)", author: "Irwin et al.", publisher: "Springer", price: 7999, mrp: 10999, edition: "7th Ed", featured: true, matchTags: ["operative pediatric surgery"] },
              { name: "Pediatric Minimal Access Surgery 2nd Ed", author: "Bax, Georgeson, Rothenberg", publisher: "Informa Healthcare", price: 5999, mrp: 7999, edition: "2nd Ed", matchTags: ["pediatric","minimal access","laparoscopy"] },
              { name: "Pediatric Liver Transplantation 2nd Ed", author: "Millis & Cronin", publisher: "Informa Healthcare", price: 5999, mrp: 7999, edition: "2nd Ed", matchTags: ["pediatric liver transplant"] },
            ],
          },
        ],
      },

      // ─────────────── MCh Surgical Oncology ───────────────
      {
        id: "mch-surgical-oncology",
        label: "MCh Surgical Oncology",
        subjects: [
          {
            id: "mch-surgo-y1", name: "Year 1", color: "#8E8E93",
            books: [
              { name: "AJCC Cancer Staging Manual 9th Ed", author: "American Joint Committee on Cancer", publisher: "Springer", price: 5999, mrp: 7999, edition: "9th Ed", featured: true, matchTags: ["AJCC","cancer staging"] },
              { name: "NCCN Clinical Practice Guidelines in Oncology 2024", author: "NCCN", publisher: "NCCN", price: 2999, mrp: 3999, edition: "2024 Ed", matchTags: ["NCCN","guidelines","oncology"] },
              { name: "Surgical Pathology of the GI Tract 4th Ed", author: "Goldblum, Lamps, McKenney", publisher: "Elsevier", price: 6999, mrp: 9499, edition: "4th Ed", matchTags: ["GI tract","surgical pathology","oncology"] },
              { name: "Principles of Surgical Oncology 2nd Ed", author: "Bland & Karakousis", publisher: "Springer", price: 5999, mrp: 7999, edition: "2nd Ed", matchTags: ["surgical oncology","principles"] },
            ],
          },
          {
            id: "mch-surgo-y2", name: "Year 2", color: "#8E8E93",
            books: [
              { name: "DeVita Hellman & Rosenberg's Cancer 12th Ed", author: "Devita, Lawrence, Rosenberg", publisher: "Wolters Kluwer", price: 12999, mrp: 17999, edition: "12th Ed", featured: true, matchTags: ["DeVita","cancer","oncology"] },
              { name: "Bland & Copeland The Breast 6th Ed", author: "Bland & Copeland", publisher: "Elsevier", price: 9999, mrp: 13999, edition: "6th Ed", matchTags: ["breast surgery","Bland Copeland"] },
              { name: "Atlas of Surgical Oncology 2nd Ed", author: "Bland, Karakousis, Copeland", publisher: "WB Saunders", price: 7999, mrp: 10999, edition: "2nd Ed", matchTags: ["atlas","surgical oncology"] },
            ],
          },
          {
            id: "mch-surgo-y3", name: "Year 3", color: "#8E8E93",
            books: [
              { name: "Cytoreductive Surgery & HIPEC 2nd Ed", author: "Sugarbaker", publisher: "Ludann", price: 6999, mrp: 9499, edition: "2nd Ed", featured: true, matchTags: ["HIPEC","Sugarbaker","cytoreductive surgery"] },
              { name: "Robotic Surgery in Oncology 1st Ed", author: "Patel & Seer", publisher: "Springer", price: 5999, mrp: 7999, edition: "1st Ed", matchTags: ["robotic surgery","oncology"] },
              { name: "Hepatocellular Carcinoma 2nd Ed", author: "Tang & Poon", publisher: "Springer", price: 5999, mrp: 7999, edition: "2nd Ed", matchTags: ["hepatocellular carcinoma","liver cancer"] },
            ],
          },
        ],
      },

    ],  // end MCh years
  },

  // ──────────────────────────────── DM ─────────────────────────────────
  {
    id: "dm",
    label: "DM",
    shortLabel: "DM",
    color: "#FF9500",
    isPG: true,
    years: [

      // ─────────────── DM Cardiology ───────────────
      {
        id: "dm-cardiology",
        label: "DM Cardiology",
        subjects: [
          {
            id: "dm-cardio-y1", name: "Year 1", color: "#FF3B30",
            books: [
              { name: "Hurst's The Heart 14th Ed (2-Vol Set)", author: "Fuster, Harrington, Narula", publisher: "McGraw-Hill", price: 9999, mrp: 13999, edition: "14th Ed", featured: true, matchTags: ["Hurst","heart","cardiology"] },
              { name: "Chou's Electrocardiography in Clinical Practice 6th Ed", author: "Surawicz & Knilans", publisher: "Elsevier", price: 4999, mrp: 6699, edition: "6th Ed", matchTags: ["ECG","electrocardiography","Chou"] },
              { name: "ESC Textbook of Cardiovascular Medicine 3rd Ed", author: "Camm, Lüscher, Serruys", publisher: "Oxford University Press", price: 9999, mrp: 13999, edition: "3rd Ed", matchTags: ["ESC","cardiovascular medicine"] },
              { name: "Echocardiography Board Review 3rd Ed", author: "Ragavendra Baliga", publisher: "Wiley-Blackwell", price: 3999, mrp: 5299, edition: "3rd Ed", matchTags: ["echo board review","echocardiography"] },
            ],
          },
          {
            id: "dm-cardio-y2", name: "Year 2", color: "#FF3B30",
            books: [
              { name: "Braunwald's Heart Disease 12th Ed (2-Vol Set)", author: "Libby, Bonow, Zipes, Mann", publisher: "Elsevier", price: 14999, mrp: 19999, edition: "12th Ed", featured: true, matchTags: ["Braunwald","heart disease"] },
              { name: "Ellenbogen Cardiac Pacing & ICDs 7th Ed", author: "Ellenbogen, Wilkoff, Kay", publisher: "Wiley-Blackwell", price: 6999, mrp: 9499, edition: "7th Ed", matchTags: ["cardiac pacing","ICD","Ellenbogen"] },
              { name: "Otto's Textbook of Clinical Echocardiography 6th Ed", author: "Catherine Otto", publisher: "Elsevier", price: 5999, mrp: 7999, edition: "6th Ed", matchTags: ["clinical echocardiography","Otto"] },
              { name: "Interventional Cardiology 3rd Ed", author: "Bhatt", publisher: "JP Medical Ltd", price: 7999, mrp: 10999, edition: "3rd Ed", matchTags: ["interventional cardiology","PCI"] },
            ],
          },
          {
            id: "dm-cardio-y3", name: "Year 3", color: "#FF3B30",
            books: [
              { name: "Braunwald's Heart Disease: A Companion Series (Set)", author: "Various", publisher: "Elsevier", price: 9999, mrp: 13999, edition: "Latest Ed", featured: true, matchTags: ["Braunwald companion","heart disease"] },
              { name: "ACC/AHA Clinical Practice Guidelines 2024", author: "ACC/AHA", publisher: "Elsevier", price: 1999, mrp: 2699, edition: "2024 Ed", matchTags: ["ACC AHA guidelines","cardiology"] },
              { name: "Cardio-Oncology 2nd Ed", author: "Fradley & Larsen", publisher: "Springer", price: 5999, mrp: 7999, edition: "2nd Ed", matchTags: ["cardio-oncology","cancer cardiology"] },
            ],
          },
        ],
      },

      // ─────────────── DM Neurology ───────────────
      {
        id: "dm-neurology",
        label: "DM Neurology",
        subjects: [
          {
            id: "dm-neuro-y1", name: "Year 1", color: "#5856D6",
            books: [
              { name: "Hauser's Harrison's Neurology 4th Ed", author: "Stephen Hauser", publisher: "McGraw-Hill", price: 5999, mrp: 7999, edition: "4th Ed", featured: true, matchTags: ["Harrison's neurology","Hauser"] },
              { name: "Merritt's Neurology 13th Ed", author: "Rowland & Pedley", publisher: "Wolters Kluwer", price: 6999, mrp: 9499, edition: "13th Ed", matchTags: ["Merritt","neurology"] },
              { name: "Clinical Neurology 9th Ed", author: "Greenberg, Aminoff, Simon", publisher: "McGraw-Hill", price: 4999, mrp: 6699, edition: "9th Ed", matchTags: ["clinical neurology","Greenberg Aminoff"] },
              { name: "DeJong's The Neurological Examination 7th Ed", author: "Campbell", publisher: "Wolters Kluwer", price: 4999, mrp: 6699, edition: "7th Ed", matchTags: ["neurological examination","DeJong"] },
            ],
          },
          {
            id: "dm-neuro-y2", name: "Year 2", color: "#5856D6",
            books: [
              { name: "Adams & Victor's Principles of Neurology 11th Ed", author: "Ropper, Samuels, Klein", publisher: "McGraw-Hill", price: 7999, mrp: 10999, edition: "11th Ed", featured: true, matchTags: ["Adams Victor","neurology"] },
              { name: "Osborn's Brain: Imaging Diagnosis & Anatomy 3rd Ed", author: "Anne Osborn", publisher: "Elsevier", price: 9999, mrp: 13999, edition: "3rd Ed", matchTags: ["Osborn","brain imaging","neuroradiology"] },
              { name: "Epilepsy: A Comprehensive Textbook 2nd Ed", author: "Engel & Pedley", publisher: "Wolters Kluwer", price: 9999, mrp: 13999, edition: "2nd Ed", matchTags: ["epilepsy","neurology"] },
              { name: "Stroke: Pathophysiology Diagnosis & Management 6th Ed", author: "Grotta, Albers, Broderick", publisher: "Elsevier", price: 8999, mrp: 11999, edition: "6th Ed", matchTags: ["stroke","cerebrovascular"] },
            ],
          },
          {
            id: "dm-neuro-y3", name: "Year 3", color: "#5856D6",
            books: [
              { name: "Movement Disorders 4th Ed", author: "Watts, Bhidayasiri, Bhatt", publisher: "McGraw-Hill", price: 7999, mrp: 10999, edition: "4th Ed", featured: true, matchTags: ["movement disorders","Parkinson","neurology"] },
              { name: "Neurology Secrets 6th Ed", author: "Rolak & Sriram", publisher: "Elsevier", price: 3999, mrp: 5299, edition: "6th Ed", matchTags: ["neurology secrets","Q&A"] },
              { name: "Interventional Neurology 2nd Ed", author: "Chimowitz & Lynn", publisher: "Karger", price: 5999, mrp: 7999, edition: "2nd Ed", matchTags: ["interventional neurology","neurointerventional"] },
            ],
          },
        ],
      },

      // ─────────────── DM Gastroenterology ───────────────
      {
        id: "dm-gastroenterology",
        label: "DM Gastroenterology",
        subjects: [
          {
            id: "dm-gastro-y1", name: "Year 1", color: "#FF9500",
            books: [
              { name: "Makharia & Ahuja's Textbook of Gastroenterology 1st Ed", author: "Govind Makharia", publisher: "Jaypee Brothers", price: 3999, mrp: 5299, edition: "1st Ed", featured: true, matchTags: ["Makharia Ahuja","gastroenterology","India"] },
              { name: "Clinical Gastroenterology & Hepatology 3rd Ed", author: "Feldman, Friedman, Brandt", publisher: "Elsevier", price: 5999, mrp: 7999, edition: "3rd Ed", matchTags: ["clinical gastroenterology","hepatology"] },
              { name: "Pocket Guide to GI Drugs 3rd Ed", author: "Wolfe & Davis", publisher: "Wiley-Blackwell", price: 2499, mrp: 3299, edition: "3rd Ed", matchTags: ["GI drugs","gastroenterology","pocket"] },
            ],
          },
          {
            id: "dm-gastro-y2", name: "Year 2", color: "#FF9500",
            books: [
              { name: "Sleisenger & Fordtran's Gastrointestinal & Liver Disease 11th Ed (2-Vol)", author: "Feldman, Friedman, Brandt", publisher: "Elsevier", price: 12999, mrp: 17999, edition: "11th Ed", featured: true, matchTags: ["Sleisenger Fordtran","GI liver disease"] },
              { name: "Yamada's Textbook of Gastroenterology 6th Ed (2-Vol)", author: "Yamada, Alpers, Kaplowitz", publisher: "Wiley-Blackwell", price: 12999, mrp: 17999, edition: "6th Ed", matchTags: ["Yamada","gastroenterology"] },
              { name: "ERCP 3rd Ed", author: "Baron & Kozarek", publisher: "Elsevier", price: 6999, mrp: 9499, edition: "3rd Ed", matchTags: ["ERCP","endoscopy","gastroenterology"] },
            ],
          },
          {
            id: "dm-gastro-y3", name: "Year 3", color: "#FF9500",
            books: [
              { name: "Hepatology: Diagnosis & Clinical Management 2nd Ed", author: "Jones & Heathcote", publisher: "Wiley-Blackwell", price: 5999, mrp: 7999, edition: "2nd Ed", featured: true, matchTags: ["hepatology","liver","gastroenterology"] },
              { name: "Advanced Therapeutic Endoscopy 2nd Ed", author: "Waye, Rex, Williams", publisher: "Wiley-Blackwell", price: 6999, mrp: 9499, edition: "2nd Ed", matchTags: ["therapeutic endoscopy","GI"] },
              { name: "Liver Transplantation 4th Ed", author: "Maddrey, Schiff, Sorrell", publisher: "Lippincott Williams & Wilkins", price: 7999, mrp: 10999, edition: "4th Ed", matchTags: ["liver transplantation","hepatology"] },
            ],
          },
        ],
      },

      // ─────────────── DM Nephrology ───────────────
      {
        id: "dm-nephrology",
        label: "DM Nephrology",
        subjects: [
          {
            id: "dm-neph-y1", name: "Year 1", color: "#007AFF",
            books: [
              { name: "Comprehensive Clinical Nephrology 6th Ed", author: "Feehally, Floege, Tonelli, Johnson", publisher: "Elsevier", price: 7999, mrp: 10999, edition: "6th Ed", featured: true, matchTags: ["comprehensive nephrology","clinical"] },
              { name: "Pocket Companion to Brenner & Rector's 9th Ed", author: "Rector, Brenner, Bhatt", publisher: "Elsevier", price: 3999, mrp: 5299, edition: "9th Ed", matchTags: ["Brenner Rector","pocket","nephrology"] },
              { name: "Dialysis Therapy 3rd Ed", author: "Nissenson & Fine", publisher: "Hanley & Belfus", price: 4999, mrp: 6699, edition: "3rd Ed", matchTags: ["dialysis","renal replacement therapy"] },
            ],
          },
          {
            id: "dm-neph-y2", name: "Year 2", color: "#007AFF",
            books: [
              { name: "Brenner & Rector's The Kidney 11th Ed (2-Vol Set)", author: "Yu, Chertow, Luyckx", publisher: "Elsevier", price: 14999, mrp: 19999, edition: "11th Ed", featured: true, matchTags: ["Brenner Rector","kidney"] },
              { name: "Schrier's Diseases of the Kidney 9th Ed", author: "Coffman, Falk, Molitoris", publisher: "Wolters Kluwer", price: 9999, mrp: 13999, edition: "9th Ed", matchTags: ["Schrier","kidney diseases"] },
              { name: "Continuous Renal Replacement Therapy 2nd Ed", author: "Ronco, Bellomo, Kellum", publisher: "Oxford University Press", price: 5999, mrp: 7999, edition: "2nd Ed", matchTags: ["CRRT","continuous renal replacement"] },
            ],
          },
          {
            id: "dm-neph-y3", name: "Year 3", color: "#007AFF",
            books: [
              { name: "Kidney Transplantation 9th Ed", author: "Morris & Lechler", publisher: "Elsevier", price: 7999, mrp: 10999, edition: "9th Ed", featured: true, matchTags: ["kidney transplant","nephrology"] },
              { name: "Nephrology Secrets 4th Ed", author: "Lerma, Sparks, Topf", publisher: "Elsevier", price: 3999, mrp: 5299, edition: "4th Ed", matchTags: ["nephrology secrets","Q&A"] },
              { name: "Renal Pathology with Clinical & Functional Correlations 3rd Ed", author: "Tisher & Brenner", publisher: "JP Lippincott", price: 6999, mrp: 9499, edition: "3rd Ed", matchTags: ["renal pathology","nephrology"] },
            ],
          },
        ],
      },

      // ─────────────── DM Endocrinology ───────────────
      {
        id: "dm-endocrinology",
        label: "DM Endocrinology",
        subjects: [
          {
            id: "dm-endo-y1", name: "Year 1", color: "#00C2A8",
            books: [
              { name: "Greenspan's Basic & Clinical Endocrinology 10th Ed", author: "Gardner & Shoback", publisher: "McGraw-Hill", price: 5999, mrp: 7999, edition: "10th Ed", featured: true, matchTags: ["Greenspan","endocrinology"] },
              { name: "Werner & Ingbar's The Thyroid 10th Ed", author: "Braverman & Cooper", publisher: "Wolters Kluwer", price: 7999, mrp: 10999, edition: "10th Ed", matchTags: ["Werner Ingbar","thyroid","endocrinology"] },
              { name: "Joslin's Diabetes Mellitus 14th Ed", author: "Kahn et al.", publisher: "Wolters Kluwer", price: 6999, mrp: 9499, edition: "14th Ed", matchTags: ["Joslin's","diabetes mellitus"] },
            ],
          },
          {
            id: "dm-endo-y2", name: "Year 2", color: "#00C2A8",
            books: [
              { name: "Williams Textbook of Endocrinology 14th Ed", author: "Melmed, Auchus, Goldfine", publisher: "Elsevier", price: 9999, mrp: 13999, edition: "14th Ed", featured: true, matchTags: ["Williams","endocrinology"] },
              { name: "Jameson & DeGroot Endocrinology 7th Ed (3-Vol Set)", author: "Jameson, DeGroot, de Kretser", publisher: "Elsevier", price: 14999, mrp: 19999, edition: "7th Ed", matchTags: ["Jameson DeGroot","endocrinology"] },
              { name: "Thyroid Ultrasound & Ultrasound-Guided FNA 4th Ed", author: "Baskin & Duick", publisher: "Springer", price: 5999, mrp: 7999, edition: "4th Ed", matchTags: ["thyroid ultrasound","FNA","endocrinology"] },
            ],
          },
          {
            id: "dm-endo-y3", name: "Year 3", color: "#00C2A8",
            books: [
              { name: "ADA Standards of Medical Care in Diabetes 2025", author: "American Diabetes Association", publisher: "ADA", price: 1499, mrp: 1999, edition: "2025 Ed", featured: true, matchTags: ["ADA","diabetes standards","guidelines"] },
              { name: "Endocrinology Secrets 6th Ed", author: "Pertsemlidis & Kase", publisher: "Elsevier", price: 3499, mrp: 4799, edition: "6th Ed", matchTags: ["endocrinology secrets","Q&A"] },
              { name: "Pediatric Endocrinology 5th Ed", author: "Sperling", publisher: "Elsevier", price: 7999, mrp: 10999, edition: "5th Ed", matchTags: ["pediatric endocrinology","children"] },
            ],
          },
        ],
      },

      // ─────────────── DM Pulmonology ───────────────
      {
        id: "dm-pulmonology",
        label: "DM Pulmonology",
        subjects: [
          {
            id: "dm-pulmo-y1", name: "Year 1", color: "#636366",
            books: [
              { name: "GOLD COPD Report 2024", author: "Global Initiative for COPD", publisher: "GOLD", price: 999, mrp: 1499, edition: "2024 Ed", featured: true, matchTags: ["GOLD","COPD","guidelines"] },
              { name: "GINA Asthma Management & Prevention 2024", author: "Global Initiative for Asthma", publisher: "GINA", price: 999, mrp: 1499, edition: "2024 Ed", matchTags: ["GINA","asthma","guidelines"] },
              { name: "Clinical Respiratory Medicine 5th Ed", author: "Spiro, Silvestri, Agusti", publisher: "Elsevier", price: 7999, mrp: 10999, edition: "5th Ed", matchTags: ["clinical respiratory medicine","pulmonology"] },
              { name: "Pulmonary Physiology 9th Ed", author: "Michael Levitzky", publisher: "McGraw-Hill", price: 3999, mrp: 5299, edition: "9th Ed", matchTags: ["pulmonary physiology","respiratory"] },
            ],
          },
          {
            id: "dm-pulmo-y2", name: "Year 2", color: "#636366",
            books: [
              { name: "Murray & Nadel's Textbook of Respiratory Medicine 7th Ed (2-Vol)", author: "Broaddus, Ernst, King", publisher: "Elsevier", price: 12999, mrp: 17999, edition: "7th Ed", featured: true, matchTags: ["Murray Nadel","respiratory medicine"] },
              { name: "Fishman's Pulmonary Diseases & Disorders 5th Ed (2-Vol)", author: "Grippi, Elias, Fishman", publisher: "McGraw-Hill", price: 12999, mrp: 17999, edition: "5th Ed", matchTags: ["Fishman","pulmonary diseases"] },
              { name: "Flexible Bronchoscopy 4th Ed", author: "Ko & Lee", publisher: "Wiley-Blackwell", price: 5999, mrp: 7999, edition: "4th Ed", matchTags: ["bronchoscopy","flexible"] },
            ],
          },
          {
            id: "dm-pulmo-y3", name: "Year 3", color: "#636366",
            books: [
              { name: "Principles of Pulmonary Medicine 7th Ed", author: "Weinberger, Cockrill, Mandel", publisher: "Elsevier", price: 4499, mrp: 5999, edition: "7th Ed", featured: true, matchTags: ["pulmonary medicine","principles"] },
              { name: "Lung Transplantation 2nd Ed", author: "Vigneswaran & Garrity", publisher: "Informa Healthcare", price: 5999, mrp: 7999, edition: "2nd Ed", matchTags: ["lung transplant","pulmonology"] },
              { name: "Sleep Medicine 3rd Ed", author: "Kryger, Roth, Goldstein", publisher: "Elsevier", price: 6999, mrp: 9499, edition: "3rd Ed", matchTags: ["sleep medicine","polysomnography"] },
            ],
          },
        ],
      },

      // ─────────────── DM Haematology ───────────────
      {
        id: "dm-haematology",
        label: "DM Haematology",
        subjects: [
          {
            id: "dm-haem-y1", name: "Year 1", color: "#FF2D55",
            books: [
              { name: "Hoffbrand's Essential Haematology 8th Ed", author: "Hoffbrand & Steensma", publisher: "Wiley-Blackwell", price: 4499, mrp: 5999, edition: "8th Ed", featured: true, matchTags: ["Hoffbrand","haematology"] },
              { name: "Lee's Synopsis of Haematology 2nd Ed", author: "McCann, Marshall, Lloyd", publisher: "Arnold", price: 4999, mrp: 6699, edition: "2nd Ed", matchTags: ["Lee","synopsis haematology"] },
              { name: "Blood Transfusion in Clinical Practice 2nd Ed", author: "Tovey", publisher: "Blackwell Scientific", price: 3999, mrp: 5299, edition: "2nd Ed", matchTags: ["blood transfusion","haematology"] },
            ],
          },
          {
            id: "dm-haem-y2", name: "Year 2", color: "#FF2D55",
            books: [
              { name: "Williams Hematology 10th Ed", author: "Kaushansky, Lichtman, Prchal", publisher: "McGraw-Hill", price: 9999, mrp: 13999, edition: "10th Ed", featured: true, matchTags: ["Williams","hematology"] },
              { name: "Wintrobe's Clinical Hematology 14th Ed (2-Vol)", author: "Greer, Arber, Glader", publisher: "Wolters Kluwer", price: 12999, mrp: 17999, edition: "14th Ed", matchTags: ["Wintrobe","clinical hematology"] },
              { name: "Bone Marrow Pathology 4th Ed", author: "Clark, Foucar, Orazi", publisher: "Wiley-Blackwell", price: 6999, mrp: 9499, edition: "4th Ed", matchTags: ["bone marrow","pathology","haematology"] },
            ],
          },
          {
            id: "dm-haem-y3", name: "Year 3", color: "#FF2D55",
            books: [
              { name: "Hematopoietic Cell Transplantation 5th Ed", author: "Forman, Negrin, Antin", publisher: "Wiley-Blackwell", price: 9999, mrp: 13999, edition: "5th Ed", featured: true, matchTags: ["hematopoietic","stem cell transplant","BMT"] },
              { name: "Haematology at a Glance 5th Ed", author: "Mehta & Hoffbrand", publisher: "Wiley-Blackwell", price: 2999, mrp: 3999, edition: "5th Ed", matchTags: ["haematology at a glance","revision"] },
              { name: "EHA-ESMO Guidelines: Haematological Malignancies 2024", author: "EHA/ESMO", publisher: "Elsevier", price: 1999, mrp: 2699, edition: "2024 Ed", matchTags: ["EHA","ESMO","haematology guidelines"] },
            ],
          },
        ],
      },

      // ─────────────── DM Rheumatology ───────────────
      {
        id: "dm-rheumatology",
        label: "DM Rheumatology",
        subjects: [
          {
            id: "dm-rheum-y1", name: "Year 1", color: "#34C759",
            books: [
              { name: "Oxford Textbook of Rheumatology 4th Ed", author: "Isenberg, Maddison, Woo", publisher: "Oxford University Press", price: 9999, mrp: 13999, edition: "4th Ed", featured: true, matchTags: ["Oxford","rheumatology"] },
              { name: "Dubois' Lupus Erythematosus & Related Syndromes 9th Ed", author: "Wallace & Hahn", publisher: "Elsevier", price: 8999, mrp: 11999, edition: "9th Ed", matchTags: ["Dubois","lupus","SLE","rheumatology"] },
              { name: "Rheumatology Secrets 4th Ed", author: "West", publisher: "Elsevier", price: 3999, mrp: 5299, edition: "4th Ed", matchTags: ["rheumatology secrets","Q&A"] },
            ],
          },
          {
            id: "dm-rheum-y2", name: "Year 2", color: "#34C759",
            books: [
              { name: "Firestein & Kelley's Textbook of Rheumatology 11th Ed (2-Vol)", author: "Firestein, Budd, Gabriel", publisher: "Elsevier", price: 14999, mrp: 19999, edition: "11th Ed", featured: true, matchTags: ["Firestein Kelley","rheumatology"] },
              { name: "Hochberg's Rheumatology 8th Ed (2-Vol)", author: "Hochberg, Gravallese, Silman", publisher: "Elsevier", price: 12999, mrp: 17999, edition: "8th Ed", matchTags: ["Hochberg","rheumatology"] },
              { name: "Musculoskeletal Ultrasound in Rheumatology 2nd Ed", author: "Backhaus & Bruyn", publisher: "Thieme", price: 5999, mrp: 7999, edition: "2nd Ed", matchTags: ["musculoskeletal ultrasound","rheumatology"] },
            ],
          },
          {
            id: "dm-rheum-y3", name: "Year 3", color: "#34C759",
            books: [
              { name: "EULAR Recommendations 2024 (Full Set)", author: "EULAR", publisher: "BMJ Publishing", price: 1999, mrp: 2699, edition: "2024 Ed", featured: true, matchTags: ["EULAR","recommendations","rheumatology"] },
              { name: "Myositis & Idiopathic Inflammatory Myopathies 2nd Ed", author: "Dalakas", publisher: "Elsevier", price: 5999, mrp: 7999, edition: "2nd Ed", matchTags: ["myositis","inflammatory myopathy","rheumatology"] },
              { name: "Ankylosing Spondylitis & the Spondyloarthropathies 1st Ed", author: "Calin & Taurog", publisher: "Mosby", price: 4999, mrp: 6699, edition: "1st Ed", matchTags: ["ankylosing spondylitis","spondyloarthropathy"] },
            ],
          },
        ],
      },

      // ─────────────── DM Medical Oncology ───────────────
      {
        id: "dm-medical-oncology",
        label: "DM Medical Oncology",
        subjects: [
          {
            id: "dm-onco-y1", name: "Year 1", color: "#8E8E93",
            books: [
              { name: "NCCN Clinical Practice Guidelines in Oncology 2025", author: "NCCN", publisher: "NCCN", price: 2999, mrp: 3999, edition: "2025 Ed", featured: true, matchTags: ["NCCN","guidelines","oncology"] },
              { name: "Oxford American Oncology Library Handbook", author: "Oxford", publisher: "Oxford University Press", price: 3999, mrp: 5299, edition: "2024 Ed", matchTags: ["Oxford","oncology","handbook"] },
              { name: "Clinical Oncology (Abeloff) 6th Ed", author: "Niederhuber, Armitage, Doroshow", publisher: "Elsevier", price: 9999, mrp: 13999, edition: "6th Ed", matchTags: ["Abeloff","clinical oncology"] },
            ],
          },
          {
            id: "dm-onco-y2", name: "Year 2", color: "#8E8E93",
            books: [
              { name: "DeVita Hellman & Rosenberg's Cancer 12th Ed", author: "Devita, Lawrence, Rosenberg", publisher: "Wolters Kluwer", price: 12999, mrp: 17999, edition: "12th Ed", featured: true, matchTags: ["DeVita","cancer","oncology"] },
              { name: "Holland-Frei Cancer Medicine 9th Ed", author: "Bast, Hait, Hong", publisher: "Wiley-Blackwell", price: 9999, mrp: 13999, edition: "9th Ed", matchTags: ["Holland Frei","cancer medicine"] },
              { name: "Cancer Immunotherapy 3rd Ed", author: "Kaufman & Wolchok", publisher: "Academic Press", price: 7999, mrp: 10999, edition: "3rd Ed", matchTags: ["cancer immunotherapy","immunology"] },
            ],
          },
          {
            id: "dm-onco-y3", name: "Year 3", color: "#8E8E93",
            books: [
              { name: "Molecular Oncology: Causes of Cancer & Targets for Treatment 2nd Ed", author: "Bradshaw & Dennis", publisher: "Cambridge University Press", price: 6999, mrp: 9499, edition: "2nd Ed", featured: true, matchTags: ["molecular oncology","targeted therapy"] },
              { name: "Palliative Care Formulary 8th Ed", author: "Twycross, Wilcock, Howard", publisher: "Pharmaceutical Press", price: 4999, mrp: 6699, edition: "8th Ed", matchTags: ["palliative care","oncology","formulary"] },
              { name: "Targeted Therapies in Oncology 3rd Ed", author: "Giaccone & Soria", publisher: "CRC Press", price: 6999, mrp: 9499, edition: "3rd Ed", matchTags: ["targeted therapy","precision oncology"] },
            ],
          },
        ],
      },

    ],  // end DM years
  },

  // ──────────────────────────────── DNB ─────────────────────────────────
  {
    id: "dnb",
    label: "DNB / Fellowship",
    shortLabel: "DNB",
    color: "#34C759",
    years: [
      // ── DNB Year 1 ──────────────────────────────────────────────────
      {
        id: "dnb-year1",
        label: "Year 1",
        subjects: [
          {
            id: "dnb-y1-entrance",
            name: "DNB CET Entrance Preparation",
            color: "#34C759",
            books: [
              { name: "DNB Theory Question Bank Medicine 5th Ed", author: "Somen Das", publisher: "Paras Medical Publisher", price: 1999, mrp: 2499, edition: "5th Ed", featured: true, matchTags: ["DNB","question bank","medicine"] },
              { name: "DNB Theory Question Bank Surgery 4th Ed", author: "Somen Das", publisher: "Paras Medical Publisher", price: 1999, mrp: 2499, edition: "4th Ed", matchTags: ["DNB","question bank","surgery"] },
              { name: "Across DNB Entrance MCQ Guide 3rd Ed", author: "Ramesh Babu", publisher: "Jaypee Brothers", price: 1799, mrp: 2299, edition: "3rd Ed", matchTags: ["Across DNB","MCQ"] },
              { name: "Review for DNB CET Examination by Somen Das", author: "Somen Das", publisher: "Paras Medical Publisher", price: 2499, mrp: 3199, edition: "2nd Ed", matchTags: ["DNB","CET","review"] },
            ],
          },
          {
            id: "dnb-y1-neetpg",
            name: "NEET-PG / Entrance Preparation",
            color: "#007AFF",
            books: [
              { name: "Across NEET-PG (Revision Guide)", author: "Ramesh Babu", publisher: "Jaypee Brothers", price: 2499, mrp: 3299, edition: "5th Ed", featured: true, forExam: ["NEET-PG"], matchTags: ["Across","NEET-PG"] },
              { name: "NEET-PG Previous Year Questions 2023–2018", author: "Amit Ashish", publisher: "Jaypee Brothers", price: 1999, mrp: 2499, edition: "2024 Ed", forExam: ["NEET-PG"], matchTags: ["NEET-PG","previous year","MCQ"] },
              { name: "Marrow QBank NEET-PG Notes (Complete Set)", author: "Marrow Education", publisher: "Marrow", price: 3999, mrp: 5499, edition: "2024 Ed", forExam: ["NEET-PG"], matchTags: ["Marrow","NEET-PG","notes"] },
              { name: "Pathoma: Fundamentals of Pathology 2023 Ed", author: "Husain Sattar", publisher: "Pathoma LLC", price: 2999, mrp: 3999, edition: "2023 Ed", forExam: ["USMLE","NEET-PG"], matchTags: ["Pathoma","pathology"] },
            ],
          },
          {
            id: "dnb-y1-foundation",
            name: "Research & Foundation",
            color: "#636366",
            books: [
              { name: "ICMR Guidelines for Biomedical Research 2017", author: "ICMR", publisher: "ICMR Publications", price: 499, mrp: 699, edition: "2017 Ed", featured: true, matchTags: ["ICMR","research","ethics"] },
              { name: "Biostatistics for Medical & Nursing Students 2nd Ed", author: "Indra Prakash", publisher: "Jaypee Brothers", price: 799, mrp: 1099, edition: "2nd Ed", matchTags: ["biostatistics","nursing","Indra Prakash"] },
              { name: "Evidence Based Medicine & Clinical Research 3rd Ed", author: "Vijay Kumar", publisher: "CBS Publishers", price: 1299, mrp: 1799, edition: "3rd Ed", matchTags: ["evidence based medicine","clinical research","Vijay Kumar"] },
            ],
          },
        ],
      },

      // ── DNB Year 2 ──────────────────────────────────────────────────
      {
        id: "dnb-year2",
        label: "Year 2",
        subjects: [
          {
            id: "dnb-y2-specialty",
            name: "Core Specialty Textbooks",
            color: "#34C759",
            books: [
              { name: "API Textbook of Medicine 11th Ed", author: "Siddharth Shah", publisher: "Jaypee Brothers", price: 5999, mrp: 7999, edition: "11th Ed", featured: true, matchTags: ["API","medicine","India"] },
              { name: "Bailey & Love's Short Practice of Surgery 27th Ed", author: "Williams, O'Connell, McCaskie", publisher: "Taylor & Francis", price: 5499, mrp: 7499, edition: "27th Ed", matchTags: ["Bailey Love","surgery"] },
              { name: "Harrison's Principles of Internal Medicine 21st Ed (2-Vol Set)", author: "Loscalzo, Fauci, Kasper", publisher: "McGraw-Hill", price: 8999, mrp: 12999, edition: "21st Ed", matchTags: ["Harrison","Internal Medicine"] },
              { name: "Williams Obstetrics 26th Ed", author: "Cunningham, Leveno, Dashe", publisher: "McGraw-Hill", price: 8999, mrp: 11999, edition: "26th Ed", matchTags: ["Williams","obstetrics"] },
              { name: "Kanski's Clinical Ophthalmology 9th Ed", author: "Brad Bowling", publisher: "Elsevier", price: 6499, mrp: 8999, edition: "9th Ed", matchTags: ["Kanski","ophthalmology"] },
            ],
          },
          {
            id: "dnb-y2-clinical",
            name: "Clinical Skills & Procedures",
            color: "#007AFF",
            books: [
              { name: "Macleod's Clinical Examination 15th Ed", author: "Innes, Dover, Fairhurst", publisher: "Elsevier", price: 3999, mrp: 5299, edition: "15th Ed", featured: true, matchTags: ["Macleod","clinical examination"] },
              { name: "Oxford Handbook of Clinical Medicine 11th Ed", author: "Forde, Paramothayan, Roberts", publisher: "Oxford University Press", price: 2999, mrp: 3999, edition: "11th Ed", matchTags: ["Oxford handbook","clinical medicine"] },
              { name: "Kumar & Clark's Clinical Medicine 10th Ed", author: "Adam Feather", publisher: "Elsevier", price: 4999, mrp: 6699, edition: "10th Ed", matchTags: ["Kumar Clark","clinical medicine"] },
              { name: "Churchill's Pocketbook of Medicine 5th Ed", author: "Edwards & Bouchier", publisher: "Churchill Livingstone", price: 1999, mrp: 2699, edition: "5th Ed", matchTags: ["Churchill's","pocketbook","medicine"] },
            ],
          },
          {
            id: "dnb-y2-usmle",
            name: "USMLE Step Preparation",
            color: "#5856D6",
            books: [
              { name: "First Aid for the USMLE Step 1 2024 Ed", author: "Tao Le & Vikas Bhushan", publisher: "McGraw-Hill", price: 3499, mrp: 4799, edition: "2024 Ed", featured: true, forExam: ["USMLE"], matchTags: ["First Aid","USMLE","Step 1"] },
              { name: "USMLE Step 1 Lecture Notes 7-Book Set by Kaplan", author: "Kaplan Medical", publisher: "Kaplan Publishing", price: 5499, mrp: 7499, edition: "2024 Ed", forExam: ["USMLE"], matchTags: ["Kaplan","USMLE"] },
              { name: "First Aid for the USMLE Step 2 CK 12th Ed", author: "Tao Le & Vikas Bhushan", publisher: "McGraw-Hill", price: 3499, mrp: 4799, edition: "2024 Ed", forExam: ["USMLE"], matchTags: ["First Aid","USMLE","Step 2"] },
              { name: "Kaplan USMLE Step 2 CK Lecture Notes 5-Book Set", author: "Kaplan Medical", publisher: "Kaplan Publishing", price: 4999, mrp: 6699, edition: "2024 Ed", forExam: ["USMLE"], matchTags: ["Kaplan","USMLE","Step 2"] },
            ],
          },
        ],
      },

      // ── DNB Year 3 ──────────────────────────────────────────────────
      {
        id: "dnb-year3",
        label: "Year 3",
        subjects: [
          {
            id: "dnb-y3-exit",
            name: "DNB Exit Exam Preparation",
            color: "#34C759",
            books: [
              { name: "DNB Exit Theory Questions & Answers Medicine 3rd Ed", author: "Vivek Jain", publisher: "Dhanpat Rai", price: 1999, mrp: 2699, edition: "3rd Ed", featured: true, matchTags: ["DNB exit","theory questions","medicine"] },
              { name: "DNB Exit Theory Questions Surgery 2nd Ed", author: "Somen Das", publisher: "Paras Medical Publisher", price: 1999, mrp: 2699, edition: "2nd Ed", matchTags: ["DNB exit","surgery","theory"] },
              { name: "Practical Examination for DNB 3rd Ed", author: "NK Choudhary", publisher: "CBS Publishers", price: 1499, mrp: 1999, edition: "3rd Ed", matchTags: ["DNB","practical examination","Choudhary"] },
              { name: "DNB Handbook (Practical & Theory Prep) 2024 Ed", author: "Various", publisher: "Jaypee Brothers", price: 1799, mrp: 2499, edition: "2024 Ed", matchTags: ["DNB handbook","practical theory prep"] },
            ],
          },
          {
            id: "dnb-y3-advanced",
            name: "Advanced Specialty & Fellowship",
            color: "#007AFF",
            books: [
              { name: "Oxford Handbook of General Practice 5th Ed", author: "Longmore, Wilkinson, Baldwin", publisher: "Oxford University Press", price: 2499, mrp: 3299, edition: "5th Ed", featured: true, matchTags: ["Oxford handbook","general practice"] },
              { name: "Washington Manual of Medical Therapeutics 37th Ed", author: "Brent Foster et al.", publisher: "Wolters Kluwer", price: 3999, mrp: 5299, edition: "37th Ed", matchTags: ["Washington Manual","therapeutics"] },
              { name: "Sabiston Textbook of Surgery 21st Ed", author: "Townsend, Beauchamp, Evers", publisher: "Elsevier", price: 9999, mrp: 13999, edition: "21st Ed", matchTags: ["Sabiston","surgery"] },
            ],
          },
          {
            id: "dnb-y3-research",
            name: "Research & Thesis Support",
            color: "#636366",
            books: [
              { name: "How to Write & Publish a Scientific Paper 9th Ed", author: "Robert Day & Barbara Gastel", publisher: "Cambridge University Press", price: 2999, mrp: 3999, edition: "9th Ed", featured: true, matchTags: ["scientific paper","publish","research writing"] },
              { name: "Systematic Reviews in Healthcare 2nd Ed", author: "Egger, Davey Smith, Altman", publisher: "BMJ Books", price: 3499, mrp: 4799, edition: "2nd Ed", matchTags: ["systematic review","meta-analysis","healthcare"] },
              { name: "SPSS Survival Manual 7th Ed", author: "Julie Pallant", publisher: "Open University Press", price: 2499, mrp: 3299, edition: "7th Ed", matchTags: ["SPSS","statistics","manual","Pallant"] },
            ],
          },
        ],
      },
    ],
  },
];

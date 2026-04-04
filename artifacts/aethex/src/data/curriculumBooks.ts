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
    years: [
      {
        id: "md-medicine",
        label: "MD Medicine",
        subjects: [
          {
            id: "md-int-medicine",
            name: "Internal Medicine",
            color: "#007AFF",
            books: [
              { name: "Harrison's Principles of Internal Medicine 21st Ed (2-Vol Set)", author: "Loscalzo, Fauci, Kasper", publisher: "McGraw-Hill", price: 8999, mrp: 12999, edition: "21st Ed", featured: true, matchTags: ["Harrison","Internal Medicine"] },
              { name: "Oxford Textbook of Medicine 6th Ed", author: "Warrell, Cox, Firth", publisher: "Oxford University Press", price: 19999, mrp: 24999, edition: "6th Ed", matchTags: ["Oxford Textbook","Medicine"] },
              { name: "Ferri's Clinical Advisor 2025", author: "Fred Ferri", publisher: "Elsevier", price: 5999, mrp: 7999, edition: "2025 Ed", matchTags: ["Ferri","clinical advisor"] },
              { name: "API Textbook of Medicine 11th Ed", author: "Siddharth Shah", publisher: "Jaypee Brothers", price: 5999, mrp: 7999, edition: "11th Ed", matchTags: ["API","medicine","India"] },
              { name: "Talley & O'Connor Clinical Examination 8th Ed", author: "Nicholas Talley", publisher: "Elsevier", price: 4999, mrp: 6699, edition: "8th Ed", matchTags: ["Talley O'Connor","clinical examination"] },
            ],
          },
        ],
      },
      {
        id: "md-pathology",
        label: "MD Pathology",
        subjects: [
          {
            id: "md-path",
            name: "Pathology",
            color: "#FF3B30",
            books: [
              { name: "Robbins & Cotran Pathologic Basis of Disease 10th Ed", author: "Kumar, Abbas, Aster", publisher: "Elsevier", price: 7499, mrp: 9999, edition: "10th Ed", featured: true, matchTags: ["Robbins","pathology"] },
              { name: "Sternberg's Diagnostic Surgical Pathology 7th Ed", author: "Mills et al.", publisher: "Wolters Kluwer", price: 12999, mrp: 17999, edition: "7th Ed", matchTags: ["Sternberg","pathology"] },
              { name: "Rosai & Ackerman's Surgical Pathology 11th Ed", author: "Rosai", publisher: "Elsevier", price: 14999, mrp: 19999, edition: "11th Ed", matchTags: ["Rosai Ackerman","surgical pathology"] },
              { name: "Bancroft's Theory & Practice of Histological Techniques 8th Ed", author: "Suvarna, Layton & Bancroft", publisher: "Elsevier", price: 7999, mrp: 10999, edition: "8th Ed", matchTags: ["Bancroft","histology"] },
              { name: "WHO Classification of Tumours 5th Ed Series", author: "WHO", publisher: "IARC Press", price: 6999, mrp: 9499, edition: "5th Ed", matchTags: ["WHO","tumours","cancer classification"] },
            ],
          },
        ],
      },
      {
        id: "md-pharmacology",
        label: "MD Pharmacology",
        subjects: [
          {
            id: "md-pharm",
            name: "Pharmacology",
            color: "#FF9500",
            books: [
              { name: "Goodman & Gilman's Pharmacological Basis of Therapeutics 14th Ed", author: "Brunton, Knollmann", publisher: "McGraw-Hill", price: 9499, mrp: 12999, edition: "14th Ed", featured: true, matchTags: ["Goodman Gilman","pharmacology"] },
              { name: "Katzung Basic & Clinical Pharmacology 16th Ed", author: "Bertram Katzung", publisher: "McGraw-Hill", price: 5999, mrp: 7999, edition: "16th Ed", matchTags: ["Katzung","pharmacology"] },
              { name: "Stahl's Essential Psychopharmacology 5th Ed", author: "Stephen M Stahl", publisher: "Cambridge University Press", price: 4999, mrp: 6999, edition: "5th Ed", matchTags: ["Stahl","psychopharmacology"] },
              { name: "Bertram & Trevor's Pharmacology Examination & Board Review 13th Ed", author: "Bertram Katzung", publisher: "McGraw-Hill", price: 3499, mrp: 4799, edition: "13th Ed", matchTags: ["Bertram Trevor","pharmacology","review"] },
            ],
          },
        ],
      },
      {
        id: "md-microbiology",
        label: "MD Microbiology",
        subjects: [
          {
            id: "md-micro",
            name: "Microbiology",
            color: "#00C2A8",
            books: [
              { name: "Mandell Douglas & Bennett's Infectious Diseases 9th Ed", author: "Bennett, Dolin, Blaser", publisher: "Elsevier", price: 14999, mrp: 19999, edition: "9th Ed", featured: true, matchTags: ["Mandell","infectious diseases"] },
              { name: "Topley & Wilson's Microbiology & Microbial Infections", author: "Borriello, Murray, Funke", publisher: "Hodder Arnold", price: 19999, mrp: 24999, edition: "11th Ed", matchTags: ["Topley Wilson","microbiology"] },
              { name: "Murray's Manual of Clinical Microbiology 13th Ed", author: "Carroll, Pfaller, Landry", publisher: "ASM Press", price: 9999, mrp: 13499, edition: "13th Ed", matchTags: ["Murray","clinical microbiology"] },
            ],
          },
        ],
      },
      {
        id: "md-radiology",
        label: "MD Radiology",
        subjects: [
          {
            id: "md-radio",
            name: "Radiodiagnosis",
            color: "#636366",
            books: [
              { name: "Grainger & Allison's Diagnostic Radiology 6th Ed", author: "Gillard, Waldman, Donoghue", publisher: "Elsevier", price: 14999, mrp: 19999, edition: "6th Ed", featured: true, matchTags: ["Grainger Allison","radiology"] },
              { name: "Sutton's Textbook of Radiology & Imaging 7th Ed", author: "David Sutton", publisher: "Churchill Livingstone", price: 7999, mrp: 10999, edition: "7th Ed", matchTags: ["Sutton","radiology"] },
              { name: "Diagnostic Ultrasound by Rumack Wilson 5th Ed", author: "Carol Rumack", publisher: "Elsevier", price: 8999, mrp: 11999, edition: "5th Ed", matchTags: ["Rumack","ultrasound","radiology"] },
              { name: "MRI in Clinical Practice 3rd Ed", author: "Gary Liney", publisher: "Springer", price: 5999, mrp: 7999, edition: "3rd Ed", matchTags: ["MRI","radiology"] },
              { name: "CT Teaching Manual 4th Ed", author: "Matthias Hofer", publisher: "Thieme", price: 4999, mrp: 6499, edition: "4th Ed", matchTags: ["CT","teaching manual","radiology"] },
              { name: "Dahnert's Radiology Review Manual 8th Ed", author: "Wolfgang Dahnert", publisher: "Wolters Kluwer", price: 5999, mrp: 7999, edition: "8th Ed", matchTags: ["Dahnert","radiology review"] },
            ],
          },
        ],
      },
      {
        id: "md-anaesthesia",
        label: "MD Anaesthesia",
        subjects: [
          {
            id: "md-anaes",
            name: "Anaesthesiology",
            color: "#8E8E93",
            books: [
              { name: "Miller's Anaesthesia 9th Ed (2-Vol)", author: "Michael Gropper", publisher: "Elsevier", price: 12999, mrp: 17999, edition: "9th Ed", featured: true, matchTags: ["Miller","anaesthesia"] },
              { name: "Morgan & Mikhail's Clinical Anesthesiology 6th Ed", author: "Butterworth, Mackey, Wasnick", publisher: "McGraw-Hill", price: 5499, mrp: 7299, edition: "6th Ed", matchTags: ["Morgan Mikhail","anaesthesia"] },
              { name: "Nunn's Applied Respiratory Physiology 8th Ed", author: "Andrew Lumb", publisher: "Elsevier", price: 6999, mrp: 9299, edition: "8th Ed", matchTags: ["Nunn","respiratory physiology","anaesthesia"] },
              { name: "Yao & Artusio's Anesthesiology 9th Ed", author: "Fun-Sun Yao", publisher: "Wolters Kluwer", price: 5999, mrp: 7999, edition: "9th Ed", matchTags: ["Yao Artusio","anaesthesia"] },
              { name: "Barash Clinical Anesthesia 9th Ed", author: "Barash, Cullen, Stoelting", publisher: "Wolters Kluwer", price: 7999, mrp: 10499, edition: "9th Ed", matchTags: ["Barash","anaesthesia"] },
            ],
          },
        ],
      },
      {
        id: "md-psychiatry",
        label: "MD Psychiatry",
        subjects: [
          {
            id: "md-psych",
            name: "Psychiatry",
            color: "#5856D6",
            books: [
              { name: "Kaplan & Sadock's Comprehensive Textbook of Psychiatry 11th Ed", author: "Sadock, Sadock, Ruiz", publisher: "Wolters Kluwer", price: 14999, mrp: 19999, edition: "11th Ed", featured: true, matchTags: ["Kaplan Sadock","comprehensive psychiatry"] },
              { name: "New Oxford Textbook of Psychiatry 3rd Ed", author: "Gelder, Andreasen, Lopez-Ibor", publisher: "Oxford University Press", price: 14999, mrp: 19999, edition: "3rd Ed", matchTags: ["Oxford","psychiatry"] },
              { name: "Stahl's Essential Psychopharmacology 5th Ed", author: "Stephen M Stahl", publisher: "Cambridge University Press", price: 4999, mrp: 6999, edition: "5th Ed", matchTags: ["Stahl","psychopharmacology"] },
              { name: "DSM-5-TR Diagnostic & Statistical Manual 2022 Ed", author: "American Psychiatric Association", publisher: "APA Publishing", price: 3999, mrp: 5499, edition: "2022 Ed", matchTags: ["DSM-5","psychiatry"] },
            ],
          },
        ],
      },
      {
        id: "md-dermatology",
        label: "MD Dermatology",
        subjects: [
          {
            id: "md-derm",
            name: "Dermatology",
            color: "#BF5AF2",
            books: [
              { name: "Rook's Textbook of Dermatology (4-Vol Set) 9th Ed", author: "Griffiths, Barker, Bleiker", publisher: "Wiley-Blackwell", price: 24999, mrp: 34999, edition: "9th Ed", featured: true, matchTags: ["Rook's","dermatology"] },
              { name: "Fitzpatrick's Dermatology in General Medicine 9th Ed", author: "Kang, Amagai, Bruckner", publisher: "McGraw-Hill", price: 14999, mrp: 19999, edition: "9th Ed", matchTags: ["Fitzpatrick","dermatology"] },
              { name: "Bologna Schaffer & Cerroni Dermatology 5th Ed", author: "Brownell, Bordeaux, Bhutani", publisher: "Elsevier", price: 12999, mrp: 17999, edition: "5th Ed", matchTags: ["Bologna","dermatology"] },
              { name: "IADVL Textbook of Dermatology 4th Ed", author: "RG Valia", publisher: "Bhalani Publishing", price: 8999, mrp: 12999, edition: "4th Ed", matchTags: ["IADVL","dermatology"] },
            ],
          },
        ],
      },
      {
        id: "md-emergency",
        label: "MD Emergency Medicine",
        subjects: [
          {
            id: "md-emerg",
            name: "Emergency Medicine",
            color: "#FF3B30",
            books: [
              { name: "Tintinalli's Emergency Medicine 9th Ed", author: "Judith Tintinalli et al.", publisher: "McGraw-Hill", price: 9999, mrp: 13999, edition: "9th Ed", featured: true, matchTags: ["Tintinalli","emergency medicine"] },
              { name: "Rosen's Emergency Medicine 9th Ed", author: "Walls, Hockberger, Gausche-Hill", publisher: "Elsevier", price: 8999, mrp: 11999, edition: "9th Ed", matchTags: ["Rosen","emergency medicine"] },
              { name: "Roberts & Hedges' Clinical Procedures in Emergency Medicine 7th Ed", author: "Roberts & Hedges", publisher: "Elsevier", price: 7999, mrp: 10499, edition: "7th Ed", matchTags: ["Roberts Hedges","emergency medicine","procedures"] },
            ],
          },
        ],
      },
    ],
  },

  // ──────────────────────────────── MS ─────────────────────────────────
  {
    id: "ms",
    label: "MS",
    shortLabel: "MS",
    color: "#FF6B35",
    years: [
      {
        id: "ms-general-surgery",
        label: "MS General Surgery",
        subjects: [
          {
            id: "ms-gen-surg",
            name: "General Surgery",
            color: "#FF6B35",
            books: [
              { name: "Bailey & Love's Short Practice of Surgery 27th Ed", author: "Williams, O'Connell, McCaskie", publisher: "Taylor & Francis", price: 5499, mrp: 7499, edition: "27th Ed", featured: true, matchTags: ["Bailey Love","surgery"] },
              { name: "Sabiston Textbook of Surgery 21st Ed", author: "Townsend, Beauchamp, Evers", publisher: "Elsevier", price: 9999, mrp: 13999, edition: "21st Ed", matchTags: ["Sabiston","surgery"] },
              { name: "Schwartz's Principles of Surgery 11th Ed", author: "Brunicardi, Andersen, Billiar", publisher: "McGraw-Hill", price: 8999, mrp: 11999, edition: "11th Ed", matchTags: ["Schwartz","surgery"] },
              { name: "Maingot's Abdominal Operations 12th Ed", author: "Zinner & Ashley", publisher: "McGraw-Hill", price: 8999, mrp: 11999, edition: "12th Ed", matchTags: ["Maingot","abdominal surgery"] },
              { name: "Mastery of Surgery 7th Ed", author: "Fischer et al.", publisher: "Wolters Kluwer", price: 9999, mrp: 13499, edition: "7th Ed", matchTags: ["Mastery","surgery"] },
            ],
          },
        ],
      },
      {
        id: "ms-orthopaedics",
        label: "MS Orthopaedics",
        subjects: [
          {
            id: "ms-ortho",
            name: "Orthopaedics",
            color: "#8E7355",
            books: [
              { name: "Campbell's Operative Orthopaedics 14th Ed", author: "Azar, Beaty, Canale", publisher: "Elsevier", price: 14999, mrp: 19999, edition: "14th Ed", featured: true, matchTags: ["Campbell","operative orthopaedics"] },
              { name: "Watson-Jones Fractures & Joint Injuries 8th Ed", author: "Bucholz, Heckman, Court-Brown", publisher: "Elsevier", price: 8999, mrp: 11999, edition: "8th Ed", matchTags: ["Watson-Jones","fractures"] },
              { name: "Rockwood & Green's Fractures in Adults 9th Ed", author: "Heckman, Tornetta, McKee", publisher: "Wolters Kluwer", price: 9999, mrp: 13999, edition: "9th Ed", matchTags: ["Rockwood Green","fractures"] },
              { name: "AO Manual of Fracture Management 2nd Ed", author: "Rüedi, Murphy", publisher: "Thieme", price: 7999, mrp: 10499, edition: "2nd Ed", matchTags: ["AO Manual","fracture","orthopaedics"] },
              { name: "Apley & Solomon's Orthopaedics & Fractures 10th Ed", author: "Louis Solomon", publisher: "Taylor & Francis", price: 4999, mrp: 6999, edition: "10th Ed", matchTags: ["Apley Solomon","orthopaedics"] },
            ],
          },
        ],
      },
      {
        id: "ms-ent",
        label: "MS ENT",
        subjects: [
          {
            id: "ms-ent-surg",
            name: "ENT Surgery",
            color: "#AF52DE",
            books: [
              { name: "Cummings Otolaryngology Head & Neck Surgery 7th Ed", author: "Flint, Haughey, Lund", publisher: "Elsevier", price: 15999, mrp: 21999, edition: "7th Ed", featured: true, matchTags: ["Cummings","otolaryngology"] },
              { name: "Scott-Brown's Otorhinolaryngology 8th Ed", author: "Watkinson & Clarke", publisher: "Taylor & Francis", price: 12999, mrp: 17999, edition: "8th Ed", matchTags: ["Scott-Brown","ENT"] },
              { name: "Ballenger's Otorhinolaryngology 18th Ed", author: "James Snow Jr", publisher: "PMPH USA", price: 9999, mrp: 13999, edition: "18th Ed", matchTags: ["Ballenger","ENT"] },
              { name: "Flint Cummings Essential Otolaryngology 12th Ed", author: "K. Lee", publisher: "McGraw-Hill", price: 6999, mrp: 9499, edition: "12th Ed", matchTags: ["Flint","essential otolaryngology"] },
            ],
          },
        ],
      },
      {
        id: "ms-ophthalmology",
        label: "MS Ophthalmology",
        subjects: [
          {
            id: "ms-ophth",
            name: "Ophthalmology",
            color: "#32ADE6",
            books: [
              { name: "Kanski's Clinical Ophthalmology 9th Ed", author: "Brad Bowling", publisher: "Elsevier", price: 6499, mrp: 8999, edition: "9th Ed", featured: true, matchTags: ["Kanski","ophthalmology"] },
              { name: "American Academy of Ophthalmology BCSC Complete Set", author: "AAO", publisher: "AAO Publications", price: 19999, mrp: 27999, edition: "2024 Ed", matchTags: ["AAO","BCSC","ophthalmology"] },
              { name: "Yanoff & Duker Ophthalmology 5th Ed", author: "Myron Yanoff & Jay Duker", publisher: "Elsevier", price: 8999, mrp: 11999, edition: "5th Ed", matchTags: ["Yanoff","ophthalmology"] },
              { name: "Duke-Elder's System of Ophthalmology Vol 1-15", author: "Sir Stewart Duke-Elder", publisher: "Henry Kimpton", price: 9999, mrp: 12999, edition: "15 Vol Set", matchTags: ["Duke-Elder","ophthalmology"] },
            ],
          },
        ],
      },
      {
        id: "ms-obgyn",
        label: "MS Obstetrics & Gynae",
        subjects: [
          {
            id: "ms-obgyn",
            name: "Obstetrics & Gynaecology",
            color: "#FF2D92",
            books: [
              { name: "Williams Obstetrics 26th Ed", author: "Cunningham, Leveno, Dashe", publisher: "McGraw-Hill", price: 8999, mrp: 11999, edition: "26th Ed", featured: true, matchTags: ["Williams","obstetrics"] },
              { name: "Novak's Gynecology 16th Ed", author: "Berek & Novak", publisher: "Wolters Kluwer", price: 7999, mrp: 10999, edition: "16th Ed", matchTags: ["Novak","gynecology"] },
              { name: "Te Linde's Operative Gynecology 12th Ed", author: "Rock, Howard, Joanes", publisher: "Wolters Kluwer", price: 9999, mrp: 13999, edition: "12th Ed", matchTags: ["Te Linde","operative gynecology"] },
              { name: "Comprehensive Gynecology 8th Ed", author: "Lobo, Gershenson, Lentz", publisher: "Elsevier", price: 7499, mrp: 9999, edition: "8th Ed", matchTags: ["Comprehensive Gynecology"] },
            ],
          },
        ],
      },
    ],
  },

  // ──────────────────────────────── MCh ────────────────────────────────
  {
    id: "mch",
    label: "MCh",
    shortLabel: "MCh",
    color: "#FF3B30",
    years: [
      {
        id: "mch-neurosurgery",
        label: "MCh Neurosurgery",
        subjects: [
          {
            id: "mch-neuro",
            name: "Neurosurgery",
            color: "#5856D6",
            books: [
              { name: "Youmans & Winn Neurological Surgery 7th Ed", author: "H. Richard Winn", publisher: "Elsevier", price: 19999, mrp: 27999, edition: "7th Ed", featured: true, matchTags: ["Youmans","neurosurgery"] },
              { name: "Greenberg Handbook of Neurosurgery 9th Ed", author: "Mark Greenberg", publisher: "Thieme", price: 5999, mrp: 7999, edition: "9th Ed", matchTags: ["Greenberg","neurosurgery"] },
              { name: "Rengachary Principles of Neurosurgery 3rd Ed", author: "Rengachary & Ellenbogen", publisher: "Elsevier", price: 9999, mrp: 13999, edition: "3rd Ed", matchTags: ["Rengachary","neurosurgery"] },
            ],
          },
        ],
      },
      {
        id: "mch-cardiothoracic",
        label: "MCh Cardiothoracic",
        subjects: [
          {
            id: "mch-cardio",
            name: "Cardiothoracic Surgery",
            color: "#FF3B30",
            books: [
              { name: "Kirklin/Barratt-Boyes Cardiac Surgery 4th Ed", author: "Kirklin, Barratt-Boyes", publisher: "Elsevier", price: 14999, mrp: 19999, edition: "4th Ed", featured: true, matchTags: ["Kirklin","cardiac surgery"] },
              { name: "Sabiston & Spencer Surgery of the Chest 8th Ed", author: "Frank Sellke et al.", publisher: "Elsevier", price: 12999, mrp: 17999, edition: "8th Ed", matchTags: ["Sabiston Spencer","chest surgery"] },
              { name: "Cohn Cardiac Surgery in the Adult 5th Ed", author: "Lawrence H. Cohn", publisher: "McGraw-Hill", price: 9999, mrp: 13499, edition: "5th Ed", matchTags: ["Cohn","cardiac surgery"] },
            ],
          },
        ],
      },
      {
        id: "mch-plastic",
        label: "MCh Plastic Surgery",
        subjects: [
          {
            id: "mch-plastic-surg",
            name: "Plastic Surgery",
            color: "#FF9500",
            books: [
              { name: "Grabb and Smith's Plastic Surgery 7th Ed", author: "Thorne et al.", publisher: "Wolters Kluwer", price: 9999, mrp: 13999, edition: "7th Ed", featured: true, matchTags: ["Grabb Smith","plastic surgery"] },
              { name: "Mathes & Nahai Flap Reconstruction 2nd Ed", author: "Mathes & Nahai", publisher: "Elsevier", price: 14999, mrp: 19999, edition: "2nd Ed", matchTags: ["Mathes Nahai","flap","plastic surgery"] },
              { name: "Principles of Plastic Surgery McCarthy 2nd Ed", author: "Joseph G McCarthy", publisher: "Saunders", price: 12999, mrp: 17999, edition: "2nd Ed", matchTags: ["McCarthy","plastic surgery"] },
            ],
          },
        ],
      },
      {
        id: "mch-urology",
        label: "MCh Urology",
        subjects: [
          {
            id: "mch-urol",
            name: "Urology",
            color: "#FF9500",
            books: [
              { name: "Campbell-Walsh-Wein Urology 12th Ed", author: "Partin, Dmochowski, Kavoussi", publisher: "Elsevier", price: 19999, mrp: 26999, edition: "12th Ed", featured: true, matchTags: ["Campbell Walsh","urology"] },
              { name: "Hinman's Atlas of Urologic Surgery 4th Ed", author: "Hinman, Droller", publisher: "Elsevier", price: 9999, mrp: 13999, edition: "4th Ed", matchTags: ["Hinman","urologic surgery"] },
              { name: "Smith & Tanagho General Urology 18th Ed", author: "McAninch & Lue", publisher: "McGraw-Hill", price: 5999, mrp: 7999, edition: "18th Ed", matchTags: ["Smith Tanagho","urology"] },
            ],
          },
        ],
      },
      {
        id: "mch-paediatric-surgery",
        label: "MCh Paediatric Surgery",
        subjects: [
          {
            id: "mch-paed-surg",
            name: "Paediatric Surgery",
            color: "#FF2D92",
            books: [
              { name: "Ashcraft's Pediatric Surgery 6th Ed", author: "Holcomb, Murphy, Ostlie", publisher: "Elsevier", price: 9999, mrp: 13999, edition: "6th Ed", featured: true, matchTags: ["Ashcraft","pediatric surgery"] },
              { name: "O'Neill's Pediatric Surgery 6th Ed", author: "Coran et al.", publisher: "Elsevier", price: 12999, mrp: 17999, edition: "6th Ed", matchTags: ["O'Neill","pediatric surgery"] },
              { name: "Spitz & Coran Operative Pediatric Surgery 7th Ed", author: "Spitz & Coran", publisher: "Taylor & Francis", price: 9999, mrp: 13999, edition: "7th Ed", matchTags: ["Spitz Coran","pediatric surgery"] },
            ],
          },
        ],
      },
      {
        id: "mch-oncology",
        label: "MCh Surgical Oncology",
        subjects: [
          {
            id: "mch-surg-onco",
            name: "Surgical Oncology",
            color: "#00C2A8",
            books: [
              { name: "DeVita Hellman & Rosenberg's Cancer 11th Ed", author: "DeVita, Lawrence, Rosenberg", publisher: "Wolters Kluwer", price: 14999, mrp: 19999, edition: "11th Ed", featured: true, matchTags: ["DeVita","cancer"] },
              { name: "Bland & Copeland The Breast 5th Ed", author: "Bland & Copeland", publisher: "Elsevier", price: 9999, mrp: 13499, edition: "5th Ed", matchTags: ["Bland Copeland","breast surgery"] },
              { name: "AJCC Cancer Staging Manual 9th Ed", author: "American Joint Committee on Cancer", publisher: "Springer", price: 4999, mrp: 6499, edition: "9th Ed", matchTags: ["AJCC","cancer staging"] },
            ],
          },
        ],
      },
    ],
  },

  // ──────────────────────────────── DM ─────────────────────────────────
  {
    id: "dm",
    label: "DM",
    shortLabel: "DM",
    color: "#00C2A8",
    years: [
      {
        id: "dm-cardiology",
        label: "DM Cardiology",
        subjects: [
          {
            id: "dm-cardio",
            name: "Cardiology",
            color: "#FF3B30",
            books: [
              { name: "Braunwald's Heart Disease 12th Ed (2-Vol)", author: "Libby, Bonow, Mann", publisher: "Elsevier", price: 12999, mrp: 17999, edition: "12th Ed", featured: true, matchTags: ["Braunwald","heart disease"] },
              { name: "Hurst's The Heart 15th Ed", author: "Fuster, Harrington, Narula", publisher: "McGraw-Hill", price: 9999, mrp: 13499, edition: "15th Ed", matchTags: ["Hurst","heart"] },
              { name: "Chou's Electrocardiography in Clinical Practice 6th Ed", author: "Surawicz & Knilans", publisher: "Elsevier", price: 4999, mrp: 6499, edition: "6th Ed", matchTags: ["Chou","ECG","electrocardiography"] },
              { name: "ESC Textbook of Cardiovascular Medicine 3rd Ed", author: "Camm, Lüscher, Maurer", publisher: "Oxford University Press", price: 8999, mrp: 11999, edition: "3rd Ed", matchTags: ["ESC","cardiovascular"] },
              { name: "Clinical Cardiac Pacing Defibrillation & Resynchronization 4th Ed", author: "Ellenbogen, Wilkoff, Kay", publisher: "Elsevier", price: 7999, mrp: 10499, edition: "4th Ed", matchTags: ["Ellenbogen","pacing","cardiology"] },
            ],
          },
        ],
      },
      {
        id: "dm-neurology",
        label: "DM Neurology",
        subjects: [
          {
            id: "dm-neuro",
            name: "Neurology",
            color: "#5856D6",
            books: [
              { name: "Adams & Victor's Principles of Neurology 12th Ed", author: "Ropper, Samuels, Klein", publisher: "McGraw-Hill", price: 8999, mrp: 11999, edition: "12th Ed", featured: true, matchTags: ["Adams Victor","neurology"] },
              { name: "Hauser's Harrison's Neurology 4th Ed", author: "Stephen Hauser", publisher: "McGraw-Hill", price: 5999, mrp: 7999, edition: "4th Ed", matchTags: ["Hauser","neurology"] },
              { name: "Osborn's Brain 3rd Ed", author: "Anne Osborn", publisher: "Elsevier", price: 9999, mrp: 13499, edition: "3rd Ed", matchTags: ["Osborn","brain","neuroradiology"] },
              { name: "Rowland & Pedley Merritt's Neurology 14th Ed", author: "Lewis Rowland", publisher: "Wolters Kluwer", price: 5999, mrp: 7999, edition: "14th Ed", matchTags: ["Merritt","neurology"] },
            ],
          },
        ],
      },
      {
        id: "dm-gastroenterology",
        label: "DM Gastroenterology",
        subjects: [
          {
            id: "dm-gastro",
            name: "Gastroenterology",
            color: "#FF9500",
            books: [
              { name: "Sleisenger & Fordtran's Gastrointestinal and Liver Disease 11th Ed", author: "Feldman, Friedman, Brandt", publisher: "Elsevier", price: 12999, mrp: 17999, edition: "11th Ed", featured: true, matchTags: ["Sleisenger","gastroenterology"] },
              { name: "Yamada's Textbook of Gastroenterology 6th Ed", author: "Podolsky et al.", publisher: "Wiley-Blackwell", price: 14999, mrp: 19999, edition: "6th Ed", matchTags: ["Yamada","gastroenterology"] },
              { name: "Makharia & Ahuja Textbook of Gastroenterology 2nd Ed", author: "Makharia, Ahuja", publisher: "CBS Publishers", price: 3999, mrp: 5299, edition: "2nd Ed", matchTags: ["Makharia","gastroenterology","India"] },
            ],
          },
        ],
      },
      {
        id: "dm-nephrology",
        label: "DM Nephrology",
        subjects: [
          {
            id: "dm-nephro",
            name: "Nephrology",
            color: "#007AFF",
            books: [
              { name: "Brenner & Rector's The Kidney 11th Ed", author: "Taal, Chertow, Marsden", publisher: "Elsevier", price: 12999, mrp: 17999, edition: "11th Ed", featured: true, matchTags: ["Brenner Rector","kidney","nephrology"] },
              { name: "Schrier's Diseases of Kidney & Urinary Tract 9th Ed", author: "Coffman, Falk, Molitoris", publisher: "Wolters Kluwer", price: 9999, mrp: 13499, edition: "9th Ed", matchTags: ["Schrier","kidney disease"] },
              { name: "Clinical Nephrology by Berl & Bonventre 2nd Ed", author: "Tomas Berl", publisher: "Atlas Medical Publishing", price: 5999, mrp: 7999, edition: "2nd Ed", matchTags: ["Berl","nephrology"] },
            ],
          },
        ],
      },
      {
        id: "dm-endocrinology",
        label: "DM Endocrinology",
        subjects: [
          {
            id: "dm-endo",
            name: "Endocrinology",
            color: "#FFD60A",
            books: [
              { name: "Williams Textbook of Endocrinology 14th Ed", author: "Melmed, Auchus, Goldfine", publisher: "Elsevier", price: 8999, mrp: 11999, edition: "14th Ed", featured: true, matchTags: ["Williams","endocrinology"] },
              { name: "Greenspan's Basic & Clinical Endocrinology 10th Ed", author: "Shoback & Gardner", publisher: "McGraw-Hill", price: 5999, mrp: 7999, edition: "10th Ed", matchTags: ["Greenspan","endocrinology"] },
              { name: "Jameson & DeGroot Endocrinology: Adult & Pediatric 7th Ed", author: "Jameson et al.", publisher: "Elsevier", price: 12999, mrp: 17999, edition: "7th Ed", matchTags: ["Jameson DeGroot","endocrinology"] },
            ],
          },
        ],
      },
      {
        id: "dm-pulmonology",
        label: "DM Pulmonology",
        subjects: [
          {
            id: "dm-pulmo",
            name: "Pulmonology",
            color: "#5AC8FA",
            books: [
              { name: "Murray & Nadel's Textbook of Respiratory Medicine 7th Ed", author: "Broaddus et al.", publisher: "Elsevier", price: 9999, mrp: 13999, edition: "7th Ed", featured: true, matchTags: ["Murray Nadel","respiratory","pulmonology"] },
              { name: "Fishman's Pulmonary Diseases & Disorders 5th Ed", author: "Grippi et al.", publisher: "McGraw-Hill", price: 9999, mrp: 13499, edition: "5th Ed", matchTags: ["Fishman","pulmonary"] },
              { name: "GOLD COPD Global Initiative Guidelines 2024", author: "GOLD Committee", publisher: "GOLD Publications", price: 999, mrp: 1499, edition: "2024 Ed", matchTags: ["GOLD","COPD","guidelines"] },
              { name: "GINA Asthma Guidelines 2024", author: "GINA Committee", publisher: "GINA Publications", price: 999, mrp: 1499, edition: "2024 Ed", matchTags: ["GINA","asthma"] },
            ],
          },
        ],
      },
      {
        id: "dm-haematology",
        label: "DM Haematology",
        subjects: [
          {
            id: "dm-haem",
            name: "Haematology",
            color: "#FF3B30",
            books: [
              { name: "Williams Hematology 10th Ed", author: "Kaushansky, Prchal, Burns", publisher: "McGraw-Hill", price: 9999, mrp: 13499, edition: "10th Ed", featured: true, matchTags: ["Williams","hematology"] },
              { name: "Hoffbrand & Steensma Essential Haematology 8th Ed", author: "AV Hoffbrand", publisher: "Wiley-Blackwell", price: 4999, mrp: 6499, edition: "8th Ed", matchTags: ["Hoffbrand","haematology"] },
              { name: "Lee's Synopsis of Haematology 3rd Ed", author: "Lee, Bain, Provan", publisher: "Oxford University Press", price: 3999, mrp: 5299, edition: "3rd Ed", matchTags: ["Lee's","haematology"] },
              { name: "Wintrobe's Clinical Hematology 14th Ed", author: "Greer et al.", publisher: "Wolters Kluwer", price: 9999, mrp: 13499, edition: "14th Ed", matchTags: ["Wintrobe","hematology"] },
            ],
          },
        ],
      },
      {
        id: "dm-rheumatology",
        label: "DM Rheumatology",
        subjects: [
          {
            id: "dm-rheuma",
            name: "Rheumatology",
            color: "#FF6B35",
            books: [
              { name: "Firestein Budd Kelley's Textbook of Rheumatology 11th Ed", author: "Firestein, Budd, Gabriel", publisher: "Elsevier", price: 9999, mrp: 13999, edition: "11th Ed", featured: true, matchTags: ["Firestein Kelley","rheumatology"] },
              { name: "Hochberg's Rheumatology 8th Ed", author: "Hochberg, Gravallese, Smolen", publisher: "Elsevier", price: 8999, mrp: 11999, edition: "8th Ed", matchTags: ["Hochberg","rheumatology"] },
              { name: "Oxford Textbook of Rheumatology 5th Ed", author: "Watts, Conaghan, Doherty", publisher: "Oxford University Press", price: 6999, mrp: 9499, edition: "5th Ed", matchTags: ["Oxford","rheumatology"] },
            ],
          },
        ],
      },
      {
        id: "dm-oncology",
        label: "DM Medical Oncology",
        subjects: [
          {
            id: "dm-onco",
            name: "Medical Oncology",
            color: "#00C2A8",
            books: [
              { name: "DeVita Hellman & Rosenberg's Cancer 11th Ed", author: "DeVita, Lawrence, Rosenberg", publisher: "Wolters Kluwer", price: 14999, mrp: 19999, edition: "11th Ed", featured: true, matchTags: ["DeVita","cancer"] },
              { name: "Holland-Frei Cancer Medicine 9th Ed", author: "Bast, Croce, Hait", publisher: "Wiley-Blackwell", price: 9999, mrp: 13499, edition: "9th Ed", matchTags: ["Holland Frei","cancer medicine"] },
              { name: "NCCN Clinical Practice Guidelines in Oncology 2024", author: "NCCN", publisher: "NCCN Publications", price: 2999, mrp: 3999, edition: "2024 Ed", matchTags: ["NCCN","oncology","guidelines"] },
            ],
          },
        ],
      },
    ],
  },

  // ──────────────────────────────── DNB ─────────────────────────────────
  {
    id: "dnb",
    label: "DNB / Fellowship",
    shortLabel: "DNB",
    color: "#34C759",
    years: [
      {
        id: "dnb-entrance",
        label: "DNB Entrance & CET",
        subjects: [
          {
            id: "dnb-entrance-prep",
            name: "DNB CET Preparation",
            color: "#34C759",
            books: [
              { name: "DNB Theory Question Bank Medicine 5th Ed", author: "Somen Das", publisher: "Paras Medical Publisher", price: 1999, mrp: 2499, edition: "5th Ed", featured: true, matchTags: ["DNB","question bank","medicine"] },
              { name: "DNB Theory Question Bank Surgery 4th Ed", author: "Somen Das", publisher: "Paras Medical Publisher", price: 1999, mrp: 2499, edition: "4th Ed", matchTags: ["DNB","question bank","surgery"] },
              { name: "Review for DNB CET Examination by Somen Das", author: "Somen Das", publisher: "Paras Medical Publisher", price: 2499, mrp: 3199, edition: "2nd Ed", matchTags: ["DNB","CET","review"] },
              { name: "Across DNB Entrance MCQ Guide 3rd Ed", author: "Ramesh Babu", publisher: "Jaypee Brothers", price: 1799, mrp: 2299, edition: "3rd Ed", matchTags: ["Across DNB","MCQ"] },
            ],
          },
        ],
      },
      {
        id: "neet-pg",
        label: "NEET-PG / USMLE Prep",
        subjects: [
          {
            id: "neet-pg-prep",
            name: "Entrance Exam Preparation",
            color: "#007AFF",
            books: [
              { name: "First Aid for the USMLE Step 1 2024 Ed", author: "Tao Le & Vikas Bhushan", publisher: "McGraw-Hill", price: 3499, mrp: 4799, edition: "2024 Ed", featured: true, matchTags: ["First Aid","USMLE","Step 1"] },
              { name: "Across NEET-PG (Revision Guide)", author: "Ramesh Babu", publisher: "Jaypee Brothers", price: 2499, mrp: 3299, edition: "5th Ed", forExam: ["NEET-PG"], matchTags: ["Across","NEET-PG"] },
              { name: "USMLE Step 1 Lecture Notes 7-Book Set by Kaplan", author: "Kaplan Medical", publisher: "Kaplan Publishing", price: 5499, mrp: 7499, edition: "2024 Ed", forExam: ["USMLE"], matchTags: ["Kaplan","USMLE"] },
              { name: "Pathoma: Fundamentals of Pathology 2023 Ed", author: "Husain Sattar", publisher: "Pathoma LLC", price: 2999, mrp: 3999, edition: "2023 Ed", forExam: ["USMLE","NEET-PG"], matchTags: ["Pathoma","pathology"] },
              { name: "NEET-PG Previous Year Questions 2023–2018", author: "Amit Ashish", publisher: "Jaypee Brothers", price: 1999, mrp: 2499, edition: "2024 Ed", forExam: ["NEET-PG"], matchTags: ["NEET-PG","previous year","MCQ"] },
              { name: "Marrow QBank NEET-PG Notes (Complete Set)", author: "Marrow Education", publisher: "Marrow", price: 3999, mrp: 5499, edition: "2024 Ed", forExam: ["NEET-PG"], matchTags: ["Marrow","NEET-PG","notes"] },
            ],
          },
        ],
      },
    ],
  },
];

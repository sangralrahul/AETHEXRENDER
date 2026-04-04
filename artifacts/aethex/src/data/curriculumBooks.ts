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
      // ── MD Year 1 ───────────────────────────────────────────────────
      {
        id: "md-year1",
        label: "Year 1",
        subjects: [
          {
            id: "md-y1-common",
            name: "Common Foundation",
            color: "#636366",
            books: [
              { name: "ICMR Guidelines for Biomedical Research on Human Participants", author: "ICMR", publisher: "ICMR Publications", price: 499, mrp: 699, edition: "2017 Ed", featured: true, matchTags: ["ICMR","biomedical research","ethics"] },
              { name: "Biostatistics — Basic Concepts & Methodology for Health Sciences 10th Ed", author: "Wayne Daniel & Chad Cross", publisher: "Wiley", price: 3999, mrp: 5299, edition: "10th Ed", matchTags: ["biostatistics","Daniel"] },
              { name: "Research Methodology in Health Sciences 3rd Ed", author: "Suresh K Sharma", publisher: "Jaypee Brothers", price: 1299, mrp: 1799, edition: "3rd Ed", matchTags: ["research methodology","Suresh Sharma"] },
              { name: "Medical Ethics & Communication Skills 2nd Ed", author: "P Chakraborti", publisher: "Jaypee Brothers", price: 799, mrp: 1099, edition: "2nd Ed", matchTags: ["medical ethics","communication"] },
            ],
          },
          {
            id: "md-y1-medicine",
            name: "Internal Medicine — Year 1",
            color: "#007AFF",
            books: [
              { name: "API Textbook of Medicine 11th Ed", author: "Siddharth Shah", publisher: "Jaypee Brothers", price: 5999, mrp: 7999, edition: "11th Ed", featured: true, matchTags: ["API","medicine","India"] },
              { name: "Talley & O'Connor Clinical Examination 8th Ed", author: "Nicholas Talley", publisher: "Elsevier", price: 4999, mrp: 6699, edition: "8th Ed", matchTags: ["Talley O'Connor","clinical examination"] },
              { name: "Davidson's Principles & Practice of Medicine 24th Ed", author: "Penman, Walker, Ralston", publisher: "Elsevier", price: 4999, mrp: 6999, edition: "24th Ed", matchTags: ["Davidson","medicine"] },
              { name: "Hutchison's Clinical Methods 25th Ed", author: "Glynn & Drake", publisher: "Elsevier", price: 3499, mrp: 4799, edition: "25th Ed", matchTags: ["Hutchison","clinical methods"] },
            ],
          },
          {
            id: "md-y1-pathology",
            name: "Pathology — Year 1",
            color: "#FF3B30",
            books: [
              { name: "Harsh Mohan Textbook of Pathology 8th Ed", author: "Harsh Mohan", publisher: "Jaypee Brothers", price: 2999, mrp: 3999, edition: "8th Ed", featured: true, matchTags: ["Harsh Mohan","pathology","India"] },
              { name: "Robbins Basic Pathology 11th Ed", author: "Kumar, Abbas, Aster", publisher: "Elsevier", price: 5999, mrp: 7999, edition: "11th Ed", matchTags: ["Robbins Basic","pathology"] },
              { name: "Underwood's Pathology 7th Ed", author: "Cross & Underwood", publisher: "Elsevier", price: 3999, mrp: 5499, edition: "7th Ed", matchTags: ["Underwood","pathology"] },
            ],
          },
          {
            id: "md-y1-pharmacology",
            name: "Pharmacology — Year 1",
            color: "#FF9500",
            books: [
              { name: "KD Tripathi Essentials of Medical Pharmacology 8th Ed", author: "KD Tripathi", publisher: "Jaypee Brothers", price: 1799, mrp: 2499, edition: "8th Ed", featured: true, matchTags: ["KD Tripathi","pharmacology","India"] },
              { name: "Katzung Basic & Clinical Pharmacology 16th Ed", author: "Bertram Katzung", publisher: "McGraw-Hill", price: 5999, mrp: 7999, edition: "16th Ed", matchTags: ["Katzung","pharmacology"] },
              { name: "Lippincott Illustrated Reviews: Pharmacology 8th Ed", author: "Karen Whalen", publisher: "Wolters Kluwer", price: 3999, mrp: 5299, edition: "8th Ed", matchTags: ["Lippincott","pharmacology"] },
            ],
          },
          {
            id: "md-y1-microbiology",
            name: "Microbiology — Year 1",
            color: "#00C2A8",
            books: [
              { name: "Ananthanarayan & Paniker Textbook of Microbiology 11th Ed", author: "CK Jayaram Paniker", publisher: "Universities Press", price: 1299, mrp: 1799, edition: "11th Ed", featured: true, matchTags: ["Ananthanarayan","microbiology","India"] },
              { name: "Murray's Manual of Clinical Microbiology 13th Ed", author: "Carroll, Pfaller, Landry", publisher: "ASM Press", price: 9999, mrp: 13499, edition: "13th Ed", matchTags: ["Murray","clinical microbiology"] },
              { name: "Jawetz Melnick & Adelberg's Medical Microbiology 28th Ed", author: "Carroll, Butel, Morse", publisher: "McGraw-Hill", price: 4999, mrp: 6699, edition: "28th Ed", matchTags: ["Jawetz","microbiology"] },
            ],
          },
          {
            id: "md-y1-radiology",
            name: "Radiodiagnosis — Year 1",
            color: "#636366",
            books: [
              { name: "Sutton's Textbook of Radiology & Imaging 7th Ed", author: "David Sutton", publisher: "Churchill Livingstone", price: 7999, mrp: 10999, edition: "7th Ed", featured: true, matchTags: ["Sutton","radiology"] },
              { name: "CT Teaching Manual 4th Ed", author: "Matthias Hofer", publisher: "Thieme", price: 4999, mrp: 6499, edition: "4th Ed", matchTags: ["CT","teaching manual","radiology"] },
              { name: "Essentials of Radiology 3rd Ed", author: "Fred Mettler", publisher: "Elsevier", price: 4999, mrp: 6499, edition: "3rd Ed", matchTags: ["Mettler","radiology","essentials"] },
            ],
          },
          {
            id: "md-y1-anaesthesia",
            name: "Anaesthesiology — Year 1",
            color: "#8E8E93",
            books: [
              { name: "Morgan & Mikhail's Clinical Anesthesiology 6th Ed", author: "Butterworth, Mackey, Wasnick", publisher: "McGraw-Hill", price: 5499, mrp: 7299, edition: "6th Ed", featured: true, matchTags: ["Morgan Mikhail","anaesthesia"] },
              { name: "Nunn's Applied Respiratory Physiology 8th Ed", author: "Andrew Lumb", publisher: "Elsevier", price: 6999, mrp: 9299, edition: "8th Ed", matchTags: ["Nunn","respiratory physiology","anaesthesia"] },
              { name: "Stoelting's Pharmacology & Physiology in Anesthetic Practice 5th Ed", author: "Flood, Rathmell, Shafer", publisher: "Wolters Kluwer", price: 6999, mrp: 9299, edition: "5th Ed", matchTags: ["Stoelting","anaesthesia pharmacology"] },
            ],
          },
          {
            id: "md-y1-psychiatry",
            name: "Psychiatry — Year 1",
            color: "#5856D6",
            books: [
              { name: "DSM-5-TR Diagnostic & Statistical Manual 2022 Ed", author: "American Psychiatric Association", publisher: "APA Publishing", price: 3999, mrp: 5499, edition: "2022 Ed", featured: true, matchTags: ["DSM-5","psychiatry"] },
              { name: "Synopsis of Psychiatry 12th Ed", author: "Benjamin Sadock", publisher: "Wolters Kluwer", price: 5499, mrp: 7499, edition: "12th Ed", matchTags: ["Sadock","synopsis","psychiatry"] },
              { name: "Ahuja Textbook of Postgraduate Psychiatry 3rd Ed", author: "Niraj Ahuja", publisher: "Jaypee Brothers", price: 1999, mrp: 2699, edition: "3rd Ed", matchTags: ["Ahuja","psychiatry","India"] },
            ],
          },
          {
            id: "md-y1-dermatology",
            name: "Dermatology — Year 1",
            color: "#BF5AF2",
            books: [
              { name: "IADVL Textbook of Dermatology 4th Ed", author: "RG Valia", publisher: "Bhalani Publishing", price: 8999, mrp: 12999, edition: "4th Ed", featured: true, matchTags: ["IADVL","dermatology"] },
              { name: "Inamadar's Textbook of Dermatology 3rd Ed", author: "Arun Inamadar", publisher: "Jaypee Brothers", price: 3999, mrp: 5299, edition: "3rd Ed", matchTags: ["Inamadar","dermatology","India"] },
              { name: "Andrews Diseases of the Skin 13th Ed", author: "Elston, Ferringer, Ko", publisher: "Elsevier", price: 6999, mrp: 9299, edition: "13th Ed", matchTags: ["Andrews","skin diseases","dermatology"] },
            ],
          },
          {
            id: "md-y1-emergency",
            name: "Emergency Medicine — Year 1",
            color: "#FF3B30",
            books: [
              { name: "Roberts & Hedges' Clinical Procedures in Emergency Medicine 7th Ed", author: "Roberts & Hedges", publisher: "Elsevier", price: 7999, mrp: 10499, edition: "7th Ed", featured: true, matchTags: ["Roberts Hedges","emergency medicine","procedures"] },
              { name: "Emergency Medicine Manual 8th Ed", author: "O. John Ma et al.", publisher: "McGraw-Hill", price: 3499, mrp: 4799, edition: "8th Ed", matchTags: ["Emergency","manual","McGraw"] },
              { name: "Atlas of Emergency Medicine 5th Ed", author: "Kevin Knoop et al.", publisher: "McGraw-Hill", price: 4999, mrp: 6699, edition: "5th Ed", matchTags: ["Atlas","Emergency","Knoop"] },
            ],
          },
        ],
      },

      // ── MD Year 2 ───────────────────────────────────────────────────
      {
        id: "md-year2",
        label: "Year 2",
        subjects: [
          {
            id: "md-y2-medicine",
            name: "Internal Medicine — Year 2",
            color: "#007AFF",
            books: [
              { name: "Harrison's Principles of Internal Medicine 21st Ed (2-Vol Set)", author: "Loscalzo, Fauci, Kasper", publisher: "McGraw-Hill", price: 8999, mrp: 12999, edition: "21st Ed", featured: true, matchTags: ["Harrison","Internal Medicine"] },
              { name: "Oxford Textbook of Medicine 6th Ed", author: "Warrell, Cox, Firth", publisher: "Oxford University Press", price: 19999, mrp: 24999, edition: "6th Ed", matchTags: ["Oxford Textbook","Medicine"] },
              { name: "Ferri's Clinical Advisor 2025", author: "Fred Ferri", publisher: "Elsevier", price: 5999, mrp: 7999, edition: "2025 Ed", matchTags: ["Ferri","clinical advisor"] },
              { name: "Cecil Essentials of Medicine 10th Ed", author: "Carpenter, Griggs, Loscalzo", publisher: "Elsevier", price: 5499, mrp: 7499, edition: "10th Ed", matchTags: ["Cecil","medicine"] },
            ],
          },
          {
            id: "md-y2-pathology",
            name: "Pathology — Year 2",
            color: "#FF3B30",
            books: [
              { name: "Robbins & Cotran Pathologic Basis of Disease 10th Ed", author: "Kumar, Abbas, Aster", publisher: "Elsevier", price: 7499, mrp: 9999, edition: "10th Ed", featured: true, matchTags: ["Robbins","pathology"] },
              { name: "Sternberg's Diagnostic Surgical Pathology 7th Ed", author: "Mills et al.", publisher: "Wolters Kluwer", price: 12999, mrp: 17999, edition: "7th Ed", matchTags: ["Sternberg","pathology"] },
              { name: "Bancroft's Theory & Practice of Histological Techniques 8th Ed", author: "Suvarna, Layton & Bancroft", publisher: "Elsevier", price: 7999, mrp: 10999, edition: "8th Ed", matchTags: ["Bancroft","histology"] },
              { name: "Damjanov Atlas of Histopathology 2nd Ed", author: "Ivan Damjanov", publisher: "Jaypee Brothers", price: 3999, mrp: 5299, edition: "2nd Ed", matchTags: ["Damjanov","histopathology"] },
            ],
          },
          {
            id: "md-y2-pharmacology",
            name: "Pharmacology — Year 2",
            color: "#FF9500",
            books: [
              { name: "Goodman & Gilman's Pharmacological Basis of Therapeutics 14th Ed", author: "Brunton, Knollmann", publisher: "McGraw-Hill", price: 9499, mrp: 12999, edition: "14th Ed", featured: true, matchTags: ["Goodman Gilman","pharmacology"] },
              { name: "Stahl's Essential Psychopharmacology 5th Ed", author: "Stephen M Stahl", publisher: "Cambridge University Press", price: 4999, mrp: 6999, edition: "5th Ed", matchTags: ["Stahl","psychopharmacology"] },
              { name: "Rang & Dale's Pharmacology 9th Ed", author: "Rang, Dale, Ritter", publisher: "Elsevier", price: 4999, mrp: 6699, edition: "9th Ed", matchTags: ["Rang Dale","pharmacology"] },
            ],
          },
          {
            id: "md-y2-microbiology",
            name: "Microbiology — Year 2",
            color: "#00C2A8",
            books: [
              { name: "Mandell Douglas & Bennett's Infectious Diseases 9th Ed", author: "Bennett, Dolin, Blaser", publisher: "Elsevier", price: 14999, mrp: 19999, edition: "9th Ed", featured: true, matchTags: ["Mandell","infectious diseases"] },
              { name: "Topley & Wilson's Microbiology & Microbial Infections", author: "Borriello, Murray, Funke", publisher: "Hodder Arnold", price: 19999, mrp: 24999, edition: "11th Ed", matchTags: ["Topley Wilson","microbiology"] },
              { name: "Harrison's Infectious Diseases 3rd Ed", author: "Dennis Kasper & Anthony Fauci", publisher: "McGraw-Hill", price: 5999, mrp: 7999, edition: "3rd Ed", matchTags: ["Harrison","infectious diseases"] },
            ],
          },
          {
            id: "md-y2-radiology",
            name: "Radiodiagnosis — Year 2",
            color: "#636366",
            books: [
              { name: "Grainger & Allison's Diagnostic Radiology 6th Ed", author: "Gillard, Waldman, Donoghue", publisher: "Elsevier", price: 14999, mrp: 19999, edition: "6th Ed", featured: true, matchTags: ["Grainger Allison","radiology"] },
              { name: "Diagnostic Ultrasound by Rumack Wilson 5th Ed", author: "Carol Rumack", publisher: "Elsevier", price: 8999, mrp: 11999, edition: "5th Ed", matchTags: ["Rumack","ultrasound","radiology"] },
              { name: "Weir & Abrahams' Imaging Atlas of Human Anatomy 5th Ed", author: "Jonathan Spratt", publisher: "Elsevier", price: 5999, mrp: 7999, edition: "5th Ed", matchTags: ["Weir Abrahams","imaging atlas","anatomy"] },
            ],
          },
          {
            id: "md-y2-anaesthesia",
            name: "Anaesthesiology — Year 2",
            color: "#8E8E93",
            books: [
              { name: "Barash Clinical Anesthesia 9th Ed", author: "Barash, Cullen, Stoelting", publisher: "Wolters Kluwer", price: 7999, mrp: 10499, edition: "9th Ed", featured: true, matchTags: ["Barash","anaesthesia"] },
              { name: "Yao & Artusio's Anesthesiology 9th Ed", author: "Fun-Sun Yao", publisher: "Wolters Kluwer", price: 5999, mrp: 7999, edition: "9th Ed", matchTags: ["Yao Artusio","anaesthesia"] },
              { name: "Pardo & Miller's Basics of Anesthesia 8th Ed", author: "Manuel Pardo & Ronald Miller", publisher: "Elsevier", price: 4999, mrp: 6499, edition: "8th Ed", matchTags: ["Pardo Miller","basics anesthesia"] },
            ],
          },
          {
            id: "md-y2-psychiatry",
            name: "Psychiatry — Year 2",
            color: "#5856D6",
            books: [
              { name: "Kaplan & Sadock's Comprehensive Textbook of Psychiatry 11th Ed", author: "Sadock, Sadock, Ruiz", publisher: "Wolters Kluwer", price: 14999, mrp: 19999, edition: "11th Ed", featured: true, matchTags: ["Kaplan Sadock","comprehensive psychiatry"] },
              { name: "New Oxford Textbook of Psychiatry 3rd Ed", author: "Gelder, Andreasen, Lopez-Ibor", publisher: "Oxford University Press", price: 14999, mrp: 19999, edition: "3rd Ed", matchTags: ["Oxford","psychiatry"] },
              { name: "ICD-11 Classification of Mental & Behavioural Disorders", author: "WHO", publisher: "WHO Publications", price: 1499, mrp: 1999, edition: "2023 Ed", matchTags: ["ICD-11","mental disorders","WHO"] },
            ],
          },
          {
            id: "md-y2-dermatology",
            name: "Dermatology — Year 2",
            color: "#BF5AF2",
            books: [
              { name: "Fitzpatrick's Dermatology in General Medicine 9th Ed", author: "Kang, Amagai, Bruckner", publisher: "McGraw-Hill", price: 14999, mrp: 19999, edition: "9th Ed", featured: true, matchTags: ["Fitzpatrick","dermatology"] },
              { name: "Bologna Schaffer & Cerroni Dermatology 5th Ed", author: "Brownell, Bordeaux, Bhutani", publisher: "Elsevier", price: 12999, mrp: 17999, edition: "5th Ed", matchTags: ["Bologna","dermatology"] },
              { name: "Contact & Occupational Dermatology 3rd Ed", author: "Marks & Elsner", publisher: "Mosby", price: 5999, mrp: 7999, edition: "3rd Ed", matchTags: ["Contact","dermatology","occupational"] },
            ],
          },
          {
            id: "md-y2-emergency",
            name: "Emergency Medicine — Year 2",
            color: "#FF3B30",
            books: [
              { name: "Tintinalli's Emergency Medicine 9th Ed", author: "Judith Tintinalli et al.", publisher: "McGraw-Hill", price: 9999, mrp: 13999, edition: "9th Ed", featured: true, matchTags: ["Tintinalli","emergency medicine"] },
              { name: "Rosen's Emergency Medicine 9th Ed", author: "Walls, Hockberger, Gausche-Hill", publisher: "Elsevier", price: 8999, mrp: 11999, edition: "9th Ed", matchTags: ["Rosen","emergency medicine"] },
              { name: "Marx's Rosen's Emergency Medicine 9th Ed", author: "Ron Walls", publisher: "Elsevier", price: 8499, mrp: 11499, edition: "9th Ed", matchTags: ["Marx Rosen","emergency"] },
            ],
          },
        ],
      },

      // ── MD Year 3 ───────────────────────────────────────────────────
      {
        id: "md-year3",
        label: "Year 3",
        subjects: [
          {
            id: "md-y3-medicine",
            name: "Internal Medicine — Year 3",
            color: "#007AFF",
            books: [
              { name: "Current Medical Diagnosis & Treatment 2025", author: "Papadakis, McPhee, Rabow", publisher: "McGraw-Hill", price: 5999, mrp: 7999, edition: "2025 Ed", featured: true, matchTags: ["CMDT","current medical diagnosis","treatment"] },
              { name: "Kumar & Clark's Clinical Medicine 10th Ed", author: "Adam Feather", publisher: "Elsevier", price: 4999, mrp: 6699, edition: "10th Ed", matchTags: ["Kumar Clark","clinical medicine"] },
              { name: "PG Entrance Revision in Medicine 4th Ed", author: "Praveen Aggarwal", publisher: "Jaypee Brothers", price: 1999, mrp: 2699, edition: "4th Ed", matchTags: ["PG entrance","medicine","revision"] },
            ],
          },
          {
            id: "md-y3-pathology",
            name: "Pathology — Year 3",
            color: "#FF3B30",
            books: [
              { name: "Rosai & Ackerman's Surgical Pathology 11th Ed", author: "Rosai", publisher: "Elsevier", price: 14999, mrp: 19999, edition: "11th Ed", featured: true, matchTags: ["Rosai Ackerman","surgical pathology"] },
              { name: "WHO Classification of Tumours 5th Ed Series", author: "WHO", publisher: "IARC Press", price: 6999, mrp: 9499, edition: "5th Ed", matchTags: ["WHO","tumours","cancer classification"] },
              { name: "Molecular Pathology 2nd Ed", author: "Coleman & Tsongalis", publisher: "Elsevier", price: 7999, mrp: 10499, edition: "2nd Ed", matchTags: ["Molecular pathology","Coleman"] },
            ],
          },
          {
            id: "md-y3-pharmacology",
            name: "Pharmacology — Year 3",
            color: "#FF9500",
            books: [
              { name: "Bertram & Trevor's Pharmacology Examination & Board Review 13th Ed", author: "Bertram Katzung", publisher: "McGraw-Hill", price: 3499, mrp: 4799, edition: "13th Ed", featured: true, matchTags: ["Bertram Trevor","pharmacology","review"] },
              { name: "Applied Pharmacokinetics & Pharmacodynamics 4th Ed", author: "Burton et al.", publisher: "Wolters Kluwer", price: 5499, mrp: 7299, edition: "4th Ed", matchTags: ["pharmacokinetics","pharmacodynamics"] },
              { name: "Drug Information: A Guide for Pharmacists 6th Ed", author: "Malone et al.", publisher: "McGraw-Hill", price: 4999, mrp: 6499, edition: "6th Ed", matchTags: ["drug information","pharmacists"] },
            ],
          },
          {
            id: "md-y3-microbiology",
            name: "Microbiology — Year 3",
            color: "#00C2A8",
            books: [
              { name: "Clinical Microbiology Made Ridiculously Simple 7th Ed", author: "Mark Gladwin et al.", publisher: "MedMaster", price: 1999, mrp: 2699, edition: "7th Ed", featured: true, matchTags: ["clinical microbiology","ridiculously simple"] },
              { name: "WHO GLASS Report 2023 — Antimicrobial Resistance", author: "WHO", publisher: "WHO Publications", price: 799, mrp: 1099, edition: "2023 Ed", matchTags: ["AMR","antimicrobial resistance","WHO GLASS"] },
              { name: "Bailey & Scott's Diagnostic Microbiology 15th Ed", author: "Mahon, Lehman, Manuselis", publisher: "Elsevier", price: 6999, mrp: 9299, edition: "15th Ed", matchTags: ["Bailey Scott","diagnostic microbiology"] },
            ],
          },
          {
            id: "md-y3-radiology",
            name: "Radiodiagnosis — Year 3",
            color: "#636366",
            books: [
              { name: "MRI in Clinical Practice 3rd Ed", author: "Gary Liney", publisher: "Springer", price: 5999, mrp: 7999, edition: "3rd Ed", featured: true, matchTags: ["MRI","radiology"] },
              { name: "Dahnert's Radiology Review Manual 8th Ed", author: "Wolfgang Dahnert", publisher: "Wolters Kluwer", price: 5999, mrp: 7999, edition: "8th Ed", matchTags: ["Dahnert","radiology review"] },
              { name: "Nuclear Medicine: Practical Physics, Artifacts, and Pitfalls", author: "Farrokh Dehdashti", publisher: "Oxford University Press", price: 5499, mrp: 7299, edition: "1st Ed", matchTags: ["nuclear medicine","physics","radiology"] },
            ],
          },
          {
            id: "md-y3-anaesthesia",
            name: "Anaesthesiology — Year 3",
            color: "#8E8E93",
            books: [
              { name: "Miller's Anaesthesia 9th Ed (2-Vol)", author: "Michael Gropper", publisher: "Elsevier", price: 12999, mrp: 17999, edition: "9th Ed", featured: true, matchTags: ["Miller","anaesthesia"] },
              { name: "Principles of Critical Care 5th Ed", author: "Hall, Schmidt, Kress", publisher: "McGraw-Hill", price: 7999, mrp: 10499, edition: "5th Ed", matchTags: ["principles","critical care"] },
              { name: "ACLS Provider Manual 2020 Ed", author: "American Heart Association", publisher: "AHA", price: 1999, mrp: 2699, edition: "2020 Ed", matchTags: ["ACLS","advanced cardiac life support"] },
            ],
          },
          {
            id: "md-y3-psychiatry",
            name: "Psychiatry — Year 3",
            color: "#5856D6",
            books: [
              { name: "Stahl's Essential Psychopharmacology 5th Ed", author: "Stephen M Stahl", publisher: "Cambridge University Press", price: 4999, mrp: 6999, edition: "5th Ed", featured: true, matchTags: ["Stahl","psychopharmacology"] },
              { name: "Sadock's Comprehensive Textbook of Child & Adolescent Psychiatry 7th Ed", author: "Mina Dulcan", publisher: "Wolters Kluwer", price: 8999, mrp: 11999, edition: "7th Ed", matchTags: ["child psychiatry","Dulcan"] },
              { name: "Cognitive Behaviour Therapy: Basics & Beyond 3rd Ed", author: "Judith Beck", publisher: "Guilford Press", price: 3499, mrp: 4799, edition: "3rd Ed", matchTags: ["CBT","cognitive behaviour therapy","Beck"] },
            ],
          },
          {
            id: "md-y3-dermatology",
            name: "Dermatology — Year 3",
            color: "#BF5AF2",
            books: [
              { name: "Rook's Textbook of Dermatology (4-Vol Set) 9th Ed", author: "Griffiths, Barker, Bleiker", publisher: "Wiley-Blackwell", price: 24999, mrp: 34999, edition: "9th Ed", featured: true, matchTags: ["Rook's","dermatology"] },
              { name: "Dermatologic Surgery: A Manual of Defect Repair Options 3rd Ed", author: "GJ Nouri", publisher: "McGraw-Hill", price: 5499, mrp: 7299, edition: "3rd Ed", matchTags: ["dermatologic surgery","Nouri"] },
              { name: "Photodermatology 1st Ed", author: "Henry Lim & Herbert Hönigsmann", publisher: "Informa Healthcare", price: 5999, mrp: 7999, edition: "1st Ed", matchTags: ["photodermatology","Lim"] },
            ],
          },
          {
            id: "md-y3-emergency",
            name: "Emergency Medicine — Year 3",
            color: "#FF3B30",
            books: [
              { name: "Emergency Ultrasound 3rd Ed", author: "Ma, Mateer, Reardon", publisher: "McGraw-Hill", price: 5999, mrp: 7999, edition: "3rd Ed", featured: true, matchTags: ["emergency ultrasound","POCUS"] },
              { name: "Critical Care Medicine: Principles of Diagnosis and Management 5th Ed", author: "Parrillo & Dellinger", publisher: "Elsevier", price: 7999, mrp: 10499, edition: "5th Ed", matchTags: ["critical care","Parrillo"] },
              { name: "Wilderness Medicine 7th Ed", author: "Paul Auerbach", publisher: "Elsevier", price: 7499, mrp: 9999, edition: "7th Ed", matchTags: ["wilderness medicine","Auerbach"] },
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
      // ── MS Year 1 ───────────────────────────────────────────────────
      {
        id: "ms-year1",
        label: "Year 1",
        subjects: [
          {
            id: "ms-y1-common",
            name: "Surgical Foundation",
            color: "#636366",
            books: [
              { name: "Research Methodology in Surgery 2nd Ed", author: "Bhansali & Bedi", publisher: "Jaypee Brothers", price: 1299, mrp: 1799, edition: "2nd Ed", featured: true, matchTags: ["research methodology","surgery"] },
              { name: "Surgical Anatomy & Operative Surgery 5th Ed", author: "GS Ramachandran", publisher: "CBS Publishers", price: 1499, mrp: 1999, edition: "5th Ed", matchTags: ["surgical anatomy","operative surgery"] },
              { name: "Principles of Surgery — Schwartz's Pretest 10th Ed", author: "Brunicardi", publisher: "McGraw-Hill", price: 2999, mrp: 3999, edition: "10th Ed", matchTags: ["Schwartz","surgery pretest"] },
            ],
          },
          {
            id: "ms-y1-general",
            name: "General Surgery — Year 1",
            color: "#FF6B35",
            books: [
              { name: "Bailey & Love's Short Practice of Surgery 27th Ed", author: "Williams, O'Connell, McCaskie", publisher: "Taylor & Francis", price: 5499, mrp: 7499, edition: "27th Ed", featured: true, matchTags: ["Bailey Love","surgery"] },
              { name: "SRB's Manual of Surgery 6th Ed", author: "Sriram Bhat", publisher: "Jaypee Brothers", price: 2499, mrp: 3299, edition: "6th Ed", matchTags: ["SRB","surgery","India"] },
              { name: "Das — A Manual on Clinical Surgery 12th Ed", author: "S Das", publisher: "S Das Publishing", price: 999, mrp: 1399, edition: "12th Ed", matchTags: ["Das","clinical surgery","India"] },
            ],
          },
          {
            id: "ms-y1-ortho",
            name: "Orthopaedics — Year 1",
            color: "#8E7355",
            books: [
              { name: "Apley & Solomon's Orthopaedics & Fractures 10th Ed", author: "Louis Solomon", publisher: "Taylor & Francis", price: 4999, mrp: 6999, edition: "10th Ed", featured: true, matchTags: ["Apley Solomon","orthopaedics"] },
              { name: "Maheshwari Essential Orthopaedics 5th Ed", author: "J Maheshwari", publisher: "Mehta Publishers", price: 1299, mrp: 1699, edition: "5th Ed", matchTags: ["Maheshwari","orthopaedics","India"] },
              { name: "Clinical Orthopaedic Examination 6th Ed", author: "Ronald McRae", publisher: "Churchill Livingstone", price: 3499, mrp: 4799, edition: "6th Ed", matchTags: ["McRae","orthopaedic examination"] },
            ],
          },
          {
            id: "ms-y1-ent",
            name: "ENT Surgery — Year 1",
            color: "#AF52DE",
            books: [
              { name: "Dhingra Diseases of Ear Nose & Throat 7th Ed", author: "PL Dhingra", publisher: "Elsevier", price: 1299, mrp: 1699, edition: "7th Ed", featured: true, matchTags: ["Dhingra","ENT","India"] },
              { name: "Flint Cummings Essential Otolaryngology 12th Ed", author: "K. Lee", publisher: "McGraw-Hill", price: 6999, mrp: 9499, edition: "12th Ed", matchTags: ["Flint","essential otolaryngology"] },
              { name: "Logan Turner's Diseases of the Nose, Throat & Ear 11th Ed", author: "Hall & Clarke", publisher: "Hodder Arnold", price: 4999, mrp: 6699, edition: "11th Ed", matchTags: ["Logan Turner","ENT"] },
            ],
          },
          {
            id: "ms-y1-ophth",
            name: "Ophthalmology — Year 1",
            color: "#32ADE6",
            books: [
              { name: "AK Khurana Comprehensive Ophthalmology 7th Ed", author: "AK Khurana", publisher: "CBS Publishers", price: 1699, mrp: 2299, edition: "7th Ed", featured: true, matchTags: ["AK Khurana","ophthalmology","India"] },
              { name: "Clinical Ophthalmology: A Systematic Approach 9th Ed", author: "Jack Kanski", publisher: "Elsevier", price: 5999, mrp: 7999, edition: "9th Ed", matchTags: ["Kanski clinical","ophthalmology"] },
              { name: "Parson's Diseases of the Eye 23rd Ed", author: "Ramanjit Sihota & Radhika Tandon", publisher: "Elsevier", price: 1499, mrp: 1999, edition: "23rd Ed", matchTags: ["Parson","diseases eye","India"] },
            ],
          },
          {
            id: "ms-y1-obgyn",
            name: "Obstetrics & Gynaecology — Year 1",
            color: "#FF2D92",
            books: [
              { name: "DC Dutta Textbook of Obstetrics 9th Ed", author: "Hiralal Konar", publisher: "Jaypee Brothers", price: 1699, mrp: 2299, edition: "9th Ed", featured: true, matchTags: ["DC Dutta","obstetrics","India"] },
              { name: "Shaw's Textbook of Gynaecology 17th Ed", author: "VG Padubidri & Shirish Daftary", publisher: "Elsevier", price: 1799, mrp: 2399, edition: "17th Ed", matchTags: ["Shaw","gynaecology","India"] },
              { name: "Mahajan & Rangnekar Diagnosis & Management 4th Ed", author: "Mahajan & Rangnekar", publisher: "Jaypee Brothers", price: 999, mrp: 1399, edition: "4th Ed", matchTags: ["Mahajan","gynaecology","India"] },
            ],
          },
        ],
      },

      // ── MS Year 2 ───────────────────────────────────────────────────
      {
        id: "ms-year2",
        label: "Year 2",
        subjects: [
          {
            id: "ms-y2-general",
            name: "General Surgery — Year 2",
            color: "#FF6B35",
            books: [
              { name: "Sabiston Textbook of Surgery 21st Ed", author: "Townsend, Beauchamp, Evers", publisher: "Elsevier", price: 9999, mrp: 13999, edition: "21st Ed", featured: true, matchTags: ["Sabiston","surgery"] },
              { name: "Schwartz's Principles of Surgery 11th Ed", author: "Brunicardi, Andersen, Billiar", publisher: "McGraw-Hill", price: 8999, mrp: 11999, edition: "11th Ed", matchTags: ["Schwartz","surgery"] },
              { name: "Maingot's Abdominal Operations 12th Ed", author: "Zinner & Ashley", publisher: "McGraw-Hill", price: 8999, mrp: 11999, edition: "12th Ed", matchTags: ["Maingot","abdominal surgery"] },
              { name: "Surgical Oncology: A Practical & Comprehensive Approach 1st Ed", author: "Tanabe & Edge", publisher: "Springer", price: 6999, mrp: 9499, edition: "1st Ed", matchTags: ["surgical oncology","Tanabe"] },
            ],
          },
          {
            id: "ms-y2-ortho",
            name: "Orthopaedics — Year 2",
            color: "#8E7355",
            books: [
              { name: "Watson-Jones Fractures & Joint Injuries 8th Ed", author: "Bucholz, Heckman, Court-Brown", publisher: "Elsevier", price: 8999, mrp: 11999, edition: "8th Ed", featured: true, matchTags: ["Watson-Jones","fractures"] },
              { name: "Rockwood & Green's Fractures in Adults 9th Ed", author: "Heckman, Tornetta, McKee", publisher: "Wolters Kluwer", price: 9999, mrp: 13999, edition: "9th Ed", matchTags: ["Rockwood Green","fractures"] },
              { name: "AO Manual of Fracture Management 2nd Ed", author: "Rüedi, Murphy", publisher: "Thieme", price: 7999, mrp: 10499, edition: "2nd Ed", matchTags: ["AO Manual","fracture","orthopaedics"] },
            ],
          },
          {
            id: "ms-y2-ent",
            name: "ENT Surgery — Year 2",
            color: "#AF52DE",
            books: [
              { name: "Cummings Otolaryngology Head & Neck Surgery 7th Ed", author: "Flint, Haughey, Lund", publisher: "Elsevier", price: 15999, mrp: 21999, edition: "7th Ed", featured: true, matchTags: ["Cummings","otolaryngology"] },
              { name: "Scott-Brown's Otorhinolaryngology 8th Ed", author: "Watkinson & Clarke", publisher: "Taylor & Francis", price: 12999, mrp: 17999, edition: "8th Ed", matchTags: ["Scott-Brown","ENT"] },
              { name: "Ballenger's Otorhinolaryngology 18th Ed", author: "James Snow Jr", publisher: "PMPH USA", price: 9999, mrp: 13999, edition: "18th Ed", matchTags: ["Ballenger","ENT"] },
            ],
          },
          {
            id: "ms-y2-ophth",
            name: "Ophthalmology — Year 2",
            color: "#32ADE6",
            books: [
              { name: "Kanski's Clinical Ophthalmology 9th Ed", author: "Brad Bowling", publisher: "Elsevier", price: 6499, mrp: 8999, edition: "9th Ed", featured: true, matchTags: ["Kanski","ophthalmology"] },
              { name: "Yanoff & Duker Ophthalmology 5th Ed", author: "Myron Yanoff & Jay Duker", publisher: "Elsevier", price: 8999, mrp: 11999, edition: "5th Ed", matchTags: ["Yanoff","ophthalmology"] },
              { name: "Duke-Elder's System of Ophthalmology Vol 1-15", author: "Sir Stewart Duke-Elder", publisher: "Henry Kimpton", price: 9999, mrp: 12999, edition: "15 Vol Set", matchTags: ["Duke-Elder","ophthalmology"] },
            ],
          },
          {
            id: "ms-y2-obgyn",
            name: "Obstetrics & Gynaecology — Year 2",
            color: "#FF2D92",
            books: [
              { name: "Williams Obstetrics 26th Ed", author: "Cunningham, Leveno, Dashe", publisher: "McGraw-Hill", price: 8999, mrp: 11999, edition: "26th Ed", featured: true, matchTags: ["Williams","obstetrics"] },
              { name: "Novak's Gynecology 16th Ed", author: "Berek & Novak", publisher: "Wolters Kluwer", price: 7999, mrp: 10999, edition: "16th Ed", matchTags: ["Novak","gynecology"] },
              { name: "Comprehensive Gynecology 8th Ed", author: "Lobo, Gershenson, Lentz", publisher: "Elsevier", price: 7499, mrp: 9999, edition: "8th Ed", matchTags: ["Comprehensive Gynecology"] },
            ],
          },
        ],
      },

      // ── MS Year 3 ───────────────────────────────────────────────────
      {
        id: "ms-year3",
        label: "Year 3",
        subjects: [
          {
            id: "ms-y3-general",
            name: "General Surgery — Year 3",
            color: "#FF6B35",
            books: [
              { name: "Mastery of Surgery 7th Ed", author: "Fischer et al.", publisher: "Wolters Kluwer", price: 9999, mrp: 13499, edition: "7th Ed", featured: true, matchTags: ["Mastery","surgery"] },
              { name: "Colorectal Surgery: A Companion to Specialist Surgical Practice 6th Ed", author: "Hartley & Monson", publisher: "Elsevier", price: 6999, mrp: 9499, edition: "6th Ed", matchTags: ["colorectal surgery","Hartley"] },
              { name: "Hepatobiliary & Pancreatic Surgery 5th Ed", author: "Garden, Parks, Wigmore", publisher: "Elsevier", price: 8999, mrp: 11999, edition: "5th Ed", matchTags: ["hepatobiliary","pancreatic surgery"] },
              { name: "Vascular & Endovascular Surgery 6th Ed", author: "Donnelly & Wyatt", publisher: "Elsevier", price: 6999, mrp: 9499, edition: "6th Ed", matchTags: ["vascular","endovascular surgery"] },
            ],
          },
          {
            id: "ms-y3-ortho",
            name: "Orthopaedics — Year 3",
            color: "#8E7355",
            books: [
              { name: "Campbell's Operative Orthopaedics 14th Ed", author: "Azar, Beaty, Canale", publisher: "Elsevier", price: 14999, mrp: 19999, edition: "14th Ed", featured: true, matchTags: ["Campbell","operative orthopaedics"] },
              { name: "Spine Surgery 4th Ed", author: "Bradford & Zdeblick", publisher: "Thieme", price: 7999, mrp: 10499, edition: "4th Ed", matchTags: ["spine surgery","Bradford"] },
              { name: "Revision Total Hip & Knee Arthroplasty 2nd Ed", author: "Bono & Scott", publisher: "Wolters Kluwer", price: 6999, mrp: 9299, edition: "2nd Ed", matchTags: ["revision arthroplasty","hip knee"] },
            ],
          },
          {
            id: "ms-y3-ent",
            name: "ENT Surgery — Year 3",
            color: "#AF52DE",
            books: [
              { name: "Endoscopic Sinus Surgery 3rd Ed", author: "Schaefer & Close", publisher: "Thieme", price: 5999, mrp: 7999, edition: "3rd Ed", featured: true, matchTags: ["endoscopic sinus surgery","ENT"] },
              { name: "Otosclerosis & Stapes Surgery 2nd Ed", author: "Häusler", publisher: "Karger", price: 4999, mrp: 6999, edition: "2nd Ed", matchTags: ["otosclerosis","stapes surgery"] },
              { name: "Head & Neck Surgery: Otolaryngology 6th Ed", author: "Byron Bailey", publisher: "Wolters Kluwer", price: 9999, mrp: 13499, edition: "6th Ed", matchTags: ["head neck surgery","Bailey","otolaryngology"] },
            ],
          },
          {
            id: "ms-y3-ophth",
            name: "Ophthalmology — Year 3",
            color: "#32ADE6",
            books: [
              { name: "American Academy of Ophthalmology BCSC Complete Set", author: "AAO", publisher: "AAO Publications", price: 19999, mrp: 27999, edition: "2024 Ed", featured: true, matchTags: ["AAO","BCSC","ophthalmology"] },
              { name: "Ryan's Retina 6th Ed", author: "SJ Ryan", publisher: "Elsevier", price: 12999, mrp: 17999, edition: "6th Ed", matchTags: ["Ryan","retina","ophthalmology"] },
              { name: "The Wills Eye Manual 8th Ed", author: "Halepas et al.", publisher: "Wolters Kluwer", price: 3999, mrp: 5299, edition: "8th Ed", matchTags: ["Wills Eye","manual","ophthalmology"] },
            ],
          },
          {
            id: "ms-y3-obgyn",
            name: "Obstetrics & Gynaecology — Year 3",
            color: "#FF2D92",
            books: [
              { name: "Te Linde's Operative Gynecology 12th Ed", author: "Rock, Howard, Joanes", publisher: "Wolters Kluwer", price: 9999, mrp: 13999, edition: "12th Ed", featured: true, matchTags: ["Te Linde","operative gynecology"] },
              { name: "Maternal Fetal Medicine 8th Ed", author: "Resnik, Lockwood, Moore", publisher: "Elsevier", price: 8999, mrp: 12499, edition: "8th Ed", matchTags: ["maternal fetal medicine","MFM"] },
              { name: "Gynecologic Oncology 6th Ed", author: "Di Saia & Creasman", publisher: "Elsevier", price: 7999, mrp: 10499, edition: "6th Ed", matchTags: ["gynecologic oncology","Di Saia"] },
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
      // ── MCh Year 1 ──────────────────────────────────────────────────
      {
        id: "mch-year1",
        label: "Year 1",
        subjects: [
          {
            id: "mch-y1-foundation",
            name: "Super-Specialty Foundation",
            color: "#636366",
            books: [
              { name: "Clinical Research Methodology & Biostatistics 4th Ed", author: "PK Sashidharan", publisher: "Jaypee Brothers", price: 1299, mrp: 1799, edition: "4th Ed", featured: true, matchTags: ["clinical research","biostatistics","PG"] },
              { name: "Perioperative Medicine: The Pathophysiologic Basis 1st Ed", author: "Micheal Mythen", publisher: "Churchill Livingstone", price: 4999, mrp: 6499, edition: "1st Ed", matchTags: ["perioperative","medicine","pathophysiology"] },
            ],
          },
          {
            id: "mch-y1-neuro",
            name: "Neurosurgery — Year 1",
            color: "#5856D6",
            books: [
              { name: "Rengachary Principles of Neurosurgery 3rd Ed", author: "Rengachary & Ellenbogen", publisher: "Elsevier", price: 9999, mrp: 13999, edition: "3rd Ed", featured: true, matchTags: ["Rengachary","neurosurgery"] },
              { name: "Greenberg Handbook of Neurosurgery 9th Ed", author: "Mark Greenberg", publisher: "Thieme", price: 5999, mrp: 7999, edition: "9th Ed", matchTags: ["Greenberg","neurosurgery"] },
              { name: "Netter's Neuroscience 3rd Ed", author: "David Felten et al.", publisher: "Elsevier", price: 4999, mrp: 6699, edition: "3rd Ed", matchTags: ["Netter","neuroscience"] },
            ],
          },
          {
            id: "mch-y1-cardio",
            name: "Cardiothoracic Surgery — Year 1",
            color: "#FF3B30",
            books: [
              { name: "Sabiston & Spencer Surgery of the Chest 8th Ed", author: "Frank Sellke et al.", publisher: "Elsevier", price: 12999, mrp: 17999, edition: "8th Ed", featured: true, matchTags: ["Sabiston Spencer","chest surgery"] },
              { name: "Cohn Cardiac Surgery in the Adult 5th Ed", author: "Lawrence H. Cohn", publisher: "McGraw-Hill", price: 9999, mrp: 13499, edition: "5th Ed", matchTags: ["Cohn","cardiac surgery"] },
              { name: "Thoracic Surgery Clinics 2024 — Key Topics", author: "Various", publisher: "Elsevier", price: 2999, mrp: 3999, edition: "2024 Ed", matchTags: ["thoracic surgery","clinics"] },
            ],
          },
          {
            id: "mch-y1-plastic",
            name: "Plastic Surgery — Year 1",
            color: "#FF9500",
            books: [
              { name: "Principles of Plastic Surgery McCarthy 2nd Ed", author: "Joseph G McCarthy", publisher: "Saunders", price: 12999, mrp: 17999, edition: "2nd Ed", featured: true, matchTags: ["McCarthy","plastic surgery"] },
              { name: "Plastic Surgery: Principles & Practice 2nd Ed", author: "Neligan, Rodriguez, Losee", publisher: "Elsevier", price: 9999, mrp: 13499, edition: "2nd Ed", matchTags: ["Neligan","plastic surgery"] },
            ],
          },
          {
            id: "mch-y1-urology",
            name: "Urology — Year 1",
            color: "#FF9500",
            books: [
              { name: "Smith & Tanagho General Urology 18th Ed", author: "McAninch & Lue", publisher: "McGraw-Hill", price: 5999, mrp: 7999, edition: "18th Ed", featured: true, matchTags: ["Smith Tanagho","urology"] },
              { name: "EAU Guidelines on Urological Infections 2024", author: "EAU", publisher: "EAU Publications", price: 999, mrp: 1499, edition: "2024 Ed", matchTags: ["EAU","guidelines","urology"] },
              { name: "Urosurgical Anatomy Atlas 2nd Ed", author: "John Libertino", publisher: "Elsevier", price: 5999, mrp: 7999, edition: "2nd Ed", matchTags: ["urosurgical","anatomy atlas"] },
            ],
          },
          {
            id: "mch-y1-paed",
            name: "Paediatric Surgery — Year 1",
            color: "#FF2D92",
            books: [
              { name: "O'Neill's Pediatric Surgery 6th Ed", author: "Coran et al.", publisher: "Elsevier", price: 12999, mrp: 17999, edition: "6th Ed", featured: true, matchTags: ["O'Neill","pediatric surgery"] },
              { name: "Pediatric Surgical Oncology 2nd Ed", author: "Andrassy", publisher: "Elsevier", price: 6999, mrp: 9299, edition: "2nd Ed", matchTags: ["pediatric surgical oncology","Andrassy"] },
            ],
          },
          {
            id: "mch-y1-onco",
            name: "Surgical Oncology — Year 1",
            color: "#00C2A8",
            books: [
              { name: "AJCC Cancer Staging Manual 9th Ed", author: "American Joint Committee on Cancer", publisher: "Springer", price: 4999, mrp: 6499, edition: "9th Ed", featured: true, matchTags: ["AJCC","cancer staging"] },
              { name: "NCCN Clinical Practice Guidelines in Oncology 2024", author: "NCCN", publisher: "NCCN Publications", price: 2999, mrp: 3999, edition: "2024 Ed", matchTags: ["NCCN","oncology","guidelines"] },
              { name: "Surgical Pathology of the GI Tract & Liver 3rd Ed", author: "Odze & Goldblum", publisher: "Elsevier", price: 9999, mrp: 13499, edition: "3rd Ed", matchTags: ["surgical pathology","GI tract","Odze"] },
            ],
          },
        ],
      },

      // ── MCh Year 2 ──────────────────────────────────────────────────
      {
        id: "mch-year2",
        label: "Year 2",
        subjects: [
          {
            id: "mch-y2-neuro",
            name: "Neurosurgery — Year 2",
            color: "#5856D6",
            books: [
              { name: "Youmans & Winn Neurological Surgery 7th Ed", author: "H. Richard Winn", publisher: "Elsevier", price: 19999, mrp: 27999, edition: "7th Ed", featured: true, matchTags: ["Youmans","neurosurgery"] },
              { name: "Spinal Instrumentation: Surgical Techniques 2nd Ed", author: "Haid et al.", publisher: "Thieme", price: 7999, mrp: 10499, edition: "2nd Ed", matchTags: ["spinal instrumentation","neurosurgery"] },
              { name: "Operative Neurosurgery 2nd Ed", author: "Cohen, Haines, Rengachary", publisher: "Wolters Kluwer", price: 9999, mrp: 13499, edition: "2nd Ed", matchTags: ["operative neurosurgery"] },
            ],
          },
          {
            id: "mch-y2-cardio",
            name: "Cardiothoracic Surgery — Year 2",
            color: "#FF3B30",
            books: [
              { name: "Kirklin/Barratt-Boyes Cardiac Surgery 4th Ed", author: "Kirklin, Barratt-Boyes", publisher: "Elsevier", price: 14999, mrp: 19999, edition: "4th Ed", featured: true, matchTags: ["Kirklin","cardiac surgery"] },
              { name: "Atlas of Cardiac Surgery 2nd Ed", author: "Quaegebeur & Ravekes", publisher: "Springer", price: 8999, mrp: 11999, edition: "2nd Ed", matchTags: ["atlas","cardiac surgery"] },
              { name: "Congenital Heart Disease in Adults 4th Ed", author: "Warnes & Webb", publisher: "Elsevier", price: 7999, mrp: 10499, edition: "4th Ed", matchTags: ["congenital heart disease","adults"] },
            ],
          },
          {
            id: "mch-y2-plastic",
            name: "Plastic Surgery — Year 2",
            color: "#FF9500",
            books: [
              { name: "Grabb and Smith's Plastic Surgery 7th Ed", author: "Thorne et al.", publisher: "Wolters Kluwer", price: 9999, mrp: 13999, edition: "7th Ed", featured: true, matchTags: ["Grabb Smith","plastic surgery"] },
              { name: "Mathes & Nahai Flap Reconstruction 2nd Ed", author: "Mathes & Nahai", publisher: "Elsevier", price: 14999, mrp: 19999, edition: "2nd Ed", matchTags: ["Mathes Nahai","flap","plastic surgery"] },
              { name: "Burn Surgery: The Management of Difficult Wounds", author: "Lee et al.", publisher: "Springer", price: 5999, mrp: 7999, edition: "1st Ed", matchTags: ["burn surgery","wound management"] },
            ],
          },
          {
            id: "mch-y2-urology",
            name: "Urology — Year 2",
            color: "#FF9500",
            books: [
              { name: "Campbell-Walsh-Wein Urology 12th Ed", author: "Partin, Dmochowski, Kavoussi", publisher: "Elsevier", price: 19999, mrp: 26999, edition: "12th Ed", featured: true, matchTags: ["Campbell Walsh","urology"] },
              { name: "Hinman's Atlas of Urologic Surgery 4th Ed", author: "Hinman, Droller", publisher: "Elsevier", price: 9999, mrp: 13999, edition: "4th Ed", matchTags: ["Hinman","urologic surgery"] },
              { name: "Laparoscopic Urology 2nd Ed", author: "Ralph Clayman", publisher: "McGraw-Hill", price: 6999, mrp: 9299, edition: "2nd Ed", matchTags: ["laparoscopic urology","Clayman"] },
            ],
          },
          {
            id: "mch-y2-paed",
            name: "Paediatric Surgery — Year 2",
            color: "#FF2D92",
            books: [
              { name: "Ashcraft's Pediatric Surgery 6th Ed", author: "Holcomb, Murphy, Ostlie", publisher: "Elsevier", price: 9999, mrp: 13999, edition: "6th Ed", featured: true, matchTags: ["Ashcraft","pediatric surgery"] },
              { name: "Spitz & Coran Operative Pediatric Surgery 7th Ed", author: "Spitz & Coran", publisher: "Taylor & Francis", price: 9999, mrp: 13999, edition: "7th Ed", matchTags: ["Spitz Coran","pediatric surgery"] },
              { name: "Paediatric Urology 2nd Ed", author: "Woodhouse & Wilcox", publisher: "Elsevier", price: 6999, mrp: 9299, edition: "2nd Ed", matchTags: ["paediatric urology","Woodhouse"] },
            ],
          },
          {
            id: "mch-y2-onco",
            name: "Surgical Oncology — Year 2",
            color: "#00C2A8",
            books: [
              { name: "DeVita Hellman & Rosenberg's Cancer 11th Ed", author: "DeVita, Lawrence, Rosenberg", publisher: "Wolters Kluwer", price: 14999, mrp: 19999, edition: "11th Ed", featured: true, matchTags: ["DeVita","cancer"] },
              { name: "Bland & Copeland The Breast 5th Ed", author: "Bland & Copeland", publisher: "Elsevier", price: 9999, mrp: 13499, edition: "5th Ed", matchTags: ["Bland Copeland","breast surgery"] },
              { name: "Atlas of Surgical Oncology 2nd Ed", author: "Cameron, Sandone", publisher: "Wolters Kluwer", price: 7999, mrp: 10499, edition: "2nd Ed", matchTags: ["surgical oncology atlas"] },
            ],
          },
        ],
      },

      // ── MCh Year 3 ──────────────────────────────────────────────────
      {
        id: "mch-year3",
        label: "Year 3",
        subjects: [
          {
            id: "mch-y3-neuro",
            name: "Neurosurgery — Year 3",
            color: "#5856D6",
            books: [
              { name: "Principles of Stereotactic Neurosurgery 2nd Ed", author: "Lozano & Gildenberg", publisher: "Springer", price: 7999, mrp: 10499, edition: "2nd Ed", featured: true, matchTags: ["stereotactic","neurosurgery","Lozano"] },
              { name: "Endovascular Neurosurgery 2nd Ed", author: "Higashida & Niimi", publisher: "Thieme", price: 6999, mrp: 9299, edition: "2nd Ed", matchTags: ["endovascular neurosurgery"] },
              { name: "Neuro-ICU Book 2nd Ed", author: "Wijdicks", publisher: "McGraw-Hill", price: 4999, mrp: 6699, edition: "2nd Ed", matchTags: ["neuro ICU","Wijdicks"] },
            ],
          },
          {
            id: "mch-y3-cardio",
            name: "Cardiothoracic Surgery — Year 3",
            color: "#FF3B30",
            books: [
              { name: "Surgical Treatment of Heart Failure 2nd Ed", author: "Panza & Bonow", publisher: "Springer", price: 6999, mrp: 9299, edition: "2nd Ed", featured: true, matchTags: ["heart failure","surgical treatment"] },
              { name: "Transcatheter Aortic Valve Implantation 2nd Ed", author: "Lefèvre & Serruys", publisher: "PCR Publishing", price: 5999, mrp: 7999, edition: "2nd Ed", matchTags: ["TAVI","aortic valve","transcatheter"] },
              { name: "Mechanical Circulatory Support 2nd Ed", author: "Arabia & Joyce", publisher: "Springer", price: 5499, mrp: 7299, edition: "2nd Ed", matchTags: ["mechanical circulatory support","LVAD"] },
            ],
          },
          {
            id: "mch-y3-plastic",
            name: "Plastic Surgery — Year 3",
            color: "#FF9500",
            books: [
              { name: "Microsurgery: Free Tissue Transfer & Replantation 2nd Ed", author: "Wei & Mardini", publisher: "Elsevier", price: 9999, mrp: 13499, edition: "2nd Ed", featured: true, matchTags: ["microsurgery","free flap","replantation"] },
              { name: "Craniofacial Surgery 2nd Ed", author: "Tessier et al.", publisher: "Elsevier", price: 8999, mrp: 11999, edition: "2nd Ed", matchTags: ["craniofacial surgery","Tessier"] },
              { name: "Aesthetic Surgery of the Face 2nd Ed", author: "Nahai & Nahai", publisher: "Thieme", price: 7999, mrp: 10499, edition: "2nd Ed", matchTags: ["aesthetic surgery","face","rhinoplasty"] },
            ],
          },
          {
            id: "mch-y3-urology",
            name: "Urology — Year 3",
            color: "#FF9500",
            books: [
              { name: "Robotic Urologic Surgery 3rd Ed", author: "Patel et al.", publisher: "Springer", price: 7999, mrp: 10499, edition: "3rd Ed", featured: true, matchTags: ["robotic urology","Patel"] },
              { name: "Urodynamics Made Easy 4th Ed", author: "WF Abrams", publisher: "Elsevier", price: 3499, mrp: 4699, edition: "4th Ed", matchTags: ["urodynamics","Abrams"] },
              { name: "Reconstructive Urology 2nd Ed", author: "Graham", publisher: "Elsevier", price: 6499, mrp: 8699, edition: "2nd Ed", matchTags: ["reconstructive urology","Graham"] },
            ],
          },
          {
            id: "mch-y3-paed",
            name: "Paediatric Surgery — Year 3",
            color: "#FF2D92",
            books: [
              { name: "Operative Pediatric Surgery 8th Ed", author: "Lister & Irving", publisher: "Taylor & Francis", price: 9999, mrp: 13499, edition: "8th Ed", featured: true, matchTags: ["operative pediatric surgery","Lister"] },
              { name: "Pediatric Minimally Invasive Surgery 2nd Ed", author: "Georgeson & Owings", publisher: "Springer", price: 5999, mrp: 7999, edition: "2nd Ed", matchTags: ["pediatric minimally invasive surgery"] },
              { name: "Pediatric Liver Transplantation 1st Ed", author: "McDiarmid", publisher: "Elsevier", price: 5499, mrp: 7299, edition: "1st Ed", matchTags: ["pediatric liver transplant","McDiarmid"] },
            ],
          },
          {
            id: "mch-y3-onco",
            name: "Surgical Oncology — Year 3",
            color: "#00C2A8",
            books: [
              { name: "Hepatobiliary Cancers: ESMO Clinical Practice Guidelines 2024", author: "ESMO", publisher: "ESMO Publications", price: 1999, mrp: 2699, edition: "2024 Ed", featured: true, matchTags: ["hepatobiliary cancer","ESMO","guidelines"] },
              { name: "Cytoreductive Surgery & Hyperthermic Intraperitoneal Chemotherapy", author: "Sugarbaker", publisher: "Jones & Bartlett", price: 6999, mrp: 9299, edition: "3rd Ed", matchTags: ["HIPEC","cytoreductive surgery","Sugarbaker"] },
              { name: "Robotic Surgery in Oncology 1st Ed", author: "Marescaux", publisher: "Springer", price: 6499, mrp: 8699, edition: "1st Ed", matchTags: ["robotic surgery","oncology","Marescaux"] },
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
      // ── DM Year 1 ───────────────────────────────────────────────────
      {
        id: "dm-year1",
        label: "Year 1",
        subjects: [
          {
            id: "dm-y1-common",
            name: "Super-Specialty Foundation",
            color: "#636366",
            books: [
              { name: "ICMR Ethical Guidelines for Biomedical & Health Research 2017", author: "ICMR", publisher: "ICMR Publications", price: 499, mrp: 699, edition: "2017 Ed", featured: true, matchTags: ["ICMR","biomedical research","ethics","DM"] },
              { name: "Medical Statistics from Scratch 4th Ed", author: "David Bowers", publisher: "Wiley", price: 2999, mrp: 3999, edition: "4th Ed", matchTags: ["medical statistics","Bowers"] },
              { name: "How to Read a Paper: Evidence-Based Medicine 6th Ed", author: "Trisha Greenhalgh", publisher: "Wiley-Blackwell", price: 2499, mrp: 3299, edition: "6th Ed", matchTags: ["evidence based medicine","Greenhalgh","how to read paper"] },
            ],
          },
          {
            id: "dm-y1-cardio",
            name: "Cardiology — Year 1",
            color: "#FF3B30",
            books: [
              { name: "Hurst's The Heart 15th Ed", author: "Fuster, Harrington, Narula", publisher: "McGraw-Hill", price: 9999, mrp: 13499, edition: "15th Ed", featured: true, matchTags: ["Hurst","heart"] },
              { name: "Chou's Electrocardiography in Clinical Practice 6th Ed", author: "Surawicz & Knilans", publisher: "Elsevier", price: 4999, mrp: 6499, edition: "6th Ed", matchTags: ["Chou","ECG","electrocardiography"] },
              { name: "ESC Textbook of Cardiovascular Medicine 3rd Ed", author: "Camm, Lüscher, Maurer", publisher: "Oxford University Press", price: 8999, mrp: 11999, edition: "3rd Ed", matchTags: ["ESC","cardiovascular"] },
              { name: "Echocardiography Board Review 3rd Ed", author: "Ragavendra Baliga", publisher: "Wiley-Blackwell", price: 3999, mrp: 5299, edition: "3rd Ed", matchTags: ["echocardiography","board review"] },
            ],
          },
          {
            id: "dm-y1-neuro",
            name: "Neurology — Year 1",
            color: "#5856D6",
            books: [
              { name: "Hauser's Harrison's Neurology 4th Ed", author: "Stephen Hauser", publisher: "McGraw-Hill", price: 5999, mrp: 7999, edition: "4th Ed", featured: true, matchTags: ["Hauser","neurology"] },
              { name: "Rowland & Pedley Merritt's Neurology 14th Ed", author: "Lewis Rowland", publisher: "Wolters Kluwer", price: 5999, mrp: 7999, edition: "14th Ed", matchTags: ["Merritt","neurology"] },
              { name: "Clinical Neurology for Psychiatrists 8th Ed", author: "David Kaufman", publisher: "Elsevier", price: 4999, mrp: 6699, edition: "8th Ed", matchTags: ["clinical neurology","psychiatrists","Kaufman"] },
            ],
          },
          {
            id: "dm-y1-gastro",
            name: "Gastroenterology — Year 1",
            color: "#FF9500",
            books: [
              { name: "Makharia & Ahuja Textbook of Gastroenterology 2nd Ed", author: "Makharia, Ahuja", publisher: "CBS Publishers", price: 3999, mrp: 5299, edition: "2nd Ed", featured: true, matchTags: ["Makharia","gastroenterology","India"] },
              { name: "Pocket Guide to Gastrointestinal Drugs 1st Ed", author: "Blonski & Lichtenstein", publisher: "Wiley-Blackwell", price: 2999, mrp: 3999, edition: "1st Ed", matchTags: ["GI drugs","gastroenterology","pocket guide"] },
              { name: "Clinical Gastroenterology 5th Ed", author: "Howard Spiro", publisher: "Elsevier", price: 4999, mrp: 6699, edition: "5th Ed", matchTags: ["clinical gastroenterology","Spiro"] },
            ],
          },
          {
            id: "dm-y1-nephro",
            name: "Nephrology — Year 1",
            color: "#007AFF",
            books: [
              { name: "Clinical Nephrology by Berl & Bonventre 2nd Ed", author: "Tomas Berl", publisher: "Atlas Medical Publishing", price: 5999, mrp: 7999, edition: "2nd Ed", featured: true, matchTags: ["Berl","nephrology"] },
              { name: "Pocket Companion to Brenner & Rector's The Kidney 9th Ed", author: "Taal et al.", publisher: "Elsevier", price: 3999, mrp: 5299, edition: "9th Ed", matchTags: ["Brenner Rector pocket","nephrology"] },
              { name: "Dialysis Therapy 3rd Ed", author: "Nissenson & Fine", publisher: "Hanley & Belfus", price: 4999, mrp: 6699, edition: "3rd Ed", matchTags: ["dialysis","therapy","nephrology"] },
            ],
          },
          {
            id: "dm-y1-endo",
            name: "Endocrinology — Year 1",
            color: "#FFD60A",
            books: [
              { name: "Greenspan's Basic & Clinical Endocrinology 10th Ed", author: "Shoback & Gardner", publisher: "McGraw-Hill", price: 5999, mrp: 7999, edition: "10th Ed", featured: true, matchTags: ["Greenspan","endocrinology"] },
              { name: "Braverman & Cooper Werner & Ingbar The Thyroid 11th Ed", author: "Braverman & Cooper", publisher: "Wolters Kluwer", price: 7999, mrp: 10499, edition: "11th Ed", matchTags: ["Braverman Cooper","thyroid"] },
              { name: "Goljan Rapid Review: Endocrinology 3rd Ed", author: "Edward Goljan", publisher: "Elsevier", price: 2999, mrp: 3999, edition: "3rd Ed", matchTags: ["Goljan","endocrinology","rapid review"] },
            ],
          },
          {
            id: "dm-y1-pulmo",
            name: "Pulmonology — Year 1",
            color: "#5AC8FA",
            books: [
              { name: "GOLD COPD Global Initiative Guidelines 2024", author: "GOLD Committee", publisher: "GOLD Publications", price: 999, mrp: 1499, edition: "2024 Ed", featured: true, matchTags: ["GOLD","COPD","guidelines"] },
              { name: "GINA Asthma Guidelines 2024", author: "GINA Committee", publisher: "GINA Publications", price: 999, mrp: 1499, edition: "2024 Ed", matchTags: ["GINA","asthma"] },
              { name: "Clinical Respiratory Medicine 4th Ed", author: "Spiro, Silvestri, Agusti", publisher: "Elsevier", price: 7999, mrp: 10499, edition: "4th Ed", matchTags: ["clinical respiratory","medicine","Spiro"] },
            ],
          },
          {
            id: "dm-y1-haem",
            name: "Haematology — Year 1",
            color: "#FF3B30",
            books: [
              { name: "Hoffbrand & Steensma Essential Haematology 8th Ed", author: "AV Hoffbrand", publisher: "Wiley-Blackwell", price: 4999, mrp: 6499, edition: "8th Ed", featured: true, matchTags: ["Hoffbrand","haematology"] },
              { name: "Lee's Synopsis of Haematology 3rd Ed", author: "Lee, Bain, Provan", publisher: "Oxford University Press", price: 3999, mrp: 5299, edition: "3rd Ed", matchTags: ["Lee's","haematology"] },
              { name: "Blood Transfusion in Clinical Practice 1st Ed", author: "Misra et al.", publisher: "InTech", price: 1999, mrp: 2699, edition: "1st Ed", matchTags: ["blood transfusion","clinical practice"] },
            ],
          },
          {
            id: "dm-y1-rheuma",
            name: "Rheumatology — Year 1",
            color: "#FF6B35",
            books: [
              { name: "Oxford Textbook of Rheumatology 5th Ed", author: "Watts, Conaghan, Doherty", publisher: "Oxford University Press", price: 6999, mrp: 9499, edition: "5th Ed", featured: true, matchTags: ["Oxford","rheumatology"] },
              { name: "Dubois' Lupus Erythematosus & Related Syndromes 9th Ed", author: "Wallace & Hahn", publisher: "Elsevier", price: 7999, mrp: 10499, edition: "9th Ed", matchTags: ["Dubois","lupus","rheumatology"] },
              { name: "Rheumatology Secrets 4th Ed", author: "Sterling West", publisher: "Elsevier", price: 3999, mrp: 5299, edition: "4th Ed", matchTags: ["rheumatology secrets","West"] },
            ],
          },
          {
            id: "dm-y1-onco",
            name: "Medical Oncology — Year 1",
            color: "#00C2A8",
            books: [
              { name: "NCCN Clinical Practice Guidelines in Oncology 2024", author: "NCCN", publisher: "NCCN Publications", price: 2999, mrp: 3999, edition: "2024 Ed", featured: true, matchTags: ["NCCN","oncology","guidelines"] },
              { name: "Oxford American Oncology Library 4-Vol Set", author: "Oxford Medicine", publisher: "Oxford University Press", price: 6999, mrp: 9299, edition: "2023 Ed", matchTags: ["Oxford","oncology library"] },
              { name: "Oncology Board Review 4th Ed", author: "Preston Gable", publisher: "Demos Medical", price: 3499, mrp: 4799, edition: "4th Ed", matchTags: ["oncology board review","Gable"] },
            ],
          },
        ],
      },

      // ── DM Year 2 ───────────────────────────────────────────────────
      {
        id: "dm-year2",
        label: "Year 2",
        subjects: [
          {
            id: "dm-y2-cardio",
            name: "Cardiology — Year 2",
            color: "#FF3B30",
            books: [
              { name: "Braunwald's Heart Disease 12th Ed (2-Vol)", author: "Libby, Bonow, Mann", publisher: "Elsevier", price: 12999, mrp: 17999, edition: "12th Ed", featured: true, matchTags: ["Braunwald","heart disease"] },
              { name: "Clinical Cardiac Pacing Defibrillation & Resynchronization 4th Ed", author: "Ellenbogen, Wilkoff, Kay", publisher: "Elsevier", price: 7999, mrp: 10499, edition: "4th Ed", matchTags: ["Ellenbogen","pacing","cardiology"] },
              { name: "Otto's Textbook of Clinical Echocardiography 7th Ed", author: "Catherine Otto", publisher: "Elsevier", price: 6999, mrp: 9299, edition: "7th Ed", matchTags: ["Otto","echocardiography","clinical"] },
              { name: "Interventional Cardiology: Principles & Practice 2nd Ed", author: "Bhatt et al.", publisher: "Wiley-Blackwell", price: 7999, mrp: 10499, edition: "2nd Ed", matchTags: ["interventional cardiology","Bhatt"] },
            ],
          },
          {
            id: "dm-y2-neuro",
            name: "Neurology — Year 2",
            color: "#5856D6",
            books: [
              { name: "Adams & Victor's Principles of Neurology 12th Ed", author: "Ropper, Samuels, Klein", publisher: "McGraw-Hill", price: 8999, mrp: 11999, edition: "12th Ed", featured: true, matchTags: ["Adams Victor","neurology"] },
              { name: "Osborn's Brain 3rd Ed", author: "Anne Osborn", publisher: "Elsevier", price: 9999, mrp: 13499, edition: "3rd Ed", matchTags: ["Osborn","brain","neuroradiology"] },
              { name: "Epilepsy: A Comprehensive Textbook 2nd Ed", author: "Engel & Pedley", publisher: "Wolters Kluwer", price: 8999, mrp: 11999, edition: "2nd Ed", matchTags: ["epilepsy","Engel","Pedley"] },
              { name: "Stroke: Pathophysiology, Diagnosis & Management 7th Ed", author: "Mohr et al.", publisher: "Elsevier", price: 8999, mrp: 11999, edition: "7th Ed", matchTags: ["stroke","Mohr"] },
            ],
          },
          {
            id: "dm-y2-gastro",
            name: "Gastroenterology — Year 2",
            color: "#FF9500",
            books: [
              { name: "Sleisenger & Fordtran's Gastrointestinal and Liver Disease 11th Ed", author: "Feldman, Friedman, Brandt", publisher: "Elsevier", price: 12999, mrp: 17999, edition: "11th Ed", featured: true, matchTags: ["Sleisenger","gastroenterology"] },
              { name: "Yamada's Textbook of Gastroenterology 6th Ed", author: "Podolsky et al.", publisher: "Wiley-Blackwell", price: 14999, mrp: 19999, edition: "6th Ed", matchTags: ["Yamada","gastroenterology"] },
              { name: "ERCP: The Fundamentals 2nd Ed", author: "Cotton & Leung", publisher: "Wiley-Blackwell", price: 5999, mrp: 7999, edition: "2nd Ed", matchTags: ["ERCP","endoscopy","gastroenterology"] },
            ],
          },
          {
            id: "dm-y2-nephro",
            name: "Nephrology — Year 2",
            color: "#007AFF",
            books: [
              { name: "Brenner & Rector's The Kidney 11th Ed", author: "Taal, Chertow, Marsden", publisher: "Elsevier", price: 12999, mrp: 17999, edition: "11th Ed", featured: true, matchTags: ["Brenner Rector","kidney","nephrology"] },
              { name: "Schrier's Diseases of Kidney & Urinary Tract 9th Ed", author: "Coffman, Falk, Molitoris", publisher: "Wolters Kluwer", price: 9999, mrp: 13499, edition: "9th Ed", matchTags: ["Schrier","kidney disease"] },
              { name: "Continuous Renal Replacement Therapy 2nd Ed", author: "Kellum & Bellomo", publisher: "Oxford University Press", price: 4999, mrp: 6699, edition: "2nd Ed", matchTags: ["CRRT","renal replacement","nephrology"] },
            ],
          },
          {
            id: "dm-y2-endo",
            name: "Endocrinology — Year 2",
            color: "#FFD60A",
            books: [
              { name: "Williams Textbook of Endocrinology 14th Ed", author: "Melmed, Auchus, Goldfine", publisher: "Elsevier", price: 8999, mrp: 11999, edition: "14th Ed", featured: true, matchTags: ["Williams","endocrinology"] },
              { name: "Jameson & DeGroot Endocrinology: Adult & Pediatric 7th Ed", author: "Jameson et al.", publisher: "Elsevier", price: 12999, mrp: 17999, edition: "7th Ed", matchTags: ["Jameson DeGroot","endocrinology"] },
              { name: "Thyroid Ultrasound & Ultrasound-Guided FNA 3rd Ed", author: "Baskin & Duick", publisher: "Springer", price: 4999, mrp: 6699, edition: "3rd Ed", matchTags: ["thyroid ultrasound","FNA","endocrinology"] },
            ],
          },
          {
            id: "dm-y2-pulmo",
            name: "Pulmonology — Year 2",
            color: "#5AC8FA",
            books: [
              { name: "Murray & Nadel's Textbook of Respiratory Medicine 7th Ed", author: "Broaddus et al.", publisher: "Elsevier", price: 9999, mrp: 13999, edition: "7th Ed", featured: true, matchTags: ["Murray Nadel","respiratory","pulmonology"] },
              { name: "Fishman's Pulmonary Diseases & Disorders 5th Ed", author: "Grippi et al.", publisher: "McGraw-Hill", price: 9999, mrp: 13499, edition: "5th Ed", matchTags: ["Fishman","pulmonary"] },
              { name: "Flexible Bronchoscopy 3rd Ed", author: "Ko-Pen Wang", publisher: "Wiley-Blackwell", price: 5999, mrp: 7999, edition: "3rd Ed", matchTags: ["bronchoscopy","flexible","pulmonology"] },
            ],
          },
          {
            id: "dm-y2-haem",
            name: "Haematology — Year 2",
            color: "#FF3B30",
            books: [
              { name: "Williams Hematology 10th Ed", author: "Kaushansky, Prchal, Burns", publisher: "McGraw-Hill", price: 9999, mrp: 13499, edition: "10th Ed", featured: true, matchTags: ["Williams","hematology"] },
              { name: "Wintrobe's Clinical Hematology 14th Ed", author: "Greer et al.", publisher: "Wolters Kluwer", price: 9999, mrp: 13499, edition: "14th Ed", matchTags: ["Wintrobe","hematology"] },
              { name: "Bone Marrow Pathology 5th Ed", author: "Bain, Clark, Wilkins", publisher: "Wiley-Blackwell", price: 6999, mrp: 9299, edition: "5th Ed", matchTags: ["bone marrow","pathology","haematology"] },
            ],
          },
          {
            id: "dm-y2-rheuma",
            name: "Rheumatology — Year 2",
            color: "#FF6B35",
            books: [
              { name: "Firestein Budd Kelley's Textbook of Rheumatology 11th Ed", author: "Firestein, Budd, Gabriel", publisher: "Elsevier", price: 9999, mrp: 13999, edition: "11th Ed", featured: true, matchTags: ["Firestein Kelley","rheumatology"] },
              { name: "Hochberg's Rheumatology 8th Ed", author: "Hochberg, Gravallese, Smolen", publisher: "Elsevier", price: 8999, mrp: 11999, edition: "8th Ed", matchTags: ["Hochberg","rheumatology"] },
              { name: "Musculoskeletal Ultrasound 3rd Ed", author: "Ronald McNally", publisher: "Oxford University Press", price: 5999, mrp: 7999, edition: "3rd Ed", matchTags: ["musculoskeletal ultrasound","rheumatology"] },
            ],
          },
          {
            id: "dm-y2-onco",
            name: "Medical Oncology — Year 2",
            color: "#00C2A8",
            books: [
              { name: "DeVita Hellman & Rosenberg's Cancer 11th Ed", author: "DeVita, Lawrence, Rosenberg", publisher: "Wolters Kluwer", price: 14999, mrp: 19999, edition: "11th Ed", featured: true, matchTags: ["DeVita","cancer"] },
              { name: "Holland-Frei Cancer Medicine 9th Ed", author: "Bast, Croce, Hait", publisher: "Wiley-Blackwell", price: 9999, mrp: 13499, edition: "9th Ed", matchTags: ["Holland Frei","cancer medicine"] },
              { name: "Cancer Immunotherapy: Immune Suppression & Tumor Growth 3rd Ed", author: "Bhardwaj", publisher: "Academic Press", price: 5999, mrp: 7999, edition: "3rd Ed", matchTags: ["cancer immunotherapy","tumor"] },
            ],
          },
        ],
      },

      // ── DM Year 3 ───────────────────────────────────────────────────
      {
        id: "dm-year3",
        label: "Year 3",
        subjects: [
          {
            id: "dm-y3-cardio",
            name: "Cardiology — Year 3",
            color: "#FF3B30",
            books: [
              { name: "Zipes Libby Bonow Braunwald's Heart Disease 10th Ed Companion", author: "Various", publisher: "Elsevier", price: 5999, mrp: 7999, edition: "Companion Ed", featured: true, matchTags: ["Braunwald","heart disease","companion"] },
              { name: "ACC/AHA Pocket Cardiology Guidelines 2024", author: "ACC/AHA", publisher: "ACC/AHA Publications", price: 1499, mrp: 1999, edition: "2024 Ed", matchTags: ["ACC AHA","cardiology","guidelines"] },
              { name: "Cardio-Oncology 1st Ed", author: "Herrmann et al.", publisher: "Elsevier", price: 5999, mrp: 7999, edition: "1st Ed", matchTags: ["cardio-oncology","Herrmann"] },
            ],
          },
          {
            id: "dm-y3-neuro",
            name: "Neurology — Year 3",
            color: "#5856D6",
            books: [
              { name: "Movement Disorders: Neurological Principles & Practice 3rd Ed", author: "Watts & Koller", publisher: "McGraw-Hill", price: 7999, mrp: 10499, edition: "3rd Ed", featured: true, matchTags: ["movement disorders","Watts","neurology"] },
              { name: "Neurology Secrets 7th Ed", author: "Loren Rolak", publisher: "Elsevier", price: 3999, mrp: 5299, edition: "7th Ed", matchTags: ["neurology secrets","Rolak"] },
              { name: "Interventional Neurology 2nd Ed", author: "Bogousslavsky et al.", publisher: "Karger", price: 5499, mrp: 7299, edition: "2nd Ed", matchTags: ["interventional neurology","Bogousslavsky"] },
            ],
          },
          {
            id: "dm-y3-gastro",
            name: "Gastroenterology — Year 3",
            color: "#FF9500",
            books: [
              { name: "Shackelford's Surgery of the Alimentary Tract 8th Ed", author: "Yeo, Matthews, McFadden", publisher: "Elsevier", price: 9999, mrp: 13499, edition: "8th Ed", featured: true, matchTags: ["Shackelford","alimentary tract","surgery"] },
              { name: "Hepatology: A Clinical Textbook 12th Ed", author: "Mauss, Berg, Rockstroh", publisher: "Flying Publisher", price: 1499, mrp: 1999, edition: "12th Ed", matchTags: ["hepatology","Mauss","Berg"] },
              { name: "Advanced Therapeutic Endoscopy 1st Ed", author: "Bhatt et al.", publisher: "Springer", price: 5999, mrp: 7999, edition: "1st Ed", matchTags: ["therapeutic endoscopy","advanced","GI"] },
            ],
          },
          {
            id: "dm-y3-nephro",
            name: "Nephrology — Year 3",
            color: "#007AFF",
            books: [
              { name: "Kidney Transplantation: Principles & Practice 8th Ed", author: "Morris & Knechtle", publisher: "Elsevier", price: 9999, mrp: 13499, edition: "8th Ed", featured: true, matchTags: ["kidney transplant","Morris","nephrology"] },
              { name: "Comprehensive Clinical Nephrology 7th Ed", author: "Johnson, Floege, Tonelli", publisher: "Elsevier", price: 8999, mrp: 11999, edition: "7th Ed", matchTags: ["comprehensive nephrology","Johnson","Floege"] },
              { name: "Nephrology Secrets 4th Ed", author: "McGill & Rennke", publisher: "Elsevier", price: 3999, mrp: 5299, edition: "4th Ed", matchTags: ["nephrology secrets","McGill"] },
            ],
          },
          {
            id: "dm-y3-endo",
            name: "Endocrinology — Year 3",
            color: "#FFD60A",
            books: [
              { name: "Endocrinology: Adult & Pediatric 8th Ed (Companion)", author: "Jameson et al.", publisher: "Elsevier", price: 7999, mrp: 10499, edition: "8th Ed", featured: true, matchTags: ["endocrinology","adult pediatric","companion"] },
              { name: "ADA Standards of Medical Care in Diabetes 2024", author: "American Diabetes Association", publisher: "ADA Publications", price: 999, mrp: 1499, edition: "2024 Ed", matchTags: ["ADA","diabetes","standards"] },
              { name: "Endocrinology Secrets 6th Ed", author: "Michael McDermott", publisher: "Elsevier", price: 3499, mrp: 4799, edition: "6th Ed", matchTags: ["endocrinology secrets","McDermott"] },
            ],
          },
          {
            id: "dm-y3-pulmo",
            name: "Pulmonology — Year 3",
            color: "#5AC8FA",
            books: [
              { name: "Principles of Pulmonary Medicine 8th Ed", author: "Weinberger & Cockrill", publisher: "Elsevier", price: 4999, mrp: 6699, edition: "8th Ed", featured: true, matchTags: ["pulmonary medicine","Weinberger"] },
              { name: "Lung Transplantation 3rd Ed", author: "Vigneswaran & Garrity", publisher: "Taylor & Francis", price: 7999, mrp: 10499, edition: "3rd Ed", matchTags: ["lung transplantation","pulmonology"] },
              { name: "Sleep Medicine: Essentials & Review 2nd Ed", author: "Abou-Khalil & Lue", publisher: "Oxford University Press", price: 3499, mrp: 4799, edition: "2nd Ed", matchTags: ["sleep medicine","review","pulmonology"] },
            ],
          },
          {
            id: "dm-y3-haem",
            name: "Haematology — Year 3",
            color: "#FF3B30",
            books: [
              { name: "Hematopoietic Cell Transplantation 5th Ed", author: "Forman, Negrin, Antin", publisher: "Wiley-Blackwell", price: 8999, mrp: 11999, edition: "5th Ed", featured: true, matchTags: ["bone marrow transplant","HSCT","haematology"] },
              { name: "Haematology at a Glance 5th Ed", author: "Mehta & Hoffbrand", publisher: "Wiley-Blackwell", price: 2999, mrp: 3999, edition: "5th Ed", matchTags: ["haematology at a glance","Mehta","Hoffbrand"] },
              { name: "EHA Guidelines for Haematological Malignancies 2024", author: "EHA", publisher: "EHA Publications", price: 1499, mrp: 1999, edition: "2024 Ed", matchTags: ["EHA","guidelines","haematological malignancies"] },
            ],
          },
          {
            id: "dm-y3-rheuma",
            name: "Rheumatology — Year 3",
            color: "#FF6B35",
            books: [
              { name: "EULAR Recommendations for Rheumatoid Arthritis 2024", author: "EULAR", publisher: "EULAR Publications", price: 1499, mrp: 1999, edition: "2024 Ed", featured: true, matchTags: ["EULAR","rheumatoid arthritis","guidelines"] },
              { name: "Myositis 2nd Ed", author: "Oddis & Aggarwal", publisher: "Taylor & Francis", price: 5999, mrp: 7999, edition: "2nd Ed", matchTags: ["myositis","Oddis","rheumatology"] },
              { name: "Rheumatology 8th Ed", author: "Hochberg, Gravallese, Smolen", publisher: "Elsevier", price: 9999, mrp: 13499, edition: "8th Ed", matchTags: ["rheumatology","Hochberg","advanced"] },
            ],
          },
          {
            id: "dm-y3-onco",
            name: "Medical Oncology — Year 3",
            color: "#00C2A8",
            books: [
              { name: "Molecular Oncology: Causes of Cancer & Targets for Treatment 2nd Ed", author: "Mendelsohn et al.", publisher: "Cambridge University Press", price: 5999, mrp: 7999, edition: "2nd Ed", featured: true, matchTags: ["molecular oncology","Mendelsohn","targeted therapy"] },
              { name: "Immunotherapy of Cancer 3rd Ed", author: "Kaufman, Disis", publisher: "Wiley-Blackwell", price: 5499, mrp: 7299, edition: "3rd Ed", matchTags: ["immunotherapy","cancer","DM oncology"] },
              { name: "Palliative Care Formulary 7th Ed", author: "Twycross et al.", publisher: "Pharmaceutical Press", price: 2999, mrp: 3999, edition: "7th Ed", matchTags: ["palliative care","formulary","oncology"] },
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

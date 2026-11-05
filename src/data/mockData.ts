import { Book, Category, Member, User } from "@/types";

export const CATEGORIES: Category[] = [
  {
    "id": "d800bf76-1050-4e47-94f3-5a517193839d",
    "name": "Children & Young Adults",
    "code": "CHILDREN",
    "ddcPrefix": "823",
    "description": "Illustrated fables, Panchatantra, Ruskin Bond tales and science adventures",
    "iconName": "Sparkles",
    "accentColor": "emerald",
    "booksCount": 1
  },
  {
    "id": "89696b92-0e99-42e8-bdf9-87791f0151f8",
    "name": "Constitution & Law",
    "code": "LAW_GOV",
    "ddcPrefix": "340",
    "description": "Indian constitutional commentaries, public administration, and jurisprudence",
    "iconName": "Scale",
    "accentColor": "rose",
    "booksCount": 1
  },
  {
    "id": "b3b120eb-1236-4934-b2b0-a7ff6d586dcb",
    "name": "Fiction & World Literature",
    "code": "LITERATURE",
    "ddcPrefix": "800",
    "description": "Novels, regional classics, poetry, drama and prose masters",
    "iconName": "BookOpen",
    "accentColor": "teal",
    "booksCount": 3
  },
  {
    "id": "a7e8df95-88e9-4499-bafa-191f2283a597",
    "name": "History & Heritage",
    "code": "HISTORY",
    "ddcPrefix": "900",
    "description": "Indian freedom struggle, ancient civilisations, biographies and world history",
    "iconName": "Landmark",
    "accentColor": "amber",
    "booksCount": 2
  },
  {
    "id": "b140996a-0618-4bc3-aeb4-2c2e1905ac0e",
    "name": "Philosophy & Self-Growth",
    "code": "PHILOSOPHY",
    "ddcPrefix": "100",
    "description": "Indian philosophical traditions, ethics, logic, and self-realization",
    "iconName": "Brain",
    "accentColor": "purple",
    "booksCount": 1
  },
  {
    "id": "35ac2127-5f0c-44ec-86eb-1c1a81164439",
    "name": "Science & Astronomy",
    "code": "SCIENCE",
    "ddcPrefix": "500",
    "description": "Physics, astronomy, biology, astrophysics and environmental sciences",
    "iconName": "Compass",
    "accentColor": "blue",
    "booksCount": 2
  },
  {
    "id": "69e753b0-46c6-488c-9775-25a5d79766e0",
    "name": "Technology & Computing",
    "code": "CS_TECH",
    "ddcPrefix": "004",
    "description": "Computer programming, algorithms, operating systems, and networks",
    "iconName": "Cpu",
    "accentColor": "indigo",
    "booksCount": 2
  }
];

export const BOOKS: Book[] = [
  {
    "id": "9f0f19b0-91d6-4862-9f16-874eb5d244ee",
    "isbn": "9788170188988",
    "title": "Discovery of India (भारत एक खोज)",
    "subtitle": "Historical and Cultural Essays Written in Ahmednagar Fort",
    "edition": "Oxford Commemorative Library",
    "publicationYear": 1946,
    "language": "English / Hindi",
    "ddcCode": "954.035",
    "bookNumber": "NEH-DIS",
    "description": "Jawaharlal Nehru's sweeping philosophical inquiry into the cultural continuity, philosophy, and history of India from the Indus Valley civilization onwards.",
    "coverImageUrl": "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80",
    "publisher": "Oxford University Press India",
    "category": {
      "id": "a7e8df95-88e9-4499-bafa-191f2283a597",
      "name": "History & Heritage",
      "code": "HISTORY",
      "ddcPrefix": "900"
    },
    "authors": "Dr. A. P. J. Abdul Kalam",
    "totalCopies": 1,
    "availableCopies": 1,
    "issuedCopies": 0,
    "referenceOnlyCopies": 0,
    "primaryLocation": "Aisle 1, Rack C, Shelf 1",
    "availabilityStatus": "Available",
    "shelfLocations": [
      "Aisle 1, Rack C, Shelf 1"
    ],
    "isEditorChoice": true
  },
  {
    "id": "f67f5fda-d35e-47e9-bf3b-5def66398808",
    "isbn": "9780553380163",
    "title": "A Brief History of Time",
    "subtitle": "From the Big Bang to Black Holes",
    "edition": "10th Anniversary Expanded Edition",
    "publicationYear": 1988,
    "language": "English / Hindi",
    "ddcCode": "523.1",
    "bookNumber": "HAW-ABH",
    "description": "Professor Stephen Hawking's monumental exposition on the physics of space-time, quantum gravity, black holes, and the origins of the universe.",
    "coverImageUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80",
    "publisher": "Oxford University Press India",
    "category": {
      "id": "35ac2127-5f0c-44ec-86eb-1c1a81164439",
      "name": "Science & Astronomy",
      "code": "SCIENCE",
      "ddcPrefix": "500"
    },
    "authors": "Stephen Hawking",
    "totalCopies": 1,
    "availableCopies": 1,
    "issuedCopies": 0,
    "referenceOnlyCopies": 0,
    "primaryLocation": "Aisle 1, Rack A, Shelf 3",
    "availabilityStatus": "Available",
    "shelfLocations": [
      "Aisle 1, Rack A, Shelf 3"
    ],
    "isPopular": true
  },
  {
    "id": "62681bc4-868f-4bf9-baf2-dd0fb7ba74df",
    "isbn": "9780345539434",
    "title": "Cosmos: The Story of Cosmic Evolution",
    "subtitle": "Science and Civilization Through the Eyes of Carl Sagan",
    "edition": "Revised Illustrated Edition",
    "publicationYear": 1980,
    "language": "English",
    "ddcCode": "520",
    "bookNumber": "SAG-COS",
    "description": "One of the most bestselling scientific volumes in history, charting fifteen billion years of cosmic evolution, anthropological curiosity, and space exploration.",
    "coverImageUrl": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
    "publisher": "Oxford University Press India",
    "category": {
      "id": "35ac2127-5f0c-44ec-86eb-1c1a81164439",
      "name": "Science & Astronomy",
      "code": "SCIENCE",
      "ddcPrefix": "500"
    },
    "authors": "Carl Sagan",
    "totalCopies": 2,
    "availableCopies": 2,
    "issuedCopies": 0,
    "referenceOnlyCopies": 0,
    "primaryLocation": "Aisle 1, Rack A, Shelf 2",
    "availabilityStatus": "Available",
    "shelfLocations": [
      "Aisle 1, Rack A, Shelf 2"
    ],
    "isPopular": true
  },
  {
    "id": "6c284b00-128c-4ed4-8895-1febe2cd6820",
    "isbn": "9780143333165",
    "title": "Wise and Otherwise: A Salute to Life",
    "subtitle": "Inspiring Vignettes from Rural & Urban India",
    "edition": "Special Jubilee Edition",
    "publicationYear": 2002,
    "language": "English / Hindi",
    "ddcCode": "158.1",
    "bookNumber": "MUR-WIS",
    "description": "Fifty candid vignettes drawn from Sudha Murty's travel across India as trustee of the Infosys Foundation, exploring human vulnerability, nobility, and wisdom.",
    "coverImageUrl": "https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=600&auto=format&fit=crop&q=80",
    "publisher": "Penguin Random House India",
    "category": {
      "id": "b140996a-0618-4bc3-aeb4-2c2e1905ac0e",
      "name": "Philosophy & Self-Growth",
      "code": "PHILOSOPHY",
      "ddcPrefix": "100"
    },
    "authors": "Dr. Sudha Murty",
    "totalCopies": 1,
    "availableCopies": 1,
    "issuedCopies": 0,
    "referenceOnlyCopies": 0,
    "primaryLocation": "Aisle 2, Rack C, Shelf 1",
    "availabilityStatus": "Available",
    "shelfLocations": [
      "Aisle 2, Rack C, Shelf 1"
    ],
    "isPopular": true
  },
  {
    "id": "6e77c186-ee35-4d10-a2af-eed2f16c8efc",
    "isbn": "9780143335374",
    "title": "The Blue Umbrella & Other Mountain Tales",
    "subtitle": "A Heartwarming Story of Innocence and Kindness",
    "edition": "Illustrated Children's Library",
    "publicationYear": 1980,
    "language": "English / Hindi",
    "ddcCode": "823.92",
    "bookNumber": "BON-BLU",
    "description": "Set in a quaint Garhwal village, Binya trades her leopard-claw pendant for a stunning blue umbrella, exploring envy, redemption, and friendship.",
    "coverImageUrl": "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&auto=format&fit=crop&q=80",
    "publisher": "Penguin Random House India",
    "category": {
      "id": "d800bf76-1050-4e47-94f3-5a517193839d",
      "name": "Children & Young Adults",
      "code": "CHILDREN",
      "ddcPrefix": "823"
    },
    "authors": "Ruskin Bond",
    "totalCopies": 2,
    "availableCopies": 2,
    "issuedCopies": 0,
    "referenceOnlyCopies": 0,
    "primaryLocation": "Aisle 5, Rack A, Shelf 1",
    "availabilityStatus": "Available",
    "shelfLocations": [
      "Aisle 5, Rack A, Shelf 1"
    ],
    "isPopular": true
  },
  {
    "id": "1eaff6f1-cb9d-408d-bea2-fe7c46ea8735",
    "isbn": "9780143422983",
    "title": "Malgudi Days",
    "subtitle": "Short Stories of Charm and Irony in South India",
    "edition": "Classics Illustrated",
    "publicationYear": 1943,
    "language": "English / Hindi",
    "ddcCode": "823.912",
    "bookNumber": "NAR-MAL",
    "description": "Heartwarming short stories portraying the eccentricities, humor, and innocence of daily life in the fictional idyllic town of Malgudi.",
    "coverImageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
    "publisher": "Penguin Random House India",
    "category": {
      "id": "b3b120eb-1236-4934-b2b0-a7ff6d586dcb",
      "name": "Fiction & World Literature",
      "code": "LITERATURE",
      "ddcPrefix": "800"
    },
    "authors": "R. K. Narayan",
    "totalCopies": 2,
    "availableCopies": 2,
    "issuedCopies": 0,
    "referenceOnlyCopies": 0,
    "primaryLocation": "Aisle 3, Rack B, Shelf 2",
    "availabilityStatus": "Available",
    "shelfLocations": [
      "Aisle 3, Rack B, Shelf 2"
    ],
    "isEditorChoice": true
  },
  {
    "id": "39833dd3-a8be-4c11-806a-588fba98f900",
    "isbn": "9788172234980",
    "title": "Gitanjali (गीतांजलि): Song Offerings",
    "subtitle": "With an Introduction by W. B. Yeats",
    "edition": "Heritage Nobel Edition",
    "publicationYear": 1912,
    "language": "Bengali / English / Hindi",
    "ddcCode": "891.441",
    "bookNumber": "TAG-GIT",
    "description": "Tagore's timeless collection of devotional poetry that earned Asia its first Nobel Prize in Literature in 1913, reflecting spiritual communion with nature and the divine.",
    "coverImageUrl": "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=600&auto=format&fit=crop&q=80",
    "publisher": "Sahitya Akademi",
    "category": {
      "id": "b3b120eb-1236-4934-b2b0-a7ff6d586dcb",
      "name": "Fiction & World Literature",
      "code": "LITERATURE",
      "ddcPrefix": "800"
    },
    "authors": "Rabindranath Tagore",
    "totalCopies": 1,
    "availableCopies": 1,
    "issuedCopies": 0,
    "referenceOnlyCopies": 0,
    "primaryLocation": "Aisle 3, Rack B, Shelf 1",
    "availabilityStatus": "Available",
    "shelfLocations": [
      "Aisle 3, Rack B, Shelf 1"
    ],
    "isEditorChoice": true
  },
  {
    "id": "6d294d2e-18cc-4442-b486-e5a758eaa0a4",
    "isbn": "9780131103627",
    "title": "The C Programming Language",
    "subtitle": "Second Edition (ANSI C Standard)",
    "edition": "2nd Edition",
    "publicationYear": 1988,
    "language": "English",
    "ddcCode": "005.133",
    "bookNumber": "KER-CPR",
    "description": "The definitive guide written by the language designers Dennis Ritchie and Brian Kernighan. Clear syntax rules, memory pointers, and standard library reference.",
    "coverImageUrl": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
    "publisher": "Pearson Education India",
    "category": {
      "id": "69e753b0-46c6-488c-9775-25a5d79766e0",
      "name": "Technology & Computing",
      "code": "CS_TECH",
      "ddcPrefix": "004"
    },
    "authors": "Brian W. Kernighan, Dennis M. Ritchie",
    "totalCopies": 2,
    "availableCopies": 2,
    "issuedCopies": 0,
    "referenceOnlyCopies": 0,
    "primaryLocation": "Aisle 4, Rack C, Shelf 3",
    "availabilityStatus": "Available",
    "shelfLocations": [
      "Aisle 4, Rack C, Shelf 3"
    ],
    "isFeatured": true
  },
  {
    "id": "27bc87a7-9d13-4ce8-a09e-e549f15a225a",
    "isbn": "9780133591620",
    "title": "Modern Operating Systems",
    "subtitle": "Fourth Edition: Concurrency, Virtualization & Security",
    "edition": "4th Global Edition",
    "publicationYear": 2014,
    "language": "English",
    "ddcCode": "005.43",
    "bookNumber": "TAN-MOS",
    "description": "Authoritative academic reference covering kernel architecture, process management, memory paging, file systems, and distributed system design.",
    "coverImageUrl": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
    "publisher": "Pearson Education India",
    "category": {
      "id": "69e753b0-46c6-488c-9775-25a5d79766e0",
      "name": "Technology & Computing",
      "code": "CS_TECH",
      "ddcPrefix": "004"
    },
    "authors": "Andrew S. Tanenbaum",
    "totalCopies": 2,
    "availableCopies": 2,
    "issuedCopies": 0,
    "referenceOnlyCopies": 0,
    "primaryLocation": "Aisle 4, Rack C, Shelf 2",
    "availabilityStatus": "Available",
    "shelfLocations": [
      "Aisle 4, Rack C, Shelf 2"
    ],
    "isFeatured": true
  },
  {
    "id": "3ff0cf4f-6b46-4163-836d-4f9b2d6f0548",
    "isbn": "9788170110309",
    "title": "The Constitution of India: Bare Act with Commentary",
    "subtitle": "Sovereign, Socialist, Secular, Democratic Republic",
    "edition": "Centenary Commemorative Edition",
    "publicationYear": 1950,
    "language": "English / Hindi",
    "ddcCode": "342.54",
    "bookNumber": "AMB-CON",
    "description": "The foundational legal text establishing fundamental rights, directive principles, and parliamentary democracy in India, curated with original drafting assembly debates.",
    "coverImageUrl": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80",
    "publisher": "Publications Division, Govt of India",
    "category": {
      "id": "89696b92-0e99-42e8-bdf9-87791f0151f8",
      "name": "Constitution & Law",
      "code": "LAW_GOV",
      "ddcPrefix": "340"
    },
    "authors": "Dr. B. R. Ambedkar",
    "totalCopies": 2,
    "availableCopies": 1,
    "issuedCopies": 0,
    "referenceOnlyCopies": 1,
    "primaryLocation": "Aisle 2, Rack A, Shelf 1",
    "availabilityStatus": "Available",
    "shelfLocations": [
      "Aisle 2, Rack A, Shelf 1"
    ],
    "isFeatured": true
  },
  {
    "id": "fef8c2ee-7a2f-410d-9642-3c468d2b29a2",
    "isbn": "9788171673407",
    "title": "Godaan (गोदान)",
    "subtitle": "The Gift of a Cow — Masterpiece of Hindi Realism",
    "edition": "Sahitya National Edition",
    "publicationYear": 1936,
    "language": "Hindi",
    "ddcCode": "891.433",
    "bookNumber": "PRE-GOD",
    "description": "Premchand's crowning literary achievement portraying peasant life in colonial India, highlighting the moral dignity, structural poverty, and socio-economic struggles of the common farmer Hori.",
    "coverImageUrl": "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
    "publisher": "Sahitya Akademi",
    "category": {
      "id": "b3b120eb-1236-4934-b2b0-a7ff6d586dcb",
      "name": "Fiction & World Literature",
      "code": "LITERATURE",
      "ddcPrefix": "800"
    },
    "authors": "Munshi Premchand",
    "totalCopies": 2,
    "availableCopies": 2,
    "issuedCopies": 0,
    "referenceOnlyCopies": 0,
    "primaryLocation": "Aisle 3, Rack A, Shelf 1",
    "availabilityStatus": "Available",
    "shelfLocations": [
      "Aisle 3, Rack A, Shelf 1"
    ],
    "isEditorChoice": true
  },
  {
    "id": "3f686ee1-2c8e-4751-8c79-27d179db65a7",
    "isbn": "9788173711466",
    "title": "Wings of Fire: An Autobiography",
    "subtitle": "An inspiring journey of the Missile Man of India",
    "edition": "Special Anniversary Edition",
    "publicationYear": 1999,
    "language": "English / Hindi",
    "ddcCode": "920.054",
    "bookNumber": "KAL-WOF",
    "description": "An extraordinary autobiographical narrative tracing Dr. Kalam's early childhood in Rameswaram, his career at ISRO, and his pivotal leadership in Indian aerospace and defense technology.",
    "coverImageUrl": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
    "publisher": "Publications Division, Govt of India",
    "category": {
      "id": "a7e8df95-88e9-4499-bafa-191f2283a597",
      "name": "History & Heritage",
      "code": "HISTORY",
      "ddcPrefix": "900"
    },
    "authors": "Dr. A. P. J. Abdul Kalam",
    "totalCopies": 3,
    "availableCopies": 1,
    "issuedCopies": 1,
    "referenceOnlyCopies": 1,
    "primaryLocation": "Aisle 1, Rack B, Shelf 2",
    "availabilityStatus": "Available",
    "shelfLocations": [
      "Aisle 1, Rack B, Shelf 2"
    ],
    "isFeatured": true
  }
];

export const DEMO_USERS: Record<string, User> = {
  MEMBER: {
    id: "3e4cf5ed-8215-437f-8a59-cd1d42eb98a4",
    email: "rahul.verma@student.delhiuniv.ac.in",
    name: "Rahul Verma",
    role: "MEMBER",
    memberId: "3e4cf5ed-8215-437f-8a59-cd1d42eb98a4",
    memberNo: "GPL-2026-00001",
    category: "STUDENT"
  },
  LIBRARIAN: {
    id: "aecf647b-79de-4f25-b709-a12d3e668fbd",
    email: "librarian@library.gov.in",
    name: "Devendra Patel",
    role: "LIBRARIAN"
  },
  ACCOUNTS_OPERATOR: {
    id: "776fe66d-fa86-497f-9ebc-f132b2c54c25",
    email: "accounts@library.gov.in",
    name: "Manoj Agarwal",
    role: "ACCOUNTS_OPERATOR"
  },
  SUPER_ADMIN: {
    id: "ee1b1e51-d762-45a4-b831-25e36bb41485",
    email: "superadmin@library.gov.in",
    name: "Dr. K. S. Thakur",
    role: "SUPER_ADMIN"
  }
};

export const SAMPLE_MEMBER: Member = {
  "id": "3e4cf5ed-8215-437f-8a59-cd1d42eb98a4",
  "memberNo": "GPL-2026-00001",
  "fullName": "Rahul Verma",
  "email": "rahul.verma@student.delhiuniv.ac.in",
  "phone": "+91-9876543210",
  "address": "Room 14, Gwyer Hall, University of Delhi North Campus",
  "passwordHash": "$2a$10$7JzUQSUnAjS0iy9InU.yN.crQWtVYh8rjVcURW88/cgvpgZtIA/DO",
  "category": "STUDENT",
  "status": "ACTIVE",
  "registrationDate": "2026-10-21T09:46:05.452Z",
  "expiryDate": "2027-06-30T00:00:00.000Z",
  "maxBooks": 4,
  "createdAt": "2026-10-21T09:46:05.452Z",
  "updatedAt": "2026-10-21T09:46:05.452Z",
  "loans": [
    {
      "id": "5bdb95b9-ef93-46e8-a643-f7a1d893e0b3",
      "copyId": "0071954c-51f8-44e2-af62-75b2da74e82d",
      "memberId": "3e4cf5ed-8215-437f-8a59-cd1d42eb98a4",
      "issuedAt": "2026-10-21T09:46:05.751Z",
      "dueDate": "2026-11-04T09:46:05.747Z",
      "returnedAt": null,
      "renewalCount": 0,
      "status": "ACTIVE",
      "issuedBy": "Devendra Patel",
      "returnedBy": null,
      "createdAt": "2026-10-21T09:46:05.751Z",
      "updatedAt": "2026-10-21T09:46:05.751Z",
      "copy": {
        "id": "0071954c-51f8-44e2-af62-75b2da74e82d",
        "bookId": "3f686ee1-2c8e-4751-8c79-27d179db65a7",
        "accessionNo": "ACC-2026-0001",
        "copyNumber": 1,
        "qrCodeToken": "QR-GPLMS-ACC-2026-0001",
        "shelfLocation": "Aisle 1, Rack B, Shelf 2",
        "acquisitionDate": "2026-10-21T09:46:02.528Z",
        "acquisitionCost": 295,
        "condition": "GOOD",
        "status": "ISSUED",
        "createdAt": "2026-10-21T09:46:02.528Z",
        "updatedAt": "2026-10-21T09:46:05.857Z",
        "book": {
          "id": "3f686ee1-2c8e-4751-8c79-27d179db65a7",
          "isbn": "9788173711466",
          "title": "Wings of Fire: An Autobiography",
          "subtitle": "An inspiring journey of the Missile Man of India",
          "edition": "Special Anniversary Edition",
          "publicationYear": 1999,
          "language": "English / Hindi",
          "ddcCode": "920.054",
          "bookNumber": "KAL-WOF",
          "description": "An extraordinary autobiographical narrative tracing Dr. Kalam's early childhood in Rameswaram, his career at ISRO, and his pivotal leadership in Indian aerospace and defense technology.",
          "coverImageUrl": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
          "isFeatured": true,
          "isEditorChoice": true,
          "isPopular": true,
          "publisherId": "5151617b-e2ca-4983-b0ef-8401031c5157",
          "categoryId": "a7e8df95-88e9-4499-bafa-191f2283a597",
          "createdAt": "2026-10-21T09:46:02.528Z",
          "updatedAt": "2026-10-21T09:46:02.528Z"
        }
      }
    }
  ],
  "reservations": [],
  "feeCharges": [],
  "payments": [],
  "receipts": [],
  "activeLoansCount": 1,
  "overdueLoansCount": 0,
  "totalOutstandingDues": 0
};

// In-memory state for reservations made in current session
export let IN_MEMORY_RESERVATIONS: Array<{
  id: string;
  bookId: string;
  memberId: string;
  queuePosition: number;
  status: "PENDING";
  createdAt: string;
}> = [];

export function addReservation(bookId: string, memberId: string) {
  const existingForBook = IN_MEMORY_RESERVATIONS.filter(r => r.bookId === bookId);
  const queuePosition = existingForBook.length + 1;
  const newReservation = {
    id: 'res-' + Math.random().toString(36).substring(2, 9),
    bookId,
    memberId,
    queuePosition,
    status: "PENDING" as const,
    createdAt: new Date().toISOString()
  };
  IN_MEMORY_RESERVATIONS.push(newReservation);
  return newReservation;
}

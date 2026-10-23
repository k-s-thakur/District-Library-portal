import { prisma } from "../prisma";

export interface SearchCatalogParams {
  query?: string;
  categoryCode?: string;
  ddcPrefix?: string;
  language?: string;
  availableOnly?: boolean;
  sortBy?: "relevance" | "title_asc" | "title_desc" | "author_asc" | "newest";
  page?: number;
  limit?: number;
}

export interface SafeBookSummary {
  id: string;
  isbn: string;
  title: string;
  subtitle?: string | null;
  edition?: string | null;
  publicationYear?: number | null;
  language: string;
  ddcCode?: string | null;
  bookNumber?: string | null;
  description?: string | null;
  coverImageUrl?: string | null;
  publisher: string;
  category: {
    id: string;
    name: string;
    code: string;
    ddcPrefix?: string | null;
  } | null;
  authors: string;
  totalCopies: number;
  availableCopies: number;
  issuedCopies: number;
  referenceOnlyCopies: number;
  primaryLocation: string;
  availabilityStatus: "Available" | "All copies issued" | "Reference only" | "Availability unknown";
  shelfLocations: string[];
}

export async function searchCatalogue(params: SearchCatalogParams) {
  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, Math.min(50, params.limit || 12));
  const skip = (page - 1) * limit;

  const where: any = {};

  if (params.query && params.query.trim().length > 0) {
    const q = params.query.trim();
    where.OR = [
      { title: { contains: q } },
      { subtitle: { contains: q } },
      { isbn: { contains: q } },
      { ddcCode: { contains: q } },
      { description: { contains: q } },
      { authors: { some: { author: { name: { contains: q } } } } },
      { publisher: { name: { contains: q } } },
      { category: { name: { contains: q } } },
    ];
  }

  if (params.categoryCode) {
    where.category = { code: params.categoryCode };
  }

  if (params.ddcPrefix) {
    where.ddcCode = { startsWith: params.ddcPrefix };
  }

  if (params.language) {
    where.language = { contains: params.language };
  }

  if (params.availableOnly) {
    where.copies = {
      some: {
        status: "AVAILABLE",
      },
    };
  }

  let orderBy: any = { createdAt: "desc" };
  if (params.sortBy === "title_asc") {
    orderBy = { title: "asc" };
  } else if (params.sortBy === "title_desc") {
    orderBy = { title: "desc" };
  } else if (params.sortBy === "newest") {
    orderBy = { publicationYear: "desc" };
  }

  const [totalCount, books] = await Promise.all([
    prisma.book.count({ where }),
    prisma.book.findMany({
      where,
      skip,
      take: limit,
      include: {
        authors: { include: { author: true } },
        publisher: true,
        category: true,
        copies: {
          select: {
            id: true,
            accessionNo: true,
            status: true,
            shelfLocation: true,
            copyNumber: true,
          },
        },
      },
      orderBy,
    }),
  ]);

  const items: SafeBookSummary[] = books.map((b) => {
    const totalCopies = b.copies.length;
    const availableCopies = b.copies.filter((c) => c.status === "AVAILABLE").length;
    const issuedCopies = b.copies.filter((c) => c.status === "ISSUED").length;
    const referenceOnlyCopies = b.copies.filter((c) => c.status === "REFERENCE_ONLY").length;

    let availabilityStatus: SafeBookSummary["availabilityStatus"] = "Availability unknown";
    if (totalCopies === 0) {
      availabilityStatus = "Availability unknown";
    } else if (availableCopies > 0) {
      availabilityStatus = "Available";
    } else if (referenceOnlyCopies === totalCopies) {
      availabilityStatus = "Reference only";
    } else {
      availabilityStatus = "All copies issued";
    }

    const uniqueShelves = Array.from(
      new Set(b.copies.map((c) => c.shelfLocation).filter(Boolean) as string[])
    );

    return {
      id: b.id,
      isbn: b.isbn,
      title: b.title,
      subtitle: b.subtitle,
      edition: b.edition,
      publicationYear: b.publicationYear,
      language: b.language,
      ddcCode: b.ddcCode,
      bookNumber: b.bookNumber,
      description: b.description,
      coverImageUrl: b.coverImageUrl,
      publisher: b.publisher?.name || "Official Publications",
      category: b.category
        ? {
            id: b.category.id,
            name: b.category.name,
            code: b.category.code,
            ddcPrefix: b.category.ddcPrefix,
          }
        : null,
      authors: b.authors.map((a) => a.author.name).join(", "),
      totalCopies,
      availableCopies,
      issuedCopies,
      referenceOnlyCopies,
      primaryLocation: uniqueShelves[0] || "General Reading Stack",
      availabilityStatus,
      shelfLocations: uniqueShelves,
    };
  });

  return {
    items,
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
}

export async function getBookDetails(idOrIsbn: string) {
  const book = await prisma.book.findFirst({
    where: {
      OR: [{ id: idOrIsbn }, { isbn: idOrIsbn }],
    },
    include: {
      authors: { include: { author: true } },
      publisher: true,
      category: true,
      copies: {
        select: {
          id: true,
          accessionNo: true,
          copyNumber: true,
          shelfLocation: true,
          condition: true,
          status: true,
        },
        orderBy: { copyNumber: "asc" },
      },
      reservations: {
        where: { status: "PENDING" },
        select: {
          id: true,
          queuePosition: true,
          reservedAt: true,
        },
        orderBy: { queuePosition: "asc" },
      },
    },
  });

  if (!book) {
    throw new Error(`Book with identifier "${idOrIsbn}" was not found in the public catalogue.`);
  }

  const totalCopies = book.copies.length;
  const availableCopies = book.copies.filter((c) => c.status === "AVAILABLE").length;
  const issuedCopies = book.copies.filter((c) => c.status === "ISSUED").length;
  const referenceOnlyCopies = book.copies.filter((c) => c.status === "REFERENCE_ONLY").length;

  let availabilityStatus: SafeBookSummary["availabilityStatus"] = "Availability unknown";
  if (totalCopies === 0) {
    availabilityStatus = "Availability unknown";
  } else if (availableCopies > 0) {
    availabilityStatus = "Available";
  } else if (referenceOnlyCopies === totalCopies) {
    availabilityStatus = "Reference only";
  } else {
    availabilityStatus = "All copies issued";
  }

  return {
    id: book.id,
    isbn: book.isbn,
    title: book.title,
    subtitle: book.subtitle,
    edition: book.edition,
    publicationYear: book.publicationYear,
    language: book.language,
    ddcCode: book.ddcCode,
    bookNumber: book.bookNumber,
    description: book.description,
    coverImageUrl: book.coverImageUrl,
    publisher: book.publisher ? { id: book.publisher.id, name: book.publisher.name } : null,
    category: book.category
      ? {
          id: book.category.id,
          name: book.category.name,
          code: book.category.code,
          ddcPrefix: book.category.ddcPrefix,
        }
      : null,
    authors: book.authors.map((a) => ({ id: a.author.id, name: a.author.name })),
    authorsString: book.authors.map((a) => a.author.name).join(", "),
    totalCopies,
    availableCopies,
    issuedCopies,
    referenceOnlyCopies,
    availabilityStatus,
    copies: book.copies.map((c) => ({
      accessionNo: c.accessionNo,
      copyNumber: c.copyNumber,
      shelfLocation: c.shelfLocation || "Main Reading Stack",
      status: c.status,
    })),
    activeReservationsCount: book.reservations.length,
  };
}

export async function getCuratedCatalog() {
  const [editorsChoice, popular, recentlyAdded, featured] = await Promise.all([
    searchCatalogue({ limit: 6, sortBy: "relevance" }),
    searchCatalogue({ limit: 6, sortBy: "title_asc" }),
    searchCatalogue({ limit: 6, sortBy: "newest" }),
    prisma.book.findMany({
      where: { isFeatured: true },
      take: 4,
      include: {
        authors: { include: { author: true } },
        publisher: true,
        category: true,
        copies: {
          select: { status: true, shelfLocation: true },
        },
      },
    }),
  ]);

  const safeFeatured: SafeBookSummary[] = featured.map((b) => {
    const totalCopies = b.copies.length;
    const availableCopies = b.copies.filter((c) => c.status === "AVAILABLE").length;
    const referenceOnlyCopies = b.copies.filter((c) => c.status === "REFERENCE_ONLY").length;
    const issuedCopies = b.copies.filter((c) => c.status === "ISSUED").length;

    let availabilityStatus: SafeBookSummary["availabilityStatus"] = "Availability unknown";
    if (totalCopies === 0) {
      availabilityStatus = "Availability unknown";
    } else if (availableCopies > 0) {
      availabilityStatus = "Available";
    } else if (referenceOnlyCopies === totalCopies) {
      availabilityStatus = "Reference only";
    } else {
      availabilityStatus = "All copies issued";
    }

    return {
      id: b.id,
      isbn: b.isbn,
      title: b.title,
      subtitle: b.subtitle,
      edition: b.edition,
      publicationYear: b.publicationYear,
      language: b.language,
      ddcCode: b.ddcCode,
      bookNumber: b.bookNumber,
      description: b.description,
      coverImageUrl: b.coverImageUrl,
      publisher: b.publisher?.name || "Official Publications",
      category: b.category
        ? {
            id: b.category.id,
            name: b.category.name,
            code: b.category.code,
            ddcPrefix: b.category.ddcPrefix,
          }
        : null,
      authors: b.authors.map((a) => a.author.name).join(", "),
      totalCopies,
      availableCopies,
      issuedCopies,
      referenceOnlyCopies,
      primaryLocation: b.copies[0]?.shelfLocation || "Main Reading Hall",
      availabilityStatus,
      shelfLocations: [b.copies[0]?.shelfLocation || "Main Reading Hall"],
    };
  });

  return {
    featured: safeFeatured,
    editorsChoice: editorsChoice.items,
    popular: popular.items,
    recentlyAdded: recentlyAdded.items,
  };
}

export async function getCategoriesWithCounts() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { books: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    code: c.code,
    ddcPrefix: c.ddcPrefix,
    description: c.description,
    iconName: c.iconName,
    accentColor: c.accentColor || "teal",
    booksCount: c._count.books,
  }));
}

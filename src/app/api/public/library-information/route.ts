import { NextResponse } from "next/server";

export async function GET() {
  const libraryInfo = {
    name: "Government Public Library & Reading Room",
    hindiName: "सार्वजनिक ई-पुस्तकालय एवं वाचनालय",
    establishedYear: 1954,
    address: {
      street: "Central Secretariat Administrative Enclave, CGO Complex",
      city: "New Delhi",
      state: "Delhi",
      pinCode: "110003",
      landmark: "Adjacent to National Archives of India & National Digital Library Node",
    },
    timings: {
      weekdays: "08:00 AM – 08:00 PM (Monday to Saturday)",
      sunday: "10:00 AM – 05:00 PM (Reference & Reading Hall Only)",
      gazettedHolidays: "Closed on National and Gazetted Holidays",
    },
    circulationDeskHours: "09:00 AM – 06:30 PM (Mon–Sat)",
    contact: {
      helpdeskEmail: "helpdesk@library.gov.in",
      circulationPhone: "+91-11-23384501",
      librarianOffice: "+91-11-23384502",
    },
    membershipQuotas: [
      { category: "GENERAL_CITIZEN", label: "General Citizen", maxBooks: 3, durationDays: 14, fee: 100 },
      { category: "STUDENT", label: "Student & Youth", maxBooks: 4, durationDays: 21, fee: 50 },
      { category: "SENIOR_CITIZEN", label: "Senior Citizen (60+)", maxBooks: 5, durationDays: 28, fee: 0 },
      { category: "RESEARCHER", label: "Doctoral / Academic Researcher", maxBooks: 8, durationDays: 30, fee: 200 },
      { category: "GOVT_STAFF", label: "Government Staff", maxBooks: 5, durationDays: 28, fee: 0 },
    ],
    rules: [
      "Physical books must be handled with care. Dog-earing or marking text is strictly prohibited.",
      "Books may be renewed up to 2 times online or at the circulation desk if no hold/reservation exists.",
      "Overdue fine is assessed per policy (₹1–₹2 per day after grace period) to encourage prompt return.",
      "Lost or severely damaged books must be reported immediately; replacement value or assessed fee applies.",
      "Public catalogue is open for citizen discovery without sign-in; borrowing requires valid membership card.",
    ],
  };

  return NextResponse.json(libraryInfo);
}

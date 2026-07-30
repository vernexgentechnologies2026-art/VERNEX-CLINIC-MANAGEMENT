import type { Medicine, PharmacyBill, PharmacyStats, PrescriptionQueueItem, PurchaseEntry, Supplier } from "./types";

export const suppliers: Supplier[] = [
  { id: "s1", name: "MedPlus Bengaluru Wholesale", phone: "+91 90001 10001" },
  { id: "s2", name: "Sri Sai Pharma Distributors", phone: "+91 90002 20002" },
  { id: "s3", name: "Apollo Medical Supply", phone: "+91 90003 30003" }
];

export const medicines: Medicine[] = [
  { id: "m1", name: "Paracetamol 500mg", genericName: "Paracetamol", category: "general", batchNumber: "PCM-B24", expiryDate: "2027-02-10", currentStock: 240, reorderLevel: 80, purchasePrice: 1.2, sellingPrice: 2.5, mrp: 3, supplier: suppliers[0].name, gst: 12, stockStatus: "in_stock", expiryStatus: "safe", lastPurchaseDate: "2026-06-12" },
  { id: "m2", name: "Amoxicillin 500mg", genericName: "Amoxicillin", category: "antibiotic", batchNumber: "AMX-11", expiryDate: "2026-08-15", currentStock: 18, reorderLevel: 50, purchasePrice: 4, sellingPrice: 8, mrp: 10, supplier: suppliers[1].name, gst: 12, stockStatus: "low_stock", expiryStatus: "expiring_soon", lastPurchaseDate: "2026-05-28" },
  { id: "m3", name: "Cetirizine 10mg", genericName: "Cetirizine", category: "general", batchNumber: "CTZ-91", expiryDate: "2027-01-20", currentStock: 0, reorderLevel: 60, purchasePrice: 1, sellingPrice: 2, mrp: 3, supplier: suppliers[0].name, stockStatus: "out_of_stock", expiryStatus: "safe", lastPurchaseDate: "2026-04-18" },
  { id: "m4", name: "Pantoprazole 40mg", genericName: "Pantoprazole", category: "general", batchNumber: "PAN-44", expiryDate: "2026-06-20", currentStock: 32, reorderLevel: 70, purchasePrice: 2, sellingPrice: 5, mrp: 6, supplier: suppliers[2].name, stockStatus: "expired", expiryStatus: "expired", lastPurchaseDate: "2026-03-02" },
  { id: "m5", name: "Azithromycin 500mg", genericName: "Azithromycin", category: "antibiotic", batchNumber: "AZT-77", expiryDate: "2026-09-05", currentStock: 24, reorderLevel: 40, purchasePrice: 9, sellingPrice: 16, mrp: 20, supplier: suppliers[1].name, stockStatus: "low_stock", expiryStatus: "expiring_soon", lastPurchaseDate: "2026-06-02" },
  { id: "m6", name: "Vitamin D3", genericName: "Cholecalciferol", category: "supplement", batchNumber: "VD3-10", expiryDate: "2027-05-01", currentStock: 120, reorderLevel: 40, purchasePrice: 5, sellingPrice: 12, mrp: 15, supplier: suppliers[2].name, stockStatus: "in_stock", expiryStatus: "safe", lastPurchaseDate: "2026-06-20" },
  { id: "m7", name: "ORS Sachet", genericName: "Oral Rehydration Salts", category: "pediatric", batchNumber: "ORS-19", expiryDate: "2027-03-15", currentStock: 42, reorderLevel: 60, purchasePrice: 8, sellingPrice: 15, mrp: 18, supplier: suppliers[0].name, stockStatus: "low_stock", expiryStatus: "safe", lastPurchaseDate: "2026-05-12" },
  { id: "m8", name: "Chlorhexidine Mouthwash", genericName: "Chlorhexidine", category: "dental", batchNumber: "CHX-28", expiryDate: "2027-04-11", currentStock: 55, reorderLevel: 20, purchasePrice: 52, sellingPrice: 90, mrp: 110, supplier: suppliers[1].name, stockStatus: "in_stock", expiryStatus: "safe", lastPurchaseDate: "2026-06-01" },
  { id: "m9", name: "Skin Allergy Cream", genericName: "Topical anti-allergy", category: "skin", batchNumber: "SKN-07", expiryDate: "2026-07-25", currentStock: 14, reorderLevel: 25, purchasePrice: 45, sellingPrice: 80, mrp: 95, supplier: suppliers[2].name, stockStatus: "expiring_soon", expiryStatus: "expiring_soon", lastPurchaseDate: "2026-04-28" },
  { id: "m10", name: "Pain Relief Gel", genericName: "Diclofenac gel", category: "physiotherapy", batchNumber: "PRG-52", expiryDate: "2027-08-05", currentStock: 38, reorderLevel: 30, purchasePrice: 60, sellingPrice: 120, mrp: 145, supplier: suppliers[2].name, stockStatus: "in_stock", expiryStatus: "safe", lastPurchaseDate: "2026-06-15" }
];

export const prescriptionQueue: PrescriptionQueueItem[] = [
  { id: "rx1", token: "A009", patientName: "Neha Iyer", phone: "+91 98765 43210", doctorName: "Dr. Priya Sharma", diagnosis: "Viral fever", prescriptionTime: "10:34 AM", status: "pending", paymentStatus: "pending", medicines: [{ medicineName: "Paracetamol 500mg", dosage: "1 tablet", frequency: "1-0-1", timing: "After food", duration: "3 days", availability: "in_stock" }, { medicineName: "ORS Sachet", dosage: "1 sachet", frequency: "0-1-0", timing: "After food", duration: "2 days", availability: "low_stock" }] },
  { id: "rx2", token: "A012", patientName: "Ramesh Gupta", phone: "+91 90000 11122", doctorName: "Dr. Priya Sharma", diagnosis: "BP review", prescriptionTime: "10:48 AM", status: "billed", paymentStatus: "partial", medicines: [{ medicineName: "Pantoprazole 40mg", dosage: "1 tablet", frequency: "1-0-0", timing: "Before food", duration: "5 days", availability: "expired" }] },
  { id: "rx3", token: "A015", patientName: "Meera Patel", phone: "+91 98888 22110", doctorName: "Dr. Aisha Khan", diagnosis: "Skin allergy", prescriptionTime: "11:05 AM", status: "pending", paymentStatus: "pending", medicines: [{ medicineName: "Cetirizine 10mg", dosage: "1 tablet", frequency: "0-0-1", timing: "After food", duration: "5 days", availability: "out_of_stock" }, { medicineName: "Skin Allergy Cream", dosage: "Apply thin layer", frequency: "1-0-1", timing: "After bath", duration: "7 days", availability: "expiring_soon" }] }
];

export const pharmacyBills: PharmacyBill[] = [
  { id: "PH-1021", patientName: "Arjun Nair", doctorName: "Dr. Rohan Mehta", prescriptionId: "rx-old-1", items: [{ medicineName: "Chlorhexidine Mouthwash", quantity: 1, unitPrice: 90, discount: 0 }], subtotal: 90, discount: 0, total: 90, paymentMode: "upi", paymentStatus: "paid", createdAt: "09:50 AM" },
  { id: "PH-1022", patientName: "Karthik Menon", doctorName: "Dr. Nikhil Rao", items: [{ medicineName: "Pain Relief Gel", quantity: 1, unitPrice: 120, discount: 10 }], subtotal: 120, discount: 10, total: 110, paymentMode: "cash", paymentStatus: "paid", createdAt: "10:12 AM" }
];

export const purchaseEntries: PurchaseEntry[] = [
  { id: "pe1", supplierName: suppliers[0].name, invoiceNumber: "INV-2201", purchaseDate: "2026-06-20", items: [{ medicineName: "Vitamin D3", batchNumber: "VD3-10", expiryDate: "2027-05-01", quantity: 100, purchasePrice: 5, sellingPrice: 12, mrp: 15 }], totalAmount: 500, status: "saved" },
  { id: "pe2", supplierName: suppliers[1].name, invoiceNumber: "INV-2207", purchaseDate: "2026-06-12", items: [{ medicineName: "Paracetamol 500mg", batchNumber: "PCM-B24", expiryDate: "2027-02-10", quantity: 300, purchasePrice: 1.2, sellingPrice: 2.5, mrp: 3 }], totalAmount: 360, status: "saved" }
];

export const pharmacyStats: PharmacyStats = { pendingPrescriptions: prescriptionQueue.filter((p) => p.status === "pending").length, todaySales: 12840, lowStock: medicines.filter((m) => m.stockStatus === "low_stock").length, expiringSoon: medicines.filter((m) => m.expiryStatus === "expiring_soon").length, outOfStock: medicines.filter((m) => m.stockStatus === "out_of_stock").length, billsToday: 27 };

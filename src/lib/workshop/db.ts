import Dexie, { type Table } from "dexie";
import type {
  Bill,
  Customer,
  Settings,
  StockItem,
  StockMovement,
  StoredFile,
  Vehicle,
} from "./types";

export class WorkshopDB extends Dexie {
  settings!: Table<Settings, number>;
  stockItems!: Table<StockItem, string>;
  stockMovements!: Table<StockMovement, string>;
  customers!: Table<Customer, string>;
  vehicles!: Table<Vehicle, string>;
  bills!: Table<Bill, string>;
  files!: Table<StoredFile, string>;

  constructor() {
    super("samriddhi-workshop-os");
    this.version(1).stores({
      settings: "id",
      stockItems: "id, sku, displayName, brand, supplier, archived",
      stockMovements: "id, itemId, type, date, billId, createdAt",
      customers: "id, phone, name",
      vehicles: "id, customerId, vehicleNo",
      bills: "id, status, date, invoiceNo, phone, vehicleNo, customerId, printedAt",
      files: "id, path, createdAt",
    });
  }
}

let _db: WorkshopDB | null = null;

export function getDb(): WorkshopDB {
  if (typeof indexedDB === "undefined") {
    throw new Error("IndexedDB is not available");
  }
  if (!_db) _db = new WorkshopDB();
  return _db;
}

export function isBrowserDb(): boolean {
  return typeof indexedDB !== "undefined";
}

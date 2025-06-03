import { ProjectDB } from "./project-db";
import { UserDB } from "./user-db";
import { WorkEntryDB } from "./work-entry-db";

const globalForDB = globalThis as unknown as { db?: DB };

class DB {
   public user: UserDB;
   public project: ProjectDB;
   public workEntry: WorkEntryDB;

   private static instance: DB;

   private constructor() {
      this.user = new UserDB();
      this.project = new ProjectDB();
      this.workEntry = new WorkEntryDB();
   }

   public static getInstance(): DB {
      if (!DB.instance) {
         DB.instance = new DB();
      }
      return DB.instance;
   }
}

export const db = globalForDB.db ?? DB.getInstance();

if (process.env.NODE_ENV !== "production") {
   globalForDB.db = db;
}

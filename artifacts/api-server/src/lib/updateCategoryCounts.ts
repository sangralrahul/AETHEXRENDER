import { db, productsTable, categoriesTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

async function run() {
  const cats = await db.select({ slug: categoriesTable.slug }).from(categoriesTable);
  for (const cat of cats) {
    const res = await db.select({ cnt: sql<number>`count(*)` }).from(productsTable).where(eq(productsTable.categorySlug, cat.slug));
    const cnt = Number(res[0]?.cnt ?? 0);
    await db.update(categoriesTable).set({ productCount: cnt }).where(eq(categoriesTable.slug, cat.slug));
    if (cnt > 0) console.log(`${cat.slug}: ${cnt} products`);
  }
  console.log("Category counts updated!");
  process.exit(0);
}
run().catch(e => { console.error(e); process.exit(1); });

// src/app/page.tsx
import { connectToDatabase } from "@/lib/mongodb";

export default async function HomePage() {
  await connectToDatabase();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Trang Quản Lý Dự Án</h1>
      <p className="mt-4">Đã kết nối MongoDB thành công!</p>
    </main>
  );
}

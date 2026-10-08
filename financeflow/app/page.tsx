// app/page.tsx
import prisma from './lib/prisma'

export default async function Dashboard() {
  // Mengambil data user dan kategori langsung dari database SQLite
  const users = await prisma.user.findMany()
  const categories = await prisma.category.findMany()

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Finance Dashboard</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold border-b mb-4">Daftar Pengguna</h2>
        {users.length === 0 ? (
          <p className="text-gray-500">Belum ada user. Silakan jalankan seeding.</p>
        ) : (
          <ul>
            {users.map(User => (
              <li key={User.id}>{User.name} - {User.email}</li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold border-b mb-4">Kategori</h2>
        {categories.length === 0 ? (
          <p className="text-gray-500">Belum ada kategori.</p>
        ) : (
          <div className="flex gap-4">
            {categories.map(cat => (
              <span 
                key={cat.id} 
                className={`px-3 py-1 rounded text-sm text-white ${cat.type === 'INCOME' ? 'bg-green-600' : 'bg-red-600'}`}
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
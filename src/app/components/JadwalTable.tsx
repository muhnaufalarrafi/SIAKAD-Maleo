import { JadwalKelas } from '@/app/lib/class/jadwalKelas';
import { Button } from '@/app/components/button/Button';

interface JadwalTableProps {
  jadwals: JadwalKelas[];
  handleEdit: (j: JadwalKelas) => void;
  handleDelete: (id: string) => void;
  getMapelName: (id: string) => string;
  getTutorName: (id: string) => string;
  getKelasName: (id?: string) => string;
}

export function JadwalTable({
  jadwals,
  handleEdit,
  handleDelete,
  getMapelName,
  getTutorName,
  getKelasName,
}: JadwalTableProps) {
  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow p-6">
      <table className="min-w-full text-sm">
        <thead className="bg-[#18355E] text-white">
          <tr>
            <th className="py-3 px-4 text-left">#</th>
            <th className="py-3 px-4 text-left">Hari</th>
            <th className="py-3 px-4 text-left">Jam Mulai</th>
            <th className="py-3 px-4 text-left">Jam Selesai</th>
            <th className="py-3 px-4 text-left">Tempat</th>
            <th className="py-3 px-4 text-left">Keterangan</th>
            <th className="py-3 px-4 text-left">Mata Pelajaran</th>
            <th className="py-3 px-4 text-left">Tutor</th>
            <th className="py-3 px-4 text-left">Kelas</th>
            <th className="py-3 px-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {jadwals.map((j, i) => {
            const kelasName = getKelasName(j.kelas_id);
            return (
              <tr key={j.id} className="hover:bg-[#F5F8FF]/60 text-[#18355E]">
                <td className="py-3 px-4">{i + 1}</td>
                <td className="py-3 px-4">{j.hari}</td>
                <td className="py-3 px-4">{j.jam_mulai}</td>
                <td className="py-3 px-4">{j.jam_selesai}</td>
                <td className="py-3 px-4">{j.tempat ?? '-'}</td>
                <td className="py-3 px-4">{j.keterangan ?? '-'}</td>
                <td className="py-3 px-4">{getMapelName(j.mata_pelajaran_id)}</td>
                <td className="py-3 px-4">{getTutorName(j.tutor_id)}</td>
                <td className="py-3 px-4">
                  {kelasName !== '-' ? `Kelas ${kelasName}` : '-'}
                </td>
                <td className="py-3 px-4 text-center whitespace-nowrap">
                  <Button
                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs"
                    onClick={() => handleEdit(j)}
                  >
                    Edit
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white text-xs"
                    onClick={() => handleDelete(j.id)}
                  >
                    Hapus
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
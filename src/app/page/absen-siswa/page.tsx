// src/app/page/absen-siswa/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { getJadwalByTutorId, JadwalKelas } from '@/app/lib/class/jadwalKelas';
import { getAllKelasSiswa } from '@/app/lib/class/kelasSiswa';
import { getAllSiswa, Siswa } from '@/app/lib/users/siswa';
import {
  getAbsensiSiswaByJadwalTanggal,
  bulkUpsertAbsensiSiswa,
  AbsensiSiswaInput,
  AbsensiStatus,
  JenisTugas
} from '@/app/lib/absence/siswa';

import FormSelect from '@/app/components/FormSelect';
import MapelSelect      from '@/app/components/MapelSelect';
import ModulSelect      from '@/app/components/ModulSelect';
import MateriSelect     from '@/app/components/MateriSelect';
import SubMateriSelect  from '@/app/components/SubMateriSelect';
import TipeTugasSelect  from '@/app/components/TipeTugasSelect';

export default function AbsenSiswaPage() {
  const { user } = useAuth();

  // jadwal hari ini & pilihan
  const [jadwalList, setJadwalList]         = useState<JadwalKelas[]>([]);
  const [selectedJadwal, setSelectedJadwal] = useState<JadwalKelas | null>(null);

  // kurikulum inputs
  const [mapel, setMapel]         = useState('');
  const [modul, setModul]         = useState('');
  const [materi, setMateri]       = useState('');
  const [subMateri, setSubMateri] = useState('');
  const [tipeTugas, setTipeTugas] = useState('');
  const [isiTugas, setIsiTugas]   = useState('');

  // data siswa & attendance
  const [students, setStudents]   = useState<Siswa[]>([]);
  const [attendance, setAttendance] =
    useState<Record<string, { status: string; catatan: string }>>({});

  // UI states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState<string | null>(null);

const getToday = () => new Date().toISOString().split('T')[0];

  // load jadwal hari ini
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getJadwalByTutorId(user!.id)
      .then(g => {
        const all = Object.values(g).flat();
        // note ini untuk jika ingin yang di tampiplkan automatis filter  perhari
        //const names = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
        //setJadwalList(all.filter(j => j.hari === names[new Date().getDay()]));
        setJadwalList(all); // <-- Langsung set semua jadwal yang diterima
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [user]);

  // load siswa & existing attendance saat jadwal berubah
  useEffect(() => {
    if (!selectedJadwal) {
      setStudents([]);
      setAttendance({});
      return;
    }
    setLoading(true);
    const today = getToday();
    getAllKelasSiswa()
      .then(rel => {
        const sisIds = rel
          .filter(r => String(r.kelas_id) === String(selectedJadwal.kelas_id))
          .map(r => r.siswa_id);
        return getAllSiswa().then(all => all.filter(s => sisIds.includes(s.id)));
      })
      .then(sisList => {
        setStudents(sisList);
        return getAbsensiSiswaByJadwalTanggal(
          String(selectedJadwal.id), 
          today
        );
      })
      .then(existing => {
        const map: typeof attendance = {};
        existing.forEach(r => {
          map[r.siswa_id] = { status: r.status, catatan: r.catatan || '' };
        });
        setAttendance(map);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [selectedJadwal]);

  // handlers
  const handleStatusChange = (id: string, st: string) =>
    setAttendance(a => ({ ...a, [id]: { status: st, catatan: a[id]?.catatan || '' } }));
  const handleCatatanChange = (id: string, ct: string) =>
    setAttendance(a => ({ ...a, [id]: { status: a[id]?.status || 'hadir', catatan: ct } }));

  // tanda “semua hadir”
  const handleSelectAll = (checked: boolean) => {
    setAttendance(a => {
      const nxt: typeof a = {};
      students.forEach(s => {
        nxt[s.id] = { status: checked ? 'hadir' : a[s.id]?.status || 'hadir',
                      catatan: a[s.id]?.catatan || '' };
      });
      return nxt;
    });
  };

  // simpan bulk
  const handleSave = async () => {
    if (!user) return;
    if (!selectedJadwal) return;
    setSaving(true);
    const today = getToday();
    const payload: AbsensiSiswaInput[] = students.map(s => ({
      jadwal_id: String(selectedJadwal.id),
      siswa_id:  String(s.id),
      tanggal:   today,
      status:    (attendance[s.id]?.status as AbsensiStatus) || 'hadir',
      catatan:   attendance[s.id]?.catatan || '',
      tutor_id:  String(user.id),
      kelas_id:  String(selectedJadwal.kelas_id),
      sub_materi_id:       subMateri  || undefined,
      jenis_tugas:         (tipeTugas ? (tipeTugas as JenisTugas) : undefined),
      isi_tugas:           isiTugas   || undefined,
      tanggal_pengumpulan: undefined,
      ketercapaian:        undefined
    }));
    try {
      await bulkUpsertAbsensiSiswa(payload);
      alert('Absensi berhasil disimpan');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      alert('Gagal: ' + msg);
    } finally {
      setSaving(false);
    }
  };

  if (!user || loading) return <div className="p-6">Loading…</div>;
  if (error)            return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-8 bg-[#F5F8FF] min-h-screen">
      <h1 className="text-2xl font-semibold text-[#18355E] mb-6">
        Absen Siswa Hari Ini
      </h1>

      {/* Pilih Jadwal */}
      <div className="mb-4 flex items-center space-x-4">
        <span className="w-32 text-sm font-medium text-[#18355E]">Pilih Jadwal:</span>
        <FormSelect
          value={selectedJadwal?.id ? String(selectedJadwal.id) : ''}
          onChange={(val) => {
            const sel = jadwalList.find(j => String(j.id) === val) || null;
            setSelectedJadwal(sel);
          }}
          placeholder="-- Pilih Jadwal --"
          options={jadwalList.map(j => ({
            value: String(j.id),
            label: `${j.kelas_id} || ${j.nama_mapel} || ${j.hari} || ${j.jam_mulai}-${j.jam_selesai}`
          }))}
        />
      </div>

      {/* Pilih Mapel & Modul */}
      <div className="mb-4 flex items-center space-x-4">
        <span className="w-32 text-sm font-medium text-[#18355E]">Pilih :</span>
        <MapelSelect
          value={mapel}
          onChange={setMapel}
        />
        <ModulSelect
          value={modul}
          onChange={setModul}
        />
      </div>

      {/* Pilih Materi, SubMateri, Tipe Tugas */}
      <div className="mb-6 flex items-center space-x-4">
        <span className="w-32 text-sm font-medium text-[#18355E]">Pilih :</span>
        <MateriSelect
          value={materi}
          onChange={setMateri}
        />
        <SubMateriSelect
          value={subMateri}
          onChange={setSubMateri}
        />
        <TipeTugasSelect
          value={tipeTugas}
          onChange={setTipeTugas}
        />
      </div>

      {/* Isi Tugas */}
      <div className="mb-8">
        <textarea
          className="w-full bg-white border border-gray-200 rounded-xl p-4 shadow-sm focus:outline-none text-[#18355E]"
          rows={2}
          placeholder="Isi Tugas …."
          value={isiTugas}
          onChange={e => setIsiTugas(e.target.value)}
        />
      </div>

      {/* Checkbox “Tandai semua Hadir” */}
      <div className="mb-4 flex items-center">
        <input
          id="selectAll"
          type="checkbox"
          className="h-4 w-4 text-[#18355E] border-gray-300 rounded"
          onChange={e => handleSelectAll(e.target.checked)}
        />
        <label
          htmlFor="selectAll"
          className="ml-2 text-[#18355E] font-medium"
        >
          Tandai semua Hadir
        </label>
      </div>

      {/* Tabel Absen */}
      <div className="bg-white rounded-3xl shadow-lg ring-1 ring-[#18355E]/20 overflow-x-auto">
        <table className="min-w-full table-fixed text-[#18355E]">
          <thead>
            <tr className="bg-[#18355E]">
              {['#','Nama','NIS','Status','Catatan'].map(col => (
                <th
                  key={col}
                  className="px-6 py-4 text-left text-white"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.map((s, i) => {
              const rec = attendance[s.id] || { status: 'hadir', catatan: '' };
              return (
                <tr
                  key={s.id}
                  className={i % 2 === 0 ? 'bg-white' : 'bg-[#F5F8FF]'}
                >
                  <td className="px-6 py-4">{i + 1}</td>
                  <td className="px-6 py-4">{s.nama_lengkap}</td>
                  <td className="px-6 py-4">{s.nis}</td>
                  <td className="px-6 py-4">
                    <select
                      className="bg-transparent w-full focus:outline-none text-[#18355E]"
                      value={rec.status}
                      onChange={e => handleStatusChange(s.id, e.target.value)}
                    >
                      <option value="hadir">Hadir</option>
                      <option value="izin">Izin</option>
                      <option value="sakit">Sakit</option>
                      <option value="alfa">Alfa</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      className="bg-transparent w-full focus:outline-none text-[#18355E]"
                      placeholder="—"
                      value={rec.catatan}
                      onChange={e => handleCatatanChange(s.id, e.target.value)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Tombol Simpan */}
      {selectedJadwal && (
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-[#18355E] hover:bg-[#0F2850] text-white rounded-2xl font-semibold shadow disabled:opacity-50"
          >
            {saving ? 'Menyimpan…' : 'Simpan Absensi'}
          </button>
        </div>
      )}
    </div>
  );
}

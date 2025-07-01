import React, { useContext, useEffect, useState } from 'react'
import SectionTitle from '../components/SectionTitle/Index'
import Footer from '../components/Footer/Index'
import Navbar from '../components/Navbar/Index'
import { Loading } from '../../contexts/LoadingContext'
import axios from 'axios'
import { Villager } from '../../contexts/VillagerContext'
import Paragraph from '../components/Paragraph'
import { useNavigate } from 'react-router-dom'
import { Toast } from '../../contexts/ToastContext'

const ServiceFormPage = () => {
    const {isPageLoading, setIsPageLoading} = useContext(Loading);
    const {villager, setVillager} = useContext(Villager);
    const [selectedService, setSelectedService] = useState(null);
    const [formData, setFormData] = useState({});
    const {showToast} = useContext(Toast);
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;
    const additionalData = [
      {
        service: 'Surat Keterangan Domisili',
        data: null,
      },
      {
        service: 'Surat Keterangan Tidak Mampu',
        data: ["Peruntukan Surat Keterangan (jika diperlukan)", "Keterangan Penghasilan Orang Tua (jika diperlukan)"],
      },
      {
        service: 'Surat Perjanjian Jual Beli',
        data: ["Data Pihak Pertama dan Kedua seperti Nama, Tempat dan Tanggal Lahir, Jenis Kelamin, Pekerjaan, dan Alamat", "Barang yang diperjualbelikan", "Keterangan barang yang diperjualbelikan (contoh: luas tanah untuk tanah)", "Harga Barang yang diperjualbelikan"],
      },
      {
        service: 'Surat Keterangan Wali',
        data: ["Data Wali seperti Nama, Tempat dan Tanggal Lahir, Jenis Kelamin, dan Alamat Wali"],
      },
      {
        service: 'Surat Keterangan Pernah Bekerja',
        data: ["Data tempat kerja dan posisi yang dijabat yang akan dijadikan riwayat pekerjaan"],
      },
      {
        service: 'Surat Keterangan Menikah',
        data: ["Nama orang tua pemohon dan suami/istri", "Data suami/istri pemohon (Nama, NIK, Tempat dan Tanggal Lahir, Pekerjaan, Alamat, dan Pendidikan Terakhir)", "Tanggal Pernikahan", "Tempat Pernikahan", "Pihak yang menikahkan", "Saksi pernikahan", "Mahar pernikahan"],
      },
      {
        service: 'Surat Keterangan Kematian',
        data: ["Data penduduk yang meninggal (Nama, Tempat dan Tanggal Lahir, Pekerjaan, Jenis Kelamin, Alamat)"],
      },
      {
        service: 'Surat Keterangan Kelahiran',
        data: ["Nama, jenis kelamin", "tempat dilahirkan", "tempat kelahiran (Rumah Sakit/Bersalin, Puskesmas, Polindes, Rumah, Lainnya)", "tanggal", "jenis kelahiran (tunggal, kembar, kembar 2, kembar 3, lainnya", "Penolong Kelahiran (Dokter, Bidan/Perawat, Dukun, Lainnya)", "Berat Bayi (kg)", "Panjang Bayi (cm)", "Data Ibu dan Ayah (NIK, Nama, Tempat dan Tanggal Lahir, Pekerjaan, Alamat, Kewarganegaraan, Kebangsaan)", "Tanggal pencatatan perkawinan", "Data pelapor (NIK, Nama, Umur, Jenis Kelamin, Pekerjaan, Alamat)", "Data saksi (Data pelapor (NIK, Nama, Umur, Jenis Kelamin, Pekerjaan, Alamat)"],
      },
      {
        service: 'Surat Pengantar Izin Keramaian',
        data: ["Nama atau jenis kegiatan", "Tempat dan Tanggal kegiatan"],
      },
      {
        service: 'Surat Pengantar SKCK',
        data: ["Data orang tua (Nama dan alamat)", "Tujuan pembuatan SKCK"],
      },
      {
        service: 'Surat Permohonan Pembuatan Kartu Keluarga',
        data: ["Nomor KK Semula", "Kode Pos", "Nomor Telepon", "Alasan Permohonan", "Jumlah anggota keluarga", "Daftar Anggota Keluarga (Nama dan NIK)"],
      },
    ];
    useEffect(() => {
        if(villager) {
            setFormData({_id: villager._id, uid: villager.uid, name: villager.name});
            setIsPageLoading(false);
        };
        axios.get(`${apiUrl}/v1/villager/getaccess`, {withCredentials:true})
          .then(res => {
            const data = res.data;
            setVillager(data);
            setFormData({_id: data._id, uid: data.uid, name: data.name})
          })
          .catch((err) => {
            console.log(err)
            navigate('/401')
          })
          .finally(() => {
            setIsPageLoading(false);
          })
      }, []);

    const handleFormChange = (e) => {
      const id = e.target.id;
      const value = e.target.value;
      setFormData(prevData => ({...prevData, [id]: value}));
    };

    const handleSubmitRequest = () => {
      const data = new FormData();
      data.append('service', formData.service);
      data.append('name', formData.name);
      data.append('address', formData.address);
      data.append('uid', formData.uid);
      data.append('relgion', formData.relgion);
      data.append('gender', formData.gender);
      data.append('birthDate', formData.birthDate);
      data.append('birthPlace', formData.birthPlace);
      data.append('education', formData.education);
      data.append('occupation', formData.occupation);
      data.append('note', formData.note);
      data.append('marriageStatus', formData.marriageStatus);
      data.append('phone', formData.phone);
      data.append('villager', JSON.stringify(villager));
      axios.post(`${apiUrl}/v1/reqservice/create`, data, {withCredentials:true})
        .then(res => {
          console.log(res);
          showToast(res.data.message, 'success');
          navigate('/services/service/request')
        })
        .catch(err => console.log(err));
    }

    useEffect(() => {
      const selectedData = additionalData.find(item => item.service == formData.service);
      setSelectedService(selectedData)
    }, [formData.service]);
    
  return (
    <>
      {villager && formData && (
        <div className='relative'>
            <Navbar />
            <div className='flex flex-col md:flex-row justify-between w-full'>
              <SectionTitle>PENGAJUAN LAYANAN</SectionTitle>
              {!isPageLoading && villager && (
                <div className='flex flex-row-reverse md:flex-row py-5 px-16 gap-x-3'>
                  <div className='flex flex-col items-start md:items-end'>
                    <Paragraph weight = 'font-normal'>Anda mengakses layanan sebagai</Paragraph>
                    <Paragraph>{`${villager.name} (${villager.uid})`}</Paragraph>
                    {/* <Paragraph size = 'text-xs' otherClass = 'underline cursor-pointer'><span onClick={handleLogout}>Keluar</span></Paragraph> */}
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-black h-8 w-8 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              )}
            </div>
            <div className='flex flex-col items-center'>
                <fieldset className="fieldset w-2/3 md:w-1/2 bg-base-200 border-base-300 rounded-box w-xs border p-4">
    
                    <label htmlFor='service' className="label">Pilih Layanan</label>
                    <select id='service' onChange={handleFormChange} defaultValue="" className="select w-full">
                        <option value="" disabled={true}>Pilih Layanan</option>
                        <option>Surat Keterangan Domisili</option>
                        <option>Surat Keterangan Tidak Mampu</option>
                        <option>Surat Perjanjian Jual Beli</option>
                        <option>Surat Keterangan Wali</option>
                        <option>Surat Keterangan Pernah Bekerja</option>
                        <option>Surat Keterangan Menikah</option>
                        <option>Surat Keterangan Kematian</option>
                        <option>Surat Keterangan Kelahiran</option>
                        <option>Surat Pengantar Izin Keramaian</option>
                        <option>Surat Pengantar SKCK</option>
                        <option>Surat Permohonan Pembuatan Kartu Keluarga</option>
                        <option>Surat Lainnya</option>
                    </select>
    
                    <label htmlFor='name' className="label">Nama</label>
                    <input onChange={handleFormChange} id='name' type="text" defaultValue={formData.name || ""} className="input w-full" placeholder="Nama" />
    
                    <div className='flex flex-row gap-1'>
                        <label htmlFor='uid' className="label">NIK</label>
                        <div className="tooltip tooltip-right" data-tip="Anda tidak dapat mengubah kolom NIK">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-3 w-3 shrink-0 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                    </div>
                    <input disabled id='uid' type='text' value={formData.uid || ""} className="input w-full" placeholder="NIK" />
    
                    <label htmlFor='address' className="label">Alamat</label>
                    <input onChange={handleFormChange} id='address' type="text" className="input w-full" placeholder="Alamat" />

                    <label htmlFor='birthPlace' className="label">Tempat Lahir</label>
                    <input onChange={handleFormChange} id='birthPlace' type="text" className="input w-full" placeholder="Tempat Lahir" />

                    <label htmlFor='birthDate' className="label">Tanggal Lahir</label>
                    <input onChange={handleFormChange} id='birthDate' type="date" className="input w-full" placeholder="Tanggal Lahir" />

                    <label htmlFor='gender' className="label">Jenis Kelamin</label>
                    <select onChange={handleFormChange} id='gender' defaultValue="" className="select w-full">
                        <option value="" disabled={true}>Jenis Kelamin</option>
                        <option>Laki-laki</option>
                        <option>Perempuan</option>
                    </select>

                    <label htmlFor='occuation' className="label">Pekerjaan</label>
                    <input onChange={handleFormChange} id='occupation' type="text" className="input w-full" placeholder="Pekerjaan" />

                    <label htmlFor='religion' className="label">Agama</label>
                    <select onChange={handleFormChange} id='religion' defaultValue="" className="select w-full">
                        <option value="" disabled={true}>Agama</option>
                        <option>Islam</option>
                        <option>Kristen Protestan</option>
                        <option>Kristen Katolik</option>
                        <option>Hindu</option>
                        <option>Buddha</option>
                        <option>Konghucu</option>
                        <option>Lainnya</option>
                    </select>

                    <label htmlFor='marriageStatus' className="label">Status Perkawinan</label>
                    <select onChange={handleFormChange} id='marriageStatus' defaultValue="" className="select w-full">
                        <option value="" disabled={true}>Status Perkawinan</option>
                        <option>Kawin</option>
                        <option>Belum Kawin</option>
                        <option>Duda</option>
                        <option>Janda</option>
                    </select>

                    <label htmlFor='education' className="label">Pendidikan Terakhir</label>
                    <select onChange={handleFormChange} id='education' defaultValue="" className="select w-full">
                        <option value="" disabled={true}>Pendidikan Terakhir</option>
                        <option>SD Sederajat</option>
                        <option>SMP Sederajat</option>
                        <option>SMA Sederajat</option>
                        <option>Sarjana/D4</option>
                        <option>Magister</option>
                        <option>Doktor</option>
                    </select>

                    <div className='flex flex-row gap-1'>
                        <label htmlFor='phone' className="label">No. Handphone</label>
                        <div className="tooltip tooltip-right" data-tip="Masukkan No. HP yang dapat dihubungi (diutamakan Whatsapp)">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-3 w-3 shrink-0 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                    </div>
                    <input onChange={handleFormChange} id='phone' type="text" className="input w-full" placeholder="Nomor Handphone" />

                    <div className='flex flex-row gap-1'>
                        <label htmlFor='note' className="label">Keterangan Tambahan</label>
                        <div className="tooltip tooltip-right" data-tip="Anda perlu melengkapi data tambahan yang dibutuhkan dan diperlukan untuk dilampirkan dalam surat yang akan diterbitkan">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-3 w-3 shrink-0 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                    </div>
                    <ul className='flex flex-col gap-y-2 list-disc list-inside'>
                      {selectedService?.data && <Paragraph size = 'text-xs font-medium'>Data Tambahan:</Paragraph>}
                      {selectedService?.data && selectedService.data.map((item, i) => (
                        <li className='font-roboto text-xs font-light' key={i}>{item}</li>
                      ))}
                    </ul>
                    <textarea onChange={handleFormChange} id='note' className="textarea w-full resize-none" placeholder="Tambahkan keterangan lainnya" rows="10"></textarea>
                    <button onClick={handleSubmitRequest} className="btn btn-neutral mt-4">Kirim</button>
                </fieldset>
            </div>
            <Footer />
        </div>
      )}
    </>
  )
}

export default ServiceFormPage
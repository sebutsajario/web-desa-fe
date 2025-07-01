import React from 'react'
import Paragraph from '../../components/Paragraph';

const ServicesListContainer = (props) => {
    const {handleToService} = props;
    const servicesList = [
        {
            name: 'Surat Keterangan Domisili', 
        },
        {
            name: 'Surat Keterangan Tidak Mampu', 
        },
        {
            name: 'Surat Perjanjian Jual Beli', 
        },
        {
            name: 'Surat Keterangan Wali', 
        },
        {
            name: 'Surat Keterangan Pernah Bekerja', 
        },
        {
            name: 'Surat Keterangan Menikah', 
        },
        {
            name: 'Surat Keterangan Kematian', 
        },
        {
            name: 'Surat Keterangan Kelahiran', 
        },
        {
            name: 'Surat Pengantar Izin Keramaian', 
        },
        {
            name: 'Surat Pengantar SKCK', 
        },
        {
            name: 'Surat Permohonan Pembuatan Kartu Keluarga', 
        },
        {
            name: 'Surat Keterangan/Pengantar Lainnya', 
        },

    ];
  return (
    <>
        <div className='flex flex-row py-5 px-16 gap-y-5 gap-x-5  items-center'>
            <div className='flex flex-col flex-1 text-pretty gap-y-2 text-justify'>
                <Paragraph size = 'text-sm md:text-base'>Melalui halaman Layanan di portal desa ini, masyarakat dapat mengajukan berbagai jenis permohonan surat dan dokumen secara lebih mudah, cepat, dan praktis. Portal ini dirancang untuk mempermudah proses administrasi, meningkatkan efisiensi pelayanan publik, serta memberikan kenyamanan bagi warga dalam mengurus keperluan mereka dari mana saja dan kapan saja.
                </Paragraph>
                <Paragraph size = 'text-sm md:text-base'>Cukup dengan mengisi formulir yang tersedia, permohonan Anda akan segera diproses oleh perangkat desa sesuai prosedur yang berlaku.</Paragraph>
                <Paragraph weight = 'font-medium' size = 'text-sm md:text-base'>Anda dapat mengakses layanan seperti berikut melalui portal ini.</Paragraph>
                {servicesList.length && (
                    servicesList.map((item, i) => (
                        <div className='flex flex-row gap-x-2 items-center'>
                            <svg className='w-4 h-4' viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#000000" fill-rule="evenodd" d="M3 10a7 7 0 019.307-6.611 1 1 0 00.658-1.889 9 9 0 105.98 7.501 1 1 0 00-1.988.22A7 7 0 113 10zm14.75-5.338a1 1 0 00-1.5-1.324l-6.435 7.28-3.183-2.593a1 1 0 00-1.264 1.55l3.929 3.2a1 1 0 001.38-.113l7.072-8z"></path> </g></svg>
                            <Paragraph size = 'text-sm md:text-base'>{item.name}</Paragraph>
                        </div>
                    ))
                )}
                <button onClick={handleToService} className="btn btn-success w-fit">Akses Layanan</button>
            </div>
            <div className='flex w-0 overflow-hidden lg:w-1/2 items-center justify-center'>
                <img className='w-1/2' src="/images/service-asset.svg" alt="" />
            </div>
        </div>
        <Paragraph otherClass = {`italic p-5 before before:mr-0.5 before:content-['*'] px-16`}>Semua jenis layanan tidak dipungut biaya apa pun.</Paragraph>
    </>
  )
}

export default ServicesListContainer
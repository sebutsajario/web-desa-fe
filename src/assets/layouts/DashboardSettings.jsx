import React from 'react'
import DashboardSection from '../components/DashboardSection/Index'
import Paragraph from '../components/Paragraph'
import Table from '../components/Table/Index'
import TableData from '../components/Table/TableData'
import { Link } from 'react-router-dom'

const DashboardSettings = () => {
  return (
    <>
        <DashboardSection width = 'w-full' height = 'h-full'>
            <Paragraph size = 'text-lg' weight = 'font-bold'>Pengaturan</Paragraph>
            <Paragraph>Pengaturan portal Desa Mappetajang</Paragraph>
            <Table>
                <tr>
                <TableData>
                    <Link to ='user'>
                        <div className='w-full flex flex-col gap-y-1'>
                        <Paragraph weight = 'font-medium'>Pengguna</Paragraph>
                        <Paragraph>Tambahkan, atur, atau hapus pengguna portal</Paragraph>
                        </div>
                    </Link>
                </TableData>
                </tr>
                <tr>
                    <TableData>
                        <Link to ='villager'>
                            <div className='w-full flex flex-col gap-y-1'>
                            <Paragraph weight = 'font-medium'>NIK Penduduk</Paragraph>
                            <Paragraph>Tambahkan, atur, atau hapus Nomor Induk Kependudukan untuk akses layanan portal</Paragraph>
                            </div>
                        </Link>
                    </TableData>
                </tr>
                <tr>
                <TableData>
                    <div className='w-full flex flex-col gap-y-1'>
                    <Paragraph weight = 'font-medium'>Lainnya</Paragraph>
                    <Paragraph>Pengaturan lainnya</Paragraph>
                    </div>
                </TableData>
                </tr>
            </Table>
        </DashboardSection>
    </>
  )
}

export default DashboardSettings
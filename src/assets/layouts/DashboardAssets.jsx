import React from 'react'
import DashboardSection from '../components/DashboardSection/Index'
import Paragraph from '../components/Paragraph'
import Table from '../components/Table/Index'
import TableData from '../components/Table/TableData'
import Pagination from '../components/Pagination/Index'
import { Link } from 'react-router-dom'

const DashboardAssets = () => {
  return (
    <>
      <DashboardSection width = 'w-full'>
          <Paragraph size = 'text-lg' weight = 'font-bold'>Aset Halaman</Paragraph>
          <Paragraph>Aset Halaman</Paragraph>
          <Table>
            <tr>
              <TableData>
                <Link to ='region'>
                  <div className='w-full flex flex-col gap-y-1'>
                    <Paragraph weight = 'font-medium'>Data Kewilayahan Desa</Paragraph>
                    <Paragraph size = 'text-xs'>Ubah data kewilayahan seperti luas dan batas wilayah yang ditampilkan di halaman portal.</Paragraph>
                  </div>
                </Link>
              </TableData>
            </tr>
            <tr>
              <TableData>
                <Link to = 'residence'>
                  <div className='w-full flex flex-col gap-y-1'>
                    <Paragraph weight = 'font-medium'>Data Tempat Tinggal dan Kependudukan Desa</Paragraph>
                    <Paragraph size = 'text-xs'>Ubah data tempat tinggal dan kependudukan yang ditampilkan di halaman portal.</Paragraph>
                  </div>
                </Link>
              </TableData>
            </tr>
            <tr>
              <TableData>
                  <Link to = 'government'>
                    <div className='w-full flex flex-col gap-y-1'>
                      <Paragraph weight = 'font-medium'>Data Pemerintah Desa</Paragraph>
                      <Paragraph size = 'text-xs'>Ubah data pemerintah beserta visi misi yang ditampilkan di halaman portal.</Paragraph>
                    </div>
                  </Link>
              </TableData>
            </tr>
            <tr>
              <TableData>
                <Link to = 'homepage'>
                  <div className='w-full flex flex-col gap-y-1'>
                    <Paragraph weight = 'font-medium'>Data Halaman Utama</Paragraph>
                    <Paragraph size = 'text-xs'>Ubah data di halaman utama Portal Desa seperti gambar Hero, sambutan kepala desa beserta gambar yang akan ditampilkan.</Paragraph>
                  </div>
                </Link>
              </TableData>
            </tr>
            <tr>
              <TableData>
                <Link to = 'mapdata'>
                  <div className='w-full flex flex-col gap-y-1'>
                    <Paragraph weight = 'font-medium'>Data Peta Desa</Paragraph>
                    <Paragraph size = 'text-xs'>Ubah data peta desa yang akan ditampilkan di halaman Portal Desa.</Paragraph>
                  </div>
                </Link>
              </TableData>
            </tr>
          </Table>
      </DashboardSection>
    </>
  )
}

export default DashboardAssets
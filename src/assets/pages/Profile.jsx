import Navbar from '../components/Navbar/Index'
import React, { useContext, useEffect, useState } from 'react'
import SectionTitle from '../components/SectionTitle/Index'
import Paragraph from '../components/Paragraph'
import Footer from '../components/Footer/Index'
import Stats from '../components/Stats/Index'
import "../../../node_modules/leaflet/dist/leaflet.css"
import { Loading } from '../../contexts/LoadingContext'
import ServiceValidator from '../fragments/ServiceValidator/Index'
import axios from 'axios'
import ChartComponent from '../components/Chart/Index'
import Pagination from '../components/Pagination/Index'

const ProfilePage = () => {
  const [regionData, setRegionData] = useState({});
  const [statsData, setStatsData] = useState({});
  const [chartData, setChartData] = useState([]);
  const [filter, setFilter] = useState({type: 1, village: "", category: ""});
  const [dataList, setDataList] = useState({});
  const [villageList, setVillageList] = useState([]);
  const [populationData, setPopulationData] = useState({});
  const [isChartDefined, setIsChartDefined] = useState(false);
  const [chartLabel, setChartLabel] = useState("");
  const [tableData, setTableData] = useState([]);
  const [selectedVillageData, setSelectedVillageData] = useState([]);
  const [selectedVillage, setSelectedVillage] = useState('');
  const [residenceToShow, setResidenceToShow] = useState('');
  const [currentTablePage, setCurrentTablePage] = useState(1);
  const [totalTablePage, setTotalTablePage] = useState(0);
  const {isPageLoading, setIsPageLoading} = useContext(Loading);
  const apiUrl = import.meta.env.VITE_API_URL;

  const convertDataCategory = (name) => {
    switch(name) {
      case 'gender' :
        return 'Jenis Kelamin';
      case 'occupation' :
        return 'Pekerjaan';
      case 'education' :
        return 'Pendidikan';
      case 'age' :
        return 'Umur';
      case 'sanitation' :
        return 'Sanitasi';
      case 'buildingCondition' :
        return 'Kondisi Bangunan';
      case 'status' :
        return 'Status Bangunan';
      case 'waterSource' :
        return 'Sumber Air Minum';
      case 'electricity' :
        return 'Kelistrikan';
      default :
        return ''
    };
  };

  useEffect(() => {
    loadAsset();
    loadResidenceStats();
    setIsPageLoading(false);
  }, []);

  const loadAsset = () => {
    axios.get(`${apiUrl}/v1/asset/get/region`)
      .then(res => {
        const data = res.data.data;
        setRegionData(data);
      })
      .catch(err => console.log(err));
  };

  const transformTableData = (data) => {
    return data.populationStatsData.map((stat) => {
      const village = stat.village;

      const genderData = stat.gender || [];
      const male = genderData.find(g => g.name === "Laki-laki")?.total || 0;
      const female = genderData.find(g => g.name === "Perempuan")?.total || 0;

      const familyCard = data.familyCardDataByVillage.find(fc => fc.village === village)?.total || 0;

      return {
        village,
        male,
        female,
        familyCard,
      };
    });
  };

  const loadResidenceStats = () => {
    axios.get(`${apiUrl}/v1/residence/getstats`)
      .then(res => {
        const data = res.data.data;
        const transformed = transformTableData(res.data.data);
        setTableData(transformed);
        const villageNames = data.populationStatsData
          .filter(item => item && item.village)
          .map(item => item.village);
        setDataList(data);
        setVillageList(villageNames);
      })
      .catch(err => console.log(err));
  };

  const handleChangeFilter = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    if(id === 'type') {
      setFilter({
        type: value,
        village: "",
        category: ""
      });
    } else {
      setFilter(prev => ({...prev, [id]: value}));
    }
  };

  const displayDetail = (village) => {
    if(!village) {
      return;
    };
    setSelectedVillage(village);
  };

  const displayDetailedResidence = (id) => {
    if(!id) {
      return;
    };
    if(id === residenceToShow) {
      setResidenceToShow('');
    } else {
      setResidenceToShow(id);
    };
  };

  const handleChangeTablePage = (p) => {
    if(p == 'prev') {
      setCurrentTablePage(currentTablePage - 1);
    } else {
      setCurrentTablePage(currentTablePage + 1);
    };
  };

  const handleCloseDetailedResidence = () => {
    setSelectedVillageData([]);
    setResidenceToShow('');
    setCurrentTablePage(1);
    setSelectedVillage('');
  };

  useEffect(() => {
    const type = Number(filter.type);
    const selectedVillage = dataList?.populationStatsData?.find(data => data.village == filter.village);
    const category = filter.category;
    const categoryList = type === 1 ? dataList.populationDataByCategory : dataList.residenceConditionDataByCategory;
    setPopulationData(categoryList);

    if(!category) {
      setIsChartDefined(false);
      setChartLabel("");
      return;
    };
    if(type === 1) {
      if(!selectedVillage) {
        setChartData(dataList.populationDataByCategory[category]);
        setChartLabel(`Data Kependudukan Desa Mappetajang berdasarkan ${convertDataCategory(category)}`);
      } else {
        const selectedData = dataList.populationStatsData.find(item => item.village === selectedVillage.village);
        setChartData(selectedData[category]);
        setChartLabel(`Data Kependudukan ${selectedVillage.village} berdasarkan ${convertDataCategory(category)}`);
      };
    } else {
      if(!selectedVillage) {
        setChartData(dataList.residenceConditionDataByCategory[category]);
        setChartLabel(`Data Bangunan/Rumah Desa Mappetajang berdasarkan ${convertDataCategory(category)}`);
      } else {
        const selectedData = dataList.residenceConditionData.find(item => item.village === selectedVillage.village);
        setChartData(selectedData[category]);
        setChartLabel(`Data Bangunan/Rumah ${selectedVillage.village} berdasarkan ${convertDataCategory(category)}`);
      };
    };
    setIsChartDefined(true);
    }, [filter, dataList]);

  useEffect(() => {
    setStatsData(
          {
            male: dataList.totalMale,
            female: dataList.totalFemale,
            undefinedGender: dataList.totalUndefinedGender,
            familyCard: dataList.totalFamilyCard,
          }
        );
  }, [dataList]);

  useEffect(() => {
    if(!selectedVillage) {
      return;
    };
    axios.get(`${apiUrl}/v1/residence/getdata?village=${selectedVillage}&page=${currentTablePage}`)
      .then(res => {
        const data = res.data;
        setSelectedVillageData(data.data);
        setTotalTablePage(data.totalPage);
        setCurrentTablePage(data.currentPage);
        setResidenceToShow('');
      })
      .catch(err => console.log(err));
  }, [currentTablePage, selectedVillage])

  return (
    <div className='relative'>
      <Navbar />
      <div className='flex w-full justify-center'>
        <ServiceValidator width = 'w-fit' />
      </div>
      <SectionTitle>WILAYAH DESA</SectionTitle>
      <div className='flex flex-col px-28 gap-y-3'>
        {regionData?.blocks && regionData?.blocks.map((item) => {
          if(item.type === 'header') {
            return (<Header size = 'text-xl'>{item.data.text}</Header>)
          } else if (item.type === 'paragraph') {
            return (<Paragraph>{item.data.text}</Paragraph>)
          } else if (item.type === 'image') {
            return (<img className='max-w-[50%] self-center' src={item.data.file.url} alt=""/>)
          } else if (item.type === 'list') {
            if (item.data.style === 'ordered') {
              const list = item.data.items;
              return (
                <ol className='list-decimal list-inside'>
                  {list.map((li, i) => (
                    <li key={i} className='font-roboto text-sm font-light py-1'>{li.content}</li>
                  ))}
                </ol>
              )
            } else {
              const list = item.data.items;
              return (
                <ul className='list-disc list-inside'>
                  {list.map((li, i) => (
                    <li key={i} className='font-roboto text-sm font-light py-1'>{li.content}</li>
                  ))}
                </ul>
              )
            }
          } else {
            return (<></>)
          }
        })}
      </div>
      <SectionTitle>DATA KEPENDUDUKAN DESA</SectionTitle>
      {chartData && statsData && (
        <>
          <div className='flex justify-center'>
            <Stats data = {statsData}/>
          </div>
          <div className='flex flex-col md:flex-row gap-y-2 px-16 py-5 gap-x-5'>
            <div className="flex flex-col gap-y-2 flex-1">
              <label htmlFor="type"><Paragraph weight = 'font-medium'>Jenis Data</Paragraph></label>
              <select value={filter.type} onChange={handleChangeFilter} id='type' defaultValue={1} className="select w-full">
                <option value="" disabled={true}>Pilih Jenis Data</option>
                <option value={1}>Data Kependudukan</option>
                <option value={2}>Data Bangunan/Rumah</option>
              </select>
              <label htmlFor="village"><Paragraph weight = 'font-medium'>Dusun</Paragraph></label>
              <select value={filter.village} onChange={handleChangeFilter} id='village' defaultValue="" className="select w-full">
                <option value="">Semua Dusun</option>
                {villageList.length && villageList.map((item, i) => (
                  <option key={i}>{item}</option>
                ))}
              </select>
              <label htmlFor="category"><Paragraph weight = 'font-medium'>Data</Paragraph></label>
              <select value={filter.category} onChange={handleChangeFilter} id='category' defaultValue="" className="select w-full">
                <option value="" disabled={true}>Pilih Kategori</option>
                {populationData && Object.keys(populationData).map((item, i) => (
                  <option key={i} value={item}>{convertDataCategory(item)}</option>
                ))}
              </select>
            </div>
            <div className='md:w-1/2'>
              {!isChartDefined ? (
                <div className='flex flex-col items-center py-5 gap-y-3'>
                  <img className='w-60' src="/images/chart.svg" alt="" />
                  <Paragraph>Diagram sedang disiapkan. Silakan pilih kategori data yang dibutuhkan terlebih dahulu.</Paragraph>
                </div>
              ) : (
                <div className='flex flex-col gap-y-2 items-center'>
                  <Paragraph weight = 'font-semibold'>{chartLabel}</Paragraph>
                  <ChartComponent filter = {filter} data = {chartData}/>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      <div className="overflow-x-auto px-16 py-5">
        <table className="table table-zebra border border-base-300 rounded-full">
          <thead className='bg-slate-800 text-white'>
            <tr className='text-center [&_th]:border [&_th]:border-white'>
              <th rowSpan={2}></th>
              <th rowSpan={2}>Nama Dusun</th>
              <th colSpan={2}>Jumlah Penduduk</th>
              <th rowSpan={2}>Jumlah KK</th>
              <th rowSpan={2}>Aksi</th>
            </tr>
            <tr className='text-center [&_th]:border [&_th]:border-white'>
              <th>Laki-laki</th>
              <th>Perempuan</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr className='text-center' key={index}>
                <td>{index + 1}</td>
                <td className='font-medium'>{row.village}</td>
                <td>{row.male}</td>
                <td>{row.female}</td>
                <td>{row.familyCard}</td>
                <td onClick={() => displayDetail(row.village)}><Paragraph size = 'text-xs' otherClass = 'underline cursor-pointer'>Detail</Paragraph></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedVillageData.length > 0 ? (
        <div onClick={handleCloseDetailedResidence} className='px-16 pb-2 flex w-full justify-end'>
          <Paragraph color = 'text-red-600' otherClass = 'underline px-3 cursor-pointer'>Tutup</Paragraph>
        </div>
      ) : <></>}
      <div className={`overflow-x-auto px-16 py-5 ${selectedVillageData.length ? 'max-h-[1000px] opacity-100' : 'max-h-[0px] opacity-0'} transition-all ease-in-out duration-300`}>
        <table className="table table-zebra border border-base-300 rounded-full">
          <thead className='bg-slate-800 text-white'>
            <tr className='text-center [&_th]:border [&_th]:border-white'>
              <th rowSpan={2}></th>
              <th rowSpan={2}>Nomor Rumah</th>
              <th rowSpan={2}>Kepala Keluarga</th>
              <th colSpan={3}>Jumlah Penduduk</th>
              <th rowSpan={2}>Jumlah KK</th>
              <th rowSpan={2}>Aksi</th>
            </tr>
            <tr className='text-center [&_th]:border [&_th]:border-white'>
              <th>Laki-laki</th>
              <th>Perempuan</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {selectedVillageData.length && selectedVillageData.map((item, index) => {
              let male = 0;
              let female = 0;
              let familyHead = item.familyCardData[0].data[0].name

              item.familyCardData.forEach(familyCard => {
                familyCard.data.forEach(person => {
                  const gender = person.gender;
                  if (gender === 'Laki-laki') {
                    male += 1;
                  } else if (gender === 'Perempuan') {
                    female += 1;
                  }
                });
              });
              return (
                <>
                  <tr className='text-center' key={index}>
                    <td>{index + 1}</td>
                    <td className='font-medium'>{item.number == 0 ? '-' : item.number}</td>
                    <td>{familyHead}</td>
                    <td>{male}</td>
                    <td>{female}</td>
                    <td>{male + female}</td>
                    <td>{item.familyCardData.length}</td>
                    <td onClick={()=> displayDetailedResidence(item._id)}><Paragraph size = 'text-xs' otherClass = 'underline cursor-pointer'>Detail</Paragraph></td>
                  </tr>
                  <tr>
                    <td colSpan={8} className='w-full bg-base-300 p-5'>
                      <div className={`${residenceToShow === item._id ? 'max-h-[1000px] opacity-100' : 'max-h-[0px] opacity-0'} transition-all ease-in-out duration-300`}>
                        {residenceToShow === item._id ? (
                          <div className='flex flex-col gap-y-2'>
                            <div className='flex flex-row gap-x-2'>
                              <Paragraph>Nomor Rumah</Paragraph>
                              <Paragraph>:</Paragraph>
                              <Paragraph>{item.number == 0 ? '-' : item.number}</Paragraph>
                            </div>
                            <div className='flex flex-row gap-x-2'>
                              <Paragraph>Kondisi Bangunan</Paragraph>
                              <Paragraph>:</Paragraph>
                              <Paragraph>{item.buildingCondition}</Paragraph>
                            </div>
                            <div className='flex flex-row gap-x-2'>
                              <Paragraph>Sumber Listrik</Paragraph>
                              <Paragraph>:</Paragraph>
                              <Paragraph>{item.electricity}</Paragraph>
                            </div>
                            <div className='flex flex-row gap-x-2'>
                              <Paragraph>Sanitasi</Paragraph>
                              <Paragraph>:</Paragraph>
                              <Paragraph>{item.sanitation}</Paragraph>
                            </div>
                            <div className='flex flex-row gap-x-2'>
                              <Paragraph>Sumber Air</Paragraph>
                              <Paragraph>:</Paragraph>
                              <Paragraph>{item.waterSource}</Paragraph>
                            </div>
                            <div className='flex flex-row gap-x-2'>
                              <Paragraph>Status Bangunan</Paragraph>
                              <Paragraph>:</Paragraph>
                              <Paragraph>{item.status}</Paragraph>
                            </div>
                            {/* <div className='flex flex-row gap-x-2'>
                              <Paragraph>Sanitasi</Paragraph>
                              <Paragraph>:</Paragraph>
                              <Paragraph>{item.number}</Paragraph>
                            </div> */}
                          </div>

                        ):<></>}
                        {residenceToShow === item._id && item.familyCardData.length && item.familyCardData.map((item, i) => {
                          const order = i + 1;
                          return (
                            <div key={i} className='py-2 gap-y-2 flex flex-col'>
                              <Paragraph weight = 'font-semibold'>Kartu Keluarga {order}</Paragraph>
                              <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                                <table className="table">
                                  <thead>
                                    <tr>
                                      <th></th>
                                      <th>Nama</th>
                                      <th>Posisi</th>
                                      <th>Jenis Kelamin</th>
                                      <th>Umur</th>
                                      <th>Pendidikan</th>
                                      <th>Pekerjaan</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {item.data.length && item.data.map((item, i) => (
                                      <tr key={i}>
                                        <th>{i+1}</th>
                                        <td>{item.name || '-'}</td>
                                        <td>{item.position || '-'}</td>
                                        <td>{item.gender || '-'}</td>
                                        <td>{item.age || '-'}</td>
                                        <td>{item.education || '-'}</td>
                                        <td>{item.occupation || '-'}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )
                          }
                        )
                        }
                      </div>
                    </td>
                  </tr>
                </>
              )
            }
            )}
          </tbody>
          <tbody>
            <tr>
              <td colSpan={8}>
                <Pagination totalPage = {totalTablePage} currentPage = {currentTablePage} onChangePage = {handleChangeTablePage} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  )
}

export default ProfilePage
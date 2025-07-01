import React, { useContext, useEffect, useState } from 'react'
import DashboardSection from '../components/DashboardSection/Index'
import Paragraph from '../components/Paragraph'
import axios from 'axios';
import { Auth } from '../../contexts/AuthContext';
import { Toast } from '../../contexts/ToastContext';
import { data, useNavigate } from 'react-router-dom';
import ColorPicker from '../components/ColorPicker/Index';

const VillageMapSetting = () => {
    const date = Date.now();
    const defaultColor = '#234d91';
    const [mapDatas, setMapDatas] = useState([{id: date, name: '', geojson: '', csv: '', color: defaultColor}]);
    const [currentGeojson, setCurrentGeojson] = useState([{id: date, geojson: ''}]);
    const [currentCsv, setCurrentCsv] = useState([{id: date, csv: ''}]);
    const {user} = useContext(Auth);
    const {showToast} = useContext(Toast);
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        axios.get(`${apiUrl}/v1/asset/get/map-data`)
            .then(res => {
                const data = res.data.data;
                if (data.length > 0) {
                    setMapDatas(data);
                    const newCsv = data.map(item => {
                        const csvDatas = {id: item.id, csv: item.csv};
                        return csvDatas;
                    });
                    setCurrentCsv(newCsv);
                    const newGeojson = data.map(item => {
                        const geojsonDatas = {id: item.id, geojson: item.geojson};
                        return geojsonDatas;
                    });
                    setCurrentGeojson(newGeojson);
                } else {
                    setMapDatas(mapDatas);
                };
            })
            .catch(err => {
                console.log(err);
            });
    }, []);


    // useEffect(() => {
    //     const index = mapDatas.findIndex(item => item.village == formData.village);
    //     if(index !== -1) {
    //         setFormData(mapDatas[index]);
    //         setCurrentCsv(mapDatas[index].csv);
    //         setCurrentGeojson(mapDatas[index].geojson);
    //     } else {
    //         setCurrentCsv("");
    //         setCurrentGeojson("");
    //         setFormData({village:formData.village});
    //     }
    // }, [formData.village])

    const handleChange = (mapId, e) => {
        const id = e.target.id;
        const value = e.target.value;
        
        if(!e.target.files) {
            setMapDatas(prev => (
                prev.map(
                    data => data.id == mapId ? {...data, [id]: value} : data,
                )
            ))
        } else {
            const file = e.target.files[0];
            setMapDatas(prev => (
                prev.map(
                    data => data.id == mapId ? {...data, [id]: file} : data,
                )
            ))
            if(id == 'csv') {
                setCurrentCsv(prev => (
                    prev.map(
                        csv => csv.id == mapId ? {...csv, id: mapId, csv: file.name} : csv,
                    )
                ));
            } else {
                setCurrentGeojson(prev => (
                    prev.map(
                        geojson => geojson.id == mapId ? {...geojson, id: mapId, geojson: file.name} : geojson,
                    )
                ));
            }
        };
    };

    const handleChangeColor = (id, color) => {
        setMapDatas(prev => (
            prev.map(map => 
                map.id == id ? {...map, color: color} : map
            )
        ))
    };

    const handleAddMapData = () => {
        const date = Date.now();
        setMapDatas(
            [
                ...mapDatas,
                {
                    id: date,
                    name: '',
                    geojson: '',
                    csv: '',
                    color: defaultColor,
                },
            ],
        );
        setCurrentCsv(
            [
                ...currentCsv,
                {
                    id: date,
                    csv: '',
                },
            ],
        );
        setCurrentGeojson(
            [
                ...currentGeojson,
                {
                    id: date,
                    geojson: '',
                },
            ],
        );
    };

    const handleDeleteMapData = (id) => {
        const filteredData = mapDatas.filter(item => item.id !== id);
        setMapDatas(filteredData);
    };


    const handleSubmit = () => {
        const data = new FormData();
        data.append('user', user.id);
        mapDatas.forEach((map, index) => {
            data.append(`map[${index}][id]`, map.id);
            data.append(`map[${index}][name]`, map.name);
            data.append(`map[${index}][csv]`, map.csv);
            data.append(`map[${index}][geojson]`, map.geojson);
            data.append(`map[${index}][color]`, map.color);
        });


        // data.append('village', mapDatas.village);
        // data.append('geojson', mapDatas.geojson);
        // data.append('csv', mapDatas.csv);

        axios.put(`${apiUrl}/v1/asset/edit/map-data`, data, {withCredentials: true})
            .then(res => {
                console.log(res);
                showToast(res.data.message, 'success');
                navigate(-1);
            })
            .catch(err => {
                console.log(err);
                showToast('Gagal memperbarui data peta', 'failed');
            });
    };

  return (
    <DashboardSection width = 'w-full'>
        <Paragraph size = 'text-lg' weight = 'font-bold'>Pengaturan Data Peta Desa</Paragraph>
        <Paragraph>Pengaturan data peta desa</Paragraph>
        <div role="alert" className="alert alert-error alert-soft">
            <div className='flex flex-col items-start gap-y-1'>
                <Paragraph color = 'text-error' weight = 'font-medium'>Peringatan!</Paragraph>
                <Paragraph color = 'text-error'>Sebelum mengganti data peta Portal Desa Mappetajang, harap untuk memperhatikan hal-hal berikut ini:</Paragraph>
                <Paragraph color = 'text-error'>1. File yang dapat disupport adalah file dengan format <b>.geojson</b> dan <b>.csv</b></Paragraph>
                <Paragraph color = 'text-error'>2. File dengan format <b>.geojson</b> dan <b>.csv</b> adalah file yang diekstrak dari file geodatabase</Paragraph>
                <Paragraph color = 'text-error'>3. Silakan mengacu pada panduan yang disediakan mengenai ketentuan file peta yang akan diunggah ke Portal Desa Mappetajang</Paragraph>
                <Paragraph color = 'text-error'>4. File terunggah yang tidak sesuai format dan ketentuan dapat menimbulkan <i>error</i> pada aplikasi</Paragraph>
                <Paragraph color = 'text-error'>5. Pastikan file yang diunggah sesuai dengan ketentuan</Paragraph>
            </div>
        </div>
        {mapDatas.length && mapDatas.map((item, i) => (
        <div key={i} className='flex flex-col gap-y-3'>
            <div className='flex flex-row justify-between'>
                <label htmlFor='name'><Paragraph weight = 'font-medium'>Nama Data/Peta</Paragraph></label>
                <div onClick={() => handleDeleteMapData(item.id)} className={`cursor-pointer ${i == 0 ? 'hidden' : ''}`}>
                    <Paragraph size = 'text-xs' color= 'text-red-600' otherClass = 'underline'>Hapus</Paragraph>
                </div>
            </div>
            <div className='flex flex-col md:flex-row gap-y-2 gap-x-2 items-center'>
                <input value={item.name} onChange={(e)=>handleChange(item.id, e)} id='name' type="text" placeholder="Nama Data/Peta" className="input w-full md:w-1/2" />
                <div className="dropdown flex">
                    <div tabIndex={0} role="button" className="btn m-1">Warna Layer</div>
                    <div
                        tabIndex={0}
                        className="dropdown-content card card-sm bg-base-100 z-1 w-64 shadow-md">
                        <div className="card-body flex items-center">
                        <Paragraph weight = 'font-medium'>Pilih warna layer untuk ditampilkan</Paragraph>
                        <ColorPicker id = {item.id} onChangeColor = {handleChangeColor} selectedColor = {item.color} />
                        </div>
                    </div>
                </div>
                <div style={{backgroundColor: item?.color}} className={`h-6 w-6 rounded-full`}></div>
                <input value={item.color} onChange={(e)=>handleChangeColor(item.id, e.target.value)} id='color' type="text" className={`input w-1/2 md:w-1/5 ${item.color.length > 7 ? 'input-error' : ''}`} />
            </div>
            <div className='flex flex-col gap-y-2 md:flex-row gap-x-3 w-full justify-evenly items-center md:items-start'>
                <div className='flex flex-row gap-x-3 bg-slate-300 w-fit p-3 items-center rounded-md'>
                    {currentCsv[item.id]?.csv ? (
                        <svg className='w-0 sm:w-20' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.3929 4.05365L14.8912 4.61112L15.3929 4.05365ZM19.3517 7.61654L18.85 8.17402L19.3517 7.61654ZM21.654 10.1541L20.9689 10.4592V10.4592L21.654 10.1541ZM3.17157 20.8284L3.7019 20.2981H3.7019L3.17157 20.8284ZM20.8284 20.8284L20.2981 20.2981L20.2981 20.2981L20.8284 20.8284ZM14 21.25H10V22.75H14V21.25ZM2.75 14V10H1.25V14H2.75ZM21.25 13.5629V14H22.75V13.5629H21.25ZM14.8912 4.61112L18.85 8.17402L19.8534 7.05907L15.8947 3.49618L14.8912 4.61112ZM22.75 13.5629C22.75 11.8745 22.7651 10.8055 22.3391 9.84897L20.9689 10.4592C21.2349 11.0565 21.25 11.742 21.25 13.5629H22.75ZM18.85 8.17402C20.2034 9.3921 20.7029 9.86199 20.9689 10.4592L22.3391 9.84897C21.9131 8.89241 21.1084 8.18853 19.8534 7.05907L18.85 8.17402ZM10.0298 2.75C11.6116 2.75 12.2085 2.76158 12.7405 2.96573L13.2779 1.5653C12.4261 1.23842 11.498 1.25 10.0298 1.25V2.75ZM15.8947 3.49618C14.8087 2.51878 14.1297 1.89214 13.2779 1.5653L12.7405 2.96573C13.2727 3.16993 13.7215 3.55836 14.8912 4.61112L15.8947 3.49618ZM10 21.25C8.09318 21.25 6.73851 21.2484 5.71085 21.1102C4.70476 20.975 4.12511 20.7213 3.7019 20.2981L2.64124 21.3588C3.38961 22.1071 4.33855 22.4392 5.51098 22.5969C6.66182 22.7516 8.13558 22.75 10 22.75V21.25ZM1.25 14C1.25 15.8644 1.24841 17.3382 1.40313 18.489C1.56076 19.6614 1.89288 20.6104 2.64124 21.3588L3.7019 20.2981C3.27869 19.8749 3.02502 19.2952 2.88976 18.2892C2.75159 17.2615 2.75 15.9068 2.75 14H1.25ZM14 22.75C15.8644 22.75 17.3382 22.7516 18.489 22.5969C19.6614 22.4392 20.6104 22.1071 21.3588 21.3588L20.2981 20.2981C19.8749 20.7213 19.2952 20.975 18.2892 21.1102C17.2615 21.2484 15.9068 21.25 14 21.25V22.75ZM21.25 14C21.25 15.9068 21.2484 17.2615 21.1102 18.2892C20.975 19.2952 20.7213 19.8749 20.2981 20.2981L21.3588 21.3588C22.1071 20.6104 22.4392 19.6614 22.5969 18.489C22.7516 17.3382 22.75 15.8644 22.75 14H21.25ZM2.75 10C2.75 8.09318 2.75159 6.73851 2.88976 5.71085C3.02502 4.70476 3.27869 4.12511 3.7019 3.7019L2.64124 2.64124C1.89288 3.38961 1.56076 4.33855 1.40313 5.51098C1.24841 6.66182 1.25 8.13558 1.25 10H2.75ZM10.0298 1.25C8.15538 1.25 6.67442 1.24842 5.51887 1.40307C4.34232 1.56054 3.39019 1.8923 2.64124 2.64124L3.7019 3.7019C4.12453 3.27928 4.70596 3.02525 5.71785 2.88982C6.75075 2.75158 8.11311 2.75 10.0298 2.75V1.25Z" fill="#000000"></path> <path d="M13 2.5V5C13 7.35702 13 8.53553 13.7322 9.26777C14.4645 10 15.643 10 18 10H22" stroke="#000000" stroke-width="1.5"></path> <path d="M6 16.5L7.33333 18L10 15" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                    ) : (
                        <svg className='w-0 sm:w-20' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.5535 2.49392C12.4114 2.33852 12.2106 2.25 12 2.25C11.7894 2.25 11.5886 2.33852 11.4465 2.49392L7.44648 6.86892C7.16698 7.17462 7.18822 7.64902 7.49392 7.92852C7.79963 8.20802 8.27402 8.18678 8.55352 7.88108L11.25 4.9318V16C11.25 16.4142 11.5858 16.75 12 16.75C12.4142 16.75 12.75 16.4142 12.75 16V4.9318L15.4465 7.88108C15.726 8.18678 16.2004 8.20802 16.5061 7.92852C16.8118 7.64902 16.833 7.17462 16.5535 6.86892L12.5535 2.49392Z" fill="#000000"></path> <path d="M3.75 15C3.75 14.5858 3.41422 14.25 3 14.25C2.58579 14.25 2.25 14.5858 2.25 15V15.0549C2.24998 16.4225 2.24996 17.5248 2.36652 18.3918C2.48754 19.2919 2.74643 20.0497 3.34835 20.6516C3.95027 21.2536 4.70814 21.5125 5.60825 21.6335C6.47522 21.75 7.57754 21.75 8.94513 21.75H15.0549C16.4225 21.75 17.5248 21.75 18.3918 21.6335C19.2919 21.5125 20.0497 21.2536 20.6517 20.6516C21.2536 20.0497 21.5125 19.2919 21.6335 18.3918C21.75 17.5248 21.75 16.4225 21.75 15.0549V15C21.75 14.5858 21.4142 14.25 21 14.25C20.5858 14.25 20.25 14.5858 20.25 15C20.25 16.4354 20.2484 17.4365 20.1469 18.1919C20.0482 18.9257 19.8678 19.3142 19.591 19.591C19.3142 19.8678 18.9257 20.0482 18.1919 20.1469C17.4365 20.2484 16.4354 20.25 15 20.25H9C7.56459 20.25 6.56347 20.2484 5.80812 20.1469C5.07435 20.0482 4.68577 19.8678 4.40901 19.591C4.13225 19.3142 3.9518 18.9257 3.85315 18.1919C3.75159 17.4365 3.75 16.4354 3.75 15Z" fill="#000000"></path> </g></svg>

                    )}
                    <div className='flex flex-col gap-y-2 w-40'>
                        <Paragraph weight = 'font-semibold'>File csv attachment (.csv)</Paragraph>
                        {(()=> {
                            const match = currentCsv.find(csv => csv.id == item.id);
                            return match?.csv ? (
                                <Paragraph size = 'text-xs' weight = 'font-thin' otherClass = 'line-clamp-1'>{match.csv}</Paragraph> 
                                
                            )
                            : <></>
                        }) ()
                        }
                        <div className='flex relative px-3 py-1 w-fit btn'>
                            <Paragraph weight = 'font-semibold'>Unggah File</Paragraph>
                            <input id='csv' onChange={(e)=>handleChange(item.id, e)} className='absolute w-full h-full opacity-0 cursor-pointer' type="file" />
                        </div>
                    </div>
                </div>
                <div className='flex flex-row gap-x-3 bg-slate-300 w-fit p-3 items-center rounded-md'>
                    {currentGeojson[item.id]?.geojson ? (
                        <svg className='w-0 sm:w-20' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.3929 4.05365L14.8912 4.61112L15.3929 4.05365ZM19.3517 7.61654L18.85 8.17402L19.3517 7.61654ZM21.654 10.1541L20.9689 10.4592V10.4592L21.654 10.1541ZM3.17157 20.8284L3.7019 20.2981H3.7019L3.17157 20.8284ZM20.8284 20.8284L20.2981 20.2981L20.2981 20.2981L20.8284 20.8284ZM14 21.25H10V22.75H14V21.25ZM2.75 14V10H1.25V14H2.75ZM21.25 13.5629V14H22.75V13.5629H21.25ZM14.8912 4.61112L18.85 8.17402L19.8534 7.05907L15.8947 3.49618L14.8912 4.61112ZM22.75 13.5629C22.75 11.8745 22.7651 10.8055 22.3391 9.84897L20.9689 10.4592C21.2349 11.0565 21.25 11.742 21.25 13.5629H22.75ZM18.85 8.17402C20.2034 9.3921 20.7029 9.86199 20.9689 10.4592L22.3391 9.84897C21.9131 8.89241 21.1084 8.18853 19.8534 7.05907L18.85 8.17402ZM10.0298 2.75C11.6116 2.75 12.2085 2.76158 12.7405 2.96573L13.2779 1.5653C12.4261 1.23842 11.498 1.25 10.0298 1.25V2.75ZM15.8947 3.49618C14.8087 2.51878 14.1297 1.89214 13.2779 1.5653L12.7405 2.96573C13.2727 3.16993 13.7215 3.55836 14.8912 4.61112L15.8947 3.49618ZM10 21.25C8.09318 21.25 6.73851 21.2484 5.71085 21.1102C4.70476 20.975 4.12511 20.7213 3.7019 20.2981L2.64124 21.3588C3.38961 22.1071 4.33855 22.4392 5.51098 22.5969C6.66182 22.7516 8.13558 22.75 10 22.75V21.25ZM1.25 14C1.25 15.8644 1.24841 17.3382 1.40313 18.489C1.56076 19.6614 1.89288 20.6104 2.64124 21.3588L3.7019 20.2981C3.27869 19.8749 3.02502 19.2952 2.88976 18.2892C2.75159 17.2615 2.75 15.9068 2.75 14H1.25ZM14 22.75C15.8644 22.75 17.3382 22.7516 18.489 22.5969C19.6614 22.4392 20.6104 22.1071 21.3588 21.3588L20.2981 20.2981C19.8749 20.7213 19.2952 20.975 18.2892 21.1102C17.2615 21.2484 15.9068 21.25 14 21.25V22.75ZM21.25 14C21.25 15.9068 21.2484 17.2615 21.1102 18.2892C20.975 19.2952 20.7213 19.8749 20.2981 20.2981L21.3588 21.3588C22.1071 20.6104 22.4392 19.6614 22.5969 18.489C22.7516 17.3382 22.75 15.8644 22.75 14H21.25ZM2.75 10C2.75 8.09318 2.75159 6.73851 2.88976 5.71085C3.02502 4.70476 3.27869 4.12511 3.7019 3.7019L2.64124 2.64124C1.89288 3.38961 1.56076 4.33855 1.40313 5.51098C1.24841 6.66182 1.25 8.13558 1.25 10H2.75ZM10.0298 1.25C8.15538 1.25 6.67442 1.24842 5.51887 1.40307C4.34232 1.56054 3.39019 1.8923 2.64124 2.64124L3.7019 3.7019C4.12453 3.27928 4.70596 3.02525 5.71785 2.88982C6.75075 2.75158 8.11311 2.75 10.0298 2.75V1.25Z" fill="#000000"></path> <path d="M13 2.5V5C13 7.35702 13 8.53553 13.7322 9.26777C14.4645 10 15.643 10 18 10H22" stroke="#000000" stroke-width="1.5"></path> <path d="M6 16.5L7.33333 18L10 15" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                    ) : (
                        <svg className='w-0 sm:w-20' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.5535 2.49392C12.4114 2.33852 12.2106 2.25 12 2.25C11.7894 2.25 11.5886 2.33852 11.4465 2.49392L7.44648 6.86892C7.16698 7.17462 7.18822 7.64902 7.49392 7.92852C7.79963 8.20802 8.27402 8.18678 8.55352 7.88108L11.25 4.9318V16C11.25 16.4142 11.5858 16.75 12 16.75C12.4142 16.75 12.75 16.4142 12.75 16V4.9318L15.4465 7.88108C15.726 8.18678 16.2004 8.20802 16.5061 7.92852C16.8118 7.64902 16.833 7.17462 16.5535 6.86892L12.5535 2.49392Z" fill="#000000"></path> <path d="M3.75 15C3.75 14.5858 3.41422 14.25 3 14.25C2.58579 14.25 2.25 14.5858 2.25 15V15.0549C2.24998 16.4225 2.24996 17.5248 2.36652 18.3918C2.48754 19.2919 2.74643 20.0497 3.34835 20.6516C3.95027 21.2536 4.70814 21.5125 5.60825 21.6335C6.47522 21.75 7.57754 21.75 8.94513 21.75H15.0549C16.4225 21.75 17.5248 21.75 18.3918 21.6335C19.2919 21.5125 20.0497 21.2536 20.6517 20.6516C21.2536 20.0497 21.5125 19.2919 21.6335 18.3918C21.75 17.5248 21.75 16.4225 21.75 15.0549V15C21.75 14.5858 21.4142 14.25 21 14.25C20.5858 14.25 20.25 14.5858 20.25 15C20.25 16.4354 20.2484 17.4365 20.1469 18.1919C20.0482 18.9257 19.8678 19.3142 19.591 19.591C19.3142 19.8678 18.9257 20.0482 18.1919 20.1469C17.4365 20.2484 16.4354 20.25 15 20.25H9C7.56459 20.25 6.56347 20.2484 5.80812 20.1469C5.07435 20.0482 4.68577 19.8678 4.40901 19.591C4.13225 19.3142 3.9518 18.9257 3.85315 18.1919C3.75159 17.4365 3.75 16.4354 3.75 15Z" fill="#000000"></path> </g></svg>

                    )}
                    <div className='flex flex-col gap-y-2 w-40'>
                        <Paragraph weight = 'font-semibold'>File geojson (.geojson)</Paragraph>
                        {(()=> {
                            const match = currentGeojson.find(geojson => geojson.id == item.id);
                            return match?.geojson ? (
                                <Paragraph size = 'text-xs' weight = 'font-thin' otherClass = 'line-clamp-1'>{match.geojson}</Paragraph> 
                                
                            )
                            : <></>
                        }) ()
                        }
                        <div className='flex relative px-3 py-1 w-fit btn'>
                            <Paragraph weight = 'font-semibold'>Unggah File</Paragraph>
                            <input id='geojson' onChange={(e)=>handleChange(item.id, e)} className='absolute w-full h-full opacity-0 cursor-pointer' type="file" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        ))}
        <button onClick={handleAddMapData} className="btn btn-outline mt-4">Tambah Data</button>
        <button onClick={handleSubmit} className="btn btn-neutral">Simpan</button>
    </DashboardSection>
  )
}

export default VillageMapSetting
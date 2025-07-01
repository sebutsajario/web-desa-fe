import React, { useContext, useEffect, useState } from 'react'
import Paragraph from '../components/Paragraph'
import DashboardSection from '../components/DashboardSection/Index'
import EditorComponent from '../components/EditorComponent/Index'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { Auth } from '../../contexts/AuthContext'
import { Toast } from '../../contexts/ToastContext'

const AddNews = () => {
  const [formData, setFormData] = useState({});
  const [currentImage, setCurrentImage] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const {user} = useContext(Auth);
  const {showToast} = useContext(Toast);
  const params = useParams();
  const postId = params.postId;
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if(!postId) {
      setIsLoading(false);
      return;
    };
    setIsEdit(true);
    axios.get(`${apiUrl}/v1/post/post/${postId}`)
      .then(res => {
        const data = res.data.data;
        setFormData(data);
        setCurrentImage({name: data.image, url: `${apiUrl}/${data.image}`})
      })
      .catch(err => console.log(err))
      .finally(() => {
        setIsLoading(false);
      })
  }, []);

  const handleChange = (e) => {
    const id = e.target.id;
    const val = e.target.value;
    const file = e.target.files ? e.target.files[0] : null;
    setFormData(prevData => {
      if(!file) {
        return {...prevData, [id]: val}
      } else {
        const imageUrl = URL.createObjectURL(file);
        setCurrentImage({name: file.name, url: imageUrl});
        return {...prevData, [id]: file}
      }
    })
  }


  const handleSubmit = (e) => {
    e.preventDefault();
    const title = formData.title;
    const desc = formData.desc;
    const category = formData.category;
    const image = formData.image;

    const form = new FormData();
    form.append('title', title);
    form.append('desc', JSON.stringify(desc));
    form.append('category', category);
    form.append('image', image);
    form.append('author', user.name);

    if(!isEdit) {
      axios.post(`${apiUrl}/v1/post/create`, form, {withCredentials: true})
        .then(res => {
          console.log(res);
          const message = res.data.message;
          const status = 'success';
          showToast(message, status);
          navigate('/dashboard/news');
        })
        .catch(err => {
          console.log(err);
          showToast('Gagal membuat post', 'failed');
        })
    } else {
      axios.put(`${apiUrl}/v1/post/post/${postId}`, form, {withCredentials: true})
        .then(res => {
          console.log(res);
          const message = res.data.message;
          const status = 'success';
          showToast(message, status);
          navigate('/dashboard/news');
        })
        .catch(err => {
          console.log(err);
          showToast('Gagal membuat post', 'failed');
        })
    }
  }
  return (
    <>
      {
        !isLoading ? (
        <DashboardSection width = 'w-full' height = 'h-full'>
            <Paragraph size = 'text-lg' weight = 'font-bold'>Tambahkan Berita/Pengumuman</Paragraph>
            <div className='flex flex-col md:flex-row w-full gap-x-3'>
              <form onSubmit={handleSubmit} className='flex flex-col md:flex-row gap-x-0 md:gap-x-5 gap-y-2 md:gap-y-0 w-full h-full' action="">
                  <div className='flex flex-col gap-y-2 md:w-1/2'>
                    <label htmlFor="title"><Paragraph weight = 'font-medium'>Judul</Paragraph></label>
                    <input value={formData.title} onChange={handleChange} id='title' type="text" placeholder="Judul Berita/Pengumuman" className="input w-full" />
                    <label htmlFor="category"><Paragraph weight = 'font-medium'>Kategori</Paragraph></label>
                    <select onChange={handleChange} id='category' value={formData.category || ""} className="select w-full">
                      <option value="" disabled={true}>Pilih Kategori</option>
                      <option>Berita</option>
                      <option>Pengumuman</option>
                    </select>
                    <label htmlFor="image"><Paragraph weight = 'font-medium'>Thumbnail</Paragraph></label>
                    <div className="w-full relative group flex flex-col gap-y-2">
                        <div className={`w-full aspect-video group-hover:bg-slate-600/50 transition-all ease-in-out duration-300 gap-y-1 md:gap-y-2 bg-slate-600/30  rounded-lg flex flex-col justify-center items-center border-[0.5px] border-default/50 p-3 text-center`}>
                          <input onChange={handleChange} id='image' className="opacity-0 absolute aspect-video w-full h-fit z-10 cursor-pointer" type="file" accept="image/*" />
                            {formData.image ? (
                              <>
                              <img className='h-3/5' src={currentImage.url} alt="" />
                              <Paragraph weight = 'font-light' size = 'text-xs sm:text-base'>{currentImage.name}</Paragraph>
                            </>
                            ) : (
                            <>
                              <span className="rounded-full">
                                <svg className='w-10' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.5535 2.49392C12.4114 2.33852 12.2106 2.25 12 2.25C11.7894 2.25 11.5886 2.33852 11.4465 2.49392L7.44648 6.86892C7.16698 7.17462 7.18822 7.64902 7.49392 7.92852C7.79963 8.20802 8.27402 8.18678 8.55352 7.88108L11.25 4.9318V16C11.25 16.4142 11.5858 16.75 12 16.75C12.4142 16.75 12.75 16.4142 12.75 16V4.9318L15.4465 7.88108C15.726 8.18678 16.2004 8.20802 16.5061 7.92852C16.8118 7.64902 16.833 7.17462 16.5535 6.86892L12.5535 2.49392Z" fill="#1C274C"></path> <path d="M3.75 15C3.75 14.5858 3.41422 14.25 3 14.25C2.58579 14.25 2.25 14.5858 2.25 15V15.0549C2.24998 16.4225 2.24996 17.5248 2.36652 18.3918C2.48754 19.2919 2.74643 20.0497 3.34835 20.6516C3.95027 21.2536 4.70814 21.5125 5.60825 21.6335C6.47522 21.75 7.57754 21.75 8.94513 21.75H15.0549C16.4225 21.75 17.5248 21.75 18.3918 21.6335C19.2919 21.5125 20.0497 21.2536 20.6517 20.6516C21.2536 20.0497 21.5125 19.2919 21.6335 18.3918C21.75 17.5248 21.75 16.4225 21.75 15.0549V15C21.75 14.5858 21.4142 14.25 21 14.25C20.5858 14.25 20.25 14.5858 20.25 15C20.25 16.4354 20.2484 17.4365 20.1469 18.1919C20.0482 18.9257 19.8678 19.3142 19.591 19.591C19.3142 19.8678 18.9257 20.0482 18.1919 20.1469C17.4365 20.2484 16.4354 20.25 15 20.25H9C7.56459 20.25 6.56347 20.2484 5.80812 20.1469C5.07435 20.0482 4.68577 19.8678 4.40901 19.591C4.13225 19.3142 3.9518 18.9257 3.85315 18.1919C3.75159 17.4365 3.75 16.4354 3.75 15Z" fill="#1C274C"></path> </g></svg>
                              </span>
                              <Paragraph weight = 'font-bold' size = 'text-sm sm:text-lg'>Unggah Gambar</Paragraph>
                              <Paragraph weight = 'font-light' size = 'text-xs sm:text-base'>Masukkan file gambar di sini</Paragraph>
                            </>
                            
                          )}
                        </div>
                    </div>
                  </div>
                  <div className='flex flex-col gap-y-2 w-full h-full'>
                    <label htmlFor="desc"><Paragraph weight = 'font-medium'>Deskripsi</Paragraph></label>
                    <EditorComponent id='desc' setFormData={setFormData} value = {formData.desc} />
                    <button type='submit' className="btn btn-primary w-fit self-end">Post</button>
                  </div>
              </form>
            </div>
        </DashboardSection>
        ) : <></>
      }
    </>
  )
}

export default AddNews
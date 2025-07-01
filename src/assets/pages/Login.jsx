import React, { useContext, useEffect, useState } from 'react'
import Paragraph from '../components/Paragraph'
import { Auth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoadingLayout from '../layouts/LoadingLayout';
import { Loading } from '../../contexts/LoadingContext';

const LoginPage = () => {

    const [formData, setFormData] = useState([]);
    const {login, getUser, user, setErrorMessage, errorMessage, isLoading} = useContext(Auth);
    const {isPageLoading, setIsPageLoading} = useContext(Loading);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const id = e.target.id;
        const value = e.target.value;

        setFormData(prevData => ({...prevData, [id]: value}));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const user = formData.userName;
        const password = formData.password;
        if(!user && !password) {
            setErrorMessage('Masukkan User ID dan Password terlebih dahulu');
            setTimeout(() => setErrorMessage(''), 5000)
        } else if (!user) {
            setErrorMessage('Masukkan User ID terlebih dahulu');
            setTimeout(() => setErrorMessage(''), 5000)
        } else if (!password) {
            setErrorMessage('Masukkan Password terlebih dahulu');
            setTimeout(() => setErrorMessage(''), 5000)
        };

        const loginSuccess = await login(user, password);

        if(!loginSuccess) {
            return;
        };
        navigate('/dashboard');
    };

    useEffect(() => {
        const fetchUser = async () => {
            const isLoggedIn = await getUser();
            if(isLoggedIn) {
                navigate('/dashboard');
            }
            setIsPageLoading(false);
        }
        fetchUser();
    }, []);

  return (
    <>
     {
        !isPageLoading ? (
            <div className='w-screen h-screen flex flex-row items-center justify-center bg-gradient-to-b from-blue-900 to-blue-200'>
                <div className='w-1/2 h-full flex justify-center items-center scale-x-[-1]'>
                    <img className='h-[70%]' src="./images/login-page.svg" alt="" />
                </div>
                <div className='w-1/2 h-full flex flex-col justify-center items-center gap-y-5'>
                    <Paragraph size ='text-3xl' weight = 'font-semibold' otherClass = 'text-white/70 text-center'>Login Portal <br/> Desa Mappetajang</Paragraph>
                    <form onSubmit={(e) =>handleLogin(e)} className="fieldset w-1/2 h-1/2 flex flex-col justify-evenly bg-base-200 border-base-300 rounded-box w-xs border p-4 gap-y-2 relative">
                        <div className={`w-full h-full bg-white absolute top-0 left-0 rounded-box transition-opacity ease-in-out duration-150 ${isLoading ? 'z-10 opacity-60' : '-z-10 opacity-0'}`}>
                            <div className='w-full h-full flex justify-center items-center'>
                                <span className='loading loading-spinner text-blue-400'></span>
                            </div>
                        </div>

                        <div className='flex flex-col gap-y-2'>
                            <label className="label" htmlFor='userName'>User ID</label>
                            <input onChange={handleChange} id='userName' type="text" className="input" placeholder="User ID" />
                        </div>
                        <div className='flex flex-col gap-y-2'>
                            <label className="label" htmlFor='password'>Password</label>
                            <input onChange={handleChange} id='password' type="password" className="input" placeholder="Password" />
                        </div>
                        <button type='submit' className="btn btn-neutral mt-4">Login</button>
                        <Paragraph color = 'text-red-500' otherClass = {`text-center w-full transition-all ease-in-out-duration-300 ${errorMessage ? 'max-h-[1000px] opacity-100' : 'max-h-[0px] opacity-0'}`}>{errorMessage || ''}</Paragraph>
                    </form>
                </div>
            </div>
        ) : (
            <LoadingLayout />
        )
     }
    </>
  )
}

export default LoginPage
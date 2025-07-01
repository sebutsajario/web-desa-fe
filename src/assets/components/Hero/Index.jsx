import React, { useEffect } from 'react'
import { Observer } from 'tailwindcss-intersect';

const Hero = (props) => {
    const {url} = props;
    useEffect(() => {
        Observer.start();
    }, []);
  return (
    <div
        className="hero min-h-screen bg-cover bg-center"
        style={{
            backgroundImage:
            `url('${url}')`,
        }}
        >
        <div className="hero-overlay"></div>
        <div className="hero-content text-neutral-content text-center">
            <div className="max-w-lg flex flex-col gap-y-2">
                <h1 className="text-3xl md:text-4xl font-medium font-roboto intersect:motion-preset-slide-down-lg">Website Resmi</h1>
                <p className="text-4xl md:text-5xl font-archivo w-full intersect:motion-preset-slide-up-lg">
                    Desa Mappetajang
                </p>
            </div>
        </div>
    </div>
  )
}

export default Hero
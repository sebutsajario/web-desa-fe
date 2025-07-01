import React, { useEffect, useRef, useState } from 'react';
import { useCountUp } from '../../utilities/useCountUp';

const Stats = (props) => {
  const {data, isSmall = true} = props;
  const [start, setStart] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStart(true);
          observer.unobserve(entry.target); // only trigger once
        }
      },
      {
        threshold: 0.2,
      }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);
  
  // Provide default fallback values if data is missing
  const totalCount = data?.male + data?.female + data?.undefinedGender || 0;
  const maleCount = data?.male || 0;
  const femaleCount = data?.female || 0;
  const familyCardCount = data?.familyCard || 0;

  // Always call hooks unconditionally
  const total = useCountUp(start ? totalCount : 0);
  const male = useCountUp(start ? maleCount : 0);
  const female = useCountUp(start ? femaleCount : 0);
  const familyCard = useCountUp(start ? familyCardCount : 0);

  return (
    <>
      {data && (
        <div ref={ref} className={`flex py-5 intersect:motion-preset-focus intersect-once ${!isSmall ? 'h-fit md:h-60 justify-center' : ''}`}>
          <div className={`stats shadow bg-gradient-to-b text-white ${!isSmall ? 'from-slate-600 via-slate-400 to-slate-600 ring-1 ring-slate-600 shadow-md' : 'from-gray-950 to-gray-900'}`}>
            <div className="stat">
              <div className={`text-white stat-title ${!isSmall ? 'text-sm md:text-2xl' : ''}`}>Jumlah Penduduk</div>
              <div className={`text-white stat-value text-center ${!isSmall ? 'sm:text-md md:text-6xl' : ''}`}>{total.toLocaleString()}</div>
            </div>

            <div className="stat">
              <div className={`text-white stat-title ${!isSmall ? 'text-sm md:text-2xl' : ''}`}>Laki-laki</div>
              <div className={`text-white stat-value text-center ${!isSmall ? 'sm:text-md md:text-6xl' : ''}`}>{male.toLocaleString()}</div>
            </div>

            <div className="stat">
              <div className={`text-white stat-title ${!isSmall ? 'text-sm md:text-2xl' : ''}`}>Perempuan</div>
              <div className={`text-white stat-value text-center ${!isSmall ? 'sm:text-md md:text-6xl' : ''}`}>{female.toLocaleString()}</div>
            </div>

            <div className="stat">
              <div className={`text-white stat-title ${!isSmall ? 'text-sm md:text-2xl' : ''}`}>Jumlah KK</div>
              <div className={`text-white stat-value text-center ${!isSmall ? 'sm:text-md md:text-6xl' : ''}`}>{familyCard.toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Stats;

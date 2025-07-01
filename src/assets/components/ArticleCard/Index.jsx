import React from 'react'
import Paragraph from '../Paragraph';
import Header from '../Header';
import { Link } from 'react-router-dom';
import { dateConvert } from '../../utilities/dateConvert';

const ArticleCard = (props) => {
    const {isLast, article, horizontal = false, fromNewsPage = false, isOtherArticle = false} = props;
    const articleDate = dateConvert(article.updatedAt);
    const apiUrl = import.meta.env.VITE_API_URL;
    const otherArticle = {
        image: 'w-24 h-24',
        header: 'text-base',
    };
  return (
    <>
        <Link style={{display: 'contents'}} to={!fromNewsPage ? `/news/${article._id}`: `${article._id}`}>
            <div className={`flex flex-row ${!horizontal ? 'md:flex-col md:w-1/4' : ''} md:gap-y-3 gap-x-8 ${!fromNewsPage ? 'py-2' : 'hover:bg-slate-200 px-16 py-7'} transition-all ease-in-out duration-300`}>
                <img className={`w-32 h-32 ${isOtherArticle? otherArticle.image : !horizontal ? 'md:w-48' : 'md:w-48'} object-cover`} src={`${apiUrl}/${article.image}`} alt="" />
                <div className={`flex flex-col ${!horizontal ? 'gap-y-2' : 'md:gap-y-3'}`}>
                    <Header size = {`${isOtherArticle ? otherArticle.header : !horizontal ? 'text-base' : 'text-base md:text-2xl'}`}>{article.title}</Header>
                    <div className={`px-2 py-1 w-fit ${article.category.toLowerCase() == 'pengumuman' ? 'bg-slate-400' : 'bg-blue-400'} rounded-md`}>
                        <Paragraph size='text-sm' clamp = {true}>{article.category}</Paragraph>
                    </div>
                    <Paragraph size = 'text-xs'>{articleDate}</Paragraph>
                </div>
            </div>
        </Link>
        {!isLast ? (
            <div className={`divider ${!horizontal ? 'md:divider-horizontal' : ''} ${!fromNewsPage ? '' : 'my-0 h-0'}`}></div>
        ) : <></>}
    </>
  )
}

export default ArticleCard
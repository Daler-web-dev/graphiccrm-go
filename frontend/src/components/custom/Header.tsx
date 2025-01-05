import React from 'react';
import { cn } from '@/lib/utils';
import { BreadCrumb } from './BreadCrumb';
import { useLocation } from 'react-router-dom';

interface Props {
    className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
    const { pathname } = useLocation()
    return (
        <div className={cn("flex justify-start flex-col items-start gap-1 my-5", className)}>
            <h2 className='text-3xl font-semibold text-cBlack'>Здравствуйте, Sharif Aka</h2>
            <div className='flex justify-start items-center gap-5'>
                <BreadCrumb path={pathname} />
            </div>
        </div>
    );
};

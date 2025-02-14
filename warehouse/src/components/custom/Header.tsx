import React from 'react';
import { cn, parseJwt } from '@/lib/utils';
import { Card } from '../ui/card';
import { BreadCrumb } from './BreadCrumb';
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

interface Props {
    className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
    const { pathname } = useLocation()
    const { username } = parseJwt(Cookies.get('accessToken') as string);

    return (
        <Card className={cn("flex justify-start flex-col items-start gap-1 my-5 p-5", className)}>
            <h2 className='text-3xl font-semibold text-cBlack'>Здравствуйте, {username}</h2>
            <div className='flex justify-start items-center gap-5'>
                <BreadCrumb path={pathname} />
            </div>
        </Card>
    );
};

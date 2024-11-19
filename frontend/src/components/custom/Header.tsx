import React from 'react';
import { cn } from '@/lib/utils';
import { BreadCrumb } from './BreadCrumb';
import { useLocation } from 'react-router-dom';

interface Props {
    className?: string;
    sideBarTrigger: React.ReactNode
}

export const Header: React.FC<Props> = ({ className, sideBarTrigger }) => {
    const { pathname } = useLocation()
    return (
        <div className={cn("flex justify-start items-center gap-5", className)}>
            {sideBarTrigger}
            <BreadCrumb path={pathname} />
        </div>
    );
};
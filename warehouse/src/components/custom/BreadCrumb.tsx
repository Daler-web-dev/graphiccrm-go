import React from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadCrumbProps {
    path: string;
}

export const BreadCrumb: React.FC<BreadCrumbProps> = ({ path }) => {
    const pathSegments = path.split('/').filter(Boolean);
    const fullSegments = ['Dashboard', ...pathSegments];

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {fullSegments.map((item, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && <BreadcrumbSeparator className='text-cDarkBlue' />}
                        <BreadcrumbItem className='text-cDarkBlue'>
                            <BreadcrumbLink
                                href={
                                    index === 0
                                        ? '/warehouse/'
                                        : `/warehouse/${pathSegments.slice(0, index).join('/')}`
                                }
                            >
                                {item.charAt(0).toUpperCase() + item.slice(1)}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </React.Fragment>
                ))}
                <BreadcrumbSeparator className='text-cDarkBlue' />
            </BreadcrumbList>
        </Breadcrumb>
    );
};

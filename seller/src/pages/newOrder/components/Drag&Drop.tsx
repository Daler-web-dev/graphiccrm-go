import React from 'react';

interface DragAndDropViewProps {
    width: number;
    height: number;
    rounded: number;
}

export const DragAndDropView: React.FC<DragAndDropViewProps> = ({ width, height, rounded }) => {
    return (
        <div className='flex flex-col justify-center items-center'>
            {rounded !== 0 && <div style={{ width: width + "px", height: rounded + "px", borderStartStartRadius: rounded + "px", borderStartEndRadius: rounded + "px", border: "1px solid #000" }}></div>}
            <div style={{ width: width + "px", height: height + "px", border: "1px solid #000" }}></div>
        </div>
    );
};
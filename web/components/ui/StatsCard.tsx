import React from 'react';
import Image from 'next/image';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon?: string; // optional URL to an icon image
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon }) => {
    return (
        <div className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            {icon && (
                <div className="mr-4">
                    <Image src={icon} alt={title} width={40} height={40} />
                </div>
            )}
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-xl font-semibold text-gray-800">{value}</p>
            </div>
        </div>
    );
};

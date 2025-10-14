import { Card } from 'flowbite-react';
import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
    return (
        <Card className="min-w-[220px] text-center shadow-sm">
            <h5 className="text-2xl leading-none font-semibold text-[#101828] dark:text-gray-100">{value}</h5>
            <p className="text-sm font-normal text-[#4A5565] dark:text-gray-400">{title}</p>
        </Card>
    );
};

export default StatCard;

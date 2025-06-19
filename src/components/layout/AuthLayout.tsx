'use client';
import { ReactNode, useEffect, useState } from 'react';

const backgroundImages = [
    'https://www.calebuniversity.edu.ng/caleb_uploads/2024/04/CompTIA-Security-SY0-601-scaled-1.jpg.webp',
    'https://www.calebuniversity.edu.ng/caleb_uploads/2023/03/stdent.jpg',
    'https://www.calebuniversity.edu.ng/caleb_uploads/2024/03/banner-front.jpg'
];

export default function AuthLayout({ children }: { children: ReactNode }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % backgroundImages.length);
        }, 7000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative h-screen w-screen overflow-hidden">
            {/* Background Carousel */}
            <div
                className="absolute top-0 left-0 w-full h-full bg-cover bg-center transition-all duration-1000 ease-in-out"
                style={{ backgroundImage: `url(${backgroundImages[currentIndex]})` }}
            />

            {/* Overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 backdrop-blur-sm" />

            {/* Logo & Form */}
            <div className="absolute top-1/2 left-1/2 z-10 transform -translate-x-1/2 -translate-y-1/2 w-full px-4">
                <div className="flex flex-col items-center gap-4">
                    <img
                        src="https://www.calebuniversity.edu.ng/caleb_uploads/2024/03/cropped-caleb-logoooonnnttt-180x180.png"
                        alt="Caleb University Logo"
                        className="w-20 h-20 rounded-full bg-white p-1 shadow-md"
                    />
                    <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 w-full">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

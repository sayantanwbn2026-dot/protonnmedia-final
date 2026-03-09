import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGlobalSettingsContext } from '@/contexts/GlobalSettingsContext';

interface Props {
    onComplete: () => void;
}

const Preloader = ({ onComplete }: Props) => {
    const { settings, loading } = useGlobalSettingsContext();
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isVideoEnded, setIsVideoEnded] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

    const videoUrl = (settings?.preloader_video_url as string) || '/videos/intro.mp4';

    useEffect(() => {
        // Prevent scrolling while preloader is active
        document.body.style.overflow = 'hidden';

        // Force preloader to close after exactly 7 seconds (cut the 11s video short)
        const durationTimer = setTimeout(() => {
            handleComplete();
        }, 7000);

        return () => clearTimeout(durationTimer);
    }, [hasStarted]);

    const handleVideoPlay = () => {
        setHasStarted(true);
    };

    const handleVideoEnd = () => {
        setIsVideoEnded(true);
        handleComplete();
    };

    const handleComplete = () => {
        if (!containerRef.current) return;

        // Animate out the preloader
        gsap.to(containerRef.current, {
            yPercent: -100,
            duration: 1.2,
            ease: 'power3.inOut',
            delay: 0.2,
            onComplete: () => {
                document.body.style.overflow = '';
                onComplete();
            }
        });

        // Fade out video slightly before sliding
        if (videoRef.current) {
            gsap.to(videoRef.current, {
                opacity: 0,
                duration: 0.8,
                ease: 'power2.inOut'
            });
        }
    };



    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[99999] bg-background flex items-center justify-center overflow-hidden"
        >
            <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
                onPlay={handleVideoPlay}
                onEnded={handleVideoEnd}
                onError={handleComplete} // Skip preloader if video fails
            />

            <button
                onClick={handleComplete}
                className="absolute bottom-10 right-10 z-10 text-xs font-body uppercase tracking-[0.2em] text-foreground/50 hover:text-foreground transition-colors"
            >
                Skip Intro
            </button>
        </div>
    );
};

export default Preloader;

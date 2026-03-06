import React, { useEffect, useCallback, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SectionHeading from './shared/SectionHeading';

const experts = [
    {
        id: 1,
        name: 'Sarah Jenkins',
        role: 'Full-Stack Developer',
        avatar: 'https://i.pravatar.cc/150?u=sarahj',
        skills: ['React', 'Node.js', 'Supabase'],
    },
    {
        id: 2,
        name: 'David Chen',
        role: 'UI/UX Designer',
        avatar: 'https://i.pravatar.cc/150?u=davidc',
        skills: ['Figma', 'Prototyping', 'User Research'],
    },
    {
        id: 3,
        name: 'Elena Rodriguez',
        role: 'AI Automation Specialist',
        avatar: 'https://i.pravatar.cc/150?u=elenar',
        skills: ['Python', 'LangChain', 'Zapier'],
    },
    {
        id: 4,
        name: 'James Wilson',
        role: 'Mobile App Developer',
        avatar: 'https://i.pravatar.cc/150?u=jamesw',
        skills: ['React Native', 'Swift', 'Kotlin'],
    },
    {
        id: 5,
        name: 'Aisha Patel',
        role: 'DevOps Engineer',
        avatar: 'https://i.pravatar.cc/150?u=aishap',
        skills: ['AWS', 'Docker', 'CI/CD'],
    },
];

const FeaturedFreelancers = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        loop: true,
        dragFree: true,
    });

    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setPrevBtnEnabled(emblaApi.canScrollPrev());
        setNextBtnEnabled(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
    }, [emblaApi, onSelect]);

    return (
        <section className="py-24 border-t border-border/50 bg-card/10">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                    <SectionHeading
                        badge="Top Talent"
                        title="Meet Our Experts"
                        description="Work with the top 1% of vetted professionals in our network."
                    />
                    <div className="flex gap-2 mt-6 md:mt-0 items-center border border-border/50 rounded-full p-1 w-fit bg-card/30 backdrop-blur-sm">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full h-10 w-10 shrink-0"
                            onClick={scrollPrev}
                            disabled={!prevBtnEnabled}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full h-10 w-10 shrink-0"
                            onClick={scrollNext}
                            disabled={!nextBtnEnabled}
                        >
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex -ml-4">
                        {experts.map((expert, index) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                key={expert.id}
                                className="flex-[0_0_85%] sm:flex-[0_0_45%] md:flex-[0_0_30%] min-w-0 pl-4"
                            >
                                <div className="glass-card-hover p-6 h-full flex flex-col">
                                    <div className="flex items-center gap-4 mb-6">
                                        <Avatar className="h-16 w-16 border-2 border-primary/20">
                                            <AvatarImage src={expert.avatar} alt={expert.name} />
                                            <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className="font-display font-semibold text-lg">{expert.name}</h4>
                                            <p className="text-sm text-primary font-medium">{expert.role}</p>
                                        </div>
                                    </div>

                                    <div className="mb-6 flex-grow">
                                        <div className="flex flex-wrap gap-2">
                                            {expert.skills.map((skill) => (
                                                <span key={skill} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md mb-1 border border-border/50">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <Button variant="outline" className="w-full group">
                                        View Portfolio
                                        <ExternalLink className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedFreelancers;

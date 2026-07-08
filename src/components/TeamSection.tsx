import { Facebook, Linkedin, Instagram, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { useWebsiteData } from '../context/WebsiteContext';

const formatSocialUrl = (url: string | undefined, defaultDomain?: string) => {
  if (!url || url === '#') {
    if (defaultDomain) {
      const baseDomain = defaultDomain.split('/')[0];
      return `https://${baseDomain}`;
    }
    return '#';
  }
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  
  if (trimmed.includes('.') || trimmed.includes('/')) {
    return `https://${trimmed}`;
  }
  
  if (defaultDomain) {
    return `https://${defaultDomain}/${trimmed}`;
  }
  
  return `https://${trimmed}`;
};

interface TeamSectionProps {
  onOpenConsultation: () => void;
}

export default function TeamSection({ onOpenConsultation }: TeamSectionProps) {
  const { data } = useWebsiteData();
  const { teamMembers } = data;

  return (
    <section id="team" className="py-20 bg-transparent overflow-x-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Flex title, divider line and More Team Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
          <div className="flex-1 flex items-center gap-4">
            <h2 className="text-3xl font-bold font-display text-white tracking-tight shrink-0">
              Your Podcast Growth Team
            </h2>
            <div className="hidden sm:block flex-1 h-[1px] bg-slate-800" />
          </div>
          <button
            onClick={onOpenConsultation}
            className="inline-flex items-center justify-center rounded-full bg-brand-cyan hover:bg-[#00e2c4] text-slate-950 font-bold px-6 py-2.5 text-sm tracking-wide shadow-sm hover:shadow-md transition-all shrink-0 self-start sm:self-auto"
            id="team-more-btn"
          >
            More Team
          </button>
        </div>

        {/* Members grid of 3 items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center">
          {teamMembers.map((member, index) => {
            // Every card slides in smoothly from the far right of the screen (right to left)
            const initial = { x: 120, opacity: 0 };

            return (
              <motion.div
                key={member.name}
                initial={initial}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -8 }}
                transition={{
                  x: { duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: index * 0.35 },
                  opacity: { duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: index * 0.35 },
                  y: { duration: 0.3, ease: "easeOut" }
                }}
                style={{ willChange: "transform, opacity" }}
                className="group relative rounded-2xl overflow-hidden shadow-lg border border-slate-800 bg-[#0B132B] hover:shadow-xl max-w-sm mx-auto w-full transition-shadow duration-300"
                id={`team-member-${member.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                
                {/* Aspect Ratio Container for Portait image */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={member.image}
                    alt={`Portrait of ${member.name}, ${member.role} at PodcastTopRankMedia`}
                    className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />

                  {/* Floating Social Icons stacked vertically on the right margin of the card */}
                  <div className="absolute top-1/2 -translate-y-1/2 right-4 flex flex-col gap-2 z-10 transition-all duration-300">
                    <a
                      href={formatSocialUrl(member.socials.facebook, 'facebook.com')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-purple hover:bg-indigo-600 text-white shadow-md hover:scale-110 transition-transform"
                      aria-label={`${member.name}'s Facebook`}
                    >
                      <Facebook className="h-4 w-4 fill-white" />
                    </a>
                    <a
                      href={formatSocialUrl(member.socials.linkedin, 'linkedin.com/in')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-purple hover:bg-indigo-600 text-white shadow-md hover:scale-110 transition-transform"
                      aria-label={`${member.name}'s LinkedIn`}
                    >
                      <Linkedin className="h-4 w-4 fill-white" />
                    </a>
                    <a
                      href={formatSocialUrl(member.socials.instagram, 'instagram.com')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-purple hover:bg-indigo-600 text-white shadow-md hover:scale-110 transition-transform"
                      aria-label={`${member.name}'s Instagram`}
                    >
                      <Instagram className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                {/* Bottom glassmorphic/white overlay info card */}
                <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 backdrop-blur-md rounded-xl p-4 shadow-md border border-slate-800 text-center transition-all duration-300 group-hover:border-purple-900/50">
                  <h3 className="font-display text-lg font-bold text-white leading-tight">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold text-brand-magenta mt-1 uppercase tracking-wider">
                    {member.role}
                  </p>
                </div>

              </motion.div>
            );
          })}
        </div>
        
      </div>
    </section>
  );
}

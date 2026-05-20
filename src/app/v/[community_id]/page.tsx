import React from 'react';
import Link from 'next/link';
import { ChevronRightIcon } from 'lucide-react';

export default function CommunityPublicProfile({ params }: { params: { community_id: string } }) {
  // We'll use the params to fetch real data later, for now we render a static visually rich layout
  return (
    <div className="w-full min-h-screen bg-theme-surface text-theme-forest pb-24">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[400px] flex flex-col items-center justify-center text-center px-6 border-b border-theme-outline/20">
        <div className="absolute inset-0 bg-theme-parchment/50 backdrop-blur-sm z-0"></div>
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="w-24 h-24 mx-auto rounded-xl bg-theme-clay flex items-center justify-center font-serif text-4xl text-theme-parchment shadow-2xl mb-8 transform rotate-3">
            S
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-medium tracking-tight">The Scribes of the Sahel</h1>
          <p className="font-sans text-lg md:text-xl text-theme-on-surface/80 max-w-2xl mx-auto leading-relaxed">
            A digital cultural institution dedicated to archiving the oral histories and poetry of West Africa.
          </p>
          <div className="pt-8 flex items-center justify-center gap-6">
            <button className="bg-theme-forest text-theme-parchment px-8 py-4 rounded-lg font-bold uppercase tracking-widest text-sm hover:opacity-90 transition-all shadow-xl hover:-translate-y-1">
              Apply to Join
            </button>
            <Link href={`/v/${params.community_id}/workspace`} className="text-theme-accent font-bold uppercase tracking-widest text-sm hover:underline underline-offset-4 transition-all">
              View Open Works
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-20 grid grid-cols-1 md:grid-cols-12 gap-16">

        {/* Left Column: Mission & Works */}
        <div className="md:col-span-8 space-y-20">
          <div>
            <h3 className="font-sans text-xs uppercase tracking-widest text-theme-accent mb-4 font-bold">The Mission</h3>
            <p className="font-serif text-2xl md:text-3xl leading-normal text-theme-on-surface">
              We are a decentralized collective of linguists, historians, and technologists. Our mandate is to weave the fragmented manuscripts of Timbuktu and the oral lineages of the Niger River basin into an immutable, accessible digital tapestry.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between border-b border-theme-outline/20 pb-4 mb-8">
              <h3 className="font-sans text-xs uppercase tracking-widest text-theme-accent font-bold">Featured Works</h3>
              <Link href={`/v/${params.community_id}/library`} className="text-theme-forest font-bold uppercase tracking-widest text-xs flex items-center gap-1 hover:underline underline-offset-4 transition-all">
                View Archive <ChevronRightIcon size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  id: 1,
                  title: "The Griot's Echo: A Griot's Tale",
                  desc: "A collection of epic poems transcribed from the oral tradition of the Griot storytellers.",
                  tags: ['Poetry', 'Oral History', 'West Africa'],
                  contributors: 5,
                },
                {
                  id: 2,
                  title: "Voices of the Diaspora",
                  desc: "Personal essays and interviews from community members living abroad, connecting roots with the present.",
                  tags: ['Essays', 'Interviews', 'Diaspora'],
                  contributors: 8,
                },
              ].map((work) => (
                <div key={work.id} className="border border-theme-outline/30 p-6 rounded-xl hover:border-theme-clay/50 transition-all hover:shadow-xl hover:-translate-y-1 group flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-theme-forest rounded-full"></span>
                        <span className="text-[10px] uppercase tracking-widest font-sans font-bold">Featured</span>
                      </div>
                      <span className="font-sans text-[10px] text-theme-on-surface/70 bg-theme-surface-low px-2 py-1 rounded border border-theme-outline/20">
                        {work.tags[0]}
                      </span>
                    </div>

                    <h4 className="font-serif text-xl mb-3 group-hover:text-theme-clay transition-colors">{work.title}</h4>
                    <p className="font-sans text-sm leading-relaxed text-theme-on-surface/80 mb-6 line-clamp-3">{work.desc}</p>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full border border-theme-surface-low bg-blue-100 flex items-center justify-center text-[8px] font-bold text-blue-700">1</div>
                      <div className="w-6 h-6 rounded-full border border-theme-surface-low bg-green-100 flex items-center justify-center text-[8px] font-bold text-green-700">2</div>
                      <div className="w-6 h-6 rounded-full border border-theme-surface-low bg-amber-100 flex items-center justify-center text-[8px] font-bold text-amber-700">3</div>
                      <div className="w-6 h-6 rounded-full border border-theme-surface-low bg-theme-outline/30 flex items-center justify-center text-[8px] font-bold text-theme-on-surface/70">
                        +{work.contributors - 3}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Transparency & Stats */}
        <div className="md:col-span-4 space-y-12">
          <div className="bg-theme-surface-high p-8 rounded-2xl border border-theme-outline/20 shadow-lg">
            <h3 className="font-sans text-xs uppercase tracking-widest text-theme-accent mb-6 font-bold">Treasury Transparency</h3>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-theme-on-surface/60 mb-1">Communal Funds</p>
                <p className="font-mono text-3xl text-theme-forest">45,000 <span className="text-lg opacity-50">SCR</span></p>
              </div>
              <div className="h-px w-full bg-theme-outline/20"></div>
              <div>
                <p className="text-sm text-theme-on-surface/60 mb-3">Recent Allocations</p>
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex justify-between"><span>Mali Site Prep</span><span className="text-theme-clay">-450</span></div>
                  <div className="flex justify-between"><span>Steward Stipends</span><span className="text-theme-clay">-1,200</span></div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-sans text-xs uppercase tracking-widest text-theme-accent mb-6 font-bold">Stewards & Members (142)</h3>
            <div className="flex flex-wrap gap-2">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-theme-outline/20 border-2 border-theme-surface flex items-center justify-center text-xs font-bold text-theme-forest/50">
                  {i + 1}
                </div>
              ))}
              <div className="w-10 h-10 rounded-full bg-theme-surface-high border-2 border-theme-outline/20 flex items-center justify-center text-xs font-bold text-theme-forest">
                +130
              </div>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}

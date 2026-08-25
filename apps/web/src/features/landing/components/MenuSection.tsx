import Image from "next/image";

import { Button } from "@heroui/react";

import { menuItems } from "../services/mockData";

export default function MenuSection() {
  return (
    <section
      className="py-16 px-[var(--gutter)] max-w-[var(--container-max)] mx-auto"
      id="menu"
    >
      <div className="flex flex-col gap-4 mb-16">
        <h2 className="text-4xl md:text-6xl uppercase text-accent">
          LATE NIGHT HITS
        </h2>
        <p className="text-sm font-bold text-muted uppercase tracking-widest">
          // THE ESSENTIALS
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {menuItems.map((item) => (
          <article
            key={item.id}
            className="border border-white/20 relative overflow-hidden transition-all duration-300 hover:border-accent hover:scale-[1.02]"
          >
            {/* Image */}
            <div className="h-64 bg-surface relative">
              <Image
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                alt={item.name}
                src={item.image}
                width={200}
                height={200}
                loading="eager"
              />
              {item.tags.length > 0 && (
                <div className="absolute top-4 right-4 flex gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-black border border-white px-2 py-1 text-xs uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-[1px] w-full bg-white/20" />

            {/* Content */}
            <div className="p-6 bg-black flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg uppercase">{item.name}</h3>
                <span className="font-bold text-accent text-xl">
                  {item.price}
                </span>
              </div>
              <p className="text-sm text-muted min-h-[48px]">
                {item.description}
              </p>
              <Button className="w-full py-3 border-2 border-white/20 text-white font-bold uppercase hover:bg-accent hover:text-black hover:border-accent transition-all">
                ADD TO ORDER
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

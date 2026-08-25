<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Brooklyn Fast Food - RAW. FAST. AUTHENTIC.</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Anton&amp;family=Archivo+Narrow:ital,wght@0,400..700;1,400..700&amp;family=JetBrains+Mono:wght@400;700&amp;family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                      "secondary-fixed-dim": "#c6c6c7",
                      "secondary-container": "#454747",
                      "error-container": "#93000a",
                      "on-secondary-container": "#b4b5b5",
                      "on-error-container": "#ffdad6",
                      "on-secondary-fixed": "#1a1c1c",
                      "primary": "#ffc383",
                      "on-surface": "#e2e2e2",
                      "on-tertiary-fixed-variant": "#004d68",
                      "primary-fixed-dim": "#ffb868",
                      "tertiary-container": "#00c0fe",
                      "tertiary-fixed-dim": "#77d1ff",
                      "surface-variant": "#353535",
                      "primary-fixed": "#ffddbb",
                      "surface-container": "#1f1f1f",
                      "tertiary": "#8fd7ff",
                      "primary-container": "#fd9d08",
                      "on-primary": "#482900",
                      "on-tertiary-fixed": "#001e2c",
                      "on-primary-container": "#653c00",
                      "inverse-surface": "#e2e2e2",
                      "on-error": "#690005",
                      "surface-container-highest": "#353535",
                      "inverse-primary": "#885200",
                      "on-tertiary": "#003549",
                      "surface": "#131313",
                      "secondary": "#c6c6c7",
                      "error": "#ffb4ab",
                      "surface-bright": "#393939",
                      "inverse-on-surface": "#303030",
                      "background": "#131313",
                      "outline": "#a28d7a",
                      "outline-variant": "#544434",
                      "tertiary-fixed": "#c2e8ff",
                      "on-surface-variant": "#dac2ad",
                      "on-secondary-fixed-variant": "#454747",
                      "surface-container-lowest": "#0e0e0e",
                      "surface-tint": "#ffb868",
                      "surface-dim": "#131313",
                      "surface-container-low": "#1b1b1b",
                      "on-primary-fixed-variant": "#673d00",
                      "on-background": "#e2e2e2",
                      "surface-container-high": "#2a2a2a",
                      "on-primary-fixed": "#2b1700",
                      "on-tertiary-container": "#004b65",
                      "on-secondary": "#2f3131",
                      "secondary-fixed": "#e2e2e2"
              },
              "borderRadius": {
                      "DEFAULT": "0.25rem",
                      "lg": "0.5rem",
                      "xl": "0.75rem",
                      "full": "9999px"
              },
              "spacing": {
                      "margin-mobile": "16px",
                      "unit": "4px",
                      "container-max": "1280px",
                      "gutter": "24px",
                      "margin-desktop": "64px"
              },
              "fontFamily": {
                      "body-md": [
                              "archivoNarrow"
                      ],
                      "headline-lg-mobile": [
                              "anton"
                      ],
                      "body-lg": [
                              "archivoNarrow"
                      ],
                      "headline-lg": [
                              "anton"
                      ],
                      "label-sm": [
                              "jetbrainsMono"
                      ],
                      "display-xl-mobile": [
                              "anton"
                      ],
                      "display-xl": [
                              "anton"
                      ],
                      "label-bold": [
                              "jetbrainsMono"
                      ]
              },
              "fontSize": {
                      "body-md": [
                              "16px",
                              {
                                      "lineHeight": "24px",
                                      "fontWeight": "400"
                              }
                      ],
                      "headline-lg-mobile": [
                              "32px",
                              {
                                      "lineHeight": "36px",
                                      "letterSpacing": "0.01em",
                                      "fontWeight": "400"
                              }
                      ],
                      "body-lg": [
                              "18px",
                              {
                                      "lineHeight": "28px",
                                      "fontWeight": "400"
                              }
                      ],
                      "headline-lg": [
                              "48px",
                              {
                                      "lineHeight": "52px",
                                      "letterSpacing": "0.01em",
                                      "fontWeight": "400"
                              }
                      ],
                      "label-sm": [
                              "12px",
                              {
                                      "lineHeight": "14px",
                                      "fontWeight": "400"
                              }
                      ],
                      "display-xl-mobile": [
                              "48px",
                              {
                                      "lineHeight": "48px",
                                      "letterSpacing": "0.02em",
                                      "fontWeight": "400"
                              }
                      ],
                      "display-xl": [
                              "80px",
                              {
                                      "lineHeight": "80px",
                                      "letterSpacing": "0.02em",
                                      "fontWeight": "400"
                              }
                      ],
                      "label-bold": [
                              "14px",
                              {
                                      "lineHeight": "16px",
                                      "letterSpacing": "0.05em",
                                      "fontWeight": "700"
                              }
                      ]
              }
      },
          },
        }
      </script>
<style>
        body { background-color: #000; color: #fff; }
        .bg-black-70 { background-color: rgba(0, 0, 0, 0.7); }
        .backdrop-blur-xl { backdrop-filter: blur(20px); }
        .text-primary-accent { color: #fd9d08; }
        .border-primary-accent { border-color: #fd9d08; }
        .bg-primary-accent { background-color: #fd9d08; }

        .btn-primary {
            @apply bg-primary-container text-black font-headline-lg-mobile uppercase px-8 py-4 transition-all duration-300;
        }
        .btn-primary:hover {
            @apply bg-black text-primary-container border-4 border-primary-container;
        }
        
        .btn-secondary {
            @apply bg-transparent border-2 border-white text-white font-headline-lg-mobile uppercase px-8 py-4 transition-all duration-300;
        }
        .btn-secondary:hover {
            @apply bg-white text-black;
        }

        .menu-card {
            @apply border border-white/20 relative overflow-hidden transition-all duration-300;
        }
        .menu-card:hover {
            @apply border-primary-container scale-[1.02];
        }
        
        .chip {
            @apply bg-black border border-white px-2 py-1 font-label-sm text-label-sm uppercase;
        }
    </style>
</head>
<body class="font-body-md text-body-md selection:bg-primary-container selection:text-black">
<!-- TopNavBar -->
<header class="fixed top-0 w-full z-50 bg-black/70 backdrop-blur-xl border-b border-primary">
<div class="flex justify-between items-center px-gutter py-4 w-full max-w-container-max mx-auto">
<div class="font-headline-lg text-headline-lg text-primary tracking-tighter">
                BROOKLYN FAST FOOD
            </div>
<nav class="hidden md:flex gap-8">
<a class="text-on-surface uppercase hover:text-primary transition-colors duration-200" href="#">PROMOS</a>
<a class="text-on-surface uppercase hover:text-primary transition-colors duration-200" href="#">MENU</a>
<a class="text-on-surface uppercase hover:text-primary transition-colors duration-200" href="#">EVENTS</a>
</nav>
<div class="flex gap-4 items-center">
<a class="hidden md:block font-label-bold text-label-bold text-on-surface hover:text-primary transition-colors duration-200" href="#">SIGN IN</a>
<button class="bg-primary-container text-black font-label-bold text-label-bold px-6 py-2 uppercase hover:bg-black hover:text-primary-container hover:border-2 hover:border-primary-container transition-all">
                    ORDER NOW
                </button>
</div>
</div>
</header>
<!-- Hero Section -->
<section class="relative min-h-screen flex flex-col justify-center items-center pt-24 px-gutter overflow-hidden">
<div class="absolute inset-0 z-0 opacity-40 mix-blend-luminosity">
<img class="w-full h-full object-cover" data-alt="A gritty, cinematic urban street corner in Brooklyn at night. The scene is illuminated by harsh, glowing neon signs and streetlights casting deep shadows on wet asphalt. The mood is raw and energetic, fitting for a fast-paced street food brand. High contrast black and white with strong mustard yellow accents." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAI0Nh1JzJaDAjklwFMNjhmjNJjf3nEUEBSBRohjt55YbbYdGyCFnkEiHdcdLcYammsMMNlzU7fy3u10xKPU8MQskmCcdq96AFJysr8PvZ24FMsIr5TYWgonuhE_RosbfT7tFefEiNNaxWlUZk3Khk0PgoLq2H6hqsgZ7Rc3R3vpNWbwBTrYa3bcd2cOvd3WZ-ScWB9_AxJz3ogglPm9nkS8rM_NVzTR5tD7epd6Qzdb0w-Z-GvlCuC"/>
</div>
<div class="relative z-10 max-w-container-max w-full flex flex-col items-start gap-8 md:mt-32">
<h1 class="font-display-xl text-display-xl md:text-[120px] md:leading-[110px] text-white uppercase max-w-4xl tracking-tighter drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                RAW.<br/>
                FAST.<br/>
<span class="text-primary-container">AUTHENTIC.</span>
</h1>
<p class="font-body-lg text-body-lg text-on-surface max-w-xl bg-black/50 p-4 border-l-4 border-primary-container">
                Straight from the streets of Brooklyn. No compromises, just unapologetic flavor hitting you at 100mph. We own the night.
            </p>
<div class="flex flex-col sm:flex-row gap-6 mt-4">
<a class="btn-primary text-center" href="#menu">VIEW MENU</a>
<a class="btn-secondary text-center" href="#">ORDER NOW</a>
</div>
</div>
</section>
<!-- Divider -->
<div class="w-full h-[2px] bg-white opacity-20"></div>
<!-- Late Night Hits (Menu) -->
<section class="py-margin-desktop px-gutter max-w-container-max mx-auto" id="menu">
<div class="flex flex-col gap-4 mb-16">
<h2 class="font-display-xl-mobile md:font-display-xl text-display-xl-mobile md:text-display-xl uppercase text-primary-container">
                LATE NIGHT HITS
            </h2>
<p class="font-label-bold text-label-bold text-on-surface uppercase tracking-widest">
                // THE ESSENTIALS
            </p>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
<!-- Product 1 -->
<div class="menu-card group">
<div class="h-64 bg-surface-container-high relative">
<img class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" data-alt="A towering, messy, gourmet smashburger known as 'The Bronx Bomber'. Two thick beef patties, oozing yellow cheddar cheese, crispy bacon, and a dark secret sauce on a toasted brioche bun. The lighting is harsh and dramatic, creating a raw, brutalist food photography style against a pure black background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQ4xCotDyU1vHqLVOipRiAWiBwo4nqH1lIcAQyoA3Ph1C5pktOOoWISUs-_UxftUx65rI596gGmLclXiRHHjB14lcGrwYl7NaQCuLJ8ppXhDTDu3mdUroGEG3aGqfl-URJySFI3zaSYtgjXf1A6dyMBqGQomUJ8AWU_ZdW6KE8U4kodXb16fBBUh0Y2oJO2-Wu4_n8x_Hq6zwfY2_SAqidzL_ibQSNYEG8gN-oA08BRIFNjdyYV8cG"/>
<div class="absolute top-4 right-4 flex gap-2">
<span class="chip">HOT</span>
<span class="chip">BEEF</span>
</div>
</div>
<div class="h-[1px] w-full bg-white/20 group-hover:bg-primary-container transition-colors"></div>
<div class="p-6 bg-black flex flex-col gap-4">
<div class="flex justify-between items-start">
<h3 class="font-headline-lg-mobile text-headline-lg-mobile uppercase">THE BRONX BOMBER</h3>
<span class="font-label-bold text-label-bold text-primary-container text-xl">$14.00</span>
</div>
<p class="font-body-md text-body-md text-on-surface/80 min-h-[48px]">
                        Double smashed patties, aged cheddar, crispy bacon, house riot sauce.
                    </p>
<button class="w-full py-3 border-2 border-white/20 text-white font-label-bold uppercase hover:bg-primary-container hover:text-black hover:border-primary-container transition-all">
                        ADD TO ORDER
                    </button>
</div>
</div>
<!-- Product 2 -->
<div class="menu-card group">
<div class="h-64 bg-surface-container-high relative">
<img class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" data-alt="A large portion of thick-cut, golden french fries generously dusted with dark truffle powder and parmesan cheese, served in a raw, industrial metal basket. The lighting is stark and directional, casting deep shadows against a stark black background. High contrast, raw aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuK9EvCgJH9pRBNu80dXnpbMb7x5YY7NAtix3GVziBhD9bJZ2badlUdPH3RmtyY6z5w11vlYChUQ7X2hHNZEFkL5OE6wZj8hhRTGhUeO4GO7oygYeZuoygGyu0xknWjqxspQnQUscPIu9Aw-aECXdtGLjv3pNGzZ-KS-6zDPWOVKdUCLfumGzbQRzEuBkke6RNSh8YNEar2YlR-_065lLSOlhOs2PFZweUINzjlfcdKNFuFKggkpAn"/>
<div class="absolute top-4 right-4 flex gap-2">
<span class="chip">VEG</span>
</div>
</div>
<div class="h-[1px] w-full bg-white/20 group-hover:bg-primary-container transition-colors"></div>
<div class="p-6 bg-black flex flex-col gap-4">
<div class="flex justify-between items-start">
<h3 class="font-headline-lg-mobile text-headline-lg-mobile uppercase">TRUFFLE DUST FRIES</h3>
<span class="font-label-bold text-label-bold text-primary-container text-xl">$7.50</span>
</div>
<p class="font-body-md text-body-md text-on-surface/80 min-h-[48px]">
                        Thick cut fries, black truffle dust, parmesan grit, roasted garlic aioli.
                    </p>
<button class="w-full py-3 border-2 border-white/20 text-white font-label-bold uppercase hover:bg-primary-container hover:text-black hover:border-primary-container transition-all">
                        ADD TO ORDER
                    </button>
</div>
</div>
<!-- Product 3 -->
<div class="menu-card group">
<div class="h-64 bg-surface-container-high relative">
<img class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" data-alt="A massive, overflowing milkshake in a tall glass, aptly named 'Toxic Sludge Shake'. It features dark chocolate, vibrant green mint syrup drizzled down the sides, topped with a mountain of whipped cream and crushed dark cookies. Shot with brutalist, high-flash lighting against a black backdrop." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbawkCfYGyd1Z2vWnrAjm9NRU1EnDWMIRC070Cl52fdOp_HmsL3P-o4929d06_tIBuMLR_keT0Jxvu_KeF4_ge7kB6Qg7hrPnvXwUYb9hEG4CEbktewraKRqCxFDG3E58Eum5Hfl7lHar8Xx8GffyLy8q9AwI6Ef_fVJlVxqhJ5hWBoufenK3jxzbCukU1toEXi5ijRrpJjmUNIII9e4wHTf8A70lmNRy9v181Z0wvFG801wVHsHv7"/>
</div>
<div class="h-[1px] w-full bg-white/20 group-hover:bg-primary-container transition-colors"></div>
<div class="p-6 bg-black flex flex-col gap-4">
<div class="flex justify-between items-start">
<h3 class="font-headline-lg-mobile text-headline-lg-mobile uppercase">TOXIC SLUDGE SHAKE</h3>
<span class="font-label-bold text-label-bold text-primary-container text-xl">$8.00</span>
</div>
<p class="font-body-md text-body-md text-on-surface/80 min-h-[48px]">
                        Dark chocolate, mint chaos, crushed cookies, defying gravity.
                    </p>
<button class="w-full py-3 border-2 border-white/20 text-white font-label-bold uppercase hover:bg-primary-container hover:text-black hover:border-primary-container transition-all">
                        ADD TO ORDER
                    </button>
</div>
</div>
</div>
</section>
<!-- Divider -->
<div class="w-full h-[2px] bg-primary-container"></div>
<!-- Weekend Takeover (Events) -->
<section class="py-margin-desktop px-gutter max-w-container-max mx-auto relative">
<div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
<div class="flex flex-col gap-8 order-2 lg:order-1">
<div class="flex flex-col gap-2">
<p class="font-label-bold text-label-bold text-primary-container uppercase tracking-widest flex items-center gap-2">
<span class="w-8 h-[2px] bg-primary-container inline-block"></span>
                        LIVE EVENT
                    </p>
<h2 class="font-display-xl-mobile md:font-display-xl text-display-xl-mobile md:text-display-xl uppercase leading-none">
                        WEEKEND<br/>TAKEOVER
                    </h2>
</div>
<div class="bg-surface-container-high p-8 border-l-4 border-primary-container">
<h3 class="font-headline-lg text-headline-lg uppercase mb-2 text-white">MIDNIGHT MEAT RUN</h3>
<p class="font-body-md text-body-md text-on-surface mb-6">
                        Join us this Friday at 11 PM. Limited edition street cuts, live DJ set by DJ Grit, and exclusive merch drops. Once the meat is gone, it's gone.
                    </p>
<div class="grid grid-cols-4 gap-4 text-center border-t border-white/20 pt-6">
<div>
<span class="block font-headline-lg-mobile text-headline-lg-mobile text-primary-container">02</span>
<span class="font-label-sm text-label-sm uppercase text-on-surface/60">DAYS</span>
</div>
<div>
<span class="block font-headline-lg-mobile text-headline-lg-mobile text-primary-container">14</span>
<span class="font-label-sm text-label-sm uppercase text-on-surface/60">HOURS</span>
</div>
<div>
<span class="block font-headline-lg-mobile text-headline-lg-mobile text-primary-container">45</span>
<span class="font-label-sm text-label-sm uppercase text-on-surface/60">MINS</span>
</div>
<div>
<span class="block font-headline-lg-mobile text-headline-lg-mobile text-primary-container">12</span>
<span class="font-label-sm text-label-sm uppercase text-on-surface/60">SECS</span>
</div>
</div>
</div>
<button class="btn-primary w-fit">RSVP NOW</button>
</div>
<div class="order-1 lg:order-2 relative aspect-square w-full max-w-md mx-auto lg:max-w-none">
<div class="absolute inset-0 bg-primary-container transform translate-x-4 translate-y-4"></div>
<img class="relative z-10 w-full h-full object-cover grayscale border-2 border-white" data-alt="A gritty, high-contrast black and white photograph of a crowded, underground street food event in Brooklyn. People are clustered around a food stall illuminated by harsh overhead lights, smoke billowing from the grill. The scene is energetic, chaotic, and authentic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvvGavNkYv9KSsmkbkYRKG8j7_gAOIJTKhsmaDrQQ-cPMniQh4RoHeSsevtfRaWGg4LnD2bpw6U0IYaQvy7_KRzcdpuSKFrGaJCx84nkfpAuwyQmKSwQLqKyloDH_gpoqf8z58jXygny7JgHgdwqBpg0tvMYQYltlRmB1RyHCT-hsTsDBaKlvYrGAg2gtkkX-65Har9I3xAd_T_0X7Fo_5tdRjqkk3R_1IvA8NN38kRZ5fYPwZEh2p"/>
</div>
</div>
</section>
<!-- Footer -->
<footer class="w-full py-12 border-t-2 border-on-surface/20 bg-black flex flex-col md:flex-row justify-between items-center px-gutter max-w-container-max mx-auto mt-24">
<div class="font-display-xl text-display-xl text-on-surface mb-8 md:mb-0">
            BROOKLYN<br/>FAST FOOD
        </div>
<div class="flex flex-col items-center md:items-end gap-8">
<nav class="flex gap-6 flex-wrap justify-center md:justify-end">
<a class="font-label-sm text-label-sm text-on-surface/60 uppercase hover:text-white underline opacity-80 hover:opacity-100 transition-all" href="#">LOCATIONS</a>
<a class="font-label-sm text-label-sm text-on-surface/60 uppercase hover:text-white underline opacity-80 hover:opacity-100 transition-all" href="#">NUTRITION</a>
<a class="font-label-sm text-label-sm text-on-surface/60 uppercase hover:text-white underline opacity-80 hover:opacity-100 transition-all" href="#">CAREERS</a>
<a class="font-label-sm text-label-sm text-on-surface/60 uppercase hover:text-white underline opacity-80 hover:opacity-100 transition-all" href="#">PRIVACY</a>
</nav>
<p class="font-label-sm text-label-sm text-on-surface/40 uppercase">
                © 2024 BROOKLYN FAST FOOD. RAW. FAST. AUTHENTIC.
            </p>
</div>
</footer>
</body></html>

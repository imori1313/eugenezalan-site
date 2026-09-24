export type Project = {
  slug: string; name: string; kind: string; concept: string; description: string;
  story: string; detail: string; materials: string; cover: string; interior: string;
  closeup: string; gallery: {src: string; alt: string}[]; accent: string;
};
const base = (slug: string, file: string) => `/images/projects/${slug}/${file}`;
export const projects: Project[] = [
  {
    slug: 'ruyi', name: 'Ruyi', kind: 'Sculptural sideboard', accent: '#bfa06c',
    concept: 'Cloud-inspired relief with a golden centre',
    description: 'Circular relief, a dark silhouette and warm golden fluting. A sculptural sideboard with configurations for a home bar or a vinyl collection.',
    story: 'Ruyi begins with the looping forms of clouds at golden hour. Their movement becomes a carved rhythm across the doors, held in balance by the vertical lines at the centre of the piece.',
    detail: 'The sculptural front opens onto a different kind of composition: compartments for records, or space for glassware and the objects of an evening ritual. Discuss the layout that suits the way you live.',
    materials: 'CNC-carved MDF, painted surfaces and wooden legs. The precise interior and finish are agreed for the selected configuration.',
    cover: base('ruyi','green-room.png'), interior: base('ruyi','open-vinyl.png'), closeup: base('ruyi','dark-room.png'),
    gallery: [
      {src: base('ruyi','green-room.png'), alt:'Ruyi sideboard with circular relief in a green interior'},
      {src: base('ruyi','light-room.png'), alt:'Ruyi sideboard in a light-filled interior'},
      {src: base('ruyi','open-vinyl.png'), alt:'Ruyi with doors open to reveal vinyl storage'},
      {src: base('ruyi','open-bar.png'), alt:'Ruyi bar configuration with open doors'},
      {src: base('ruyi','dark-room.png'), alt:'Ruyi sculptural sideboard in a dark interior'},
    ],
  },
  {
    slug:'dark-blue', name:'Dark-Blue', kind:'Statement sideboard', accent:'#94b8bd',
    concept:'Deep blue relief beneath marbled glass',
    description:'A deep blue relief surface meets a glass top with an expressive marbled artwork. Flowing lines draw the eye towards each handle.',
    story:'Dark-Blue explores the shifting character of a surface in the light. The dark blue finish gives the form depth; the movement of the glass artwork carries the eye across it.',
    detail:'The flowing relief continues around practical storage. A warm walnut-veneer interior creates a deliberate contrast with the cool exterior.',
    materials:'Painted relief fronts, a glass top with marbled artwork, and walnut veneer inside. Hardware and final specification are discussed on enquiry.',
    cover:base('dark-blue','room-view.jpg'), interior:base('dark-blue','open-drawer.jpg'), closeup:base('dark-blue','front-detail.jpg'),
    gallery:[
      {src:base('dark-blue','room-view.jpg'),alt:'Dark-Blue sideboard with a marbled glass top'},
      {src:base('dark-blue','top-view.jpg'),alt:'Top view of the blue and gold marbled artwork'},
      {src:base('dark-blue','front-detail.jpg'),alt:'Flowing relief on the Dark-Blue facade'},
      {src:base('dark-blue','open-drawer.jpg'),alt:'Open drawer and interior of Dark-Blue'},
      {src:base('dark-blue','drawer-detail.jpg'),alt:'Close view of the Dark-Blue drawer'},
    ],
  },
  {
    slug:'whartlights',name:'Wharflights',kind:'Architectural sideboard',accent:'#c4a679',
    concept:'A sideboard inspired by London after dark',
    description:'A grid of dark and golden surfaces recalls city windows and reflections. An architectural sideboard with a warm interior.',
    story:'The starting point is London at night: towers reflected in glass and water, and the warmth of lit windows. The facade translates that impression into a measured rhythm of light and shadow.',
    detail:'Behind the geometric surface, walnut veneer gives the interior warmth. Storage can be discussed around glassware, serving pieces and the objects you want to keep close.',
    materials:'Dark painted surfaces, gold-toned accents and a walnut-veneer interior. Final dimensions and finish are confirmed with the commission.',
    cover:base('whartlights','front-night.png'),interior:base('whartlights','open-interior.png'),closeup:base('whartlights','side-view.png'),
    gallery:[
      {src:base('whartlights','front-night.png'),alt:'Wharflights sideboard against the London skyline at night'},
      {src:base('whartlights','front-day.png'),alt:'Wharflights sideboard in daylight'},
      {src:base('whartlights','side-view.png'),alt:'Geometric facade and side of Wharflights'},
      {src:base('whartlights','open-interior.png'),alt:'Wharflights with doors open showing storage'},
      {src:base('whartlights','top-view.png'),alt:'Wharflights sideboard viewed from above'},
      {src:base('whartlights','dimensions.png'),alt:'Existing Wharflights reference drawing with dimensions; confirm the specification on enquiry'},
    ],
  },
  {
    slug:'la-clavelina',name:'La Clavelina',kind:'Art Deco sideboard',accent:'#92aaa3',
    concept:'Botanical curves and flower-shaped handles',
    description:'A flowing facade, patinated colour and flower-shaped brass handles. A piece that reveals its character at close range.',
    story:'La Clavelina takes its starting point from the carnation. A soft wave and a central circle shape the front, while a dark frame gives the composition its structure.',
    detail:'The flower-shaped brass handles are designed and made by Eugene Zalan. Their form connects the larger composition to the small, tactile moment of opening a door.',
    materials:'Precision-milled fronts, hand-applied patina, mirrored accents and signature brass handles. Enquire about the full specification.',
    cover:base('la-clavelina','front-view.png'),interior:base('la-clavelina','open-interior.png'),closeup:base('la-clavelina','handle-side.png'),
    gallery:[
      {src:base('la-clavelina','front-view.png'),alt:'La Clavelina sideboard with a central circle and patinated facade'},
      {src:base('la-clavelina','room-view.png'),alt:'La Clavelina in a bright living room'},
      {src:base('la-clavelina','handle-side.png'),alt:'Flower-shaped brass handle on La Clavelina'},
      {src:base('la-clavelina','open-interior.png'),alt:'La Clavelina with the storage interior open'},
      {src:base('la-clavelina','handle-isolated.png'),alt:'Signature brass flower handle on fabric'},
    ],
  },
  {
    slug:'moon-buffet',name:'Moon buffet',kind:'Bar & display cabinet',accent:'#c9ba8e',
    concept:'A cabinet with an illuminated lunar centrepiece',
    description:'A moon-like centrepiece and an illuminated interior turn a bar cabinet into an object for the evening.',
    story:'Moon buffet brings the atmosphere of the Moon indoors. Its dark form makes room for a luminous focal point, changing the character of the room as daylight gives way to evening.',
    detail:'Glassware and favourite objects become part of the interior composition. Warm LED lighting reveals the display, with drawers for the practical things kept out of sight.',
    materials:'An illuminated display interior with warm LED lighting and walnut drawers. Surface finishes and the full construction specification are confirmed on enquiry.',
    cover:base('moon-buffet','moon-front.png'),interior:base('moon-buffet','front-view.jpg'),closeup:base('moon-buffet','room-view.png'),
    gallery:[
      {src:base('moon-buffet','moon-front.png'),alt:'Moon buffet with an illuminated lunar centrepiece'},
      {src:base('moon-buffet','green-room.jpg'),alt:'Moon buffet bar cabinet in a green interior'},
      {src:base('moon-buffet','side-view.jpg'),alt:'Side view of the Moon buffet cabinet'},
      {src:base('moon-buffet','front-view.jpg'),alt:'Moon buffet shelving and illuminated display'},
    ],
  },
  {
    slug:'gisluotis',name:'Ōbako',kind:'Botanical sideboard',accent:'#99b298',
    concept:'A botanical panel framed in green',
    description:'Deep green surfaces, botanical artwork and mirrored reflections. A sideboard inspired by the plantain growing around us.',
    story:'Ōbako draws attention to a plant that is easy to walk past. The botanical motif takes its place at the centre of the piece, framed by deep green and an elongated leaf-like relief.',
    detail:'Matte surfaces sit beside a reflective botanical panel. Behind the facade, practical shelving creates space for tableware or a home bar.',
    materials:'CNC-carved MDF, a deep green matte lacquer and a mirrored panel with botanical artwork. Interior finish is specified with the order.',
    cover:base('gisluotis','front-view.png'),interior:base('gisluotis','open-interior.png'),closeup:base('gisluotis','panel-detail.png'),
    gallery:[
      {src:base('gisluotis','front-view.png'),alt:'Obako green sideboard with a central botanical panel'},
      {src:base('gisluotis','room-view.png'),alt:'Obako sideboard in a dark green interior'},
      {src:base('gisluotis','panel-detail.png'),alt:'Plantain-inspired artwork on the Obako panel'},
      {src:base('gisluotis','open-interior.png'),alt:'Open Obako sideboard showing shelves'},
      {src:base('gisluotis','angled-view.png'),alt:'Obako from an angle showing carved leaf-like relief'},
    ],
  },
  {
    slug:'sherwood',name:'Sherwood',kind:'Sculptural cabinet',accent:'#baa170',
    concept:'Ornamental brass details against a dark finish',
    description:'A dark silhouette, ornamental brass details and doors that open to reveal a warmer world inside.',
    story:'Sherwood borrows its atmosphere from medieval England: candlelight, old libraries and the detail of carved metal. These references become a contemporary composition of ornament and shadow.',
    detail:'The doors open to either side, revealing organised storage. Interior and leg options give the piece different expressions, from a lighter finish to a warmer mahogany interior.',
    materials:'A deep black finish, polished brass inlays and turned oak leg options. Interior materials and configuration are agreed for the selected edition.',
    cover:base('sherwood','front-view.png'),interior:base('sherwood','open-front.jpg'),closeup:base('sherwood','handle-detail.jpg'),
    gallery:[
      {src:base('sherwood','front-view.png'),alt:'Sherwood cabinet with ornamental brass details against a dark background'},
      {src:base('sherwood','blue-room.png'),alt:'Sherwood cabinet in a blue interior'},
      {src:base('sherwood','open-front.jpg'),alt:'Sherwood with doors open and storage interior visible'},
      {src:base('sherwood','handle-detail.jpg'),alt:'Ornamental metal detail on Sherwood'},
      {src:base('sherwood','dark-room.jpg'),alt:'Sherwood cabinet in a dark room'},
    ],
  },
];

export const contact = {
  email:'imori@europe.com', phone:'+447709252900', phoneDisplay:'+44 (0)7709 252900',
  whatsapp:'https://wa.me/447709252900?text='+encodeURIComponent('Hi Eugene, I’m interested in discussing a bespoke furniture commission.'),
};

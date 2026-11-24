export const company = {
  name: 'HAVISS 3D METROLOGY SOLUTIONS',
  shortName: 'Haviss',
  tagline: 'Serving all your Coordinate Measuring Machine needs',
  founded: 2014,
  leader: 'H. Sathish Kumar',
  phone: '+91 99624 74959',
  phoneHref: 'tel:+919962474959',
  email: import.meta.env.VITE_CONTACT_EMAIL || 'haviss14@gmail.com',
  location: 'Chennai, Tamil Nadu, India',
  registeredOffice: '#1A, 1st Floor, IJ Puram, Manali New Town, Ponneri High Road, Chennai, Tamil Nadu 600103, India.',
  works: 'No. 144, Kamarajar Street, TMP Nagar, Padi, Chennai, Tamil Nadu 600050, India.',
  domain: 'haviss.in',
  mapsOffice: 'https://www.google.com/maps/search/?api=1&query=IJ+Puram+Manali+New+Town+Chennai+600103',
  mapsWorks: 'https://www.google.com/maps/search/?api=1&query=No+144+Kamarajar+Street+TMP+Nagar+Padi+Chennai+600050',
};

/** Haviss's own CMM inspection centre, as stated in the company brochure. */
export const inspectionCentre = {
  machine: 'DCC bridge-type CMM',
  range: 'X 700 mm × Y 1000 mm × Z 600 mm',
  accuracy: '3 + L/300 µm',
  software: 'CMM Manager',
  probing: 'Renishaw probe head',
  location: 'Works, Padi, Chennai',
};

export type Figure = { src: string; alt: string; caption?: string };
export type Service = {
  slug: string; number: string; title: string; shortTitle: string; keyword: string; eyebrow: string;
  headline: string; summary: string; overview: string; image: string; imageAlt: string;
  benefits: string[]; scope: { title: string; description: string }[];
  applications: string[]; faqs: { question: string; answer: string }[]; enquiryService: string;
  lists?: { title: string; items: string[] }[]; specs?: { label: string; value: string }[]; gallery?: Figure[];
};

export const services: Service[] = [
  {
    slug: 'cmm-retrofit', number: '01', title: 'CMM Retrofit', shortTitle: 'CMM Retrofit', keyword: 'CMM Retrofit',
    eyebrow: 'MANUAL & DCC CMM RETROFIT', headline: 'Give your existing CMM a new lease of life.',
    summary: 'Retrofit manual and DCC coordinate measuring machines with a new controller, scales, probe head, probe, software and computer.',
    overview: 'Most CMMs manufactured in the 1980s and 1990s are well made, sturdy machines — but their hardware and software are now outdated. Retrofitting these CMMs with new hardware and software restores them to state-of-the-art equipment. A retrofit increases productivity, extends the life of the CMM and, in most cases, improves accuracy through new non-linear error compensation.',
    image: '/images/cmm-machine.webp', imageAlt: 'Bridge-type coordinate measuring machine ready for a controller and software retrofit',
    benefits: ['Faster inspection throughput', 'Increased measurement capability', 'Greater software functionality and usability', 'Added automation — convert manual machines to DCC', 'Longer life from a proven granite and bridge structure', 'Improved accuracy with new non-linear compensation'],
    scope: [
      { title: 'New CMM controller', description: 'Latest-generation controller and machine interface, replacing obsolete and hard-to-support electronics.' },
      { title: 'Axis scales & reader heads', description: 'New scale system and reader heads for reliable positional feedback on each axis.' },
      { title: 'Probe head & probe', description: 'New motorised or manual probe heads and touch-trigger or scanning probes, matched to your parts.' },
      { title: 'Software & computer', description: 'Latest-generation metrology software on a new computer system, with installation, error mapping and training.' },
    ],
    lists: [
      { title: 'Manual CMM retrofit', items: ['Sheffield', 'Brown & Sharpe', 'Mitutoyo', 'Zeiss', 'Numerex', 'Starrett', 'Helmel', 'Tesa MicroHite 3D', 'Coord3', 'Accurate'] },
      { title: 'DCC CMM retrofit', items: ['Brown & Sharpe', 'Mitutoyo', 'Zeiss', 'Renishaw UCC', 'Numerex', 'Starrett', 'Helmel', 'LK', 'Coord3', 'Wenzel', 'Accurate'] },
    ],
    gallery: [
      { src: '/images/haviss/retrofit-components.webp', alt: 'CMM retrofit hardware: controller with jog box, axis scales and reader heads, probe head and CMM software', caption: 'Controller, scales, probe head and software — the core of a CMM retrofit.' },
      { src: '/images/haviss/cmm-bridge-drawing.webp', alt: 'Line drawing of a bridge-type coordinate measuring machine on a granite base', caption: 'The granite table and bridge are retained; the electronics and software are renewed.' },
    ],
    applications: ['Obsolete or unsupported controller electronics', 'Converting a manual CMM to DCC operation', 'Unreliable scales, reader heads or probing', 'Moving to CAD-based programming and reporting'],
    faqs: [
      { question: 'Which CMMs can be retrofitted?', answer: 'Haviss retrofits manual and DCC CMMs from Mitutoyo, Zeiss, Brown & Sharpe, Sheffield, LK, Wenzel, Coord3, Accurate, Tesa, DEA, Leitz, Hexagon, Numerex, Starrett, Helmel and others. Share the make, model, controller details and photographs so we can confirm the retrofit scope for your machine.' },
      { question: 'What does a CMM retrofit include?', answer: 'A retrofit can include all or some of: a new latest-generation CMM controller, new axis scales and reader heads, a new probe head and probe, latest-generation metrology software and a new computer system. The scope is agreed after inspecting the machine.' },
      { question: 'Is a retrofit cheaper than a new CMM?', answer: 'In most cases, yes. The granite table and bridge — the most expensive, stable parts of a CMM — are retained, while the electronics and software are renewed. You also keep the floor space and foundation you already have.' },
    ], enquiryService: 'CMM Retrofit',
  },
  {
    slug: 'cmm-software-upgrade', number: '02', title: 'CMM Software Upgrade', shortTitle: 'Software Upgrade', keyword: 'CMM Software Upgrade',
    eyebrow: 'CMM MANAGER · METROLOG XG', headline: 'Upgrade to modern, CAD-based CMM software.',
    summary: 'Upgrade manual and DCC CMMs to CMM Manager or Metrolog XG for full CAD capability, easier programming and better reports.',
    overview: 'CAD integration and software usability have become major priorities as CMM productivity demands increase. Haviss upgrades existing manual and DCC CMMs to modern PC-based metrology software. Where the existing controller is compatible, the upgrade can retain it — minimising expense while providing a seamless path to state-of-the-art software with full CAD capability.',
    image: '/images/haviss/software-cmm-manager.webp', imageAlt: 'CMM Manager software measuring a CAD model with live X, Y and Z readout',
    benefits: ['Full CAD import, alignment and CAD-teach programming', 'Easier programming with a lower learning curve', 'Graphical, customer-ready inspection reports', 'Can retain a compatible existing controller to reduce cost'],
    scope: [
      { title: 'Compatibility check', description: 'Review the controller, interface, probe head and computer to choose a software-only or combined upgrade.' },
      { title: 'Installation & set-up', description: 'Install the software, configure machine parameters, probes and styli, and verify communication with the CMM.' },
      { title: 'Programme transition', description: 'Re-create or convert existing inspection routines and validate them on the machine.' },
      { title: 'Operator training', description: 'Hands-on training in alignment, measurement, CAD programming and report generation.' },
    ],
    lists: [
      { title: 'CMM Manager (Nikon Metrology)', items: ['Available as an upgrade for existing manual or DCC CMMs', 'Can use the existing CMM controller, minimising expense', 'PC-based software with full CAD capabilities', 'Known for "single click" operation and a low learning curve'] },
      { title: 'Metrolog XG (Metrologic Group)', items: ['3D measuring and quality-control software', 'Supplied as standard 3D software on many CMM brands', 'Especially suited to retrofitting CMMs, old or new', 'Connects to manual and CNC CMMs through standard Metrologic interfaces', 'Built-in DMIS (Dimensional Measuring Interface Specification) engine'] },
    ],
    gallery: [
      { src: '/images/haviss/software-cmm-manager.webp', alt: 'CMM Manager software screen measuring a circle on a CAD part', caption: 'CMM Manager — PC-based CMM software with full CAD capability.' },
      { src: '/images/haviss/software-metrolog-xg.webp', alt: 'Metrolog XG software showing a colour-mapped CAD comparison and inspection report', caption: 'Metrolog XG — 3D measurement and quality-control software with DMIS.' },
    ],
    applications: ['Old DOS or unsupported CMM software', 'New requirement for CAD-based inspection', 'Better graphical reporting for customers', 'Software upgrade as part of a full retrofit'],
    faqs: [
      { question: 'Can I upgrade CMM software without changing the controller?', answer: 'Often, yes. CMM Manager can be installed as an upgrade using the existing CMM controller in many configurations. Haviss checks your controller and interface first and recommends a software-only or combined upgrade.' },
      { question: 'Which software do you offer?', answer: 'Haviss offers CMM Manager from Nikon Metrology and Metrolog XG from Metrologic Group. The right choice depends on your machine, parts, CAD requirements and reporting needs.' },
      { question: 'Will my existing CMM programmes still work?', answer: 'Existing programmes usually need conversion or re-creation in the new software. Haviss identifies the routines you rely on and validates them on the machine as part of the upgrade.' },
    ], enquiryService: 'CMM Software Upgrade',
  },
  {
    slug: 'cmm-service', number: '03', title: 'CMM Service & Repair', shortTitle: 'CMM Service', keyword: 'CMM Service',
    eyebrow: 'BREAKDOWN, REPAIR & PREVENTIVE SERVICE', headline: 'Keep your CMM running, trouble-free.',
    summary: 'On-site CMM service for all makes — fault diagnosis, repair, preventive maintenance and replacement of worn parts.',
    overview: 'Unexpected alarms, unreliable movement or interrupted measurement routines can stop inspection and hold up production. Haviss provides CMM service for all makes and models of manual and DCC machines. Our approach is to create a trouble-free working atmosphere for CMM users and to maintain and enhance the performance of your coordinate measuring machine.',
    image: '/images/cmm-head.webp', imageAlt: 'Motorised CMM probe head being serviced',
    benefits: ['Service for all makes of manual and DCC CMMs', 'Fault diagnosis before parts are replaced', 'Repair of controllers, drives, amplifiers, scales and probing', 'Preventive maintenance to avoid breakdowns'],
    scope: [
      { title: 'Fault diagnosis', description: 'Review error messages, symptoms and machine history to find the cause, not just the symptom.' },
      { title: 'Preventive service', description: 'Cleaning of air bearings and guideways, air-supply checks, drive and scale inspection, and functional checks.' },
      { title: 'Repair & spare parts', description: 'Repair or replacement of controllers, drives, servo amplifiers, motors, power supplies, scales, encoders and probe cables.' },
      { title: 'Return-to-use checks', description: 'Probe qualification and performance checks — with recalibration where the repair requires it.' },
    ],
    applications: ['Machine alarms or emergency stops', 'Axis not moving, drifting or vibrating', 'Probe or probe-head failure', 'Ageing hardware and worn components'],
    faqs: [
      { question: 'Which CMM brands do you service?', answer: 'Haviss services Mitutoyo, Zeiss, Hexagon, Brown & Sharpe, DEA, Leitz, Sheffield, LK, Wenzel, Coord3, Tesa, Accurate, GMT and other manual and DCC CMMs.' },
      { question: 'What should I share when reporting a fault?', answer: 'The machine make and model, controller and software details, the exact error message, recent changes and clear photographs. Tell us when the fault occurs and whether it is repeatable.' },
      { question: 'Should the CMM be calibrated after a repair?', answer: 'Repairs to scales, bearings, drives or the probing system can affect accuracy. Haviss will recommend whether performance verification or full calibration is needed after the work.' },
    ], enquiryService: 'CMM Repair',
  },
  {
    slug: 'cmm-calibration', number: '04', title: 'CMM Calibration', shortTitle: 'CMM Calibration', keyword: 'CMM Calibration',
    eyebrow: 'ISO 10360-2 PERFORMANCE EVALUATION', headline: 'Calibration you can show your auditor.',
    summary: 'CMM calibration for all makes of manual and DCC CMMs, to ISO 10360-2, with a full certificate, readings and positioning plots.',
    overview: 'Haviss provides a wide range of CMM support and calibration services for all makes and models of manual and DCC CMMs. Performance evaluations are carried out in accordance with ISO 10360-2, including tests of volumetric performance, linear positioning (3 runs), repeatability and squareness. A comprehensive certificate of calibration is provided for every machine, with readings and positioning plots. All standards used in calibration are traceable to national standards.',
    image: '/images/haviss/calibration-check.webp', imageAlt: 'CMM probe measuring a step gauge during calibration',
    benefits: ['Performance evaluation in accordance with ISO 10360-2', 'Volumetric, linear positioning, repeatability and squareness tests', 'Comprehensive calibration certificate with readings and plots', 'Standards traceable to national standards'],
    scope: [
      { title: 'Volumetric performance', description: 'Evaluation of length-measuring performance through the working volume of the machine.' },
      { title: 'Linear positioning — 3 runs', description: 'Positioning accuracy along each axis, measured in three runs and plotted against the specification.' },
      { title: 'Repeatability & squareness', description: 'Probing repeatability and the squareness between machine axes.' },
      { title: 'Certificate & plots', description: 'A comprehensive calibration certificate for every machine, with all readings and positioning plots.' },
    ],
    specs: [
      { label: 'Standard', value: 'ISO 10360-2' },
      { label: 'Linear positioning', value: '3 runs per axis' },
      { label: 'Traceability', value: 'National standards' },
      { label: 'Machines', value: 'All makes · Manual & DCC' },
    ],
    gallery: [
      { src: '/images/haviss/calibration-check.webp', alt: 'CMM touch probe measuring a calibrated step gauge', caption: 'Calibration with a traceable reference standard.' },
      { src: '/images/haviss/calibration-plot.webp', alt: 'CMM positioning plot showing three runs within the specification limits', caption: 'CMM positioning plot — three runs, plotted against the specification limits.' },
    ],
    applications: ['Annual calibration for ISO 9001 / IATF 16949 audits', 'Verification after a repair, retrofit or relocation', 'Investigation of inconsistent inspection results', 'Acceptance of a used CMM'],
    faqs: [
      { question: 'How often should a CMM be calibrated?', answer: 'Most quality systems require CMM calibration at least once a year. Heavily used machines, or machines in a variable environment, may need more frequent verification. Haviss can help you set an interval based on usage and history.' },
      { question: 'What is included in the calibration certificate?', answer: 'Every calibrated machine receives a comprehensive certificate of calibration with the readings and positioning plots. The standards used are traceable to national standards.' },
      { question: 'Is probe qualification the same as machine calibration?', answer: 'No. Probe qualification establishes the stylus parameters used for daily measurement. Machine calibration evaluates the performance of the whole measuring system to ISO 10360-2. Both are needed.' },
    ], enquiryService: 'CMM Calibration',
  },
  {
    slug: 'cmm-amc', number: '05', title: 'CMM Annual Maintenance Contract (AMC)', shortTitle: 'CMM AMC', keyword: 'CMM AMC',
    eyebrow: 'CMM ANNUAL MAINTENANCE CONTRACT', headline: 'One contract. A full year of CMM care.',
    summary: 'Planned preventive maintenance, breakdown support and annual calibration for your CMM under one annual maintenance contract.',
    overview: 'A CMM annual maintenance contract (AMC) gives you a planned, budgeted way to keep your machine accurate and available. Haviss builds each AMC around your equipment, usage and quality requirements — covering preventive maintenance visits, breakdown support, calibration and recommendations for future upgrades.',
    image: '/images/haviss/inspection-cmm-desk.webp', imageAlt: 'CMM granite table, jog box and workstation covered under an annual maintenance contract',
    benefits: ['Scheduled preventive maintenance visits', 'Priority breakdown support', 'Annual calibration can be included', 'Predictable yearly maintenance budget'],
    scope: [
      { title: 'Equipment review', description: 'Record the machine configuration, condition, service history and operating environment at the start of the contract.' },
      { title: 'Preventive maintenance', description: 'Periodic cleaning, inspection and adjustment of bearings, drives, scales, probing and air supply.' },
      { title: 'Breakdown support', description: 'Diagnosis and repair support during the contract period, with the coverage defined in the agreement.' },
      { title: 'Calibration & reports', description: 'Optional annual ISO 10360-2 calibration and a service report with recommendations after each visit.' },
    ],
    applications: ['Production CMMs used every shift', 'Companies preparing for quality audits', 'Planning annual maintenance budgets', 'Ageing machines that need closer attention'],
    faqs: [
      { question: 'What does a CMM AMC include?', answer: 'Each AMC is agreed individually. Typically it covers preventive maintenance visits, breakdown support and optional annual calibration. Visit frequency, parts, consumables and exclusions are listed in the written proposal.' },
      { question: 'Do you offer AMCs for all CMM brands?', answer: 'Yes. Haviss offers AMCs for Mitutoyo, Zeiss, Hexagon, Brown & Sharpe, DEA, Leitz, LK, Wenzel, Coord3, Tesa, Accurate, GMT, Sheffield and other CMMs.' },
      { question: 'Are spare parts included?', answer: 'Parts coverage is agreed explicitly in each contract. Consumables, probes and software licences are normally quoted separately unless included in the agreement.' },
    ], enquiryService: 'CMM AMC',
  },
  {
    slug: 'cmm-relocation', number: '06', title: 'CMM Relocation Services', shortTitle: 'CMM Relocation', keyword: 'CMM Relocation Services',
    eyebrow: 'SAFE CMM SHIFTING & RE-INSTALLATION', headline: 'Move your CMM without losing accuracy.',
    summary: 'Planned CMM relocation — dismantling, securing, packing, shifting, re-installation, levelling and recalibration.',
    overview: 'A coordinate measuring machine is a precision instrument on a heavy granite base. Moving it — within your plant or to a new facility — needs careful preparation. Haviss plans and supervises the complete CMM relocation, from securing the axes and probe system before the move to re-installation, levelling and calibration at the new location.',
    image: '/images/cmm-hero.webp', imageAlt: 'Coordinate measuring machine prepared for relocation',
    benefits: ['Axes, bearings and probe system secured before the move', 'Site and foundation checks at the new location', 'Re-installation, levelling and functional testing', 'Recalibration so the CMM returns to service with confidence'],
    scope: [
      { title: 'Pre-move survey', description: 'Inspect the machine and both sites; check access routes, floor, air supply, power and environment.' },
      { title: 'Dismantling & securing', description: 'Remove the probe head and computer, lock the axes and protect bearings, scales and guideways for transport.' },
      { title: 'Shifting & re-installation', description: 'Supervise lifting and transport, then position, level and reconnect the machine at its new location.' },
      { title: 'Verification & calibration', description: 'Functional checks, error-map review and ISO 10360-2 calibration before the CMM goes back into production.' },
    ],
    applications: ['Moving a CMM to a new plant', 'Shifting within the factory or to a new inspection room', 'Installing a purchased used CMM', 'Re-commissioning a machine after storage'],
    faqs: [
      { question: 'Does a CMM need calibration after relocation?', answer: 'Yes. Transport and re-installation can change the machine geometry. Haviss recommends a performance check and calibration after every relocation, before the CMM is used for production decisions.' },
      { question: 'Can you relocate any CMM brand?', answer: 'Haviss relocates Mitutoyo, Zeiss, Hexagon, Brown & Sharpe, DEA, Leitz, LK, Wenzel, Coord3, Tesa, Accurate, GMT, Sheffield and other bridge-type CMMs.' },
      { question: 'What do you need from us to plan a relocation?', answer: 'The machine make, model and size, photographs, both site addresses, access details (doors, lifts, floor loading) and your preferred schedule.' },
    ], enquiryService: 'CMM Relocation',
  },
  {
    slug: 'cmm-inspection', number: '07', title: 'CMM Subcontract Inspection', shortTitle: 'CMM Inspection', keyword: 'CMM Inspection Service',
    eyebrow: 'CMM INSPECTION CENTRE · CHENNAI', headline: 'First article and contract inspection on our CMM.',
    summary: 'CMM first-article and subcontract inspection of parts, tooling, gauges and fixtures in Chennai, with a certificate and pass/fail analysis.',
    overview: 'Haviss offers a complete line of CMM first-article and contract inspection services, including inspection and certification of production tooling, gauging and fixtures. With a wealth of standards at our disposal, we measure parts and fixtures of many types and complexities. Our DCC coordinate measuring machine is equipped with CMM Manager software and a Renishaw probe head. A certificate of calibration / inspection is provided for every part or fixture, with pass/fail criteria and pass/fail analysis. Inspection attributes and tolerances are permanently stored on our computer.',
    image: '/images/haviss/inspection-cmm.webp', imageAlt: 'Haviss CMM inspection centre — DCC bridge-type CMM in Padi, Chennai',
    benefits: ['First article inspection (FAI) reports', 'Inspection and certification of tooling, gauges and fixtures', 'Capability studies and layout inspection', 'Certificate with pass/fail analysis for every part'],
    scope: [
      { title: 'First article inspection', description: 'Full dimensional and GD&T inspection of first-off parts against the drawing or CAD model.' },
      { title: 'Tooling, gauge & fixture certification', description: 'Inspection and certification of production tooling, checking fixtures and gauges.' },
      { title: 'Capability & layout inspection', description: 'Repeat measurement for capability studies, and layout inspection of all drawing features.' },
      { title: 'Certificates & records', description: 'Inspection certificate with pass/fail criteria and analysis; attributes and tolerances stored for future checks.' },
    ],
    specs: [
      { label: 'Measuring range', value: 'X 700 × Y 1000 × Z 600 mm' },
      { label: 'Accuracy', value: '3 + L/300 µm' },
      { label: 'Software', value: 'CMM Manager' },
      { label: 'Probing', value: 'Renishaw probe head' },
    ],
    gallery: [
      { src: '/images/haviss/inspection-cmm.webp', alt: 'Haviss CMM inspection centre bridge CMM with joystick on the granite table', caption: 'Haviss CMM inspection centre, Padi, Chennai.' },
      { src: '/images/haviss/inspection-cmm-desk.webp', alt: 'CMM granite table, jog box and operator workstation at the Haviss inspection centre', caption: 'DCC CMM with CMM Manager software and Renishaw probing.' },
    ],
    applications: ['First article inspection for new parts', 'Machined component and casting inspection', 'Checking fixture and gauge certification', 'Overflow inspection when your CMM is busy or down'],
    faqs: [
      { question: 'What size parts can you inspect?', answer: 'Our CMM has a measuring range of X 700 mm × Y 1000 mm × Z 600 mm with an accuracy of 3 + L/300 µm. Send the drawing and part size so we can confirm the set-up and fixturing.' },
      { question: 'What do I get with the inspection?', answer: 'A certificate of calibration / inspection for every part or fixture, with pass/fail criteria and pass/fail analysis. Attributes and tolerances are stored, which makes repeat inspections faster.' },
      { question: 'What should accompany an inspection enquiry?', answer: 'The drawing with revision, CAD data where available, quantity, material, the features to be checked and your preferred report format.' },
    ], enquiryService: 'CMM Inspection',
  },
];

/** Extra cards shown alongside the services above (they have their own pages). */
export const serviceExtras = [
  { title: 'CMM Training', summary: 'Complete training for CMM users — fundamentals, probing, alignment, CAD programming, reports and maintenance.', to: '/training', image: '/images/haviss/training-joystick.webp', imageAlt: 'CMM operator using the joystick to measure a part', number: '08' },
  { title: 'Used CMM — Buy & Sell', summary: 'Buy a checked used CMM, or sell your existing coordinate measuring machine through Haviss.', to: '/products/used-cmm', image: '/images/haviss/cmm-bridge-drawing.webp', imageAlt: 'Drawing of a bridge-type coordinate measuring machine', number: '09' },
];

export const brands = [
  { slug: 'mitutoyo', name: 'Mitutoyo', note: 'Crysta and Bright series bridge CMMs, manual and CNC.' },
  { slug: 'zeiss', name: 'Zeiss', note: 'Contura, Accura and older Zeiss bridge CMMs.' },
  { slug: 'hexagon', name: 'Hexagon', note: 'Hexagon Global and other Hexagon bridge CMMs.' },
  { slug: 'brown-and-sharpe', name: 'Brown & Sharpe', note: 'Xcel, MicroXcel, Global and Gage 2000 machines.' },
  { slug: 'dea', name: 'DEA', note: 'DEA Global, Mistral and other DEA bridge CMMs.' },
  { slug: 'leitz', name: 'Leitz', note: 'High-accuracy Leitz PMM and Reference CMMs.' },
  { slug: 'lk', name: 'LK', note: 'LK manual and DCC CMMs, including older LK controllers.' },
  { slug: 'wenzel', name: 'Wenzel', note: 'Wenzel LH and XO series CMMs.' },
  { slug: 'coord3', name: 'Coord3', note: 'Coord3 manual and DCC bridge CMMs.' },
  { slug: 'tesa', name: 'Tesa', note: 'Tesa MicroHite 3D and other Tesa CMMs.' },
  { slug: 'accurate', name: 'Accurate', note: 'Accurate manual and DCC CMMs manufactured in India.' },
  { slug: 'gmt', name: 'GMT', note: 'GMT coordinate measuring machines.' },
  { slug: 'sheffield', name: 'Sheffield', note: 'Sheffield manual and DCC CMMs.' },
];

/** The keyword families from the brief, used to build each brand page. */
export const brandServices = [
  { label: 'CMM Retrofit', summary: 'New controller, scales, probe head, probe, software and computer for manual and DCC CMMs.', to: '/services/cmm-retrofit', text: (b: string) => `Retrofit your ${b} CMM with a new controller, axis scales and reader heads, probe head, probe, metrology software and computer — for manual and DCC machines.` },
  { label: 'CMM Service', summary: 'Breakdown diagnosis, repair and preventive maintenance for all makes.', to: '/services/cmm-service', text: (b: string) => `Breakdown diagnosis, repair and preventive service for ${b} CMMs, including controllers, drives, servo amplifiers, scales and probing.` },
  { label: 'CMM Calibration', summary: 'ISO 10360-2 calibration with a full certificate, readings and positioning plots.', to: '/services/cmm-calibration', text: (b: string) => `${b} CMM calibration in accordance with ISO 10360-2 — volumetric, linear positioning (3 runs), repeatability and squareness — with a full certificate and plots.` },
  { label: 'CMM AMC', summary: 'Annual maintenance contracts with preventive visits, breakdown support and calibration.', to: '/services/cmm-amc', text: (b: string) => `An annual maintenance contract for your ${b} CMM: preventive maintenance visits, breakdown support and optional annual calibration.` },
  { label: 'CMM Software Upgrade', summary: 'CMM Manager and Metrolog XG upgrades with full CAD capability.', to: '/services/cmm-software-upgrade', text: (b: string) => `Upgrade your ${b} CMM to CMM Manager or Metrolog XG for full CAD capability — often retaining the existing controller.` },
  { label: 'CMM Relocation Services', summary: 'Dismantling, shifting, re-installation, levelling and recalibration.', to: '/services/cmm-relocation', text: (b: string) => `Safe dismantling, shifting, re-installation, levelling and recalibration when you move your ${b} CMM.` },
  { label: 'Used CMM — Buy & Sell', summary: 'Buy a checked used CMM, or sell the machine you no longer need.', to: '/products/used-cmm', text: (b: string) => `Looking to buy a used ${b} CMM, or sell one you no longer need? Haviss helps buyers and sellers of used ${b} coordinate measuring machines.` },
];

export const industries = [
  { name: 'Automotive', slug: 'automotive', icon: 'Car', description: 'Inspection of components, sheet-metal panels and body-in-white structures.', applications: ['Body-in-white and sheet-metal panels on modular fixtures', 'Machined housings, bores and brackets', 'Production tooling and checking fixtures'] },
  { name: 'Aerospace', slug: 'aerospace', icon: 'Plane', description: 'Drawing-led measurement for demanding component geometries.', applications: ['Complex machined features', 'Profile and positional evaluation', 'First article inspection reports'] },
  { name: 'Precision Manufacturing', slug: 'precision-manufacturing', icon: 'Cog', description: 'Reliable measurement for precision-machined parts.', applications: ['Dimensional and geometric features', 'First article and layout inspection', 'Capability studies'] },
  { name: 'Tooling & Dies', slug: 'tooling-dies', icon: 'Wrench', description: 'Inspect and certify the tooling and fixtures that shape production quality.', applications: ['Tooling datum relationships', 'Fixture and gauge certification', 'Feature location and alignment'] },
  { name: 'Medical Components', slug: 'medical-components', icon: 'HeartPulse', description: 'Dimensional evaluation of small, precise component features.', applications: ['Small machined features', 'Drawing and datum interpretation', 'Defined dimensional reporting'] },
  { name: 'Engineering Education', slug: 'engineering-education', icon: 'GraduationCap', description: 'Connect metrology theory with practical CMM learning.', applications: ['CMM training for students and new operators', 'Coordinate systems and probing', 'Programming and reporting'] },
];

export const trainingTopics = [
  'What is a CMM', 'Types of CMM', 'CMM parts', 'CMM accuracy', 'Advantages of CMM', 'Operational requirements of CMM',
  'Types of probe', 'Probe assembly', 'Probe calibration', 'Stylus selection', 'Machine coordinate system', 'Part coordinate system',
  'Alignment techniques', 'CAD alignment', 'Measurement features', 'Construction features', 'CMM programme — online / offline',
  'Programming — CAD teach', 'Report generation', 'Graphical programming', 'CMM maintenance',
];

export type Product = {
  id: string; slug: string; name: string; manufacturer: string; model: string; machine_type: string;
  specifications: Record<string, string>; condition: string; availability: string; image_url: string;
  description: string; category: string; published: boolean;
};
// Publish only equipment confirmed by Haviss. Never seed invented inventory.
export const products: Product[] = [];

export const productCategories = [
  { slug: 'used-cmm', title: 'Used CMM — Buy & Sell', subtitle: 'Buy a used CMM. Sell the one you no longer need.', image: '/images/cmm-machine.webp', imageAlt: 'Used bridge coordinate measuring machine', service: 'Used CMM Purchase', description: 'Haviss helps companies buy and sell used coordinate measuring machines — Mitutoyo, Zeiss, Hexagon, Brown & Sharpe, DEA, LK, Wenzel, Coord3, Accurate and more. Machines can be checked, retrofitted, relocated and calibrated before they go into service.' },
  { slug: 'modular-fixtures', title: 'Haviss CMM Fixtures', subtitle: 'Modular CMM clamping fixtures that save time and money.', image: '/images/haviss/fixture-dash-panel.webp', imageAlt: 'Automotive dash panel held on a Haviss modular CMM fixture with stand-offs and clamps', service: 'Modular Fixtures', description: 'The Haviss modular fixturing system is designed for CMMs. Set up any part regardless of size, shape or material — from a small aluminium casting to a large steel automotive stamping — and inspect all dimensions in a single set-up.' },
  { slug: 'accessories', title: 'CMM Accessories & Spare Parts', subtitle: 'Probes, styli, probe heads and CMM spares.', image: '/images/haviss/fixture-kit-components.webp', imageAlt: 'CMM fixture accessories, stand-offs and clamps on a base plate', service: 'CMM Accessories & Spares', description: 'Supply of CMM accessories and spare parts: Renishaw probe heads and probes, M2–M5 styli and extensions, reference spheres, probe cables, scales, encoders, controllers, drives, servo amplifiers, power supplies, motors and granite tables.' },
  { slug: 'consultation', title: 'CMM Selection Consultation', subtitle: 'Retrofit, buy used or buy new? Start with the requirement.', image: '/images/cmm-hero.webp', imageAlt: 'Coordinate measuring machine measuring a part', service: 'Other Enquiry', description: 'Before investing, review the complete requirement: part size and tolerances, working range, software, environment, training and service. Haviss gives independent advice on retrofit, used and new CMM options.' },
];

export const fixtureAdvantages = ['Easy to use', 'Saves time and money', 'Unlimited number of set-ups', 'Inspect all dimensions in a single set-up', 'Reduced set-up time', 'Repeatability'];
export const fixtureFeatures = [
  { title: 'Inspection made easy', description: 'Haviss base plates and components make it easy to set a part for measurement. Components are in metric sizes and adapt to all applications, from a small aluminium casting to a large steel automotive stamping. Most parts can be set up within minutes, as all components work together and hand-thread into the fixture plate. Multiple parts can be fixtured on the plate at once, increasing CMM productivity.' },
  { title: 'Repeatability', description: 'The plate is marked alpha-numerically, making it easy to document the original set-up and repeat it exactly. This is especially useful when a part is checked daily or periodically, and when there are multiple CMM users.' },
  { title: 'Complete access', description: 'Unlike traditional fixturing, Haviss fixturing gives a clear probe path to the entire part, resulting in more precise measurement.' },
  { title: 'Haviss CMM plates', description: 'Base plates are available in standard and custom sizes, all precision ground to tight tolerances. Cast aluminium base plates are also available. Steel plates are anodised to resist scratching and wear longer.' },
];
export const fixtureBasePlates = [
  { part: 'SBP20020015', size: '250 × 250 × 15' },
  { part: 'SBP30030015', size: '350 × 350 × 15' },
  { part: 'SBP40040020', size: '450 × 450 × 20' },
  { part: 'SBP60060020', size: '650 × 650 × 20' },
];
export const fixtureKit = [
  { qty: 3, part: 'SP-15-25', description: 'Stand-off — D15 × H25' },
  { qty: 3, part: 'SP-15-50', description: 'Stand-off — D15 × H50' },
  { qty: 3, part: 'SP-15-100', description: 'Stand-off — D15 × H100' },
  { qty: 3, part: 'SP-20-25', description: 'Stand-off — D20 × H25' },
  { qty: 3, part: 'SP-20-50', description: 'Stand-off — D20 × H50' },
  { qty: 3, part: 'SPP-15-25', description: 'Stand-off with pin — D15 × H25' },
  { qty: 3, part: 'SPP-20-25', description: 'Stand-off with pin — D20 × H25' },
  { qty: 1, part: 'APJ-20', description: 'Adjustable pivot joint' },
  { qty: 3, part: 'WTC-100-60', description: 'Wire tension clamp' },
  { qty: 5, part: 'TCL-100-80', description: 'Tension clamp (long)' },
  { qty: 4, part: 'SC-15-15', description: 'Steel cone — D15 × H15' },
  { qty: 3, part: 'SSJ-30-60', description: 'Screw jack — D30 × H60' },
  { qty: 3, part: 'SAS-10-70', description: 'Adjustable slide' },
  { qty: 4, part: 'SVP-25', description: 'V stand-off — D25' },
  { qty: 1, part: 'ASL-15', description: 'Adjustable side lock' },
  { qty: 12, part: 'SACC-12', description: 'Stand-off accessories' },
];
export const fixtureGallery: Figure[] = [
  { src: '/images/haviss/fixture-dash-panel.webp', alt: 'Automotive dash panel held on a Haviss mobile CMM fixture table with perforated stand-offs', caption: 'Dash panel on a Haviss mobile fixture table.' },
  { src: '/images/haviss/fixture-body-side.webp', alt: 'Automotive body-side panel clamped upright on a Haviss modular CMM fixture', caption: 'Body-side panel held upright for complete probe access.' },
  { src: '/images/haviss/fixture-front-structure-setup.webp', alt: 'Engineer setting up a black automotive front structure on a Haviss modular fixture plate', caption: 'Front structure being set up on a Haviss fixture plate.' },
  { src: '/images/haviss/fixture-front-structure.webp', alt: 'Black automotive front structure supported by stand-offs on a Haviss fixture table', caption: 'Large sheet-metal assembly supported by Haviss stand-offs.' },
  { src: '/images/haviss/fixture-dash-kit.webp', alt: 'Dash panel on a Haviss fixture with the blue modular clamping kit tray in front', caption: 'Fixture table with the Haviss clamping kit.' },
  { src: '/images/haviss/fixture-body-side-2.webp', alt: 'Haviss modular fixture holding a body-side ring for CMM inspection', caption: 'Body-side ring on a mobile Haviss fixture.' },
  { src: '/images/haviss/fixture-dash-panel-2.webp', alt: 'Grey dash panel supported on tall Haviss stand-offs and aluminium columns', caption: 'Tall stand-offs and columns for large panels.' },
  { src: '/images/haviss/fixture-kit-components.webp', alt: 'Haviss fixture components: stand-offs, cones, clamps and accessories on a base plate', caption: 'Stand-offs, cones, clamps and accessories.' },
];

export const accessoryGroups = [
  { title: 'Renishaw probe heads', items: ['Renishaw PH10M probe head', 'Renishaw PH10T probe head', 'Renishaw PH10MQ probe head', 'Renishaw MH8 probe head', 'Renishaw MH20i probe head', 'Renishaw MIH probe head'] },
  { title: 'Renishaw probes', items: ['Renishaw TP2 probe', 'Renishaw TP20 probe', 'Renishaw TP200 probe', 'Renishaw SP25 scanning probe', 'Renishaw SP600 scanning probe', 'Renishaw SP80 scanning probe'] },
  { title: 'CMM styli & extensions', items: ['M2 CMM stylus', 'M3 CMM stylus', 'M4 CMM stylus', 'M5 CMM stylus', 'CMM stylus extension', 'CMM probe extension', 'CMM reference sphere'] },
  { title: 'CMM spare parts', items: ['Renishaw RGH22 scale', 'CMM encoder', 'CMM controller', 'CMM drive', 'CMM servo power amplifier', 'CMM power supply unit / SMPS', 'CMM motor', 'CMM probe cable', 'CMM granite table', 'CMM software'] },
];

export type Resource = { slug: string; title: string; category: string; summary: string; readTime: string; sections: { heading: string; body: string[]; list?: string[] }[] };
export const resources: Resource[] = [
  {
    slug: 'planning-a-cmm-retrofit', title: 'Is your CMM ready for a retrofit?', category: 'EQUIPMENT CARE', readTime: '4 min read',
    summary: 'A practical checklist for reviewing an existing machine before you decide to modernise it.',
    sections: [
      { heading: 'Start with the problem you need to solve', body: ['An upgrade is easier to evaluate when the operational problem is clear. Is the controller difficult to support? Does the software limit a new inspection task? Are operators working around an unreliable interface? Record these issues separately from the features you would like to add.'] },
      { heading: 'Document the existing configuration', body: ['The machine name alone is not enough to establish compatibility. A useful starting record describes the complete measuring system.'], list: ['Manufacturer, model and machine identification', 'Controller, scales and machine interface', 'Probe head, probes and stylus arrangements', 'Software name, version and licensing details', 'Service history and recent calibration records'] },
      { heading: 'Consider the whole transition', body: ['Replacing a component can affect software interfaces, programming and operator practices. Identify the routines you need to retain and plan how they will be checked after the change.', 'Your proposal should also address installation, training, documentation and the calibration needed before the upgraded machine returns to production.'] },
      { heading: 'Compare a defined scope', body: ['A useful retrofit proposal connects the intended changes with your inspection requirements. Compare the scope and assumptions — controller, scales, probing, software, computer, training and calibration — rather than treating every retrofit as equivalent.'] },
    ],
  },
  {
    slug: 'prepare-an-inspection-enquiry', title: 'What to include in an inspection enquiry', category: 'INSPECTION GUIDE', readTime: '3 min read',
    summary: 'Help the inspection team review your part, drawing and reporting requirements with less back-and-forth.',
    sections: [
      { heading: 'Provide the current drawing', body: ['Send a legible, controlled drawing with the revision clearly identified. Include units, datum references and the dimensions or geometric tolerances you need evaluated. If only selected features are in scope, mark them clearly.'] },
      { heading: 'Describe the part and the task', body: ['The inspection team needs to establish whether the part can be held, accessed and measured appropriately. Share the following where available.'], list: ['Part dimensions, approximate weight and material', 'Quantity and part identification', 'CAD data, where relevant to the inspection approach', 'Surface or handling restrictions', 'The reason for inspection and required features'] },
      { heading: 'Agree the reporting requirement', body: ['Explain whether you need a dimensional report, a first article format or a comparison with particular drawing limits. Haviss provides an inspection certificate with pass/fail criteria and analysis for every part.'] },
      { heading: 'Discuss your Chennai requirement', body: ['The Haviss CMM inspection centre in Padi, Chennai has a measuring range of X 700 × Y 1000 × Z 600 mm. Contact the team with your drawing to discuss the inspection scope and delivery of parts.'] },
    ],
  },
  {
    slug: 'choosing-a-used-cmm', title: 'Beyond the working range: choosing a used CMM', category: 'BUYING GUIDE', readTime: '4 min read',
    summary: 'The questions that connect a machine purchase with the work your inspection team needs to do.',
    sections: [
      { heading: 'Define the inspection task first', body: ['A machine must accommodate more than the overall size of a part. Feature access, probe configurations, fixturing and the measurement strategy also matter. Build a short requirements list from representative components and drawings.'] },
      { heading: 'Review the complete equipment package', body: ['Ask for the actual machine configuration and condition. Confirm which items are included and which must be sourced separately.'], list: ['Machine manufacturer, model and measuring range', 'Controller, probing system and accessories', 'Software, licences and computer', 'Service and calibration records', 'Relocation, installation and training scope'] },
      { heading: 'Plan the installation environment', body: ['A CMM needs a suitable operating environment. Review floor space, foundation, access, compressed air, power and temperature before the purchase is finalised.'] },
      { heading: 'Think beyond the initial purchase', body: ['Consider the availability of service, spare parts and operator training. An older machine with a sound structure can often be retrofitted with a new controller and software to give many more years of service.'] },
    ],
  },
];

/** Chennai local landing page. Areas are the industrial belts around the Haviss office and works. */
export const chennai = {
  areas: ['Ambattur', 'Padi', 'Guindy', 'Manali', 'Ennore', 'Avadi', 'Thirumudivakkam', 'Sriperumbudur', 'Oragadam', 'Irungattukottai', 'Maraimalai Nagar', 'Mahindra World City', 'Gummidipoondi', 'Thiruvallur'],
  faqs: [
    { question: 'Where can I get CMM service and calibration in Chennai?', answer: 'Haviss 3D Metrology Solutions provides CMM retrofit, service, ISO 10360-2 calibration, AMC, software upgrades, relocation and training in Chennai. Our registered office is in Manali New Town and our works and CMM inspection centre are in Padi, Chennai. Call +91 99624 74959.' },
    { question: 'Do you provide on-site CMM service in Chennai?', answer: 'Yes. CMM service, calibration, AMC visits, retrofits and relocation are carried out at your premises. Share your location, machine make and model so we can plan the visit.' },
    { question: 'Is there a CMM inspection centre in Chennai for subcontract inspection?', answer: 'Yes. Haviss runs a CMM inspection centre in Padi, Chennai with a DCC CMM (X 700 × Y 1000 × Z 600 mm, accuracy 3 + L/300 µm), CMM Manager software and a Renishaw probe head, for first article and contract inspection.' },
    { question: 'Do you support customers outside Chennai?', answer: 'Yes. Haviss supports CMM users across Tamil Nadu and other parts of India. Contact us with your location and requirement.' },
  ],
};

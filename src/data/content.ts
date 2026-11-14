export const company = {
  name: 'HAVISS 3D METROLOGY SOLUTIONS',
  shortName: 'Haviss',
  founded: 2014,
  leader: 'H. Sathish Kumar',
  phone: '+91 99624 74959',
  phoneHref: 'tel:+919962474959',
  // Leave unset until the business confirms its new enquiry address.
  email: import.meta.env.VITE_CONTACT_EMAIL || '',
  location: 'Chennai, Tamil Nadu, India',
  registeredOffice: '#1A, 1st Floor, IJ Puram, Manali New Town, Ponneri High Road, Chennai, Tamil Nadu 600103, India.',
  works: 'No. 144, Kamarajar Street, TMP Nagar, Padi, Chennai, Tamil Nadu 600050, India.',
  domain: '',
  mapsOffice: 'https://www.google.com/maps/search/?api=1&query=IJ+Puram+Manali+New+Town+Chennai+600103',
  mapsWorks: 'https://www.google.com/maps/search/?api=1&query=No+144+Kamarajar+Street+TMP+Nagar+Padi+Chennai+600050',
};

export type Service = {
  slug: string; number: string; title: string; shortTitle: string; eyebrow: string;
  headline: string; summary: string; overview: string; image: string; imageAlt: string;
  benefits: string[]; scope: { title: string; description: string }[];
  applications: string[]; faqs: { question: string; answer: string }[]; enquiryService: string;
};

export const services: Service[] = [
  {
    slug: 'cmm-retrofit', number: '01', title: 'CMM Retrofit & Modernization', shortTitle: 'Retrofit & Modernization',
    eyebrow: 'EXTEND THE VALUE OF YOUR CMM', headline: 'A new chapter for your existing CMM.',
    summary: 'Modernize compatible controls, probing systems and software around the machine you already own.',
    overview: 'A sound mechanical structure can remain useful long after its electronics or software become difficult to support. Haviss assesses your existing CMM and your inspection requirements to recommend a practical modernization path. The objective is to retain useful equipment while addressing the limitations that matter to your operation.',
    image: '/images/cmm-machine.webp', imageAlt: 'Coordinate measuring machine with a bridge structure and precision probing system',
    benefits: ['Make better use of a serviceable machine structure', 'Introduce compatible measurement and programming workflows', 'Address ageing controls and difficult-to-support components', 'Plan modernization around your actual inspection needs'],
    scope: [
      { title: 'Machine assessment', description: 'Review mechanical condition, existing controls, scales and probing arrangements before defining a retrofit scope.' },
      { title: 'Controllers & interfaces', description: 'Assess compatible controller and machine-control interface options, including the implications for machine operation.' },
      { title: 'Scale & probing systems', description: 'Evaluate scale systems, probe heads, probes and styli against the machine and measurement requirements.' },
      { title: 'Software & handover', description: 'Review compatible measurement software, existing programmes, operator familiarization and post-upgrade verification needs.' },
    ],
    applications: ['Obsolete or unsupported electronics', 'A change in inspection or reporting requirements', 'Improved CAD-based measurement workflows', 'Reconditioning a serviceable used CMM'],
    faqs: [
      { question: 'Can any CMM be retrofitted?', answer: 'A retrofit depends on the machine’s structure, condition, scales, controller and available interfaces. Share the manufacturer, model, controller details and photographs so that Haviss can assess suitability.' },
      { question: 'Will my existing inspection programmes work?', answer: 'Programme reuse depends on the original and proposed software, measurement strategy and machine configuration. Any conversion or revalidation requirements should be agreed before work begins.' },
      { question: 'Does a retrofit guarantee a particular accuracy?', answer: 'No universal accuracy claim can be made. Achievable performance depends on the machine, its environment and the agreed scope. Discuss the required verification and acceptance criteria with Haviss.' },
    ], enquiryService: 'CMM Retrofit',
  },
  {
    slug: 'cmm-calibration', number: '02', title: 'CMM Calibration', shortTitle: 'Calibration',
    eyebrow: 'CONFIDENCE STARTS WITH VERIFICATION', headline: 'Understand the performance behind every result.',
    summary: 'Assess machine performance and support measurement confidence through planned calibration and verification.',
    overview: 'A measurement result is only useful when you understand the performance of the system behind it. Haviss provides CMM calibration support to assess machine behaviour, identify changes in performance and inform maintenance decisions. The appropriate method, scope and documentation are agreed against your machine and quality requirements.',
    image: '/images/cmm-probe.webp', imageAlt: 'CMM measuring probe positioned above a precision component',
    benefits: ['Establish a documented view of machine performance', 'Identify variation that may require investigation', 'Support repeatable inspection practices', 'Make informed decisions about servicing and verification'],
    scope: [
      { title: 'Requirement review', description: 'Discuss the machine configuration, quality-system requirements, operating conditions and requested calibration scope.' },
      { title: 'Performance evaluation', description: 'Plan suitable checks of measurement behaviour and repeatability, with the method confirmed for the application.' },
      { title: 'Findings & documentation', description: 'Agree the required records and discuss the results, limitations and any recommended corrective action.' },
      { title: 'Ongoing care', description: 'Consider usage, the working environment, previous results and your quality procedures when planning subsequent checks.' },
    ],
    applications: ['Periodic machine performance checks', 'Verification after a repair or relocation', 'Investigation of inconsistent inspection results', 'Review of a used or modernized machine'],
    faqs: [
      { question: 'How often should a CMM be calibrated?', answer: 'The interval depends on usage, environment, performance history and your quality requirements. Review these factors with your quality team and Haviss rather than applying one interval to every machine.' },
      { question: 'Is probe qualification the same as machine calibration?', answer: 'No. Probe qualification establishes the parameters of the stylus configuration used for measurement. Machine calibration or performance verification evaluates the wider measuring system. Both have different roles in a measurement workflow.' },
      { question: 'Can you meet our specific quality-system requirements?', answer: 'Send your required method, acceptance criteria and documentation needs for review. Accreditation, traceability requirements and the applicable standard must be confirmed directly; this website does not claim ISO/IEC 17025 accreditation.' },
    ], enquiryService: 'CMM Calibration',
  },
  {
    slug: 'cmm-repair-maintenance', number: '03', title: 'CMM Repair & Maintenance', shortTitle: 'Repair & Maintenance',
    eyebrow: 'PRACTICAL SUPPORT FOR YOUR EQUIPMENT', headline: 'Find the problem. Plan the right repair.',
    summary: 'Troubleshooting, servicing and reconditioning focused on your machine’s condition and operating needs.',
    overview: 'Unexpected errors, unreliable movement or interrupted measurement routines can disrupt inspection. Haviss supports CMM users with fault investigation, maintenance and repair planning. A considered diagnosis helps distinguish the symptom from its cause and establishes which components or operating conditions need attention.',
    image: '/images/cmm-machine.webp', imageAlt: 'Bridge-type coordinate measuring machine in a measurement environment',
    benefits: ['Investigate faults before committing to replacement parts', 'Plan maintenance around machine condition', 'Address deterioration in day-to-day usability', 'Connect repair decisions with longer-term equipment care'],
    scope: [
      { title: 'Diagnostics', description: 'Review fault messages, operating symptoms, machine history and the sequence of events leading to the issue.' },
      { title: 'Servicing', description: 'Assess the appropriate cleaning, inspection and maintenance tasks for the machine configuration.' },
      { title: 'Repair & reconditioning', description: 'Recommend repair or reconditioning options where suitable, subject to component availability and machine compatibility.' },
      { title: 'Return-to-use checks', description: 'Agree the functional checks and any calibration or programme verification needed before returning the equipment to production.' },
    ],
    applications: ['Machine alarms or interrupted operation', 'Ageing hardware and worn components', 'Preventive servicing', 'Assessment before a retrofit or relocation'],
    faqs: [
      { question: 'What should I share when reporting a fault?', answer: 'Include the machine manufacturer and model, controller and software details, exact error messages, recent changes and clear photographs. Describe when the fault occurs and whether it is repeatable.' },
      { question: 'Can you confirm a repair time immediately?', answer: 'The repair plan depends on diagnosis, access and parts availability. Haviss will discuss the scope and schedule after reviewing the problem; no fixed response or repair time is advertised here.' },
      { question: 'Should the machine be calibrated after repair?', answer: 'Some repairs can affect measurement performance. The need for calibration or verification depends on the work undertaken and your quality requirements and should be agreed as part of the repair scope.' },
    ], enquiryService: 'CMM Repair',
  },
  {
    slug: 'cmm-software-upgrade', number: '04', title: 'CMM Software Upgrades', shortTitle: 'Software Upgrades',
    eyebrow: 'A CLEARER MEASUREMENT WORKFLOW', headline: 'Bring your inspection workflow up to date.',
    summary: 'Review compatible software options for CAD-based measurement, programming and inspection reporting.',
    overview: 'Measurement software connects your drawing, machine and inspection report. Haviss helps assess software upgrade options against your CMM hardware and the work you need to perform. A successful upgrade considers more than installation: existing programmes, CAD data, licensing and operator familiarity all influence the transition.',
    image: '/images/cmm-head.webp', imageAlt: 'Articulating CMM probe head and probing assembly',
    benefits: ['Review opportunities for CAD-based inspection', 'Improve the usability of day-to-day measurement tasks', 'Align reporting with your inspection requirements', 'Plan programme transition and operator familiarization'],
    scope: [
      { title: 'Compatibility assessment', description: 'Review controller interfaces, probing hardware, the operating system and the intended software configuration.' },
      { title: 'Workflow planning', description: 'Discuss alignment, measurement features, CAD handling and reporting requirements before selecting an upgrade path.' },
      { title: 'Programme transition', description: 'Identify existing routines that need conversion, recreation or validation after the change.' },
      { title: 'Operator support', description: 'Define the training and familiarization needed for the revised measurement workflow.' },
    ],
    applications: ['Ageing or unsupported software installations', 'New CAD-based inspection requirements', 'Changes in reporting needs', 'Software work as part of a wider retrofit'],
    faqs: [
      { question: 'Can software be upgraded without changing the controller?', answer: 'In some configurations this may be possible, but it depends on available interfaces and supported hardware. Haviss will review your current setup before recommending a software-only or combined upgrade.' },
      { question: 'Will an upgrade change how my parts are measured?', answer: 'A new workflow may change programming, alignment or reporting steps. Existing routines should be reviewed and relevant results verified before they are used for production decisions.' },
      { question: 'What licensing information is needed?', answer: 'Share the current software name, version and licensing arrangement. New licence requirements and any transferable entitlements must be checked for the proposed solution.' },
    ], enquiryService: 'CMM Software Upgrade',
  },
  {
    slug: 'cmm-inspection', number: '05', title: 'CMM Inspection Services', shortTitle: 'Inspection Services',
    eyebrow: 'PARTS INSPECTION IN CHENNAI', headline: 'Turn dimensional requirements into useful results.',
    summary: 'Dimensional inspection for components, tooling, gauges and fixtures, with requirements reviewed before measurement.',
    overview: 'Haviss’s existing website lists parts inspection services as available in Chennai. Share your drawing, datum scheme, CAD data where applicable and the features you need checked. The team can then review part suitability, access, fixturing and reporting requirements before confirming an inspection scope.',
    image: '/images/cmm-probe.webp', imageAlt: 'Coordinate measurement of a machined metal component',
    benefits: ['Access inspection support for a defined requirement', 'Bring drawings, datums and reports into one discussion', 'Review difficult-to-measure features before committing', 'Support product and tooling evaluation with dimensional information'],
    scope: [
      { title: 'Dimensional & first article inspection', description: 'Review the requested dimensions and features for part measurement or a first article inspection requirement.' },
      { title: 'GD&T evaluation', description: 'Discuss drawing interpretation, datum establishment, feature access and the evaluation strategy.' },
      { title: 'Tooling, gauges & fixtures', description: 'Assess inspection needs for production tooling, gauges and fixtures with reference to supplied requirements.' },
      { title: 'Inspection reporting', description: 'Agree report content, identification, units and any requested comparison with drawing limits.' },
    ],
    applications: ['First article dimensional checks', 'Machined component inspection', 'Tooling and fixture evaluation', 'Investigation of a dimensional concern'],
    faqs: [
      { question: 'Where is inspection available?', answer: 'The company’s existing website lists parts inspection services in Chennai. Contact Haviss to discuss part delivery, the inspection location and the scope required.' },
      { question: 'Can you measure my component?', answer: 'Suitability depends on size, weight, geometry, accessibility, tolerances and the required measurement strategy. Send a drawing and relevant CAD data for review; no universal measurement capability is implied.' },
      { question: 'What should accompany a first article enquiry?', answer: 'Provide a controlled drawing revision, part identification, required features, datum references, quantity and preferred report format. Identify any customer-specific acceptance or documentation requirements.' },
    ], enquiryService: 'CMM Inspection',
  },
  {
    slug: 'cmm-amc', number: '06', title: 'CMM Annual Maintenance Contracts', shortTitle: 'Annual Maintenance',
    eyebrow: 'PLAN FOR THE LONGER TERM', headline: 'A considered approach to ongoing CMM care.',
    summary: 'Plan preventive maintenance and periodic support around your equipment, usage and service requirements.',
    overview: 'An annual maintenance arrangement provides a structured way to discuss the care your CMM needs. Haviss develops maintenance proposals around the equipment and customer requirements. Visit frequency, preventive tasks, breakdown support, parts and calibration should be defined clearly in the agreed contract.',
    image: '/images/cmm-machine.webp', imageAlt: 'Coordinate measuring machine for planned service and maintenance',
    benefits: ['Create a more deliberate maintenance plan', 'Keep service history and recurring concerns in view', 'Discuss equipment needs before problems accumulate', 'Define responsibilities and coverage clearly'],
    scope: [
      { title: 'Equipment review', description: 'Record the machine configuration, condition, service history and operating environment.' },
      { title: 'Preventive care plan', description: 'Agree suitable periodic inspection and maintenance activities for the machine and its use.' },
      { title: 'Support arrangements', description: 'Specify the support process, site access requirements, exclusions and any separately chargeable work.' },
      { title: 'Review & recommendations', description: 'Use service findings to discuss future repairs, verification requirements or modernization options.' },
    ],
    applications: ['Regularly used inspection equipment', 'Planning annual maintenance expenditure', 'Organizing preventive service visits', 'Maintaining visibility of ageing equipment'],
    faqs: [
      { question: 'What does an AMC include?', answer: 'Coverage is specific to the agreement. Confirm preventive tasks, visit frequency, breakdown support, parts, consumables, calibration and exclusions in the written proposal.' },
      { question: 'Are replacement parts automatically covered?', answer: 'Parts coverage must be agreed explicitly. Do not assume that all parts, probes, consumables or software licences are included in a maintenance contract.' },
      { question: 'Is a response time guaranteed?', answer: 'This website does not promise a response time. Discuss your location and operational needs with Haviss and review the service arrangements in the proposed agreement.' },
    ], enquiryService: 'CMM AMC',
  },
];

export const industries = [
  { name: 'Automotive', slug: 'automotive', icon: 'Car', description: 'Dimensional confidence for components that have to work together.', applications: ['Machined housings and bores', 'Datum-based component inspection', 'Production tooling and fixtures'] },
  { name: 'Aerospace', slug: 'aerospace', icon: 'Plane', description: 'Drawing-led measurement planning for demanding component geometries.', applications: ['Complex machined features', 'Profile and positional evaluation', 'Inspection report requirements'] },
  { name: 'Precision Manufacturing', slug: 'precision-manufacturing', icon: 'Cog', description: 'Useful measurement information for precision-machined parts.', applications: ['Dimensional and geometric features', 'First article inspection', 'Machine and process investigations'] },
  { name: 'Tooling & Dies', slug: 'tooling-dies', icon: 'Wrench', description: 'Evaluate the tooling and fixtures that shape production quality.', applications: ['Tooling datum relationships', 'Fixture and gauge inspection', 'Feature location and alignment'] },
  { name: 'Medical Components', slug: 'medical-components', icon: 'HeartPulse', description: 'Dimensional evaluation of component features against supplied requirements.', applications: ['Small machined features', 'Drawing and datum interpretation', 'Defined dimensional reporting'] },
  { name: 'Engineering Education', slug: 'engineering-education', icon: 'GraduationCap', description: 'Connect metrology theory with practical CMM learning.', applications: ['CMM equipment selection', 'Operator fundamentals', 'Coordinate systems and reporting'] },
];

export const trainingTopics = [
  'CMM fundamentals & machine types', 'Machine and part coordinate systems', 'Probe heads & stylus selection',
  'Probe assembly & qualification', 'Part alignment techniques', 'CAD alignment & measurement planning',
  'Measurement & construction features', 'Online and offline programming concepts', 'GD&T fundamentals & drawing interpretation',
  'Dimensional inspection', 'Inspection & graphical reports', 'CMM maintenance, fixturing & best practices',
];

export type Product = {
  id: string; slug: string; name: string; manufacturer: string; model: string; machine_type: string;
  specifications: Record<string, string>; condition: string; availability: string; image_url: string;
  description: string; category: string; published: boolean;
};
// Publish only equipment confirmed by Haviss. Never seed invented inventory.
export const products: Product[] = [];

export const productCategories = [
  { slug: 'used-cmm', title: 'Used CMM Machines', subtitle: 'A considered investment in measurement.', image: '/images/cmm-machine.webp', imageAlt: 'Bridge coordinate measuring machine', service: 'Used CMM Purchase', description: 'Discuss your component sizes, inspection tasks, software needs and installation environment. Haviss can help you assess a suitable used coordinate measuring machine against your requirements.' },
  { slug: 'modular-fixtures', title: 'Modular CMM Fixtures', subtitle: 'A stable foundation for useful results.', image: '/images/cmm-fixtures.svg', imageAlt: 'Illustrative modular fixturing concept; not an available product or specification', service: 'Modular Fixtures', description: 'Build a practical approach to part positioning. Modular fixturing can support repeatable setups while preserving access to the features that need measurement.' },
  { slug: 'accessories', title: 'CMM Accessories', subtitle: 'The details that support your workflow.', image: '/images/cmm-probe.webp', imageAlt: 'CMM probing system and measurement stylus', service: 'Other Enquiry', description: 'Discuss probes, styli, probe heads and other accessories in the context of your existing equipment. Selection depends on compatibility, feature access and the measurement task.' },
  { slug: 'consultation', title: 'Equipment Consultation', subtitle: 'Start with the requirement. Select with confidence.', image: '/images/cmm-hero.webp', imageAlt: 'Illustrative coordinate measuring equipment', service: 'Other Enquiry', description: 'Before buying a new or used machine, review the complete requirement: component geometry, working range, software, environment, training and ongoing support.' },
];

export type Resource = { slug: string; title: string; category: string; summary: string; readTime: string; sections: { heading: string; body: string[]; list?: string[] }[] };
export const resources: Resource[] = [
  {
    slug: 'planning-a-cmm-retrofit', title: 'Is your CMM ready for a retrofit?', category: 'EQUIPMENT CARE', readTime: '4 min read',
    summary: 'A practical checklist for reviewing an existing machine before you decide to modernize it.',
    sections: [
      { heading: 'Start with the problem you need to solve', body: ['An upgrade is easier to evaluate when the operational problem is clear. Is the controller difficult to support? Does the software limit a new inspection task? Are operators spending time working around an unreliable interface? Record these issues separately from the features you would like to add.'] },
      { heading: 'Document the existing configuration', body: ['The machine name alone is not enough to establish compatibility. A useful starting record describes the complete measuring system.'], list: ['Manufacturer, model and machine identification', 'Controller, scales and machine interface', 'Probe head, probes and stylus arrangements', 'Software name, version and licensing details', 'Service history and recent performance records'] },
      { heading: 'Consider the whole transition', body: ['Replacing a component can affect software interfaces, programming and operator practices. Identify the routines you need to retain and discuss how they will be checked after the change.', 'Your proposal should also address installation conditions, familiarization, documentation and the verification needed before the upgraded machine returns to production.'] },
      { heading: 'Compare a defined scope', body: ['A useful retrofit proposal connects the intended changes with your inspection requirements. Compare the scope and assumptions, including exclusions, rather than treating every retrofit as equivalent. Actual compatibility and achievable machine performance require assessment.'] },
    ],
  },
  {
    slug: 'prepare-an-inspection-enquiry', title: 'What to include in an inspection enquiry', category: 'INSPECTION GUIDE', readTime: '3 min read',
    summary: 'Help the inspection team review your part, drawing and reporting requirements with less back-and-forth.',
    sections: [
      { heading: 'Provide the current drawing', body: ['Send a legible, controlled drawing with the revision clearly identified. Include units, datum references and the dimensions or geometric tolerances you need evaluated. If only selected features are in scope, mark those features clearly.'] },
      { heading: 'Describe the part and the task', body: ['The inspection team needs to establish whether the part can be held, accessed and measured appropriately. Share the following information where available.'], list: ['Part dimensions, approximate weight and material', 'Quantity and part identification', 'CAD data, where relevant to the inspection approach', 'Surface or handling restrictions', 'The reason for inspection and required features'] },
      { heading: 'Agree the reporting requirement', body: ['Explain whether you need a dimensional report, a defined first article format or a comparison with particular drawing limits. Identify any customer-specific documentation requirements before work begins.', 'Use the enquiry to clarify measurement scope, part delivery arrangements and the information needed to confirm suitability. Avoid treating a quotation request as confirmation that every feature or tolerance can be measured.'] },
      { heading: 'Discuss your Chennai requirement', body: ['Haviss lists parts inspection services in Chennai. Contact the team with your drawing and requirement to discuss the proposed inspection scope and arrangements.'] },
    ],
  },
  {
    slug: 'choosing-a-used-cmm', title: 'Beyond the working range: choosing a used CMM', category: 'BUYING GUIDE', readTime: '4 min read',
    summary: 'The questions that help connect a machine purchase with the work your inspection team needs to do.',
    sections: [
      { heading: 'Define the inspection task first', body: ['A machine must accommodate more than the overall size of a part. Feature access, probe configurations, fixturing and the intended measurement strategy also matter. Build a short requirements list from representative components and drawings.'] },
      { heading: 'Review the complete equipment package', body: ['Ask for the actual machine configuration and condition. Confirm which items are included and which will need to be sourced separately.'], list: ['Machine manufacturer, model and measuring range', 'Controller, probing system and accessory details', 'Software, licences and supported operating environment', 'Service and performance documentation', 'Delivery, installation and training scope'] },
      { heading: 'Plan the installation environment', body: ['A useful machine needs a suitable operating environment. Discuss floor space, access, utilities and environmental requirements for the specific equipment under consideration. These should be reviewed before the purchase is finalized.'] },
      { heading: 'Think beyond the initial purchase', body: ['Consider the availability of service, replacement components and operator training. A clear understanding of ongoing support can be as useful as a machine specification.', 'Current stock, condition, included equipment and commercial terms must be confirmed for each individual machine. Haviss can discuss your requirements without implying that any particular model is presently available.'] },
    ],
  },
];

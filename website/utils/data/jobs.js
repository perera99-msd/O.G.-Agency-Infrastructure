// lib/data/jobs.js
// Pre-defined contract — mirrors the backend schema exactly.
// To switch to real API: replace this file's export with a fetch() call.

export const COUNTRIES = ["Bosnia", "Cyprus", "Germany", "Israel", "Jordan", "Kuwait", "Malaysia", "Oman", "Qatar", "Romania", "Russia", "Saudi Arabia", "UAE"];
export const CATEGORIES = ["Construction", "Garment", "Healthcare", "Hospitality", "Manufacturing", "Engineering", "Retail", "Admin", "Accounts", "Other"];
export const GENDER_OPTIONS = ["Male", "Female"];

export const jobs = [
  {
    id: "job-001",
    title: "Juki Machine Operator",
    slug: "juki-machine-operator",
    category: "Garment",
    tags: [
      "URGENT",
      "GARMENT"
    ],
    country: "Bosnia",
    salary: {
      min: 120000,
      max: 150000,
      currency: "USD"
    },
    deadline: "2026-11-25",
    postedAt: "2026-04-05",
    isUrgent: true,
    genderPreference: "No Preference",
    ageRange: {
      min: 25,
      max: 45
    },
    description: "We are seeking experienced Juki Machine Operators to join a leading garment manufacturing facility in Qatar. You will operate industrial sewing machines to produce high-quality garments, meeting daily production targets while maintaining quality standards.",
    requirements: [
      "Minimum 2 years of experience with industrial sewing machines",
      "Ability to work in a fast-paced production environment",
      "Basic understanding of garment construction and quality standards",
      "Willingness to work in shifts"
    ],
    benefits: [
      {
        title: "Comprehensive Health",
        description: "Full medical, dental, and vision coverage for you and dependents."
      },
      {
        title: "Unlimited PTO",
        description: "Take the time you need to recharge and travel."
      },
      {
        title: "401(k) Matching",
        description: "We match up to 5% of your contributions to help you save."
      },
      {
        title: "Home Office Stipend",
        description: "$1,000 annually to set up your ideal workspace."
      }
    ],
    companyLogo: null
  },
  {
    id: "job-002",
    title: "Construction Foreman",
    slug: "construction-foreman",
    category: "Construction",
    tags: [
      "URGENT",
      "CONSTRUCTION"
    ],
    country: "Cyprus",
    salary: {
      min: 140000,
      max: 170000,
      currency: "USD"
    },
    deadline: "2026-10-25",
    postedAt: "2026-06-01",
    isUrgent: true,
    genderPreference: "Male",
    ageRange: {
      min: 28,
      max: 50
    },
    description: "Lead construction crews on large-scale infrastructure projects across Dubai. Responsible for daily site management, safety compliance, and coordinating with project engineers.",
    requirements: [
      "5+ years experience in construction supervision",
      "Valid construction safety certification",
      "Strong leadership and communication skills",
      "Experience with large-scale civil projects"
    ],
    benefits: [
      {
        title: "Housing Allowance",
        description: "Fully furnished accommodation provided."
      },
      {
        title: "Annual Flights",
        description: "Two return flights to Sri Lanka per year."
      },
      {
        title: "Medical Insurance",
        description: "Comprehensive health coverage included."
      }
    ],
    companyLogo: null
  },
  {
    id: "job-003",
    title: "Registered Nurse – ICU",
    slug: "registered-nurse-icu",
    category: "Healthcare",
    tags: [
      "URGENT",
      "HEALTHCARE"
    ],
    country: "Germany",
    salary: {
      min: 90000,
      max: 130000,
      currency: "USD"
    },
    deadline: "2026-12-25",
    postedAt: "2026-04-01",
    isUrgent: true,
    genderPreference: "Female",
    ageRange: {
      min: 24,
      max: 45
    },
    description: "Join a world-class hospital in Riyadh as an ICU Registered Nurse. Provide critical care to patients, monitor vitals, administer medications, and coordinate with attending physicians in a modern, fully equipped facility.",
    requirements: [
      "BSc in Nursing or equivalent",
      "Minimum 3 years ICU experience",
      "HAAD or DHA license preferred",
      "Strong clinical assessment skills"
    ],
    benefits: [
      {
        title: "Tax-Free Salary",
        description: "Full salary paid tax-free."
      },
      {
        title: "Housing & Transport",
        description: "Fully furnished accommodation and daily transport provided."
      },
      {
        title: "Professional Development",
        description: "Annual CPD budget of $2,000."
      }
    ],
    companyLogo: null
  },
  {
    id: "job-004",
    title: "Hotel Receptionist",
    slug: "hotel-receptionist",
    category: "Hospitality",
    tags: [
      "URGENT",
      "HOSPITALITY"
    ],
    country: "Israel",
    salary: {
      min: 40000,
      max: 55000,
      currency: "USD"
    },
    deadline: "2026-10-20",
    postedAt: "2026-05-01",
    isUrgent: true,
    genderPreference: "Female",
    ageRange: {
      min: 21,
      max: 35
    },
    description: "Represent a 5-star hotel brand in Kuala Lumpur as a front desk receptionist. Handle check-ins, reservations, and guest inquiries while delivering exceptional hospitality experiences.",
    requirements: [
      "Diploma in Hotel Management or similar",
      "Excellent English communication skills",
      "Prior hotel front desk experience preferred",
      "Professional appearance and demeanor"
    ],
    benefits: [
      {
        title: "Staff Meals",
        description: "Three meals provided during shift."
      },
      {
        title: "Accommodation",
        description: "Subsidised staff housing available."
      },
      {
        title: "Service Charge",
        description: "Monthly service charge bonus on top of salary."
      }
    ],
    companyLogo: null
  },
  {
    id: "job-005",
    title: "Welder – Structural Steel",
    slug: "welder-structural-steel",
    category: "Manufacturing",
    tags: [
      "URGENT",
      "MANUFACTURING"
    ],
    country: "Jordan",
    salary: {
      min: 80000,
      max: 100000,
      currency: "USD"
    },
    deadline: "2026-11-20",
    postedAt: "2026-04-15",
    isUrgent: true,
    genderPreference: "Male",
    ageRange: {
      min: 22,
      max: 45
    },
    description: "Structural steel welders required for oil and gas infrastructure projects in Kuwait. Perform MIG, TIG, and arc welding on heavy structural components under international quality standards.",
    requirements: [
      "3G/4G welding certification (ASME or equivalent)",
      "Minimum 3 years structural welding experience",
      "Ability to read technical drawings",
      "Experience in oil & gas sector preferred"
    ],
    benefits: [
      {
        title: "Overtime Pay",
        description: "1.5× rate for all overtime hours."
      },
      {
        title: "Free Accommodation",
        description: "Company-provided housing."
      },
      {
        title: "Annual Bonus",
        description: "Performance-based annual bonus."
      }
    ],
    companyLogo: null
  },
  {
    id: "job-007",
    title: "Garment Quality Inspector",
    slug: "garment-quality-inspector",
    category: "Garment",
    tags: [
      "GARMENT"
    ],
    country: "Malaysia",
    salary: {
      min: 35000,
      max: 50000,
      currency: "USD"
    },
    deadline: "2026-09-28",
    postedAt: "2026-06-05",
    isUrgent: false,
    genderPreference: "No Preference",
    ageRange: {
      min: 20,
      max: 40
    },
    description: "Inspect finished garments for defects, ensure compliance with buyer specifications, and maintain quality records. Work with production teams to identify root causes and implement corrective actions.",
    requirements: [
      "1+ year garment QC experience",
      "Familiarity with AQL sampling standards",
      "Attention to detail",
      "Basic English literacy for reports"
    ],
    benefits: [
      {
        title: "Health Coverage",
        description: "Basic medical insurance provided."
      },
      {
        title: "Shift Allowance",
        description: "Additional allowance for night shifts."
      }
    ],
    companyLogo: null
  },
  {
    id: "job-008",
    title: "Civil Engineer",
    slug: "civil-engineer",
    category: "Construction",
    tags: [
      "CONSTRUCTION",
      "ENGINEERING"
    ],
    country: "Oman",
    salary: {
      min: 130000,
      max: 160000,
      currency: "USD"
    },
    deadline: "2026-11-28",
    postedAt: "2026-04-05",
    isUrgent: false,
    genderPreference: "No Preference",
    ageRange: {
      min: 25,
      max: 45
    },
    description: "Oversee civil engineering aspects of large infrastructure and building projects in Doha. Coordinate with contractors, review drawings, conduct site inspections, and ensure works comply with specifications.",
    requirements: [
      "BSc in Civil Engineering",
      "4+ years site experience",
      "Proficiency in AutoCAD",
      "Strong knowledge of international building codes"
    ],
    benefits: [
      {
        title: "Annual Leave",
        description: "30 days annual leave."
      },
      {
        title: "Housing & Car",
        description: "Housing and vehicle allowance included."
      },
      {
        title: "Family Visa",
        description: "Family visa sponsorship available."
      }
    ],
    companyLogo: null
  },
  {
    id: "job-009",
    title: "Physiotherapist",
    slug: "physiotherapist",
    category: "Healthcare",
    tags: [
      "HEALTHCARE"
    ],
    country: "Qatar",
    salary: {
      min: 70000,
      max: 95000,
      currency: "USD"
    },
    deadline: "2026-11-20",
    postedAt: "2026-05-05",
    isUrgent: false,
    genderPreference: "No Preference",
    ageRange: {
      min: 24,
      max: 45
    },
    description: "Provide physiotherapy services at a multi-speciality clinic in Abu Dhabi. Assess patients, develop treatment plans, and deliver hands-on therapy for musculoskeletal and neurological conditions.",
    requirements: [
      "BSc in Physiotherapy",
      "DHA or DOH license (or eligibility)",
      "2+ years clinical experience",
      "Excellent interpersonal skills"
    ],
    benefits: [
      {
        title: "License Sponsorship",
        description: "Employer covers DHA/DOH license fees."
      },
      {
        title: "Health Insurance",
        description: "Premium family health plan."
      },
      {
        title: "CPD Support",
        description: "Annual conference and training budget."
      }
    ],
    companyLogo: null
  },
  {
    id: "job-010",
    title: "Restaurant Chef – Asian Cuisine",
    slug: "restaurant-chef-asian",
    category: "Hospitality",
    tags: [
      "HOSPITALITY",
      "CHEF"
    ],
    country: "Romania",
    salary: {
      min: 55000,
      max: 75000,
      currency: "USD"
    },
    deadline: "2026-12-28",
    postedAt: "2026-05-01",
    isUrgent: false,
    genderPreference: "No Preference",
    ageRange: {
      min: 22,
      max: 45
    },
    description: "Head up the Asian kitchen at a premium restaurant group in Kuwait City. Design seasonal menus, lead a team of 6 cooks, manage food costs, and ensure consistent quality across all dishes.",
    requirements: [
      "Culinary diploma or equivalent experience",
      "5+ years Asian cuisine experience",
      "Strong leadership and kitchen management skills",
      "Knowledge of food safety regulations"
    ],
    benefits: [
      {
        title: "Free Meals",
        description: "All meals provided during shifts."
      },
      {
        title: "Accommodation",
        description: "Private room in staff villa."
      },
      {
        title: "Gratuity",
        description: "End-of-contract gratuity as per Kuwait Labour Law."
      }
    ],
    companyLogo: null
  },
  {
    id: "job-011",
    title: "CNC Machine Operator",
    slug: "cnc-machine-operator",
    category: "Manufacturing",
    tags: [
      "MANUFACTURING"
    ],
    country: "Russia",
    salary: {
      min: 60000,
      max: 85000,
      currency: "USD"
    },
    deadline: "2026-11-28",
    postedAt: "2026-06-01",
    isUrgent: false,
    genderPreference: "Male",
    ageRange: {
      min: 22,
      max: 45
    },
    description: "Operate CNC milling and turning machines to produce precision metal components for industrial clients in Dammam. Set up machines, read technical drawings, and maintain production logs.",
    requirements: [
      "Diploma in Mechanical Engineering or trade certificate",
      "3+ years CNC operation experience",
      "Ability to read engineering drawings",
      "Knowledge of Fanuc or Siemens CNC controllers"
    ],
    benefits: [
      {
        title: "Tool Allowance",
        description: "Annual tool and PPE allowance."
      },
      {
        title: "Overtime",
        description: "Paid overtime at 1.5× rate."
      },
      {
        title: "Medical",
        description: "Company-provided health insurance."
      }
    ],
    companyLogo: null
  },
  {
    id: "job-013",
    title: "Embroidery Machine Operator",
    slug: "embroidery-machine-operator",
    category: "Garment",
    tags: [
      "GARMENT"
    ],
    country: "UAE",
    salary: {
      min: 30000,
      max: 45000,
      currency: "USD"
    },
    deadline: "2026-11-28",
    postedAt: "2026-05-25",
    isUrgent: false,
    genderPreference: "Female",
    ageRange: {
      min: 20,
      max: 40
    },
    description: "Operate multi-head embroidery machines to produce decorative patterns on garments and accessories. Troubleshoot machine errors, change threads, and maintain quality of output.",
    requirements: [
      "1+ year embroidery machine experience",
      "Ability to follow design specifications",
      "Basic machine maintenance skills",
      "Willingness to work in shifts"
    ],
    benefits: [
      {
        title: "Accommodation",
        description: "Free shared accommodation."
      },
      {
        title: "Transport",
        description: "Daily transport to factory provided."
      }
    ],
    companyLogo: null
  },
  {
    id: "job-014",
    title: "Safety Officer – Construction",
    slug: "safety-officer-construction",
    category: "Construction",
    tags: [
      "CONSTRUCTION",
      "SAFETY"
    ],
    country: "Bosnia",
    salary: {
      min: 50000,
      max: 70000,
      currency: "USD"
    },
    deadline: "2026-07-25",
    postedAt: "2026-05-20",
    isUrgent: false,
    genderPreference: "No Preference",
    ageRange: {
      min: 25,
      max: 50
    },
    description: "Implement and monitor health, safety, and environmental procedures across active construction sites in Kuala Lumpur. Conduct toolbox talks, risk assessments, and incident investigations.",
    requirements: [
      "NEBOSH or NIOSH certification",
      "3+ years HSE experience in construction",
      "Strong knowledge of Malaysian OSH Act",
      "Excellent communication and reporting skills"
    ],
    benefits: [
      {
        title: "Company Vehicle",
        description: "Site vehicle provided."
      },
      {
        title: "Medical Insurance",
        description: "Full medical coverage."
      },
      {
        title: "Overtime",
        description: "Overtime pay applicable."
      }
    ],
    companyLogo: null
  },
  {
    id: "job-015",
    title: "Pharmacist",
    slug: "pharmacist",
    category: "Healthcare",
    tags: [
      "HEALTHCARE"
    ],
    country: "Cyprus",
    salary: {
      min: 80000,
      max: 110000,
      currency: "USD"
    },
    deadline: "2026-07-15",
    postedAt: "2026-06-10",
    isUrgent: false,
    genderPreference: "No Preference",
    ageRange: {
      min: 24,
      max: 50
    },
    description: "Dispense medications, counsel patients, and ensure medication safety at a busy community pharmacy in Kuwait City. Work alongside physicians to review prescriptions and manage drug inventory.",
    requirements: [
      "BPharm or PharmD degree",
      "Kuwait MOH license eligibility",
      "2+ years retail or hospital pharmacy experience",
      "Strong patient counselling skills"
    ],
    benefits: [
      {
        title: "Tax-Free Income",
        description: "Fully tax-free salary."
      },
      {
        title: "License Support",
        description: "Employer covers MOH registration fees."
      },
      {
        title: "End of Service",
        description: "Gratuity as per Kuwait Labour Law."
      }
    ],
    companyLogo: null
  },
  {
    id: "job-016",
    title: "Barista – Specialty Coffee",
    slug: "barista-specialty-coffee",
    category: "Hospitality",
    tags: [
      "HOSPITALITY"
    ],
    country: "Germany",
    salary: {
      min: 35000,
      max: 50000,
      currency: "USD"
    },
    deadline: "2026-08-30",
    postedAt: "2026-05-10",
    isUrgent: false,
    genderPreference: "No Preference",
    ageRange: {
      min: 20,
      max: 35
    },
    description: "Craft exceptional specialty coffee experiences at a boutique café chain in Dubai. Operate espresso equipment, train junior staff, and contribute to seasonal menu development.",
    requirements: [
      "SCA barista certification preferred",
      "2+ years specialty coffee experience",
      "Passion for quality and customer experience",
      "Latte art proficiency"
    ],
    benefits: [
      {
        title: "Visa",
        description: "Employment visa and health card provided."
      },
      {
        title: "Staff Meals",
        description: "Free meals and unlimited coffee on shift."
      },
      {
        title: "Tips",
        description: "Tips retained 100% by staff."
      }
    ],
    companyLogo: null
  },
  {
    id: "job-017",
    title: "Electrical Technician",
    slug: "electrical-technician",
    category: "Manufacturing",
    tags: [
      "MANUFACTURING",
      "ELECTRICAL"
    ],
    country: "Israel",
    salary: {
      min: 65000,
      max: 90000,
      currency: "USD"
    },
    deadline: "2026-09-25",
    postedAt: "2026-06-15",
    isUrgent: false,
    genderPreference: "Male",
    ageRange: {
      min: 22,
      max: 45
    },
    description: "Maintain electrical systems, motors, and control panels at an industrial manufacturing plant in Jubail. Diagnose faults, carry out preventive maintenance, and support production uptime.",
    requirements: [
      "Diploma in Electrical Engineering",
      "3+ years industrial maintenance experience",
      "Knowledge of PLC basics (Siemens/Allen Bradley)",
      "Willingness to work in a shift system"
    ],
    benefits: [
      {
        title: "Shift Allowance",
        description: "Additional pay for night and weekend shifts."
      },
      {
        title: "PPE",
        description: "All PPE and workwear supplied."
      },
      {
        title: "Annual Leave",
        description: "21 days paid annual leave."
      }
    ],
    companyLogo: null
  },
  {
    id: "job-019",
    title: "Cutting Machine Operator",
    slug: "cutting-machine-operator",
    category: "Garment",
    tags: [
      "GARMENT"
    ],
    country: "Kuwait",
    salary: {
      min: 28000,
      max: 40000,
      currency: "USD"
    },
    deadline: "2026-10-15",
    postedAt: "2026-06-05",
    isUrgent: false,
    genderPreference: "Male",
    ageRange: {
      min: 20,
      max: 45
    },
    description: "Operate fabric cutting machines in a garment production facility. Lay up fabric, follow cut orders, and maintain blade sharpness and machine calibration to minimise wastage.",
    requirements: [
      "1+ year cutting room experience",
      "Ability to follow lay plans",
      "Physical fitness for standing long hours",
      "Basic machine maintenance knowledge"
    ],
    benefits: [
      {
        title: "Accommodation",
        description: "Free shared accommodation and meals."
      },
      {
        title: "Annual Leave",
        description: "15 days paid annual leave."
      }
    ],
    companyLogo: null
  },
  {
    id: "job-020",
    title: "Mason – Bricklayer",
    slug: "mason-bricklayer",
    category: "Construction",
    tags: [
      "CONSTRUCTION"
    ],
    country: "Malaysia",
    salary: {
      min: 45000,
      max: 65000,
      currency: "USD"
    },
    deadline: "2026-08-25",
    postedAt: "2026-04-25",
    isUrgent: false,
    genderPreference: "Male",
    ageRange: {
      min: 22,
      max: 50
    },
    description: "Perform bricklaying and masonry work on residential and commercial building projects in Sharjah. Work from architectural drawings, mix mortar, and ensure plumb and level accuracy on all work.",
    requirements: [
      "Trade certificate in masonry or equivalent",
      "3+ years bricklaying experience",
      "Ability to read basic construction drawings",
      "Physical fitness for demanding outdoor work"
    ],
    benefits: [
      {
        title: "Accommodation",
        description: "Free accommodation and transport."
      },
      {
        title: "Overtime",
        description: "Generous overtime structure."
      }
    ],
    companyLogo: null
  },
  {
    id: "job-021",
    title: "Medical Lab Technician",
    slug: "medical-lab-technician",
    category: "Healthcare",
    tags: [
      "HEALTHCARE"
    ],
    country: "Oman",
    salary: {
      min: 60000,
      max: 85000,
      currency: "USD"
    },
    deadline: "2026-12-20",
    postedAt: "2026-04-10",
    isUrgent: false,
    genderPreference: "No Preference",
    ageRange: {
      min: 22,
      max: 45
    },
    description: "Perform clinical laboratory tests including haematology, biochemistry, and microbiology at a JCIA-accredited hospital in Doha. Ensure accurate and timely results to support patient care.",
    requirements: [
      "BSc in Medical Laboratory Science",
      "QCHP license (or eligibility)",
      "2+ years clinical lab experience",
      "Proficiency in lab information systems"
    ],
    benefits: [
      {
        title: "Visa & Relocation",
        description: "Full relocation package provided."
      },
      {
        title: "Shift Pay",
        description: "Enhanced pay for on-call shifts."
      },
      {
        title: "Housing",
        description: "Staff accommodation arranged."
      }
    ],
    companyLogo: null
  },
  {
    id: "job-022",
    title: "Front Office Manager",
    slug: "front-office-manager",
    category: "Hospitality",
    tags: [
      "HOSPITALITY",
      "MANAGEMENT"
    ],
    country: "Qatar",
    salary: {
      min: 75000,
      max: 100000,
      currency: "USD"
    },
    deadline: "2026-07-25",
    postedAt: "2026-04-10",
    isUrgent: false,
    genderPreference: "No Preference",
    ageRange: {
      min: 28,
      max: 50
    },
    description: "Lead the front office operations of a luxury hotel in Riyadh, managing a team of 15 staff across reception, concierge, and reservations. Drive guest satisfaction scores and oversee revenue management.",
    requirements: [
      "Diploma or Degree in Hotel Management",
      "5+ years front office experience, 2 in management",
      "Opera PMS proficiency",
      "Outstanding leadership and communication skills"
    ],
    benefits: [
      {
        title: "Executive Package",
        description: "Full executive benefits including car and housing."
      },
      {
        title: "Bonus",
        description: "Quarterly KPI-based bonus structure."
      },
      {
        title: "Family Visa",
        description: "Family relocation support."
      }
    ],
    companyLogo: null
  },
  {
    id: "job-023",
    title: "Pipe Fitter",
    slug: "pipe-fitter",
    category: "Manufacturing",
    tags: [
      "MANUFACTURING",
      "OIL_GAS"
    ],
    country: "Romania",
    salary: {
      min: 70000,
      max: 95000,
      currency: "USD"
    },
    deadline: "2026-08-28",
    postedAt: "2026-06-25",
    isUrgent: false,
    genderPreference: "Male",
    ageRange: {
      min: 24,
      max: 50
    },
    description: "Install, assemble, and maintain piping systems in petrochemical facilities across Kuwait. Work from P&IDs, coordinate with project engineers, and ensure all works meet ASME and API standards.",
    requirements: [
      "Trade certificate in pipe fitting",
      "4+ years oil & gas piping experience",
      "Ability to read P&IDs and isometric drawings",
      "ASME B31.3 knowledge"
    ],
    benefits: [
      {
        title: "EOBI",
        description: "End of service benefits as per Kuwait law."
      },
      {
        title: "Accommodation",
        description: "Free camp accommodation."
      },
      {
        title: "Medical",
        description: "Full medical insurance."
      }
    ],
    companyLogo: null
  },
  {
    id: "job-025",
    title: "Sewing Machine Mechanic",
    slug: "sewing-machine-mechanic",
    category: "Garment",
    tags: [
      "GARMENT",
      "MAINTENANCE"
    ],
    country: "Saudi Arabia",
    salary: {
      min: 30000,
      max: 45000,
      currency: "USD"
    },
    deadline: "2026-10-30",
    postedAt: "2026-06-25",
    isUrgent: false,
    genderPreference: "Male",
    ageRange: {
      min: 22,
      max: 50
    },
    description: "Maintain and repair all sewing and cutting machines in a garment factory. Carry out preventive maintenance schedules, diagnose mechanical faults, and minimise machine downtime.",
    requirements: [
      "2+ years industrial sewing machine maintenance",
      "Ability to read technical manuals",
      "Basic electrical knowledge",
      "Willingness to work overtime during breakdowns"
    ],
    benefits: [
      {
        title: "Transport",
        description: "Daily factory transport."
      },
      {
        title: "Medical",
        description: "SOCSO and medical coverage."
      }
    ],
    companyLogo: null
  },
  {
    id: "job-026",
    title: "Quantity Surveyor",
    slug: "quantity-surveyor",
    category: "Construction",
    tags: [
      "CONSTRUCTION"
    ],
    country: "UAE",
    salary: {
      min: 100000,
      max: 135000,
      currency: "USD"
    },
    deadline: "2026-09-25",
    postedAt: "2026-06-20",
    isUrgent: false,
    genderPreference: "No Preference",
    ageRange: {
      min: 26,
      max: 50
    },
    description: "Manage cost estimation, contract administration, and valuations for Vision 2030 infrastructure projects across Saudi Arabia. Prepare BOQs, evaluate tenders, and negotiate with subcontractors.",
    requirements: [
      "BSc in Quantity Surveying or Civil Engineering",
      "5+ years QS experience on large projects",
      "Proficiency in CostX or equivalent",
      "RICS membership preferred"
    ],
    benefits: [
      {
        title: "Housing & Car",
        description: "Full housing and vehicle allowance."
      },
      {
        title: "Bonus",
        description: "Project completion bonus."
      },
      {
        title: "Family Visa",
        description: "Family visa and schooling allowance."
      }
    ],
    companyLogo: null
  },
  {
    id: "job-027",
    title: "Dental Hygienist",
    slug: "dental-hygienist",
    category: "Healthcare",
    tags: [
      "HEALTHCARE"
    ],
    country: "Bosnia",
    salary: {
      min: 40000,
      max: 60000,
      currency: "USD"
    },
    deadline: "2026-10-20",
    postedAt: "2026-04-10",
    isUrgent: false,
    genderPreference: "No Preference",
    ageRange: {
      min: 22,
      max: 45
    },
    description: "Provide preventive dental care including scaling, cleaning, and patient education at a private dental clinic in Petaling Jaya. Assist dentists during procedures and maintain instrument sterilisation.",
    requirements: [
      "Diploma in Dental Hygiene or Nursing",
      "MMC or ADC registration",
      "Good patient communication skills",
      "1+ year clinical dental experience"
    ],
    benefits: [
      {
        title: "Medical",
        description: "Medical and dental coverage."
      },
      {
        title: "EPF & SOCSO",
        description: "Full statutory contributions."
      }
    ],
    companyLogo: null
  },
  {
    id: "job-028",
    title: "Housekeeping Supervisor",
    slug: "housekeeping-supervisor",
    category: "Hospitality",
    tags: [
      "HOSPITALITY"
    ],
    country: "Cyprus",
    salary: {
      min: 45000,
      max: 60000,
      currency: "USD"
    },
    deadline: "2026-12-25",
    postedAt: "2026-05-01",
    isUrgent: false,
    genderPreference: "Female",
    ageRange: {
      min: 25,
      max: 45
    },
    description: "Supervise a team of 20 housekeeping attendants at a 5-star resort in Doha. Ensure rooms and public areas meet brand cleanliness standards, manage linen inventory, and handle guest complaints.",
    requirements: [
      "3+ years housekeeping experience, 1 in supervision",
      "Strong attention to detail",
      "Good English communication",
      "Ability to manage diverse teams"
    ],
    benefits: [
      {
        title: "Accommodation",
        description: "Staff accommodation and meals provided."
      },
      {
        title: "Service Charge",
        description: "Monthly service charge distribution."
      }
    ],
    companyLogo: null
  },
  {
    id: "job-029",
    title: "Production Supervisor",
    slug: "production-supervisor",
    category: "Manufacturing",
    tags: [
      "MANUFACTURING",
      "MANAGEMENT"
    ],
    country: "Germany",
    salary: {
      min: 85000,
      max: 115000,
      currency: "USD"
    },
    deadline: "2026-10-30",
    postedAt: "2026-05-10",
    isUrgent: false,
    genderPreference: "Male",
    ageRange: {
      min: 28,
      max: 50
    },
    description: "Lead a production shift of 40+ workers at a food processing plant in Abu Dhabi. Monitor KPIs, coordinate with QA and maintenance teams, drive efficiency improvements, and maintain health and safety compliance.",
    requirements: [
      "Diploma or Degree in Engineering or Food Technology",
      "5+ years manufacturing experience, 2 in supervision",
      "Lean or Six Sigma certification preferred",
      "Strong leadership under pressure"
    ],
    benefits: [
      {
        title: "Accommodation",
        description: "Company accommodation provided."
      },
      {
        title: "Transport",
        description: "Daily transport allowance."
      },
      {
        title: "Annual Bonus",
        description: "Performance-linked annual bonus."
      }
    ],
    companyLogo: null
  },
  {
    id: "job-031",
    title: "Automotive Mechanic",
    slug: "automotive-mechanic",
    category: "Engineering",
    tags: [
      "AUTOMOTIVE"
    ],
    country: "Germany",
    salary: {
      min: 45000,
      max: 60000,
      currency: "USD"
    },
    deadline: "2026-10-15",
    postedAt: "2026-06-15",
    isUrgent: true,
    genderPreference: "Male",
    ageRange: {
      min: 22,
      max: 45
    },
    description: "Seeking a skilled Automotive Mechanic for vehicle maintenance, service, and repair.",
    requirements: [
      "Relevant certification",
      "3+ years experience"
    ],
    benefits: [
      {
        title: "Health Insurance",
        description: "Provided"
      }
    ],
    companyLogo: null
  },
  {
    id: "job-032",
    title: "Marine Engineer",
    slug: "marine-engineer",
    category: "Engineering",
    tags: [
      "MARINE",
      "ENGINEERING"
    ],
    country: "UAE",
    salary: {
      min: 65000,
      max: 90000,
      currency: "USD"
    },
    deadline: "2026-09-20",
    postedAt: "2026-06-05",
    isUrgent: false,
    genderPreference: "No Preference",
    ageRange: {
      min: 25,
      max: 50
    },
    description: "Marine engineer required for aviation and watersports facility maintenance.",
    requirements: [
      "Marine engineering degree",
      "5 years experience"
    ],
    benefits: [
      {
        title: "Accommodation",
        description: "Provided"
      }
    ],
    companyLogo: null
  },
  {
    id: "job-033",
    title: "Construction Skilled Trade",
    slug: "construction-skilled-trade",
    category: "Engineering",
    tags: [
      "CONSTRUCTION",
      "ENGINEERING"
    ],
    country: "Qatar",
    salary: {
      min: 35000,
      max: 50000,
      currency: "USD"
    },
    deadline: "2026-08-30",
    postedAt: "2026-06-10",
    isUrgent: true,
    genderPreference: "Male",
    ageRange: {
      min: 20,
      max: 40
    },
    description: "Skilled tradesperson for large-scale construction projects.",
    requirements: [
      "Trade certificate",
      "2 years experience"
    ],
    benefits: [
      {
        title: "Transport",
        description: "Provided"
      }
    ],
    companyLogo: null
  },
  {
    id: "job-034",
    title: "General Labour / Cleaner",
    slug: "general-labour-cleaner",
    category: "Engineering",
    tags: [
      "CLEANING",
      "LABOUR"
    ],
    country: "Saudi Arabia",
    salary: {
      min: 20000,
      max: 30000,
      currency: "USD"
    },
    deadline: "2026-11-20",
    postedAt: "2026-06-01",
    isUrgent: false,
    genderPreference: "No Preference",
    ageRange: {
      min: 21,
      max: 45
    },
    description: "General labour and cleaning staff required for commercial buildings.",
    requirements: [
      "Physical fitness",
      "Basic English"
    ],
    benefits: [
      {
        title: "Accommodation",
        description: "Provided"
      }
    ],
    companyLogo: null
  },
  {
    id: "job-035",
    title: "Agricultural Gardener",
    slug: "agricultural-gardener",
    category: "Engineering",
    tags: [
      "AGRICULTURE",
      "GARDENING"
    ],
    country: "Oman",
    salary: {
      min: 25000,
      max: 35000,
      currency: "USD"
    },
    deadline: "2026-12-15",
    postedAt: "2026-06-12",
    isUrgent: false,
    genderPreference: "No Preference",
    ageRange: {
      min: 20,
      max: 45
    },
    description: "Gardener for landscaping and agricultural maintenance.",
    requirements: [
      "Experience in landscaping",
      "Knowledge of plants"
    ],
    benefits: [
      {
        title: "Health Insurance",
        description: "Provided"
      }
    ],
    companyLogo: null
  },
  {
    id: "job-036",
    title: "Transport Driver",
    slug: "transport-driver",
    category: "Engineering",
    tags: [
      "TRANSPORT",
      "DRIVING"
    ],
    country: "Kuwait",
    salary: {
      min: 30000,
      max: 45000,
      currency: "USD"
    },
    deadline: "2026-08-25",
    postedAt: "2026-06-08",
    isUrgent: true,
    genderPreference: "Male",
    ageRange: {
      min: 25,
      max: 50
    },
    description: "Transport and driving professional required for logistics company.",
    requirements: [
      "Valid heavy vehicle driving license",
      "Clean driving record"
    ],
    benefits: [
      {
        title: "Overtime",
        description: "Paid"
      }
    ],
    companyLogo: null
  },
  {
    id: "job-037",
    title: "Security Officer",
    slug: "security-officer",
    category: "Engineering",
    tags: [
      "SECURITY",
      "SAFETY"
    ],
    country: "UAE",
    salary: {
      min: 35000,
      max: 50000,
      currency: "USD"
    },
    deadline: "2026-09-10",
    postedAt: "2026-06-18",
    isUrgent: false,
    genderPreference: "Male",
    ageRange: {
      min: 25,
      max: 45
    },
    description: "Security and safety officer for commercial premises.",
    requirements: [
      "Previous security experience",
      "Fitness certification"
    ],
    benefits: [
      {
        title: "Accommodation",
        description: "Provided"
      }
    ],
    companyLogo: null
  },
  {
    id: "job-038",
    title: "Accounting & Finance Manager",
    slug: "accounting-finance-manager",
    category: "Accounts",
    tags: [
      "ACCOUNTING",
      "FINANCE"
    ],
    country: "Cyprus",
    salary: {
      min: 70000,
      max: 95000,
      currency: "USD"
    },
    deadline: "2026-10-30",
    postedAt: "2026-06-20",
    isUrgent: true,
    genderPreference: "No Preference",
    ageRange: {
      min: 28,
      max: 50
    },
    description: "Accounting, auditing, and finance professional needed.",
    requirements: [
      "CPA/ACCA qualified",
      "5+ years experience"
    ],
    benefits: [
      {
        title: "Annual Bonus",
        description: "Based on performance"
      }
    ],
    companyLogo: null
  },
  {
    id: "job-039",
    title: "Warehouse Logistician",
    slug: "warehouse-logistician",
    category: "Admin",
    tags: [
      "LOGISTICS",
      "WAREHOUSE"
    ],
    country: "Romania",
    salary: {
      min: 35000,
      max: 50000,
      currency: "USD"
    },
    deadline: "2026-07-28",
    postedAt: "2026-06-02",
    isUrgent: false,
    genderPreference: "No Preference",
    ageRange: {
      min: 22,
      max: 45
    },
    description: "Logistics, warehouse, and transport coordinator.",
    requirements: [
      "Warehouse management experience",
      "Forklift license preferred"
    ],
    benefits: [
      {
        title: "Health Insurance",
        description: "Provided"
      }
    ],
    companyLogo: null
  },
  {
    id: "job-040",
    title: "Sales & Marketing Executive",
    slug: "sales-marketing-executive",
    category: "Accounts",
    tags: [
      "SALES",
      "MARKETING"
    ],
    country: "Israel",
    salary: {
      min: 45000,
      max: 70000,
      currency: "USD"
    },
    deadline: "2026-11-15",
    postedAt: "2026-06-25",
    isUrgent: true,
    genderPreference: "No Preference",
    ageRange: {
      min: 24,
      max: 40
    },
    description: "Sales, marketing, and merchandise specialist for retail brand.",
    requirements: [
      "Bachelor degree in Marketing",
      "2 years sales experience"
    ],
    benefits: [
      {
        title: "Commission",
        description: "Uncapped commission structure"
      }
    ],
    companyLogo: null
  },
  {
    id: "job-041",
    title: "Secretary / Admin",
    slug: "secretary-admin",
    category: "Admin",
    tags: [
      "ADMIN",
      "SECRETARY"
    ],
    country: "Jordan",
    salary: {
      min: 30000,
      max: 45000,
      currency: "USD"
    },
    deadline: "2026-09-05",
    postedAt: "2026-06-14",
    isUrgent: false,
    genderPreference: "Female",
    ageRange: {
      min: 20,
      max: 35
    },
    description: "Secretary and admin assistant for a corporate office.",
    requirements: [
      "Proficiency in MS Office",
      "Excellent communication"
    ],
    benefits: [
      {
        title: "Transport",
        description: "Provided"
      }
    ],
    companyLogo: null
  },
  {
    id: "job-042",
    title: "HR & Training Coordinator",
    slug: "hr-training-coordinator",
    category: "Admin",
    tags: [
      "HR",
      "TRAINING"
    ],
    country: "Bosnia",
    salary: {
      min: 40000,
      max: 60000,
      currency: "USD"
    },
    deadline: "2026-08-20",
    postedAt: "2026-06-11",
    isUrgent: false,
    genderPreference: "No Preference",
    ageRange: {
      min: 25,
      max: 45
    },
    description: "HR and training specialist to oversee employee development.",
    requirements: [
      "HR degree",
      "Experience in corporate training"
    ],
    benefits: [
      {
        title: "Health Insurance",
        description: "Provided"
      }
    ],
    companyLogo: null
  },
  {
    id: "job-043",
    title: "Retail Store Manager",
    slug: "retail-store-manager",
    category: "Retail",
    tags: [
      "RETAIL",
      "MANAGEMENT"
    ],
    country: "Malaysia",
    salary: {
      min: 50000,
      max: 70000,
      currency: "USD"
    },
    deadline: "2026-10-10",
    postedAt: "2026-06-22",
    isUrgent: true,
    genderPreference: "No Preference",
    ageRange: {
      min: 28,
      max: 45
    },
    description: "Retail store manager for high-end fashion brand.",
    requirements: [
      "5 years retail experience",
      "Leadership skills"
    ],
    benefits: [
      {
        title: "Store Discount",
        description: "30% off all items"
      }
    ],
    companyLogo: null
  },
  {
    id: "job-044",
    title: "Hotel / Restaurant Manager",
    slug: "hotel-restaurant-manager",
    category: "Admin",
    tags: [
      "HOTEL",
      "RESTAURANT"
    ],
    country: "Russia",
    salary: {
      min: 60000,
      max: 85000,
      currency: "USD"
    },
    deadline: "2026-12-05",
    postedAt: "2026-06-03",
    isUrgent: false,
    genderPreference: "No Preference",
    ageRange: {
      min: 30,
      max: 50
    },
    description: "Manager for hotel, restaurant, and food services.",
    requirements: [
      "Hospitality Management degree",
      "5+ years experience"
    ],
    benefits: [
      {
        title: "Accommodation",
        description: "Provided"
      }
    ],
    companyLogo: null
  },
  {
    id: "job-045",
    title: "Spa & Beauty Therapist",
    slug: "spa-beauty-therapist",
    category: "Hospitality",
    tags: [
      "SPA",
      "BEAUTY"
    ],
    country: "UAE",
    salary: {
      min: 35000,
      max: 55000,
      currency: "USD"
    },
    deadline: "2026-09-25",
    postedAt: "2026-06-19",
    isUrgent: true,
    genderPreference: "Female",
    ageRange: {
      min: 22,
      max: 40
    },
    description: "Spa, beauty, and salon specialist for luxury resort.",
    requirements: [
      "Therapy certification",
      "2 years experience"
    ],
    benefits: [
      {
        title: "Commission",
        description: "On treatments and products"
      }
    ],
    companyLogo: null
  },
  {
    id: "job-046",
    title: "Healthcare Specialist",
    slug: "healthcare-specialist",
    category: "Hospitality",
    tags: [
      "HEALTHCARE",
      "HOSPITAL"
    ],
    country: "Saudi Arabia",
    salary: {
      min: 80000,
      max: 120000,
      currency: "USD"
    },
    deadline: "2026-11-30",
    postedAt: "2026-06-28",
    isUrgent: true,
    genderPreference: "No Preference",
    ageRange: {
      min: 26,
      max: 55
    },
    description: "Healthcare specialist for primary hospital operations.",
    requirements: [
      "Medical degree or equivalent",
      "License to practice"
    ],
    benefits: [
      {
        title: "Health Insurance",
        description: "Fully covered"
      }
    ],
    companyLogo: null
  },
  {
    id: "job-047",
    title: "Retail Merchandiser",
    slug: "retail-merchandiser",
    category: "Retail",
    tags: [
      "RETAIL"
    ],
    country: "UAE",
    salary: {
      min: 30000,
      max: 50000,
      currency: "USD"
    },
    deadline: "2026-12-31",
    postedAt: "2026-06-25",
    isUrgent: false,
    genderPreference: "No Preference",
    ageRange: {
      min: 20,
      max: 40
    },
    description: "Visual merchandising role for a leading retail chain.",
    requirements: [
      "1+ years retail experience",
      "Creative flair"
    ],
    benefits: [
      {
        title: "Store Discount",
        description: "30% off all items"
      }
    ],
    companyLogo: null
  },
  {
    id: "job-048",
    title: "Office Administrator",
    slug: "office-administrator",
    category: "Admin",
    tags: [
      "ADMIN"
    ],
    country: "UAE",
    salary: {
      min: 30000,
      max: 50000,
      currency: "USD"
    },
    deadline: "2026-12-31",
    postedAt: "2026-06-25",
    isUrgent: false,
    genderPreference: "No Preference",
    ageRange: {
      min: 20,
      max: 40
    },
    description: "Administrative support for a fast-paced corporate office.",
    requirements: [
      "Proficiency in office software",
      "Excellent communication"
    ],
    benefits: [
      {
        title: "Health Insurance",
        description: "Provided"
      }
    ],
    companyLogo: null
  },
  {
    id: "job-049",
    title: "Junior Accountant",
    slug: "junior-accountant",
    category: "Accounts",
    tags: [
      "ACCOUNTS"
    ],
    country: "UAE",
    salary: {
      min: 30000,
      max: 50000,
      currency: "USD"
    },
    deadline: "2026-12-31",
    postedAt: "2026-06-25",
    isUrgent: false,
    genderPreference: "No Preference",
    ageRange: {
      min: 20,
      max: 40
    },
    description: "Entry level accounting position handling ledgers and invoices.",
    requirements: [
      "Degree in Accounting",
      "Detail oriented"
    ],
    benefits: [
      {
        title: "Annual Bonus",
        description: "Based on performance"
      }
    ],
    companyLogo: null
  },
  {
    id: "job-050",
    title: "Operations Coordinator",
    slug: "operations-coordinator",
    category: "Other",
    tags: [
      "OPERATIONS"
    ],
    country: "UAE",
    salary: {
      min: 30000,
      max: 50000,
      currency: "USD"
    },
    deadline: "2026-12-31",
    postedAt: "2026-06-25",
    isUrgent: false,
    genderPreference: "No Preference",
    ageRange: {
      min: 20,
      max: 40
    },
    description: "Coordinate day to day operations for logistics and support.",
    requirements: [
      "Organizational skills",
      "Problem solving"
    ],
    benefits: [
      {
        title: "Transport",
        description: "Provided"
      }
    ],
    companyLogo: null
  }
];

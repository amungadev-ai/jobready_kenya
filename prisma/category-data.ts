// All 49 job categories with their subcategories from the v3.1 manifest
// This file is imported by the seed script

export interface SubcategoryDef {
  value: string;
  label: string;
}

export interface CategoryDef {
  value: string;
  label: string;
  description: string;
  subcategories: SubcategoryDef[];
}

export const jobCategoryData: CategoryDef[] = [
  {
    value: "TECHNOLOGY",
    label: "Technology & IT",
    description: "Explore technology and IT jobs in Kenya including software engineering, data science, cybersecurity, cloud computing, AI, and emerging tech roles across Nairobi, Mombasa, and beyond.",
    subcategories: [
      { value: "SOFTWARE_ENGINEERING", label: "Software Engineering" },
      { value: "WEB_DEVELOPMENT", label: "Web Development" },
      { value: "MOBILE_DEVELOPMENT", label: "Mobile Development" },
      { value: "DATA_SCIENCE", label: "Data Science & Analytics" },
      { value: "CYBER_SECURITY", label: "Cybersecurity" },
      { value: "DEVOPS_CLOUD", label: "DevOps & Cloud Infrastructure" },
      { value: "IT_SUPPORT", label: "IT Support & Helpdesk" },
      { value: "NETWORK_ADMIN", label: "Network Administration" },
      { value: "QA_TESTING", label: "Quality Assurance & Testing" },
      { value: "DATABASE_ADMIN", label: "Database Administration" },
      { value: "SYSTEMS_ARCHITECTURE", label: "Systems Architecture" },
      { value: "AI_MACHINE_LEARNING", label: "AI & Machine Learning" },
      { value: "BLOCKCHAIN", label: "Blockchain Development" },
      { value: "GAME_DEVELOPMENT", label: "Game Development" },
      { value: "EMBEDDED_SYSTEMS", label: "Embedded Systems" },
      { value: "TECH_PROJECT_MANAGEMENT", label: "Technical Project Management" },
      { value: "IT_AUDIT", label: "IT Audit" },
      { value: "TECH_SUPPORT_ENGINEER", label: "Technical Support Engineering" }
    ]
  },
  {
    value: "FINANCE_ACCOUNTING",
    label: "Finance & Accounting",
    description: "Find finance and accounting careers in Kenya including accounting, financial analysis, audit, tax, risk management, and banking roles at leading Kenyan and international firms.",
    subcategories: [
      { value: "ACCOUNTING", label: "Accounting" },
      { value: "FINANCIAL_ANALYSIS", label: "Financial Analysis" },
      { value: "AUDIT", label: "Audit" },
      { value: "TAX", label: "Taxation" },
      { value: "TREASURY", label: "Treasury Management" },
      { value: "RISK_COMPLIANCE", label: "Risk & Compliance" },
      { value: "INVESTMENT_BANKING", label: "Investment Banking" },
      { value: "WEALTH_MANAGEMENT", label: "Wealth Management" },
      { value: "FINANCIAL_PLANNING", label: "Financial Planning" },
      { value: "PAYROLL", label: "Payroll Management" },
      { value: "CORPORATE_FINANCE", label: "Corporate Finance" },
      { value: "HEDGE_FUNDS", label: "Hedge Funds" },
      { value: "PRIVATE_EQUITY", label: "Private Equity" },
      { value: "VENTURE_CAPITAL", label: "Venture Capital" },
      { value: "FINANCIAL_REPORTING", label: "Financial Reporting" },
      { value: "CREDIT_ANALYSIS", label: "Credit Analysis" },
      { value: "MERCHANT_BANKING", label: "Merchant Banking" }
    ]
  },
  {
    value: "SALES_BUSINESS",
    label: "Sales & Business Development",
    description: "Discover sales and business development opportunities in Kenya across B2B, B2C, corporate sales, account management, and business strategy roles at top companies.",
    subcategories: [
      { value: "BUSINESS_DEVELOPMENT", label: "Business Development" },
      { value: "ACCOUNT_MANAGEMENT", label: "Account Management" },
      { value: "SALES_REPRESENTATIVE", label: "Sales Representative" },
      { value: "CHANNEL_SALES", label: "Channel Sales" },
      { value: "CUSTOMER_SUCCESS", label: "Customer Success" },
      { value: "CORPORATE_SALES", label: "Corporate Sales" },
      { value: "RETAIL_SALES", label: "Retail Sales" },
      { value: "SALES_OPERATIONS", label: "Sales Operations" },
      { value: "SALES_TRAINING", label: "Sales Training" },
      { value: "KEY_ACCOUNT_MANAGEMENT", label: "Key Account Management" },
      { value: "TECHNICAL_SALES", label: "Technical Sales" },
      { value: "SALES_ENGINEERING", label: "Sales Engineering" },
      { value: "INSIDE_SALES", label: "Inside Sales" },
      { value: "FIELD_SALES", label: "Field Sales" },
      { value: "B2B_SALES", label: "B2B Sales" },
      { value: "B2C_SALES", label: "B2C Sales" },
      { value: "SALES_MANAGEMENT", label: "Sales Management" },
      { value: "SALES_ENABLEMENT", label: "Sales Enablement" }
    ]
  },
  {
    value: "MARKETING_COMMUNICATIONS",
    label: "Marketing & Communications",
    description: "Browse marketing and communications jobs in Kenya including digital marketing, content strategy, brand management, SEO, social media, PR, and growth marketing positions.",
    subcategories: [
      { value: "DIGITAL_MARKETING", label: "Digital Marketing" },
      { value: "CONTENT_MARKETING", label: "Content Marketing" },
      { value: "BRAND_MANAGEMENT", label: "Brand Management" },
      { value: "PUBLIC_RELATIONS", label: "Public Relations" },
      { value: "SOCIAL_MEDIA", label: "Social Media Management" },
      { value: "SEO_SEM", label: "SEO & Search Marketing" },
      { value: "MARKET_RESEARCH", label: "Market Research" },
      { value: "PRODUCT_MARKETING", label: "Product Marketing" },
      { value: "EVENT_MARKETING", label: "Event Marketing" },
      { value: "AFFILIATE_MARKETING", label: "Affiliate Marketing" },
      { value: "MARKETING_AUTOMATION", label: "Marketing Automation" },
      { value: "COPYWRITING", label: "Copywriting" },
      { value: "INFLUENCER_MARKETING", label: "Influencer Marketing" },
      { value: "EMAIL_MARKETING", label: "Email Marketing" },
      { value: "VIDEO_MARKETING", label: "Video Marketing" },
      { value: "GUERRILLA_MARKETING", label: "Guerrilla Marketing" },
      { value: "GROWTH_MARKETING", label: "Growth Marketing" },
      { value: "PERFORMANCE_MARKETING", label: "Performance Marketing" }
    ]
  },
  {
    value: "HUMAN_RESOURCES",
    label: "Human Resources",
    description: "Explore HR careers in Kenya covering recruitment, talent acquisition, HR analytics, learning and development, compensation and benefits, and organizational development roles.",
    subcategories: [
      { value: "RECRUITMENT", label: "Recruitment & Talent Acquisition" },
      { value: "HR_GENERALIST", label: "HR Generalist" },
      { value: "PAYROLL", label: "Payroll & Compensation" },
      { value: "LEARNING_DEVELOPMENT", label: "Learning & Development" },
      { value: "HR_ANALYTICS", label: "HR Analytics" },
      { value: "EMPLOYEE_RELATIONS", label: "Employee Relations" },
      { value: "HR_OPERATIONS", label: "HR Operations" },
      { value: "TALENT_MANAGEMENT", label: "Talent Management" },
      { value: "ORGANIZATIONAL_DEVELOPMENT", label: "Organizational Development" },
      { value: "HRIS", label: "HR Information Systems" },
      { value: "COMPENSATION_BENEFITS", label: "Compensation & Benefits" },
      { value: "DIVERSITY_INCLUSION", label: "Diversity & Inclusion" },
      { value: "EMPLOYER_BRANDING", label: "Employer Branding" },
      { value: "HR_CONSULTING", label: "HR Consulting" },
      { value: "LABOR_RELATIONS", label: "Labor Relations" },
      { value: "HR_COMPLIANCE", label: "HR Compliance" },
      { value: "WORKPLACE_SAFETY", label: "Workplace Safety" }
    ]
  },
  {
    value: "ENGINEERING",
    label: "Engineering",
    description: "Find engineering jobs in Kenya across civil, mechanical, electrical, chemical, biomedical, and environmental engineering disciplines at construction firms, manufacturers, and government agencies.",
    subcategories: [
      { value: "CIVIL_ENGINEERING", label: "Civil Engineering" },
      { value: "MECHANICAL_ENGINEERING", label: "Mechanical Engineering" },
      { value: "ELECTRICAL_ENGINEERING", label: "Electrical Engineering" },
      { value: "INDUSTRIAL_ENGINEERING", label: "Industrial Engineering" },
      { value: "PROJECT_ENGINEERING", label: "Project Engineering" },
      { value: "CHEMICAL_ENGINEERING", label: "Chemical Engineering" },
      { value: "AEROSPACE_ENGINEERING", label: "Aerospace Engineering" },
      { value: "BIOMEDICAL_ENGINEERING", label: "Biomedical Engineering" },
      { value: "ENVIRONMENTAL_ENGINEERING", label: "Environmental Engineering" },
      { value: "MATERIALS_ENGINEERING", label: "Materials Engineering" },
      { value: "STRUCTURAL_ENGINEERING", label: "Structural Engineering" },
      { value: "GEOTECHNICAL_ENGINEERING", label: "Geotechnical Engineering" },
      { value: "PETROLEUM_ENGINEERING", label: "Petroleum Engineering" },
      { value: "MARINE_ENGINEERING", label: "Marine Engineering" },
      { value: "AUTOMOTIVE_ENGINEERING", label: "Automotive Engineering" },
      { value: "NUCLEAR_ENGINEERING", label: "Nuclear Engineering" },
      { value: "MECHATRONICS", label: "Mechatronics" }
    ]
  },
  {
    value: "HEALTHCARE",
    label: "Healthcare & Medical",
    description: "Discover healthcare and medical jobs in Kenya including nursing, pharmacy, medical doctors, public health, physiotherapy, radiology, and health administration positions.",
    subcategories: [
      { value: "NURSING", label: "Nursing" },
      { value: "PHARMACY", label: "Pharmacy" },
      { value: "MEDICAL_DOCTOR", label: "Medical Doctor" },
      { value: "LAB_TECHNOLOGY", label: "Laboratory Technology" },
      { value: "PUBLIC_HEALTH", label: "Public Health" },
      { value: "HEALTH_ADMIN", label: "Healthcare Administration" },
      { value: "PHYSIOTHERAPY", label: "Physiotherapy" },
      { value: "OCCUPATIONAL_THERAPY", label: "Occupational Therapy" },
      { value: "RADIOLOGY", label: "Radiology & Imaging" },
      { value: "MEDICAL_RESEARCH", label: "Medical Research" },
      { value: "HEALTH_INFORMATICS", label: "Health Informatics" },
      { value: "CARDIOLOGY", label: "Cardiology" },
      { value: "NEUROLOGY", label: "Neurology" },
      { value: "PEDIATRICS", label: "Pediatrics" },
      { value: "ONCOLOGY", label: "Oncology" },
      { value: "EMERGENCY_MEDICINE", label: "Emergency Medicine" },
      { value: "ANESTHESIOLOGY", label: "Anesthesiology" },
      { value: "PSYCHIATRY", label: "Psychiatry" }
    ]
  },
  {
    value: "EDUCATION",
    label: "Education & Training",
    description: "Browse education and training jobs in Kenya covering teaching, lecturing, curriculum development, e-learning, special education, and academic research at schools and universities.",
    subcategories: [
      { value: "TEACHING", label: "Teaching" },
      { value: "LECTURING", label: "Lecturing" },
      { value: "EDUCATION_ADMIN", label: "Education Administration" },
      { value: "CURRICULUM_DEVELOPMENT", label: "Curriculum Development" },
      { value: "TRAINING", label: "Training & Facilitation" },
      { value: "E_LEARNING", label: "E-Learning & Instructional Design" },
      { value: "SPECIAL_EDUCATION", label: "Special Education" },
      { value: "EDUCATIONAL_TECHNOLOGY", label: "Educational Technology" },
      { value: "STUDENT_COUNSELING", label: "Student Counseling" },
      { value: "ACADEMIC_RESEARCH", label: "Academic Research" },
      { value: "EARLY_CHILDHOOD", label: "Early Childhood Education" },
      { value: "PRIMARY_EDUCATION", label: "Primary Education" },
      { value: "SECONDARY_EDUCATION", label: "Secondary Education" },
      { value: "HIGHER_EDUCATION", label: "Higher Education" },
      { value: "VOCATIONAL_TRAINING", label: "Vocational Training" },
      { value: "LANGUAGE_TEACHING", label: "Language Teaching" },
      { value: "EDUCATIONAL_PSYCHOLOGY", label: "Educational Psychology" }
    ]
  },
  {
    value: "OPERATIONS_ADMIN",
    label: "Operations & Administration",
    description: "Find operations and administration jobs in Kenya including office management, project management, executive assistance, facilities management, and business support roles.",
    subcategories: [
      { value: "OFFICE_ADMIN", label: "Office Administration" },
      { value: "OPERATIONS_MANAGEMENT", label: "Operations Management" },
      { value: "PROJECT_MANAGEMENT", label: "Project Management" },
      { value: "EXECUTIVE_ASSISTANT", label: "Executive Assistant" },
      { value: "PROGRAM_MANAGEMENT", label: "Program Management" },
      { value: "BUSINESS_OPERATIONS", label: "Business Operations" },
      { value: "FACILITIES_MANAGEMENT", label: "Facilities Management" },
      { value: "ADMINISTRATIVE_SUPPORT", label: "Administrative Support" },
      { value: "DATA_ENTRY", label: "Data Entry" },
      { value: "PROCESS_IMPROVEMENT", label: "Process Improvement" },
      { value: "OFFICE_MANAGER", label: "Office Manager" },
      { value: "ADMINISTRATIVE_COORDINATOR", label: "Administrative Coordinator" },
      { value: "RECEPTIONIST", label: "Receptionist" },
      { value: "PROJECT_COORDINATION", label: "Project Coordination" },
      { value: "BUSINESS_SUPPORT", label: "Business Support" },
      { value: "ADMINISTRATIVE_MANAGEMENT", label: "Administrative Management" }
    ]
  },
  {
    value: "SUPPLY_CHAIN",
    label: "Logistics & Supply Chain",
    description: "Explore logistics and supply chain careers in Kenya including procurement, warehousing, distribution, transport coordination, customs brokerage, and supply chain planning roles.",
    subcategories: [
      { value: "PROCUREMENT", label: "Procurement" },
      { value: "WAREHOUSING", label: "Warehousing" },
      { value: "DISTRIBUTION", label: "Distribution & Logistics" },
      { value: "INVENTORY_MANAGEMENT", label: "Inventory Management" },
      { value: "TRANSPORT_COORDINATION", label: "Transport Coordination" },
      { value: "SUPPLY_CHAIN_PLANNING", label: "Supply Chain Planning" },
      { value: "FREIGHT_FORWARDING", label: "Freight Forwarding" },
      { value: "CUSTOMS_BROKERAGE", label: "Customs Brokerage" },
      { value: "DEMAND_PLANNING", label: "Demand Planning" },
      { value: "LOGISTICS_ANALYTICS", label: "Logistics Analytics" },
      { value: "FLEET_MANAGEMENT", label: "Fleet Management" },
      { value: "RETURN_LOGISTICS", label: "Return Logistics" },
      { value: "WAREHOUSE_OPERATIONS", label: "Warehouse Operations" },
      { value: "MATERIALS_MANAGEMENT", label: "Materials Management" },
      { value: "GLOBAL_LOGISTICS", label: "Global Logistics" },
      { value: "SHIPPING_RECEIVING", label: "Shipping & Receiving" }
    ]
  },
  {
    value: "HOSPITALITY",
    label: "Hospitality & Tourism",
    description: "Discover hospitality and tourism jobs in Kenya including hotel management, culinary arts, tourism operations, event planning, and travel agency roles in Kenya's vibrant tourism sector.",
    subcategories: [
      { value: "HOTEL_MANAGEMENT", label: "Hotel Management" },
      { value: "CHEF_COOKING", label: "Chef & Culinary" },
      { value: "TOURISM_OPERATIONS", label: "Tourism Operations" },
      { value: "FRONT_OFFICE", label: "Front Office" },
      { value: "HOUSEKEEPING", label: "Housekeeping" },
      { value: "FOOD_BEVERAGE", label: "Food & Beverage" },
      { value: "EVENT_PLANNING", label: "Event Planning" },
      { value: "TRAVEL_AGENCY", label: "Travel Agency" },
      { value: "CASINO_GAMING", label: "Casino & Gaming" },
      { value: "RESORT_MANAGEMENT", label: "Resort Management" },
      { value: "CONCIERGE", label: "Concierge Services" },
      { value: "BARTENDING", label: "Bartending" },
      { value: "RESTAURANT_MANAGEMENT", label: "Restaurant Management" },
      { value: "CATERING", label: "Catering" },
      { value: "SPA_MANAGEMENT", label: "Spa Management" },
      { value: "CRUISE_SHIP_STAFF", label: "Cruise Ship Staff" }
    ]
  },
  {
    value: "SPECIALISED_SERVICES",
    label: "Specialised Services",
    description: "Find specialised service jobs in Kenya including project management, operations management, technical project management, and translation services across various industries.",
    subcategories: [
      { value: "PROJECT_MANAGEMENT", label: "Project Management" },
      { value: "OPERATIONS_MANAGER", label: "Operations Manager" },
      { value: "TECHNICAL_PROJECT_MANAGER", label: "Technical Project Manager" },
      { value: "TRANSLATION_INTERPRETATION", label: "Translation & Interpretation" }
    ]
  },
  {
    value: "AGRICULTURE",
    label: "Agriculture & Agribusiness",
    description: "Explore agriculture and agribusiness jobs in Kenya covering agronomy, farm management, crop science, horticulture, agricultural engineering, and sustainable farming roles.",
    subcategories: [
      { value: "AGRONOMY", label: "Agronomy" },
      { value: "FARM_MANAGEMENT", label: "Farm Management" },
      { value: "AGRICULTURAL_EXTENSION", label: "Agricultural Extension" },
      { value: "LIVESTOCK_MANAGEMENT", label: "Livestock Management" },
      { value: "CROP_SCIENCE", label: "Crop Science" },
      { value: "AGRICULTURAL_ENGINEERING", label: "Agricultural Engineering" },
      { value: "FOOD_SCIENCE", label: "Food Science" },
      { value: "AGRIBUSINESS", label: "Agribusiness" },
      { value: "HORTICULTURE", label: "Horticulture" },
      { value: "SUSTAINABLE_AGRICULTURE", label: "Sustainable Agriculture" },
      { value: "PRECISION_AGRICULTURE", label: "Precision Agriculture" },
      { value: "AGRICULTURAL_ECONOMICS", label: "Agricultural Economics" },
      { value: "PEST_MANAGEMENT", label: "Pest Management" },
      { value: "SOIL_SCIENCE", label: "Soil Science" },
      { value: "FORESTRY", label: "Forestry" }
    ]
  },
  {
    value: "LEGAL",
    label: "Legal & Compliance",
    description: "Discover legal and compliance jobs in Kenya including corporate law, legal advisory, compliance, intellectual property, litigation, and labor law positions at law firms and corporations.",
    subcategories: [
      { value: "CORPORATE_LAW", label: "Corporate Law" },
      { value: "LEGAL_ADVISORY", label: "Legal Advisory" },
      { value: "CONTRACT_MANAGEMENT", label: "Contract Management" },
      { value: "COMPLIANCE_OFFICER", label: "Compliance" },
      { value: "PARALEGAL", label: "Paralegal Services" },
      { value: "INTELLECTUAL_PROPERTY", label: "Intellectual Property" },
      { value: "LITIGATION", label: "Litigation" },
      { value: "LABOR_LAW", label: "Labor Law" },
      { value: "DISPUTE_RESOLUTION", label: "Dispute Resolution" },
      { value: "LEGAL_RESEARCH", label: "Legal Research" },
      { value: "COMPANY_SECRETARY", label: "Company Secretary" },
      { value: "CONVEYANCING", label: "Conveyancing" },
      { value: "TAX_LAW", label: "Tax Law" },
      { value: "HUMAN_RIGHTS_LAW", label: "Human Rights Law" },
      { value: "ENVIRONMENTAL_LAW", label: "Environmental Law" },
      { value: "INTERNATIONAL_LAW", label: "International Law" }
    ]
  },
  {
    value: "CREATIVE_ARTS_DESIGN",
    label: "Creative, Arts & Design",
    description: "Browse creative arts and design jobs in Kenya including graphic design, UI/UX design, photography, videography, fashion design, and creative writing roles.",
    subcategories: [
      { value: "GRAPHIC_DESIGN", label: "Graphic Design" },
      { value: "UI_UX_DESIGN", label: "UI/UX Design" },
      { value: "PHOTOGRAPHY", label: "Photography" },
      { value: "VIDEOGRAPHY", label: "Videography" },
      { value: "ANIMATION", label: "Animation" },
      { value: "FASHION_DESIGN", label: "Fashion Design" },
      { value: "INTERIOR_DESIGN", label: "Interior Design" },
      { value: "CREATIVE_WRITING", label: "Creative Writing" },
      { value: "MUSIC_PRODUCTION", label: "Music Production" },
      { value: "FILM_PRODUCTION", label: "Film Production" },
      { value: "ART_DIRECTION", label: "Art Direction" },
      { value: "ILLUSTRATION", label: "Illustration" },
      { value: "PRODUCT_DESIGN", label: "Product Design" },
      { value: "BRAND_IDENTITY", label: "Brand Identity Design" },
      { value: "PRINT_DESIGN", label: "Print Design" },
      { value: "MOTION_GRAPHICS", label: "Motion Graphics" }
    ]
  },
  {
    value: "MEDIA_JOURNALISM",
    label: "Media & Journalism",
    description: "Find media and journalism jobs in Kenya including news reporting, editing, broadcast journalism, digital media, content creation, and media production positions.",
    subcategories: [
      { value: "NEWS_REPORTING", label: "News Reporting" },
      { value: "EDITORIAL", label: "Editorial" },
      { value: "BROADCAST_JOURNALISM", label: "Broadcast Journalism" },
      { value: "DIGITAL_MEDIA", label: "Digital Media" },
      { value: "CONTENT_CREATION", label: "Content Creation" },
      { value: "PRODUCER", label: "Producer" },
      { value: "NEWS_ANCHOR", label: "News Anchor" },
      { value: "CAMERA_OPERATOR", label: "Camera Operator" },
      { value: "SOUND_ENGINEER", label: "Sound Engineer" },
      { value: "VIDEO_EDITOR", label: "Video Editor" },
      { value: "FACT_CHECKING", label: "Fact-Checking" },
      { value: "INVESTIGATIVE_JOURNALISM", label: "Investigative Journalism" },
      { value: "SPORTS_JOURNALISM", label: "Sports Journalism" },
      { value: "TECH_JOURNALISM", label: "Tech Journalism" },
      { value: "MEDIA_MANAGEMENT", label: "Media Management" }
    ]
  },
  {
    value: "CUSTOMER_SERVICE",
    label: "Customer Service",
    description: "Explore customer service jobs in Kenya including call center, customer support, client relations, customer experience, and service management roles.",
    subcategories: [
      { value: "CALL_CENTER", label: "Call Center" },
      { value: "CUSTOMER_SUPPORT", label: "Customer Support" },
      { value: "CLIENT_RELATIONS", label: "Client Relations" },
      { value: "CUSTOMER_EXPERIENCE", label: "Customer Experience" },
      { value: "SERVICE_DESK", label: "Service Desk" },
      { value: "COMPLAINTS_HANDLING", label: "Complaints Handling" },
      { value: "QUALITY_ASSURANCE_CS", label: "Quality Assurance" },
      { value: "TEAM_LEAD_CS", label: "Team Lead" },
      { value: "CUSTOMER_SUCCESS_MANAGER", label: "Customer Success Manager" },
      { value: "TECHNICAL_SUPPORT", label: "Technical Support" },
      { value: "VIRTUAL_ASSISTANT", label: "Virtual Assistant" },
      { value: "RECEPTIONIST_CS", label: "Receptionist" }
    ]
  },
  {
    value: "DRIVING_LOGISTICS",
    label: "Driving & Logistics",
    description: "Find driving and logistics jobs in Kenya including truck driving, delivery services, courier services, and transportation roles across the country.",
    subcategories: [
      { value: "TRUCK_DRIVING", label: "Truck Driving" },
      { value: "DELIVERY_SERVICES", label: "Delivery Services" },
      { value: "COURIER_SERVICES", label: "Courier Services" },
      { value: "BUS_DRIVING", label: "Bus Driving" },
      { value: "MOTORCYCLE_COURIER", label: "Motorcycle Courier" },
      { value: "FORKLIFT_OPERATOR", label: "Forklift Operator" },
      { value: "DISPATCH", label: "Dispatch" },
      { value: "FLEET_COORDINATION", label: "Fleet Coordination" },
      { value: "HEAVY_MACHINERY", label: "Heavy Machinery Operator" },
      { value: "PILOT", label: "Pilot" }
    ]
  },
  {
    value: "SECURITY_PROTECTION",
    label: "Security & Protection",
    description: "Discover security and protection jobs in Kenya including security guard, private investigation, cyber security, close protection, and security management roles.",
    subcategories: [
      { value: "SECURITY_GUARD", label: "Security Guard" },
      { value: "PRIVATE_INVESTIGATION", label: "Private Investigation" },
      { value: "CYBER_SECURITY_SEC", label: "Cyber Security" },
      { value: "CLOSE_PROTECTION", label: "Close Protection" },
      { value: "SECURITY_MANAGEMENT", label: "Security Management" },
      { value: "RISK_ASSESSMENT", label: "Risk Assessment" },
      { value: "FIRE_SAFETY", label: "Fire Safety" },
      { value: "CCTV_MONITORING", label: "CCTV Monitoring" },
      { value: "ACCESS_CONTROL", label: "Access Control" },
      { value: "LOSS_PREVENTION", label: "Loss Prevention" }
    ]
  },
  {
    value: "REAL_ESTATE_PROPERTY",
    label: "Real Estate & Property",
    description: "Browse real estate and property jobs in Kenya including property management, real estate sales, property valuation, facilities management, and construction project roles.",
    subcategories: [
      { value: "PROPERTY_MANAGEMENT", label: "Property Management" },
      { value: "REAL_ESTATE_SALES", label: "Real Estate Sales" },
      { value: "PROPERTY_VALUATION", label: "Property Valuation" },
      { value: "FACILITIES_MAN", label: "Facilities Management" },
      { value: "CONSTRUCTION_PROJECTS", label: "Construction Projects" },
      { value: "ESTATE_AGENCY", label: "Estate Agency" },
      { value: "PROPERTY_DEVELOPMENT", label: "Property Development" },
      { value: "LAND_SURVEYING", label: "Land Surveying" },
      { value: "RENTAL_MANAGEMENT", label: "Rental Management" },
      { value: "COMMERCIAL_PROPERTY", label: "Commercial Property" }
    ]
  },
  {
    value: "SOCIAL_WORK_COMMUNITY",
    label: "Social Work & Community",
    description: "Find social work and community development jobs in Kenya including social work, community development, counseling, NGO program management, and advocacy roles.",
    subcategories: [
      { value: "SOCIAL_WORK", label: "Social Work" },
      { value: "COMMUNITY_DEVELOPMENT", label: "Community Development" },
      { value: "COUNSELING", label: "Counseling" },
      { value: "NGO_PROGRAM_MANAGEMENT", label: "NGO Program Management" },
      { value: "ADVOCACY", label: "Advocacy" },
      { value: "GENDER_EQUALITY", label: "Gender Equality" },
      { value: "CHILD_PROTECTION", label: "Child Protection" },
      { value: "REFUGEE_SUPPORT", label: "Refugee Support" },
      { value: "DISABILITY_SERVICES", label: "Disability Services" },
      { value: "YOUTH_DEVELOPMENT", label: "Youth Development" }
    ]
  },
  {
    value: "ENVIRONMENTAL_SCIENCES",
    label: "Environmental Sciences",
    description: "Explore environmental science jobs in Kenya including environmental conservation, climate change, wildlife management, environmental impact assessment, and sustainability roles.",
    subcategories: [
      { value: "ENVIRONMENTAL_CONSERVATION", label: "Environmental Conservation" },
      { value: "CLIMATE_CHANGE", label: "Climate Change" },
      { value: "WILDLIFE_MANAGEMENT", label: "Wildlife Management" },
      { value: "ENVIRONMENTAL_IMPACT", label: "Environmental Impact Assessment" },
      { value: "SUSTAINABILITY", label: "Sustainability" },
      { value: "WASTE_MANAGEMENT_ENV", label: "Waste Management" },
      { value: "WATER_RESOURCES", label: "Water Resources" },
      { value: "RENEWABLE_ENERGY_ENV", label: "Renewable Energy" },
      { value: "FORESTRY_ENV", label: "Forestry" },
      { value: "POLLUTION_CONTROL", label: "Pollution Control" }
    ]
  },
  {
    value: "MINING_GEOSCIENCES",
    label: "Mining & Geosciences",
    description: "Discover mining and geosciences jobs in Kenya including mining engineering, geology, mineral processing, environmental management in mining, and exploration roles.",
    subcategories: [
      { value: "MINING_ENGINEERING", label: "Mining Engineering" },
      { value: "GEOLOGY", label: "Geology" },
      { value: "MINERAL_PROCESSING", label: "Mineral Processing" },
      { value: "ENVIRONMENTAL_MANAGEMENT_MIN", label: "Environmental Management" },
      { value: "EXPLORATION", label: "Exploration" },
      { value: "MINE_PLANNING", label: "Mine Planning" },
      { value: "OCCUPATIONAL_HEALTH_MINING", label: "Occupational Health" },
      { value: "SURVEYING_MINING", label: "Surveying" },
      { value: "BLASTING", label: "Blasting" },
      { value: "MINE_SAFETY", label: "Mine Safety" }
    ]
  },
  {
    value: "TELECOMMUNICATIONS",
    label: "Telecommunications",
    description: "Browse telecommunications jobs in Kenya including network engineering, VoIP, telecom infrastructure, broadband technology, and 5G technology roles at leading telecom companies.",
    subcategories: [
      { value: "NETWORK_ENGINEERING_TELECOM", label: "Network Engineering" },
      { value: "VOIP_ENGINEERING", label: "VoIP Engineering" },
      { value: "TELECOM_INFRASTRUCTURE", label: "Telecom Infrastructure" },
      { value: "BROADBAND_TECHNOLOGY", label: "Broadband Technology" },
      { value: "TELECOM_REGULATORY", label: "Telecom Regulatory Affairs" },
      { value: "5G_TECHNOLOGY", label: "5G Technology" },
      { value: "TELECOM_PROJECT_MANAGEMENT", label: "Telecom Project Management" },
      { value: "RADIO_FREQUENCY_ENGINEERING", label: "Radio Frequency Engineering" }
    ]
  },
  {
    value: "ENERGY_UTILITIES",
    label: "Energy & Utilities",
    description: "Find energy and utilities jobs in Kenya including power generation, renewable energy, oil and gas, utility management, and smart grid technology positions.",
    subcategories: [
      { value: "POWER_GENERATION", label: "Power Generation" },
      { value: "RENEWABLE_ENERGY_UTILITIES", label: "Renewable Energy" },
      { value: "NUCLEAR_ENERGY", label: "Nuclear Energy" },
      { value: "OIL_GAS", label: "Oil & Gas" },
      { value: "UTILITY_MANAGEMENT", label: "Utility Management" },
      { value: "ENERGY_TRADING", label: "Energy Trading" },
      { value: "POWER_DISTRIBUTION", label: "Power Distribution" },
      { value: "ELECTRIC_GRID", label: "Electric Grid Management" },
      { value: "WATER_UTILITIES", label: "Water Utilities" },
      { value: "ENERGY_EFFICIENCY", label: "Energy Efficiency" },
      { value: "SMART_GRID", label: "Smart Grid Technology" },
      { value: "SOLAR_ENERGY", label: "Solar Energy" }
    ]
  },
  {
    value: "SPORTS_FITNESS",
    label: "Sports & Fitness",
    description: "Explore sports and fitness jobs in Kenya including sports coaching, fitness training, sports management, sports medicine, and recreation roles.",
    subcategories: [
      { value: "SPORTS_COACHING", label: "Sports Coaching" },
      { value: "FITNESS_TRAINING", label: "Fitness Training" },
      { value: "SPORTS_MANAGEMENT", label: "Sports Management" },
      { value: "SPORTS_MEDICINE", label: "Sports Medicine" },
      { value: "RECREATION", label: "Recreation" },
      { value: "SPORTS_JOURNALISM", label: "Sports Journalism" },
      { value: "EVENT_MANAGEMENT_SPORTS", label: "Event Management" },
      { value: "SPORTS_MARKETING", label: "Sports Marketing" }
    ]
  },
  {
    value: "TRANSPORT_AUTOMOTIVE",
    label: "Transport & Automotive",
    description: "Discover transport and automotive jobs in Kenya including automotive engineering, vehicle maintenance, transport management, and logistics coordination roles.",
    subcategories: [
      { value: "AUTOMOTIVE_ENGINEERING_TRANS", label: "Automotive Engineering" },
      { value: "VEHICLE_MAINTENANCE", label: "Vehicle Maintenance" },
      { value: "TRANSPORT_MANAGEMENT", label: "Transport Management" },
      { value: "LOGISTICS_COORDINATION_TRANS", label: "Logistics Coordination" },
      { value: "FLEET_MANAGEMENT_TRANS", label: "Fleet Management" },
      { value: "ROAD_SAFETY", label: "Road Safety" },
      { value: "AVIATION_SERVICES", label: "Aviation Services" },
      { value: "MARITIME_SERVICES", label: "Maritime Services" }
    ]
  },
  {
    value: "RETAIL_WHOLESALE",
    label: "Retail & Wholesale",
    description: "Browse retail and wholesale jobs in Kenya including store management, merchandising, purchasing, retail operations, and e-commerce roles.",
    subcategories: [
      { value: "STORE_MANAGEMENT", label: "Store Management" },
      { value: "MERCHANDISING", label: "Merchandising" },
      { value: "PURCHASING", label: "Purchasing" },
      { value: "RETAIL_OPERATIONS", label: "Retail Operations" },
      { value: "E_COMMERCE", label: "E-Commerce" },
      { value: "VISUAL_MERCHANDISING", label: "Visual Merchandising" },
      { value: "SUPPLY_CHAIN_RETAIL", label: "Supply Chain" },
      { value: "LOSS_PREVENTION_RETAIL", label: "Loss Prevention" },
      { value: "CUSTOMER_SERVICE_RETAIL", label: "Customer Service" },
      { value: "WHOLESALE_OPERATIONS", label: "Wholesale Operations" }
    ]
  },
  {
    value: "BANKING_FINANCE",
    label: "Banking & Financial Services",
    description: "Find banking and financial services jobs in Kenya including retail banking, corporate banking, microfinance, investment analysis, and financial advisory roles.",
    subcategories: [
      { value: "RETAIL_BANKING", label: "Retail Banking" },
      { value: "CORPORATE_BANKING", label: "Corporate Banking" },
      { value: "MICROFINANCE", label: "Microfinance" },
      { value: "INVESTMENT_ANALYSIS", label: "Investment Analysis" },
      { value: "FINANCIAL_ADVISORY", label: "Financial Advisory" },
      { value: "LOAN_PROCESSING", label: "Loan Processing" },
      { value: "CREDIT_RISK", label: "Credit Risk" },
      { value: "BRANCH_MANAGEMENT", label: "Branch Management" },
      { value: "TREASURY_SERVICES", label: "Treasury Services" },
      { value: "COMPLIANCE_BANKING", label: "Compliance" }
    ]
  },
  {
    value: "INSURANCE",
    label: "Insurance",
    description: "Explore insurance jobs in Kenya including underwriting, claims management, actuarial science, insurance sales, and risk assessment positions.",
    subcategories: [
      { value: "UNDERWRITING", label: "Underwriting" },
      { value: "CLAIMS_MANAGEMENT", label: "Claims Management" },
      { value: "ACTUARIAL_SCIENCE", label: "Actuarial Science" },
      { value: "INSURANCE_SALES", label: "Insurance Sales" },
      { value: "RISK_ASSESSMENT_INS", label: "Risk Assessment" },
      { value: "LOSS_ADJUSTING", label: "Loss Adjusting" },
      { value: "INSURANCE_BROKERAGE", label: "Insurance Brokerage" },
      { value: "REINSURANCE", label: "Reinsurance" },
      { value: "PRODUCT_DEVELOPMENT_INS", label: "Product Development" }
    ]
  },
  {
    value: "PHARMACEUTICAL",
    label: "Pharmaceutical",
    description: "Discover pharmaceutical jobs in Kenya including pharmacology, clinical research, regulatory affairs, pharmaceutical sales, and quality assurance roles.",
    subcategories: [
      { value: "PHARMACOLOGY", label: "Pharmacology" },
      { value: "CLINICAL_RESEARCH", label: "Clinical Research" },
      { value: "REGULATORY_AFFAIRS", label: "Regulatory Affairs" },
      { value: "PHARMACEUTICAL_SALES", label: "Pharmaceutical Sales" },
      { value: "QUALITY_ASSURANCE_PHARMA", label: "Quality Assurance" },
      { value: "DRUG_SAFETY", label: "Drug Safety" },
      { value: "BIOTECHNOLOGY", label: "Biotechnology" },
      { value: "MEDICAL_AFFAIRS", label: "Medical Affairs" }
    ]
  },
  {
    value: "MANUFACTURING_PRODUCTION",
    label: "Manufacturing & Production",
    description: "Browse manufacturing and production jobs in Kenya including production management, quality control, industrial engineering, and manufacturing operations roles.",
    subcategories: [
      { value: "PRODUCTION_MANAGEMENT", label: "Production Management" },
      { value: "QUALITY_CONTROL", label: "Quality Control" },
      { value: "INDUSTRIAL_ENGINEERING_MFG", label: "Industrial Engineering" },
      { value: "MAINTENANCE_ENGINEERING", label: "Maintenance Engineering" },
      { value: "PROCESS_ENGINEERING", label: "Process Engineering" },
      { value: "PACKAGING", label: "Packaging" },
      { value: "SUPPLY_CHAIN_MFG", label: "Supply Chain" },
      { value: "HEALTH_SAFETY_MFG", label: "Health & Safety" },
      { value: "LEAN_MANUFACTURING", label: "Lean Manufacturing" },
      { value: "AUTOMATION", label: "Automation" }
    ]
  },
  {
    value: "GOVERNMENT_PUBLIC_SERVICE",
    label: "Government & Public Service",
    description: "Find government and public service jobs in Kenya including county government, national government, state corporations, regulatory authorities, and public administration roles.",
    subcategories: [
      { value: "COUNTY_GOVERNMENT", label: "County Government" },
      { value: "NATIONAL_GOVERNMENT", label: "National Government" },
      { value: "STATE_CORPORATION", label: "State Corporation" },
      { value: "REGULATORY_AUTHORITY", label: "Regulatory Authority" },
      { value: "PUBLIC_ADMINISTRATION", label: "Public Administration" },
      { value: "POLICY_ANALYSIS", label: "Policy Analysis" },
      { value: "PUBLIC_FINANCE", label: "Public Finance" },
      { value: "DIPLOMACY", label: "Diplomacy" },
      { value: "CIVIL_SERVICE", label: "Civil Service" },
      { value: "AUDIT_PUBLIC", label: "Public Audit" }
    ]
  },
  {
    value: "NGO_DEVELOPMENT",
    label: "NGO & Development",
    description: "Explore NGO and development jobs in Kenya including program management, monitoring and evaluation, humanitarian aid, community development, and international development roles.",
    subcategories: [
      { value: "PROGRAM_MANAGEMENT_NGO", label: "Program Management" },
      { value: "MONITORING_EVALUATION", label: "Monitoring & Evaluation" },
      { value: "HUMANITARIAN_AID", label: "Humanitarian Aid" },
      { value: "COMMUNITY_DEVELOPMENT_NGO", label: "Community Development" },
      { value: "INTERNATIONAL_DEVELOPMENT_NGO", label: "International Development" },
      { value: "FUNDRAISING", label: "Fundraising" },
      { value: "GRANT_MANAGEMENT", label: "Grant Management" },
      { value: "CAPACITY_BUILDING", label: "Capacity Building" },
      { value: "RESEARCH_NGO", label: "Research" },
      { value: "ADVOCACY_NGO", label: "Advocacy" }
    ]
  },
  {
    value: "CONSULTING",
    label: "Consulting",
    description: "Discover consulting jobs in Kenya including management consulting, IT consulting, strategy consulting, HR consulting, and financial advisory at top consulting firms.",
    subcategories: [
      { value: "MANAGEMENT_CONSULTING", label: "Management Consulting" },
      { value: "IT_CONSULTING", label: "IT Consulting" },
      { value: "STRATEGY_CONSULTING", label: "Strategy Consulting" },
      { value: "HR_CONSULTING_CONS", label: "HR Consulting" },
      { value: "FINANCIAL_ADVISORY_CONS", label: "Financial Advisory" },
      { value: "BUSINESS_PROCESS", label: "Business Process Consulting" },
      { value: "RISK_ADVISORY", label: "Risk Advisory" },
      { value: "DIGITAL_TRANSFORMATION", label: "Digital Transformation" }
    ]
  },
  {
    value: "RESEARCH_DEVELOPMENT",
    label: "Research & Development",
    description: "Find research and development jobs in Kenya including scientific research, R&D management, data analysis, academic research, and innovation roles.",
    subcategories: [
      { value: "SCIENTIFIC_RESEARCH", label: "Scientific Research" },
      { value: "RD_MANAGEMENT", label: "R&D Management" },
      { value: "DATA_ANALYSIS", label: "Data Analysis" },
      { value: "ACADEMIC_RESEARCH_RD", label: "Academic Research" },
      { value: "INNOVATION", label: "Innovation" },
      { value: "PRODUCT_RESEARCH", label: "Product Research" },
      { value: "MARKET_RESEARCH_RD", label: "Market Research" },
      { value: "BIOTECH_RESEARCH", label: "Biotech Research" }
    ]
  },
  {
    value: "AVIATION_AEROSPACE",
    label: "Aviation & Aerospace",
    description: "Browse aviation and aerospace jobs in Kenya including piloting, air traffic control, aircraft maintenance, airport operations, and aviation management roles.",
    subcategories: [
      { value: "PILOTING", label: "Piloting" },
      { value: "AIR_TRAFFIC_CONTROL", label: "Air Traffic Control" },
      { value: "AIRCRAFT_MAINTENANCE", label: "Aircraft Maintenance" },
      { value: "AIRPORT_OPERATIONS", label: "Airport Operations" },
      { value: "AVIATION_MANAGEMENT", label: "Aviation Management" },
      { value: "FLIGHT_DISPATCH", label: "Flight Dispatch" },
      { value: "CABIN_CREW", label: "Cabin Crew" },
      { value: "AVIATION_SAFETY", label: "Aviation Safety" },
      { value: "GROUND_HANDLING", label: "Ground Handling" }
    ]
  },
  {
    value: "MARITIME",
    label: "Maritime",
    description: "Explore maritime jobs in Kenya including marine engineering, port operations, shipping, maritime law, and naval architecture roles at the Kenyan coast.",
    subcategories: [
      { value: "MARINE_ENGINEERING_MAR", label: "Marine Engineering" },
      { value: "PORT_OPERATIONS", label: "Port Operations" },
      { value: "SHIPPING", label: "Shipping" },
      { value: "MARITIME_LAW", label: "Maritime Law" },
      { value: "NAVAL_ARCHITECTURE", label: "Naval Architecture" },
      { value: "OFFSHORE_OPERATIONS", label: "Offshore Operations" },
      { value: "FISHERIES", label: "Fisheries" }
    ]
  },
  {
    value: "FOOD_BEVERAGE",
    label: "Food & Beverage",
    description: "Discover food and beverage jobs in Kenya including food production, quality assurance, food safety, beverage production, and food technology roles.",
    subcategories: [
      { value: "FOOD_PRODUCTION", label: "Food Production" },
      { value: "QUALITY_ASSURANCE_FNB", label: "Quality Assurance" },
      { value: "FOOD_SAFETY", label: "Food Safety" },
      { value: "BEVERAGE_PRODUCTION", label: "Beverage Production" },
      { value: "FOOD_TECHNOLOGY", label: "Food Technology" },
      { value: "NUTRITION", label: "Nutrition" },
      { value: "PRODUCT_DEVELOPMENT_FNB", label: "Product Development" },
      { value: "SUPPLY_CHAIN_FNB", label: "Supply Chain" }
    ]
  },
  {
    value: "TEXTILES_FASHION",
    label: "Textiles & Fashion",
    description: "Browse textiles and fashion jobs in Kenya including textile engineering, fashion design, garment production, quality control, and textile marketing roles.",
    subcategories: [
      { value: "TEXTILE_ENGINEERING", label: "Textile Engineering" },
      { value: "FASHION_DESIGN_TEX", label: "Fashion Design" },
      { value: "GARMENT_PRODUCTION", label: "Garment Production" },
      { value: "QUALITY_CONTROL_TEX", label: "Quality Control" },
      { value: "TEXTILE_MARKETING", label: "Textile Marketing" },
      { value: "PATTERN_MAKING", label: "Pattern Making" },
      { value: "DYEING_PRINTING", label: "Dyeing & Printing" },
      { value: "MERCHANDISING_TEX", label: "Merchandising" }
    ]
  },
  {
    value: "TOURISM_HOSPITALITY_MGR",
    label: "Tourism & Hospitality Management",
    description: "Find tourism and hospitality management jobs in Kenya including destination management, tour operations, hospitality consulting, and tourism marketing roles.",
    subcategories: [
      { value: "DESTINATION_MANAGEMENT", label: "Destination Management" },
      { value: "TOUR_OPERATIONS_MGR", label: "Tour Operations" },
      { value: "HOSPITALITY_CONSULTING", label: "Hospitality Consulting" },
      { value: "TOURISM_MARKETING_MGR", label: "Tourism Marketing" },
      { value: "ECOTOURISM", label: "Ecotourism" },
      { value: "HOTEL_INVESTMENT", label: "Hotel Investment" },
      { value: "CONVENTION_SERVICES", label: "Convention Services" }
    ]
  },
  {
    value: "WASTE_MANAGEMENT",
    label: "Waste Management",
    description: "Explore waste management jobs in Kenya including waste collection, recycling, environmental compliance, landfill management, and waste-to-energy roles.",
    subcategories: [
      { value: "WASTE_COLLECTION", label: "Waste Collection" },
      { value: "RECYCLING", label: "Recycling" },
      { value: "ENVIRONMENTAL_COMPLIANCE", label: "Environmental Compliance" },
      { value: "LANDFILL_MANAGEMENT", label: "Landfill Management" },
      { value: "WASTE_TO_ENERGY", label: "Waste-to-Energy" },
      { value: "HAZARDOUS_WASTE", label: "Hazardous Waste" },
      { value: "SEWAGE_TREATMENT", label: "Sewage Treatment" }
    ]
  },
  {
    value: "DATA_AI",
    label: "Data & AI",
    description: "Discover data and artificial intelligence jobs in Kenya including data engineering, machine learning engineering, data analytics, NLP, computer vision, and AI research roles.",
    subcategories: [
      { value: "DATA_ENGINEERING", label: "Data Engineering" },
      { value: "MACHINE_LEARNING_ENGINEERING", label: "Machine Learning Engineering" },
      { value: "DATA_ANALYTICS", label: "Data Analytics" },
      { value: "NLP", label: "Natural Language Processing" },
      { value: "COMPUTER_VISION", label: "Computer Vision" },
      { value: "AI_RESEARCH", label: "AI Research" },
      { value: "DATA_GOVERNANCE", label: "Data Governance" },
      { value: "MLOPS", label: "MLOps" }
    ]
  },
  {
    value: "CYBERSECURITY_SEC",
    label: "Cybersecurity",
    description: "Browse cybersecurity jobs in Kenya including penetration testing, security operations, incident response, security architecture, and compliance roles.",
    subcategories: [
      { value: "PENETRATION_TESTING", label: "Penetration Testing" },
      { value: "SECURITY_OPERATIONS", label: "Security Operations" },
      { value: "INCIDENT_RESPONSE", label: "Incident Response" },
      { value: "SECURITY_ARCHITECTURE", label: "Security Architecture" },
      { value: "COMPLIANCE_GRC", label: "Compliance & GRC" },
      { value: "FORENSICS", label: "Digital Forensics" },
      { value: "VULNERABILITY_MANAGEMENT", label: "Vulnerability Management" },
      { value: "IDENTITY_ACCESS", label: "Identity & Access Management" }
    ]
  },
  {
    value: "ENTREPRENEURSHIP",
    label: "Entrepreneurship",
    description: "Find entrepreneurship and startup jobs in Kenya including founder roles, startup operations, venture building, business incubation, and innovation management.",
    subcategories: [
      { value: "STARTUP_FOUNDER", label: "Startup Founder" },
      { value: "STARTUP_OPERATIONS", label: "Startup Operations" },
      { value: "VENTURE_BUILDING", label: "Venture Building" },
      { value: "BUSINESS_INCUBATION", label: "Business Incubation" },
      { value: "INNOVATION_MANAGEMENT", label: "Innovation Management" },
      { value: "PRODUCT_LAUNCH", label: "Product Launch" }
    ]
  },
  {
    value: "INTERNATIONAL_RELATIONS",
    label: "International Relations",
    description: "Explore international relations jobs in Kenya including diplomacy, international development, trade policy, conflict resolution, and multilateral organization roles.",
    subcategories: [
      { value: "DIPLOMACY_IR", label: "Diplomacy" },
      { value: "INTERNATIONAL_DEVELOPMENT_IR", label: "International Development" },
      { value: "TRADE_POLICY", label: "Trade Policy" },
      { value: "CONFLICT_RESOLUTION", label: "Conflict Resolution" },
      { value: "MULTILATERAL_ORGANIZATIONS", label: "Multilateral Organizations" },
      { value: "PEACEKEEPING", label: "Peacekeeping" },
      { value: "HUMANITARIAN_COORDINATION", label: "Humanitarian Coordination" }
    ]
  }
];

export const kenyanCounties = [
  "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Uasin Gishu",
  "Kiambu", "Machakos", "Kajiado", "Laikipia", "Meru",
  "Nyeri", "Murang'a", "Kirinyaga", "Nyandarua", "Embu",
  "Tharaka Nithi", "Kitui", "Makueni", "Kwale", "Kilifi",
  "Tana River", "Lamu", "Taita Taveta", "Garissa", "Wajir",
  "Mandera", "Marsabit", "Isiolo", "Samburu", "Trans Nzoia",
  "Bungoma", "Kakamega", "Vihiga", "Bomet", "Kericho",
  "Nandi", "Baringo", "West Pokot", "Elgeyo Marakwet", "Turkana",
  "Siaya", "Homa Bay", "Migori", "Kisii", "Nyamira",
  "Narok", "Kapsabet", "Nyandarua"
];

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
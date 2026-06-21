// Fast seed script using plain JS + raw queries for remote MySQL
// Run with: DATABASE_URL='...' node scripts/seed-fast.js

const mysql = require('mysql2/promise');

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url || !url.startsWith('mysql://')) {
    console.error('DATABASE_URL must start with mysql://');
    process.exit(1);
  }

  // Parse mysql://user:pass@host:port/db
  const m = url.match(/^mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/);
  if (!m) { console.error('Bad DATABASE_URL'); process.exit(1); }
  const [, user, pass, host, port, database] = m;

  const conn = await mysql.createConnection({ host, port: +port, user, password: pass, database, supportBigNumbers: true });
  console.log('Connected to MySQL.\n');

  // ========== 1. CATEGORIES ==========
  console.log('1. Seeding 49 categories...');
  const C = require('./seed-data.cjs');
  const cats = C; // array of [value, label, [[sv, sl], ...]]

  // Batch insert categories
  const catRows = cats.map(([value, label], i) => [
    `cuid_${i}`,
    value,
    label,
    slugify(label),
    `Browse ${label.toLowerCase()} jobs in Kenya. Find verified positions, internships, and career opportunities in the ${label.toLowerCase()} sector.`,
    `${label} Jobs in Kenya - JobBoard`,
    `Explore the latest ${label.toLowerCase()} jobs in Kenya. Apply to verified positions from top employers on JobBoard Kenya.`,
    value.toLowerCase(),
    i,
  ]);

  await conn.query('START TRANSACTION');
  try {
    await conn.query(`
      INSERT INTO job_categories (id, value, label, slug, description, seo_title, seo_description, icon, sort_order, created_at, updated_at)
      VALUES ${catRows.map(() => '(?,?,?,?,?,?,?,?,?,NOW(),NOW())').join(',')}
      ON DUPLICATE KEY UPDATE
        label = VALUES(label), slug = VALUES(slug), description = VALUES(description),
        seo_title = VALUES(seo_title), seo_description = VALUES(seo_description),
        icon = VALUES(icon), sort_order = VALUES(sort_order)
    `, catRows.flat());
    await conn.query('COMMIT');
  } catch(e) { await conn.query('ROLLBACK'); throw e; }
  console.log(`   Done: ${catRows.length} categories.\n`);

  // Fetch category IDs
  const [catRecords] = await conn.query('SELECT id, value FROM job_categories ORDER BY sort_order ASC');
  const catMap = {};
  for (const r of catRecords) catMap[r.value] = r.id;

  // ========== 2. SUBCATEGORIES ==========
  console.log('2. Seeding subcategories...');
  let subCount = 0;
  const batchSize = 100;
  let subBatch = [];

  for (let i = 0; i < cats.length; i++) {
    const [value, label, subs] = cats[i];
    const catId = catMap[value];
    for (let j = 0; j < subs.length; j++) {
      const [sv, sl] = subs[j];
      subBatch.push([`sub_${i}_${j}`, sv, sl, slugify(sl), `Find ${sl.toLowerCase()} jobs in Kenya within the ${label.toLowerCase()} category.`, catId, j]);
      subCount++;

      if (subBatch.length >= batchSize) {
        await insertSubBatch(conn, subBatch);
        subBatch = [];
        process.stdout.write(`   ${subCount} subcategories...\r`);
      }
    }
  }
  if (subBatch.length > 0) await insertSubBatch(conn, subBatch);
  console.log(`   Done: ${subCount} subcategories.\n`);

  // Fetch subcategory IDs
  const [subRecords] = await conn.query('SELECT id, value FROM job_subcategories');
  const subMap = {};
  for (const r of subRecords) subMap[r.value] = r.id;

  // ========== 3. ORGANIZATIONS ==========
  console.log('3. Seeding organizations...');
  const ORGS = [
    ["Safaricom PLC","safaricom","TELECOMMUNICATIONS","PUBLIC_LISTED_COMPANY","Nairobi",1,"Safaricom is Kenya's leading telecommunications company, providing mobile voice, data, financial services (M-Pesa), and enterprise solutions to millions of Kenyans across the country and beyond."],
    ["Equity Group Holdings","equity-bank","BANKING","PUBLIC_LISTED_COMPANY","Nairobi",1,"Equity Bank is one of Kenya's largest banking groups, offering financial services to individuals, SMEs, and large corporations across East Africa."],
    ["Kenya Revenue Authority","kra","GOVERNMENT_PUBLIC_ADMIN","STATE_CORPORATION","Nairobi",1,"KRA is the principal tax collection agency of the Government of Kenya, responsible for assessment, collection, and accounting of all revenues."],
    ["UNEP Nairobi","unep-nairobi","INTERNATIONAL_DEVELOPMENT","NGO_INTERNATIONAL","Nairobi",1,"UNEP is the leading global environmental authority that sets the global environmental agenda."],
    ["Cooperative Bank of Kenya","co-op-bank","BANKING","PUBLIC_LISTED_COMPANY","Nairobi",1,"Cooperative Bank is a leading commercial bank in Kenya serving individuals, businesses, and cooperative societies."],
    ["KCB Group","kcb-group","BANKING","PUBLIC_LISTED_COMPANY","Nairobi",1,"KCB Group is the largest financial services group in East Africa."],
    ["County Gov. Mombasa","county-gov-mombasa","GOVERNMENT_PUBLIC_ADMIN","COUNTY_GOVERNMENT","Mombasa",1,"The County Government of Mombasa is responsible for local governance and development in Mombasa County."],
    ["NCBA Group","ncba-group","BANKING","PUBLIC_LISTED_COMPANY","Nairobi",1,"NCBA Group is a leading financial services provider in Kenya formed from the merger of NIC Group and CBA."],
    ["Safaricom Foundation","safaricom-foundation","NON_PROFIT","FOUNDATION","Nairobi",1,"Safaricom Foundation is the corporate social investment arm of Safaricom, focusing on health, education, and environmental programs."],
    ["Kenya Commercial Bank","kcb","BANKING","PUBLIC_LISTED_COMPANY","Nairobi",1,"KCB Bank Kenya is the largest commercial bank in the country by asset base."],
    ["Telkom Kenya","telkom-kenya","TELECOMMUNICATIONS","PRIVATE_COMPANY","Nairobi",1,"Telkom Kenya is a leading telecommunications provider offering fixed and mobile services."],
    ["KEMRI","kemri","HEALTHCARE","STATE_CORPORATION","Nairobi",1,"Kenya Medical Research Institute is a state corporation responsible for health research in Kenya."],
    ["Strathmore University","strathmore-university","EDUCATION","UNIVERSITY","Nairobi",1,"Strathmore University is a leading private university in Nairobi known for business, IT, and law programs."],
    ["Kenya Airways","kenya-airways","AVIATION","PUBLIC_LISTED_COMPANY","Nairobi",1,"Kenya Airways is the flag carrier airline of Kenya, operating regional and international flights."],
    ["UNICEF Kenya","unicef-kenya","INTERNATIONAL_DEVELOPMENT","NGO_INTERNATIONAL","Nairobi",1,"UNICEF Kenya works to protect the rights of children and women across the country."],
    ["World Bank Kenya","world-bank-kenya","INTERNATIONAL_DEVELOPMENT","NGO_INTERNATIONAL","Nairobi",1,"The World Bank Kenya office supports development projects and economic policy advisory."],
    ["KPLC","kplc","ENERGY","STATE_CORPORATION","Nairobi",1,"Kenya Power and Lighting Company is responsible for electricity transmission, distribution, and retail in Kenya."],
    ["Kengen","kengen","ENERGY","STATE_CORPORATION","Nairobi",1,"Kenya Electricity Generating Company is the leading electric power generating company in Kenya."],
    ["EAC","eac","GOVERNMENT_PUBLIC_ADMIN","REGULATORY_AUTHORITY","Arusha",1,"The East African Community is an intergovernmental organization for regional integration."],
    ["Amref Health Africa","amref-health-africa","HEALTHCARE","NGO_LOCAL","Nairobi",1,"Amref Health Africa is Africa's largest health NGO, headquartered in Nairobi."],
    ["BRCK","brck","INFORMATION_TECHNOLOGY","STARTUP","Nairobi",1,"BRCK is a Kenyan technology company building internet connectivity solutions for Africa."],
    ["Twiga Foods","twiga-foods","AGRICULTURE","STARTUP","Nairobi",1,"Twiga Foods is a mobile-enabled supply platform for fresh food in Kenya."],
    ["M-KOPA Solar","m-kopa-solar","ENERGY","STARTUP","Nairobi",1,"M-KOPA Solar provides pay-as-you-go solar energy and financing to off-grid homes."],
    ["KRA IT","kra-it","GOVERNMENT_PUBLIC_ADMIN","STATE_CORPORATION","Nairobi",0,"KRA Information Technology department handles digital tax systems and IT modernization."],
    ["Google Kenya","google-kenya","INFORMATION_TECHNOLOGY","PRIVATE_COMPANY","Nairobi",1,"Google Kenya is the regional office for Google in East Africa."],
    ["Microsoft ADC","microsoft-adc","INFORMATION_TECHNOLOGY","PRIVATE_COMPANY","Nairobi",1,"Microsoft Africa Development Centre is a world-class engineering centre in Nairobi."],
    ["I&M Bank","i-m-bank","BANKING","PRIVATE_COMPANY","Nairobi",1,"I&M Bank is a commercial bank in Kenya offering retail, corporate, and institutional banking."],
    ["Airtel Kenya","airtel-kenya","TELECOMMUNICATIONS","PRIVATE_COMPANY","Nairobi",1,"Airtel Kenya is a leading mobile network operator providing voice and data services."],
    ["Tuskys","tuskys","RETAIL","PRIVATE_COMPANY","Nairobi",0,"Tuskys is one of Kenya's largest supermarket chains."],
    ["Bamburi Cement","bamburi-cement","MANUFACTURING","PRIVATE_COMPANY","Mombasa",1,"Bamburi Cement is a leading cement manufacturer in East Africa and part of LafargeHolcim."],
  ];

  const orgRows = ORGS.map((o, i) => [
    `org_${i}`,
    o[0], o[1], null, `https://${o[1].replace(/[^a-z0-9]/g, '')}.co.ke`, o[6],
    o[2], o[3], o[4], null,
    null, null, 1, 1,
  ]);

  await conn.query(`
    INSERT INTO organizations (id, org_name, org_slug, org_logo_url, org_website, org_description, org_industry, org_type, headquarters, social_links, seo_title, seo_description, is_verified, is_active, created_at, updated_at)
    VALUES ${orgRows.map(() => '(?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(),NOW())').join(',')}
    ON DUPLICATE KEY UPDATE
      org_name = VALUES(org_name), org_description = VALUES(org_description),
      org_industry = VALUES(org_industry), org_type = VALUES(org_type),
      headquarters = VALUES(headquarters), is_verified = VALUES(is_verified)
  `, orgRows.flat());
  console.log(`   Done: ${orgRows.length} organizations.\n`);

  // Fetch org IDs
  const [orgRecords] = await conn.query('SELECT id, org_slug FROM organizations');
  const orgMap = {};
  for (const r of orgRecords) orgMap[r.org_slug] = r.id;

  // ========== 4. JOBS ==========
  console.log('4. Seeding jobs...');
  const JOBS = [
    // TECH
    {t:"Senior Software Engineer",c:"TECHNOLOGY",s:"SOFTWARE_ENGINEERING",o:"safaricom",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"SENIOR",ed:"BACHELORS",sd:"SHOW_RANGE",smin:150000,smax:350000,f:1,d:"Join Safaricom's core platform engineering team to design and build scalable backend services powering M-Pesa and other mission-critical systems serving over 50 million customers across the region. You will work with modern cloud-native technologies including Kubernetes, gRPC, and event-driven architectures to deliver high-availability financial transaction processing systems that handle millions of daily transactions. The ideal candidate has strong experience in distributed systems design, microservices architecture, and a passion for solving complex technical challenges at scale. You will mentor junior engineers, participate in architecture reviews, and contribute to the technical strategy for one of Africa's largest technology platforms."},
    {t:"Full Stack Developer",c:"TECHNOLOGY",s:"WEB_DEVELOPMENT",o:"brck",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"MID",ed:"BACHELORS",sd:"SHOW_RANGE",smin:100000,smax:250000,f:0,d:"BRCK is looking for a talented full stack developer to build and maintain our internal management dashboards and customer-facing web applications. You will work with React, Next.js, Node.js, and PostgreSQL to create responsive, performant web interfaces that help manage internet connectivity services across Africa. Experience with TypeScript, Tailwind CSS, and RESTful API design is essential. You will collaborate closely with the design and product teams in an agile environment."},
    {t:"Data Scientist",c:"TECHNOLOGY",s:"DATA_SCIENCE",o:"safaricom",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"MID",ed:"MASTERS",sd:"NEGOTIABLE",smin:null,smax:null,f:1,d:"Safaricom is seeking a Data Scientist to join our analytics team. You will leverage machine learning, statistical modeling, and data visualization to extract actionable insights from our vast datasets spanning customer behavior, network performance, and financial transactions. Proficiency in Python, SQL, and ML frameworks like TensorFlow or PyTorch is required. You will collaborate with business stakeholders to identify opportunities for data-driven decision making."},
    {t:"Cybersecurity Analyst",c:"TECHNOLOGY",s:"CYBER_SECURITY",o:"kra-it",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"MID",ed:"BACHELORS",sd:"NOT_DISCLOSED",smin:null,smax:null,f:0,d:"KRA is seeking a Cybersecurity Analyst to strengthen our digital tax systems security posture. You will conduct vulnerability assessments, incident response, security monitoring, and implement security controls for our online tax filing platforms. Relevant certifications such as CEH, CISSP, or CompTIA Security+ are highly valued. Experience with SIEM tools, penetration testing, and cloud security is essential."},
    {t:"DevOps Engineer",c:"TECHNOLOGY",s:"DEVOPS_CLOUD",o:"microsoft-adc",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"SENIOR",ed:"BACHELORS",sd:"SHOW_RANGE",smin:200000,smax:400000,f:0,d:"Microsoft Africa Development Centre is hiring a DevOps Engineer to design and implement CI/CD pipelines, manage cloud infrastructure on Azure, and automate deployment processes. You will work with Kubernetes, Terraform, and GitHub Actions to ensure reliable and efficient software delivery. Strong experience with Azure services, containerization, and infrastructure-as-code is required."},
    {t:"Mobile App Developer",c:"TECHNOLOGY",s:"MOBILE_DEVELOPMENT",o:"equity-bank",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"MID",ed:"BACHELORS",sd:"SHOW_RANGE",smin:120000,smax:280000,f:0,d:"Equity Bank is looking for a Mobile App Developer to build and enhance our mobile banking applications used by millions of customers. You will work with React Native or Flutter to deliver cross-platform mobile experiences, integrating with our backend APIs and ensuring a seamless user experience across devices. Knowledge of mobile security best practices, offline-first architecture, and payment integration is important."},
    {t:"IT Support Specialist",c:"TECHNOLOGY",s:"IT_SUPPORT",o:"kcb-group",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"ENTRY",ed:"DIPLOMA",sd:"SHOW_RANGE",smin:40000,smax:80000,f:0,d:"KCB Group is seeking an IT Support Specialist to provide technical assistance to our branch network. You will troubleshoot hardware and software issues, manage Active Directory, maintain endpoints, and ensure IT operations run smoothly across multiple locations. CompTIA A+ certification and experience with enterprise IT environments is preferred."},
    // FINANCE
    {t:"Financial Analyst",c:"FINANCE_ACCOUNTING",s:"FINANCIAL_ANALYSIS",o:"kcb-group",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"MID",ed:"BACHELORS",sd:"SHOW_RANGE",smin:100000,smax:200000,f:1,d:"KCB Group is seeking a Financial Analyst to support strategic decision-making through financial modeling, variance analysis, and business performance reporting. You will prepare management reports, analyze revenue trends, and provide recommendations to senior leadership. CFA or CPA qualification is preferred. Strong proficiency in Excel, financial modeling, and data analysis tools is essential."},
    {t:"Senior Accountant",c:"FINANCE_ACCOUNTING",s:"ACCOUNTING",o:"ncba-group",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"SENIOR",ed:"BACHELORS",sd:"SHOW_RANGE",smin:120000,smax:250000,f:0,d:"NCBA Group is looking for a Senior Accountant to manage financial reporting, ensure compliance with IFRS standards, and oversee month-end and year-end closing processes. You will lead the preparation of financial statements, coordinate with external auditors, and mentor junior accounting staff. CPA (K) qualification and at least 5 years of post-qualification experience in banking or financial services is required."},
    {t:"Audit Manager",c:"FINANCE_ACCOUNTING",s:"AUDIT",o:"kra",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"SENIOR",ed:"BACHELORS",sd:"NEGOTIABLE",smin:null,smax:null,f:0,d:"KRA is seeking an Audit Manager to lead internal audit engagements across the authority's departments. You will develop audit plans, assess risk management frameworks, and report findings to the audit committee. CPA (K) and CIA certification are required. Experience in public sector auditing or tax administration is highly valued."},
    {t:"Risk & Compliance Officer",c:"FINANCE_ACCOUNTING",s:"RISK_COMPLIANCE",o:"co-op-bank",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"MID",ed:"BACHELORS",sd:"SHOW_RANGE",smin:100000,smax:180000,f:0,d:"Cooperative Bank is hiring a Risk & Compliance Officer to implement and monitor the bank's risk management framework. You will conduct risk assessments, ensure regulatory compliance with CBK guidelines, and prepare compliance reports. Knowledge of AML/CFT regulations, Basel III requirements, and enterprise risk management is essential."},
    // MARKETING
    {t:"Digital Marketing Manager",c:"MARKETING_COMMUNICATIONS",s:"DIGITAL_MARKETING",o:"safaricom",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"SENIOR",ed:"BACHELORS",sd:"SHOW_RANGE",smin:150000,smax:300000,f:1,d:"Safaricom is looking for a Digital Marketing Manager to lead our online marketing campaigns, manage digital advertising budgets, and optimize customer acquisition channels. You will oversee SEO/SEM, social media marketing, email campaigns, and content strategy. Experience with marketing analytics tools, A/B testing, and budget management of KES 50M+ is essential."},
    {t:"Content Marketing Strategist",c:"MARKETING_COMMUNICATIONS",s:"CONTENT_MARKETING",o:"google-kenya",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"MID",ed:"BACHELORS",sd:"NOT_DISCLOSED",smin:null,smax:null,f:0,d:"Google Kenya is seeking a Content Marketing Strategist to develop and execute content programs that drive brand awareness and engagement in the East African market. You will create content calendars, manage editorial processes, and collaborate with cross-functional teams. Strong writing skills and experience with content management systems, SEO, and social media analytics is required."},
    {t:"Brand Manager",c:"MARKETING_COMMUNICATIONS",s:"BRAND_MANAGEMENT",o:"kcb-group",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"SENIOR",ed:"BACHELORS",sd:"SHOW_RANGE",smin:180000,smax:350000,f:0,d:"KCB Group is looking for a Brand Manager to develop and execute brand strategies across our product portfolio. You will manage brand positioning, oversee creative campaigns, and ensure brand consistency across all touchpoints. Experience in financial services brand management and working with creative agencies is preferred."},
    // HR
    {t:"HR Business Partner",c:"HUMAN_RESOURCES",s:"HR_GENERALIST",o:"safaricom",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"SENIOR",ed:"BACHELORS",sd:"SHOW_RANGE",smin:150000,smax:300000,f:0,d:"Safaricom is seeking an HR Business Partner to serve as a strategic advisor to business leaders on people matters. You will drive talent management, succession planning, organizational design, and employee engagement initiatives. CIPD or CHRP qualification and 7+ years of HR experience in large organizations is required."},
    {t:"Recruitment Specialist",c:"HUMAN_RESOURCES",s:"RECRUITMENT",o:"equity-bank",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"MID",ed:"BACHELORS",sd:"SHOW_RANGE",smin:80000,smax:150000,f:0,d:"Equity Bank is looking for a Recruitment Specialist to manage the end-to-end recruitment process for various roles across the bank. You will source candidates, conduct interviews, manage the applicant tracking system, and ensure a positive candidate experience. Experience with recruitment in the banking sector and knowledge of Kenyan labor laws is essential."},
    // ENGINEERING
    {t:"Civil Engineer - Infrastructure Projects",c:"ENGINEERING",s:"CIVIL_ENGINEERING",o:"kenya-airways",ct:"Nairobi",ci:"Nairobi",et:"CONTRACT",el:"SENIOR",ed:"BACHELORS",sd:"SHOW_RANGE",smin:150000,smax:300000,f:0,d:"Kenya Airways is seeking a Civil Engineer to manage airport infrastructure projects including runway maintenance, terminal expansions, and facility upgrades. You will oversee construction activities, ensure compliance with aviation safety standards, and coordinate with government agencies. Registration with EBK and at least 8 years of experience in civil engineering projects is required."},
    {t:"Mechanical Engineer - Plant Maintenance",c:"ENGINEERING",s:"MECHANICAL_ENGINEERING",o:"bamburi-cement",ct:"Mombasa",ci:"Mombasa",et:"FULL_TIME",el:"MID",ed:"BACHELORS",sd:"SHOW_RANGE",smin:100000,smax:200000,f:0,d:"Bamburi Cement is looking for a Mechanical Engineer to oversee maintenance of cement manufacturing equipment including kilns, grinders, and conveyor systems. You will develop preventive maintenance schedules, manage spare parts inventory, and lead a team of technicians. Experience in heavy industrial plant maintenance and knowledge of CMMS is essential."},
    {t:"Electrical Engineer - Power Systems",c:"ENGINEERING",s:"ELECTRICAL_ENGINEERING",o:"kplc",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"MID",ed:"BACHELORS",sd:"SHOW_RANGE",smin:100000,smax:220000,f:1,d:"Kenya Power is seeking an Electrical Engineer to design and maintain power distribution systems. You will conduct load flow analysis, plan network expansions, and ensure reliable electricity supply to customers. Registration with ERB and experience in power distribution network design is required."},
    // HEALTHCARE
    {t:"Registered Nurse - ICU",c:"HEALTHCARE",s:"NURSING",o:"kemri",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"MID",ed:"DIPLOMA",sd:"SHOW_RANGE",smin:60000,smax:120000,f:0,d:"KEMRI is seeking a Registered Nurse with ICU experience to join our clinical research team. You will provide patient care during clinical trials, collect research samples, and maintain clinical documentation. NCK registration and BLS/ACLS certification are required. Experience in clinical research settings is an added advantage."},
    {t:"Medical Officer",c:"HEALTHCARE",s:"MEDICAL_DOCTOR",o:"amref-health-africa",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"MID",ed:"BACHELORS",sd:"NEGOTIABLE",smin:null,smax:null,f:0,d:"Amref Health Africa is looking for a Medical Officer to support our community health programs across Kenya. You will provide clinical services, train community health workers, and contribute to health system strengthening initiatives. Registration with KMPDB and a valid practicing license are required. Experience in public health or community medicine is preferred."},
    {t:"Pharmacist",c:"HEALTHCARE",s:"PHARMACY",o:"kenya-airways",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"MID",ed:"BACHELORS",sd:"SHOW_RANGE",smin:80000,smax:160000,f:0,d:"Kenya Airways is seeking a Pharmacist to manage our occupational health clinic's pharmaceutical services. You will ensure proper drug dispensing, maintain pharmacy inventory, and comply with regulatory requirements. PPCB registration and experience in occupational health pharmacy is preferred."},
    // EDUCATION
    {t:"Lecturer - Computer Science",c:"EDUCATION",s:"LECTURING",o:"strathmore-university",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"SENIOR",ed:"DOCTORATE",sd:"SHOW_RANGE",smin:180000,smax:400000,f:1,d:"Strathmore University is seeking a Lecturer in Computer Science to teach undergraduate and graduate courses in software engineering, data structures, and algorithms. You will conduct research, supervise student projects, and contribute to curriculum development. A PhD in Computer Science or related field and publications in peer-reviewed journals are required."},
    {t:"Curriculum Developer",c:"EDUCATION",s:"CURRICULUM_DEVELOPMENT",o:"kemri",ct:"Nairobi",ci:"Nairobi",et:"CONTRACT",el:"MID",ed:"MASTERS",sd:"SHOW_RANGE",smin:120000,smax:250000,f:0,d:"KEMRI is seeking a Curriculum Developer to design training materials for our health research capacity building programs. You will work with subject matter experts to create competency-based curricula for various health research disciplines. Experience in curriculum design, adult learning principles, and health sciences education is essential."},
    // GOVERNMENT
    {t:"Policy Analyst - Trade",c:"GOVERNMENT_PUBLIC_SECTOR",s:"POLICY_ANALYSIS",o:"eac",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"MID",ed:"MASTERS",sd:"NEGOTIABLE",smin:null,smax:null,f:0,d:"The East African Community is seeking a Policy Analyst to research and analyze trade policy issues affecting the East African region. You will prepare policy briefs, support inter-governmental negotiations, and monitor implementation of the EAC Common Market Protocol. A master's degree in economics, public policy, or international relations is required."},
    {t:"County Finance Officer",c:"GOVERNMENT_PUBLIC_SECTOR",s:"PUBLIC_ADMINISTRATION",o:"county-gov-mombasa",ct:"Mombasa",ci:"Mombasa",et:"FULL_TIME",el:"SENIOR",ed:"BACHELORS",sd:"SHOW_RANGE",smin:120000,smax:200000,f:0,d:"The County Government of Mombasa is seeking a County Finance Officer to oversee budget preparation, financial management, and reporting for county departments. You will ensure compliance with the Public Finance Management Act and coordinate with the Controller of Budget. CPA (K) qualification and experience in county government financial management is required."},
    // INTERNATIONAL DEV
    {t:"Program Manager - Health Systems",c:"INTERNATIONAL_DEVELOPMENT",s:"DEVELOPMENT_PROGRAMS",o:"unicef-kenya",ct:"Nairobi",ci:"Nairobi",et:"CONTRACT",el:"SENIOR",ed:"MASTERS",sd:"NOT_DISCLOSED",smin:null,smax:null,f:1,d:"UNICEF Kenya is seeking a Program Manager to lead our health systems strengthening program across Kenya. You will manage a multi-million dollar portfolio, coordinate with government counterparts, and ensure program deliverables are met on time and within budget. A master's degree in public health, health policy, or related field and 8+ years of program management experience in international development is required."},
    {t:"M&E Specialist",c:"INTERNATIONAL_DEVELOPMENT",s:"MONITORING_EVALUATION",o:"world-bank-kenya",ct:"Nairobi",ci:"Nairobi",et:"CONTRACT",el:"MID",ed:"MASTERS",sd:"NOT_DISCLOSED",smin:null,smax:null,f:0,d:"The World Bank Kenya office is seeking an M&E Specialist to design and implement monitoring and evaluation frameworks for development projects. You will conduct baseline and endline surveys, analyze program data, and prepare evaluation reports for stakeholders. Strong quantitative research skills and experience with M&E tools is required."},
    // AGRICULTURE
    {t:"Agronomist - Crop Research",c:"AGRICULTURE",s:"AGRONOMY",o:"kemri",ct:"Kakamega",ci:"Kakamega",et:"FULL_TIME",el:"MID",ed:"BACHELORS",sd:"SHOW_RANGE",smin:60000,smax:120000,f:0,d:"KEMRI is seeking an Agronomist to lead crop research initiatives focusing on food security and nutrition in western Kenya. You will design and implement field trials, collect and analyze data, and provide technical advice to smallholder farmers. A degree in agronomy, crop science, or related field and experience in agricultural research is required."},
    {t:"Farm Manager",c:"AGRICULTURE",s:"FARM_MANAGEMENT",o:"twiga-foods",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"SENIOR",ed:"BACHELORS",sd:"SHOW_RANGE",smin:100000,smax:200000,f:0,d:"Twiga Foods is looking for a Farm Manager to oversee our network of outgrower farmers. You will coordinate production planning, quality control, and logistics for fresh produce supply chains. Experience in agricultural supply chain management, farmer training, and agribusiness operations is essential."},
    // LEGAL
    {t:"Corporate Lawyer",c:"LEGAL",s:"CORPORATE_LAW",o:"safaricom",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"SENIOR",ed:"BACHELORS",sd:"SHOW_RANGE",smin:200000,smax:450000,f:0,d:"Safaricom is seeking a Corporate Lawyer to provide legal advice on commercial transactions, regulatory compliance, and corporate governance matters. You will draft and negotiate contracts, manage litigation matters, and advise on telecoms regulatory issues. LLB, postgraduate diploma in law, and admission to the Kenyan Bar with 7+ years of corporate law experience is required."},
    {t:"Compliance Officer - Banking",c:"LEGAL",s:"COMPLIANCE_OFFICER",o:"equity-bank",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"MID",ed:"BACHELORS",sd:"SHOW_RANGE",smin:100000,smax:200000,f:0,d:"Equity Bank is looking for a Compliance Officer to ensure adherence to banking regulations, anti-money laundering requirements, and internal policies. You will conduct compliance assessments, prepare regulatory reports, and provide compliance training to staff. Knowledge of CBK prudential guidelines, AML/CFT regulations, and risk-based compliance approaches is required."},
    // HOSPITALITY
    {t:"Hotel General Manager",c:"HOSPITALITY",s:"HOTEL_MANAGEMENT",o:"kenya-airways",ct:"Mombasa",ci:"Mombasa",et:"FULL_TIME",el:"EXECUTIVE",ed:"BACHELORS",sd:"NEGOTIABLE",smin:null,smax:null,f:0,d:"A leading hotel chain in Mombasa is seeking a General Manager to oversee all hotel operations including guest services, revenue management, and staff development. You will drive profitability, maintain brand standards, and ensure exceptional guest experiences. A degree in hospitality management and 10+ years of progressive hotel management experience is required."},
    {t:"Executive Chef",c:"HOSPITALITY",s:"CHEF_COOKING",o:"kenya-airways",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"SENIOR",ed:"DIPLOMA",sd:"SHOW_RANGE",smin:80000,smax:180000,f:0,d:"A premium Nairobi hotel is seeking an Executive Chef to lead the culinary team across multiple dining outlets. You will create menus, manage food costs, ensure food safety compliance, and mentor kitchen staff. Professional culinary qualifications and 8+ years of experience in upscale hospitality environments is required."},
    // CREATIVE
    {t:"Senior Graphic Designer",c:"CREATIVE_DESIGN",s:"GRAPHIC_DESIGN",o:"safaricom",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"MID",ed:"DIPLOMA",sd:"SHOW_RANGE",smin:80000,smax:180000,f:0,d:"Safaricom is seeking a Senior Graphic Designer to create visual content for marketing campaigns, product launches, and brand communications. You will work across digital and print media, developing designs that resonate with diverse Kenyan audiences. Proficiency in Adobe Creative Suite, motion graphics, and brand design principles is required."},
    {t:"UX/UI Designer",c:"CREATIVE_DESIGN",s:"UX_UI_DESIGN",o:"brck",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"MID",ed:"BACHELORS",sd:"SHOW_RANGE",smin:100000,smax:200000,f:0,d:"BRCK is looking for a UX/UI Designer to design intuitive user interfaces for our connectivity platforms and mobile applications. You will conduct user research, create wireframes and prototypes, and collaborate with developers to implement designs. Experience with Figma, user-centered design methodologies, and designing for African markets is preferred."},
    // SUPPLY CHAIN
    {t:"Procurement Manager",c:"SUPPLY_CHAIN",s:"PROCUREMENT",o:"kplc",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"SENIOR",ed:"BACHELORS",sd:"SHOW_RANGE",smin:150000,smax:280000,f:0,d:"Kenya Power is seeking a Procurement Manager to oversee the procurement of materials, equipment, and services for power infrastructure projects. You will manage the tendering process, negotiate contracts, and ensure value for money in procurement activities. CIPS qualification and experience in public procurement in Kenya is required."},
    {t:"Warehouse Supervisor",c:"SUPPLY_CHAIN",s:"WAREHOUSING",o:"twiga-foods",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"MID",ed:"DIPLOMA",sd:"SHOW_RANGE",smin:40000,smax:80000,f:0,d:"Twiga Foods is looking for a Warehouse Supervisor to manage daily warehouse operations including receiving, storage, and dispatch of fresh produce. You will maintain inventory accuracy, oversee warehouse staff, and ensure food safety standards. Experience in cold chain logistics and warehouse management systems is preferred."},
    // AVIATION
    {t:"Air Traffic Controller",c:"AVIATION",s:"AIR_TRAFFIC_CONTROL_AVIATION",o:"kenya-airways",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"SENIOR",ed:"DIPLOMA",sd:"SHOW_RANGE",smin:180000,smax:350000,f:0,d:"The Kenya Civil Aviation Authority is seeking Air Traffic Controllers to manage air traffic at JKIA and regional airports. You will provide air traffic control services, ensure safety of aircraft operations, and coordinate with neighboring flight information regions. ICAO-rated ATC license and experience in approach and area control is required."},
    {t:"Aircraft Maintenance Engineer",c:"AVIATION",s:"AIRCRAFT_MAINTENANCE",o:"kenya-airways",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"SENIOR",ed:"DIPLOMA",sd:"SHOW_RANGE",smin:150000,smax:300000,f:0,d:"Kenya Airways is seeking an Aircraft Maintenance Engineer to perform scheduled and unscheduled maintenance on our fleet of Boeing and Embraer aircraft. You will conduct inspections, troubleshoot defects, and certify maintenance work. ICAO Type II license and rating on B737 or E190 aircraft is required."},
    // ENVIRONMENTAL
    {t:"Environmental Impact Assessor",c:"ENVIRONMENTAL_SUSTAINABILITY",s:"ENVIRONMENTAL_IMPACT",o:"unep-nairobi",ct:"Nairobi",ci:"Nairobi",et:"CONTRACT",el:"MID",ed:"MASTERS",sd:"NOT_DISCLOSED",smin:null,smax:null,f:0,d:"UNEP is seeking an Environmental Impact Assessor to conduct environmental and social impact assessments for development projects in East Africa. You will review EIA reports, conduct field assessments, and provide recommendations for environmental management plans. Registration with NEMA as a lead EIA expert and a degree in environmental science or related field is required."},
    // MANUFACTURING
    {t:"Production Manager",c:"MANUFACTURING",s:"PRODUCTION_MANAGEMENT",o:"bamburi-cement",ct:"Mombasa",ci:"Mombasa",et:"FULL_TIME",el:"SENIOR",ed:"BACHELORS",sd:"SHOW_RANGE",smin:150000,smax:300000,f:0,d:"Bamburi Cement is seeking a Production Manager to oversee cement manufacturing operations. You will manage production schedules, ensure quality control, optimize processes, and lead a team of shift supervisors and operators. Experience in cement or heavy manufacturing, knowledge of lean manufacturing principles, and strong leadership skills are required."},
    // RETAIL
    {t:"Store Manager",c:"RETAIL",s:"RETAIL_MANAGEMENT",o:"tuskys",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"MID",ed:"DIPLOMA",sd:"SHOW_RANGE",smin:50000,smax:100000,f:0,d:"Tuskys is seeking a Store Manager to oversee daily supermarket operations including sales, customer service, inventory management, and staff supervision. You will drive sales targets, ensure merchandising standards, and manage store budgets. Experience in retail management and knowledge of POS systems is required."},
    // NONPROFIT
    {t:"Program Officer - Education",c:"NONPROFIT",s:"PROGRAM_DEVELOPMENT",o:"safaricom-foundation",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"MID",ed:"BACHELORS",sd:"SHOW_RANGE",smin:80000,smax:150000,f:0,d:"Safaricom Foundation is seeking a Program Officer to manage our education programs across Kenya. You will design and implement scholarship programs, school infrastructure projects, and digital literacy initiatives. Experience in program management in the NGO sector and knowledge of the Kenyan education system is preferred."},
    {t:"Social Worker - Community Programs",c:"NONPROFIT",s:"SOCIAL_WORK",o:"amref-health-africa",ct:"Kisumu",ci:"Kisumu",et:"FULL_TIME",el:"ENTRY",ed:"DIPLOMA",sd:"SHOW_RANGE",smin:35000,smax:70000,f:0,d:"Amref Health Africa is looking for a Social Worker to support community health programs in Kisumu County. You will conduct community needs assessments, facilitate support groups, and connect community members with health and social services. A diploma in social work and registration with a professional body is required."},
    // ENERGY
    {t:"Renewable Energy Engineer",c:"ENERGY_UTILITIES",s:"RENEWABLE_ENERGY_UTILITIES",o:"kengen",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"MID",ed:"BACHELORS",sd:"SHOW_RANGE",smin:100000,smax:220000,f:1,d:"Kengen is seeking a Renewable Energy Engineer to work on geothermal, wind, and solar energy projects across Kenya. You will conduct feasibility studies, design renewable energy systems, and oversee project implementation. Registration with EBK and experience in renewable energy project development is required."},
    // INSURANCE
    {t:"Underwriting Manager",c:"INSURANCE",s:"UNDERWRITING",o:"ncba-group",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"SENIOR",ed:"BACHELORS",sd:"SHOW_RANGE",smin:150000,smax:300000,f:0,d:"NCBA Group is seeking an Underwriting Manager to lead the underwriting function for our insurance division. You will develop underwriting policies, assess risk portfolios, and ensure profitability of underwritten business. AKI certification and 8+ years of underwriting experience in the Kenyan insurance market is required."},
    // REAL ESTATE
    {t:"Property Manager",c:"REAL_ESTATE",s:"PROPERTY_MANAGEMENT",o:"i-m-bank",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"MID",ed:"BACHELORS",sd:"SHOW_RANGE",smin:80000,smax:160000,f:0,d:"I&M Bank is seeking a Property Manager to oversee our real estate portfolio including commercial and residential properties. You will manage tenant relations, coordinate maintenance, prepare financial reports, and ensure optimal occupancy rates. A degree in real estate management, valuation, or related field and experience in property management is required."},
    // TELECOM
    {t:"Network Engineer - 5G Rollout",c:"TELECOMMUNICATIONS",s:"NETWORK_ENGINEERING_TELECOM",o:"safaricom",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"SENIOR",ed:"BACHELORS",sd:"SHOW_RANGE",smin:180000,smax:350000,f:1,d:"Safaricom is seeking a Network Engineer to lead the planning and deployment of our 5G network infrastructure across Kenya. You will design network architectures, conduct RF planning, and coordinate with vendors for equipment deployment. Experience in mobile network planning, 4G/5G technologies, and network optimization is required."},
    {t:"Telecom Sales Manager",c:"TELECOMMUNICATIONS",s:"TELECOM_SALES",o:"airtel-kenya",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"MID",ed:"BACHELORS",sd:"SHOW_RANGE",smin:100000,smax:250000,f:0,d:"Airtel Kenya is looking for a Telecom Sales Manager to drive enterprise sales of connectivity solutions, cloud services, and managed network services. You will manage key accounts, develop sales strategies, and achieve revenue targets. Experience in B2B telecom sales and knowledge of enterprise communication solutions is required."},
    // CUSTOMER SERVICE
    {t:"Customer Experience Manager",c:"CUSTOMER_SERVICE",s:"CUSTOMER_EXPERIENCE",o:"safaricom",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"SENIOR",ed:"BACHELORS",sd:"SHOW_RANGE",smin:120000,smax:250000,f:0,d:"Safaricom is seeking a Customer Experience Manager to design and implement customer experience strategies across all touchpoints. You will analyze customer feedback, identify pain points, and drive improvements to enhance customer satisfaction and loyalty. Experience in CX management, NPS programs, and customer journey mapping is essential."},
    // OPERATIONS
    {t:"Operations Manager - Logistics",c:"OPERATIONS_ADMIN",s:"OPERATIONS_MANAGEMENT",o:"twiga-foods",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"SENIOR",ed:"BACHELORS",sd:"SHOW_RANGE",smin:120000,smax:250000,f:0,d:"Twiga Foods is seeking an Operations Manager to oversee logistics operations including route planning, fleet management, and delivery performance. You will optimize supply chain operations, manage vendor relationships, and drive cost efficiency. Experience in logistics operations management and knowledge of the Kenyan transport network is required."},
    // ARCHITECTURE
    {t:"Architect - Commercial Projects",c:"ARCHITECTURE_CONSTRUCTION",s:"ARCHITECTURE",o:"county-gov-mombasa",ct:"Mombasa",ci:"Mombasa",et:"CONTRACT",el:"SENIOR",ed:"BACHELORS",sd:"SHOW_RANGE",smin:150000,smax:300000,f:0,d:"The County Government of Mombasa is seeking an Architect to design and supervise commercial building projects within the county. You will prepare architectural drawings, ensure compliance with building codes, and manage construction supervision. Registration with BORAQS and a portfolio of commercial building projects is required."},
    // SCIENCE
    {t:"Research Scientist - Epidemiology",c:"SCIENCE_RESEARCH",s:"CLINICAL_RESEARCH",o:"kemri",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"SENIOR",ed:"DOCTORATE",sd:"NOT_DISCLOSED",smin:null,smax:null,f:1,d:"KEMRI is seeking a Research Scientist to lead epidemiological studies on infectious diseases in Kenya. You will design research protocols, analyze epidemiological data, publish findings, and mentor junior researchers. A PhD in epidemiology, public health, or related field and a strong publication record is required."},
    // CONSULTING
    {t:"Management Consultant",c:"CONSULTING",s:"MANAGEMENT_CONSULTING",o:"kcb-group",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"MID",ed:"MASTERS",sd:"SHOW_RANGE",smin:150000,smax:300000,f:0,d:"KCB Group is seeking a Management Consultant to support organizational transformation and strategic improvement initiatives. You will conduct diagnostic assessments, develop recommendations, and support implementation of change programs. An MBA from a recognized institution and experience in management consulting or strategy roles is required."},
    // SECURITY
    {t:"Security Operations Manager",c:"SECURITY_SERVICES",s:"SECURITY_MANAGEMENT",o:"kplc",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"SENIOR",ed:"BACHELORS",sd:"SHOW_RANGE",smin:120000,smax:220000,f:0,d:"Kenya Power is seeking a Security Operations Manager to oversee physical and cyber security operations across the organization's facilities nationwide. You will develop security policies, manage security personnel, and coordinate with law enforcement agencies. Experience in corporate security management and relevant security certifications are required."},
    // TRANSPORTATION
    {t:"Fleet Manager",c:"TRANSPORTATION",s:"FLEET_MANAGEMENT",o:"twiga-foods",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"MID",ed:"DIPLOMA",sd:"SHOW_RANGE",smin:80000,smax:150000,f:0,d:"Twiga Foods is looking for a Fleet Manager to manage our delivery fleet of refrigerated trucks. You will oversee vehicle maintenance, route optimization, driver management, and fuel cost control. Experience in fleet management, knowledge of transport regulations, and a valid driving license are required."},
    // MINING
    {t:"Mining Engineer",c:"MINING_RESOURCES",s:"MINING_ENGINEERING",o:"bamburi-cement",ct:"Kajiado",ci:"Kajiado",et:"FULL_TIME",el:"SENIOR",ed:"BACHELORS",sd:"SHOW_RANGE",smin:150000,smax:300000,f:0,d:"A leading mining company in Kajiado is seeking a Mining Engineer to plan and oversee mining operations. You will design mine plans, ensure safety compliance, optimize extraction processes, and manage mining teams. Registration with ERB, a degree in mining engineering, and experience in open-pit mining operations is required."},
    // ENTERTAINMENT
    {t:"Events Manager",c:"ENTERTAINMENT",s:"EVENTS_MANAGEMENT",o:"safaricom",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"MID",ed:"BACHELORS",sd:"SHOW_RANGE",smin:80000,smax:180000,f:0,d:"Safaricom is seeking an Events Manager to plan and execute corporate events, sponsorships, and brand activations across Kenya. You will manage event budgets, coordinate with vendors, and ensure seamless execution of events that strengthen brand positioning. Experience in corporate event management and strong project management skills are required."},
    // FASHION
    {t:"Fashion Designer",c:"FASHION_BEAUTY",s:"FASHION_DESIGN_BEAUTY",o:"safaricom",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"MID",ed:"DIPLOMA",sd:"NEGOTIABLE",smin:null,smax:null,f:0,d:"A leading Kenyan fashion house is seeking a Fashion Designer to create contemporary designs for our ready-to-wear and bespoke collections. You will research trends, develop design concepts, create technical drawings, and oversee production. A diploma or degree in fashion design and a strong portfolio of original designs is required."},
    // SPORTS
    {t:"Sports Coach - Athletics",c:"SPORTS_RECREATION",s:"SPORTS_COACHING",o:"county-gov-mombasa",ct:"Mombasa",ci:"Mombasa",et:"FULL_TIME",el:"MID",ed:"DIPLOMA",sd:"SHOW_RANGE",smin:40000,smax:80000,f:0,d:"The County Government of Mombasa is seeking a Sports Coach to develop and implement athletics training programs for youth in the county. You will identify and nurture talent, organize competitions, and coordinate with national sports organizations. Coaching certifications from recognized athletics bodies and experience in talent development is required."},
    // MEDIA
    {t:"Journalist - Business News",c:"MEDIA_PUBLISHING",s:"JOURNALISM",o:"kcb-group",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"MID",ed:"BACHELORS",sd:"SHOW_RANGE",smin:80000,smax:180000,f:0,d:"A leading media house is seeking a Business News Journalist to cover financial markets, corporate news, and economic policy in Kenya. You will conduct interviews, write articles, and produce multimedia content for print and digital platforms. A degree in journalism, communications, or finance and experience in business reporting is required."},
    // PSYCHOLOGY
    {t:"Clinical Psychologist",c:"PSYCHOLOGY_COUNSELING",s:"CLINICAL_PSYCHOLOGY",o:"amref-health-africa",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"MID",ed:"MASTERS",sd:"SHOW_RANGE",smin:80000,smax:160000,f:0,d:"Amref Health Africa is seeking a Clinical Psychologist to provide mental health services in our community health programs. You will conduct psychological assessments, provide therapy, develop treatment plans, and train community health workers in basic psychosocial support. Registration with KCPA and a master's degree in clinical psychology is required."},
    // SKILLED TRADES
    {t:"Electrician - Industrial",c:"SKILLED_TRADES",s:"ELECTRICIAN",o:"bamburi-cement",ct:"Mombasa",ci:"Mombasa",et:"FULL_TIME",el:"MID",ed:"CERTIFICATE",sd:"SHOW_RANGE",smin:40000,smax:80000,f:0,d:"Bamburi Cement is seeking a qualified Industrial Electrician to install, maintain, and repair electrical systems in our cement manufacturing plant. You will work on high-voltage systems, motor controls, and PLC-based automation. A valid electrical wireman license and experience in industrial electrical systems is required."},
    // PERSONAL SERVICES
    {t:"Personal Assistant to CEO",c:"PERSONAL_SERVICES",s:"PERSONAL_ASSISTANT",o:"google-kenya",ct:"Nairobi",ci:"Nairobi",et:"FULL_TIME",el:"MID",ed:"BACHELORS",sd:"NEGOTIABLE",smin:null,smax:null,f:0,d:"Google Kenya is seeking a Personal Assistant to the CEO to manage executive schedules, coordinate meetings, handle correspondence, and ensure smooth daily operations. You will maintain confidentiality, prioritize tasks, and liaise with internal and external stakeholders. A degree in business administration and 3+ years of EA experience in corporate environments is required."},
  ];

  const counties = ["Nairobi","Mombasa","Kisumu","Nakuru","Uasin Gishu","Kiambu","Machakos","Meru","Kakamega","Kilifi","Nyeri","Embu","Mandera","Marsabit","Garissa","Isiolo","Kitui","Lamu","Taita Taveta","Turkana","West Pokot","Samburu","Trans Nzoia","Baringo","Elgeyo Marakwet","Nandi","Bomet","Kericho","Bungoma","Busia","Siaya","Homa Bay","Migori","Kisii","Nyamira","Narok","Kajiado","Laikipia","Nyeri","Murang'a","Kirinyaga","Nyandarua","Vihiga","Wajir"];

  let jobInsertCount = 0;
  const now = new Date();
  for (const j of JOBS) {
    const catId = catMap[j.c];
    const subId = subMap[j.s];
    const orgId = orgMap[j.o];
    if (!catId || !subId || !orgId) { console.log(`   SKIP: ${j.t} (cat:${!!catId} sub:${!!subId} org:${!!orgId})`); continue; }
    const daysAgo = Math.floor(Math.random() * 14);
    const deadlineOffset = 15 + Math.floor(Math.random() * 30);
    const slug = slugify(j.t) + '-' + Math.random().toString(36).slice(2, 7);
    const searchText = [j.t, j.d, j.o, j.ci, j.ct].filter(Boolean).join(' ');
    const datePosted = new Date(now.getTime() - daysAgo * 86400000);
    const deadline = new Date(now.getTime() + deadlineOffset * 86400000);
    await conn.query(`
      INSERT INTO jobs (id, organization_id, subcategory_id, category_id, title, slug, description, employment_type, experience_level, education_level, location_city, location_county, is_remote, salary_disclosure, salary_min, salary_max, salary_currency, status, featured, date_posted, deadline, search_text, job_source, created_at, updated_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(),NOW())
    `, [`job_${jobInsertCount}`, orgId, subId, catId, j.t, slug, j.d, j.et, j.el, j.ed, j.ci, j.ct, 0, j.sd, j.smin, j.smax, 'KES', 'ACTIVE', j.f ? 1 : 0, datePosted, deadline, searchText, 'MANUAL']);
    jobInsertCount++;
    process.stdout.write(`   ${jobInsertCount} jobs...\r`);
  }
  console.log(`   Done: ${jobInsertCount} jobs seeded.\n`);

  // ========== 5. OPPORTUNITIES ==========
  console.log('5. Seeding opportunities...');
  const OPPS = [
    {t:"Masters Scholarship in Public Health - University of Nairobi",sl:"masters-scholarship-public-health-uon",ty:"SCHOLARSHIP",p:"University of Nairobi",d:"The University of Nairobi is offering fully funded masters scholarships in public health for Kenyan students. This scholarship covers tuition, research costs, and a monthly stipend for the duration of the two-year program. Applicants must hold a relevant bachelor's degree with a minimum second-class upper division and demonstrate commitment to public health practice in Kenya.",fu:"FULLY_FUNDED",am:800000,f:1,on:0,it:0,dl:45,dur:"2 years"},
    {t:"Aga Khan Foundation International Scholarship",sl:"aga-khan-foundation-intl-scholarship",ty:"SCHOLARSHIP",p:"Aga Khan Foundation",d:"The Aga Khan Foundation provides international scholarships for outstanding students from developing countries to pursue postgraduate studies. The scholarship is a 50% grant and 50% loan, covering tuition and living expenses. Applicants from Kenya pursuing studies in development-related fields are strongly encouraged to apply. Selection is based on academic excellence, leadership potential, and financial need.",fu:"PARTIALLY_FUNDED",am:2000000,f:1,on:1,it:1,dl:60,dur:"1-2 years"},
    {t:"Google AI Research Fellowship - Africa",sl:"google-ai-research-fellowship-africa",ty:"FELLOWSHIP",p:"Google",d:"Google is offering AI Research Fellowships for early-career researchers in Africa. Fellows will work with Google Research scientists on cutting-edge machine learning projects, receive mentorship, and access to Google's computing resources. The fellowship includes a competitive stipend, travel support, and publication support. Applicants must be enrolled in or recently graduated from a PhD program in computer science or related field.",fu:"FULLY_FUNDED",am:3600000,f:1,on:0,it:0,dl:90,dur:"1 year"},
    {t:"UNEP Young Champions of the Earth",sl:"unep-young-champions-earth",ty:"COMPETITION",p:"UNEP",d:"UN Young Champions of the Earth is a global competition that celebrates and supports young environmental entrepreneurs aged 18-30. Winners receive seed funding, mentoring, and access to UN networks to scale their environmental solutions. Kenyan youth with innovative ideas for tackling environmental challenges are encouraged to apply. The competition seeks bold, creative, and feasible solutions to environmental problems.",fu:"SHOW_AMOUNT",am:1500000,f:1,on:0,it:0,dl:30,dur:"1 year"},
    {t:"M-Pesa Foundation Academy Scholarship",sl:"m-pesa-foundation-academy-scholarship",ty:"SCHOLARSHIP",p:"M-Pesa Foundation",d:"The M-Pesa Foundation Academy is offering full scholarships for talented but financially disadvantaged Kenyan students to attend secondary school education. The scholarship covers tuition, boarding, uniforms, books, and personal effects. Applicants must be aged 13-15 years, demonstrate academic potential, and come from economically disadvantaged backgrounds. Leadership potential and extracurricular achievements are also considered.",fu:"FULLY_FUNDED",am:500000,f:1,on:0,it:0,dl:21,dur:"4 years"},
    {t:"Mastercard Foundation Scholars Program",sl:"mastercard-foundation-scholars",ty:"SCHOLARSHIP",p:"Mastercard Foundation",d:"The Mastercard Foundation Scholars Program at partner universities in Kenya provides comprehensive scholarships to academically talented young Africans from economically disadvantaged communities. The scholarship covers full tuition, accommodation, books, stipends, and leadership development. Scholars also receive mentoring, career guidance, and opportunities for community service and giving back.",fu:"FULLY_FUNDED",am:1200000,f:1,on:0,it:0,dl:45,dur:"4 years"},
    {t:"Techstars Startup Weekend Nairobi",sl:"techstars-startup-weekend-nairobi",ty:"COMPETITION",p:"Techstars",d:"Techstars Startup Weekend Nairobi is a 54-hour event where aspiring entrepreneurs pitch ideas, form teams, and launch startups. Participants receive mentorship from experienced entrepreneurs, industry experts, and investors. The winning team receives prizes including cloud credits, co-working space, and mentorship programs. Open to anyone with a business idea or the desire to join a startup team.",fu:"NOT_FUNDED",am:null,f:0,on:0,it:0,dl:7,dur:"3 days"},
    {t:"African Leadership Academy Entrepreneurial Leadership Program",sl:"ala-entrepreneurial-leadership-program",ty:"TRAINING",p:"African Leadership Academy",d:"The African Leadership Academy offers a transformative entrepreneurial leadership program for young Africans aged 15-19. The two-year program combines academic excellence with leadership development, entrepreneurship training, and African studies. Students develop the skills and mindset to become transformative leaders and entrepreneurs on the continent. Financial aid is available for deserving students.",fu:"PARTIALLY_FUNDED",am:3000000,f:1,on:0,it:1,dl:60,dur:"2 years"},
    {t:"USAID Kenya Grants Program",sl:"usaid-kenya-grants-program",ty:"GRANT",p:"USAID Kenya",d:"USAID Kenya is accepting grant applications from Kenyan civil society organizations working in health, education, democracy, governance, and economic growth. Grants range from small to large scale, supporting innovative approaches to development challenges. Organizations must be legally registered in Kenya with a proven track record. Applications are reviewed on a rolling basis with specific focus areas announced quarterly.",fu:"SHOW_AMOUNT",am:5000000,f:1,on:0,it:0,dl:90,dur:"1-3 years"},
    {t:"She Codes Africa Mentorship Program",sl:"she-codes-africa-mentorship",ty:"MENTORSHIP",p:"She Codes Africa",d:"She Codes Africa is offering a 6-month mentorship program for women in technology across Kenya. Participants are matched with experienced tech professionals who provide guidance on career development, technical skills, and navigating the tech industry. The program includes monthly workshops, networking events, and access to an online community of women in tech. Open to women at all career stages in technology.",fu:"NOT_FUNDED",am:null,f:0,on:1,it:0,dl:14,dur:"6 months"},
  ];

  let oppCount = 0;
  for (const o of OPPS) {
    const howToApply = `Visit the official website of ${o.p} to submit your application before the deadline. Ensure you meet all eligibility criteria and prepare all required documents in advance.`;
    await conn.query(`
      INSERT INTO opportunities (id, type, title, slug, provider_name, description, location_city, location_county, is_remote, is_online, funding_disclosure, funding_amount, funding_currency, status, featured, date_posted, deadline, open_to_international, duration, how_to_apply, created_at, updated_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(),NOW())
      ON DUPLICATE KEY UPDATE title = VALUES(title)
    `, [`opp_${oppCount}`, o.ty, o.t, o.sl, o.p, o.d, "Nairobi", "Nairobi", 0, o.on, o.fu, o.am, 'KES', 'ACTIVE', o.f, new Date(now.getTime() - Math.floor(Math.random() * 10) * 86400000), new Date(now.getTime() + o.dl * 86400000), o.it, o.dur, howToApply]);
    oppCount++;
  }
  console.log(`   Done: ${oppCount} opportunities seeded.\n`);

  // ========== VERIFY ==========
  const [result] = await conn.query('SELECT (SELECT COUNT(*) FROM job_categories) as cats, (SELECT COUNT(*) FROM job_subcategories) as subs, (SELECT COUNT(*) FROM organizations) as orgs, (SELECT COUNT(*) FROM jobs) as jobs, (SELECT COUNT(*) FROM opportunities) as opps');
  console.log('Final database state:', result[0]);

  await conn.end();
  console.log('\nSeed completed successfully!');
}

async function insertSubBatch(conn, batch) {
  await conn.query(`
    INSERT INTO job_subcategories (id, value, label, slug, description, category_id, sort_order, created_at, updated_at)
    VALUES ${batch.map(() => '(?,?,?,?,?,?,?,NOW(),NOW())').join(',')}
    ON DUPLICATE KEY UPDATE
      label = VALUES(label), slug = VALUES(slug), description = VALUES(description),
      category_id = VALUES(category_id), sort_order = VALUES(sort_order)
  `, batch.flat());
}

main().catch(e => { console.error('Seed error:', e); process.exit(1); });
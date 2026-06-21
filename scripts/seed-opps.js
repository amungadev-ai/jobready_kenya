const mysql = require("mysql2/promise");

async function main() {
  const conn = await mysql.createConnection({
    host: "d7.my-control-panel.com",
    port: 3306,
    user: "jobready_database_admin",
    password: "Admincyber",
    database: "jobready_database",
  });

  const now = new Date();
  const OPPS = [
    {t:"Masters Scholarship in Public Health",sl:"masters-scholarship-public-health-uon",ty:"SCHOLARSHIP",p:"University of Nairobi",d:"The University of Nairobi is offering fully funded masters scholarships in public health for Kenyan students covering tuition, research costs, and a monthly stipend for the two-year program.",fu:"FULLY_FUNDED",am:800000,f:1,on:0,it:0,dl:45,dur:"2 years"},
    {t:"Aga Khan Foundation International Scholarship",sl:"aga-khan-foundation-intl-scholarship",ty:"SCHOLARSHIP",p:"Aga Khan Foundation",d:"The Aga Khan Foundation provides international scholarships for outstanding students from developing countries to pursue postgraduate studies.",fu:"PARTIALLY_FUNDED",am:2000000,f:1,on:1,it:1,dl:60,dur:"1-2 years"},
    {t:"Google AI Research Fellowship Africa",sl:"google-ai-research-fellowship-africa",ty:"FELLOWSHIP",p:"Google",d:"Google is offering AI Research Fellowships for early-career researchers in Africa to work with Google Research scientists on cutting-edge ML projects.",fu:"FULLY_FUNDED",am:3600000,f:1,on:0,it:0,dl:90,dur:"1 year"},
    {t:"UNEP Young Champions of the Earth",sl:"unep-young-champions-earth",ty:"COMPETITION",p:"UNEP",d:"UN Young Champions of the Earth celebrates and supports young environmental entrepreneurs aged 18-30 with seed funding and mentoring.",fu:"SHOW_AMOUNT",am:1500000,f:1,on:0,it:0,dl:30,dur:"1 year"},
    {t:"M-Pesa Foundation Academy Scholarship",sl:"m-pesa-foundation-academy-scholarship",ty:"SCHOLARSHIP",p:"M-Pesa Foundation",d:"Full scholarships for talented but financially disadvantaged Kenyan students for secondary school education covering tuition, boarding, and supplies.",fu:"FULLY_FUNDED",am:500000,f:1,on:0,it:0,dl:21,dur:"4 years"},
    {t:"Mastercard Foundation Scholars Program",sl:"mastercard-foundation-scholars",ty:"SCHOLARSHIP",p:"Mastercard Foundation",d:"Comprehensive scholarships to academically talented young Africans from economically disadvantaged communities covering tuition, accommodation, and stipends.",fu:"FULLY_FUNDED",am:1200000,f:1,on:0,it:0,dl:45,dur:"4 years"},
    {t:"Techstars Startup Weekend Nairobi",sl:"techstars-startup-weekend-nairobi",ty:"COMPETITION",p:"Techstars",d:"A 54-hour event where aspiring entrepreneurs pitch ideas, form teams, and launch startups with mentorship from experienced entrepreneurs.",fu:"NOT_FUNDED",am:null,f:0,on:0,it:0,dl:7,dur:"3 days"},
    {t:"ALA Entrepreneurial Leadership Program",sl:"ala-entrepreneurial-leadership-program",ty:"TRAINING",p:"African Leadership Academy",d:"A transformative entrepreneurial leadership program for young Africans aged 15-19 combining academics with leadership development.",fu:"PARTIALLY_FUNDED",am:3000000,f:1,on:0,it:1,dl:60,dur:"2 years"},
    {t:"USAID Kenya Grants Program",sl:"usaid-kenya-grants-program",ty:"GRANT",p:"USAID Kenya",d:"Grant applications from Kenyan civil society organizations working in health, education, democracy, governance, and economic growth.",fu:"SHOW_AMOUNT",am:5000000,f:1,on:0,it:0,dl:90,dur:"1-3 years"},
    {t:"She Codes Africa Mentorship Program",sl:"she-codes-africa-mentorship",ty:"MENTORSHIP",p:"She Codes Africa",d:"A 6-month mentorship program for women in technology across Kenya with monthly workshops and networking events.",fu:"NOT_FUNDED",am:null,f:0,on:1,it:0,dl:14,dur:"6 months"},
  ];

  const sql = "INSERT INTO opportunities (id, type, title, slug, provider_name, description, location_city, location_county, is_remote, is_online, funding_disclosure, funding_amount, funding_currency, status, featured, date_posted, deadline, open_to_international, duration, how_to_apply, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE title = VALUES(title)";

  for (let i = 0; i < OPPS.length; i++) {
    const o = OPPS[i];
    const howToApply = "Visit the official website of " + o.p + " to submit your application before the deadline.";
    const datePosted = new Date(now.getTime() - Math.floor(Math.random() * 10) * 86400000);
    const deadline = new Date(now.getTime() + o.dl * 86400000);
    const params = [
      "opp_" + i, o.ty, o.t, o.sl, o.p, o.d, "Nairobi", "Nairobi",
      0, o.on, o.fu, o.am, "KES", "ACTIVE", o.f,
      datePosted, deadline, o.it, o.dur, howToApply,
      now.toISOString().slice(0, 19).replace('T', ' '),
      now.toISOString().slice(0, 19).replace('T', ' ')
    ];
    if (params.length !== 22) {
      console.error("PARAM COUNT MISMATCH:", params.length);
      process.exit(1);
    }
    await conn.query(sql, params);
    console.log("  Inserted: " + o.t);
  }

  const [r] = await conn.query("SELECT COUNT(*) as c FROM opportunities");
  console.log("\nTotal opportunities:", r[0].c);

  const [stats] = await conn.query(
    "SELECT (SELECT COUNT(*) FROM job_categories) as cats, (SELECT COUNT(*) FROM job_subcategories) as subs, (SELECT COUNT(*) FROM organizations) as orgs, (SELECT COUNT(*) FROM jobs WHERE status='ACTIVE' AND deleted_at IS NULL) as jobs, (SELECT COUNT(*) FROM opportunities WHERE status='ACTIVE' AND deleted_at IS NULL) as opps"
  );
  console.log("\n=== FINAL DATABASE STATE ===");
  console.log("Categories:", stats[0].cats);
  console.log("Subcategories:", stats[0].subs);
  console.log("Organizations:", stats[0].orgs);
  console.log("Active Jobs:", stats[0].jobs);
  console.log("Active Opportunities:", stats[0].opps);

  await conn.end();
  console.log("\nDone!");
}

main().catch(e => { console.error(e); process.exit(1); });
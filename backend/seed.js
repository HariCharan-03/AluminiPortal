const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'haricharan3333',
  database: 'alumniDB',
});

const alumni = [
  { name: 'Arjun Mehta',      email: 'arjun.mehta@gmail.com',      year: 2020, company: 'Google' },
  { name: 'Priya Sharma',     email: 'priya.sharma@outlook.com',    year: 2021, company: 'Microsoft' },
  { name: 'Rohan Verma',      email: 'rohan.verma@yahoo.com',       year: 2019, company: 'Amazon' },
  { name: 'Sneha Reddy',      email: 'sneha.reddy@gmail.com',       year: 2022, company: 'Meta' },
  { name: 'Karan Patel',      email: 'karan.patel@hotmail.com',     year: 2018, company: 'Apple' },
  { name: 'Anjali Singh',     email: 'anjali.singh@gmail.com',      year: 2023, company: 'Netflix' },
  { name: 'Vikram Nair',      email: 'vikram.nair@gmail.com',       year: 2017, company: 'Infosys' },
  { name: 'Divya Krishnan',   email: 'divya.krishnan@gmail.com',    year: 2020, company: 'TCS' },
  { name: 'Nikhil Gupta',     email: 'nikhil.gupta@outlook.com',   year: 2016, company: 'Wipro' },
  { name: 'Aisha Khan',       email: 'aisha.khan@gmail.com',        year: 2021, company: 'Accenture' },
  { name: 'Rahul Bose',       email: 'rahul.bose@gmail.com',        year: 2019, company: 'IBM' },
  { name: 'Pooja Jain',       email: 'pooja.jain@gmail.com',        year: 2022, company: 'Deloitte' },
  { name: 'Siddharth Rao',    email: 'siddharth.rao@yahoo.com',     year: 2018, company: 'Goldman Sachs' },
  { name: 'Meera Pillai',     email: 'meera.pillai@gmail.com',      year: 2023, company: 'JP Morgan' },
  { name: 'Amit Tiwari',      email: 'amit.tiwari@outlook.com',     year: 2015, company: 'Uber' },
  { name: 'Riya Desai',       email: 'riya.desai@gmail.com',        year: 2020, company: 'Flipkart' },
  { name: 'Sahil Kapoor',     email: 'sahil.kapoor@gmail.com',      year: 2021, company: 'Swiggy' },
  { name: 'Tanya Malhotra',   email: 'tanya.malhotra@gmail.com',    year: 2019, company: 'Zomato' },
  { name: 'Yash Agarwal',     email: 'yash.agarwal@outlook.com',    year: 2022, company: 'Paytm' },
  { name: 'Naina Khanna',     email: 'naina.khanna@gmail.com',      year: 2017, company: 'HDFC Bank' },
  { name: 'Dev Chopra',       email: 'dev.chopra@gmail.com',        year: 2023, company: 'Adobe' },
  { name: 'Simran Bhatia',    email: 'simran.bhatia@gmail.com',     year: 2018, company: 'Salesforce' },
  { name: 'Aryan Sethi',      email: 'aryan.sethi@yahoo.com',       year: 2020, company: 'Oracle' },
  { name: 'Kavya Menon',      email: 'kavya.menon@gmail.com',       year: 2016, company: 'HCL Technologies' },
  { name: 'Ishaan Joshi',     email: 'ishaan.joshi@gmail.com',      year: 2021, company: 'Tata Motors' },
  { name: 'Ritika Saxena',    email: 'ritika.saxena@outlook.com',   year: 2019, company: 'Cognizant' },
  { name: 'Pranav Dubey',     email: 'pranav.dubey@gmail.com',      year: 2022, company: 'Tech Mahindra' },
  { name: 'Diya Iyer',        email: 'diya.iyer@gmail.com',         year: 2015, company: 'Capgemini' },
  { name: 'Veer Sinha',       email: 'veer.sinha@yahoo.com',        year: 2023, company: 'PhonePe' },
  { name: 'Shruti Pandey',    email: 'shruti.pandey@gmail.com',     year: 2017, company: 'CRED' },
  { name: 'Kabir Malik',      email: 'kabir.malik@gmail.com',       year: 2020, company: 'Razorpay' },
  { name: 'Lakshmi Nair',     email: 'lakshmi.nair@outlook.com',   year: 2018, company: 'Freshworks' },
  { name: 'Roshan Ghosh',     email: 'roshan.ghosh@gmail.com',      year: 2021, company: 'Byju\'s' },
  { name: 'Ananya Kaur',      email: 'ananya.kaur@gmail.com',       year: 2022, company: 'Nykaa' },
  { name: 'Tushar Chandra',   email: 'tushar.chandra@yahoo.com',    year: 2016, company: 'Myntra' },
  { name: 'Bhavna Trivedi',   email: 'bhavna.trivedi@gmail.com',    year: 2019, company: 'Ola' },
  { name: 'Harish Pillai',    email: 'harish.pillai@gmail.com',     year: 2023, company: 'Zepto' },
  { name: 'Swati Choudhary',  email: 'swati.choudhary@outlook.com', year: 2017, company: 'ICICI Bank' },
  { name: 'Gaurav Sharma',    email: 'gaurav.sharma@gmail.com',     year: 2020, company: 'Airtel' },
  { name: 'Pallavi Soni',     email: 'pallavi.soni@gmail.com',      year: 2021, company: 'KPMG' },
  { name: 'Ajay Rastogi',     email: 'ajay.rastogi@yahoo.com',      year: 2018, company: 'EY' },
  { name: 'Chetana Patil',    email: 'chetana.patil@gmail.com',     year: 2022, company: 'PwC' },
  { name: 'Sumit Mishra',     email: 'sumit.mishra@gmail.com',      year: 2015, company: 'McKinsey' },
  { name: 'Vinita Goel',      email: 'vinita.goel@outlook.com',     year: 2023, company: 'BCG' },
  { name: 'Omkar Hegde',      email: 'omkar.hegde@gmail.com',       year: 2019, company: 'Bain & Company' },
  { name: 'Shreya Kulkarni',  email: 'shreya.kulkarni@gmail.com',   year: 2020, company: 'Sony' },
  { name: 'Parth Shah',       email: 'parth.shah@yahoo.com',        year: 2016, company: 'Samsung' },
  { name: 'Kritika Arora',    email: 'kritika.arora@gmail.com',     year: 2021, company: 'Intel' },
  { name: 'Manav Kohli',      email: 'manav.kohli@outlook.com',     year: 2017, company: 'Nvidia' },
  { name: 'Jyoti Rawat',      email: 'jyoti.rawat@gmail.com',       year: 2022, company: 'Qualcomm' },
  { name: 'Aarav Bansal',     email: 'aarav.bansal@gmail.com',      year: 2018, company: 'Cisco' },
  { name: 'Tanvi Mehrotra',   email: 'tanvi.mehrotra@yahoo.com',    year: 2023, company: 'VMware' },
  { name: 'Rishabh Bajaj',    email: 'rishabh.bajaj@gmail.com',     year: 2015, company: 'Twitter / X' },
  { name: 'Shivani Varma',    email: 'shivani.varma@gmail.com',     year: 2020, company: 'LinkedIn' },
  { name: 'Kunal Shukla',     email: 'kunal.shukla@outlook.com',    year: 2019, company: 'Spotify' },
  { name: 'Aditi Rajan',      email: 'aditi.rajan@gmail.com',       year: 2021, company: 'Airbnb' },
];

db.connect((err) => {
  if (err) { console.error('❌ Connection failed:', err.message); process.exit(1); }
  console.log('✅ Connected to alumniDB');

  let inserted = 0, skipped = 0;

  const insert = (i) => {
    if (i >= alumni.length) {
      console.log(`\n✅ Done! Inserted: ${inserted} | Skipped (duplicate): ${skipped}`);
      db.end();
      return;
    }
    const a = alumni[i];
    db.query(
      'INSERT IGNORE INTO alumni (name, email, year, company) VALUES (?, ?, ?, ?)',
      [a.name, a.email, a.year, a.company],
      (err, result) => {
        if (err) { console.error(`❌ Error inserting ${a.name}:`, err.message); }
        else if (result.affectedRows === 0) { console.log(`⏭  Skipped (duplicate): ${a.name}`); skipped++; }
        else { console.log(`✅ Inserted: ${a.name} — ${a.company} (${a.year})`); inserted++; }
        insert(i + 1);
      }
    );
  };

  insert(0);
});

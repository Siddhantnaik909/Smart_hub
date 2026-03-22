
const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/smart_hub';

const CALCULATORS_DATA = [
    {
        category: "Construction", icon: "fas fa-hard-hat", items: [
            { name: "Brick Estimator", link: "/calculators/construction/calc_brick.html" },
            { name: "Concrete Calculator", link: "/calculators/construction/calc_concrete.html" },
            { name: "Flooring Calculator", link: "/calculators/construction/calc_flooring.html" },
            { name: "Fuel Cost Calculator", link: "/calculators/construction/calc_fuel.html" },
            { name: "Lumber Board Feet", link: "/calculators/construction/calc_lumber.html" },
            { name: "Ohm's Law", link: "/calculators/construction/calc_ohm.html" },
            { name: "Paint Calculator", link: "/calculators/construction/calc_paint.html" },
            { name: "Roof Area Calculator", link: "/calculators/construction/calc_roof_area.html" },
            { name: "Wall Stud Calculator", link: "/calculators/construction/calc_wall_stud.html" }
        ]
    },
    {
        category: "Cryptography", icon: "fas fa-vault", items: [
            { name: "MD5 Generator", link: "/calculators/cryptography/tool_md5_generator.html" },
            { name: "SHA-256 Generator", link: "/calculators/cryptography/tool_sha256_generator.html" },
            { name: "Base64 Encoder/Decoder", link: "/calculators/cryptography/tool_base64.html" }
        ]
    },
    {
        category: "Date & Time", icon: "fas fa-calendar-alt", items: [
            { name: "Age Calculator", link: "/calculators/date-time/calc_age.html" },
            { name: "Countdown Timer", link: "/calculators/date-time/calc_countdown.html" },
            { name: "Date Difference", link: "/calculators/date-time/calc_date_diff.html" },
            { name: "Hours Worked", link: "/calculators/date-time/calc_hours_worked.html" },
            { name: "Leap Year Checker", link: "/calculators/date-time/calc_leap_year.html" },
            { name: "Time Addition", link: "/calculators/date-time/calc_time_add.html" },
            { name: "Time Zone Converter", link: "/calculators/date-time/calc_time_zone.html" },
            { name: "Working Days", link: "/calculators/date-time/calc_working_days.html" }
        ]
    },
    {
        category: "Electronics", icon: "fas fa-microchip", items: [
            { name: "555 Timer", link: "/calculators/electronics/calc_555_timer.html" },
            { name: "Battery Life", link: "/calculators/electronics/calc_battery_life.html" },
            { name: "Capacitor Code", link: "/calculators/electronics/calc_capacitor_code.html" },
            { name: "Frequency & Wavelength", link: "/calculators/electronics/calc_frequency.html" },
            { name: "LED Resistor", link: "/calculators/electronics/calc_led_resistor_calculator.html" },
            { name: "Ohm's Law", link: "/calculators/electronics/calc_ohm.html" },
            { name: "Power Calculator", link: "/calculators/electronics/calc_power.html" },
            { name: "Resistor Color Code", link: "/calculators/electronics/calc_resistor_color_code.html" },
            { name: "Voltage Divider", link: "/calculators/electronics/calc_voltage_divider.html" }
        ]
    },
    {
        category: "Finance", icon: "fas fa-landmark", items: [
            { name: "Car Loan", link: "/calculators/finance/calc_car_loan.html" },
            { name: "Compound Interest (Simple)", link: "/calculators/finance/calc_compound.html" },
            { name: "Compound Interest (Advanced)", link: "/calculators/finance/calc_compound_interest.html" },
            { name: "Currency Converter", link: "/calculators/finance/calc_currency.html" },
            { name: "Discount Calculator", link: "/calculators/finance/calc_discount.html" },
            { name: "General Loan", link: "/calculators/finance/calc_loan.html" },
            { name: "Loan EMI", link: "/calculators/finance/calc_loan_emi.html" },
            { name: "Mortgage Calculator", link: "/calculators/finance/calc_mortgage.html" },
            { name: "ROI Calculator", link: "/calculators/finance/calc_roi.html" },
            { name: "Salary Calculator", link: "/calculators/finance/calc_salary.html" },
            { name: "Savings Goal", link: "/calculators/finance/calc_savings_goal.html" },
            { name: "Tax / GST", link: "/calculators/finance/calc_tax_gst.html" },
            { name: "Tip Calculator", link: "/calculators/finance/calc_tip_calculator.html" }
        ]
    },
    {
        category: "General Math", icon: "fas fa-calculator", items: [
            { name: "Average Calculator", link: "/calculators/general-math/calc_average.html" },
            { name: "Fractions Calculator", link: "/calculators/general-math/calc_fractions.html" },
            { name: "Math Toolkit", link: "/calculators/general-math/calc_math_toolkit.html" },
            { name: "Percentage Calculator", link: "/calculators/general-math/calc_percentage.html" },
            { name: "Programmer Calculator", link: "/calculators/general-math/calc_programmer.html" },
            { name: "Scientific Calculator", link: "/calculators/general-math/calc_scientific.html" },
            { name: "Standard Calculator", link: "/calculators/general-math/calc_standard.html" },
            { name: "Password Generator", link: "/calculators/general-math/tool_password.html" }
        ]
    },
    {
        category: "Health & Fitness", icon: "fas fa-heart-pulse", items: [
            { name: "BMI Calculator", link: "/calculators/health-fitness/calc_bmi.html" },
            { name: "BMR Calculator", link: "/calculators/health-fitness/calc_bmr.html" },
            { name: "Body Fat Percentage", link: "/calculators/health-fitness/calc_body_fat.html" },
            { name: "Calorie Calculator", link: "/calculators/health-fitness/calc_calorie.html" },
            { name: "Ovulation Calculator", link: "/calculators/health-fitness/calc_ovulation.html" },
            { name: "Pregnancy Due Date", link: "/calculators/health-fitness/calc_pregnancy.html" },
            { name: "Water Intake", link: "/calculators/health-fitness/calc_water.html" }
        ]
    },
    {
        category: "Network", icon: "fas fa-network-wired", items: [
            { name: "DNS Lookup", link: "/calculators/network/tool_dns_lookup.html" },
            { name: "IP Geolocation", link: "/calculators/network/tool_ip_geo.html" },
            { name: "Ping Test", link: "/calculators/network/tool_ping.html" },
            { name: "Port Scanner", link: "/calculators/network/tool_port_scanner.html" },
            { name: "Subnet Calculator", link: "/calculators/network/calc_subnet.html" },
            { name: "Traceroute Tool", link: "/calculators/network/tool_traceroute.html" },
            { name: "Whois Lookup", link: "/calculators/network/tool_whois.html" }
        ]
    },
    {
        category: "Students", icon: "fas fa-user-graduate", items: [
            { name: "GPA Calculator", link: "/calculators/students/calc_gpa.html" },
            { name: "Weighted Grade", link: "/calculators/students/calc_grade_weighted.html" },
            { name: "Area & Volume", link: "/calculators/students/calc_mensuration.html" },
            { name: "Pomodoro Timer", link: "/calculators/students/calc_pomodoro.html" },
            { name: "Math Equations", link: "/calculators/students/calc_quadratic.html" },
            { name: "Statistics", link: "/calculators/students/calc_statistics.html" },
            { name: "Unit Converter", link: "/calculators/students/calc_unit_conv.html" }
        ]
    },
    {
        category: "Text & Web", icon: "fas fa-file-code", items: [
            { name: "Text Case Change", link: "/calculators/text-web/tool_case_converter.html" },
            { name: "Dummy Text Maker", link: "/calculators/text-web/tool_lorem_ipsum.html" },
            { name: "Password Checker", link: "/calculators/text-web/tool_password.html" },
            { name: "Word Counter", link: "/calculators/text-web/tool_word_counter.html" },
            { name: "Link Encoder", link: "/calculators/text-web/tool_url_encoder.html" }
        ]
    }
];

async function seed() {
    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB for catalog seeding...');

        const db = mongoose.connection.db;
        const categoriesCol = db.collection('categories');
        const calculatorsCol = db.collection('calculators');

        // Clear existing catalog
        await categoriesCol.deleteMany({});
        await calculatorsCol.deleteMany({});

        for (const cat of CALCULATORS_DATA) {
            const catResult = await categoriesCol.insertOne({
                name: cat.category,
                icon: cat.icon,
                createdAt: new Date()
            });
            const categoryId = catResult.insertedId;

            const calcItems = cat.items.map(item => ({
                name: item.name,
                link: item.link,
                categoryId: categoryId,
                createdAt: new Date()
            }));

            await calculatorsCol.insertMany(calcItems);
            console.log(`Seeded category: ${cat.category} with ${cat.items.length} items`);
        }

        console.log('Catalog seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
}

seed();

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Category = require('../models/Category');

// Sports-specific categories with descriptions
const sportsCategories = [
    {
        name: "Sports Equipment",
        description: "Professional sports equipment for team and individual sports"
    },
    {
        name: "Sports Apparel",
        description: "Performance activewear and sportswear for all activities"
    },
    {
        name: "Sports Footwear",
        description: "Athletic shoes for running, training, and sports performance"
    },
    {
        name: "Sports Accessories",
        description: "Essential sports gear, bags, and training accessories"
    },
    {
        name: "Team Sports",
        description: "Equipment for basketball, football, volleyball, and more"
    },
    {
        name: "Fitness & Training",
        description: "Gym equipment, weights, and training gear"
    },
    {
        name: "Running & Athletics",
        description: "Running shoes, apparel, and performance gear"
    },
    {
        name: "Outdoor Sports",
        description: "Gear for cycling, hiking, camping, and outdoor activities"
    },
    {
        name: "Water Sports",
        description: "Swimming, surfing, and water activity equipment"
    },
    {
        name: "Protective Gear",
        description: "Helmets, pads, guards, and safety equipment"
    },
    {
        name: "Sportswear - Men",
        description: "Men's athletic clothing and training apparel"
    },
    {
        name: "Sportswear - Women",
        description: "Women's athletic clothing and activewear"
    },
    {
        name: "Kids Sports",
        description: "Sports equipment and apparel for children and youth"
    },
    {
        name: "Sports Nutrition",
        description: "Supplements, protein, and sports nutrition products"
    },
    {
        name: "Gym Bags & Hydration",
        description: "Sports bags, backpacks, and water bottles"
    }
];

const seedCategories = async (clearExisting = false) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for category seeding...");

        // Clear existing categories if requested
        if (clearExisting) {
            await Category.deleteMany({});
            console.log("🗑️  All existing categories cleared!");
        }

        // Seed new sports categories
        let createdCount = 0;
        let updatedCount = 0;

        for (const cat of sportsCategories) {
            const result = await Category.findOneAndUpdate(
                { name: cat.name },
                cat,
                { upsert: true, new: true, runValidators: true }
            );

            // Check if this was a new insertion or update
            if (result) {
                const exists = await Category.countDocuments({ name: cat.name });
                if (exists === 1) {
                    createdCount++;
                } else {
                    updatedCount++;
                }
            }
        }

        console.log(`✅ Sports categories seeded successfully!`);
        console.log(`   - Created: ${createdCount} new categories`);
        console.log(`   - Updated: ${updatedCount} existing categories`);
        console.log(`   - Total: ${sportsCategories.length} categories in database`);

        // Display all categories
        const allCategories = await Category.find({}).sort({ name: 1 });
        console.log("\n📋 Current Categories:");
        allCategories.forEach((cat, index) => {
            console.log(`   ${index + 1}. ${cat.name}`);
        });

        mongoose.connection.close();
        console.log("\n✅ Database connection closed.");
    } catch (error) {
        console.error("❌ Error seeding categories:", error);
        process.exit(1);
    }
};

// Check if clearExisting flag is passed as command line argument
// Usage: node categorySeeder.js --clear OR node categorySeeder.js
const clearExisting = process.argv.includes('--clear');

if (clearExisting) {
    console.log("⚠️  Warning: This will delete all existing categories!");
}

seedCategories(clearExisting);

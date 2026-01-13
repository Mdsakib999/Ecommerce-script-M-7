require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Product = require('../models/Product');

// Comprehensive sports products with all new fields
const sportsProducts = [
    // ==================== SPORTS EQUIPMENT ====================
    {
        name: "Premium Basketball - Official Size 7",
        description: "Professional indoor/outdoor basketball with superior grip and perfect bounce. Composite leather cover with deep channels for excellent ball control.",
        imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1000&auto=format&fit=crop",
        price: 45.99,
        discountPrice: 39.99,
        countInStock: 120,
        category: "Sports Equipment",
        brand: "Nike",
        sport: "Basketball",
        sizes: ["Size 7"],
        colors: ["Orange/Black", "Blue/White"],
        gender: "Unisex",
        material: "Composite Leather",
        ageGroup: "Adult",
        specifications: [
            { key: "Size", value: "Official Size 7 (29.5 inches)" },
            { key: "Use", value: "Indoor/Outdoor" },
            { key: "Material", value: "Composite Leather" },
            { key: "Skill Level", value: "Professional/Advanced" }
        ],
        isFeatured: true,
        rating: 4.8
    },
    {
        name: "Professional Football - FIFA Quality",
        description: "Match-quality soccer ball with thermal bonded seamless construction. Enhanced visibility design for all weather conditions.",
        imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop",
        price: 55.00,
        discountPrice: 47.99,
        countInStock: 95,
        category: "Sports Equipment",
        brand: "Adidas",
        sport: "Football/Soccer",
        sizes: ["Size 5"],
        colors: ["White/Black/Red", "Neon Green/Blue"],
        gender: "Unisex",
        material: "Synthetic Leather",
        ageGroup: "Adult",
        specifications: [
            { key: "Size", value: "Official Size 5" },
            { key: "Construction", value: "Thermal Bonded" },
            { key: "Certification", value: "FIFA Quality" },
            { key: "Use", value: "Professional Match" }
        ],
        isFeatured: true,
        rating: 4.9
    },
    {
        name: "Carbon Fiber Tennis Racket",
        description: "Advanced carbon fiber racket with enlarged sweet spot. Perfect for intermediate to advanced players seeking power and control.",
        imageUrl: "https://images.unsplash.com/photo-1617083934405-c7e2654c91e8?q=80&w=1000&auto=format&fit=crop",
        price: 165.00,
        discountPrice: 139.99,
        countInStock: 35,
        category: "Sports Equipment",
        brand: "Wilson",
        sport: "Tennis",
        sizes: ["Grip 2", "Grip 3", "Grip 4"],
        colors: ["Black/Red", "Blue/White"],
        gender: "Unisex",
        material: "Carbon Fiber",
        ageGroup: "Adult",
        specifications: [
            { key: "Head Size", value: "100 sq in" },
            { key: "Weight", value: "300g unstrung" },
            { key: "Balance", value: "Even" },
            { key: "Skill Level", value: "Intermediate to Advanced" }
        ],
        rating: 4.7
    },
    {
        name: "Professional Volleyball - Indoor",
        description: "Superior indoor volleyball with microfiber composite cover. Exceptional softness and perfect flight characteristics.",
        imageUrl: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=1000&auto=format&fit=crop",
        price: 42.00,
        countInStock: 65,
        category: "Sports Equipment",
        brand: "Mikasa",
        sport: "Volleyball",
        sizes: ["Official Size"],
        colors: ["Blue/Yellow/White", "Red/White"],
        gender: "Unisex",
        material: "Microfiber Composite",
        ageGroup: "Adult",
        specifications: [
            { key: "Use", value: "Indoor Competition" },
            { key: "Panels", value: "18-panel design" },
            { key: "Certification", value: "FIVB Approved" }
        ],
        rating: 4.6
    },
    {
        name: "Adjustable Dumbbells Set - 5-52.5 lbs",
        description: "Space-saving adjustable dumbbells that replace 15 sets. Quick weight adjustment with turn of dial.",
        imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa20000a?q=80&w=1000&auto=format&fit=crop",
        price: 349.99,
        discountPrice: 299.99,
        countInStock: 25,
        category: "Fitness & Training",
        brand: "Bowflex",
        sport: "Fitness",
        sizes: ["5-52.5 lbs per dumbbell"],
        colors: ["Black/Red"],
        gender: "Unisex",
        material: "Steel/Plastic",
        ageGroup: "Adult",
        specifications: [
            { key: "Weight Range", value: "5 to 52.5 lbs (per dumbbell)" },
            { key: "Increments", value: "2.5 lbs" },
            { key: "Space Savings", value: "Replaces 15 sets" },
            { key: "Warranty", value: "2 years" }
        ],
        isFeatured: true,
        rating: 4.8
    },
    {
        name: "Premium Yoga Mat - Extra Thick 6mm",
        description: "Eco-friendly TPE yoga mat with superior cushioning and non-slip surface. Comes with carrying strap.",
        imageUrl: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?q=80&w=1000&auto=format&fit=crop",
        price: 59.99,
        discountPrice: 44.99,
        countInStock: 150,
        category: "Fitness & Training",
        brand: "Manduka",
        sport: "Yoga",
        sizes: ["Standard 72x24 inches"],
        colors: ["Purple", "Blue", "Green", "Black", "Pink"],
        gender: "Unisex",
        material: "TPE (Thermoplastic Elastomer)",
        ageGroup: "Adult",
        specifications: [
            { key: "Thickness", value: "6mm" },
            { key: "Dimensions", value: "72\" x 24\"" },
            { key: "Material", value: "Eco-friendly TPE" },
            { key: "Features", value: "Non-slip, Reversible" }
        ],
        rating: 4.9
    },

    // ==================== SPORTS APPAREL ====================
    {
        name: "Men's Dri-FIT Running Shirt",
        description: "Lightweight running shirt with moisture-wicking technology. Reflective details for low-light visibility.",
        imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop",
        price: 34.99,
        discountPrice: 27.99,
        countInStock: 200,
        category: "Sportswear - Men",
        brand: "Nike",
        sport: "Running",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "Navy", "Red", "Gray", "Neon Yellow"],
        gender: "Men",
        material: "100% Polyester",
        ageGroup: "Adult",
        specifications: [
            { key: "Technology", value: "Dri-FIT Moisture Wicking" },
            { key: "Fit", value: "Athletic Fit" },
            { key: "Features", value: "Reflective Details" },
            { key: "Care", value: "Machine Washable" }
        ],
        isFeatured: true,
        rating: 4.7
    },
    {
        name: "Women's Training Leggings - High Waist",
        description: "High-waisted compression leggings with four-way stretch. Hidden pocket for essentials.",
        imageUrl: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=1000&auto=format&fit=crop",
        price: 68.00,
        discountPrice: 54.99,
        countInStock: 180,
        category: "Sportswear - Women",
        brand: "Lululemon",
        sport: "Training",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Black", "Navy", "Burgundy", "Gray", "Teal"],
        gender: "Women",
        material: "84% Polyester, 16% Spandex",
        ageGroup: "Adult",
        specifications: [
            { key: "Fit", value: "High-Rise" },
            { key: "Compression", value: "Medium" },
            { key: "Features", value: "Hidden Pocket, Four-Way Stretch" },
            { key: "Inseam", value: "25 inches" }
        ],
        isFeatured: true,
        rating: 4.9
    },
    {
        name: "Men's Basketball Jersey - Breathable",
        description: "Authentic-style basketball jersey with mesh construction for maximum breathability. Classic design.",
        imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop",
        price: 49.99,
        discountPrice: 39.99,
        countInStock: 95,
        category: "Sports Apparel",
        brand: "Nike",
        sport: "Basketball",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Lakers Purple/Gold", "Bulls Red/Black", "Celtics Green/White"],
        gender: "Men",
        material: "100% Polyester Mesh",
        ageGroup: "Adult",
        specifications: [
            { key: "Style", value: "Swingman Jersey" },
            { key: "Construction", value: "Breathable Mesh" },
            { key: "Fit", value: "Loose Athletic" }
        ],
        rating: 4.6
    },
    {
        name: "Women's Sports Bra - High Impact",
        description: "Maximum support sports bra for high-intensity workouts. Adjustable straps and moisture-wicking fabric.",
        imageUrl: "https://images.unsplash.com/photo-1556906918-cb7c2f038183?q=80&w=1000&auto=format&fit=crop",
        price: 48.00,
        discountPrice: 38.99,
        countInStock: 140,
        category: "Sportswear - Women",
        brand: "Under Armour",
        sport: "Training",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Black", "White", "Pink", "Gray", "Navy"],
        gender: "Women",
        material: "88% Polyester, 12% Elastane",
        ageGroup: "Adult",
        specifications: [
            { key: "Support Level", value: "High Impact" },
            { key: "Technology", value: "Moisture Transport System" },
            { key: "Features", value: "Adjustable Straps, Removable Pads" },
            { key: "Fit", value: "Compression" }
        ],
        rating: 4.8
    },
    {
        name: "Men's Training Shorts - Quick Dry",
        description: "Ultra-light training shorts with built-in liner. Deep pockets and drawstring waist.",
        imageUrl: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=1000&auto=format&fit=crop",
        price: 32.99,
        countInStock: 165,
        category: "Sportswear - Men",
        brand: "Adidas",
        sport: "Training",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "Navy", "Gray", "Red"],
        gender: "Men",
        material: "100% Polyester",
        ageGroup: "Adult",
        specifications: [
            { key: "Inseam", value: "7 inches" },
            { key: "Features", value: "Built-in Liner, Zip Pockets" },
            { key: "Technology", value: "Climacool" }
        ],
        rating: 4.5
    },

    // ==================== SPORTS FOOTWEAR ====================
    {
        name: "Air Zoom Running Shoes - Men's",
        description: "Responsive cushioning running shoes with breathable mesh upper. Zoom Air units for springy feel.",
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
        price: 140.00,
        discountPrice: 119.99,
        countInStock: 85,
        category: "Sports Footwear",
        brand: "Nike",
        sport: "Running",
        sizes: ["7", "8", "9", "10", "11", "12", "13"],
        colors: ["Black/White", "Blue/Orange", "Gray/Red"],
        gender: "Men",
        material: "Mesh/Synthetic",
        ageGroup: "Adult",
        specifications: [
            { key: "Cushioning", value: "Zoom Air" },
            { key: "Drop", value: "10mm" },
            { key: "Support", value: "Neutral" },
            { key: "Terrain", value: "Road" },
            { key: "Weight", value: "10.2 oz" }
        ],
        isFeatured: true,
        rating: 4.8
    },
    {
        name: "Women's Ultraboost Running Shoes",
        description: "Premium running shoes with responsive Boost cushioning. Stretchy knit upper adapts to your foot.",
        imageUrl: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=1000&auto=format&fit=crop",
        price: 180.00,
        discountPrice: 144.99,
        countInStock: 70,
        category: "Sports Footwear",
        brand: "Adidas",
        sport: "Running",
        sizes: ["5", "6", "7", "8", "9", "10", "11"],
        colors: ["White/Black", "Gray/Purple", "Black/Pink"],
        gender: "Women",
        material: "Primeknit/Boost",
        ageGroup: "Adult",
        specifications: [
            { key: "Cushioning", value: "Boost Technology" },
            { key: "Drop", value: "10mm" },
            { key: "Support", value: "Neutral" },
            { key: "Upper", value: "Primeknit" },
            { key: "Weight", value: "9.2 oz" }
        ],
        isFeatured: true,
        rating: 4.9
    },
    {
        name: "Men's Basketball High-Top Shoes",
        description: "Performance basketball shoes with ankle support and responsive cushioning. Durable rubber outsole.",
        imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1000&auto=format&fit=crop",
        price: 130.00,
        discountPrice: 104.99,
        countInStock: 60,
        category: "Sports Footwear",
        brand: "Nike",
        sport: "Basketball",
        sizes: ["8", "9", "10", "11", "12", "13", "14"],
        colors: ["Black/Red", "White/Blue", "Gray/Orange"],
        gender: "Men",
        material: "Synthetic Leather/Mesh",
        ageGroup: "Adult",
        specifications: [
            { key: "Style", value: "High-Top" },
            { key: "Cushioning", value: "Air Zoom" },
            { key: "Support", value: "Ankle Support" },
            { key: "Traction", value: "Multidirectional" }
        ],
        rating: 4.7
    },
    {
        name: "Women's Training Shoes - Cross Trainer",
        description: "Versatile training shoes for gym workouts and classes. Stable base with flexible forefoot.",
        imageUrl: "https://images.unsplash.com/photo-1605408499391-6368c628ef42?q=80&w=1000&auto=format&fit=crop",
        price: 95.00,
        discountPrice: 76.99,
        countInStock: 110,
        category: "Sports Footwear",
        brand: "Reebok",
        sport: "Training",
        sizes: ["5", "6", "7", "8", "9", "10"],
        colors: ["Black/White", "Pink/Gray", "Navy/Teal"],
        gender: "Women",
        material: "Mesh/Synthetic",
        ageGroup: "Adult",
        specifications: [
            { key: "Use", value: "Cross Training" },
            { key: "Stability", value: "Wide Base" },
            { key: "Flexibility", value: "Flexible Forefoot" },
            { key: "Drop", value: "4mm" }
        ],
        rating: 4.6
    },
    {
        name: "Men's Football Cleats - Firm Ground",
        description: "Lightweight cleats with precision fit and aggressive traction. Textured upper for better ball control.",
        imageUrl: "https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=1000&auto=format&fit=crop",
        price: 110.00,
        discountPrice: 89.99,
        countInStock: 55,
        category: "Sports Footwear",
        brand: "Adidas",
        sport: "Football/Soccer",
        sizes: ["7", "8", "9", "10", "11", "12"],
        colors: ["Black/White", "Blue/Yellow", "Red/Black"],
        gender: "Men",
        material: "Synthetic",
        ageGroup: "Adult",
        specifications: [
            { key: "Surface", value: "Firm Ground" },
            { key: "Fit", value: "Speed Last" },
            { key: "Features", value: "Textured Upper" },
            { key: "Stud Pattern", value: "Bladed" }
        ],
        rating: 4.7
    },

    // ==================== SPORTS ACCESSORIES ====================
    {
        name: "Large Sports Duffel Bag - 60L",
        description: "Spacious gym bag with multiple compartments. Separate shoe compartment and water bottle holders.",
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop",
        price: 68.00,
        discountPrice: 54.99,
        countInStock: 120,
        category: "Gym Bags & Hydration",
        brand: "Under Armour",
        sport: "General",
        sizes: ["60L"],
        colors: ["Black", "Navy", "Gray", "Red"],
        gender: "Unisex",
        material: "600D Polyester",
        ageGroup: "Adult",
        specifications: [
            { key: "Capacity", value: "60 Liters" },
            { key: "Compartments", value: "Shoe, Main, Side Pockets" },
            { key: "Strap", value: "Adjustable Shoulder Strap" },
            { key: "Features", value: "Water Resistant" }
        ],
        rating: 4.6
    },
    {
        name: "Insulated Sports Water Bottle - 32oz",
        description: "Double-wall vacuum insulated bottle keeps drinks cold for 24 hours. Leak-proof lid with carry loop.",
        imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=1000&auto=format&fit=crop",
        price: 34.99,
        discountPrice: 27.99,
        countInStock: 250,
        category: "Gym Bags & Hydration",
        brand: "Hydro Flask",
        sport: "General",
        sizes: ["32oz"],
        colors: ["Black", "Blue", "Green", "Pink", "White", "Red"],
        gender: "Unisex",
        material: "Stainless Steel",
        ageGroup: "Adult",
        specifications: [
            { key: "Capacity", value: "32 oz (946 ml)" },
            { key: "Insulation", value: "24 hours cold, 12 hours hot" },
            { key: "Features", value: "Leak-proof, BPA-free" },
            { key: "Mouth", value: "Wide Mouth" }
        ],
        rating: 4.9
    },
    {
        name: "Resistance Bands Set - 5 Levels",
        description: "Complete resistance training set with 5 bands. Includes door anchor and carrying bag.",
        imageUrl: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?q=80&w=1000&auto=format&fit=crop",
        price: 29.99,
        discountPrice: 22.99,
        countInStock: 180,
        category: "Fitness & Training",
        brand: "TRX",
        sport: "Fitness",
        sizes: ["5 Band Set"],
        colors: ["Multi-Color"],
        gender: "Unisex",
        material: "Latex",
        ageGroup: "Adult",
        specifications: [
            { key: "Resistance Levels", value: "5 (X-Light to X-Heavy)" },
            { key: "Includes", value: "Door Anchor, Handles, Ankle Straps" },
            { key: "Max Resistance", value: "150 lbs combined" }
        ],
        rating: 4.7
    },
    {
        name: "Bike Helmet - Adult CPSC Certified",
        description: "Lightweight cycling helmet with adjustable fit system. Enhanced ventilation with 18 vents.",
        imageUrl: "https://images.unsplash.com/photo-1557803175-7e8fc21b9a8d?q=80&w=1000&auto=format&fit=crop",
        price: 55.00,
        discountPrice: 44.99,
        countInStock: 75,
        category: "Protective Gear",
        brand: "Giro",
        sport: "Cycling",
        sizes: ["Small", "Medium", "Large"],
        colors: ["Black", "White", "Blue", "Red"],
        gender: "Unisex",
        material: "Polycarbonate Shell/EPS Foam",
        ageGroup: "Adult",
        specifications: [
            { key: "Certification", value: "CPSC" },
            { key: "Ventilation", value: "18 Vents" },
            { key: "Fit System", value: "Adjustable Dial" },
            { key: "Weight", value: "280g" }
        ],
        rating: 4.8
    },
    {
        name: "Fitness Tracker Watch - Heart Rate Monitor",
        description: "Advanced fitness tracker with heart rate monitoring, GPS, and sleep tracking. 7-day battery life.",
        imageUrl: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=1000&auto=format&fit=crop",
        price: 149.99,
        discountPrice: 119.99,
        countInStock: 90,
        category: "Sports Accessories",
        brand: "Fitbit",
        sport: "General",
        sizes: ["One Size - Adjustable"],
        colors: ["Black", "Gray", "Navy", "Pink"],
        gender: "Unisex",
        material: "Silicone Band/Plastic Case",
        ageGroup: "Adult",
        specifications: [
            { key: "Features", value: "GPS, Heart Rate, Sleep Tracking" },
            { key: "Battery", value: "7 days" },
            { key: "Water Resistance", value: "50m" },
            { key: "Display", value: "AMOLED Touchscreen" }
        ],
        isFeatured: true,
        rating: 4.6
    },
    {
        name: "Knee Compression Sleeves - Pair",
        description: "Medical-grade compression sleeves for joint support. Perfect for running, basketball, and recovery.",
        imageUrl: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=1000&auto=format&fit=crop",
        price: 24.99,
        discountPrice: 19.99,
        countInStock: 200,
        category: "Protective Gear",
        brand: "McDavid",
        sport: "General",
        sizes: ["Small", "Medium", "Large", "XL"],
        colors: ["Black", "Navy"],
        gender: "Unisex",
        material: "Nylon/Spandex Blend",
        ageGroup: "Adult",
        specifications: [
            { key: "Compression", value: "Medical Grade" },
            { key: "Support", value: "Joint Stability" },
            { key: "Sold As", value: "Pair" },
            { key: "Features", value: "Moisture-wicking, Anti-slip" }
        ],
        rating: 4.7
    },

    // ==================== KIDS SPORTS ====================
    {
        name: "Kids Soccer Ball - Size 3",
        description: "Soft touch soccer ball designed for young players. Bright colors and durable construction.",
        imageUrl: "https://images.unsplash.com/photo-1614632537290-e34d9e9cd5c1?q=80&w=1000&auto=format&fit=crop",
        price: 19.99,
        countInStock: 150,
        category: "Kids Sports",
        brand: "Wilson",
        sport: "Football/Soccer",
        sizes: ["Size 3"],
        colors: ["Rainbow", "Blue/Yellow", "Pink/Purple"],
        gender: "Kids",
        material: "Synthetic PVC",
        ageGroup: "Kids",
        specifications: [
            { key: "Size", value: "3 (ages 8 and under)" },
            { key: "Features", value: "Soft Touch" },
            { key: "Age Range", value: "3-8 years" }
        ],
        rating: 4.8
    },
    {
        name: "Youth Baseball Glove - Right Hand Throw",
        description: "Premium leather youth baseball glove. Deep pocket design for easy ball control.",
        imageUrl: "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?q=80&w=1000&auto=format&fit=crop",
        price: 45.00,
        discountPrice: 35.99,
        countInStock: 65,
        category: "Kids Sports",
        brand: "Rawlings",
        sport: "Baseball",
        sizes: ["10 inch"],
        colors: ["Brown Leather", "Black"],
        gender: "Kids",
        material: "Full Grain Leather",
        ageGroup: "Youth",
        specifications: [
            { key: "Size", value: "10 inches" },
            { key: "Hand", value: "Right Hand Throw" },
            { key: "Position", value: "Youth All-Position" },
            { key: "Age Range", value: "8-12 years" }
        ],
        rating: 4.7
    }
];

const seedSportsProducts = async (clearExisting = false) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for sports products seeding...");

        // Clear existing products if requested
        if (clearExisting) {
            await Product.deleteMany({});
            console.log("🗑️  All existing products cleared!");
        }

        // Seed new sports products
        let createdCount = 0;
        let updatedCount = 0;

        for (const prod of sportsProducts) {
            const existing = await Product.findOne({ name: prod.name });

            const result = await Product.findOneAndUpdate(
                { name: prod.name },
                prod,
                { upsert: true, new: true, runValidators: true }
            );

            if (existing) {
                updatedCount++;
            } else {
                createdCount++;
            }
        }

        console.log(`✅ Sports products seeded successfully!`);
        console.log(`   - Created: ${createdCount} new products`);
        console.log(`   - Updated: ${updatedCount} existing products`);
        console.log(`   - Total: ${sportsProducts.length} products processed`);

        // Display summary by category
        const categories = await Product.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        console.log("\n📊 Products by Category:");
        categories.forEach(cat => {
            console.log(`   ${cat._id}: ${cat.count} products`);
        });

        // Display featured products
        const featured = await Product.find({ isFeatured: true }).select('name brand');
        console.log(`\n⭐ Featured Products (${featured.length}):`);
        featured.forEach((prod, index) => {
            console.log(`   ${index + 1}. ${prod.name} (${prod.brand})`);
        });

        mongoose.connection.close();
        console.log("\n✅ Database connection closed.");
    } catch (error) {
        console.error("❌ Error seeding sports products:", error);
        process.exit(1);
    }
};

// Check if clearExisting flag is passed as command line argument
// Usage: node sportsProductSeeder.js --clear OR node sportsProductSeeder.js
const clearExisting = process.argv.includes('--clear');

if (clearExisting) {
    console.log("⚠️  Warning: This will delete all existing products!");
}

seedSportsProducts(clearExisting);

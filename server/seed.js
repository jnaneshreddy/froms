//seed data is genrated bu AI based on models in server db


const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Form = require("./models/Form");
const Submission = require("./models/Submission");
require("dotenv").config();

const seedData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("Connected to MongoDB");

        // Clear existing data
        await User.deleteMany({});
        await Form.deleteMany({});
        await Submission.deleteMany({});
        console.log("Existing data cleared");

        // Create sample users
        const users = [
            {
                name: "Admin User",
                email: "admin@example.com",
                password: bcrypt.hashSync("admin123", 10),
                role: "admin",
            },
            {
                name: "John Doe",
                email: "john@example.com",
                password: bcrypt.hashSync("user123", 10),
                role: "user",
            },
            {
                name: "Jane Smith",
                email: "jane@example.com",
                password: bcrypt.hashSync("user123", 10),
                role: "user",
            },
            {
                name: "Bob Wilson",
                email: "bob@example.com",
                password: bcrypt.hashSync("user123", 10),
                role: "user",
            },
            {
                name: "Alice Johnson",
                email: "alice@example.com",
                password: bcrypt.hashSync("user123", 10),
                role: "user",
            }
        ];

        // Insert sample users into the database
        const createdUsers = await User.insertMany(users);
        console.log("Sample users seeded");

        // Get admin and regular users for form creation
        const adminUser = createdUsers.find(user => user.role === "admin");
        const regularUsers = createdUsers.filter(user => user.role === "user");

        // Create sample forms
        const forms = [
            {
                title: "Customer Feedback Survey",
                description: "Help us improve our services by providing your feedback",
                fields: [
                    {
                        id: "name",
                        label: "Full Name",
                        type: "text",
                        placeholder: "Enter your full name"
                    },
                    {
                        id: "email",
                        label: "Email Address",
                        type: "email",
                        placeholder: "Enter your email"
                    },
                    {
                        id: "rating",
                        label: "Overall Rating",
                        type: "select",
                        options: ["Excellent", "Good", "Average", "Poor"]
                    },
                    {
                        id: "comments",
                        label: "Additional Comments",
                        type: "textarea",
                        placeholder: "Share your thoughts..."
                    }
                ],
                createdBy: adminUser._id
            },
            {
                title: "Event Registration Form",
                description: "Register for our upcoming technology conference",
                fields: [
                    {
                        id: "fullName",
                        label: "Full Name",
                        type: "text",
                        placeholder: "Enter your full name"
                    },
                    {
                        id: "email",
                        label: "Email",
                        type: "email",
                        placeholder: "Enter your email"
                    },
                    {
                        id: "company",
                        label: "Company",
                        type: "text",
                        placeholder: "Enter your company name"
                    },
                    {
                        id: "jobTitle",
                        label: "Job Title",
                        type: "text",
                        placeholder: "Enter your job title"
                    },
                    {
                        id: "experience",
                        label: "Years of Experience",
                        type: "select",
                        options: ["0-2", "3-5", "6-10", "10+"]
                    },
                    {
                        id: "interests",
                        label: "Topics of Interest",
                        type: "checkbox",
                        options: ["AI/ML", "Web Development", "Mobile Development", "DevOps", "Data Science"]
                    },
                    {
                        id: "dietary",
                        label: "Dietary Restrictions",
                        type: "textarea",
                        placeholder: "Please specify any dietary restrictions"
                    }
                ],
                createdBy: adminUser._id
            },
            {
                title: "Job Application Form",
                description: "Apply for open positions at our company",
                fields: [
                    {
                        id: "firstName",
                        label: "First Name",
                        type: "text",
                        placeholder: "Enter your first name"
                    },
                    {
                        id: "lastName",
                        label: "Last Name",
                        type: "text",
                        placeholder: "Enter your last name"
                    },
                    {
                        id: "email",
                        label: "Email",
                        type: "email",
                        placeholder: "Enter your email"
                    },
                    {
                        id: "phone",
                        label: "Phone Number",
                        type: "tel",
                        placeholder: "Enter your phone number"
                    },
                    {
                        id: "position",
                        label: "Position Applied For",
                        type: "select",
                        options: ["Frontend Developer", "Backend Developer", "Full Stack Developer", "UI/UX Designer", "Data Scientist", "DevOps Engineer"]
                    },
                    {
                        id: "experience",
                        label: "Years of Experience",
                        type: "number",
                        placeholder: "Enter years of experience"
                    },
                    {
                        id: "availability",
                        label: "Available Start Date",
                        type: "date"
                    },
                    {
                        id: "coverLetter",
                        label: "Cover Letter",
                        type: "textarea",
                        placeholder: "Tell us why you're interested in this position"
                    }
                ],
                createdBy: adminUser._id
            },
            {
                title: "Product Review Form",
                description: "Share your experience with our products",
                fields: [
                    {
                        id: "product",
                        label: "Product Name",
                        type: "select",
                        options: ["Laptop Pro", "Smartphone X", "Tablet Mini", "Smartwatch Elite", "Headphones Max"]
                    },
                    {
                        id: "purchaseDate",
                        label: "Purchase Date",
                        type: "date"
                    },
                    {
                        id: "rating",
                        label: "Overall Rating",
                        type: "radio",
                        options: ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"]
                    },
                    {
                        id: "pros",
                        label: "What did you like?",
                        type: "textarea",
                        placeholder: "Share the positive aspects"
                    },
                    {
                        id: "cons",
                        label: "What could be improved?",
                        type: "textarea",
                        placeholder: "Share areas for improvement"
                    },
                    {
                        id: "recommend",
                        label: "Would you recommend this product?",
                        type: "radio",
                        options: ["Yes", "No", "Maybe"]
                    }
                ],
                createdBy: adminUser._id
            }
        ];

        // Insert sample forms
        const createdForms = await Form.insertMany(forms);
        console.log("Sample forms seeded");

        // Create sample submissions
        const submissions = [
            // Submissions for Customer Feedback Survey
            {
                formId: createdForms[0]._id,
                userId: regularUsers[0]._id,
                responses: {
                    name: "John Doe",
                    email: "john@example.com",
                    rating: "Excellent",
                    comments: "Great service! Very satisfied with the experience."
                }
            },
            {
                formId: createdForms[0]._id,
                userId: regularUsers[1]._id,
                responses: {
                    name: "Jane Smith",
                    email: "jane@example.com",
                    rating: "Good",
                    comments: "Overall good experience, but there's room for improvement in response time."
                }
            },
            {
                formId: createdForms[0]._id,
                userId: regularUsers[2]._id,
                responses: {
                    name: "Bob Wilson",
                    email: "bob@example.com",
                    rating: "Average",
                    comments: "Service was okay. Expected better based on reviews."
                }
            },

            // Submissions for Event Registration Form
            {
                formId: createdForms[1]._id,
                userId: regularUsers[0]._id,
                responses: {
                    fullName: "John Doe",
                    email: "john@example.com",
                    company: "Tech Corp",
                    jobTitle: "Software Engineer",
                    experience: "3-5",
                    interests: ["AI/ML", "Web Development"],
                    dietary: "No restrictions"
                }
            },
            {
                formId: createdForms[1]._id,
                userId: regularUsers[3]._id,
                responses: {
                    fullName: "Alice Johnson",
                    email: "alice@example.com",
                    company: "Data Solutions Inc",
                    jobTitle: "Data Analyst",
                    experience: "6-10",
                    interests: ["Data Science", "AI/ML"],
                    dietary: "Vegetarian"
                }
            },

            // Submissions for Job Application Form
            {
                formId: createdForms[2]._id,
                userId: regularUsers[1]._id,
                responses: {
                    firstName: "Jane",
                    lastName: "Smith",
                    email: "jane@example.com",
                    phone: "(555) 123-4567",
                    position: "Frontend Developer",
                    experience: "4",
                    availability: "2024-01-15",
                    coverLetter: "I am excited to apply for the Frontend Developer position. With 4 years of experience in React and modern web technologies, I believe I would be a great fit for your team."
                }
            },
            {
                formId: createdForms[2]._id,
                userId: regularUsers[2]._id,
                responses: {
                    firstName: "Bob",
                    lastName: "Wilson",
                    email: "bob@example.com",
                    phone: "(555) 987-6543",
                    position: "Full Stack Developer",
                    experience: "6",
                    availability: "2024-02-01",
                    coverLetter: "I have 6 years of experience in full-stack development with expertise in Node.js, React, and cloud technologies. I'm passionate about building scalable applications."
                }
            },

            // Submissions for Product Review Form
            {
                formId: createdForms[3]._id,
                userId: regularUsers[0]._id,
                responses: {
                    product: "Laptop Pro",
                    purchaseDate: "2023-11-15",
                    rating: "5 Stars",
                    pros: "Excellent performance, great build quality, long battery life",
                    cons: "A bit expensive, but worth the investment",
                    recommend: "Yes"
                }
            },
            {
                formId: createdForms[3]._id,
                userId: regularUsers[3]._id,
                responses: {
                    product: "Smartphone X",
                    purchaseDate: "2023-12-01",
                    rating: "4 Stars",
                    pros: "Great camera, fast performance, sleek design",
                    cons: "Battery life could be better",
                    recommend: "Yes"
                }
            }
        ];

        // Insert sample submissions
        await Submission.insertMany(submissions);
        console.log("Sample submissions seeded");

        console.log("\n=== SEED DATA SUMMARY ===");
        console.log(`Created ${createdUsers.length} users:`);
        createdUsers.forEach(user => {
            console.log(`  - ${user.name} (${user.email}) - Role: ${user.role}`);
        });
        
        console.log(`\nCreated ${createdForms.length} forms:`);
        createdForms.forEach(form => {
            console.log(`  - ${form.title} (${form.fields.length} fields)`);
        });
        
        console.log(`\nCreated ${submissions.length} submissions`);
        console.log("\n=== LOGIN CREDENTIALS ===");
        console.log("Admin: admin@example.com / admin123");
        console.log("Users: john@example.com, jane@example.com, bob@example.com, alice@example.com / user123");

        // Close the connection
        mongoose.connection.close();
        console.log("\nConnection closed - Seeding completed successfully!");
    } catch (error) {
        console.error("Error seeding data:", error);
        mongoose.connection.close();
    }
};

seedData();
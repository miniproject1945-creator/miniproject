import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { locations } from "./data/locations";
import { categories } from "./data/categories";
import { users } from "./data/users";
import { SALT } from "../src/configs";
import { events } from "./data/events";
const prisma = new PrismaClient();
async function seed() {
    const hashPassword = (password) => {
        const salt = bcrypt.genSaltSync(Number(SALT));
        return bcrypt.hashSync(password, salt);
    };
    for (const location of locations) {
        await prisma.location.create({ data: location });
    }
    ;
    for (const category of categories) {
        await prisma.category.create({ data: category });
    }
    ;
    for (const user of users) {
        await prisma.user.create({
            data: {
                username: user.username,
                email: user.email,
                password: hashPassword(user.password),
                isAdmin: user.isAdmin,
                referralCode: user.referralCode,
            },
        });
    }
    for (const event of events) {
        await prisma.event.create({
            data: {
                name: event.name,
                price: event.price,
                description: event.description,
                imageURL: event.imageURL,
                availableSeats: event.availableSeats,
                maxCapacity: event.maxCapacity,
                limitCheckout: event.limitCheckout,
                startDate: new Date(event.startDate),
                endDate: new Date(event.endDate),
                user: { connect: { id: event.userId } },
                location: { connect: { id: event.locationId } },
                category: { connect: { id: event.categoryId } },
            },
        });
    }
}
seed()
    .catch((error) => {
    console.error(error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});

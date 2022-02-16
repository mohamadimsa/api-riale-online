const { PrismaClient } = require('@prisma/client')

/**
 * @type {prisma|PrismaClient}
 */
const prisma = new PrismaClient();


module.exports = prisma
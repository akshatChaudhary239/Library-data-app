import cron from 'node-cron';
import prisma from '../../config/database';

export const startNotificationCron = () => {
  // Run daily at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('[CRON] Starting notification generation job...');
    try {
      await generateSubscriptionExpiringNotifications();
      // await generateOverdueNotifications();
      console.log('[CRON] Notification generation job completed.');
    } catch (error) {
      console.error('[CRON] Error during notification generation:', error);
    }
  });
};

const generateSubscriptionExpiringNotifications = async () => {
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const today = new Date();

  // Find students whose subscription ends between today and next week
  const expiringStudents = await prisma.student.findMany({
    where: {
      status: 'ACTIVE',
      subscriptionEndDate: {
        lte: nextWeek,
        gt: today,
      },
    },
    select: {
      id: true,
      name: true,
      libraryId: true,
      subscriptionEndDate: true,
    },
  });

  for (const student of expiringStudents) {
    // Check if notification already exists for this student recently to avoid spam
    // Simplification: Just create the notification for the library owner
    await prisma.notification.create({
      data: {
        libraryId: student.libraryId,
        type: 'SUBSCRIPTION_EXPIRING',
        title: 'Subscription Expiring Soon',
        message: `${student.name}'s subscription expires on ${student.subscriptionEndDate.toLocaleDateString()}.`,
        studentId: student.id,
      },
    });
  }
};

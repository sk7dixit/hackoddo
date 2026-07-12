import dbClient from '../db/db-client';
import { Booking, Asset } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class BookingService {
  /**
   * Checks if a booking time range overlaps with any existing confirmed booking for the resource.
   */
  static async checkOverlap(resourceId: string, startTime: string, endTime: string, ignoreBookingId?: string): Promise<boolean> {
    const bookings = await dbClient.getBookings();
    
    const startMs = new Date(startTime).getTime();
    const endMs = new Date(endTime).getTime();

    if (isNaN(startMs) || isNaN(endMs) || startMs >= endMs) {
      throw new Error('Invalid start or end time. Start time must be before end time.');
    }

    // Find any confirmed booking for the same resource that overlaps
    return bookings.some(b => {
      if (b.resourceId !== resourceId || b.status !== 'confirmed') return false;
      if (ignoreBookingId && b.id === ignoreBookingId) return false;

      const existingStart = new Date(b.startTime).getTime();
      const existingEnd = new Date(b.endTime).getTime();

      // Overlap condition: start1 < end2 AND end1 > start2
      return startMs < existingEnd && endMs > existingStart;
    });
  }

  static async getBookings(): Promise<Booking[]> {
    return dbClient.getBookings();
  }

  static async createBooking(data: Omit<Booking, 'id' | 'status'>): Promise<Booking> {
    // Verify asset is a resource
    const assets = await dbClient.getAssets();
    const categories = await dbClient.getCategories();
    
    const resource = assets.find(a => a.id === data.resourceId);
    if (!resource) {
      throw new Error('Resource not found.');
    }

    const category = categories.find(c => c.id === resource.categoryId);
    if (!category || category.type !== 'resource') {
      throw new Error('This asset cannot be booked by time-slots. Only resources can be booked.');
    }

    if (resource.status === 'under_maintenance' || resource.status === 'retired' || resource.status === 'disposed') {
      throw new Error(`Resource is currently unavailable due to status: ${resource.status}`);
    }

    // Check overlap
    const hasOverlap = await this.checkOverlap(data.resourceId, data.startTime, data.endTime);
    if (hasOverlap) {
      throw new Error('Time slot conflict: This resource is already booked during the selected timeframe.');
    }

    const newBooking: Booking = {
      ...data,
      id: uuidv4(),
      status: 'confirmed'
    };

    const bookings = await dbClient.getBookings();
    bookings.push(newBooking);
    await dbClient.saveBookings(bookings);

    // Create a history log entry on the resource
    resource.history.push({
      id: uuidv4(),
      action: 'Resource Booked',
      date: new Date().toISOString(),
      performedBy: data.employeeId,
      notes: `Booked: "${data.title}" from ${new Date(data.startTime).toLocaleString()} to ${new Date(data.endTime).toLocaleString()}`
    });
    await dbClient.saveAssets(assets);

    return newBooking;
  }

  static async cancelBooking(id: string, employeeId: string): Promise<Booking> {
    const bookings = await dbClient.getBookings();
    const bookingIndex = bookings.findIndex(b => b.id === id);
    
    if (bookingIndex === -1) {
      throw new Error('Booking not found.');
    }

    const booking = bookings[bookingIndex];
    booking.status = 'cancelled';
    await dbClient.saveBookings(bookings);

    // Add log to asset history
    const assets = await dbClient.getAssets();
    const resource = assets.find(a => a.id === booking.resourceId);
    if (resource) {
      resource.history.push({
        id: uuidv4(),
        action: 'Booking Cancelled',
        date: new Date().toISOString(),
        performedBy: employeeId,
        notes: `Booking "${booking.title}" cancelled.`
      });
      await dbClient.saveAssets(assets);
    }

    return booking;
  }
}
export default BookingService;

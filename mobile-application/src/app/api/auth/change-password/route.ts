import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function POST(request: Request) {
  try {
    const { employeeId, currentPassword, newPassword } = await request.json();

    if (!employeeId || !currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Current password and new password are required.' },
        { status: 400 }
      );
    }

    if (newPassword.trim().length < 4) {
      return NextResponse.json(
        { success: false, message: 'New password/PIN must be at least 4 characters.' },
        { status: 400 }
      );
    }

    if (!adminDb) {
      return NextResponse.json(
        { success: false, message: 'Server database connection not initialized.' },
        { status: 500 }
      );
    }

    const credRef = adminDb.collection('pwa_credentials').doc(employeeId);
    const credDoc = await credRef.get();

    if (!credDoc.exists) {
      return NextResponse.json(
        { success: false, message: 'PWA Account credentials not found.' },
        { status: 404 }
      );
    }

    const credData = credDoc.data()!;

    if (credData.passwordHash !== currentPassword.trim()) {
      return NextResponse.json(
        { success: false, message: 'Current password is incorrect.' },
        { status: 401 }
      );
    }

    // Update password in Firestore pwa_credentials
    await credRef.update({
      passwordHash: newPassword.trim(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully! Admin dashboard is in sync.',
    });
  } catch (error: any) {
    console.error('Change password API error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to update password.' },
      { status: 500 }
    );
  }
}

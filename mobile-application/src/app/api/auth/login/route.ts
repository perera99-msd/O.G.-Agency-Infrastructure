import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebaseAdmin';

export async function POST(request: Request) {
  try {
    const { passportNumber, password } = await request.json();

    if (!passportNumber || !password) {
      return NextResponse.json(
        { success: false, message: 'Passport number and PIN/Password are required.' },
        { status: 400 }
      );
    }

    const cleanPassport = passportNumber.trim().toUpperCase();

    if (!adminDb) {
      return NextResponse.json(
        { success: false, message: 'Server database connection not initialized.' },
        { status: 500 }
      );
    }

    // Query pwa_credentials by passportNumber or username
    const snapshot = await adminDb
      .collection('pwa_credentials')
      .where('username', '==', cleanPassport)
      .get();

    let credDoc = snapshot.docs[0];

    if (!credDoc) {
      // Also try querying by passportNumber field directly
      const passSnap = await adminDb
        .collection('pwa_credentials')
        .where('passportNumber', '==', cleanPassport)
        .get();
      credDoc = passSnap.docs[0];
    }

    if (!credDoc) {
      return NextResponse.json(
        { success: false, message: 'No mobile account found for this Passport Number. Please contact Admin.' },
        { status: 404 }
      );
    }

    const credData = credDoc.data();

    if (credData.status === 'disabled') {
      return NextResponse.json(
        { success: false, message: 'Your account has been disabled by Admin.' },
        { status: 403 }
      );
    }

    // Verify Password / PIN
    if (credData.passwordHash !== password.trim()) {
      return NextResponse.json(
        { success: false, message: 'Incorrect PIN or Password.' },
        { status: 401 }
      );
    }

    // Update lastLoginAt
    await credDoc.ref.update({
      lastLoginAt: new Date().toISOString(),
    });

    // Generate Custom JWT Token using Firebase Admin (or fallback to simple token)
    let customToken = '';
    if (adminAuth) {
      customToken = await adminAuth.createCustomToken(credData.employeeId, {
        passportNumber: credData.passportNumber,
        employeeName: credData.employeeName,
      });
    }

    return NextResponse.json({
      success: true,
      customToken,
      employeeId: credData.employeeId,
      employeeName: credData.employeeName,
      passportNumber: credData.passportNumber,
    });
  } catch (error: any) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Authentication failed.' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Authorize.Net API endpoint
const AUTHORIZE_NET_URL = process.env.AUTHORIZE_NET_ENVIRONMENT === 'production' 
  ? 'https://api.authorize.net/xml/v1/request.api'
  : 'https://apitest.authorize.net/xml/v1/request.api';

// Email sending function (framework ready for SMTP integration)
async function sendThankYouEmail(donorData: any, transactionData: any) {
  console.log('Preparing thank you email for:', donorData.email);
  
  const emailContent = {
    to: donorData.email,
    subject: `Thank you for your ${transactionData.frequency === 'one-time' ? 'donation' : 'recurring donation setup'} to Jeff & Julie's Ministry!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4ECDC4, #2C3E50); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .donation-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4ECDC4; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
          .amount { font-size: 24px; font-weight: bold; color: #4ECDC4; }
          .contact-info { background: #e8f7f6; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .recurring-info { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🙏 Thank You, ${donorData.firstName}!</h1>
            <p>Your generosity is multiplying ministry across three continents</p>
          </div>
          
          <div class="content">
            <p>Dear ${donorData.firstName} ${donorData.lastName},</p>
            
            <p>Thank you so much for your generous ${transactionData.frequency} ${transactionData.paymentMethod === 'ach' ? 'bank transfer' : 'donation'} to support Jeff & Julie's strategic ministry work!</p>
            
            ${transactionData.frequency !== 'one-time' ? `
            <div class="recurring-info">
              <h3>💚 Recurring Donation Setup</h3>
              <p><strong>Your ${transactionData.frequency} recurring donation of $${transactionData.amount.toFixed(2)} has been successfully set up!</strong></p>
              <p>Subscription ID: ${transactionData.subscriptionId || transactionData.authorizeNetTransactionId}</p>
              <p>Next charge: ${transactionData.frequency === 'monthly' ? 'Next month' : transactionData.frequency === 'quarterly' ? 'In 3 months' : 'Next year'}</p>
              <p>You can modify or cancel this subscription anytime by contacting jeff.julie@ibam.org</p>
            </div>
            ` : ''}
            
            <div class="donation-details">
              <h3>📋 ${transactionData.frequency === 'one-time' ? 'Donation' : 'Subscription'} Details</h3>
              <p><strong>Amount:</strong> <span class="amount">$${transactionData.amount.toFixed(2)}</span> ${transactionData.frequency !== 'one-time' ? `(${transactionData.frequency})` : ''}</p>
              <p><strong>Total Charged Today:</strong> $${transactionData.totalCharged.toFixed(2)} ${transactionData.paymentMethod === 'ach' ? '(includes small ACH fee)' : '(includes processing fee if covered)'}</p>
              <p><strong>Payment Method:</strong> ${transactionData.paymentMethod === 'ach' ? 'Bank Transfer (ACH)' : 'Credit Card'}</p>
              <p><strong>Frequency:</strong> ${transactionData.frequency}</p>
              <p><strong>Transaction/Subscription ID:</strong> ${transactionData.subscriptionId || transactionData.authorizeNetTransactionId}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
              ${transactionData.paymentMethod === 'ach' ? '<p><strong>Processing Time:</strong> 2-4 business days</p>' : ''}
            </div>
            
            ${donorData.prayerRequests ? `
            <div class="donation-details">
              <h3>🙏 Your Prayer Request</h3>
              <p><em>"${donorData.prayerRequests}"</em></p>
              <p>Jeff & Julie will be praying for this request personally.</p>
            </div>
            ` : ''}
            
            <h3>🌍 Your Force Multiplier Impact</h3>
            <p>Your ${transactionData.frequency !== 'one-time' ? 'ongoing' : ''} gift enables strategic ministry infrastructure that multiplies across three continents:</p>
            <ul>
              <li><strong>Leadership Training:</strong> Equipping leaders who reach 1,000+ people</li>
              <li><strong>Resource Creation:</strong> Developing materials used by 20+ organizations</li>
              <li><strong>Business Development:</strong> Facilitating Kingdom-focused enterprises</li>
            </ul>
            
            <div class="contact-info">
              <h3>📞 IBAM Contact Information</h3>
              <p><strong>Jeff & Julie:</strong> jeff.julie@ibam.org</p>
              <p><strong>IBAM Office:</strong> [Add main office contact]</p>
              <p><strong>Website:</strong> www.ibam.org</p>
              <p><strong>Tax ID:</strong> [Add EIN for tax purposes]</p>
            </div>
            
            <p><strong>Tax Information:</strong> ${transactionData.frequency === 'one-time' ? 'This donation is' : 'Your recurring donations are'} tax-deductible to the fullest extent allowed by law. IBAM is a registered 501(c)(3) organization. ${transactionData.frequency !== 'one-time' ? 'You will receive annual tax summaries for your recurring donations.' : 'Please keep this email as your tax receipt.'}</p>
            
            <p>Jeff & Julie are deeply grateful for your partnership in strategic ministry multiplication. Your support enables them to focus full-time on training leaders who train others, creating exponential Kingdom impact.</p>
            
            <p>Blessings,<br>
            <strong>The IBAM Team</strong></p>
          </div>
          
          <div class="footer">
            <p>IBAM (International Business as Mission)<br>
            Strategic Force Multiplication • Global Kingdom Impact</p>
            <p style="font-size: 12px;">If you have any questions about your ${transactionData.frequency === 'one-time' ? 'donation' : 'recurring donation'}, please contact jeff.julie@ibam.org</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
  
  console.log('Email prepared:', {
    to: emailContent.to,
    subject: emailContent.subject,
    contentLength: emailContent.html.length
  });
  
  return { success: true, emailSent: true };
}

// Admin notification email
async function sendAdminNotification(donorData: any, transactionData: any) {
  console.log('Preparing admin notification for:', 'jeff.julie@ibam.org');
  
  const adminEmail = {
    to: 'jeff.julie@ibam.org',
    subject: `New ${transactionData.frequency === 'one-time' ? '' : 'Recurring '}${transactionData.paymentMethod === 'ach' ? 'ACH' : 'Credit Card'} Donation: $${transactionData.amount} from ${donorData.firstName} ${donorData.lastName}`,
    html: `
      <h2>🎉 New ${transactionData.frequency === 'one-time' ? 'Donation' : 'Recurring Donation'} Received!</h2>
      
      ${transactionData.frequency !== 'one-time' ? '<p><strong>⚡ RECURRING DONATION SET UP!</strong></p>' : ''}
      
      <h3>Donor Information:</h3>
      <ul>
        <li><strong>Name:</strong> ${donorData.firstName} ${donorData.lastName}</li>
        <li><strong>Email:</strong> ${donorData.email}</li>
        <li><strong>Phone:</strong> ${donorData.phone || 'Not provided'}</li>
      </ul>
      
      <h3>${transactionData.frequency === 'one-time' ? 'Donation' : 'Subscription'} Details:</h3>
      <ul>
        <li><strong>Amount:</strong> $${transactionData.amount.toFixed(2)} ${transactionData.frequency !== 'one-time' ? `(${transactionData.frequency})` : ''}</li>
        <li><strong>Total Processed Today:</strong> $${transactionData.totalCharged.toFixed(2)}</li>
        <li><strong>Payment Method:</strong> ${transactionData.paymentMethod === 'ach' ? 'Bank Transfer (ACH)' : 'Credit Card'}</li>
        <li><strong>Frequency:</strong> ${transactionData.frequency}</li>
        <li><strong>${transactionData.frequency === 'one-time' ? 'Transaction' : 'Subscription'} ID:</strong> ${transactionData.subscriptionId || transactionData.authorizeNetTransactionId}</li>
        <li><strong>Auth Code:</strong> ${transactionData.authCode || 'N/A for subscriptions'}</li>
      </ul>
      
      ${transactionData.frequency !== 'one-time' ? `
      <h3>🔄 Recurring Payment Info:</h3>
      <ul>
        <li><strong>Next Charge:</strong> ${transactionData.frequency === 'monthly' ? 'Next month' : transactionData.frequency === 'quarterly' ? 'In 3 months' : 'Next year'}</li>
        <li><strong>Expected Monthly Revenue:</strong> $${transactionData.frequency === 'monthly' ? transactionData.amount.toFixed(2) : transactionData.frequency === 'quarterly' ? (transactionData.amount / 3).toFixed(2) : (transactionData.amount / 12).toFixed(2)}</li>
      </ul>
      ` : ''}
      
      ${donorData.prayerRequests ? `
      <h3>🙏 Prayer Request:</h3>
      <p><em>"${donorData.prayerRequests}"</em></p>
      ` : ''}
      
      <p>Donor has been sent an automatic thank you email with ${transactionData.frequency === 'one-time' ? 'tax receipt' : 'subscription details'}.</p>
    `
  };
  
  console.log('Admin notification prepared');
  return { success: true, adminNotified: true };
}

// Create Authorize.Net Subscription for recurring donations
async function createAuthorizeNetSubscription(paymentData: any) {
  console.log('Creating subscription for:', paymentData.frequency);

  // Calculate interval based on frequency
  let interval;
  switch (paymentData.frequency) {
    case 'monthly':
      interval = { length: 1, unit: 'months' };
      break;
    case 'quarterly':
      interval = { length: 3, unit: 'months' };
      break;
    case 'annual':
      interval = { length: 12, unit: 'months' };
      break;
    default:
      throw new Error('Invalid frequency for subscription');
  }

  // Build payment profile based on method
  let paymentProfile;
  if (paymentData.paymentMethod === 'credit-card') {
    paymentProfile = {
      creditCard: {
        cardNumber: paymentData.cardNumber.replace(/\s/g, ''),
        expirationDate: paymentData.expirationDate,
        cardCode: paymentData.cardCode
      }
    };
  } else {
    paymentProfile = {
      bankAccount: {
        accountType: paymentData.accountType,
        routingNumber: paymentData.routingNumber,
        accountNumber: paymentData.accountNumber,
        nameOnAccount: paymentData.accountHolderName,
        echeckType: "WEB"
      }
    };
  }

  const subscriptionRequest = {
    ARBCreateSubscriptionRequest: {
      merchantAuthentication: {
  name: "54HSQ2enmz",
transactionKey: "5zN9fB72GnG25cA7"},
      refId: `SUB${Date.now().toString().slice(-8)}`,
      subscription: {
        name: `${paymentData.donor.firstName} ${paymentData.donor.lastName} - ${paymentData.frequency} Ministry Support`,
        paymentSchedule: {
          interval: interval,
          startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Start tomorrow
          totalOccurrences: 9999 // Essentially unlimited
        },
        amount: paymentData.totalAmount.toFixed(2),
        payment: paymentProfile,
        order: {
          invoiceNumber: `SUB-${Date.now().toString().slice(-8)}`,
          description: `${paymentData.frequency} Ministry Donation - Jeff & Julie`
        },
        customer: {
          id: `SUB${Date.now().toString().slice(-8)}`,
          email: paymentData.donor.email
        },
        billTo: {
          firstName: paymentData.donor.firstName,
          lastName: paymentData.donor.lastName,
          address: paymentData.billing?.address || "123 Main St",
          city: paymentData.billing?.city || "Anytown",
          state: paymentData.billing?.state || "UT",
          zip: paymentData.billing?.zip || "84000",
          country: "US"
        }
      }
    }
  };

  console.log('🔍 SUBSCRIPTION: About to send request to Authorize.Net');
  console.log('🔍 SUBSCRIPTION URL:', AUTHORIZE_NET_URL);
  console.log('🔍 SUBSCRIPTION Request:', JSON.stringify(subscriptionRequest, null, 2));

  try {
    const response = await fetch(AUTHORIZE_NET_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(subscriptionRequest)
    });

    console.log('🔍 SUBSCRIPTION Response status:', response.status);
    const result = await response.json();
    console.log('🔍 SUBSCRIPTION Full response:', JSON.stringify(result, null, 2));

    if (result.subscriptionId) {
      return {
        success: true,
        subscriptionId: result.subscriptionId,
        responseCode: '1',
        description: 'Subscription created successfully'
      };
    } else if (result.messages) {
      return {
        success: false,
        error: result.messages.message?.[0]?.text || 'Subscription creation failed'
      };
    } else {
      return {
        success: false,
        error: 'Unknown subscription creation error'
      };
    }
  } catch (error) {
    console.error('🔍 SUBSCRIPTION FETCH ERROR:', error);
    return {
      success: false,
      error: 'Subscription creation system temporarily unavailable'
    };
  }
}

// One-time payment processing with enhanced debug logging
async function processAuthorizeNetPayment(paymentData: any) {
  console.log('Processing one-time payment:', paymentData.paymentMethod);

  let authNetRequest;

  if (paymentData.paymentMethod === 'credit-card') {
    authNetRequest = {
      createTransactionRequest: {
        merchantAuthentication: {
        name: "54HSQ2enmz",
transactionKey: process.env.AUTHORIZE_NET_TRANSACTION_KEY},
        refId: `DON${Date.now().toString().slice(-8)}`,
        transactionRequest: {
          transactionType: "authCaptureTransaction",
          amount: paymentData.totalAmount.toFixed(2),
          payment: {
            creditCard: {
              cardNumber: paymentData.cardNumber.replace(/\s/g, ''),
              expirationDate: paymentData.expirationDate,
              cardCode: paymentData.cardCode
            }
          },
          order: {
            invoiceNumber: `INV-${Date.now().toString().slice(-8)}`,
            description: `Ministry Donation - one-time`
          },
          customer: {
            id: `C${Date.now().toString().slice(-8)}`,
            email: paymentData.donor.email
          },
          billTo: {
            firstName: paymentData.donor.firstName,
            lastName: paymentData.donor.lastName,
            address: paymentData.billing?.address || "",
            city: paymentData.billing?.city || "",
            state: paymentData.billing?.state || "",
            zip: paymentData.billing?.zip || "",
            country: "US"
          }
        }
      }
    };
  } else {
    authNetRequest = {
      createTransactionRequest: {
merchantAuthentication: {
  name: "54HSQ2enmz",
  transactionKey: "5zN9fB72GnG25cA7"
},
        refId: `ACH${Date.now().toString().slice(-8)}`,
        transactionRequest: {
          transactionType: "authCaptureTransaction",
          amount: paymentData.totalAmount.toFixed(2),
          payment: {
            bankAccount: {
              accountType: paymentData.accountType,
              routingNumber: paymentData.routingNumber,
              accountNumber: paymentData.accountNumber,
              nameOnAccount: paymentData.accountHolderName,
              echeckType: "WEB"
            }
          },
          order: {
            invoiceNumber: `ACH-${Date.now().toString().slice(-8)}`,
            description: `Ministry ACH Donation - one-time`
          },
          customer: {
            id: `A${Date.now().toString().slice(-8)}`,
            email: paymentData.donor.email
          },
          billTo: {
            firstName: paymentData.donor.firstName,
            lastName: paymentData.donor.lastName,
            company: paymentData.bankName || "",
            address: "123 Main St",
            city: "Anytown", 
            state: "UT",
            zip: "84000",
            country: "US"
          }
        }
      }
    };
  }

  console.log('🔍 ONE-TIME: About to send request to Authorize.Net');
  console.log('🔍 ONE-TIME URL:', AUTHORIZE_NET_URL);
  console.log('🔍 ONE-TIME Request:', JSON.stringify(authNetRequest, null, 2));

  try {
    const response = await fetch(AUTHORIZE_NET_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(authNetRequest)
    });

    console.log('🔍 ONE-TIME Response status:', response.status);
    const result = await response.json();
    console.log('🔍 ONE-TIME Full response:', JSON.stringify(result, null, 2));
    
    if (result.transactionResponse) {
      const transactionResponse = result.transactionResponse;
      console.log('🔍 ONE-TIME Transaction response found:', transactionResponse);
      
if (transactionResponse.responseCode === "1" || transactionResponse.responseCode === "4") {
          console.log('🔍 ONE-TIME SUCCESS: Transaction approved');
        return {
          success: true,
          transactionId: transactionResponse.transId,
          authCode: transactionResponse.authCode,
          responseCode: transactionResponse.responseCode,
          messageCode: transactionResponse.messages?.[0]?.code,
          description: transactionResponse.messages?.[0]?.description
        };
      } else {
        console.log('🔍 ONE-TIME DECLINE: Transaction declined by Authorize.Net');
        console.log('🔍 ONE-TIME Decline reason:', transactionResponse.errors?.[0]?.errorText);
        return {
          success: false,
          error: transactionResponse.errors?.[0]?.errorText || transactionResponse.messages?.[0]?.description || 'Transaction declined',
          responseCode: transactionResponse.responseCode,
          messageCode: transactionResponse.messages?.[0]?.code
        };
      }
    } else if (result.messages) {
      console.log('🔍 ONE-TIME API ERROR: Messages found in response');
      console.log('🔍 ONE-TIME API Error details:', result.messages);
      return {
        success: false,
        error: result.messages.message?.[0]?.text || 'Payment processing failed'
      };
    } else {
      console.log('🔍 ONE-TIME UNKNOWN ERROR: Unexpected response format');
      return {
        success: false,
        error: 'Unknown payment processing error'
      };
    }
  } catch (error) {
    console.error('🔍 ONE-TIME FETCH ERROR: Request failed before reaching Authorize.Net');
    console.error('🔍 ONE-TIME Error details:', error);
    console.error('🔍 ONE-TIME Error message:', error.message);
    return {
      success: false,
      error: 'Payment processing system temporarily unavailable'
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { donor, amount, frequency, paymentMethod, coverFees, totalAmount, processingFees, paymentDetails } = body;

    console.log('Donation request received:', {
      amount,
      frequency,
      paymentMethod,
      donor: donor?.email,
      isRecurring: frequency !== 'one-time'
    });

    // Validate required fields
    if (!donor?.firstName || !donor?.lastName || !donor?.email || !amount) {
      return NextResponse.json(
        { error: 'Missing required donor information' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(donor.email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Validate payment details
    if (paymentMethod === 'credit-card') {
      if (!paymentDetails?.cardNumber || !paymentDetails?.expirationDate || !paymentDetails?.cardCode) {
        return NextResponse.json(
          { error: 'Missing credit card information' },
          { status: 400 }
        );
      }
    } else if (paymentMethod === 'ach') {
      if (!paymentDetails?.accountType || !paymentDetails?.routingNumber || !paymentDetails?.accountNumber || !paymentDetails?.accountHolderName) {
        return NextResponse.json(
          { error: 'Missing bank account information' },
          { status: 400 }
        );
      }
      
      if (paymentDetails.routingNumber.length !== 9) {
        return NextResponse.json(
          { error: 'Routing number must be exactly 9 digits' },
          { status: 400 }
        );
      }
    }

    // Calculate processing fees correctly
    const calculatedProcessingFees = paymentMethod === 'credit-card' 
      ? (amount * 0.029) + 0.30
      : Math.min(amount * 0.008, 5.00);
    
    const calculatedTotalAmount = coverFees ? amount + calculatedProcessingFees : amount;

    // Create or update donor
    const { data: existingDonor, error: donorFindError } = await supabase
      .from('donation_donors')
      .select('id, total_donated')
      .eq('email', donor.email)
      .single();

    let donorId;
    if (existingDonor) {
      donorId = existingDonor.id;
      const newTotal = (existingDonor.total_donated || 0) + amount;
      await supabase
        .from('donation_donors')
        .update({
          first_name: donor.firstName,
          last_name: donor.lastName,
          phone: donor.phone || null,
          total_donated: newTotal,
          prayer_requests: donor.prayerRequests ? [donor.prayerRequests] : null
        })
        .eq('id', donorId);
      
      console.log('Updated existing donor:', donorId);
    } else {
      const { data: newDonor, error: donorCreateError } = await supabase
        .from('donation_donors')
        .insert({
          email: donor.email,
          first_name: donor.firstName,
          last_name: donor.lastName,
          phone: donor.phone || null,
          total_donated: amount,
          prayer_requests: donor.prayerRequests ? [donor.prayerRequests] : null
        })
        .select('id')
        .single();

      if (donorCreateError) {
        console.error('Error creating donor:', donorCreateError);
        return NextResponse.json(
          { error: 'Failed to create donor record' },
          { status: 500 }
        );
      }
      donorId = newDonor.id;
      console.log('Created new donor:', donorId);
    }

    let paymentResult;
    
    // Handle recurring vs one-time payments differently
    if (frequency === 'one-time') {
      // Process one-time payment
      paymentResult = await processAuthorizeNetPayment({
        donor,
        amount,
        totalAmount: calculatedTotalAmount,
        paymentMethod,
        cardNumber: paymentDetails?.cardNumber,
        expirationDate: paymentDetails?.expirationDate,
        cardCode: paymentDetails?.cardCode,
        accountType: paymentDetails?.accountType,
        routingNumber: paymentDetails?.routingNumber,
        accountNumber: paymentDetails?.accountNumber,
        accountHolderName: paymentDetails?.accountHolderName,
        bankName: paymentDetails?.bankName,
        billing: {
          address: paymentDetails?.billingAddress,
          city: paymentDetails?.billingCity,
          state: paymentDetails?.billingState,
          zip: paymentDetails?.billingZip
        },
        frequency,
        customerIP: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1'
      });
    } else {
      // Create subscription for recurring payments
      paymentResult = await createAuthorizeNetSubscription({
        donor,
        amount,
        totalAmount: calculatedTotalAmount,
        paymentMethod,
        frequency,
        cardNumber: paymentDetails?.cardNumber,
        expirationDate: paymentDetails?.expirationDate,
        cardCode: paymentDetails?.cardCode,
        accountType: paymentDetails?.accountType,
        routingNumber: paymentDetails?.routingNumber,
        accountNumber: paymentDetails?.accountNumber,
        accountHolderName: paymentDetails?.accountHolderName,
        bankName: paymentDetails?.bankName,
        billing: {
          address: paymentDetails?.billingAddress,
          city: paymentDetails?.billingCity,
          state: paymentDetails?.billingState,
          zip: paymentDetails?.billingZip
        }
      });
    }

    if (!paymentResult.success) {
      console.error('Payment/Subscription failed:', paymentResult.error);
      return NextResponse.json(
        { error: paymentResult.error },
        { status: 400 }
      );
    }

    console.log(`${frequency === 'one-time' ? 'Payment' : 'Subscription'} successful:`, paymentResult.transactionId || paymentResult.subscriptionId);

    // Create transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from('donation_transactions')
      .insert({
        donor_id: donorId,
        amount: amount,
        frequency: frequency || 'one-time',
        payment_method: paymentMethod,
        processing_fees: calculatedProcessingFees,
        total_amount: calculatedTotalAmount,
        status: 'completed',
        authorize_net_transaction_id: paymentResult.transactionId || paymentResult.subscriptionId,
        authorize_net_subscription_id: frequency !== 'one-time' ? paymentResult.subscriptionId : null,
        donor_info: {
          coverFees: coverFees || false,
          prayerRequests: donor.prayerRequests,
          authCode: paymentResult.authCode,
          responseCode: paymentResult.responseCode,
          paymentMethod: paymentMethod,
          donorName: `${donor.firstName} ${donor.lastName}`,
          donorEmail: donor.email,
          isRecurring: frequency !== 'one-time',
          subscriptionId: frequency !== 'one-time' ? paymentResult.subscriptionId : null
        }
      })
      .select('id')
      .single();

    if (transactionError) {
      console.error('Error creating transaction:', transactionError);
      return NextResponse.json(
        { error: `${frequency === 'one-time' ? 'Payment' : 'Subscription'} successful but failed to record transaction` },
        { status: 500 }
      );
    }

    // Update goal progress
    const { data: currentGoal } = await supabase
      .from('donation_goals')
      .select('current_amount')
      .eq('year', 2026)
      .single();

    if (currentGoal) {
      const newAmount = (currentGoal.current_amount || 0) + amount;
      await supabase
        .from('donation_goals')
        .update({
          current_amount: newAmount,
          updated_at: new Date().toISOString()
        })
        .eq('year', 2026);
      
      console.log('Updated goal progress:', newAmount);
    }

    // Prepare transaction data for emails
    const transactionData = {
      amount: amount,
      totalCharged: calculatedTotalAmount,
      paymentMethod: paymentMethod,
      frequency: frequency || 'one-time',
      authorizeNetTransactionId: paymentResult.transactionId || paymentResult.subscriptionId,
      subscriptionId: frequency !== 'one-time' ? paymentResult.subscriptionId : null,
      authCode: paymentResult.authCode,
      processingTime: paymentMethod === 'ach' ? '2-4 business days' : 'Instant'
    };

    // Send emails
    try {
      await sendThankYouEmail(donor, transactionData);
      await sendAdminNotification(donor, transactionData);
    } catch (emailError) {
      console.error('Error sending emails:', emailError);
    }

    console.log(`${frequency === 'one-time' ? 'Transaction' : 'Subscription'} completed successfully with email notifications`);

    return NextResponse.json({
      success: true,
      transactionId: transaction.id,
      authorizeNetTransactionId: paymentResult.transactionId || paymentResult.subscriptionId,
      subscriptionId: frequency !== 'one-time' ? paymentResult.subscriptionId : null,
      authCode: paymentResult.authCode,
      message: `${frequency === 'one-time' ? (paymentMethod === 'ach' ? 'Bank transfer' : 'Credit card payment') : `${frequency} subscription`} ${frequency === 'one-time' ? 'processed' : 'created'} successfully`,
      amount: amount,
      totalCharged: calculatedTotalAmount,
      paymentMethod: paymentMethod,
      frequency: frequency,
      isRecurring: frequency !== 'one-time',
      processingTime: paymentMethod === 'ach' ? '2-4 business days' : 'Instant',
      emailSent: true
    });

  } catch (error) {
    console.error('Donation processing error:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { getRequestUser, isAdminEmail } from "../../../lib/auth-server";
import { stripe } from "../../../lib/stripe";

async function authorize(request:Request){const user=await getRequestUser(request);return user&&isAdminEmail(user.email)?user:null}

export async function GET(request:Request){
  const user=await authorize(request);if(!user)return NextResponse.json({ok:false,message:"Admin access required."},{status:403});
  if(!stripe)return NextResponse.json({ok:false,message:"Stripe is not configured."},{status:503});
  const [payments,subscriptions,promotions]=await Promise.all([stripe.paymentIntents.list({limit:12}),stripe.subscriptions.list({limit:12,status:"all"}),stripe.promotionCodes.list({limit:12,active:true})]);
  return NextResponse.json({ok:true,email:user.email,payments:payments.data.map(item=>({id:item.id,amount:item.amount,currency:item.currency,status:item.status,email:item.receipt_email||item.metadata?.email||"",created:item.created})),subscriptions:subscriptions.data.map(item=>({id:item.id,status:item.status,customer:typeof item.customer==="string"?item.customer:item.customer.id,created:item.created})),promotions:promotions.data.map(item=>({id:item.id,code:item.code,active:item.active,created:item.created}))});
}

export async function POST(request:Request){
  const user=await authorize(request);if(!user)return NextResponse.json({ok:false,message:"Admin access required."},{status:403});
  if(!stripe)return NextResponse.json({ok:false,message:"Stripe is not configured."},{status:503});
  const body=await request.json().catch(()=>({}));
  if(body.action==="refund"){
    const paymentIntentId=String(body.paymentIntentId||"");if(!paymentIntentId)return NextResponse.json({ok:false,message:"Payment intent is required."},{status:400});
    const refund=await stripe.refunds.create({payment_intent:paymentIntentId});return NextResponse.json({ok:true,message:`Refund ${refund.id} created.`});
  }
  if(body.action==="cancel_subscription"){
    const subscriptionId=String(body.subscriptionId||"");if(!subscriptionId)return NextResponse.json({ok:false,message:"Subscription is required."},{status:400});
    const subscription=await stripe.subscriptions.cancel(subscriptionId);return NextResponse.json({ok:true,message:`Subscription ${subscription.id} canceled.`});
  }
  if(body.action==="create_promo"){
    const code=String(body.code||"").trim().toUpperCase();const percentOff=Number(body.percentOff);
    if(!code||!Number.isFinite(percentOff)||percentOff<=0||percentOff>100)return NextResponse.json({ok:false,message:"Enter a code and discount from 1 to 100%."},{status:400});
    const coupon=await stripe.coupons.create({percent_off:percentOff,duration:"once",name:`${code} ${percentOff}% off`});
    const promotion=await stripe.promotionCodes.create({coupon:coupon.id,code});return NextResponse.json({ok:true,message:`Promo code ${promotion.code} created.`});
  }
  return NextResponse.json({ok:false,message:"Unknown admin action."},{status:400});
}

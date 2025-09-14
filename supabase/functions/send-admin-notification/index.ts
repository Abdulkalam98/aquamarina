import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderNotificationRequest {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  products: Array<{
    name: string;
    quantity: number;
    size: string;
    price: number;
  }>;
  totalCost: number;
  deliveryAddress: string;
  deliveryDate?: string;
  deliveryTime?: string;
  specialInstructions?: string;
  serviceType: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const orderData: OrderNotificationRequest = await req.json();

    console.log("Processing order notification:", orderData);

    // Format products list for email
    const productsList = orderData.products.map(
      product => `• ${product.quantity} × ${product.size} - ₹${product.price * product.quantity}`
    ).join('\n');

    // Send email notification to admin
    const emailResponse = await resend.emails.send({
      from: "Aqua Marina Orders <onboarding@resend.dev>",
      to: ["abdulkalam081998@gmail.com"],
      subject: `New Order #${orderData.orderId} - ₹${orderData.totalCost}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
            🆕 New Water Delivery Order
          </h1>
          
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #374151; margin-top: 0;">Order Details</h2>
            <p><strong>Order ID:</strong> ${orderData.orderId}</p>
            <p><strong>Service Type:</strong> ${orderData.serviceType}</p>
            <p><strong>Total Amount:</strong> ₹${orderData.totalCost}</p>
          </div>

          <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #374151; margin-top: 0;">Customer Information</h2>
            <p><strong>Name:</strong> ${orderData.customerName}</p>
            <p><strong>Phone:</strong> ${orderData.customerPhone}</p>
            ${orderData.customerEmail ? `<p><strong>Email:</strong> ${orderData.customerEmail}</p>` : ''}
          </div>

          <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #374151; margin-top: 0;">Products Ordered</h2>
            <pre style="font-family: Arial, sans-serif; background: white; padding: 10px; border-radius: 4px; border-left: 4px solid #10b981;">${productsList}</pre>
          </div>

          <div style="background-color: #fefce8; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #374151; margin-top: 0;">Delivery Information</h2>
            <p><strong>Address:</strong> ${orderData.deliveryAddress}</p>
            ${orderData.deliveryDate ? `<p><strong>Delivery Date:</strong> ${orderData.deliveryDate}</p>` : ''}
            ${orderData.deliveryTime ? `<p><strong>Delivery Time:</strong> ${orderData.deliveryTime}</p>` : ''}
            ${orderData.specialInstructions ? `<p><strong>Special Instructions:</strong> ${orderData.specialInstructions}</p>` : ''}
          </div>

          <div style="background-color: #1e40af; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <p style="margin: 0; font-size: 16px;">
              📞 Contact customer: <strong>${orderData.customerPhone}</strong>
            </p>
            <p style="margin: 5px 0 0 0; font-size: 14px;">
              💬 <a href="https://wa.me/91${orderData.customerPhone.replace(/[^0-9]/g, '')}?text=Hi ${orderData.customerName}, your Aqua Marina order #${orderData.orderId} has been received. We will deliver it soon!" 
                 style="color: #60a5fa; text-decoration: none;">Send WhatsApp Message</a>
            </p>
          </div>

          <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 30px;">
            This notification was sent automatically by Aqua Marina Order System
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true,
      emailResponse 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-admin-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
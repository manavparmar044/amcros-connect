import { collection, getDocs, query, where, getFirestore, orderBy, limit } from "firebase/firestore";

export const getChatResponse = async (userMessage, email) => {
  try {
    const db = getFirestore();
    const trimmedMsg = userMessage.toLowerCase().trim();

    if (!email) return "Please provide a valid email to check your orders.";

    const q = query(
      collection(db, "orders"),
      where("email", "==", email),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const snapshot = await getDocs(q);
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const greetings = ["hi", "hello", "hey", "thanks", "thank you"];
const isGreeting = greetings.includes(userMessage.toLowerCase().trim());

if (isGreeting) {
  return "Hi there! 👋 How can I help you with your orders today?";
}

    if (orders.length === 0) {
      return "You don’t seem to have any recent orders with us.";
    }

    // Rule-based logic
    if (trimmedMsg.includes("status")) {
      const latest = orders[0];
      return `Your most recent order placed on ${latest.createdAt.toDate().toLocaleDateString()} is currently '${latest.status}'.`;
    }

    if (trimmedMsg.includes("cancel")) {
      const cancellable = orders.find(order => order.status === "pending");
      return cancellable
        ? `You can still cancel order ID ${cancellable.id}. Please confirm with our support team.`
        : "No cancellable orders found at the moment.";
    }

    if (trimmedMsg.includes("recent") || trimmedMsg.includes("orders")) {
      return orders.map(order => {
        return `🧦 Order on ${order.createdAt.toDate().toLocaleDateString()} - ₹${order.totalAmount} - Status: ${order.status}`;
      }).join("\n");
    }

    return "I didn’t fully understand your request. Try asking about your order status or recent orders!";
  } catch (err) {
    console.error("Chatbot error:", err);
    return "Oops, something went wrong while fetching your orders.";
  }
};


// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { collection, getDocs, query, where, getFirestore } from "firebase/firestore";
// import api from "../constants/api";

// const genAI = new GoogleGenerativeAI(api.GEMINI_API_KEY);

// export const getChatResponse = async (userMessage, email) => {
//   try {
//     let orderHistory = "";

//     if (email) {
//       const q = query(collection(getFirestore(), "orders"), where("email", "==", email));
//       const snapshot = await getDocs(q);
//       const orders = snapshot.docs.map(doc => doc.data());
//       orderHistory = JSON.stringify(orders.slice(-3), null, 2);
//     }

//     const prompt = `
// You are a helpful assistant for Amcros Hitex Pvt Ltd, a socks manufacturing company.
// Your job is to answer customer queries based on their past orders.

// Recent Orders:
// ${orderHistory}

// Answer this user question in a helpful and friendly tone:
// "${userMessage}"
//     `;

//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
//     const result = await model.generateContent(prompt);
//     return await result.response.text();
//   } catch (err) {
//     console.error("Gemini chatbot error:", err);
//     return "Sorry, I'm having trouble answering that right now.";
//   }
// };

